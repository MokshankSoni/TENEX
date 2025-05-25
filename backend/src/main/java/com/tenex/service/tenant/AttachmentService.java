package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.AttachmentDTO;
import com.tenex.entity.tenant.Attachment;
import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.Comment;
import com.tenex.repository.tenant.AttachmentRepository;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.repository.tenant.CommentRepository;
import com.tenex.security.services.UserDetailsImpl;
import com.tenex.exception.ResourceNotFoundException;
import com.tenex.exception.ValidationException;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.errors.MinioException;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AttachmentService {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentService.class);

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucketName}")
    private String bucketName;

    @Value("${minio.presignedUrlExpiryMinutes}")
    private int presignedUrlExpiryMinutes;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user found.");
        }
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return userDetails.getId();
        } catch (ClassCastException e) {
            logger.error("Authentication principal is not UserDetailsImpl", e);
            throw new IllegalStateException("Invalid authentication principal type");
        }
    }

    public void ensureBucketExists() {
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                logger.info("MinIO bucket '{}' created successfully", bucketName);
            }
        } catch (Exception e) {
            logger.error("Error ensuring MinIO bucket exists", e);
            throw new RuntimeException("Failed to ensure MinIO bucket exists", e);
        }
    }

    @Transactional("tenantTransactionManager")
    public AttachmentDTO uploadAttachment(MultipartFile file, Long taskId, Long commentId) {
        if (file.isEmpty()) {
            throw new ValidationException("Cannot upload empty file");
        }
        if (taskId == null && commentId == null) {
            throw new ValidationException("Attachment must be associated with either a task or a comment");
        }

        String currentTenant = TenantContext.getCurrentTenant();
        Long uploadedByUserId = getCurrentUserId();

        String fileExtension = getFileExtension(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);

        String objectKeyPath = currentTenant + "/";
        if (taskId != null) {
            objectKeyPath += "tasks/" + taskId + "/";
        } else if (commentId != null) {
            objectKeyPath += "comments/" + commentId + "/";
        }
        objectKeyPath += uniqueFileName;

        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKeyPath)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            logger.info("File '{}' uploaded to MinIO as '{}' for tenant '{}'", file.getOriginalFilename(),
                    objectKeyPath, currentTenant);

            Attachment attachment = new Attachment();

            // Set task or comment entity (unidirectional relationship)
            if (taskId != null) {
                Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
                attachment.setTask(task);
            }
            if (commentId != null) {
                Comment comment = commentRepository.findById(commentId)
                        .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));
                attachment.setComment(comment);
            }

            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileUrl(objectKeyPath); // Store the MinIO object key in fileUrl field
            attachment.setFileSize(file.getSize());
            attachment.setUploadedBy(uploadedByUserId);
            attachment.setUploadedAt(LocalDateTime.now());

            Attachment savedAttachment = attachmentRepository.save(attachment);
            return convertToDTO(savedAttachment);

        } catch (Exception e) {
            logger.error("Error uploading file to MinIO", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public AttachmentDTO getAttachmentWithDownloadUrl(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with ID: " + attachmentId));

        String currentTenant = TenantContext.getCurrentTenant();
        if (!attachment.getFileUrl().startsWith(currentTenant + "/")) {
            logger.warn("Attempt to access attachment {} with key {} by unauthorized tenant {}",
                    attachmentId, attachment.getFileUrl(), currentTenant);
            throw new ResourceNotFoundException("Attachment not found with ID: " + attachmentId);
        }

        try {
            String presignedUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(attachment.getFileUrl())
                            .expiry(presignedUrlExpiryMinutes, TimeUnit.MINUTES)
                            .build());

            AttachmentDTO dto = convertToDTO(attachment);
            dto.setDownloadUrl(presignedUrl);
            return dto;

        } catch (Exception e) {
            logger.error("Error generating presigned URL for attachment {}", attachmentId, e);
            throw new RuntimeException("Failed to generate download URL", e);
        }
    }

    @Transactional("tenantTransactionManager")
    public void deleteAttachment(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with ID: " + attachmentId));

        String currentTenant = TenantContext.getCurrentTenant();
        if (!attachment.getFileUrl().startsWith(currentTenant + "/")) {
            logger.warn("Attempt to delete attachment {} with key {} by unauthorized tenant {}",
                    attachmentId, attachment.getFileUrl(), currentTenant);
            throw new ResourceNotFoundException("Attachment not found with ID: " + attachmentId);
        }

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(attachment.getFileUrl())
                            .build());

            logger.info("File '{}' deleted from MinIO for tenant '{}'", attachment.getFileUrl(), currentTenant);
            attachmentRepository.delete(attachment);
            logger.info("Attachment metadata for ID {} deleted from database for tenant {}", attachmentId,
                    currentTenant);

        } catch (Exception e) {
            logger.error("Error deleting attachment {}", attachmentId, e);
            throw new RuntimeException("Failed to delete attachment", e);
        }
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<AttachmentDTO> getAttachmentById(Long attachmentId) {
        Optional<Attachment> attachment = attachmentRepository.findById(attachmentId);
        if (attachment.isPresent()) {
            String currentTenant = TenantContext.getCurrentTenant();
            if (!attachment.get().getFileUrl().startsWith(currentTenant + "/")) {
                return Optional.empty();
            }
            return Optional.of(convertToDTO(attachment.get()));
        }
        return Optional.empty();
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1 || dotIndex == filename.length() - 1) ? "" : filename.substring(dotIndex + 1);
    }

    private AttachmentDTO convertToDTO(Attachment attachment) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setId(attachment.getId());
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setFileUrl(attachment.getFileUrl());
        dto.setFileSize(attachment.getFileSize());
        dto.setUploadedBy(attachment.getUploadedBy());
        dto.setUploadedAt(attachment.getUploadedAt());

        if (attachment.getTask() != null) {
            dto.setTaskId(attachment.getTask().getId());
        }
        if (attachment.getComment() != null) {
            dto.setCommentId(attachment.getComment().getId());
        }

        return dto;
    }
}

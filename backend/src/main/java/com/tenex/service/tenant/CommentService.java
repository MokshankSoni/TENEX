package com.tenex.service.tenant;

import com.tenex.dto.tenant.CommentDTO;
import com.tenex.entity.tenant.Comment;
import com.tenex.entity.tenant.Task;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.tenant.CommentRepository;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.security.services.UserDetailsImpl;
import com.tenex.security.tenant.CommentAuthorizationService;
import com.tenex.util.ActivityLogUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ActivityLogUtil activityLogUtil;

    @Autowired
    private CommentAuthorizationService authorizationService;

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<CommentDTO> getAllComments() {
        if (!authorizationService.canGetAllComments()) {
            throw new AccessDeniedException("You don't have permission to view all comments");
        }

        logger.info("Fetching all comments");
        return commentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<CommentDTO> getCommentById(Long id) {
        if (!authorizationService.canGetCommentById()) {
            throw new AccessDeniedException("You don't have permission to view this comment");
        }

        logger.info("Fetching comment with ID: {}", id);
        return commentRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        if (!authorizationService.canGetCommentsByTaskId(taskId)) {
            throw new AccessDeniedException("You don't have permission to view comments for this task");
        }

        return commentRepository.findByTaskId(taskId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<CommentDTO> getCommentsByProjectId(Long projectId) {
        if (!authorizationService.canGetCommentsByProjectId(projectId)) {
            throw new AccessDeniedException("You don't have permission to view comments for this project");
        }

        logger.info("Fetching comments for project ID: {}", projectId);
        return commentRepository.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(value = "tenantTransactionManager")
    public CommentDTO createComment(Long taskId, String content) {
        if (!authorizationService.canCreateComment()) {
            throw new AccessDeniedException("You don't have permission to create comments");
        }

        logger.info("Starting comment creation for task ID: {}", taskId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> {
                    logger.error("Task not found with ID: {}", taskId);
                    return new RuntimeException("Task not found");
                });
        logger.info("Found task with ID: {}", taskId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("User not authenticated");
            throw new RuntimeException("User not authenticated");
        }
        logger.info("User authenticated: {}", authentication.getName());

        // Get user ID from UserDetailsImpl
        Long userId = null;
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userId = userDetails.getId();
        } else {
            logger.error("Unexpected principal type: {}", authentication.getPrincipal().getClass().getName());
            throw new RuntimeException("Unexpected principal type");
        }

        if (userId == null) {
            logger.error("User ID not found in authentication context");
            throw new RuntimeException("User ID not found in authentication context");
        }
        logger.info("Found user ID: {}", userId);

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUserId(userId);
        comment.setTask(task);

        try {
            Comment savedComment = commentRepository.save(comment);
            logger.info("Successfully created comment with ID: {}", savedComment.getId());

            // Log activity
            activityLogUtil.logActivity(ActivityAction.CREATE_COMMENT, "Comment", savedComment.getId());

            return convertToDTO(savedComment);
        } catch (Exception e) {
            logger.error("Failed to save comment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save comment", e);
        }
    }

    @Transactional(value = "tenantTransactionManager")
    public CommentDTO updateComment(Long commentId, String content) {
        if (!authorizationService.canUpdateComment()) {
            throw new AccessDeniedException("You don't have permission to update comments");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);

        // Log activity
        activityLogUtil.logActivity(ActivityAction.UPDATE_COMMENT, "Comment", updatedComment.getId());

        return convertToDTO(updatedComment);
    }

    @Transactional(value = "tenantTransactionManager")
    public void deleteComment(Long commentId) {
        if (!authorizationService.canDeleteComment()) {
            throw new AccessDeniedException("You don't have permission to delete comments");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Log activity before deletion
        activityLogUtil.logActivity(ActivityAction.DELETE_COMMENT, "Comment", commentId);

        commentRepository.deleteById(commentId);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getUserId(),
                comment.getTask().getId(),
                comment.getCreatedAt(),
                comment.getUpdatedAt());
    }
}
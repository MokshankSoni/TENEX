package com.tenex.controller.tenant;

import com.tenex.dto.tenant.AttachmentDTO;
import com.tenex.service.tenant.AttachmentService;
import com.tenex.exception.ResourceNotFoundException;
import com.tenex.exception.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @PostMapping("/upload")
    public ResponseEntity<AttachmentDTO> uploadAttachment(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "taskId", required = false) Long taskId,
            @RequestParam(value = "commentId", required = false) Long commentId) {
        try {
            AttachmentDTO attachment = attachmentService.uploadAttachment(file, taskId, commentId);
            return ResponseEntity.ok(attachment);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{attachmentId}")
    public ResponseEntity<AttachmentDTO> getAttachment(@PathVariable Long attachmentId) {
        Optional<AttachmentDTO> attachment = attachmentService.getAttachmentById(attachmentId);
        return attachment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<InputStreamResource> downloadAttachment(@PathVariable Long attachmentId) {
        try {
            AttachmentDTO attachment = attachmentService.getAttachmentById(attachmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with ID: " + attachmentId));

            InputStream fileStream = attachmentService.getAttachmentStream(attachmentId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(attachment.getFileType()));
            headers.setContentDispositionFormData("attachment", attachment.getFileName());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        try {
            attachmentService.deleteAttachment(attachmentId);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
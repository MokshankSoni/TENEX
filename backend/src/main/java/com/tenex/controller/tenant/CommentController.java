package com.tenex.controller.tenant;

import com.tenex.dto.tenant.CommentDTO;
import com.tenex.service.tenant.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        logger.info("Getting all comments");
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        logger.info("Getting comment with ID: {}", id);
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTaskId(@PathVariable Long taskId) {
        logger.info("Getting comments for task ID: {}", taskId);
        return ResponseEntity.ok(commentService.getCommentsByTaskId(taskId));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> request) {
        String content = request.get("content");
        logger.info("Creating comment for task ID: {} with content: {}", taskId, content);
        try {
            CommentDTO createdComment = commentService.createComment(taskId, content);
            logger.info("Successfully created comment with ID: {}", createdComment.getId());
            return ResponseEntity.ok(createdComment);
        } catch (Exception e) {
            logger.error("Failed to create comment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request) {
        String content = request.get("content");
        logger.info("Updating comment ID: {} with content: {}", commentId, content);
        try {
            CommentDTO updatedComment = commentService.updateComment(commentId, content);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            logger.error("Failed to update comment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        logger.info("Deleting comment ID: {}", commentId);
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to delete comment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}
package com.tenex.controller.tenant;

import com.tenex.dto.tenant.UserProjectAssignmentDTO;
import com.tenex.security.services.UserDetailsImpl;
import com.tenex.service.tenant.UserProjectAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserProjectAssignmentController {

    @Autowired
    private UserProjectAssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<UserProjectAssignmentDTO> createAssignment(
            @RequestBody UserProjectAssignmentDTO assignmentDTO) {
        return ResponseEntity.ok(assignmentService.createAssignment(assignmentDTO));
    }

    @PutMapping
    public ResponseEntity<UserProjectAssignmentDTO> updateAssignment(
            @RequestBody UserProjectAssignmentDTO assignmentDTO) {
        return ResponseEntity.ok(assignmentService.updateAssignment(assignmentDTO));
    }

    @DeleteMapping("/{username}/{projectId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable String username, @PathVariable Long projectId) {
        assignmentService.deleteAssignment(username, projectId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{username}/{projectId}")
    public ResponseEntity<UserProjectAssignmentDTO> getAssignment(@PathVariable String username,
            @PathVariable Long projectId) {
        return ResponseEntity.ok(assignmentService.getAssignment(username, projectId));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<UserProjectAssignmentDTO>> getAssignmentsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByUsername(username));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<UserProjectAssignmentDTO>> getAssignmentsByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByProjectId(projectId));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserProjectAssignmentDTO>> getAssignmentsByRole(@PathVariable String role) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByRole(role));
    }

    @GetMapping("/my-assignments")
    public ResponseEntity<List<UserProjectAssignmentDTO>> getMyAssignments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(assignmentService.getAssignmentsByUsername(userDetails.getUsername()));
    }
}
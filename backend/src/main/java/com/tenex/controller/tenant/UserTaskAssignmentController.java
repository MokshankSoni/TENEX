package com.tenex.controller.tenant;

import com.tenex.dto.tenant.UserTaskAssignmentDTO;
import com.tenex.service.tenant.UserTaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-assignments")
public class UserTaskAssignmentController {

    @Autowired
    private UserTaskAssignmentService userTaskAssignmentService;

    @PostMapping
    public ResponseEntity<UserTaskAssignmentDTO> createAssignment(@RequestBody UserTaskAssignmentDTO assignmentDTO) {
        return ResponseEntity.ok(userTaskAssignmentService.createAssignment(assignmentDTO));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<UserTaskAssignmentDTO>> getAssignmentsByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(userTaskAssignmentService.getAssignmentsByTaskId(taskId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserTaskAssignmentDTO>> getAssignmentsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userTaskAssignmentService.getAssignmentsByUserId(userId));
    }

    @DeleteMapping("/{taskId}/user/{username}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long taskId, @PathVariable String username) {
        userTaskAssignmentService.deleteAssignment(taskId, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<UserTaskAssignmentDTO>> getMyAssignedTasks() {
        return ResponseEntity.ok(userTaskAssignmentService.getTasksAssignedToCurrentUser());
    }
}
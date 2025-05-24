package com.tenex.controller.tenant;

import com.tenex.dto.tenant.TaskChecklistDTO;
import com.tenex.service.tenant.TaskChecklistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-checklists")
public class TaskChecklistController {

    private static final Logger logger = LoggerFactory.getLogger(TaskChecklistController.class);

    private final TaskChecklistService taskChecklistService;

    @Autowired
    public TaskChecklistController(TaskChecklistService taskChecklistService) {
        this.taskChecklistService = taskChecklistService;
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskChecklistDTO>> getChecklistsByTaskId(@PathVariable Long taskId) {
        logger.info("Received request to get checklists for task ID: {}", taskId);
        return ResponseEntity.ok(taskChecklistService.getChecklistsByTaskId(taskId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskChecklistDTO> getChecklistById(@PathVariable Long id) {
        logger.info("Received request to get checklist with ID: {}", id);
        return taskChecklistService.getChecklistById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskChecklistDTO> createChecklist(@RequestBody TaskChecklistDTO dto) {
        logger.info("Received request to create new checklist for task ID: {}", dto.getTaskId());
        return ResponseEntity.ok(taskChecklistService.createChecklist(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskChecklistDTO> updateChecklist(
            @PathVariable Long id,
            @RequestBody TaskChecklistDTO dto) {
        logger.info("Received request to update checklist with ID: {}", id);
        return ResponseEntity.ok(taskChecklistService.updateChecklist(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChecklist(@PathVariable Long id) {
        logger.info("Received request to delete checklist with ID: {}", id);
        if (taskChecklistService.deleteChecklist(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/togglestatus")
    public ResponseEntity<TaskChecklistDTO> toggleChecklistStatus(@PathVariable Long id) {
        logger.info("Received request to toggle completed status for checklist ID: {}", id);
        return ResponseEntity.ok(taskChecklistService.toggleChecklistStatus(id));
    }
}
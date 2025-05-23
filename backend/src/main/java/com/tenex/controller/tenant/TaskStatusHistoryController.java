package com.tenex.controller.tenant;

import com.tenex.dto.tenant.TaskStatusHistoryDTO;
import com.tenex.service.tenant.TaskStatusHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-status-history")
public class TaskStatusHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(TaskStatusHistoryController.class);

    private final TaskStatusHistoryService taskStatusHistoryService;

    @Autowired
    public TaskStatusHistoryController(TaskStatusHistoryService taskStatusHistoryService) {
        this.taskStatusHistoryService = taskStatusHistoryService;
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskStatusHistoryDTO>> getStatusHistoryByTaskId(@PathVariable Long taskId) {
        logger.info("Received request to get status history for task ID: {}", taskId);
        return ResponseEntity.ok(taskStatusHistoryService.getStatusHistoryByTaskId(taskId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskStatusHistoryDTO> getStatusHistoryById(@PathVariable Long id) {
        logger.info("Received request to get status history with ID: {}", id);
        return taskStatusHistoryService.getStatusHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskStatusHistoryDTO> createStatusHistory(@RequestBody TaskStatusHistoryDTO dto) {
        logger.info("Received request to create new status history for task ID: {}", dto.getTaskId());
        return ResponseEntity.ok(taskStatusHistoryService.createStatusHistory(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatusHistory(@PathVariable Long id) {
        logger.info("Received request to delete status history with ID: {}", id);
        if (taskStatusHistoryService.deleteStatusHistory(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
package com.tenex.controller.tenant;

import com.tenex.entity.tenant.Task;
import com.tenex.service.tenant.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/api/tasks", headers = "X-TenantID")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        logger.info("Request to get all tasks");
        try {
            return ResponseEntity.ok(taskService.getAllTasks());
        } catch (Exception e) {
            logger.error("Error fetching tasks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        logger.info("Request to get task with ID: {}", id);
        try {
            return taskService.getTaskById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching task with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        logger.info("Request to create new task");
        try {
            Task createdTask = taskService.createTask(task);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid task data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        logger.info("Request to update task with ID: {}", id);
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid task data or task not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating task with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        logger.info("Request to delete task with ID: {}", id);
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.error("Task not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting task with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        logger.info("Request to get tasks for project ID: {}", projectId);
        try {
            return ResponseEntity.ok(taskService.getTasksByProject(projectId));
        } catch (Exception e) {
            logger.error("Error fetching tasks for project ID: {}", projectId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignee/{userId}")
    public ResponseEntity<List<Task>> getTasksByAssignee(@PathVariable Long userId) {
        logger.info("Request to get tasks assigned to user ID: {}", userId);
        try {
            return ResponseEntity.ok(taskService.getTasksByAssignee(userId));
        } catch (Exception e) {
            logger.error("Error fetching tasks for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable String status) {
        logger.info("Request to get tasks with status: {}", status);
        try {
            return ResponseEntity.ok(taskService.getTasksByStatus(status));
        } catch (Exception e) {
            logger.error("Error fetching tasks with status: {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/due-before")
    public ResponseEntity<List<Task>> getTasksDueBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        logger.info("Request to get tasks due before: {}", date);
        try {
            return ResponseEntity.ok(taskService.getTasksByDueDate(date));
        } catch (Exception e) {
            logger.error("Error fetching tasks due before: {}", date, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasksByTitle(@RequestParam String title) {
        logger.info("Request to search tasks with title containing: {}", title);
        try {
            return ResponseEntity.ok(taskService.searchTasksByTitle(title));
        } catch (Exception e) {
            logger.error("Error searching tasks with title: {}", title, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Task>> getTasksByCreator(@PathVariable Long userId) {
        logger.info("Request to get tasks created by user ID: {}", userId);
        try {
            return ResponseEntity.ok(taskService.getTasksByCreator(userId));
        } catch (Exception e) {
            logger.error("Error fetching tasks created by user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        logger.info("Request to get tasks with priority: {}", priority);
        try {
            return ResponseEntity.ok(taskService.getTasksByPriority(priority));
        } catch (Exception e) {
            logger.error("Error fetching tasks with priority: {}", priority, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

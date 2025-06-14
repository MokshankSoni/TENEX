package com.tenex.controller.tenant;

import com.tenex.entity.tenant.ActivityLog;
import com.tenex.service.tenant.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @Autowired
    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @PostMapping
    public ResponseEntity<ActivityLog> createActivityLog(@RequestBody ActivityLog activityLog) {
        return ResponseEntity.ok(activityLogService.createActivityLog(activityLog));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityLog> getActivityLogById(@PathVariable Long id) {
        return ResponseEntity.ok(activityLogService.getActivityLogById(id));
    }

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAllActivityLogs() {
        return ResponseEntity.ok(activityLogService.getAllActivityLogs());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByUserId(userId));
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByAction(action));
    }

    @GetMapping("/entity")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByEntity(
            @RequestParam String entityType,
            @RequestParam Long entityId) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByEntityTypeAndEntityId(entityType, entityId));
    }

    @GetMapping("/time-range")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByTimeRange(start, end));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLog>> getRecentActivityLogs(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(activityLogService.getRecentActivityLogs(limit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivityLog(@PathVariable Long id) {
        activityLogService.deleteActivityLog(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/oldest")
    public ResponseEntity<Void> deleteOldestActivityLogs() {
        activityLogService.deleteOldestActivityLogs(20);
        return ResponseEntity.noContent().build();
    }
}
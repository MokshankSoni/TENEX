package com.tenex.service.tenant;

import com.tenex.entity.tenant.ActivityLog;
import com.tenex.repository.tenant.ActivityLogRepository;
import com.tenex.security.tenant.ActivityLogAuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogAuthorizationService authorizationService;

    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository,
            ActivityLogAuthorizationService authorizationService) {
        this.activityLogRepository = activityLogRepository;
        this.authorizationService = authorizationService;
    }

    @Transactional(value = "tenantTransactionManager")
    public ActivityLog createActivityLog(ActivityLog activityLog) {
        return activityLogRepository.save(activityLog);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public ActivityLog getActivityLogById(Long id) {
        if (!authorizationService.canGetActivityLogById()) {
            throw new AccessDeniedException("You don't have permission to view this activity log");
        }

        return activityLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity log not found with id: " + id));
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getAllActivityLogs() {
        if (!authorizationService.canGetAllActivityLogs()) {
            throw new AccessDeniedException("You don't have permission to view all activity logs");
        }

        return activityLogRepository.findAll();
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByUserId(Long userId) {
        if (!authorizationService.canGetActivityLogsByUser()) {
            throw new AccessDeniedException("You don't have permission to view activity logs by user");
        }

        return activityLogRepository.findByUserId(userId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByAction(String action) {
        if (!authorizationService.canGetActivityLogsByAction()) {
            throw new AccessDeniedException("You don't have permission to view activity logs by action");
        }

        return activityLogRepository.findByAction(action);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByEntityTypeAndEntityId(String entityType, Long entityId) {
        if (!authorizationService.canGetActivityLogsByEntity()) {
            throw new AccessDeniedException("You don't have permission to view activity logs by entity");
        }

        return activityLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByTimeRange(LocalDateTime start, LocalDateTime end) {
        if (!authorizationService.canGetActivityLogsByTimeRange()) {
            throw new AccessDeniedException("You don't have permission to view activity logs by time range");
        }

        return activityLogRepository.findByTimestampBetween(start, end);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getRecentActivityLogs(int limit) {
        if (!authorizationService.canGetRecentActivityLogs()) {
            throw new AccessDeniedException("You don't have permission to view recent activity logs");
        }

        return activityLogRepository.findTop50ByOrderByTimestampDesc().stream()
                .limit(limit)
                .toList();
    }

    @Transactional(value = "tenantTransactionManager")
    public void deleteActivityLog(Long id) {
        if (!authorizationService.canDeleteActivityLog()) {
            throw new AccessDeniedException("You don't have permission to delete activity logs");
        }

        if (!activityLogRepository.existsById(id)) {
            throw new RuntimeException("Activity log not found with id: " + id);
        }
        activityLogRepository.deleteById(id);
    }

    @Transactional(value = "tenantTransactionManager")
    public void deleteOldestActivityLogs(int count) {
        if (!authorizationService.canDeleteActivityLog()) {
            throw new AccessDeniedException("You don't have permission to delete activity logs");
        }

        List<ActivityLog> oldestLogs = activityLogRepository.findAll().stream()
                .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                .limit(count)
                .toList();

        oldestLogs.forEach(log -> activityLogRepository.deleteById(log.getId()));
    }
}
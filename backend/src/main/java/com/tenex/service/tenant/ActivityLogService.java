package com.tenex.service.tenant;

import com.tenex.entity.tenant.ActivityLog;
import com.tenex.repository.tenant.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Autowired
    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional(value = "tenantTransactionManager")
    public ActivityLog createActivityLog(ActivityLog activityLog) {
        return activityLogRepository.save(activityLog);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public ActivityLog getActivityLogById(Long id) {
        return activityLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity log not found with id: " + id));
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getAllActivityLogs() {
        return activityLogRepository.findAll();
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByUserId(Long userId) {
        return activityLogRepository.findByUserId(userId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByAction(String action) {
        return activityLogRepository.findByAction(action);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByEntityTypeAndEntityId(String entityType, Long entityId) {
        return activityLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getActivityLogsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return activityLogRepository.findByTimestampBetween(start, end);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ActivityLog> getRecentActivityLogs(int limit) {
        return activityLogRepository.findTop50ByOrderByTimestampDesc().stream()
                .limit(limit)
                .toList();
    }

    @Transactional(value = "tenantTransactionManager")
    public void deleteActivityLog(Long id) {
        if (!activityLogRepository.existsById(id)) {
            throw new RuntimeException("Activity log not found with id: " + id);
        }
        activityLogRepository.deleteById(id);
    }
}
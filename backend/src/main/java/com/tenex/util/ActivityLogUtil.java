package com.tenex.util;

import com.tenex.entity.tenant.ActivityLog;
import com.tenex.enums.ActivityAction;
import com.tenex.service.tenant.ActivityLogService;
import com.tenex.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogUtil {
    private static final Logger logger = LoggerFactory.getLogger(ActivityLogUtil.class);

    private final ActivityLogService activityLogService;

    @Autowired
    public ActivityLogUtil(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    public void logActivity(ActivityAction action, String entityType, Long entityId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Cannot log activity: No authenticated user found");
                return;
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();

            ActivityLog activityLog = new ActivityLog();
            activityLog.setUserId(userId);
            activityLog.setAction(action.name());
            activityLog.setEntityType(entityType);
            activityLog.setEntityId(entityId);

            activityLogService.createActivityLog(activityLog);
            logger.debug("Activity logged: {} for entity {} with ID {}", action, entityType, entityId);
        } catch (Exception e) {
            logger.error("Error logging activity: {}", e.getMessage(), e);
        }
    }
}
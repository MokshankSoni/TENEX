package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.ActivityLog;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserId(Long userId);

    List<ActivityLog> findByAction(String action);

    List<ActivityLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<ActivityLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<ActivityLog> findTop50ByOrderByTimestampDesc();
}
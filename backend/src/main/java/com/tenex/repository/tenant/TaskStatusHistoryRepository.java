package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.TaskStatusHistory;
import com.tenex.entity.tenant.Task;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskStatusHistoryRepository extends JpaRepository<TaskStatusHistory, Long> {

    List<TaskStatusHistory> findByTask(Task task);

    List<TaskStatusHistory> findByTaskId(Long taskId);

    List<TaskStatusHistory> findByChangedBy(Long userId);

    List<TaskStatusHistory> findByNewStatus(String status);

    List<TaskStatusHistory> findByChangedAtBetween(LocalDateTime start, LocalDateTime end);

    List<TaskStatusHistory> findByTaskIdOrderByChangedAtDesc(Long taskId);
}
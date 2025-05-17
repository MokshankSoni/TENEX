package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.Project;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedTo(Long userId);

    List<Task> findByStatus(String status);

    List<Task> findByDueDateBefore(LocalDate date);

    List<Task> findByTitleContainingIgnoreCase(String title);

    List<Task> findByCreatedBy(Long userId);

    List<Task> findByPriority(String priority);
}
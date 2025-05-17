package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.ProjectMilestone;
import com.tenex.entity.tenant.Project;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {

    List<ProjectMilestone> findByProject(Project project);

    List<ProjectMilestone> findByProjectId(Long projectId);

    List<ProjectMilestone> findByCompleted(Boolean completed);

    List<ProjectMilestone> findByDueDateBefore(LocalDate date);

    List<ProjectMilestone> findByProjectIdAndCompleted(Long projectId, Boolean completed);

    List<ProjectMilestone> findByTitleContainingIgnoreCase(String title);
}
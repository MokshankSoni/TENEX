package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.Project;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t " +
            "LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.id = :id")
    Optional<Task> findById(Long id);

    // Existing method, now with a more specific name
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project")
    List<Task> findAllWithProjectBasic();

    //@Query("SELECT t FROM Task t LEFT JOIN FETCH t.project")
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones")
    List<Task> findAllWithProject();

    List<Task> findByProject(Project project);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.project.id = :projectId")
    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.assignedTo = :userId")
    List<Task> findByAssignedTo(Long userId);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.status = :status")
    List<Task> findByStatus(String status);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.dueDate < :date")
    List<Task> findByDueDateBefore(LocalDate date);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Task> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.createdBy = :userId")
    List<Task> findByCreatedBy(Long userId);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project p " +
            "LEFT JOIN FETCH p.tasks " +  // Eagerly fetch Project's tasks as well
            "LEFT JOIN FETCH p.userAssignments " +
            "LEFT JOIN FETCH p.milestones " +
            "WHERE t.priority = :priority")
    List<Task> findByPriority(String priority);
}
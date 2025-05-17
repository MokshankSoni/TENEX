package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.TaskChecklist;
import com.tenex.entity.tenant.Task;

import java.util.List;

@Repository
public interface TaskChecklistRepository extends JpaRepository<TaskChecklist, Long> {

    List<TaskChecklist> findByTask(Task task);

    List<TaskChecklist> findByTaskId(Long taskId);

    List<TaskChecklist> findByCompleted(Boolean completed);

    List<TaskChecklist> findByTaskIdAndCompleted(Long taskId, Boolean completed);

    long countByTaskIdAndCompleted(Long taskId, Boolean completed);
}
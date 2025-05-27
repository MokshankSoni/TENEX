package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.UserTaskAssignment;
import com.tenex.entity.tenant.UserTaskAssignmentId;
import com.tenex.entity.tenant.Task;

import java.util.List;

@Repository
public interface UserTaskAssignmentRepository extends JpaRepository<UserTaskAssignment, UserTaskAssignmentId> {

    List<UserTaskAssignment> findByUserId(Long userId);

    List<UserTaskAssignment> findByTask(Task task);

    List<UserTaskAssignment> findByTaskId(Long taskId);

    void deleteByUserIdAndTask(Long userId, Task task);
}
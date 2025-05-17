package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.UserProjectAssignment;
import com.tenex.entity.tenant.UserProjectAssignmentId;
import com.tenex.entity.tenant.Project;

import java.util.List;

@Repository
public interface UserProjectAssignmentRepository extends JpaRepository<UserProjectAssignment, UserProjectAssignmentId> {

    List<UserProjectAssignment> findByUserId(Long userId);

    List<UserProjectAssignment> findByProject(Project project);

    List<UserProjectAssignment> findByProjectId(Long projectId);

    List<UserProjectAssignment> findByRoleInProject(String role);

    void deleteByUserIdAndProject(Long userId, Project project);
}
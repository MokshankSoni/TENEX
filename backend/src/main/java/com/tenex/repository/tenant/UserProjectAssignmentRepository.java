package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.UserProjectAssignment;
import com.tenex.entity.tenant.UserProjectAssignmentId;
import com.tenex.entity.tenant.Project;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProjectAssignmentRepository extends JpaRepository<UserProjectAssignment, UserProjectAssignmentId> {

    List<UserProjectAssignment> findByUserId(Long userId);

    List<UserProjectAssignment> findByProject(Project project);

    List<UserProjectAssignment> findByProjectId(Long projectId);

    List<UserProjectAssignment> findByRoleInProject(String role);

    @Modifying // Essential for DML operations (INSERT, UPDATE, DELETE)
    @Query("DELETE FROM UserProjectAssignment upa WHERE upa.userId = :userId AND upa.project.id = :projectId")
    void deleteByUserIdAndProjectId(Long userId, Long projectId);

    Optional<UserProjectAssignment> findByProjectIdAndUserId(Long projectId, Long userId);
}
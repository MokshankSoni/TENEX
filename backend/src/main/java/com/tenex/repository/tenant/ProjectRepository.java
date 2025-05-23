package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Project;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

        List<Project> findByTenantId(String tenantId);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.tasks t " +
                        "LEFT JOIN FETCH p.userAssignments ua " +
                        "LEFT JOIN FETCH p.milestones m " +
                        "WHERE p.tenantId = :tenantId AND p.status = :status")
        List<Project> findByTenantIdAndStatus(String tenantId, String status);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.tasks t " +
                        "LEFT JOIN FETCH p.userAssignments ua " +
                        "LEFT JOIN FETCH p.milestones m " +
                        "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.tenantId = :tenantId")
        List<Project> findByNameContainingIgnoreCaseAndTenantId(String name, String tenantId);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.tasks t " +
                        "LEFT JOIN FETCH p.userAssignments ua " +
                        "LEFT JOIN FETCH p.milestones m " +
                        "WHERE p.tenantId = :tenantId")
        List<Project> findAllWithTasksByTenantId(String tenantId);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.tasks t " +
                        "LEFT JOIN FETCH p.userAssignments ua " +
                        "LEFT JOIN FETCH p.milestones m " +
                        "WHERE p.id = :id")
        Optional<Project> findByIdWithManual(@Param("id") Long id);

}
package com.tenex.repository.tenant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.tenant.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByTenantId(String tenantId);

    List<Project> findByTenantIdAndStatus(String tenantId, String status);

    List<Project> findByNameContainingIgnoreCaseAndTenantId(String name, String tenantId);
}
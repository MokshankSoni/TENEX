package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.entity.tenant.Project;
import com.tenex.repository.tenant.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Find all projects for the current tenant
     *
     * @return List of projects for the current tenant
     */
    public List<Project> findAllProjects() {
        String tenantId = TenantContext.getCurrentTenant();
        return projectRepository.findAllWithTasksByTenantId(tenantId);
    }

    /**
     * Find a project by ID for the current tenant
     *
     * @param id Project ID
     * @return Project if found, empty Optional otherwise
     */
    public Optional<Project> findProjectById(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        Optional<Project> project = projectRepository.findByIdWithManual(id);

        // Ensure the project belongs to the current tenant
        if (project.isPresent() && !project.get().getTenantId().equals(tenantId)) {
            return Optional.empty();
        }

        return project;
    }

    /**
     * Create a new project for the current tenant
     *
     * @param project Project to create
     * @return Created project
     */
    @Transactional("tenantTransactionManager")
    public Project createProject(Project project) {
        String tenantId = TenantContext.getCurrentTenant();
        project.setTenantId(tenantId);
        return projectRepository.save(project);
    }

    /**
     * Update an existing project for the current tenant
     *
     * @param id             Project ID
     * @param projectDetails Updated project details
     * @return Updated project if found and belongs to tenant, empty Optional
     *         otherwise
     */
    @Transactional("tenantTransactionManager")
    public Optional<Project> updateProject(Long id, Project projectDetails) {
        String tenantId = TenantContext.getCurrentTenant();
        Optional<Project> existingProject = projectRepository.findByIdWithManual(id);

        if (existingProject.isPresent() && existingProject.get().getTenantId().equals(tenantId)) {
            Project project = existingProject.get();

            // Update project fields
            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            project.setStatus(projectDetails.getStatus());

            // Don't update tenant ID, created at, or ID

            return Optional.of(projectRepository.save(project));
        }

        return Optional.empty();
    }

    /**
     * Delete a project by ID if it belongs to the current tenant
     *
     * @param id Project ID
     * @return true if deleted, false if not found or not owned by tenant
     */
    @Transactional("tenantTransactionManager")
    public boolean deleteProject(Long id) {
        String tenantId = TenantContext.getCurrentTenant();
        Optional<Project> project = projectRepository.findByIdWithManual(id);

        if (project.isPresent() && project.get().getTenantId().equals(tenantId)) {
            projectRepository.deleteById(id);
            return true;
        }

        return false;
    }

    /**
     * Find projects by status for the current tenant
     *
     * @param status Project status
     * @return List of projects with the specified status
     */
    public List<Project> findProjectsByStatus(String status) {
        String tenantId = TenantContext.getCurrentTenant();
        return projectRepository.findByTenantIdAndStatus(tenantId, status);
    }

    /**
     * Search projects by name for the current tenant
     *
     * @param name Project name (partial match, case insensitive)
     * @return List of matching projects
     */
    public List<Project> searchProjectsByName(String name) {
        String tenantId = TenantContext.getCurrentTenant();
        return projectRepository.findByNameContainingIgnoreCaseAndTenantId(name, tenantId);
    }
}
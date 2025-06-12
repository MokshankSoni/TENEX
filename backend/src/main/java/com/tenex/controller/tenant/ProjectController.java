package com.tenex.controller.tenant;

import com.tenex.dto.tenant.ProjectDTO;
import com.tenex.service.tenant.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * Get all projects for the current tenant
     *
     * @return List of projects
     */
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAllProjects());
    }

    /**
     * Get a project by ID for the current tenant
     *
     * @param id Project ID
     * @return Project if found and belongs to tenant, 404 otherwise
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return projectService.findProjectById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new project for the current tenant
     *
     * @param project Project to create
     * @return Created project with 201 status
     */
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO project) {
        return new ResponseEntity<>(projectService.createProject(project), HttpStatus.CREATED);
    }

    /**
     * Update an existing project for the current tenant
     *
     * @param id             Project ID
     * @param projectDetails Updated project details
     * @return Updated project if found and belongs to tenant, 404 otherwise
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDetails) {
        return projectService.updateProject(id, projectDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Delete a project by ID if it belongs to the current tenant
     *
     * @param id Project ID
     * @return 204 if deleted, 404 if not found or not owned by tenant
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        return projectService.deleteProject(id)
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Find projects by status for the current tenant
     *
     * @param status Project status
     * @return List of projects with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(projectService.findProjectsByStatus(status));
    }

    /**
     * Search projects by name for the current tenant
     *
     * @param name Project name (partial match, case insensitive)
     * @return List of matching projects
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjectsByName(@RequestParam String name) {
        return ResponseEntity.ok(projectService.searchProjectsByName(name));
    }

    /**
     * Update project status
     *
     * @param id     Project ID
     * @param status New project status
     * @return Updated project if found and belongs to tenant, 404 otherwise
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectDTO> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return projectService.updateProjectStatus(id, newStatus)
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
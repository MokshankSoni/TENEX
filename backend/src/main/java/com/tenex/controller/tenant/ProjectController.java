package com.tenex.controller.tenant;

import com.tenex.entity.tenant.Project;
import com.tenex.service.tenant.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Get all projects for the current tenant
     *
     * @return List of projects
     */
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.findAllProjects();
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    /**
     * Get a project by ID for the current tenant
     *
     * @param id Project ID
     * @return Project if found and belongs to tenant, 404 otherwise
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.findProjectById(id);
        return project.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new project for the current tenant
     *
     * @param project Project to create
     * @return Created project with 201 status
     */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    /**
     * Update an existing project for the current tenant
     *
     * @param id Project ID
     * @param projectDetails Updated project details
     * @return Updated project if found and belongs to tenant, 404 otherwise
     */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Optional<Project> updatedProject = projectService.updateProject(id, projectDetails);
        return updatedProject.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
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
        boolean deleted = projectService.deleteProject(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Find projects by status for the current tenant
     *
     * @param status Project status
     * @return List of projects with the specified status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        List<Project> projects = projectService.findProjectsByStatus(status);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    /**
     * Search projects by name for the current tenant
     *
     * @param name Project name (partial match, case insensitive)
     * @return List of matching projects
     */
    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjectsByName(@RequestParam String name) {
        List<Project> projects = projectService.searchProjectsByName(name);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
}
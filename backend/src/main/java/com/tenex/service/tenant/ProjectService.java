package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.*;
import com.tenex.entity.tenant.*;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.repository.tenant.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private UserTenantMappingRepository userTenantMappingRepository;

        /**
         * Find all projects for the current tenant
         *
         * @return List of projects for the current tenant
         */
        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<ProjectDTO> findAllProjects() {
                String tenantId = TenantContext.getCurrentTenant();
                return projectRepository.findAllWithTasksByTenantId(tenantId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Find a project by ID for the current tenant
         *
         * @param id Project ID
         * @return Project if found, empty Optional otherwise
         */
        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public Optional<ProjectDTO> findProjectById(Long id) {
                return projectRepository.findByIdWithManual(id)
                                .map(this::convertToDTO);
        }

        /**
         * Create a new project for the current tenant
         *
         * @param projectDTO Project to create
         * @return Created project
         */
        @Transactional(value = "tenantTransactionManager")
        public ProjectDTO createProject(ProjectDTO projectDTO) {
                Project project = new Project();
                updateProjectFromDTO(project, projectDTO);
                return convertToDTO(projectRepository.save(project));
        }

        /**
         * Update an existing project for the current tenant
         *
         * @param id         Project ID
         * @param projectDTO Updated project details
         * @return Updated project if found and belongs to tenant, empty Optional
         *         otherwise
         */
        @Transactional(value = "tenantTransactionManager")
        public Optional<ProjectDTO> updateProject(Long id, ProjectDTO projectDTO) {
                return projectRepository.findByIdWithManual(id)
                                .map(project -> {
                                        updateProjectFromDTO(project, projectDTO);
                                        return convertToDTO(projectRepository.save(project));
                                });
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
        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<ProjectDTO> findProjectsByStatus(String status) {
                String tenantId = TenantContext.getCurrentTenant();
                return projectRepository.findByTenantIdAndStatus(tenantId, status).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        /**
         * Search projects by name for the current tenant
         *
         * @param name Project name (partial match, case insensitive)
         * @return List of matching projects
         */
        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<ProjectDTO> searchProjectsByName(String name) {
                String tenantId = TenantContext.getCurrentTenant();
                return projectRepository.findByNameContainingIgnoreCaseAndTenantId(name, tenantId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        private void updateProjectFromDTO(Project project, ProjectDTO dto) {
                project.setName(dto.getName());
                project.setDescription(dto.getDescription());
                project.setStatus(dto.getStatus());
                project.setStartDate(dto.getStartDate());
                project.setEndDate(dto.getEndDate());
        }

        private ProjectDTO convertToDTO(Project project) {
                System.out.println("Converting project: " + project.getId() + " to DTO");
                System.out.println("Project details - Name: " + project.getName() + ", Status: " + project.getStatus());

                // Debug tasks
                System.out.println("Tasks collection: " + (project.getTasks() == null ? "null" : "not null"));
                if (project.getTasks() != null) {
                        System.out.println("Tasks size: " + project.getTasks().size());
                        project.getTasks().forEach(task -> System.out
                                        .println("Task - ID: " + task.getId() + ", Title: " + task.getTitle()));
                }

                // Debug assignments
                System.out.println("Assignments collection: "
                                + (project.getUserAssignments() == null ? "null" : "not null"));
                if (project.getUserAssignments() != null) {
                        System.out.println("Assignments size: " + project.getUserAssignments().size());
                        project.getUserAssignments()
                                        .forEach(assignment -> System.out.println("Assignment - UserId: "
                                                        + assignment.getUserId() +
                                                        ", ProjectId: " + assignment.getProject().getId() +
                                                        ", Role: " + assignment.getRoleInProject()));
                }

                List<TaskDTO> taskDTOs = project.getTasks().stream()
                                .map(this::convertToTaskDTO)
                                .collect(Collectors.toList());
                System.out.println("Converted " + taskDTOs.size() + " tasks");

                List<ProjectMilestoneDTO> milestoneDTOs = project.getMilestones().stream()
                                .map(milestone -> new ProjectMilestoneDTO(
                                                milestone.getId(),
                                                milestone.getProject().getId(),
                                                milestone.getTitle(),
                                                milestone.getDescription(),
                                                milestone.getDueDate(),
                                                milestone.getCompleted()))
                                .collect(Collectors.toList());
                System.out.println("Converted " + milestoneDTOs.size() + " milestones");

                List<UserProjectAssignmentDTO> assignmentDTOs = project.getUserAssignments().stream()
                                .map(assignment -> {
                                        System.out.println(
                                                        "Processing assignment for userId: " + assignment.getUserId());
                                        String username = userTenantMappingRepository.findByTenantIdAndUserId(
                                                        TenantContext.getCurrentTenant(),
                                                        assignment.getUserId())
                                                        .map(mapping -> {
                                                                System.out.println("Found mapping for userId: "
                                                                                + assignment.getUserId() +
                                                                                ", username: " + mapping.getUsername());
                                                                return mapping.getUsername();
                                                        })
                                                        .orElseGet(() -> {
                                                                System.out.println("No mapping found for userId: "
                                                                                + assignment.getUserId());
                                                                return "User-" + assignment.getUserId();
                                                        });

                                        return new UserProjectAssignmentDTO(
                                                        username,
                                                        assignment.getProject().getId(),
                                                        assignment.getRoleInProject(),
                                                        assignment.getAssignedAt());
                                })
                                .collect(Collectors.toList());
                System.out.println("Converted " + assignmentDTOs.size() + " assignments");

                return new ProjectDTO(
                                project.getId(),
                                project.getName(),
                                project.getDescription(),
                                project.getStatus(),
                                project.getStartDate(),
                                project.getEndDate(),
                                project.getCreatedAt(),
                                project.getUpdatedAt(),
                                taskDTOs,
                                milestoneDTOs,
                                assignmentDTOs);
        }

        private TaskDTO convertToTaskDTO(Task task) {
                List<CommentDTO> commentDTOs = task.getComments().stream()
                                .map(comment -> new CommentDTO(
                                                comment.getId(),
                                                comment.getContent(),
                                                comment.getUserId(),
                                                comment.getTask().getId(),
                                                comment.getCreatedAt(),
                                                comment.getUpdatedAt()))
                                .collect(Collectors.toList());

                List<TaskStatusHistoryDTO> statusHistoryDTOs = task.getStatusHistory().stream()
                                .map(history -> new TaskStatusHistoryDTO(
                                                history.getId(),
                                                history.getTask().getId(),
                                                history.getOldStatus(),
                                                history.getNewStatus(),
                                                history.getChangedBy(),
                                                history.getChangedAt()))
                                .collect(Collectors.toList());

                List<TaskChecklistDTO> checklistDTOs = task.getChecklists().stream()
                                .map(checklist -> new TaskChecklistDTO(
                                                checklist.getId(),
                                                checklist.getTask().getId(),
                                                checklist.getItem(),
                                                checklist.getCompleted()))
                                .collect(Collectors.toList());

                List<AttachmentDTO> attachmentDTOs = task.getAttachments().stream()
                                .map(attachment -> new AttachmentDTO(
                                                attachment.getId(),
                                                attachment.getTask().getId(),
                                                attachment.getComment() != null ? attachment.getComment().getId()
                                                                : null,
                                                attachment.getFileName(),
                                                attachment.getFileType(),
                                                attachment.getFileSize(),
                                                attachment.getFileUrl(),
                                                attachment.getUploadedBy(),
                                                attachment.getUploadedAt()))
                                .collect(Collectors.toList());

                return new TaskDTO(
                                task.getId(),
                                task.getProject().getId(),
                                task.getTitle(),
                                task.getDescription(),
                                task.getStatus(),
                                task.getPriority(),
                                task.getAssignedTo(),
                                task.getCreatedBy(),
                                task.getEstimatedTime(),
                                task.getDueDate(),
                                task.getCreatedAt(),
                                task.getUpdatedAt(),
                                commentDTOs,
                                statusHistoryDTOs,
                                checklistDTOs,
                                attachmentDTOs);
        }
}
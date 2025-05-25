package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.*;
import com.tenex.entity.tenant.*;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.util.ActivityLogUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {
        private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private UserTenantMappingRepository userTenantMappingRepository;

        @Autowired
        private ActivityLogUtil activityLogUtil;

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
                Project savedProject = projectRepository.save(project);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.CREATE_PROJECT, "Project", savedProject.getId());

                return convertToDTO(savedProject);
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
                                        Project savedProject = projectRepository.save(project);

                                        // Log activity
                                        activityLogUtil.logActivity(ActivityAction.UPDATE_PROJECT, "Project",
                                                        savedProject.getId());

                                        return convertToDTO(savedProject);
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

                        // Log activity
                        activityLogUtil.logActivity(ActivityAction.DELETE_PROJECT, "Project", id);

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
                logger.debug("Converting project: {} to DTO", project.getId());

                List<TaskDTO> taskDTOs = project.getTasks().stream()
                                .map(this::convertToTaskDTO)
                                .collect(Collectors.toList());
                logger.debug("Converted {} tasks", taskDTOs.size());

                List<ProjectMilestoneDTO> milestoneDTOs = project.getMilestones().stream()
                                .map(milestone -> new ProjectMilestoneDTO(
                                                milestone.getId(),
                                                project.getId(),
                                                milestone.getTitle(),
                                                milestone.getDescription(),
                                                milestone.getDueDate(),
                                                milestone.getCompleted()))
                                .collect(Collectors.toList());
                logger.debug("Converted {} milestones", milestoneDTOs.size());

                List<UserProjectAssignmentDTO> assignmentDTOs = project.getUserAssignments().stream()
                                .map(assignment -> {
                                        String username = userTenantMappingRepository.findByTenantIdAndUserId(
                                                        TenantContext.getCurrentTenant(),
                                                        assignment.getUserId())
                                                        .map(mapping -> mapping.getUsername())
                                                        .orElseGet(() -> "User-" + assignment.getUserId());

                                        return new UserProjectAssignmentDTO(
                                                        username,
                                                        project.getId(),
                                                        assignment.getRoleInProject(),
                                                        assignment.getAssignedAt());
                                })
                                .collect(Collectors.toList());
                logger.debug("Converted {} assignments", assignmentDTOs.size());

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
                                                attachment.getFileName(),
                                                attachment.getFileType(),
                                                attachment.getFileUrl(),
                                                attachment.getFileSize(),
                                                attachment.getUploadedBy(),
                                                attachment.getUploadedAt(),
                                                attachment.getTask().getId(),
                                                attachment.getComment() != null ? attachment.getComment().getId()
                                                                : null,
                                                null // downloadUrl will be populated when needed
                                ))
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
package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.*;
import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.Task;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.security.services.UserDetailsImpl;
import com.tenex.util.ActivityLogUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

        private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

        private final TaskRepository taskRepository;
        private final ProjectRepository projectRepository;
        private final ActivityLogUtil activityLogUtil;
        private final TaskStatusHistoryService taskStatusHistoryService;
        private final UserTenantMappingRepository userTenantMappingRepository;

        @Autowired
        public TaskService(TaskRepository taskRepository,
                        ProjectRepository projectRepository,
                        ActivityLogUtil activityLogUtil,
                        TaskStatusHistoryService taskStatusHistoryService,
                        UserTenantMappingRepository userTenantMappingRepository) {
                this.taskRepository = taskRepository;
                this.projectRepository = projectRepository;
                this.activityLogUtil = activityLogUtil;
                this.taskStatusHistoryService = taskStatusHistoryService;
                this.userTenantMappingRepository = userTenantMappingRepository;
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getAllTasks() {
                logger.info("Fetching all tasks for tenant: {}", TenantContext.getCurrentTenant());
                return taskRepository.findAllWithProject().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public Optional<TaskDTO> getTaskById(Long id) {
                logger.info("Fetching task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());
                return taskRepository.findById(id)
                                .map(this::convertToDTO);
        }

        @Transactional("tenantTransactionManager")
        public TaskDTO createTask(TaskDTO taskDTO) {
                logger.info("Creating new task for project ID: {} in tenant: {}",
                                taskDTO.getProjectId(), TenantContext.getCurrentTenant());

                Project project = projectRepository.findByIdWithManual(taskDTO.getProjectId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Project not found with ID: " + taskDTO.getProjectId()));

                Task task = new Task();
                updateTaskFromDTO(task, taskDTO);
                task.setProject(project);

                Task savedTask = taskRepository.save(task);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.CREATE_TASK, "Task", savedTask.getId());

                return convertToDTO(savedTask);
        }

        @Transactional("tenantTransactionManager")
        public Optional<TaskDTO> updateTask(Long id, TaskDTO taskDTO) {
                logger.info("Updating task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());

                return taskRepository.findById(id)
                                .map(existingTask -> {
                                        updateTaskFromDTO(existingTask, taskDTO);

                                        if (taskDTO.getProjectId() != null &&
                                                        !existingTask.getProject().getId()
                                                                        .equals(taskDTO.getProjectId())) {
                                                Project newProject = projectRepository
                                                                .findByIdWithManual(taskDTO.getProjectId())
                                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                                "Project not found with ID: " + taskDTO
                                                                                                .getProjectId()));
                                                existingTask.setProject(newProject);
                                        }

                                        Task savedTask = taskRepository.save(existingTask);

                                        // Log activity
                                        activityLogUtil.logActivity(ActivityAction.UPDATE_TASK, "Task",
                                                        savedTask.getId());

                                        return convertToDTO(savedTask);
                                });
        }

        @Transactional("tenantTransactionManager")
        public boolean deleteTask(Long id) {
                logger.info("Deleting task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());
                return taskRepository.findById(id)
                                .map(task -> {
                                        taskRepository.delete(task);

                                        // Log activity
                                        activityLogUtil.logActivity(ActivityAction.DELETE_TASK, "Task", id);

                                        return true;
                                })
                                .orElse(false);
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByProject(Long projectId) {
                logger.info("Fetching tasks for project ID: {} in tenant: {}", projectId,
                                TenantContext.getCurrentTenant());
                return taskRepository.findByProjectId(projectId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByAssignee(Long userId) {
                logger.info("Fetching tasks assigned to user ID: {} in tenant: {}", userId,
                                TenantContext.getCurrentTenant());
                return taskRepository.findByAssignedTo(userId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByStatus(String status) {
                logger.info("Fetching tasks with status: {} in tenant: {}", status, TenantContext.getCurrentTenant());
                return taskRepository.findByStatus(status).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByDueDate(LocalDate dueDate) {
                logger.info("Fetching tasks due before: {} in tenant: {}", dueDate, TenantContext.getCurrentTenant());
                return taskRepository.findByDueDateBefore(dueDate).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> searchTasksByTitle(String title) {
                logger.info("Searching tasks with title containing: {} in tenant: {}", title,
                                TenantContext.getCurrentTenant());
                return taskRepository.findByTitleContainingIgnoreCase(title).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByCreator(Long userId) {
                logger.info("Fetching tasks created by user ID: {} in tenant: {}", userId,
                                TenantContext.getCurrentTenant());
                return taskRepository.findByCreatedBy(userId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskDTO> getTasksByPriority(String priority) {
                logger.info("Fetching tasks with priority: {} in tenant: {}", priority,
                                TenantContext.getCurrentTenant());
                return taskRepository.findByPriority(priority).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional("tenantTransactionManager")
        public Optional<TaskDTO> updateTaskStatus(Long id, String newStatus) {
                logger.info("Updating status for task ID: {} to {} in tenant: {}",
                                id, newStatus, TenantContext.getCurrentTenant());

                return taskRepository.findById(id)
                                .map(task -> {
                                        String oldStatus = task.getStatus();
                                        task.setStatus(newStatus);
                                        Task savedTask = taskRepository.save(task);

                                        // Get current user from security context
                                        Authentication authentication = SecurityContextHolder.getContext()
                                                        .getAuthentication();
                                        Long userId = null;

                                        if (authentication != null && authentication.isAuthenticated()) {
                                                if (authentication.getPrincipal() instanceof UserDetailsImpl) {
                                                        UserDetailsImpl userDetails = (UserDetailsImpl) authentication
                                                                        .getPrincipal();
                                                        userId = userDetails.getId();
                                                } else {
                                                        logger.warn("Authentication principal is not UserDetailsImpl: {}",
                                                                        authentication.getPrincipal().getClass()
                                                                                        .getName());
                                                }
                                        } else {
                                                logger.warn("No authenticated user found for task status update");
                                        }

                                        if (userId != null) {
                                                // Create task status history entry
                                                TaskStatusHistoryDTO historyDTO = new TaskStatusHistoryDTO(
                                                                null, // ID will be generated
                                                                savedTask.getId(),
                                                                oldStatus,
                                                                newStatus,
                                                                userId,
                                                                null // changedAt will be set automatically
                                                );
                                                taskStatusHistoryService.createStatusHistory(historyDTO);
                                        }

                                        // Log activity
                                        activityLogUtil.logActivity(ActivityAction.UPDATE_TASK, "Task",
                                                        savedTask.getId());

                                        return convertToDTO(savedTask);
                                });
        }

        private void updateTaskFromDTO(Task task, TaskDTO dto) {
                task.setTitle(dto.getTitle());
                task.setDescription(dto.getDescription());
                task.setStatus(dto.getStatus());
                task.setPriority(dto.getPriority());
                task.setAssignedTo(dto.getAssignedTo());
                task.setEstimatedTime(dto.getEstimatedTime());
                task.setDueDate(dto.getDueDate());
                task.setCreatedBy(dto.getCreatedBy());
        }

        private TaskDTO convertToDTO(Task task) {
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

                List<UserTaskAssignmentDTO> userAssignmentDTOs = task.getUserTaskAssignments().stream()
                                .map(assignment -> {
                                        String username = userTenantMappingRepository.findByTenantIdAndUserId(
                                                        TenantContext.getCurrentTenant(),
                                                        assignment.getUserId())
                                                        .map(mapping -> mapping.getUsername())
                                                        .orElseGet(() -> "User-" + assignment.getUserId());

                                        return new UserTaskAssignmentDTO(
                                                        username,
                                                        task.getId(),
                                                        assignment.getAssignedAt());
                                })
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
                                attachmentDTOs,
                                userAssignmentDTOs);
        }
}
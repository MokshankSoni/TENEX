package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.TaskChecklistDTO;
import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.TaskChecklist;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.tenant.TaskChecklistRepository;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.security.tenant.TaskChecklistAuthorizationService;
import com.tenex.util.ActivityLogUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskChecklistService {
        private static final Logger logger = LoggerFactory.getLogger(TaskChecklistService.class);

        private final TaskChecklistRepository taskChecklistRepository;
        private final TaskRepository taskRepository;
        private final ActivityLogUtil activityLogUtil;
        private final TaskChecklistAuthorizationService authorizationService;

        @Autowired
        public TaskChecklistService(
                        TaskChecklistRepository taskChecklistRepository,
                        TaskRepository taskRepository,
                        ActivityLogUtil activityLogUtil,
                        TaskChecklistAuthorizationService authorizationService) {
                this.taskChecklistRepository = taskChecklistRepository;
                this.taskRepository = taskRepository;
                this.activityLogUtil = activityLogUtil;
                this.authorizationService = authorizationService;
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<TaskChecklistDTO> getChecklistsByTaskId(Long taskId) {
                if (!authorizationService.canGetChecklistsByTaskId()) {
                        throw new AccessDeniedException("You don't have permission to view task checklists");
                }

                logger.info("Fetching checklists for task ID: {} in tenant: {}", taskId,
                                TenantContext.getCurrentTenant());
                return taskChecklistRepository.findByTaskId(taskId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public Optional<TaskChecklistDTO> getChecklistById(Long id) {
                if (!authorizationService.canGetChecklistById()) {
                        throw new AccessDeniedException("You don't have permission to view task checklists");
                }

                logger.info("Fetching checklist with ID: {} in tenant: {}", id, TenantContext.getCurrentTenant());
                return taskChecklistRepository.findById(id)
                                .map(this::convertToDTO);
        }

        @Transactional("tenantTransactionManager")
        public TaskChecklistDTO createChecklist(TaskChecklistDTO dto) {
                if (!authorizationService.canCreateChecklist()) {
                        throw new AccessDeniedException("You don't have permission to create task checklists");
                }

                logger.info("Creating new checklist for task ID: {} in tenant: {}",
                                dto.getTaskId(), TenantContext.getCurrentTenant());

                Task task = taskRepository.findById(dto.getTaskId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Task not found with ID: " + dto.getTaskId()));

                TaskChecklist checklist = new TaskChecklist();
                checklist.setTask(task);
                checklist.setItem(dto.getItem());
                checklist.setCompleted(dto.isCompleted());

                TaskChecklist savedChecklist = taskChecklistRepository.save(checklist);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.CREATE_TASK_CHECKLIST, "TaskChecklist",
                                savedChecklist.getId());

                return convertToDTO(savedChecklist);
        }

        @Transactional("tenantTransactionManager")
        public TaskChecklistDTO updateChecklist(Long id, TaskChecklistDTO dto) {
                if (!authorizationService.canUpdateChecklist()) {
                        throw new AccessDeniedException("You don't have permission to update task checklists");
                }

                logger.info("Updating checklist with ID: {} in tenant: {}", id, TenantContext.getCurrentTenant());

                TaskChecklist checklist = taskChecklistRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Checklist not found with ID: " + id));

                checklist.setItem(dto.getItem());
                checklist.setCompleted(dto.isCompleted());

                TaskChecklist updatedChecklist = taskChecklistRepository.save(checklist);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.UPDATE_TASK_CHECKLIST, "TaskChecklist",
                                updatedChecklist.getId());

                return convertToDTO(updatedChecklist);
        }

        @Transactional("tenantTransactionManager")
        public boolean deleteChecklist(Long id) {
                if (!authorizationService.canDeleteChecklist()) {
                        throw new AccessDeniedException("You don't have permission to delete task checklists");
                }

                logger.info("Deleting checklist with ID: {} in tenant: {}", id, TenantContext.getCurrentTenant());
                return taskChecklistRepository.findById(id)
                                .map(checklist -> {
                                        taskChecklistRepository.delete(checklist);
                                        // Log activity
                                        activityLogUtil.logActivity(ActivityAction.DELETE_TASK_CHECKLIST,
                                                        "TaskChecklist", id);
                                        return true;
                                })
                                .orElse(false);
        }

        @Transactional("tenantTransactionManager")
        public TaskChecklistDTO toggleChecklistStatus(Long id) {
                if (!authorizationService.canToggleStatus()) {
                        throw new AccessDeniedException("You don't have permission to toggle task checklist status");
                }

                logger.info("Toggling completed status for checklist ID: {} in tenant: {}", id,
                                TenantContext.getCurrentTenant());

                TaskChecklist checklist = taskChecklistRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Checklist not found with ID: " + id));

                // Toggle the completed status
                checklist.setCompleted(!checklist.getCompleted());
                TaskChecklist updatedChecklist = taskChecklistRepository.save(checklist);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.UPDATE_TASK_CHECKLIST, "TaskChecklist",
                                updatedChecklist.getId());

                return convertToDTO(updatedChecklist);
        }

        private TaskChecklistDTO convertToDTO(TaskChecklist checklist) {
                return new TaskChecklistDTO(
                                checklist.getId(),
                                checklist.getTask().getId(),
                                checklist.getItem(),
                                checklist.getCompleted());
        }
}
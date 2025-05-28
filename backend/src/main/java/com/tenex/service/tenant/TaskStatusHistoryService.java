package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.TaskStatusHistoryDTO;
import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.TaskStatusHistory;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.repository.tenant.TaskStatusHistoryRepository;
import com.tenex.security.tenant.TaskStatusHistoryAuthorizationService;
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
public class TaskStatusHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(TaskStatusHistoryService.class);

    private final TaskStatusHistoryRepository taskStatusHistoryRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogUtil activityLogUtil;
    private final TaskStatusHistoryAuthorizationService authorizationService;

    @Autowired
    public TaskStatusHistoryService(
            TaskStatusHistoryRepository taskStatusHistoryRepository,
            TaskRepository taskRepository,
            ActivityLogUtil activityLogUtil,
            TaskStatusHistoryAuthorizationService authorizationService) {
        this.taskStatusHistoryRepository = taskStatusHistoryRepository;
        this.taskRepository = taskRepository;
        this.activityLogUtil = activityLogUtil;
        this.authorizationService = authorizationService;
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<TaskStatusHistoryDTO> getStatusHistoryByTaskId(Long taskId) {
        if (!authorizationService.canGetStatusHistoryByTaskId()) {
            throw new AccessDeniedException("You don't have permission to view task status history");
        }

        logger.info("Fetching status history for task ID: {} in tenant: {}", taskId, TenantContext.getCurrentTenant());
        return taskStatusHistoryRepository.findByTaskIdOrderByChangedAtDesc(taskId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<TaskStatusHistoryDTO> getStatusHistoryById(Long id) {
        if (!authorizationService.canGetStatusHistoryById()) {
            throw new AccessDeniedException("You don't have permission to view task status history");
        }

        logger.info("Fetching status history with ID: {} in tenant: {}", id, TenantContext.getCurrentTenant());
        return taskStatusHistoryRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional("tenantTransactionManager")
    public TaskStatusHistoryDTO createStatusHistory(TaskStatusHistoryDTO dto) {
        if (!authorizationService.canCreateStatusHistory()) {
            throw new AccessDeniedException("You don't have permission to create task status history");
        }

        logger.info("Creating new status history for task ID: {} in tenant: {}",
                dto.getTaskId(), TenantContext.getCurrentTenant());

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + dto.getTaskId()));

        TaskStatusHistory statusHistory = new TaskStatusHistory();
        statusHistory.setTask(task);
        statusHistory.setOldStatus(dto.getOldStatus());
        statusHistory.setNewStatus(dto.getNewStatus());
        statusHistory.setChangedBy(dto.getChangedBy());

        TaskStatusHistory savedHistory = taskStatusHistoryRepository.save(statusHistory);

        // Log activity
        activityLogUtil.logActivity(ActivityAction.CREATE_TASK_STATUS_HISTORY, "TaskStatusHistory",
                savedHistory.getId());

        return convertToDTO(savedHistory);
    }

    @Transactional("tenantTransactionManager")
    public boolean deleteStatusHistory(Long id) {
        if (!authorizationService.canDeleteStatusHistory()) {
            throw new AccessDeniedException("You don't have permission to delete task status history");
        }

        logger.info("Deleting status history with ID: {} in tenant: {}", id, TenantContext.getCurrentTenant());
        return taskStatusHistoryRepository.findById(id)
                .map(history -> {
                    taskStatusHistoryRepository.delete(history);
                    // Log activity
                    activityLogUtil.logActivity(ActivityAction.DELETE_TASK_STATUS_HISTORY, "TaskStatusHistory", id);
                    return true;
                })
                .orElse(false);
    }

    private TaskStatusHistoryDTO convertToDTO(TaskStatusHistory history) {
        return new TaskStatusHistoryDTO(
                history.getId(),
                history.getTask().getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getChangedBy(),
                history.getChangedAt());
    }
}
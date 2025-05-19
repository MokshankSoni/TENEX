package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.Task;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.repository.tenant.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getAllTasks() {
        logger.info("Fetching all tasks for tenant: {}", TenantContext.getCurrentTenant());
        return taskRepository.findAllWithProject();
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<Task> getTaskById(Long id) {
        logger.info("Fetching task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());
        return taskRepository.findById(id);
    }

    @Transactional("tenantTransactionManager")
    public Task createTask(Task task) {
        logger.info("Creating new task for project ID: {} in tenant: {}",
                task.getProject().getId(), TenantContext.getCurrentTenant());

        // Verify project exists in the current tenant context
        Project project = projectRepository.findByIdWithManual(task.getProject().getId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Project not found with ID: " + task.getProject().getId()));

        task.setProject(project);
        return taskRepository.save(task);
    }

    @Transactional("tenantTransactionManager")
    public Task updateTask(Long id, Task taskDetails) {
        logger.info("Updating task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));

        // Update task fields from the request
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setAssignedTo(taskDetails.getAssignedTo());
        existingTask.setEstimatedTime(taskDetails.getEstimatedTime());
        existingTask.setDueDate(taskDetails.getDueDate());

        // If project is being updated, verify the new project exists
        if (taskDetails.getProject() != null &&
                !existingTask.getProject().getId().equals(taskDetails.getProject().getId())) {
            Project newProject = projectRepository.findByIdWithManual(taskDetails.getProject().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " +
                            taskDetails.getProject().getId()));
            existingTask.setProject(newProject);
        }

        return taskRepository.save(existingTask);
    }

    @Transactional("tenantTransactionManager")
    public void deleteTask(Long id) {
        logger.info("Deleting task with ID: {} for tenant: {}", id, TenantContext.getCurrentTenant());
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + id));
        taskRepository.delete(task);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByProject(Long projectId) {
        logger.info("Fetching tasks for project ID: {} in tenant: {}", projectId, TenantContext.getCurrentTenant());
        return taskRepository.findByProjectId(projectId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByAssignee(Long userId) {
        logger.info("Fetching tasks assigned to user ID: {} in tenant: {}", userId, TenantContext.getCurrentTenant());
        return taskRepository.findByAssignedTo(userId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByStatus(String status) {
        logger.info("Fetching tasks with status: {} in tenant: {}", status, TenantContext.getCurrentTenant());
        return taskRepository.findByStatus(status);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByDueDate(LocalDate dueDate) {
        logger.info("Fetching tasks due before: {} in tenant: {}", dueDate, TenantContext.getCurrentTenant());
        return taskRepository.findByDueDateBefore(dueDate);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> searchTasksByTitle(String title) {
        logger.info("Searching tasks with title containing: {} in tenant: {}", title, TenantContext.getCurrentTenant());
        return taskRepository.findByTitleContainingIgnoreCase(title);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByCreator(Long userId) {
        logger.info("Fetching tasks created by user ID: {} in tenant: {}", userId, TenantContext.getCurrentTenant());
        return taskRepository.findByCreatedBy(userId);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<Task> getTasksByPriority(String priority) {
        logger.info("Fetching tasks with priority: {} in tenant: {}", priority, TenantContext.getCurrentTenant());
        return taskRepository.findByPriority(priority);
    }
}
package com.tenex.security.tenant;

import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.UserProjectAssignment;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.repository.tenant.UserProjectAssignmentRepository;
import com.tenex.repository.tenant.UserTaskAssignmentRepository;
import com.tenex.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskAuthorizationService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserProjectAssignmentRepository userProjectAssignmentRepository;

    @Autowired
    private UserTaskAssignmentRepository userTaskAssignmentRepository;

    public boolean canCreateTask() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") || role.equals("ROLE_PROJECT_MANAGER");
    }

    public boolean canUpdateTask(Long taskId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") || role.equals("ROLE_PROJECT_MANAGER");
    }

    public boolean canDeleteTask(Long taskId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") || role.equals("ROLE_PROJECT_MANAGER");
    }

    public boolean canViewAllTasks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN");
    }

    public boolean canViewTask(Long taskId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        // TENANT_ADMIN and PROJECT_MANAGER can view any task
        if (role.equals("ROLE_TENANT_ADMIN") || role.equals("ROLE_PROJECT_MANAGER")) {
            return true;
        }

        // For other roles, check if they are assigned to the task
        Long userId = ((UserDetailsImpl) auth.getPrincipal()).getId();
        Optional<Task> task = taskRepository.findById(taskId);

        if (task.isPresent()) {
            // Check if user is assigned to the task
            return userTaskAssignmentRepository
                    .findByTaskIdAndUserId(taskId, userId)
                    .isPresent();
        }

        return false;
    }

    public boolean canViewTasksByProject(Long projectId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        // TENANT_ADMIN can view all tasks
        if (role.equals("ROLE_TENANT_ADMIN")) {
            return true;
        }

        // For other roles, check if they are assigned to the project
        Long userId = ((UserDetailsImpl) auth.getPrincipal()).getId();
        return userProjectAssignmentRepository
                .findByProjectIdAndUserId(projectId, userId)
                .isPresent();
    }

    public boolean canViewTasksByAssignee() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_TEAM_MEMBER");
    }

    public boolean canViewTasksByStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_CLIENT");
    }

    public boolean canViewTasksByDueDate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_CLIENT");
    }

    public boolean canViewTasksByName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_CLIENT");
    }

    public boolean canViewTasksByCreator() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER");
    }

    public boolean canViewTasksByPriority() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_CLIENT");
    }

    public boolean canUpdateTaskStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        return role.equals("ROLE_TENANT_ADMIN") ||
                role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_TEAM_MEMBER");
    }
}
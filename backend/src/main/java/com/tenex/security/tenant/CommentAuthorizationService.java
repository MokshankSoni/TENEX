package com.tenex.security.tenant;

import com.tenex.repository.tenant.UserTaskAssignmentRepository;
import com.tenex.repository.tenant.UserProjectAssignmentRepository;
import com.tenex.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CommentAuthorizationService {

    @Autowired
    private UserTaskAssignmentRepository userTaskAssignmentRepository;

    @Autowired
    private UserProjectAssignmentRepository userProjectAssignmentRepository;

    public boolean canCreateComment() {
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

    public boolean canUpdateComment() {
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

    public boolean canDeleteComment() {
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

    public boolean canGetAllComments() {
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

    public boolean canGetCommentById() {
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
                role.equals("ROLE_TEAM_MEMBER") ||
                role.equals("ROLE_CLIENT");
    }

    public boolean canGetCommentsByTaskId(Long taskId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        if (role.equals("ROLE_TENANT_ADMIN")) {
            return true;
        }

        if (role.equals("ROLE_PROJECT_MANAGER") || role.equals("ROLE_CLIENT")) {
            return true;
        }

        if (role.equals("ROLE_TEAM_MEMBER")) {
            // Check if the user is assigned to the task
            return userTaskAssignmentRepository.findByTaskIdAndUserId(taskId, getCurrentUserId()).isPresent();
        }

        return false;
    }

    public boolean canGetCommentsByProjectId(Long projectId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        if (role.equals("ROLE_TENANT_ADMIN")) {
            return true;
        }

        // For PM, Client, and TM, check if they are assigned to the project
        if (role.equals("ROLE_PROJECT_MANAGER") ||
                role.equals("ROLE_CLIENT") ||
                role.equals("ROLE_TEAM_MEMBER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId()).isPresent();
        }

        return false;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) auth.getPrincipal()).getId();
        }
        return null;
    }
}
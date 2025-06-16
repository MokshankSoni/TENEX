package com.tenex.security.tenant;

import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.UserProjectAssignment;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.repository.tenant.UserProjectAssignmentRepository;
import com.tenex.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProjectAuthorizationService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserProjectAssignmentRepository userProjectAssignmentRepository;

    public boolean canCreateProject() {
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

    public boolean canDeleteProject(Long projectId) {
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

    public boolean canViewAllProjects() {
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

    public boolean canViewProject(Long projectId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("");

        // TENANT_ADMIN can view all projects
        if (role.equals("ROLE_TENANT_ADMIN")) {
            return true;
        }

        // For other roles, check if they are assigned to the project
        Long userId = ((UserDetailsImpl) auth.getPrincipal()).getId();
        Optional<UserProjectAssignment> assignment = userProjectAssignmentRepository
                .findByProjectIdAndUserId(projectId, userId);

        return assignment.isPresent();
    }

    public boolean canSearchProjects() {
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

    public boolean canUpdateProject(Long projectId) {
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

    public boolean canUpdateProjectStatus(Long projectId) {
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
}
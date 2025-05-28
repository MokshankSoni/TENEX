package com.tenex.security.tenant;

import com.tenex.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserProjectAssignmentAuthorizationService {

    public boolean canCreateAssignment() {
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

    public boolean canUpdateAssignment() {
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

    public boolean canDeleteAssignment() {
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

    public boolean canViewAssignments() {
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

    public boolean canViewAssignmentsByUsername() {
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

    public boolean canViewAssignmentsByRole() {
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

    public boolean canViewMyAssignments() {
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
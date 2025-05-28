package com.tenex.security.tenant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TaskChecklistAuthorizationService {

    public boolean canCreateChecklist() {
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

    public boolean canUpdateChecklist() {
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

    public boolean canDeleteChecklist() {
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

    public boolean canGetChecklistById() {
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

    public boolean canGetChecklistsByTaskId() {
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

    public boolean canToggleStatus() {
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
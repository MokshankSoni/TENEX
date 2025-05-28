package com.tenex.security.tenant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TaskStatusHistoryAuthorizationService {

    public boolean canCreateStatusHistory() {
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

    public boolean canDeleteStatusHistory() {
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

    public boolean canGetStatusHistoryById() {
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

    public boolean canGetStatusHistoryByTaskId() {
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
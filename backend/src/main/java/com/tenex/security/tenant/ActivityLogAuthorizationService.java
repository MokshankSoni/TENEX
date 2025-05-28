package com.tenex.security.tenant;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogAuthorizationService {

    public boolean canDeleteActivityLog() {
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

    public boolean canGetAllActivityLogs() {
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

    public boolean canGetActivityLogById() {
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

    public boolean canGetActivityLogsByUser() {
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

    public boolean canGetActivityLogsByAction() {
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

    public boolean canGetActivityLogsByEntity() {
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

    public boolean canGetActivityLogsByTimeRange() {
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

    public boolean canGetRecentActivityLogs() {
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
}
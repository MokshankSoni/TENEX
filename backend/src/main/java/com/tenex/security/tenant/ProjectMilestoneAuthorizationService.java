package com.tenex.security.tenant;

import com.tenex.repository.tenant.UserProjectAssignmentRepository;
import com.tenex.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProjectMilestoneAuthorizationService {

    @Autowired
    private UserProjectAssignmentRepository userProjectAssignmentRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user found.");
        }
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return userDetails.getId();
        } catch (ClassCastException e) {
            throw new IllegalStateException("Invalid authentication principal type");
        }
    }

    public boolean canCreateMilestone(Long projectId) {
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

        if (role.equals("ROLE_PROJECT_MANAGER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId())
                    .isPresent();
        }

        return false;
    }

    public boolean canUpdateMilestone(Long projectId) {
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

        if (role.equals("ROLE_PROJECT_MANAGER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId())
                    .isPresent();
        }

        return false;
    }

    public boolean canToggleCompleted(Long projectId) {
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

        if (role.equals("ROLE_PROJECT_MANAGER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId())
                    .isPresent();
        }

        return false;
    }

    public boolean canGetMilestoneById(Long projectId) {
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

        if (role.equals("ROLE_PROJECT_MANAGER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId())
                    .isPresent();
        }

        return false;
    }

    public boolean canGetMilestonesByProject(Long projectId) {
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

        if (role.equals("ROLE_PROJECT_MANAGER")) {
            return userProjectAssignmentRepository.findByProjectIdAndUserId(projectId, getCurrentUserId())
                    .isPresent();
        }

        return false;
    }
}
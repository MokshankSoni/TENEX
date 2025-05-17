package com.tenex.config.security;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.service.TenantService;
import com.tenex.security.services.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class TenantSecurityFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(TenantSecurityFilter.class);
    private final TenantService tenantService;
    private final ObjectMapper objectMapper;

    public TenantSecurityFilter(TenantService tenantService, ObjectMapper objectMapper) {
        this.tenantService = tenantService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String tenantId = extractTenantId(request);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Skip tenant validation for authentication endpoints
            if (isAuthEndpoint(request.getRequestURI())) {
                if (tenantId != null) {
                    TenantContext.setCurrentTenant(tenantId);
                }
                filterChain.doFilter(request, response);
                return;
            }

            // For non-auth endpoints, validate tenant ID matches authenticated user's
            // tenant
            if (authentication != null && authentication.isAuthenticated()) {
                String userTenantId = extractUserTenantId(authentication);
                if (tenantId == null || !tenantId.equals(userTenantId)) {
                    handleTenantMismatch(response, userTenantId);
                    return;
                }
            }

            if (tenantId != null) {
                if (tenantService.tenantExists(tenantId)) {
                    TenantContext.setCurrentTenant(tenantId);
                    logger.debug("Tenant context set to: {}", tenantId);
                } else {
                    logger.warn("Tenant does not exist: {}", tenantId);
                    handleTenantNotFound(response);
                    return;
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String extractTenantId(HttpServletRequest request) {
        String tenantId = request.getHeader("X-TenantID");
        if (tenantId == null || tenantId.trim().isEmpty()) {
            tenantId = request.getParameter("tenantId");
        }
        return tenantId != null ? tenantId.trim() : null;
    }

    private String extractUserTenantId(Authentication authentication) {
        // Assuming the tenant ID is stored in the authentication principal
        // You might need to adjust this based on how you store the tenant ID in your
        // authentication
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getTenantId();
        }
        return null;
    }

    private boolean isAuthEndpoint(String requestURI) {
        return requestURI.contains("/api/auth/") ||
                requestURI.contains("/api/public/") ||
                requestURI.equals("/api/auth/signin") ||
                requestURI.equals("/api/auth/signup");
    }

    private void handleTenantMismatch(HttpServletResponse response, String userTenantId) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Tenant ID mismatch");
        errorResponse.put("message", "The X-TenantID header must match your authenticated tenant ID: " + userTenantId);

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }

    private void handleTenantNotFound(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Tenant not found");
        errorResponse.put("message", "The specified tenant does not exist");

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
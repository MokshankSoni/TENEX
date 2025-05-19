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
                if (userTenantId == null) {
                    logger.error("User tenant ID is null for authenticated user");
                    handleUnauthorized(response, "Invalid user tenant information");
                    return;
                }

                if (tenantId == null || !tenantId.equals(userTenantId)) {
                    logger.warn("Tenant ID mismatch. User tenant: {}, Request tenant: {}", userTenantId, tenantId);
                    handleTenantMismatch(response, userTenantId);
                    return;
                }

                // Set the tenant context before proceeding
                TenantContext.setCurrentTenant(tenantId);
                logger.debug("Tenant context set to: {} for user: {}", tenantId, authentication.getName());
            } else {
                logger.warn("No authentication found for request to: {}", request.getRequestURI());
                handleUnauthorized(response, "Authentication required");
                return;
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error processing request", e);
            handleError(response, e);
        } finally {
            TenantContext.clear();
            logger.debug("Cleared tenant context");
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
        if (authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getTenantId();
        }
        logger.warn("Authentication principal is not UserDetailsImpl: {}",
                authentication.getPrincipal().getClass().getName());
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

    private void handleUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("message", message);

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", e.getMessage());

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
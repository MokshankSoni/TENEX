package com.tenex.config.multitenancy;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // For auth endpoints, extract tenant from request parameter or header
        if (request.getRequestURI().contains("/api/auth/")) {
            String tenantId = request.getParameter("tenantId");
            if (tenantId != null && !tenantId.isEmpty()) {
                TenantContext.setCurrentTenant(tenantId);
            } else {
                tenantId = request.getHeader("X-TenantID");
                if (tenantId != null && !tenantId.isEmpty()) {
                    TenantContext.setCurrentTenant(tenantId);
                } else {
                    TenantContext.setCurrentTenant("public"); // Default tenant for public routes
                }
            }
        }

        // JWT filter will set tenant for authenticated routes

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Clear the tenant context after the request is processed
            TenantContext.clear();
        }
    }
}
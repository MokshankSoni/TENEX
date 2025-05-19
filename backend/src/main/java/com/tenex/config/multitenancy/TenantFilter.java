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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(TenantFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String tenantId = null;

        // For auth endpoints, extract tenant from request parameter or header
        if (request.getRequestURI().contains("/api/auth/")) {
            tenantId = request.getParameter("tenantId");
            if (tenantId == null || tenantId.isEmpty()) {
                tenantId = request.getHeader("X-TenantID");
            }
        } else {
            // For all other endpoints, get tenant from header
            tenantId = request.getHeader("X-TenantID");
        }

        // Set tenant context if tenant ID is found, otherwise use public
        if (tenantId != null && !tenantId.isEmpty()) {
            logger.debug("Setting tenant context to: {}", tenantId);



            TenantContext.setCurrentTenant(tenantId);
        } else {
            logger.debug("No tenant ID found, using public schema");
            TenantContext.setCurrentTenant("public");
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Clear the tenant context after the request is processed
            TenantContext.clear();
            logger.debug("Cleared tenant context");
        }
    }
}
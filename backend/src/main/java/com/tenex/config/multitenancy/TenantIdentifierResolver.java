package com.tenex.config.multitenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {
    private static final Logger logger = LoggerFactory.getLogger(TenantIdentifierResolver.class);
    private static final String DEFAULT_TENANT = "public";

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            logger.debug("No tenant ID found in context, using default schema: {}", DEFAULT_TENANT);
            return DEFAULT_TENANT;
        }
        logger.debug("Resolved tenant ID: {}", tenantId);
        return tenantId;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}

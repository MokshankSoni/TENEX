package com.tenex.config.multitenancy;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class TenantSchemaNamingStrategy extends PhysicalNamingStrategyStandardImpl {
    @Override
    public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment context) {
        // Use the current tenant's schema
        String tenantId = TenantContext.getCurrentTenant();
        return Identifier.toIdentifier(tenantId);
    }
}
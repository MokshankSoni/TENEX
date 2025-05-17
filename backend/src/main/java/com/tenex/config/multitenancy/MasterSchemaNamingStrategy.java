package com.tenex.config.multitenancy;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class MasterSchemaNamingStrategy extends PhysicalNamingStrategyStandardImpl {
    @Override
    public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment context) {
        // Force all master entities to use public schema
        return Identifier.toIdentifier("public");
    }
}
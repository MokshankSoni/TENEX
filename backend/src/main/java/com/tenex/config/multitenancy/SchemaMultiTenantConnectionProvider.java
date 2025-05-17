package com.tenex.config.multitenancy;

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class SchemaMultiTenantConnectionProvider implements MultiTenantConnectionProvider<String> {
    private static final Logger logger = LoggerFactory.getLogger(SchemaMultiTenantConnectionProvider.class);
    private final DataSource dataSource;

    public SchemaMultiTenantConnectionProvider(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        final Connection connection = dataSource.getConnection();
        try {
            // First set the search path to include the tenant schema
            connection.createStatement().execute("SET search_path TO " + tenantIdentifier + ", public");
            // Then explicitly set the schema
            connection.setSchema(tenantIdentifier);
            logger.debug("Switched to schema: {}", tenantIdentifier);
        } catch (SQLException e) {
            logger.error("Error switching to schema: {}", tenantIdentifier, e);
            throw e;
        }
        return connection;
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        final Connection connection = dataSource.getConnection();
        try {
            // Set default search path for non-tenant operations
            connection.createStatement().execute("SET search_path TO public");
            connection.setSchema("public");
        } catch (SQLException e) {
            logger.error("Error setting default schema", e);
            throw e;
        }
        return connection;
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        try {
            connection.close();
        } catch (SQLException e) {
            logger.error("Error closing connection", e);
            throw e;
        }
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        releaseAnyConnection(connection);
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    @Override
    public boolean isUnwrappableAs(Class<?> unwrapType) {
        return unwrapType.isInstance(this);
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        if (isUnwrappableAs(unwrapType)) {
            return unwrapType.cast(this);
        }
        throw new IllegalArgumentException("Cannot unwrap to " + unwrapType.getName());
    }
}

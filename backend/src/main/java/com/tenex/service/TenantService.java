package com.tenex.service;

import java.util.List;
import java.util.Map;

public interface TenantService {

    void createTenant(String tenantId, String companyName);

    boolean tenantExists(String tenantId);

    void initializeDefaultRoles();

    /**
     * Returns a list of all tenant schemas in the database, excluding system
     * schemas.
     */
    List<String> getAllTenantSchemas();

    /**
     * Returns basic information about a specific tenant schema.
     */
    Map<String, Object> getTenantSchemaInfo(String schemaName);
}
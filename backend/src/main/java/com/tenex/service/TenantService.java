package com.tenex.service;

public interface TenantService {

    void createTenant(String tenantId, String companyName);

    boolean tenantExists(String tenantId);

    void initializeDefaultRoles();
}
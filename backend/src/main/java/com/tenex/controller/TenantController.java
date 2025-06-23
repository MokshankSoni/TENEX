package com.tenex.controller;

import com.tenex.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    /**
     * Endpoint to get all tenant schemas (for super admin use).
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/schemas")
    public ResponseEntity<List<String>> getAllTenantSchemas() {
        List<String> schemas = tenantService.getAllTenantSchemas();
        return ResponseEntity.ok(schemas);
    }

    /**
     * Endpoint to get basic information about a specific tenant schema (for super
     * admin use).
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/schemas/{schemaName}")
    public ResponseEntity<Map<String, Object>> getTenantSchemaInfo(@PathVariable String schemaName) {
        Map<String, Object> schemaInfo = tenantService.getTenantSchemaInfo(schemaName);
        return ResponseEntity.ok(schemaInfo);
    }
}
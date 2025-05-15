package com.tenex.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TenantNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public TenantNotFoundException(String tenantId) {
        super("Tenant not found with id: " + tenantId);
    }
}
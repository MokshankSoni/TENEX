package com.tenex.config.multitenancy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TenantContext {
    private static final Logger logger = LoggerFactory.getLogger(TenantContext.class);
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    private static final String DEFAULT_TENANT = "public";

    public static String getCurrentTenant() {

        if(currentTenant.get() != null){
            return currentTenant.get();
        }else{
            return DEFAULT_TENANT;
        }
    }

    public static void setCurrentTenant(String tenant) {
        logger.debug("Setting tenant to {}", tenant);
        currentTenant.set(tenant);
    }

    public static void clear() {
        currentTenant.remove();
    }
}
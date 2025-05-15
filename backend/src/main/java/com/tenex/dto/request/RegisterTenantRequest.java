package com.tenex.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterTenantRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String companyName;

    @NotBlank
    @Size(min = 3, max = 20)
    private String tenantId;

    @NotBlank
    @Size(min = 3, max = 20)
    private String adminUsername;

    @NotBlank
    @Size(max = 50)
    @Email
    private String adminEmail;

    @NotBlank
    @Size(min = 6, max = 40)
    private String adminPassword;

    public RegisterTenantRequest() {
    }

    public RegisterTenantRequest(String companyName, String tenantId, String adminUsername, String adminEmail, String adminPassword) {
        this.companyName = companyName;
        this.tenantId = tenantId;
        this.adminUsername = adminUsername;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }
}
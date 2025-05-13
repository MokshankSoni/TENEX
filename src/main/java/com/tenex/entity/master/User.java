package com.tenex.entity.master;

import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users", schema = "public ",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Column(name = "tenant_id")
    private String tenantId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Column(name = "is_tenant_admin")
    private Boolean isTenantAdmin = false;

    @Column(name = "is_super_admin")
    private Boolean isSuperAdmin = false;

    public User(Long id, String username, String email, String password, String tenantId, Set<Role> roles,
            Boolean isTenantAdmin, Boolean isSuperAdmin) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tenantId = tenantId;
        this.roles = roles;
        this.isTenantAdmin = isTenantAdmin;
        this.isSuperAdmin = isSuperAdmin;
    }

    public User(String adminUsername, String adminEmail, String encode, String tenantId) {
        this.username = adminUsername;
        this.email = adminEmail;
        this.password = encode;
        this.tenantId = tenantId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Boolean getTenantAdmin() {
        return isTenantAdmin;
    }

    public void setTenantAdmin(Boolean tenantAdmin) {
        isTenantAdmin = tenantAdmin;
    }

    public Boolean getSuperAdmin() {
        return isSuperAdmin;
    }

    public void setSuperAdmin(Boolean superAdmin) {
        isSuperAdmin = superAdmin;
    }
}
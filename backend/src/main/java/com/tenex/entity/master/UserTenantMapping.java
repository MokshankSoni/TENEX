package com.tenex.entity.master;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_tenant_mapping", schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"tenant_id", "username"}),
                @UniqueConstraint(columnNames = {"tenant_id", "email"})
        })
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTenantMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_tenant_admin")
    private Boolean isTenantAdmin = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getTenantAdmin() {
        return isTenantAdmin;
    }

    public void setTenantAdmin(Boolean tenantAdmin) {
        isTenantAdmin = tenantAdmin;
    }
}

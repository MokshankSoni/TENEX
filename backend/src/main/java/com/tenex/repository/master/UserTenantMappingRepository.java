package com.tenex.repository.master;

import com.tenex.entity.master.UserTenantMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserTenantMappingRepository extends JpaRepository<UserTenantMapping, Long> {

    Optional<UserTenantMapping> findByTenantIdAndEmail(String tenantId, String email);

    Optional<UserTenantMapping> findByTenantIdAndUsername(String tenantId, String username);

    List<UserTenantMapping> findByUserId(Long userId);

    Boolean existsByTenantIdAndEmail(String tenantId, String email);

    Boolean existsByTenantIdAndUsername(String tenantId, String username);
}


package com.tenex.repository.master;

import com.tenex.entity.master.UserTenantMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTenantMappingRepository extends JpaRepository<UserTenantMapping, Long> {

    Optional<UserTenantMapping> findByTenantIdAndEmail(String tenantId, String email);

    Optional<UserTenantMapping> findByTenantIdAndUsername(String tenantId, String username);

    List<UserTenantMapping> findByUserId(Long userId);

    Boolean existsByTenantIdAndEmail(String tenantId, String email);

    Boolean existsByTenantIdAndUsername(String tenantId, String username);

    Optional<UserTenantMapping> findByTenantIdAndUserId(String tenantId, Long userId);
}

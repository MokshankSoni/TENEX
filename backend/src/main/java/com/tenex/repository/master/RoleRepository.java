package com.tenex.repository.master;

import java.util.Optional;

import com.tenex.entity.master.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tenex.entity.master.ERole;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer>
{
    Optional<Role> findByName(ERole name);
}

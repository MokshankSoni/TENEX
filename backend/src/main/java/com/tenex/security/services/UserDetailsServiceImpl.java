package com.tenex.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.entity.master.User;
import com.tenex.repository.master.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String currentTenant = TenantContext.getCurrentTenant();

        User user = userRepository.findByUsernameAndTenantId(username, currentTenant)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username + " in tenant " + currentTenant));

        return UserDetailsImpl.build(user);
    }
}
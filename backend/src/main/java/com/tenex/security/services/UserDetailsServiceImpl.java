package com.tenex.security.services;

import com.tenex.entity.master.UserTenantMapping;
import com.tenex.repository.master.UserTenantMappingRepository;
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

    @Autowired
    private UserTenantMappingRepository userTenantMappingRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String currentTenant = TenantContext.getCurrentTenant();

        // 🔍 1. Fetch user-tenant mapping
        UserTenantMapping mapping = userTenantMappingRepository
                .findByTenantIdAndUsername(currentTenant, username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username + " in tenant: " + currentTenant));

        // 🔍 2. Fetch global user entity by ID
        User user = userRepository.findById(mapping.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User ID not found for mapping: " + mapping.getUser().getId()));

        // ✅ 3. Build and return UserDetailsImpl
        return UserDetailsImpl.build(user, mapping);
    }
}







//package com.tenex.security.services;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.tenex.config.multitenancy.TenantContext;
//import com.tenex.entity.master.User;
//import com.tenex.repository.master.UserRepository;
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//    @Autowired
//    UserRepository userRepository;
//
//    @Override
//    @Transactional
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        String currentTenant = TenantContext.getCurrentTenant();
//
//        User user = userRepository.findByUsernameAndTenantId(username, currentTenant)
//                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username + " in tenant " + currentTenant));
//
//        return UserDetailsImpl.build(user);
//    }
//}
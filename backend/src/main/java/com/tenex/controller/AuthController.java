package com.tenex.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.tenex.dto.request.LoginRequest;
import com.tenex.dto.request.RegisterTenantRequest;
import com.tenex.dto.request.SignupRequest;
import com.tenex.dto.response.JwtResponse;
import com.tenex.dto.response.MessageResponse;
import com.tenex.entity.master.ERole;
import com.tenex.entity.master.Role;
import com.tenex.entity.master.User;
import com.tenex.entity.master.UserTenantMapping;
import com.tenex.repository.master.RoleRepository;
import com.tenex.repository.master.UserRepository;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.security.jwt.JwtUtils;
import com.tenex.security.services.UserDetailsImpl;
import com.tenex.service.TenantService;
import com.tenex.config.multitenancy.TenantContext;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserTenantMappingRepository userTenantMappingRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TenantService tenantService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        TenantContext.setCurrentTenant(loginRequest.getTenantId());

        // Find user mapping by tenantId and username
        Optional<UserTenantMapping> userMappingOpt = userTenantMappingRepository.findByTenantIdAndUsername(
                loginRequest.getTenantId(), loginRequest.getUsername());

        if (userMappingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid credentials!"));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(), // this will be fetched from mapping
                userDetails.getEmail(),
                loginRequest.getTenantId(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        TenantContext.setCurrentTenant(signUpRequest.getTenantId());

        // Check if tenant exists
        if (!tenantService.tenantExists(signUpRequest.getTenantId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid tenant Id!"));
        }

        // Check for username/email uniqueness in the mapping table
        if (userTenantMappingRepository.existsByTenantIdAndUsername(signUpRequest.getTenantId(), signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username already exists in this tenant!"));
        }

        if (userTenantMappingRepository.existsByTenantIdAndEmail(signUpRequest.getTenantId(), signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email already exists in this tenant!"));
        }

        // Check if user already exists globally by email
        User user = userRepository.findByEmail(signUpRequest.getEmail()).orElse(null);

        if (user == null) {
            // Create new user globally
            user = new User(signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()));
            userRepository.save(user);
        }

        // Assign roles
        Set<Role> roles = new HashSet<>();
        Set<String> strRoles = signUpRequest.getRoles();

        if (strRoles == null || strRoles.isEmpty()) {
            Role defaultRole = roleRepository.findByName(ERole.ROLE_TEAM_MEMBER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found"));
            roles.add(defaultRole);
        } else {
            for (String role : strRoles) {
                Role r = switch (role) {
                    case "admin" -> roleRepository.findByName(ERole.ROLE_TENANT_ADMIN).orElseThrow();
                    case "pm" -> roleRepository.findByName(ERole.ROLE_PROJECT_MANAGER).orElseThrow();
                    case "client" -> roleRepository.findByName(ERole.ROLE_CLIENT).orElseThrow();
                    default -> roleRepository.findByName(ERole.ROLE_TEAM_MEMBER).orElseThrow();
                };
                roles.add(r);
            }
        }

        // Create tenant-specific mapping
        UserTenantMapping mapping = new UserTenantMapping();
        mapping.setTenantId(signUpRequest.getTenantId());
        mapping.setUsername(signUpRequest.getUsername());
        mapping.setEmail(signUpRequest.getEmail());
        mapping.setUser(user);
        mapping.setTenantAdmin(strRoles != null && strRoles.contains("admin"));

        userTenantMappingRepository.save(mapping);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/register-tenant")
    public ResponseEntity<?> registerTenant(@Valid @RequestBody RegisterTenantRequest registerTenantRequest) {
        if (tenantService.tenantExists(registerTenantRequest.getTenantId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Tenant ID is already taken!"));
        }

        TenantContext.setCurrentTenant("public");

        tenantService.createTenant(registerTenantRequest.getTenantId(), registerTenantRequest.getCompanyName());

        // Create global user
        User user = userRepository.findByEmail(registerTenantRequest.getAdminEmail()).orElse(null);
        if (user == null) {
            user = new User(registerTenantRequest.getAdminUsername(),
                    registerTenantRequest.getAdminEmail(),
                    encoder.encode(registerTenantRequest.getAdminPassword()));
        }

        // Role
        Role adminRole = roleRepository.findByName(ERole.ROLE_TENANT_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Admin Role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        user.setRoles(roles);
        userRepository.save(user);

        // Mapping
        UserTenantMapping mapping = new UserTenantMapping();
        mapping.setTenantId(registerTenantRequest.getTenantId());
        mapping.setUsername(registerTenantRequest.getAdminUsername());
        mapping.setEmail(registerTenantRequest.getAdminEmail());
        mapping.setUser(user);
        mapping.setTenantAdmin(true);

        userTenantMappingRepository.save(mapping);

        return ResponseEntity.ok(new MessageResponse("Tenant registered successfully with admin user!"));
    }
}








//package com.tenex.controller;
//
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//import com.tenex.entity.master.Role;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.tenex.config.multitenancy.TenantContext;
//import com.tenex.dto.request.LoginRequest;
//import com.tenex.dto.request.RegisterTenantRequest;
//import com.tenex.dto.request.SignupRequest;
//import com.tenex.dto.response.JwtResponse;
//import com.tenex.dto.response.MessageResponse;
//import com.tenex.entity.master.ERole;
//import com.tenex.entity.master.User;
//import com.tenex.repository.master.RoleRepository;
//import com.tenex.repository.master.UserRepository;
//import com.tenex.security.jwt.JwtUtils;
//import com.tenex.security.services.UserDetailsImpl;
//import com.tenex.service.TenantService;
//
//@CrossOrigin(origins = "*", maxAge = 3600)
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//    @Autowired
//    AuthenticationManager authenticationManager;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    RoleRepository roleRepository;
//
//    @Autowired
//    TenantService tenantService;
//
//    @Autowired
//    PasswordEncoder encoder;
//
//    @Autowired
//    JwtUtils jwtUtils;
//
//    @PostMapping("/signin")
//    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
//        // Set the tenant context for the authentication process
//        TenantContext.setCurrentTenant(loginRequest.getTenantId());
//
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        String jwt = jwtUtils.generateJwtToken(authentication);
//
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(item -> item.getAuthority())
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(new JwtResponse(jwt,
//                userDetails.getId(),
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                userDetails.getTenantId(),
//                roles));
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
//        // Set the tenant context for the registration process
//        TenantContext.setCurrentTenant(signUpRequest.getTenantId());
//
//        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Username is already taken!"));
//        }
//
//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Email is already in use!"));
//        }
//
//        if (!tenantService.tenantExists(signUpRequest.getTenantId())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Invalid tenant Id!"));
//        }
//
//        // Create new user's account
//        User user = new User(signUpRequest.getUsername(),
//                signUpRequest.getEmail(),
//                encoder.encode(signUpRequest.getPassword()),
//                signUpRequest.getTenantId());
//
//        Set<String> strRoles = signUpRequest.getRoles();
//        Set<Role> roles = new HashSet<>();
//
//        if (strRoles == null) {
//            Role userRole = roleRepository.findByName(ERole.ROLE_TEAM_MEMBER)
//                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//            roles.add(userRole);
//        } else {
//            strRoles.forEach(role -> {
//                switch (role) {
//                    case "admin":
//                        Role adminRole = roleRepository.findByName(ERole.ROLE_TENANT_ADMIN)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(adminRole);
//                        break;
//                    case "pm":
//                        Role pmRole = roleRepository.findByName(ERole.ROLE_PROJECT_MANAGER)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(pmRole);
//                        break;
//                    case "client":
//                        Role clientRole = roleRepository.findByName(ERole.ROLE_CLIENT)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(clientRole);
//                        break;
//                    default:
//                        Role userRole = roleRepository.findByName(ERole.ROLE_TEAM_MEMBER)
//                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//                        roles.add(userRole);
//                }
//            });
//        }
//
//        user.setRoles(roles);
//        userRepository.save(user);
//
//        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
//    }
//
//    @PostMapping("/register-tenant")
//    public ResponseEntity<?> registerTenant(@Valid @RequestBody RegisterTenantRequest registerTenantRequest) {
//        // This endpoint creates a new tenant and its admin user
//
//        // Check if tenant ID already exists
//        if (tenantService.tenantExists(registerTenantRequest.getTenantId())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Tenant ID is already taken!"));
//        }
//
//        // Set context to public for tenant creation
//        TenantContext.setCurrentTenant("public");
//
//        // Create tenant schema
//        tenantService.createTenant(registerTenantRequest.getTenantId(), registerTenantRequest.getCompanyName());
//
//        // Create admin user for the tenant
//        User user = new User(
//                registerTenantRequest.getAdminUsername(),
//                registerTenantRequest.getAdminEmail(),
//                encoder.encode(registerTenantRequest.getAdminPassword()),
//                registerTenantRequest.getTenantId(),
//                true,
//                false
//        );
//
//        // Assign roles
//        Set<Role> roles = new HashSet<>();
//        Role adminRole = roleRepository.findByName(ERole.ROLE_TENANT_ADMIN)
//                .orElseThrow(() -> new RuntimeException("Error: Admin Role is not found."));
//        roles.add(adminRole);
//
//        user.setRoles(roles);
//        userRepository.save(user);
//
//        return ResponseEntity.ok(new MessageResponse("Tenant registered successfully with admin user!"));
//    }
//}
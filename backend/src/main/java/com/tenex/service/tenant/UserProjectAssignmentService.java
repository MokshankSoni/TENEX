package com.tenex.service.tenant;

import com.tenex.dto.tenant.UserProjectAssignmentDTO;
import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.UserProjectAssignment;
import com.tenex.entity.tenant.UserProjectAssignmentId;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.repository.tenant.UserProjectAssignmentRepository;
import com.tenex.config.multitenancy.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProjectAssignmentService {

        @Autowired
        private UserProjectAssignmentRepository assignmentRepository;

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private UserTenantMappingRepository userTenantMappingRepository;

        @Transactional(value = "tenantTransactionManager")
        public UserProjectAssignmentDTO createAssignment(UserProjectAssignmentDTO assignmentDTO) {
                Project project = projectRepository.findByIdWithManual(assignmentDTO.getProjectId())
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                assignmentDTO.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                UserProjectAssignment assignment = new UserProjectAssignment();
                assignment.setUserId(userId);
                assignment.setProject(project);
                assignment.setRoleInProject(assignmentDTO.getRoleInProject());

                UserProjectAssignment savedAssignment = assignmentRepository.save(assignment);
                return convertToDTO(savedAssignment);
        }

        @Transactional(value = "tenantTransactionManager")
        public UserProjectAssignmentDTO updateAssignment(UserProjectAssignmentDTO assignmentDTO) {
                Project project = projectRepository.findByIdWithManual(assignmentDTO.getProjectId())
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                assignmentDTO.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                UserProjectAssignmentId id = new UserProjectAssignmentId(userId, project.getId());
                UserProjectAssignment assignment = assignmentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Assignment not found"));

                assignment.setRoleInProject(assignmentDTO.getRoleInProject());
                UserProjectAssignment updatedAssignment = assignmentRepository.save(assignment);
                return convertToDTO(updatedAssignment);
        }

        @Transactional(value = "tenantTransactionManager")
        public void deleteAssignment(String username, Long projectId) {
                Project project = projectRepository.findByIdWithManual(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                username)
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                assignmentRepository.deleteByUserIdAndProject(userId, project);
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public UserProjectAssignmentDTO getAssignment(String username, Long projectId) {
                Project project = projectRepository.findByIdWithManual(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                username)
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                UserProjectAssignmentId id = new UserProjectAssignmentId(userId, projectId);
                UserProjectAssignment assignment = assignmentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Assignment not found"));

                return convertToDTO(assignment);
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<UserProjectAssignmentDTO> getAssignmentsByUsername(String username) {
                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                username)
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                return assignmentRepository.findByUserId(userId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<UserProjectAssignmentDTO> getAssignmentsByProjectId(Long projectId) {
                Project project = projectRepository.findByIdWithManual(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));
                return assignmentRepository.findByProject(project).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<UserProjectAssignmentDTO> getAssignmentsByRole(String role) {
                return assignmentRepository.findByRoleInProject(role).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        private UserProjectAssignmentDTO convertToDTO(UserProjectAssignment assignment) {
                // Get username from user ID
                String username = userTenantMappingRepository.findByTenantIdAndUserId(
                                TenantContext.getCurrentTenant(),
                                assignment.getUserId())
                                .orElseThrow(() -> new RuntimeException("User mapping not found"))
                                .getUsername();

                return new UserProjectAssignmentDTO(
                                username,
                                assignment.getProject().getId(),
                                assignment.getRoleInProject(),
                                assignment.getAssignedAt());
        }
}
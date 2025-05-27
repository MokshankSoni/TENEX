package com.tenex.service.tenant;

import com.tenex.config.multitenancy.TenantContext;
import com.tenex.dto.tenant.UserTaskAssignmentDTO;
import com.tenex.entity.tenant.Task;
import com.tenex.entity.tenant.UserTaskAssignment;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.master.UserTenantMappingRepository;
import com.tenex.repository.tenant.TaskRepository;
import com.tenex.repository.tenant.UserTaskAssignmentRepository;
import com.tenex.util.ActivityLogUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserTaskAssignmentService {

        @Autowired
        private UserTaskAssignmentRepository assignmentRepository;

        @Autowired
        private TaskRepository taskRepository;

        @Autowired
        private UserTenantMappingRepository userTenantMappingRepository;

        @Autowired
        private ActivityLogUtil activityLogUtil;

        @Transactional(value = "tenantTransactionManager")
        public UserTaskAssignmentDTO createAssignment(UserTaskAssignmentDTO assignmentDTO) {
                Task task = taskRepository.findById(assignmentDTO.getTaskId())
                                .orElseThrow(() -> new RuntimeException("Task not found"));

                // Get user ID from username
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                assignmentDTO.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                UserTaskAssignment assignment = new UserTaskAssignment();
                assignment.setUserId(userId);
                assignment.setTask(task);

                UserTaskAssignment savedAssignment = assignmentRepository.save(assignment);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.ASSIGN_USER, "UserTaskAssignment",
                                savedAssignment.getTask().getId());

                return convertToDTO(savedAssignment);
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<UserTaskAssignmentDTO> getAssignmentsByTaskId(Long taskId) {
                return assignmentRepository.findByTaskId(taskId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager", readOnly = true)
        public List<UserTaskAssignmentDTO> getAssignmentsByUserId(Long userId) {
                return assignmentRepository.findByUserId(userId).stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(value = "tenantTransactionManager")
        public void deleteAssignment(Long taskId, String username) {
                Task task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new RuntimeException("Task not found"));

                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                username)
                                .orElseThrow(() -> new RuntimeException("User not found"))
                                .getUser()
                                .getId();

                assignmentRepository.deleteByUserIdAndTask(userId, task);

                // Log activity
                activityLogUtil.logActivity(ActivityAction.UNASSIGN_USER, "UserTaskAssignment", taskId);
        }

        public List<UserTaskAssignmentDTO> getTasksAssignedToCurrentUser() {
                String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
                Long userId = userTenantMappingRepository.findByTenantIdAndUsername(
                                TenantContext.getCurrentTenant(),
                                currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found in tenant mapping"))
                                .getUser()
                                .getId();

                List<UserTaskAssignment> assignments = assignmentRepository.findByUserId(userId);

                return assignments.stream()
                                .map(assignment -> {
                                        UserTaskAssignmentDTO dto = new UserTaskAssignmentDTO();
                                        dto.setTaskId(assignment.getTask().getId());
                                        dto.setAssignedAt(assignment.getAssignedAt());
                                        dto.setUsername(currentUsername);
                                        return dto;
                                })
                                .collect(Collectors.toList());
        }

        private UserTaskAssignmentDTO convertToDTO(UserTaskAssignment assignment) {
                UserTaskAssignmentDTO dto = new UserTaskAssignmentDTO();
                dto.setTaskId(assignment.getTask().getId());
                dto.setAssignedAt(assignment.getAssignedAt());

                // Get username from user ID
                userTenantMappingRepository.findByTenantIdAndUserId(
                                TenantContext.getCurrentTenant(),
                                assignment.getUserId())
                                .ifPresent(mapping -> dto.setUsername(mapping.getUsername()));

                return dto;
        }
}
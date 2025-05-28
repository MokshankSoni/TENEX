package com.tenex.service.tenant;

import com.tenex.dto.tenant.ProjectMilestoneDTO;
import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.ProjectMilestone;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.tenant.ProjectMilestoneRepository;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.security.tenant.ProjectMilestoneAuthorizationService;
import com.tenex.util.ActivityLogUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectMilestoneService {

    @Autowired
    private ProjectMilestoneRepository milestoneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ActivityLogUtil activityLogUtil;

    @Autowired
    private ProjectMilestoneAuthorizationService authorizationService;

    @Transactional(value = "tenantTransactionManager")
    public ProjectMilestoneDTO createMilestone(ProjectMilestoneDTO milestoneDTO) {
        if (!authorizationService.canCreateMilestone(milestoneDTO.getProjectId())) {
            throw new AccessDeniedException("You don't have permission to create milestones for this project");
        }

        Project project = projectRepository.findByIdWithManual(milestoneDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectMilestone milestone = new ProjectMilestone();
        milestone.setProject(project);
        milestone.setTitle(milestoneDTO.getTitle());
        milestone.setDescription(milestoneDTO.getDescription());
        milestone.setDueDate(milestoneDTO.getDueDate());
        milestone.setCompleted(milestoneDTO.isCompleted());

        ProjectMilestone savedMilestone = milestoneRepository.save(milestone);

        // Log activity
        activityLogUtil.logActivity(ActivityAction.CREATE_MILESTONE, "ProjectMilestone", savedMilestone.getId());

        return convertToDTO(savedMilestone);
    }

    @Transactional(value = "tenantTransactionManager")
    public Optional<ProjectMilestoneDTO> updateMilestone(Long id, ProjectMilestoneDTO milestoneDTO) {
        return milestoneRepository.findById(id)
                .map(milestone -> {
                    if (!authorizationService.canUpdateMilestone(milestone.getProject().getId())) {
                        throw new AccessDeniedException(
                                "You don't have permission to update milestones for this project");
                    }

                    milestone.setTitle(milestoneDTO.getTitle());
                    milestone.setDescription(milestoneDTO.getDescription());
                    milestone.setDueDate(milestoneDTO.getDueDate());
                    milestone.setCompleted(milestoneDTO.isCompleted());

                    ProjectMilestone updatedMilestone = milestoneRepository.save(milestone);

                    // Log activity
                    activityLogUtil.logActivity(ActivityAction.UPDATE_MILESTONE, "ProjectMilestone",
                            updatedMilestone.getId());

                    return convertToDTO(updatedMilestone);
                });
    }

    @Transactional(value = "tenantTransactionManager")
    public Optional<ProjectMilestoneDTO> toggleCompleted(Long id) {
        return milestoneRepository.findById(id)
                .map(milestone -> {
                    if (!authorizationService.canToggleCompleted(milestone.getProject().getId())) {
                        throw new AccessDeniedException(
                                "You don't have permission to toggle milestone completion for this project");
                    }

                    milestone.setCompleted(!milestone.getCompleted());
                    ProjectMilestone updatedMilestone = milestoneRepository.save(milestone);

                    // Log activity
                    activityLogUtil.logActivity(ActivityAction.COMPLETE_MILESTONE, "ProjectMilestone",
                            updatedMilestone.getId());

                    return convertToDTO(updatedMilestone);
                });
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<ProjectMilestoneDTO> getMilestoneById(Long id) {
        return milestoneRepository.findById(id)
                .map(milestone -> {
                    if (!authorizationService.canGetMilestoneById(milestone.getProject().getId())) {
                        throw new AccessDeniedException(
                                "You don't have permission to view milestones for this project");
                    }
                    return convertToDTO(milestone);
                });
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ProjectMilestoneDTO> getMilestonesByProject(Long projectId) {
        if (!authorizationService.canGetMilestonesByProject(projectId)) {
            throw new AccessDeniedException("You don't have permission to view milestones for this project");
        }

        Project project = projectRepository.findByIdWithManual(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return milestoneRepository.findByProject(project).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProjectMilestoneDTO convertToDTO(ProjectMilestone milestone) {
        return new ProjectMilestoneDTO(
                milestone.getId(),
                milestone.getProject().getId(),
                milestone.getTitle(),
                milestone.getDescription(),
                milestone.getDueDate(),
                milestone.getCompleted() != null ? milestone.getCompleted() : false);
    }
}
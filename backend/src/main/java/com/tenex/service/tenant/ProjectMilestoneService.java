package com.tenex.service.tenant;

import com.tenex.dto.tenant.ProjectMilestoneDTO;
import com.tenex.entity.tenant.Project;
import com.tenex.entity.tenant.ProjectMilestone;
import com.tenex.enums.ActivityAction;
import com.tenex.repository.tenant.ProjectMilestoneRepository;
import com.tenex.repository.tenant.ProjectRepository;
import com.tenex.util.ActivityLogUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Transactional(value = "tenantTransactionManager")
    public ProjectMilestoneDTO createMilestone(ProjectMilestoneDTO milestoneDTO) {
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
        activityLogUtil.logActivity(ActivityAction.CREATE_PROJECT, "ProjectMilestone", savedMilestone.getId());

        return convertToDTO(savedMilestone);
    }

    @Transactional(value = "tenantTransactionManager")
    public Optional<ProjectMilestoneDTO> updateMilestone(Long id, ProjectMilestoneDTO milestoneDTO) {
        return milestoneRepository.findById(id)
                .map(milestone -> {
                    milestone.setTitle(milestoneDTO.getTitle());
                    milestone.setDescription(milestoneDTO.getDescription());
                    milestone.setDueDate(milestoneDTO.getDueDate());
                    milestone.setCompleted(milestoneDTO.isCompleted());

                    ProjectMilestone updatedMilestone = milestoneRepository.save(milestone);

                    // Log activity
                    activityLogUtil.logActivity(ActivityAction.UPDATE_PROJECT, "ProjectMilestone",
                            updatedMilestone.getId());

                    return convertToDTO(updatedMilestone);
                });
    }

    @Transactional(value = "tenantTransactionManager")
    public Optional<ProjectMilestoneDTO> toggleCompleted(Long id) {
        return milestoneRepository.findById(id)
                .map(milestone -> {
                    milestone.setCompleted(!milestone.getCompleted());
                    ProjectMilestone updatedMilestone = milestoneRepository.save(milestone);

                    // Log activity
                    activityLogUtil.logActivity(ActivityAction.UPDATE_PROJECT, "ProjectMilestone",
                            updatedMilestone.getId());

                    return convertToDTO(updatedMilestone);
                });
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public Optional<ProjectMilestoneDTO> getMilestoneById(Long id) {
        return milestoneRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional(value = "tenantTransactionManager", readOnly = true)
    public List<ProjectMilestoneDTO> getMilestonesByProject(Long projectId) {
        Project project = projectRepository.findByIdWithManual(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return milestoneRepository.findByProject(project).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProjectMilestoneDTO convertToDTO(ProjectMilestone milestone) {
        return new ProjectMilestoneDTO(
                milestone.getId(),
                milestone.getProject().getId(), // Only include the project ID
                milestone.getTitle(),
                milestone.getDescription(),
                milestone.getDueDate(),
                milestone.getCompleted() != null ? milestone.getCompleted() : false);
    }
}
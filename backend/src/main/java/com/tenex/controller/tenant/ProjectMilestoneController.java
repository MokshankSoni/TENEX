package com.tenex.controller.tenant;

import com.tenex.dto.tenant.ProjectMilestoneDTO;
import com.tenex.service.tenant.ProjectMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
public class ProjectMilestoneController {

    @Autowired
    private ProjectMilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<ProjectMilestoneDTO> createMilestone(@RequestBody ProjectMilestoneDTO milestoneDTO) {
        return ResponseEntity.ok(milestoneService.createMilestone(milestoneDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectMilestoneDTO> updateMilestone(
            @PathVariable Long id,
            @RequestBody ProjectMilestoneDTO milestoneDTO) {
        return milestoneService.updateMilestone(id, milestoneDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-completed")
    public ResponseEntity<ProjectMilestoneDTO> toggleCompleted(@PathVariable Long id) {
        return milestoneService.toggleCompleted(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectMilestoneDTO> getMilestoneById(@PathVariable Long id) {
        return milestoneService.getMilestoneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectMilestoneDTO>> getMilestonesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(milestoneService.getMilestonesByProject(projectId));
    }
}
package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMilestoneDTO {
    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed;
}
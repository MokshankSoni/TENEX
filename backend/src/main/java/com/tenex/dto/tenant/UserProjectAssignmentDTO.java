package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProjectAssignmentDTO {
    private String username;
    private Long projectId;
    private String roleInProject;
    private LocalDateTime assignedAt;
}
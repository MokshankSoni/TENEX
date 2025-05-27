package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTaskAssignmentDTO {
    private String username;
    private Long taskId;
    private LocalDateTime assignedAt;
}
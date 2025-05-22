package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusHistoryDTO {
    private Long id;
    private Long taskId;
    private String oldStatus;
    private String newStatus;
    private Long changedBy;
    private LocalDateTime changedAt;
}
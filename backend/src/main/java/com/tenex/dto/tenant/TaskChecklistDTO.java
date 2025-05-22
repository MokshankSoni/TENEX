package com.tenex.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskChecklistDTO {
    private Long id;
    private Long taskId;
    private String item;
    private boolean completed;
}
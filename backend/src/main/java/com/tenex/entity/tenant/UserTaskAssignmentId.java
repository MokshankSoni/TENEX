package com.tenex.entity.tenant;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTaskAssignmentId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private Long task; // This matches the id field in Task entity
}
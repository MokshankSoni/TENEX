package com.tenex.entity.tenant;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProjectAssignmentId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;
    private Long project; // This matches the id field in Project entity
}
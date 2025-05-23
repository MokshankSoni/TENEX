package com.tenex.enums;

public enum ActivityAction {
    // Project actions
    CREATE_PROJECT,
    UPDATE_PROJECT,
    DELETE_PROJECT,

    // Task actions
    CREATE_TASK,
    UPDATE_TASK,
    DELETE_TASK,
    ASSIGN_TASK,
    UNASSIGN_TASK,

    // Comment actions
    CREATE_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT,

    // User-Project assignment actions
    ASSIGN_USER,
    UNASSIGN_USER,
    UPDATE_USER_ROLE
}
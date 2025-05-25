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
    UPDATE_USER_ROLE,

    // Task Status History actions
    CREATE_TASK_STATUS_HISTORY,
    DELETE_TASK_STATUS_HISTORY,

    // Task Checklist actions
    CREATE_TASK_CHECKLIST,
    UPDATE_TASK_CHECKLIST,
    DELETE_TASK_CHECKLIST,

    // Attachment actions
    UPLOAD_ATTACHMENT,
    DELETE_ATTACHMENT,

    // Project Milestone actions
    CREATE_MILESTONE,
    UPDATE_MILESTONE,
    DELETE_MILESTONE,
    COMPLETE_MILESTONE
}
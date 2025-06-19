// src/config/apiEndpoints.js

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGNIN: `${BASE_URL}/auth/signin`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  VERIFY_TOKEN: `${BASE_URL}/auth/verify-token`,
  GET_ALL_USERS: `${BASE_URL}/auth/users`,
  GET_ALL_TEAM_MEMBERS: `${BASE_URL}/auth/users/team-members`,
  ADD_MEMBER: `${BASE_URL}/assignments`,
  REMOVE_MEMBER: (username, projectId) => `${BASE_URL}/assignments/${username}/${projectId}`
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_USERS: `${BASE_URL}/users`,
  GET_USER: (id) => `${BASE_URL}/users/${id}`,
  CREATE_USER: `${BASE_URL}/users`,
  UPDATE_USER: (id) => `${BASE_URL}/users/${id}`,
  DELETE_USER: (id) => `${BASE_URL}/users/${id}`,
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`
};

// Project endpoints
export const PROJECT_ENDPOINTS = {
  GET_PROJECTS: `${BASE_URL}/projects`,
  GET_PROJECT: (id) => `${BASE_URL}/projects/${id}`,
  CREATE_PROJECT: `${BASE_URL}/projects`,
  UPDATE_PROJECT: (id) => `${BASE_URL}/projects/${id}`,
  UPDATE_PROJECT_STATUS: (id) => `${BASE_URL}/projects/${id}/status`,
  DELETE_PROJECT: (id) => `${BASE_URL}/projects/${id}`,
  GET_PROJECT_MEMBERS: (id) => `${BASE_URL}/projects/${id}/members`,
  ADD_PROJECT_MEMBER: (id) => `${BASE_URL}/projects/${id}/members`,
  REMOVE_PROJECT_MEMBER: (projectId, userId) => 
    `${BASE_URL}/projects/${projectId}/members/${userId}`,
  GET_PROJECT_MILESTONES: (id) => `${BASE_URL}/milestones/project/${id}`,
  CREATE_MILESTONE: `${BASE_URL}/milestones`,
  GET_ATTACHMENT_DOWNLOAD: 'http://localhost:8080/api/attachments',
  GET_PROJECTS_MINIMAL: `${BASE_URL}/projects/minimal`
};

// Task endpoints
export const TASK_ENDPOINTS = {
  GET_TASKS: `${BASE_URL}/tasks`,
  GET_TASK: (id) => `${BASE_URL}/tasks/${id}`,
  CREATE_TASK: `${BASE_URL}/tasks`,
  UPDATE_TASK: (id) => `${BASE_URL}/tasks/${id}`,
  DELETE_TASK: (id) => `${BASE_URL}/tasks/${id}`,
  ASSIGN_TASK: (id) => `${BASE_URL}/tasks/${id}/assign`,
  UPDATE_TASK_STATUS: (id) => `${BASE_URL}/tasks/${id}/status`,
  GET_TASK_COMMENTS: (id) => `${BASE_URL}/tasks/${id}/comments`,
  ADD_TASK_COMMENT: (id) => `${BASE_URL}/tasks/${id}/comments`,
  GET_TASK_ATTACHMENTS: (id) => `${BASE_URL}/tasks/${id}/attachments`,
  UPLOAD_TASK_ATTACHMENT: (id) => `${BASE_URL}/tasks/${id}/attachments`
};

// Tenant endpoints
export const TENANT_ENDPOINTS = {
  GET_TENANTS: `${BASE_URL}/tenants`,
  GET_TENANT: (id) => `${BASE_URL}/tenants/${id}`,
  CREATE_TENANT: `${BASE_URL}/tenants`,
  UPDATE_TENANT: (id) => `${BASE_URL}/tenants/${id}`,
  DELETE_TENANT: (id) => `${BASE_URL}/tenants/${id}`,
  GET_TENANT_SETTINGS: (id) => `${BASE_URL}/tenants/${id}/settings`,
  UPDATE_TENANT_SETTINGS: (id) => `${BASE_URL}/tenants/${id}/settings`
};

// Activity log endpoints
export const ACTIVITY_LOG_ENDPOINTS = {
  GET_ACTIVITY_LOGS: `${BASE_URL}/activity-logs`,
  GET_ACTIVITY_LOG: (id) => `${BASE_URL}/activity-logs/${id}`,
  GET_USER_ACTIVITY_LOGS: (userId) => `${BASE_URL}/activity-logs/user/${userId}`,
  GET_PROJECT_ACTIVITY_LOGS: (projectId) => 
    `${BASE_URL}/activity-logs/project/${projectId}`,
  DELETE_OLDEST_LOGS: `${BASE_URL}/activity-logs/oldest`
};


// User Project Assignment Endpoints
export const USER_PROJECT_ASSIGNMENT = {
    ADD_MEMBER: `${BASE_URL}/assignments`,
    REMOVE_MEMBER: (username, projectId) => `${BASE_URL}/assignments/${username}/${projectId}`,
    MY_ASSIGNMENTS: `${BASE_URL}/assignments/my-assignments`
};

// Task CheckList Endpoints
export const TASK_CHECKLIST = {
    ADD_TASK_CHECKLIST: `${BASE_URL}/task-checklists`,
    REMOVE_TASK_CHECKLIST: (id) => `${BASE_URL}/task-checklists/${id}`,
    TOGGLE_STATUS_CHECKLIST: (id) => `${BASE_URL}/task-checklists/${id}/togglestatus`
};

// Comment Endpoints
export const COMMENT_ENDPOINTS = {
    ADD_COMMENT:(taskId)=> `${BASE_URL}/comments/task/${taskId}`,
    DELETE_COMMENT:(commentId)=> `${BASE_URL}/comments/${commentId}`
};

// Comment Endpoints
export const ATTACHMENT_ENDPOINTS = {
  GET_ATTACHMENT_DOWNLOAD:(attachmentId) => `${BASE_URL}/attachments/${attachmentId}/download`,
  UPLOAD_ATTACHMENT : `${BASE_URL}/attachments/upload`
};
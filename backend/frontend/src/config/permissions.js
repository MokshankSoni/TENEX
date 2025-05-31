// src/config/permissions.js
import { ROLES } from '../utils/roleUtils';

// Permission constants
export const PERMISSIONS = {
  // User management permissions
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',

  // Project management permissions
  VIEW_PROJECTS: 'view_projects',
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',

  // Task management permissions
  VIEW_TASKS: 'view_tasks',
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task',
  DELETE_TASK: 'delete_task',
  ASSIGN_TASK: 'assign_task',

  // Tenant management permissions
  VIEW_TENANTS: 'view_tenants',
  CREATE_TENANT: 'create_tenant',
  EDIT_TENANT: 'edit_tenant',
  DELETE_TENANT: 'delete_tenant',

  // System management permissions
  VIEW_SYSTEM_SETTINGS: 'view_system_settings',
  EDIT_SYSTEM_SETTINGS: 'edit_system_settings',
  VIEW_ACTIVITY_LOGS: 'view_activity_logs',
  VIEW_ANALYTICS: 'view_analytics'
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // User management
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,

    // Project management
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,

    // Task management
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.DELETE_TASK,
    PERMISSIONS.ASSIGN_TASK,

    // Tenant management
    PERMISSIONS.VIEW_TENANTS,
    PERMISSIONS.CREATE_TENANT,
    PERMISSIONS.EDIT_TENANT,
    PERMISSIONS.DELETE_TENANT,

    // System management
    PERMISSIONS.VIEW_SYSTEM_SETTINGS,
    PERMISSIONS.EDIT_SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.TENANT_ADMIN]: [
    // User management
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,

    // Project management
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,

    // Task management
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.DELETE_TASK,
    PERMISSIONS.ASSIGN_TASK,

    // System management
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.PROJECT_MANAGER]: [
    // User management
    PERMISSIONS.VIEW_USERS,

    // Project management
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,

    // Task management
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.ASSIGN_TASK,

    // System management
    PERMISSIONS.VIEW_ANALYTICS
  ],

  [ROLES.TEAM_MEMBER]: [
    // Project management
    PERMISSIONS.VIEW_PROJECTS,

    // Task management
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.EDIT_TASK
  ],

  [ROLES.CLIENT]: [
    // Project management
    PERMISSIONS.VIEW_PROJECTS,

    // Task management
    PERMISSIONS.VIEW_TASKS
  ]
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} True if role has permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Get all permissions for a role
 * @param {string} role - User's role
 * @returns {string[]} Array of permissions
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
}; 
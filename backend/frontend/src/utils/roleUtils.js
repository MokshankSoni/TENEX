// src/utils/roleUtils.js

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  TENANT_ADMIN: 'ROLE_TENANT_ADMIN',
  PROJECT_MANAGER: 'ROLE_PROJECT_MANAGER',
  TEAM_MEMBER: 'ROLE_TEAM_MEMBER',
  CLIENT: 'ROLE_CLIENT'
};

// Role hierarchy (higher roles have access to lower roles' permissions)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: [
    ROLES.SUPER_ADMIN,
    ROLES.TENANT_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.TEAM_MEMBER,
    ROLES.CLIENT
  ],
  [ROLES.TENANT_ADMIN]: [
    ROLES.TENANT_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.TEAM_MEMBER,
    ROLES.CLIENT
  ],
  [ROLES.PROJECT_MANAGER]: [
    ROLES.PROJECT_MANAGER,
    ROLES.TEAM_MEMBER
  ],
  [ROLES.TEAM_MEMBER]: [ROLES.TEAM_MEMBER],
  [ROLES.CLIENT]: [ROLES.CLIENT]
};

// Role-based route access
export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: [
    '/super-admin',
    '/tenant-admin',
    '/project-manager',
    '/team-member',
    '/client'
  ],
  [ROLES.TENANT_ADMIN]: [
    '/tenant-admin',
    '/project-manager',
    '/team-member',
    '/client'
  ],
  [ROLES.PROJECT_MANAGER]: [
    '/project-manager',
    '/team-member'
  ],
  [ROLES.TEAM_MEMBER]: ['/team-member'],
  [ROLES.CLIENT]: ['/client']
};

// Dashboard routes for each role
export const DASHBOARD_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  [ROLES.TENANT_ADMIN]: '/tenant-admin/dashboard',
  [ROLES.PROJECT_MANAGER]: '/project-manager/dashboard',
  [ROLES.TEAM_MEMBER]: '/team-member/dashboard',
  [ROLES.CLIENT]: '/client/dashboard'
};

/**
 * Check if a user has access to a specific role
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean} True if user has access
 */
export const hasRoleAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return ROLE_HIERARCHY[userRole]?.includes(requiredRole) || false;
};

/**
 * Check if a user has access to a specific route
 * @param {string} userRole - User's role
 * @param {string} route - Route to check
 * @returns {boolean} True if user has access
 */
export const hasRouteAccess = (userRole, route) => {
  if (!userRole || !route) return false;
  return ROLE_ROUTES[userRole]?.some(allowedRoute => 
    route.startsWith(allowedRoute)
  ) || false;
};

/**
 * Get the dashboard route for a user role
 * @param {string} role - User's role
 * @returns {string} Dashboard route
 */
export const getDashboardRoute = (role) => {
  return DASHBOARD_ROUTES[role] || '/signin';
};

/**
 * Get all accessible roles for a user role
 * @param {string} role - User's role
 * @returns {string[]} Array of accessible roles
 */
export const getAccessibleRoles = (role) => {
  return ROLE_HIERARCHY[role] || [];
};

/**
 * Get all accessible routes for a user role
 * @param {string} role - User's role
 * @returns {string[]} Array of accessible routes
 */
export const getAccessibleRoutes = (role) => {
  return ROLE_ROUTES[role] || [];
}; 
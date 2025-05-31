// src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_DATA_KEY: 'userData',
  TENANT_DATA_KEY: 'tenantData',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  TENANT_ADMIN: 'ROLE_TENANT_ADMIN',
  PROJECT_MANAGER: 'ROLE_PROJECT_MANAGER',
  TEAM_MEMBER: 'ROLE_TEAM_MEMBER',
  CLIENT: 'ROLE_CLIENT'
};

// Route paths
export const ROUTES = {
  // Auth routes
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard routes
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  TENANT_ADMIN_DASHBOARD: '/tenant-admin/dashboard',
  PROJECT_MANAGER_DASHBOARD: '/project-manager/dashboard',
  TEAM_MEMBER_DASHBOARD: '/team-member/dashboard',
  CLIENT_DASHBOARD: '/client/dashboard',

  // Profile routes
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',

  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500'
};

// Dashboard routes mapping
export const DASHBOARD_ROUTES = {
  [USER_ROLES.SUPER_ADMIN]: ROUTES.SUPER_ADMIN_DASHBOARD,
  [USER_ROLES.TENANT_ADMIN]: ROUTES.TENANT_ADMIN_DASHBOARD,
  [USER_ROLES.PROJECT_MANAGER]: ROUTES.PROJECT_MANAGER_DASHBOARD,
  [USER_ROLES.TEAM_MEMBER]: ROUTES.TEAM_MEMBER_DASHBOARD,
  [USER_ROLES.CLIENT]: ROUTES.CLIENT_DASHBOARD
};

// Task status
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED'
};

// Task priority
export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Project status
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
};

// File upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_USERNAME: 'Username must be at least 3 characters long',
  INVALID_TENANT_ID: 'Tenant ID must be at least 2 characters long'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  INPUT: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// Theme colors (for reference)
export const THEME_COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: AUTH_CONFIG.TOKEN_KEY,
  USER_DATA: AUTH_CONFIG.USER_DATA_KEY,
  TENANT_DATA: AUTH_CONFIG.TENANT_DATA_KEY,
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed'
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password'
  },

  // Tenant endpoints
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id) => `/tenants/${id}`
  },

  // Project endpoints
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    TASKS: (id) => `/projects/${id}/tasks`
  },

  // Task endpoints
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    COMMENTS: (id) => `/tasks/${id}/comments`
  }
};

// Default values
export const DEFAULTS = {
  AVATAR: '/assets/images/default-avatar.png',
  PROJECT_IMAGE: '/assets/images/placeholder.png',
  ITEMS_PER_PAGE: PAGINATION.DEFAULT_PAGE_SIZE,
  DEBOUNCE_DELAY: 300 // milliseconds
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  TENANT_ID: /^[a-zA-Z0-9_-]{2,50}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,15}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Environment variables
export const ENV = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};
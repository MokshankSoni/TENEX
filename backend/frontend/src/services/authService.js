// src/services/authService.js
import api from './api';
import { setToken, removeToken, setUserData, removeUserData, setTenantId, removeTenantId, getToken, getTenantId, clearAllData } from '../utils/storageUtils';
import { AUTH_ENDPOINTS } from '../config/apiEndpoints';

// Sign in user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    console.log('Login Response:', response.data); // Log full response

    if (response.data.token) {
      // Store token and tenant ID
      setToken(response.data.token);
      if (response.data.tenantId) {
        setTenantId(response.data.tenantId);
      }
      
      // Store user data
      setUserData({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        tenantId: response.data.tenantId,
        roles: response.data.roles,
        token: response.data.token
      });

      // Verify storage
      const storedToken = getToken();
      const storedTenantId = getTenantId();
      console.log('Verification after storage:');
      console.log('Stored Token:', storedToken);
      console.log('Stored Tenant ID:', storedTenantId);
      
      return response;
    }
    throw new Error('No token received from server');
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Sign up user
export const signUp = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  // Clear all stored data
  clearAllData();
  
  // Clear any remaining headers in the API instance
  if (api.defaults.headers) {
    delete api.defaults.headers['Authorization'];
    delete api.defaults.headers['X-TenantID'];
  }
  
  // Force reload to clear any cached state
  window.location.href = '/signin';
};

// Get current user data
export const getCurrentUser = () => {
  return getUserData();
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.roles?.[0] || null;
};

// Get dashboard route based on user role
export const getDashboardRoute = () => {
  const user = getCurrentUser();
  if (user?.isSuperAdmin) {
    return '/super-admin/dashboard';
  } else if (user?.isTenantAdmin) {
    return '/tenant-admin/dashboard';
  }

  const role = user?.roles?.[0]?.name?.toLowerCase();
  const roleRoutes = {
    'project_manager': '/project-manager/dashboard',
    'team_member': '/team-member/dashboard',
    'client': '/client/dashboard'
  };

  return roleRoutes[role] || '/unauthorized';
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    if (response.data.token) {
      const user = getCurrentUser();
      user.token = response.data.token;
      setUserData(user);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.VERIFY_TOKEN);
    return response.data;
  } catch (error) {
    throw error;
  }
};
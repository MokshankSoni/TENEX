// src/services/authService.js
import api from './api';
import { setToken, removeToken, setUserData, removeUserData } from '../utils/storageUtils';
import { AUTH_ENDPOINTS } from '../config/apiEndpoints';

// Sign in user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    if (response.data.token) {
      setToken(response.data.token);
      setUserData({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        tenantId: response.data.tenantId,
        roles: response.data.roles,
        token: response.data.token
      });
      return response;
    }
    throw new Error('No token received from server');
  } catch (error) {
    throw error;
  }
};

// Sign up user
export const signUp = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return {
      success: true,
      data: response.data,
      message: 'Registration successful'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.',
      error: error.response?.data
    };
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send password reset email.',
      error: error.response?.data
    };
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
    return {
      success: false,
      message: error.response?.data?.message || 'Password reset failed.',
      error: error.response?.data
    };
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await api.post('/auth/signout');
    removeToken();
    removeUserData();
    return response;
  } catch (error) {
    throw error;
  }
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

// Get token
export const getToken = () => {
  const user = getCurrentUser();
  return user?.token;
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    if (response.data.token) {
      const user = getCurrentUser();
      user.token = response.data.token;
      localStorage.setItem('user', JSON.stringify(user));
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
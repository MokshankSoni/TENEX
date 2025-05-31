// src/utils/storageUtils.js

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Token management
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// User data management
export const setUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

// Tenant data management
export const setTenantData = (tenantData) => {
  localStorage.setItem('tenantData', JSON.stringify(tenantData));
};

export const getTenantData = () => {
  try {
    const tenantData = localStorage.getItem('tenantData');
    return tenantData ? JSON.parse(tenantData) : null;
  } catch (error) {
    console.error('Error parsing tenant data:', error);
    return null;
  }
};

export const removeTenantData = () => {
  localStorage.removeItem('tenantData');
};

// Clear all stored data
export const clearAllData = () => {
  removeToken();
  removeUserData();
  removeTenantData();
};

// Session storage utilities (for temporary data)
export const setSessionData = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getSessionData = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing session data for key ${key}:`, error);
    return null;
  }
};

export const removeSessionData = (key) => {
  sessionStorage.removeItem(key);
};

export const clearSessionData = () => {
  sessionStorage.clear();
};
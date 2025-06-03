// src/services/api.js
import axios from 'axios';
import { getToken, removeToken, getTenantId } from '../utils/storageUtils';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token and tenant ID
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const tenantId = getTenantId();

    console.log('API Request Interceptor:');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Retrieved Token:', token);
    console.log('Retrieved Tenant ID:', tenantId);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers['X-TenantID'] = tenantId;
    }

    console.log('Final Request Headers:', config.headers);

    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
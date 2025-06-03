// src/context/AuthContext.jsx
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINTS } from '../config/apiEndpoints';
import { getDashboardRoute } from '../utils/roleUtils';
import useLocalStorage from '../hooks/useLocalStorage';
import { logout } from '../services/authService';

// Create context
export const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = Boolean(token);

  // Sign in
  const signIn = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(AUTH_ENDPOINTS.SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setUser(data.user);
      setToken(data.token);

      // Redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute(data.user.roles[0]);
      navigate(dashboardRoute);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Sign out
  const signOut = useCallback(() => {
    logout();
  }, []);

  // Sign up
  const signUp = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Optionally sign in the user after successful registration
      await signIn({
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [signIn]);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      setToken(data.token);
      return data.token;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [token]);

  // Verify token
  const verifyToken = useCallback(async () => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.VERIFY_TOKEN, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token verification failed');
      }

      return data.valid;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [token]);

  // Check token validity on mount and periodically
  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const isValid = await verifyToken();
        if (!isValid) {
          signOut();
        }
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [token, verifyToken, signOut]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
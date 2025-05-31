import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../services/authService';
import { setToken, removeToken, getUserData } from '../utils/storageUtils';

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCurrentUser = useCallback(() => {
    return user || getUserData();
  }, [user]);

  const signIn = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await login(credentials);
      const userData = response.data;
      
      console.log('Login response:', userData); // Debug log
      
      setUser(userData);

      // Get the first role from the array and remove the 'ROLE_' prefix
      const role = userData.roles?.[0]?.replace('ROLE_', '');
      if (!role) {
        console.error('No role found in user data:', userData);
        navigate('/unauthorized');
        return;
      }

      // Redirect based on user role
      switch (role.toLowerCase()) {
        case 'super_admin':
          navigate('/super-admin/dashboard');
          break;
        case 'tenant_admin':
          navigate('/tenant-admin/dashboard');
          break;
        case 'project_manager':
          navigate('/project-manager/dashboard');
          break;
        case 'team_member':
          navigate('/team-member/dashboard');
          break;
        case 'client':
          navigate('/client/dashboard');
          break;
        default:
          console.warn('Unknown role:', role);
          navigate('/unauthorized');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.response?.data?.message || 'An error occurred during sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signOut = useCallback(() => {
    removeToken();
    setUser(null);
    navigate('/signin');
  }, [navigate]);

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    getCurrentUser,
    isAuthenticated: !!user
  };
}; 
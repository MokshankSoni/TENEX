// src/config/routes.js
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Auth Pages
import SignIn from '../pages/auth/SignIn/SignIn';
import SignUp from '../pages/auth/SignUp/SignUp';
import ForgotPassword from '../pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword/ResetPassword';

// Error Pages
import NotFound from '../pages/error/NotFound/NotFound';
import Unauthorized from '../pages/error/Unauthorized/Unauthorized';
import ServerError from '../pages/error/ServerError/ServerError';

// Client routes
import ClientDashboard from '../pages/client/Dashboard/Dashboard';

// Team Member routes
import TeamMemberDashboard from '../pages/team-member/Dashboard/Dashboard';

// Project Manager routes
import ProjectManagerDashboard from '../pages/project-manager/Dashboard/Dashboard';

// Tenant Admin routes
import TenantAdminDashboard from '../pages/tenant-admin/Dashboard/Dashboard';
import CreateProject from '../pages/tenant-admin/CreateProject/CreateProject';
import ProjectDashboard from '../pages/tenant-admin/ProjectDashboard/ProjectDashboard';

// Super Admin routes
import SuperAdminDashboard from '../pages/super-admin/Dashboard/Dashboard';

// All routes
export const routes = [
  // Auth routes
  {
    path: '/signin',
    element: SignIn,
    title: 'Sign In'
  },
  {
    path: '/signup',
    element: SignUp,
    title: 'Sign Up'
  },
  {
    path: '/forgot-password',
    element: ForgotPassword,
    title: 'Forgot Password'
  },
  {
    path: '/reset-password',
    element: ResetPassword,
    title: 'Reset Password'
  },

  // Dashboard routes
  {
    path: '/client/dashboard',
    element: ClientDashboard,
    title: 'Client Dashboard'
  },
  {
    path: '/team-member/dashboard',
    element: TeamMemberDashboard,
    title: 'Team Member Dashboard'
  },
  {
    path: '/project-manager/dashboard',
    element: ProjectManagerDashboard,
    title: 'Project Manager Dashboard'
  },
  {
    path: '/tenant-admin/dashboard',
    element: TenantAdminDashboard,
    title: 'Tenant Admin Dashboard'
  },
  {
    path: '/tenant-admin/create-project',
    element: CreateProject,
    title: 'Create Project'
  },
  {
    path: '/tenant-admin/project/:projectId',
    element: ProjectDashboard,
    title: 'Project Dashboard'
  },
  {
    path: '/super-admin/dashboard',
    element: SuperAdminDashboard,
    title: 'Super Admin Dashboard'
  },

  // Error routes
  {
    path: '/unauthorized',
    element: Unauthorized,
    title: 'Unauthorized'
  },
  {
    path: '/server-error',
    element: ServerError,
    title: 'Server Error'
  },
  {
    path: '/404',
    element: NotFound,
    title: 'Not Found'
  },

  // Redirects
  {
    path: '/',
    element: () => <Navigate to="/signin" replace />,
    title: 'Sign In'
  },
  {
    path: '*',
    element: () => <Navigate to="/404" replace />,
    title: 'Not Found'
  }
]; 
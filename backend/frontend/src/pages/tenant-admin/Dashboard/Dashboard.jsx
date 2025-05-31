import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const TenantAdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.username || 'Tenant Admin'}</h1>
          <p>Here's an overview of your tenant</p>
        </div>
        <button className="logout-button" onClick={signOut}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-grid">
        {/* Tenant Overview */}
        <div className="dashboard-card">
          <h2>Tenant Overview</h2>
          <div className="tenant-stats">
            <div className="stat-item">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">150</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Projects</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">System Uptime</span>
              <span className="stat-value">99.9%</span>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="dashboard-card">
          <h2>User Management</h2>
          <div className="user-stats">
            <div className="user-stat-item">
              <h3>Active Users</h3>
              <div className="user-metrics">
                <span className="user-value">120</span>
                <span className="user-label">out of 150</span>
              </div>
            </div>
            <div className="user-stat-item">
              <h3>User Roles</h3>
              <div className="role-list">
                <div className="role-item">
                  <span className="role-name">Project Managers</span>
                  <span className="role-count">15</span>
                </div>
                <div className="role-item">
                  <span className="role-name">Team Members</span>
                  <span className="role-count">85</span>
                </div>
                <div className="role-item">
                  <span className="role-name">Clients</span>
                  <span className="role-count">20</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="dashboard-card">
          <h2>System Health</h2>
          <div className="health-metrics">
            <div className="health-item">
              <h3>Server Status</h3>
              <span className="status-indicator online">Online</span>
            </div>
            <div className="health-item">
              <h3>Storage Usage</h3>
              <div className="usage-bar">
                <div className="usage-progress" style={{ width: '65%' }}></div>
              </div>
              <span className="usage-value">65% Used</span>
            </div>
            <div className="health-item">
              <h3>API Response Time</h3>
              <span className="response-time">45ms</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <button className="action-button">Manage Users</button>
          <button className="action-button">Configure Settings</button>
          <button className="action-button">View Analytics</button>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminDashboard; 
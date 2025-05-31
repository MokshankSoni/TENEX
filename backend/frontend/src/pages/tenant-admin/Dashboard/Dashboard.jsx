import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const TenantAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="tenant-admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Tenant Admin Dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* Tenant Overview Card */}
        <div className="dashboard-card">
          <h2>Tenant Overview</h2>
          <div className="card-content">
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
        </div>

        {/* User Management Card */}
        <div className="dashboard-card">
          <h2>User Management</h2>
          <div className="card-content">
            <div className="user-stats">
              <div className="user-stat-item">
                <h3>Active Users</h3>
                <div className="user-metrics">
                  <span className="user-value">120</span>
                  <span className="user-label">Total</span>
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
        </div>

        {/* System Health Card */}
        <div className="dashboard-card">
          <h2>System Health</h2>
          <div className="card-content">
            <div className="health-metrics">
              <div className="health-item">
                <h3>Server Status</h3>
                <div className="status-indicator online">Online</div>
              </div>
              <div className="health-item">
                <h3>Storage Usage</h3>
                <div className="usage-bar">
                  <div className="usage-progress" style={{ width: '65%' }}></div>
                </div>
                <span className="usage-value">65%</span>
              </div>
              <div className="health-item">
                <h3>API Response Time</h3>
                <span className="response-time">45ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="card-content">
            <button className="action-button">Manage Users</button>
            <button className="action-button">Configure Settings</button>
            <button className="action-button">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminDashboard; 
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Super Admin Dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* Platform Overview Card */}
        <div className="dashboard-card">
          <h2>Platform Overview</h2>
          <div className="card-content">
            <div className="platform-stats">
              <div className="stat-item">
                <span className="stat-label">Total Tenants</span>
                <span className="stat-value">25</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">1,500</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Platform Uptime</span>
                <span className="stat-value">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Management Card */}
        <div className="dashboard-card">
          <h2>Tenant Management</h2>
          <div className="card-content">
            <div className="tenant-list">
              <div className="tenant-item">
                <h3>Tenant Alpha</h3>
                <div className="tenant-info">
                  <span className="tenant-users">150 users</span>
                  <span className="tenant-status active">Active</span>
                </div>
                <div className="tenant-plan">Enterprise Plan</div>
              </div>
              <div className="tenant-item">
                <h3>Tenant Beta</h3>
                <div className="tenant-info">
                  <span className="tenant-users">75 users</span>
                  <span className="tenant-status active">Active</span>
                </div>
                <div className="tenant-plan">Professional Plan</div>
              </div>
              <div className="tenant-item">
                <h3>Tenant Gamma</h3>
                <div className="tenant-info">
                  <span className="tenant-users">200 users</span>
                  <span className="tenant-status active">Active</span>
                </div>
                <div className="tenant-plan">Enterprise Plan</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Monitoring Card */}
        <div className="dashboard-card">
          <h2>System Monitoring</h2>
          <div className="card-content">
            <div className="monitoring-metrics">
              <div className="metric-item">
                <h3>Server Load</h3>
                <div className="load-indicator">
                  <div className="load-bar">
                    <div className="load-progress" style={{ width: '45%' }}></div>
                  </div>
                  <span className="load-value">45%</span>
                </div>
              </div>
              <div className="metric-item">
                <h3>Database Performance</h3>
                <div className="db-metrics">
                  <div className="db-metric">
                    <span className="metric-label">Query Time</span>
                    <span className="metric-value">45ms</span>
                  </div>
                  <div className="db-metric">
                    <span className="metric-label">Connections</span>
                    <span className="metric-value">250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="card-content">
            <button className="action-button">Create New Tenant</button>
            <button className="action-button">Manage Subscriptions</button>
            <button className="action-button">System Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 
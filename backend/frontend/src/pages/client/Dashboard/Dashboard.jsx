import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Client Dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* Project Overview Card */}
        <div className="dashboard-card">
          <h2>Project Overview</h2>
          <div className="card-content">
            <div className="project-list">
              <div className="project-item">
                <h3>Alpha Project</h3>
                <div className="project-status">
                  <span className="status-badge in-progress">In Progress</span>
                  <span className="completion">75% Complete</span>
                </div>
              </div>
              <div className="project-item">
                <h3>Beta Project</h3>
                <div className="project-status">
                  <span className="status-badge pending">Pending</span>
                  <span className="completion">45% Complete</span>
                </div>
              </div>
              <div className="project-item">
                <h3>Gamma Project</h3>
                <div className="project-status">
                  <span className="status-badge completed">Completed</span>
                  <span className="completion">100% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Monitoring Card */}
        <div className="dashboard-card">
          <h2>Task Monitoring</h2>
          <div className="card-content">
            <div className="task-stats">
              <div className="stat-item">
                <span className="stat-label">Total Tasks</span>
                <span className="stat-value">24</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">12</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">8</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pending</span>
                <span className="stat-value">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates Card */}
        <div className="dashboard-card">
          <h2>Recent Updates</h2>
          <div className="card-content">
            <div className="update-list">
              <div className="update-item">
                <h3>Alpha Project Update</h3>
                <p>New features deployed to staging</p>
                <span className="update-time">2 hours ago</span>
              </div>
              <div className="update-item">
                <h3>Beta Project Update</h3>
                <p>Design review completed</p>
                <span className="update-time">1 day ago</span>
              </div>
              <div className="update-item">
                <h3>Gamma Project Update</h3>
                <p>Final testing phase started</p>
                <span className="update-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="card-content">
            <button className="action-button">Request New Project</button>
            <button className="action-button">View Reports</button>
            <button className="action-button">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 
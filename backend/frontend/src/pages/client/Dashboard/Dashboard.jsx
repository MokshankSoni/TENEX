import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const ClientDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.username || 'Client'}</h1>
          <p>Here's an overview of your projects and tasks</p>
        </div>
        <button className="logout-button" onClick={signOut}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-grid">
        {/* Project Overview */}
        <div className="dashboard-card">
          <h2>Project Overview</h2>
          <div className="project-list">
            <div className="project-item">
              <h3>Website Redesign</h3>
              <div className="project-status">
                <span className="status-badge in-progress">In Progress</span>
                <span className="completion">75% Complete</span>
              </div>
            </div>
            <div className="project-item">
              <h3>Mobile App Development</h3>
              <div className="project-status">
                <span className="status-badge pending">Pending</span>
                <span className="completion">30% Complete</span>
              </div>
            </div>
            <div className="project-item">
              <h3>E-commerce Integration</h3>
              <div className="project-status">
                <span className="status-badge completed">Completed</span>
                <span className="completion">100% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Monitoring */}
        <div className="dashboard-card">
          <h2>Task Monitoring</h2>
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

        {/* Recent Updates */}
        <div className="dashboard-card">
          <h2>Recent Updates</h2>
          <div className="update-list">
            <div className="update-item">
              <h3>Website Redesign</h3>
              <p>New homepage design approved</p>
              <span className="update-time">2 hours ago</span>
            </div>
            <div className="update-item">
              <h3>Mobile App</h3>
              <p>Beta testing phase completed</p>
              <span className="update-time">1 day ago</span>
            </div>
            <div className="update-item">
              <h3>E-commerce</h3>
              <p>Payment gateway integration successful</p>
              <span className="update-time">2 days ago</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <button className="action-button">View Project Details</button>
          <button className="action-button">Request Changes</button>
          <button className="action-button">Download Reports</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 
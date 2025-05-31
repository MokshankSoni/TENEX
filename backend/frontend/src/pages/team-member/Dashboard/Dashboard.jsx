import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const TeamMemberDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.username || 'Team Member'}</h1>
          <p>Here's an overview of your tasks and projects</p>
        </div>
        <button className="logout-button" onClick={signOut}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-grid">
        {/* My Tasks */}
        <div className="dashboard-card">
          <h2>My Tasks</h2>
          <div className="task-list">
            <div className="task-item">
              <div className="task-status in-progress"></div>
              <div className="task-info">
                <h3>Implement User Authentication</h3>
                <p>Frontend Development</p>
                <span className="task-deadline">Due: 2024-03-15</span>
              </div>
            </div>
            <div className="task-item">
              <div className="task-status pending"></div>
              <div className="task-info">
                <h3>API Integration</h3>
                <p>Backend Development</p>
                <span className="task-deadline">Due: 2024-03-20</span>
              </div>
            </div>
            <div className="task-item">
              <div className="task-status completed"></div>
              <div className="task-info">
                <h3>Database Schema Design</h3>
                <p>Database</p>
                <span className="task-deadline">Completed: 2024-03-10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="dashboard-card">
          <h2>Project Progress</h2>
          <div className="project-progress">
            <div className="progress-item">
              <span className="progress-label">Frontend Development</span>
              <span className="progress-value">75%</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Backend Development</span>
              <span className="progress-value">60%</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Testing</span>
              <span className="progress-value">40%</span>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="dashboard-card">
          <h2>Upcoming Deadlines</h2>
          <div className="deadline-list">
            <div className="deadline-item">
              <h3>User Authentication</h3>
              <p>Due in 3 days</p>
            </div>
            <div className="deadline-item">
              <h3>API Documentation</h3>
              <p>Due in 5 days</p>
            </div>
            <div className="deadline-item">
              <h3>Unit Tests</h3>
              <p>Due in 7 days</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <button className="action-button">Update Task Status</button>
          <button className="action-button">View Project Details</button>
          <button className="action-button">Request Time Off</button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard; 
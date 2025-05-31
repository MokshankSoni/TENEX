import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const ProjectManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="project-manager-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Project Manager Dashboard</p>
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

        {/* Team Performance Card */}
        <div className="dashboard-card">
          <h2>Team Performance</h2>
          <div className="card-content">
            <div className="performance-list">
              <div className="performance-item">
                <div className="team-info">
                  <h3>Frontend Team</h3>
                  <p>5 members</p>
                </div>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-label">Tasks Completed</span>
                    <span className="metric-value">45/50</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">On Time</span>
                    <span className="metric-value">90%</span>
                  </div>
                </div>
              </div>
              <div className="performance-item">
                <div className="team-info">
                  <h3>Backend Team</h3>
                  <p>4 members</p>
                </div>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-label">Tasks Completed</span>
                    <span className="metric-value">38/40</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">On Time</span>
                    <span className="metric-value">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Allocation Card */}
        <div className="dashboard-card">
          <h2>Resource Allocation</h2>
          <div className="card-content">
            <div className="resource-list">
              <div className="resource-item">
                <h3>Frontend Development</h3>
                <div className="resource-metrics">
                  <span className="resource-value">5/6</span>
                  <span className="resource-label">Developers</span>
                </div>
              </div>
              <div className="resource-item">
                <h3>Backend Development</h3>
                <div className="resource-metrics">
                  <span className="resource-value">4/4</span>
                  <span className="resource-label">Developers</span>
                </div>
              </div>
              <div className="resource-item">
                <h3>QA Testing</h3>
                <div className="resource-metrics">
                  <span className="resource-value">2/3</span>
                  <span className="resource-label">Testers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="card-content">
            <button className="action-button">Create New Project</button>
            <button className="action-button">Assign Tasks</button>
            <button className="action-button">Generate Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard; 
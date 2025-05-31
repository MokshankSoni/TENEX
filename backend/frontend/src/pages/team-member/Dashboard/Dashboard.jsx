import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Dashboard.css';

const TeamMemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="team-member-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Team Member Dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* My Tasks Card */}
        <div className="dashboard-card">
          <h2>My Tasks</h2>
          <div className="card-content">
            <div className="task-list">
              <div className="task-item">
                <span className="task-status in-progress"></span>
                <div className="task-info">
                  <h3>UI Component Development</h3>
                  <p>Project: Alpha</p>
                  <span className="task-deadline">Due: 2 days</span>
                </div>
              </div>
              <div className="task-item">
                <span className="task-status pending"></span>
                <div className="task-info">
                  <h3>Code Review</h3>
                  <p>Project: Beta</p>
                  <span className="task-deadline">Due: 3 days</span>
                </div>
              </div>
              <div className="task-item">
                <span className="task-status completed"></span>
                <div className="task-info">
                  <h3>Documentation Update</h3>
                  <p>Project: Gamma</p>
                  <span className="task-deadline">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress Card */}
        <div className="dashboard-card">
          <h2>Project Progress</h2>
          <div className="card-content">
            <div className="project-progress">
              <div className="progress-item">
                <span className="progress-label">Alpha Project</span>
                <span className="progress-value">75%</span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Beta Project</span>
                <span className="progress-value">45%</span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Gamma Project</span>
                <span className="progress-value">90%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="dashboard-card">
          <h2>Upcoming Deadlines</h2>
          <div className="card-content">
            <div className="deadline-list">
              <div className="deadline-item">
                <h3>UI Review Meeting</h3>
                <p>Tomorrow, 10:00 AM</p>
              </div>
              <div className="deadline-item">
                <h3>Code Submission</h3>
                <p>Friday, 5:00 PM</p>
              </div>
              <div className="deadline-item">
                <h3>Project Demo</h3>
                <p>Next Monday, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="card-content">
            <button className="action-button">Update Task Status</button>
            <button className="action-button">View Team Calendar</button>
            <button className="action-button">Submit Work Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard; 
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import './Dashboard.css';

const TenantAdminDashboard = () => {
  const { user, signOut } = useAuth();

  // Temporary hardcoded data
  const dashboardData = {
    totalProjects: 42,
    activeProjects: 30,
    completedProjects: 12,
    totalUsers: 120,
    userBreakdown: {
      projectManagers: 15,
      teamMembers: 85,
      clients: 20
    },
    openTasks: 185,
    overdueTasks: 25,
    dueThisWeek: 45,
    projectStatus: [
      { status: 'Completed', count: 12, color: '#4CAF50' },
      { status: 'In Progress', count: 30, color: '#2196F3' }
    ],
    recentActivity: [
      { user: 'John D.', action: 'created Project "New Marketing Initiative"', time: '5 mins ago' },
      { user: 'Sarah M.', action: 'updated Task "Website Redesign"', time: '15 mins ago' },
      { user: 'Mike R.', action: 'added new team member', time: '1 hour ago' },
      { user: 'Lisa K.', action: 'completed milestone "Phase 1"', time: '2 hours ago' },
      { user: 'David P.', action: 'uploaded project documents', time: '3 hours ago' }
    ]
  };

  const handleProfileClick = () => {
    // This function will be implemented later for profile details
    console.log('Profile clicked');
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-role">Tenant Admin</span>
            <span className="user-name">{user?.username || 'John Smith'}</span>
          </div>
          <div className="profile-icon" onClick={handleProfileClick}>
            <FaUserCircle size={32} />
          </div>
          <button className="logout-button" onClick={signOut}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Row 1: Key Performance Indicators */}
        <div className="kpi-row">
          <div className="kpi-card" onClick={() => window.location.href = '/projects'}>
            <div className="kpi-icon">
              <FaProjectDiagram />
            </div>
            <div className="kpi-content">
              <h3>Projects</h3>
              <div className="kpi-value">{dashboardData.totalProjects}</div>
              <div className="kpi-subtext">
                {dashboardData.activeProjects} Active / {dashboardData.completedProjects} Completed
              </div>
            </div>
          </div>

          <div className="kpi-card" onClick={() => window.location.href = '/users'}>
            <div className="kpi-icon">
              <FaUsers />
            </div>
            <div className="kpi-content">
              <h3>Users</h3>
              <div className="kpi-value">{dashboardData.totalUsers}</div>
              <div className="kpi-subtext">
                {dashboardData.userBreakdown.projectManagers} PMs, {dashboardData.userBreakdown.teamMembers} TMs, {dashboardData.userBreakdown.clients} Clients
              </div>
            </div>
          </div>

          <div className="kpi-card" onClick={() => window.location.href = '/tasks'}>
            <div className="kpi-icon">
              <FaTasks />
            </div>
            <div className="kpi-content">
              <h3>Open Tasks</h3>
              <div className="kpi-value">{dashboardData.openTasks}</div>
              <div className="kpi-subtext">
                <span className="overdue">{dashboardData.overdueTasks} Overdue</span> / {dashboardData.dueThisWeek} Due This Week
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Project Status Chart and Quick Actions */}
        <div className="middle-row">
          <div className="chart-card">
            <h3>Project Status Overview</h3>
            <div className="chart-container">
              <div className="chart-placeholder">
                <FaChartPie size={48} />
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
                    <span className="legend-label">Completed ({dashboardData.completedProjects})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
                    <span className="legend-label">In Progress ({dashboardData.activeProjects})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-button primary">
                <FaPlus /> Project
              </button>
              <button className="action-button">
                <FaUserPlus /> Add New User
              </button>
              <button className="action-button">
                <FaClipboardList /> View All Assignments
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Recent Activity */}
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-button">View All Activity</button>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminDashboard; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import ProjectPopup from '../ProjectPopup/ProjectPopup';
import { getToken, getTenantId, getUserData } from '../../../utils/storageUtils';
import { PROJECT_ENDPOINTS } from '../../../config/apiEndpoints';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const TenantAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProjectPopupOpen, setIsProjectPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  // Storage utilities
  const token = getToken();
  const tenantId = getTenantId();
  const userData = getUserData();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/signin');
        return;
      }

      if (!tenantId) {
        setError('Tenant ID not found. Please login again.');
        navigate('/signin');
        return;
      }

      const response = await axios.get(PROJECT_ENDPOINTS.GET_PROJECTS_MINIMAL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view projects.');
      } else {
        setError('Failed to fetch projects. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusCounts = () => {
    const counts = {
      'ACTIVE': 0,
      'COMPLETED': 0,
      'ON_HOLD': 0,
      'CANCELLED': 0
    };

    projects.forEach(project => {
      counts[project.status] = (counts[project.status] || 0) + 1;
    });

    return counts;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#4CAF50'; // Green
      case 'COMPLETED':
        return '#2196F3'; // Blue
      case 'ON_HOLD':
        return '#FF9800'; // Orange
      case 'CANCELLED':
        return '#F44336'; // Red
      default:
        return '#718096'; // Gray
    }
  };

  const getChartData = () => {
    const statusCounts = getStatusCounts();
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = labels.map(status => getStatusColor(status));
    const hoverColors = backgroundColors.map(color => color + 'CC');

    return {
      labels: labels.map(label => label.replace('_', ' ')),
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 4
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 13,
          family: "'Roboto', sans-serif",
          weight: '600'
        },
        bodyFont: {
          size: 12,
          family: "'Roboto', sans-serif"
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
          title: function(context) {
            return `Project Status: ${context[0].label}`;
          }
        }
      }
    },
    cutout: '40%',
    radius: '80%'
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="tenant-id-display">
            <span className="tenant-label">TENANT</span>
            <span className="tenant-value">{tenantId?.toUpperCase() || 'NOT FOUND'}</span>
          </h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-role">Tenant Admin</span>
            <span className="user-name">{userData?.username || 'Guest'}</span>
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
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {/* Row 1: Key Performance Indicators */}
            <div className="kpi-row">
              <div className="kpi-card" onClick={() => setIsProjectPopupOpen(true)}>
                <div className="kpi-icon">
                  <FaProjectDiagram />
                </div>
                <div className="kpi-content">
                  <h3>Projects</h3>
                  <div className="kpi-value">{projects.length}</div>
                  <div className="kpi-subtext">
                    {projects.filter(p => p.status === 'ACTIVE').length} Active / {projects.filter(p => p.status === 'COMPLETED').length} Completed
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
                <div className="chart-header">
                  <h3>Project Status Overview</h3>
                  <div className="chart-summary">
                    <span>Total Projects: {projects.length}</span>
                  </div>
                </div>
                <div className="chart-container">
                  <Pie data={getChartData()} options={chartOptions} />
                </div>
              </div>

              <div className="quick-actions-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button 
                    className="action-button primary"
                    onClick={() => navigate('/tenant-admin/create-project')}
                  >
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
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
              <button className="view-all-button">View All Activity</button>
            </div>
          </>
        )}
      </div>

      <ProjectPopup 
        isOpen={isProjectPopupOpen} 
        onClose={() => setIsProjectPopupOpen(false)} 
      />
    </div>
  );
};

export default TenantAdminDashboard; 
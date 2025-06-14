import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle, FaTimes, FaSearch, FaEnvelope, FaUserTag, FaTrash, FaChartBar } from 'react-icons/fa';
import ProjectPopup from '../ProjectPopup/ProjectPopup';
import TaskReportPopUp from './TaskReportPopUp/TaskReportPopUp';
import DeleteProjectPopup from './DeleteProjectPopUp/DeleteProjectPopup';
import ActivityLogsPopup from './ActivityLogsPopup/ActivityLogsPopup';
import ProjectReportPopUp from './ProjectReportPopUp/ProjectReportPopUp';
import { getToken, getTenantId, getUserData } from '../../../utils/storageUtils';
import { PROJECT_ENDPOINTS, AUTH_ENDPOINTS, TASK_ENDPOINTS, ANALYTICS_ENDPOINTS, ACTIVITY_LOG_ENDPOINTS } from '../../../config/apiEndpoints';
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
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showUsersPopup, setShowUsersPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showTaskReport, setShowTaskReport] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showProjectReport, setShowProjectReport] = useState(false);

  // Storage utilities
  const token = getToken();
  const tenantId = getTenantId();
  const userData = getUserData();

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchTasks();
    fetchActivityLogs();
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

  const fetchUsers = async () => {
    try {
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      if (!tenantId) {
        console.error('Tenant ID not found');
        return;
      }

      const response = await axios.get(AUTH_ENDPOINTS.GET_ALL_USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      if (!tenantId) {
        console.error('Tenant ID not found');
        return;
      }

      const response = await axios.get(TASK_ENDPOINTS.GET_TASKS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view tasks.');
      } else {
        setError('Failed to fetch tasks. Please try again.');
      }
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await axios.get(ACTIVITY_LOG_ENDPOINTS.GET_ACTIVITY_LOGS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-TenantId': tenantId
        }
      });
      setActivityLogs(response.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
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

  const handleCloseUsersPopup = () => {
    setShowUsersPopup(false);
    setSearchQuery('');
    setSelectedRole('all');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setSelectedRole(e.target.value);
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || 
                         user.roles.some(role => role.toLowerCase().includes(selectedRole.toLowerCase()));
      return matchesSearch && matchesRole;
    });
  };

  const formatRole = (roles) => {
    return roles.map(role => {
      const roleName = role.replace('ROLE_', '').toLowerCase();
      switch (roleName) {
        case 'tenant_admin':
          return 'Tenant Admin';
        case 'project_manager':
          return 'Project Manager';
        case 'team_member':
          return 'Team Member';
        case 'client':
          return 'Client';
        default:
          return roleName;
      }
    }).join(', ');
  };

  const getRoleColor = (roles) => {
    const role = roles[0]?.toLowerCase() || '';
    if (role.includes('tenant_admin')) return '#4CAF50'; // Green
    if (role.includes('project_manager')) return '#2196F3'; // Blue
    if (role.includes('team_member')) return '#FF9800'; // Orange
    if (role.includes('client')) return '#9C27B0'; // Purple
    return '#718096'; // Gray
  };

  const filteredUsers = getFilteredUsers();

  const handleDeleteProject = async (projectId) => {
    try {
      const token = getToken();
      const tenantId = getTenantId();
      
      if (!token || !tenantId) {
        setError('Authentication token or tenant ID is missing');
        return;
      }

      await axios.delete(`${PROJECT_ENDPOINTS.DELETE_PROJECT}/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId
        }
      });

      // Remove the deleted project from the state
      setProjects(projects.filter(project => project.id !== projectId));
      setShowDeleteProject(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatAction = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="dashboard-container">
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

              <div className="kpi-card" onClick={() => setShowUsersPopup(true)}>
                <div className="kpi-icon">
                  <FaUsers />
                </div>
                <div className="kpi-content">
                  <h3>Members</h3>
                  <span className="kpi-value">{users.length}</span>
                  <p className="kpi-subtext">View all team members</p>
                </div>
              </div>

              <div className="kpi-card" onClick={() => setShowTaskReport(true)}>
                <div className="kpi-icon">
                  <FaTasks />
                </div>
                <div className="kpi-content">
                  <h3>Open Tasks</h3>
                  <div className="kpi-value">{tasks.length}</div>
                  <div className="kpi-subtext">
                    <span className="overdue">{tasks.filter(task => task.status.toUpperCase() === 'TODO').length} To Do</span> / {tasks.filter(task => task.status.toUpperCase() === 'IN_PROGRESS').length} In Progress
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
                  <button className="action-delete" onClick={() => setShowDeleteProject(true)}>
                    <FaTrash /> Project
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => setShowProjectReport(true)}
                  >
                    <FaClipboardList /> Project Report
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Recent Activity */}
            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {[...activityLogs]
                  .reverse()
                  .slice(0, 5)
                  .map((log) => (
                    <div key={log.id} className="activity-item">
                      <div className="activity-info">
                        <span className="user-name">{getUserName(log.userId)}</span>
                        <span className="activity-action">{formatAction(log.action)}</span>
                        <span className="activity-time">{getTimeAgo(log.timestamp)}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <button 
                className="view-all-button"
                onClick={() => setShowActivityLogs(true)}
              >
                View All Activity
              </button>
            </div>
          </>
        )}
      </div>

      {showUsersPopup && (
        <div className="popup-overlay">
          <div className="add-member-popup">
            <div className="popup-header">
              <h2>Members</h2>
              <button className="close-button" onClick={handleCloseUsersPopup}>
                <FaTimes />
              </button>
            </div>

            <div className="popup-content">
              <div className="filters">
                <div className="search-box">

                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                <select
                  className="role-filter"
                  value={selectedRole}
                  onChange={handleRoleFilter}
                >
                  <option value="all">All Roles</option>
                  <option value="ROLE_TENANT_ADMIN">Tenant Admin</option>
                  <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                  <option value="ROLE_TEAM_MEMBER">Team Member</option>
                  <option value="ROLE_CLIENT">Client</option>
                </select>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={fetchUsers}>Retry</button>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="no-users-message">
                  <FaUsers className="no-users-icon" />
                  <p>No users found matching your criteria.</p>
                </div>
              ) : (
                <div className="users-list">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="user-card">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-header">
                          <h3>{user.username}</h3>
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="role-badge"
                              style={{ backgroundColor: getRoleColor(user.roles) }}
                            >
                              {formatRole([role])}
                            </span>
                          ))}
                        </div>
                        <div className="user-details">
                          <div className="detail-item">
                            <FaEnvelope className="detail-icon" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TaskReportPopUp 
        isOpen={showTaskReport}
        onClose={() => setShowTaskReport(false)}
        tasks={tasks}
      />

      <ProjectPopup 
        isOpen={isProjectPopupOpen} 
        onClose={() => setIsProjectPopupOpen(false)} 
      />

      <DeleteProjectPopup
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        projects={projects}
        onDelete={handleDeleteProject}
      />

      <ProjectReportPopUp
        isOpen={showProjectReport}
        onClose={() => setShowProjectReport(false)}
        projects={projects}
      />

      {showActivityLogs && (
        <ActivityLogsPopup
          isOpen={showActivityLogs}
          onClose={() => setShowActivityLogs(false)}
          activityLogs={activityLogs}
          users={users}
          getUserName={getUserName}
          getTimeAgo={getTimeAgo}
          formatAction={formatAction}
          onLogsDeleted={fetchActivityLogs}
        />
      )}
    </div>
  );
};

export default TenantAdminDashboard; 
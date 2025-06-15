import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartBar, FaPlus, FaBell, FaUserCircle } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ProjectPopUp from './ProjectPopUp/ProjectPopUp';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isProjectPopupOpen, setIsProjectPopupOpen] = useState(false);

  // Hardcoded data for demonstration
  const dashboardData = {
    projectsAssigned: {
      total: 5,
      active: 3,
      completed: 2
    },
    tasksDueThisWeek: {
      total: 12,
      overdue: 2
    },
    teamMembers: {
      total: 15,
      active: 12,
      available: 3
    },
    projectProgress: [
      { name: 'Website Redesign', progress: 75, status: 'On Track', dueDate: '2024-04-15' },
      { name: 'Mobile App Dev', progress: 45, status: 'At Risk', dueDate: '2024-05-01' },
      { name: 'E-commerce Integration', progress: 90, status: 'On Track', dueDate: '2024-03-30' },
      { name: 'API Development', progress: 30, status: 'Delayed', dueDate: '2024-04-20' },
      { name: 'UI/UX Design', progress: 60, status: 'On Track', dueDate: '2024-04-10' }
    ],
    recentActivity: [
      { user: 'John D.', action: 'created task', target: 'Task X', time: '5 mins ago' },
      { user: 'Sarah M.', action: 'updated milestone', target: 'Milestone Y', time: '15 mins ago' },
      { user: 'Mike R.', action: 'completed task', target: 'Task Z', time: '1 hour ago' },
      { user: 'Lisa K.', action: 'added comment', target: 'Task A', time: '2 hours ago' },
      { user: 'David P.', action: 'updated status', target: 'Task B', time: '3 hours ago' }
    ]
  };

  const projectProgressData = {
    labels: dashboardData.projectProgress.map(p => p.name),
    datasets: [{
      label: 'Project Progress',
      data: dashboardData.projectProgress.map(p => p.progress),
      backgroundColor: dashboardData.projectProgress.map(p => {
        switch(p.status) {
          case 'On Track': return '#4CAF50';
          case 'At Risk': return '#FFA726';
          case 'Delayed': return '#F44336';
          default: return '#4a90e2';
        }
      }),
      borderColor: '#ffffff',
      borderWidth: 2,
      borderRadius: 4,
      barThickness: 30,
      maxBarThickness: 40
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const project = dashboardData.projectProgress[context.dataIndex];
            return [
              `Progress: ${project.progress}%`,
              `Status: ${project.status}`,
              `Due: ${project.dueDate}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="notifications">
            <FaBell />
          </div>
          <div className="user-profile" onClick={() => console.log('Profile clicked')}>
            <FaUserCircle />
            <span>{user?.username || 'PM'}</span>
          </div>
          <button className="logout-button" onClick={signOut}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Row 1: KPI Cards */}
        <div className="kpi-row">
          <div className="kpi-card" onClick={() => setIsProjectPopupOpen(true)}>
            <div className="kpi-icon">
              <FaProjectDiagram />
            </div>
            <div className="kpi-content">
              <h3>Projects Assigned</h3>
              <div className="kpi-value">{dashboardData.projectsAssigned.total}</div>
              <div className="kpi-subtext">
                {dashboardData.projectsAssigned.active} Active / {dashboardData.projectsAssigned.completed} Completed
              </div>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/tasks?filter=due-this-week')}>
            <div className="kpi-icon">
              <FaTasks />
            </div>
            <div className="kpi-content">
              <h3>Tasks Due This Week</h3>
              <div className="kpi-value">{dashboardData.tasksDueThisWeek.total}</div>
              <div className="kpi-subtext">
                {dashboardData.tasksDueThisWeek.overdue > 0 && (
                  <span className="overdue">{dashboardData.tasksDueThisWeek.overdue} Overdue</span>
                )}
              </div>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/team')}>
            <div className="kpi-icon">
              <FaUsers />
            </div>
            <div className="kpi-content">
              <h3>Team Members</h3>
              <div className="kpi-value">{dashboardData.teamMembers.total}</div>
              <div className="kpi-subtext">
                {dashboardData.teamMembers.active} Active / {dashboardData.teamMembers.available} Available
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Project Progress & Quick Actions */}
        <div className="middle-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>My Projects Progress</h3>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
                  <span className="legend-label">On Track</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#FFA726' }}></span>
                  <span className="legend-label">At Risk</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#F44336' }}></span>
                  <span className="legend-label">Delayed</span>
                </div>
              </div>
            </div>
            <div className="chart-container">
              <Bar data={projectProgressData} options={chartOptions} />
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-button primary" onClick={() => navigate('/tasks/new')}>
                <FaPlus /> Create New Task
              </button>
              <button className="action-button" onClick={() => navigate('/team/assignments')}>
                Manage Team Assignments
              </button>
              <button className="action-button" onClick={() => navigate('/reports')}>
                Generate Reports
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Recent Activity */}
        <div className="activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all-button" onClick={() => navigate('/activity')}>
              View All Activity
            </button>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-target">{activity.target}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Popup */}
      <ProjectPopUp 
        isOpen={isProjectPopupOpen} 
        onClose={() => setIsProjectPopupOpen(false)} 
      />
    </div>
  );
};

export default ProjectManagerDashboard; 
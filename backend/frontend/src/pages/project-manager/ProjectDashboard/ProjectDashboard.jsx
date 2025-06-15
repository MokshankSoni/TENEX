import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaTasks, FaCalendarAlt, FaChartLine, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';
import './ProjectDashboard.css';

const ProjectManagerProjectDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Hardcoded project data
  const projectData = {
    id: projectId,
    name: "E-commerce Platform Development",
    description: "Development of a modern e-commerce platform with advanced features and integrations.",
    status: "IN_PROGRESS",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    progress: 45,
    teamMembers: [
      { id: 1, name: "John Doe", role: "Frontend Developer", avatar: "JD" },
      { id: 2, name: "Jane Smith", role: "Backend Developer", avatar: "JS" },
      { id: 3, name: "Mike Johnson", role: "UI/UX Designer", avatar: "MJ" }
    ],
    tasks: [
      { id: 1, title: "Design System Implementation", status: "COMPLETED", priority: "HIGH" },
      { id: 2, title: "User Authentication", status: "IN_PROGRESS", priority: "HIGH" },
      { id: 3, title: "Product Catalog", status: "TODO", priority: "MEDIUM" },
      { id: 4, title: "Shopping Cart", status: "TODO", priority: "HIGH" }
    ],
    milestones: [
      { id: 1, title: "Design Phase", status: "COMPLETED", dueDate: "2024-03-15" },
      { id: 2, title: "Core Features", status: "IN_PROGRESS", dueDate: "2024-04-30" },
      { id: 3, title: "Testing Phase", status: "TODO", dueDate: "2024-05-30" }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'TODO':
        return '#FFA726';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '#F44336';
      case 'MEDIUM':
        return '#FFA726';
      case 'LOW':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className="project-dashboard">
      {/* Header */}
      <div className="project-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/project-manager/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>{projectData.name}</h1>
        </div>
        <div className="header-right">
          <span className={`status-badge ${projectData.status.toLowerCase()}`}>
            {projectData.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <div className="project-overview">
        <div className="overview-card">
          <h3>Project Overview</h3>
          <p>{projectData.description}</p>
          <div className="date-range">
            <span><FaCalendarAlt /> Start: {new Date(projectData.startDate).toLocaleDateString()}</span>
            <span><FaCalendarAlt /> End: {new Date(projectData.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <FaUsers />
          <div className="stat-info">
            <h4>Team Members</h4>
            <span>{projectData.teamMembers.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <FaTasks />
          <div className="stat-info">
            <h4>Total Tasks</h4>
            <span>{projectData.tasks.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <FaChartLine />
          <div className="stat-info">
            <h4>Progress</h4>
            <span>{projectData.progress}%</span>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="tasks-section">
        <h2>Recent Tasks</h2>
        <div className="tasks-grid">
          {projectData.tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {task.priority}
                </span>
              </div>
              <div className="task-status" style={{ color: getStatusColor(task.status) }}>
                {task.status === 'COMPLETED' && <FaCheckCircle />}
                {task.status === 'IN_PROGRESS' && <FaClock />}
                {task.status === 'TODO' && <FaExclamationCircle />}
                {task.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="team-section">
        <h2>Team Members</h2>
        <div className="team-grid">
          {projectData.teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="member-avatar">{member.avatar}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones-section">
        <h2>Milestones</h2>
        <div className="milestones-grid">
          {projectData.milestones.map(milestone => (
            <div key={milestone.id} className="milestone-card">
              <h3>{milestone.title}</h3>
              <div className="milestone-info">
                <span className="milestone-status" style={{ color: getStatusColor(milestone.status) }}>
                  {milestone.status.replace('_', ' ')}
                </span>
                <span className="milestone-date">
                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerProjectDashboard; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle, FaPaperclip, FaFlag, FaEye } from 'react-icons/fa';
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState('In Progress');

  // Temporary hardcoded data - will be replaced with actual API data
  const projectData = {
    name: "E-commerce Platform Development",
    tenantName: "TechCorp Solutions",
    status: projectStatus,
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    description: "Development of a modern e-commerce platform with advanced features",
    milestones: [
      { id: 1, name: "Requirements Gathering", status: "Completed", dueDate: "2024-03-15" },
      { id: 2, name: "Design Phase", status: "Pending", dueDate: "2024-03-30" },
      { id: 3, name: "Development Phase", status: "Pending", dueDate: "2024-05-15" }
    ],
    tasks: [
      { 
        id: 1, 
        title: "Database Schema Design",
        description: "Create and implement the database schema for the e-commerce platform",
        status: "In_Progress",
        priority: "High"
      },
      { 
        id: 2, 
        title: "User Interface Development",
        description: "Develop responsive UI components for the platform",
        status: "In_Progress",
        priority: "High"
      },
      { 
        id: 3, 
        title: "Authentication System",
        description: "Implement secure user authentication and authorization",
        status: "In_Progress",
        priority: "Medium"
      }
    ],
    teamMembers: [
      { id: 1, name: "John Smith", role: "Project Manager", avatar: "JS" },
      { id: 2, name: "Sarah Johnson", role: "Lead Developer", avatar: "SJ" },
      { id: 3, name: "Mike Wilson", role: "UI/UX Designer", avatar: "MW" }
    ],
    attachments: [
      { id: 1, name: "Project Requirements.pdf", type: "pdf", size: "2.5 MB" },
      { id: 2, name: "Design Mockups.zip", type: "zip", size: "15 MB" }
    ]
  };

  const handleStatusChange = (newStatus) => {
    setProjectStatus(newStatus);
  };

  return (
    <div className="project-dashboard-container">
      {/* Header Section */}
      <div className="project-header">
        <div className="header-left">
          <h1>{projectData.name}</h1>
          <div className="project-meta">
            <span className="tenant-name">{projectData.tenantName}</span>
            <div className="status-badge" onClick={() => handleStatusChange(projectStatus === 'In Progress' ? 'Completed' : 'In Progress')}>
              {projectStatus}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="date-range">
            <span>Start: {projectData.startDate}</span>
            <span>End: {projectData.endDate}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="project-content">
        {/* Project Overview */}
        <div className="overview-section">
          <div className="section-header">
            <h2>Project Overview</h2>
          </div>
          <p className="project-description">{projectData.description}</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="action-button primary">
              <FaPlus /> Add Milestone
            </button>
            <button className="action-button">
              <FaPaperclip /> Add Attachment
            </button>
            <button className="action-button">
              <FaUserPlus /> Add Team Member
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2>Tasks</h2>
            <button className="view-button">
              <FaEye /> Tasks
            </button>
          </div>
          <div className="tasks-list">
            {projectData.tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${task.status.toLowerCase()}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="task-description">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Section */}
        <div className="milestones-section">
          <div className="section-header">
            <h2>Milestones</h2>
            <button className="view-button">
              <FaEye /> Milestones
            </button>
          </div>
          <div className="milestones-list">
            {projectData.milestones.map((milestone) => (
              <div key={milestone.id} className="milestone-card">
                <div className="milestone-header">
                  <h3>{milestone.name}</h3>
                  <span className={`status-badge ${milestone.status.toLowerCase()}`}>
                    {milestone.status}
                  </span>
                </div>
                <div className="milestone-details">
                  <span>Due: {milestone.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-section">
          <div className="section-header">
            <h2>Team Members</h2>
            <button className="view-button">
              <FaEye /> Members
            </button>
          </div>
          <div className="team-grid">
            {projectData.teamMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="attachments-section">
          <div className="section-header">
            <h2>Attachments</h2>
            <button className="view-button">
              <FaEye /> Attachments
            </button>
          </div>
          <div className="attachments-list">
            {projectData.attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-card">
                <div className="attachment-icon">
                  <FaPaperclip />
                </div>
                <div className="attachment-info">
                  <h3>{attachment.name}</h3>
                  <span className="attachment-meta">
                    {attachment.type.toUpperCase()} • {attachment.size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard; 
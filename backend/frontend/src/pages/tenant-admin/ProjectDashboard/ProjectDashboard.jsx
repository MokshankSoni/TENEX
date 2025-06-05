import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle, FaPaperclip, FaFlag, FaEye, FaArrowLeft, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { PROJECT_ENDPOINTS } from '../../../config/apiEndpoints';
import { useAuth } from '../../../hooks/useAuth';
import { getToken, getTenantId } from '../../../utils/storageUtils';
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTasksPopupOpen, setIsTasksPopupOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    tenantName: "",
    status: "",
    startDate: "",
    endDate: "",
    description: "",
    tasks: [],
    milestones: [],
    teamMembers: [],
    attachments: [],
    userAssignments: []
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const tenantId = getTenantId();
      
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

      const response = await axios.get(PROJECT_ENDPOINTS.GET_PROJECT(projectId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      const project = response.data;
      
      setProjectData({
        name: project.name,
        tenantName: project.tenantName,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        description: project.description,
        tasks: project.tasks || [],
        milestones: project.milestones || [],
        teamMembers: project.teamMembers || [],
        attachments: project.attachments || [],
        userAssignments: project.userAssignments || []
      });
    } catch (err) {
      console.error('Error fetching project details:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/signin');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this project.');
      } else {
        setError('Failed to fetch project details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = getToken();
      const tenantId = getTenantId();

      await axios.patch(PROJECT_ENDPOINTS.UPDATE_PROJECT(projectId), 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-TenantID': tenantId
          }
        }
      );
      
      setProjectData(prev => ({
        ...prev,
        status: newStatus
      }));
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status. Please try again.');
    }
  };

  const handleTasksClick = () => {
    setIsTasksPopupOpen(true);
  };

  const closeTasksPopup = () => {
    setIsTasksPopupOpen(false);
  };

  const getPriorityWeight = (priority) => {
    const weights = {
      'high': 3,
      'medium': 2,
      'low': 1
    };
    return weights[priority.toLowerCase()] || 0;
  };

  const sortTasksByPriority = (tasks) => {
    return [...tasks].sort((a, b) => {
      const priorityA = getPriorityWeight(a.priority);
      const priorityB = getPriorityWeight(b.priority);
      return priorityB - priorityA; // Sort in descending order (High to Low)
    });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={fetchProjectDetails}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="project-dashboard-container">
      {/* Header Section */}
      <div className="project-header">
        <div className="header-left">
          <h1>{projectData.name}</h1>
          <div className="project-meta">
            <div 
              className="status-badge" 
              style={{ 
                backgroundColor: projectData.status === 'Active' ? '#e6f4ea' : '#fce8e6',
                color: projectData.status === 'Active' ? '#1e7e34' : '#d32f2f'
              }}
            >
              {projectData.status}
            </div>
            <div className="date-range">
              <span>Start: {new Date(projectData.startDate).toLocaleDateString()}</span>
              <span>End: {new Date(projectData.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="back-button" 
            onClick={() => navigate('/tenant-admin/dashboard')}
            title="Back to Dashboard"
          >
            <FaArrowLeft />
          </button>
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
            <button className="view-button" onClick={handleTasksClick}>
              <FaEye /> Tasks
            </button>
          </div>
          <div className="tasks-list">
            {projectData.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${task.status.toLowerCase().replace('_', '-')}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="task-description">{task.description || 'No description available'}</p>
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
                  <h3>{milestone.name || 'Unnamed Milestone'}</h3>
                  <span className={`status-badge ${(milestone.status || 'pending').toLowerCase()}`}>
                    {milestone.status || 'Pending'}
                  </span>
                </div>
                <div className="milestone-details">
                  <span>Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}</span>
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
            {projectData.userAssignments?.map((assignment) => (
              <div key={`${assignment.username}-${assignment.projectId}`} className="team-member-card">
                <div className="member-avatar">
                  {assignment.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="member-info">
                  <h3>{assignment.username}</h3>
                  <div className="member-role">{assignment.roleInProject}</div>
                  <div className="member-assigned">
                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                  </div>
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
                  <h3>{attachment.name || 'Unnamed Attachment'}</h3>
                  <span className="attachment-meta">
                    {(attachment.type || 'Unknown').toUpperCase()} • {attachment.size || 'Unknown size'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Popup */}
      {isTasksPopupOpen && (
        <div className="popup-overlay">
          <div className="tasks-popup">
            <div className="popup-header">
              <h2>All Tasks</h2>
              <button className="close-button" onClick={closeTasksPopup}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="tasks-grid">
                {sortTasksByPriority(projectData.tasks).map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <div className="task-meta">
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className={`status-badge ${task.status.toLowerCase().replace('_', '-')}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="task-description">{task.description || 'No description available'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard; 
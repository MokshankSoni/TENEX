import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle, FaPaperclip, FaFlag, FaEye, FaArrowLeft, FaTimes, FaToggleOn, FaToggleOff, FaUpload } from 'react-icons/fa';
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
  const [isMilestonesPopupOpen, setIsMilestonesPopupOpen] = useState(false);
  const [isTeamMembersPopupOpen, setIsTeamMembersPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');
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
  const [isAddMilestonePopupOpen, setIsAddMilestonePopupOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    projectId: '',
    title: '',
    description: '',
    dueDate: '',
    completed: false
  });
  const [isAddAttachmentPopupOpen, setIsAddAttachmentPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskSelectionPopupOpen, setIsTaskSelectionPopupOpen] = useState(false);

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

  const handleMilestonesClick = () => {
    setIsMilestonesPopupOpen(true);
  };

  const handleTeamMembersClick = () => {
    setIsTeamMembersPopupOpen(true);
  };

  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const closeTasksPopup = () => {
    setIsTasksPopupOpen(false);
  };

  const closeMilestonesPopup = () => {
    setIsMilestonesPopupOpen(false);
  };

  const closeTeamMembersPopup = () => {
    setIsTeamMembersPopupOpen(false);
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

  const getFilteredTeamMembers = () => {
    if (selectedRole === 'all') {
      return projectData.userAssignments;
    }
    return projectData.userAssignments?.filter(
      member => member.roleInProject.toLowerCase() === selectedRole.toLowerCase()
    );
  };

  const handleAddMilestoneClick = () => {
    setMilestoneForm({
      projectId: projectId,
      title: '',
      description: '',
      dueDate: '',
      completed: false
    });
    setIsAddMilestonePopupOpen(true);
  };

  const handleMilestoneFormChange = (e) => {
    const { name, value } = e.target;
    setMilestoneForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneStatusToggle = () => {
    setMilestoneForm(prev => ({
      ...prev,
      completed: !prev.completed
    }));
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        setError('Authentication information missing. Please login again.');
        return;
      }

      const response = await axios.post(PROJECT_ENDPOINTS.CREATE_MILESTONE, milestoneForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh project data to show new milestone
        await fetchProjectDetails();
        setIsAddMilestonePopupOpen(false);
        setMilestoneForm({
          projectId: '',
          title: '',
          description: '',
          dueDate: '',
          completed: false
        });
      }
    } catch (err) {
      console.error('Error creating milestone:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/signin');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to create milestones for this project.');
      } else {
        setError('Failed to create milestone. Please try again.');
      }
    }
  };

  const handleAddAttachmentClick = () => {
    setIsAddAttachmentPopupOpen(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskSelectionPopupOpen(false);
  };

  const handleAttachmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedTaskId) {
      setError('Please select both a file and a task');
      return;
    }

    try {
      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        setError('Authentication information missing. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('taskId', selectedTaskId);

      const response = await axios.post('http://localhost:8080/api/attachments/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-TenantID': tenantId
        }
      });

      if (response.status === 200 || response.status === 201) {
        // Refresh project data to show new attachment
        await fetchProjectDetails();
        setIsAddAttachmentPopupOpen(false);
        setSelectedFile(null);
        setSelectedTaskId(null);
      }
    } catch (err) {
      console.error('Error uploading attachment:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/signin');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to upload attachments.');
      } else {
        setError('Failed to upload attachment. Please try again.');
      }
    }
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
            <button className="action-button primary" onClick={handleAddMilestoneClick}>
              <FaPlus /> Add Milestone
            </button>
            <button className="action-button" onClick={handleAddAttachmentClick}>
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
            <button className="view-button" onClick={handleMilestonesClick}>
              <FaEye /> Milestones
            </button>
          </div>
          <div className="milestones-list">
            {projectData.milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="milestone-card">
                <div className="milestone-header">
                  <h3>{milestone.title || 'Unnamed Milestone'}</h3>
                  <span className={`status-badge ${milestone.completed ? 'completed' : 'pending'}`}>
                    {milestone.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="milestone-details">
                  <p className="milestone-description">{milestone.description || 'No description available'}</p>
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
            <button className="view-button" onClick={handleTeamMembersClick}>
              <FaEye /> Members
            </button>
          </div>
          <div className="team-grid">
            {projectData.userAssignments?.slice(0, 3).map((assignment) => (
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

      {/* Milestones Popup */}
      {isMilestonesPopupOpen && (
        <div className="popup-overlay">
          <div className="tasks-popup">
            <div className="popup-header">
              <h2>All Milestones</h2>
              <button className="close-button" onClick={closeMilestonesPopup}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="tasks-grid">
                {projectData.milestones.map((milestone) => (
                  <div key={milestone.id} className="task-card">
                    <div className="task-header">
                      <h3>{milestone.title || 'Unnamed Milestone'}</h3>
                      <div className="task-meta">
                        <span className={`status-badge ${milestone.completed ? 'completed' : 'pending'}`}>
                          {milestone.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="milestone-details">
                      <p className="milestone-description">{milestone.description || 'No description available'}</p>
                      <span>Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Popup */}
      {isTeamMembersPopupOpen && (
        <div className="popup-overlay">
          <div className="tasks-popup">
            <div className="popup-header">
              <h2>All Team Members</h2>
              <div className="popup-actions">
                <select 
                  className="role-filter" 
                  value={selectedRole} 
                  onChange={handleRoleFilterChange}
                >
                  <option value="all">All Roles</option>
                  <option value="project manager">Project Manager</option>
                  <option value="admin">Admin</option>
                  <option value="tm">TM</option>
                </select>
                <button className="close-button" onClick={closeTeamMembersPopup}>
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="popup-content">
              <div className="tasks-grid">
                {getFilteredTeamMembers()?.map((assignment) => (
                  <div key={`${assignment.username}-${assignment.projectId}`} className="task-card">
                    <div className="task-header">
                      <h3>{assignment.username}</h3>
                      <div className="task-meta">
                        <span className={`status-badge ${assignment.roleInProject.toLowerCase().replace(' ', '-')}`}>
                          {assignment.roleInProject}
                        </span>
                      </div>
                    </div>
                    <div className="milestone-details">
                      <span>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Popup */}
      {isAddMilestonePopupOpen && (
        <div className="popup-overlay">
          <div className="form-popup">
            <div className="popup-header">
              <h2>Add New Milestone</h2>
              <button className="close-button" onClick={() => setIsAddMilestonePopupOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleMilestoneSubmit} className="milestone-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={milestoneForm.title}
                  onChange={handleMilestoneFormChange}
                  required
                  placeholder="Enter milestone title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={milestoneForm.description}
                  onChange={handleMilestoneFormChange}
                  placeholder="Enter milestone description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={milestoneForm.dueDate}
                  onChange={handleMilestoneFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="toggle-container">
                  <span>{milestoneForm.completed ? 'Completed' : 'Pending'}</span>
                  <button
                    type="button"
                    className="toggle-button"
                    onClick={handleMilestoneStatusToggle}
                  >
                    {milestoneForm.completed ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsAddMilestonePopupOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Attachment Popup */}
      {isAddAttachmentPopupOpen && (
        <div className="popup-overlay">
          <div className="form-popup">
            <div className="popup-header">
              <h2>Add New Attachment</h2>
              <button className="close-button" onClick={() => setIsAddAttachmentPopupOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAttachmentSubmit} className="milestone-form">
              <div className="form-group">
                <label htmlFor="file">Select File</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Task</label>
                <button
                  type="button"
                  className="task-select-button"
                  onClick={() => setIsTaskSelectionPopupOpen(true)}
                >
                  {selectedTaskId ? 
                    projectData.tasks.find(t => t.id === selectedTaskId)?.title || 'Select Task' :
                    'Select Task'
                  }
                </button>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsAddAttachmentPopupOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={!selectedFile || !selectedTaskId}>
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Selection Popup */}
      {isTaskSelectionPopupOpen && (
        <div className="popup-overlay">
          <div className="tasks-popup">
            <div className="popup-header">
              <h2>Select Task</h2>
              <button className="close-button" onClick={() => setIsTaskSelectionPopupOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="tasks-grid">
                {sortTasksByPriority(projectData.tasks).map((task) => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    onClick={() => handleTaskSelect(task.id)}
                  >
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaProjectDiagram, FaUsers, FaTasks, FaChartPie, FaPlus, FaUserPlus, FaClipboardList, FaUserCircle, FaPaperclip, FaFlag, FaEye, FaArrowLeft, FaTimes, FaToggleOn, FaToggleOff, FaUpload, FaSearch, FaFile, FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaDownload, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { PROJECT_ENDPOINTS, AUTH_ENDPOINTS } from '../../../config/apiEndpoints';
import { useAuth } from '../../../hooks/useAuth';
import { getToken, getTenantId } from '../../../utils/storageUtils';
import './ProjectDashboard.css';
import AddMemberPopUp from './AddMemberPopUp/AddMemberPopUp';
import UpdateProjectPopup from './UpdateProjectPopup/UpdateProjectPopup';

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
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [isAttachmentsPopupOpen, setIsAttachmentsPopupOpen] = useState(false);
  const [selectedTaskForAttachments, setSelectedTaskForAttachments] = useState(null);
  const [attachmentSearchQuery, setAttachmentSearchQuery] = useState('');
  const [attachmentStatusFilter, setAttachmentStatusFilter] = useState('all');
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isRemoveMemberPopupOpen, setIsRemoveMemberPopupOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [teamMemberSearchQuery, setTeamMemberSearchQuery] = useState('');
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showUpdateProject, setShowUpdateProject] = useState(false);

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
        id: project.id,
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
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this project.');
      } else {
        setError('Failed to fetch project details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = () => {
    setIsStatusPopupOpen(true);
  };

  const handleStatusSelect = (newStatus) => {
    setSelectedStatus(newStatus);
    setIsStatusPopupOpen(false);
    setIsConfirmPopupOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      const token = getToken();
      const tenantId = getTenantId();

      await axios.patch(PROJECT_ENDPOINTS.UPDATE_PROJECT_STATUS(projectId), 
        { status: selectedStatus },
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
        status: selectedStatus
      }));

      setSuccess('Project status updated successfully');
      setIsConfirmPopupOpen(false);
      setSelectedStatus(null);

      // Auto-dismiss success message after 2 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 1200);
    } catch (err) {
      console.error('Error updating project status:', err);
      setError('Failed to update project status. Please try again.');


    }
  };

  const handleCancelStatusUpdate = () => {
    setIsConfirmPopupOpen(false);
    setSelectedStatus(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#4CAF50'; // Green
      case 'ON_HOLD':
        return '#FF9800'; // Orange
      case 'COMPLETED':
        return '#2196F3'; // Blue
      case 'CANCELLED':
        return '#F44336'; // Red
      default:
        return '#718096'; // Gray
    }
  };

  const getStatusDisplayName = (status) => {
    return status.replace('_', ' ');
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
    let filteredMembers = projectData.userAssignments;
    
    // Apply role filter
    if (selectedRole !== 'all') {
      filteredMembers = filteredMembers.filter(
        member => member.roleInProject.toLowerCase() === selectedRole.toLowerCase()
      );
    }

    // Apply search filter
    if (teamMemberSearchQuery) {
      const query = teamMemberSearchQuery.toLowerCase();
      filteredMembers = filteredMembers.filter(
        member => 
          member.username.toLowerCase().includes(query) ||
          (member.email && member.email.toLowerCase().includes(query))
      );
    }

    return filteredMembers;
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

        setSuccess('Milestone added successfuly');

        // Auto-dismiss success message after 2 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 1200);
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

        setSuccess('Attchment added successfuly');

                // Auto-dismiss success message after 2 seconds
                      setTimeout(() => {
                        setSuccess(null);
                      }, 1200);
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

  const getFilteredTasks = () => {
    let filteredTasks = [...projectData.tasks];

    // Apply search filter
    if (taskSearchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(taskSearchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (taskStatusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task =>
        task.status.toLowerCase() === taskStatusFilter.toLowerCase()
      );
    }

    return sortTasksByPriority(filteredTasks);
  };

  const getTasksWithAttachments = () => {
    return projectData.tasks.filter(task => task.attachments && task.attachments.length > 0);
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <FaFileImage />;
    if (fileType.includes('pdf')) return <FaFilePdf />;
    if (fileType.includes('word') || fileType.includes('document')) return <FaFileWord />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive />;
    if (fileType.includes('text')) return <FaFileAlt />;
    return <FaFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAttachmentClick = async (attachment) => {
    try {
      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        console.error('Missing authentication token or tenant ID');
        return;
      }

      const response = await axios.get(
        `${PROJECT_ENDPOINTS.GET_ATTACHMENT_DOWNLOAD}/${attachment.id}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-TenantID': tenantId
          },
          responseType: 'blob'
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: attachment.fileType });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.fileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);

      setSuccess('Attachment downloaded successfuly');

        // Auto-dismiss success message after 2 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 1200);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      if (error.response) {
        // Handle specific error cases
        switch (error.response.status) {
          case 401:
            console.error('Authentication failed. Please log in again.');
            break;
          case 403:
            console.error('You do not have permission to download this attachment.');
            break;
          case 404:
            console.error('Attachment not found.');
            break;
          default:
            console.error('Failed to download attachment. Please try again.');
        }
      } else {
        console.error('Network error. Please check your connection.');
      }
    }
  };

  const renderAttachments = (attachments, showAll = false) => {
    const displayAttachments = showAll ? attachments : attachments.slice(0, 1);
    return (
      <div className="attachments-grid">
        {displayAttachments.map(attachment => (
          <div key={attachment.id} className="attachment-item">
            <div className="attachment-icon">
              {getFileIcon(attachment.fileType)}
            </div>
            <div className="attachment-info">
              <h4>{attachment.fileName}</h4>
              <p>{formatFileSize(attachment.fileSize)}</p>
              <span className="attachment-type">{attachment.fileType}</span>
            </div>
            <button 
              className="download-button"
              onClick={(e) => {
                e.stopPropagation();
                handleAttachmentClick(attachment);
              }}
              title="Download attachment"
            >
              <FaDownload />
            </button>
          </div>
        ))}
        {!showAll && attachments.length > 1 && (
          <div className="view-more-attachments">
            <button onClick={(e) => {
              e.stopPropagation();
              setSelectedTaskForAttachments(attachments[0].taskId);
            }}>
              View {attachments.length - 1} more
            </button>
          </div>
        )}
      </div>
    );
  };

  const getFilteredTasksWithAttachments = () => {
    let filteredTasks = getTasksWithAttachments();

    // Apply search filter
    if (attachmentSearchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(attachmentSearchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (attachmentStatusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task =>
        task.status.toLowerCase() === attachmentStatusFilter.toLowerCase()
      );
    }

    return filteredTasks;
  };

  const handleAddMemberClick = () => {
    setIsAddMemberPopupOpen(true);
  };

  const handleCloseAddMemberPopup = () => {
    setIsAddMemberPopupOpen(false);
  };

  const handleAddMember = async (user) => {
    try {
      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        console.error('Missing authentication token or tenant ID');
        setError('Authentication error. Please try logging in again.');
        return;
      }

      // Log token and tenant ID for debugging
      console.log('Token:', token.substring(0, 20) + '...'); // Only log first 20 chars for security
      console.log('Tenant ID:', tenantId);
      console.log('Project ID from state:', projectData.id);
      console.log('Project ID from params:', projectId);
      
      // Get the role from the user object, defaulting to their primary role
      const roleInProject = user.roleInProject || user.roles[0] || 'ROLE_TEAM_MEMBER';
      
      // Prepare the request payload
      const payload = {
        username: user.username,
        projectId: projectData.id || projectId, // Fallback to URL param if state ID is not available
        roleInProject: roleInProject
      };

      // Make the API call to add the user to the project
      const response = await axios.post(AUTH_ENDPOINTS.ADD_MEMBER, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-TenantID': tenantId,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Members added successfuly');

        // Auto-dismiss success message after 2 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 1200);

      console.log('Add member response:', response.data);

      // Close the popup after successful addition
      setIsAddMemberPopupOpen(false);
      
      // Refresh project details to show the new member
      await fetchProjectDetails();

    } catch (err) {
      console.error('Error adding member:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.config?.headers,
        payload: err.config?.data
      });

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Authentication failed. Please log in again.');
            break;
          case 403:
            setError('You do not have permission to add members to this project.');
            break;
          case 404:
            setError('Project or user not found.');
            break;
          default:
            setError(err.response.data?.message || 'Failed to add member to the project');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  const handleRemoveMemberClick = (username, projectId) => {
    setMemberToRemove({ username, projectId });
    setIsRemoveMemberPopupOpen(true);
  };

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      const token = getToken();
      const tenantId = getTenantId();
      
      if (!token || !tenantId) {
        setError('Authentication token or tenant ID not found. Please login again.');
        navigate('/signin');
        return;
      }

      await axios.delete(AUTH_ENDPOINTS.REMOVE_MEMBER(memberToRemove.username, memberToRemove.projectId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      setSuccess('Member removed successfuly');

        // Auto-dismiss success message after 2 seconds
              setTimeout(() => {
                setSuccess(null);
              }, 1200);

      // Update the local state to remove the member
      setProjectData(prev => ({
        ...prev,
        userAssignments: prev.userAssignments.filter(
          assignment => !(assignment.username === memberToRemove.username && assignment.projectId === memberToRemove.projectId)
        )
      }));

      //setSuccess('Team member removed successfully');
    } catch (error) {
      console.error('Error removing team member:', error);
      setError(error.response?.data?.message || 'Failed to remove team member');
    } finally {
      setIsRemoveMemberPopupOpen(false);
      setMemberToRemove(null);
    }
  };

  const handleCancelRemoveMember = () => {
    setIsRemoveMemberPopupOpen(false);
    setMemberToRemove(null);
  };

  const getRoleColor = (role) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('tenant_admin')) return '#4CAF50';
    if (roleLower.includes('project_manager')) return '#2196F3';
    if (roleLower.includes('team_member')) return '#FF9800';
    if (roleLower.includes('client')) return '#9C27B0';
    return '#718096';
  };

  const formatRole = (role) => {
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
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjectData(updatedProject);
    setShowUpdateProject(false);
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
              onClick={handleStatusClick}
              style={{ 
                backgroundColor: getStatusColor(projectData.status),
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {getStatusDisplayName(projectData.status)}
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
            <button 
              className="update-project-button"
              onClick={() => setShowUpdateProject(true)}
            >
              Update Project
            </button>
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
            <button className="action-button" onClick={handleAddMemberClick}>
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
            {projectData.userAssignments?.slice(0, 10).map((assignment) => (
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
                <button 
                  className="remove-member-button"
                  onClick={() => handleRemoveMemberClick(assignment.username, assignment.projectId)}
                  title="Remove member"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="attachments-section">
          <div className="section-header">
            <h2>Attachments</h2>
            <button className="view-button" onClick={() => setIsAttachmentsPopupOpen(true)}>
              <FaEye /> View All Attachments
            </button>
          </div>
          <div className="attachments-list">
            {getTasksWithAttachments().slice(0, 3).map(task => (
              <div key={task.id} className="task-attachments-card">
                <div className="task-attachments-header">
                  <h3>{task.title}</h3>
                  <span className={`status-badge ${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {renderAttachments(task.attachments)}
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
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={teamMemberSearchQuery}
                    onChange={(e) => setTeamMemberSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="role-filter" 
                  value={selectedRole} 
                  onChange={handleRoleFilterChange}
                >
                  <option value="all">All Roles</option>
                  <option value="ROLE_TENANT_ADMIN">Tenant Admin</option>
                  <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                  <option value="ROLE_TEAM_MEMBER">Team Member</option>
                  <option value="ROLE_CLIENT">Client</option>
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
                      <div className="member-info">
                        <h3>{assignment.username}</h3>
                        <div className="member-email">{assignment.email}</div>
                      </div>
                      <div className="task-meta">
                        <span 
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(assignment.roleInProject) }}
                        >
                          {formatRole(assignment.roleInProject)}
                        </span>
                        <button 
                          className="remove-member-button"
                          onClick={() => handleRemoveMemberClick(assignment.username, assignment.projectId)}
                          title="Remove member"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="milestone-details">
                      <span>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {getFilteredTeamMembers()?.length === 0 && (
                  <div className="no-results-message">
                    <p>No team members found matching your search criteria</p>
                  </div>
                )}
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
              <div className="task-filters">
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="tasks-grid">
                {getFilteredTasks().map((task) => (
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
                {getFilteredTasks().length === 0 && (
                  <div className="no-tasks-message">
                    No tasks found matching your search criteria
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachments Popup */}
      {isAttachmentsPopupOpen && (
        <div className="popup-overlay">
          <div className="tasks-popup">
            <div className="popup-header">
              <h2>All Attachments</h2>
              <button className="close-button" onClick={() => {
                setIsAttachmentsPopupOpen(false);
                setSelectedTaskForAttachments(null);
                setAttachmentSearchQuery('');
                setAttachmentStatusFilter('all');
              }}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              {selectedTaskForAttachments ? (
                <div className="task-attachments-detail">
                  <button 
                    className="back-button"
                    onClick={() => setSelectedTaskForAttachments(null)}
                    title="Back to Tasks"
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="task-card">
                    <div className="task-header">
                      <h3>{projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.title}</h3>
                      <div className="task-meta">
                        <span className={`priority-badge ${projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.priority.toLowerCase()}`}>
                          {projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.priority}
                        </span>
                        <span className={`status-badge ${projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.status.toLowerCase().replace('_', '-')}`}>
                          {projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {renderAttachments(
                      projectData.tasks.find(t => t.id === selectedTaskForAttachments)?.attachments || [],
                      true
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-filters">
                    <div className="search-container">
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search tasks..."
                        value={attachmentSearchQuery}
                        onChange={(e) => setAttachmentSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="status-filter"
                      value={attachmentStatusFilter}
                      onChange={(e) => setAttachmentStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="to_do">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Done</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  <div className="tasks-grid">
                    {getFilteredTasksWithAttachments().map(task => (
                      <div 
                        key={task.id} 
                        className="task-card"
                        onClick={() => setSelectedTaskForAttachments(task.id)}
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
                        {renderAttachments(task.attachments)}
                      </div>
                    ))}
                    {getFilteredTasksWithAttachments().length === 0 && (
                      <div className="no-tasks-message">
                        No tasks found matching your search criteria
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Member Popup */}
      {isAddMemberPopupOpen && (
        <AddMemberPopUp
          onClose={handleCloseAddMemberPopup}
          onAddMember={handleAddMember}
          existingAssignments={projectData.userAssignments}
        />
      )}

      {/* Add the confirmation popup */}
      {isRemoveMemberPopupOpen && memberToRemove && (
        <div className="popup-overlay">
          <div className="confirmation-popup">
            <div className="popup-header">
              <h2>Confirm Removal</h2>
              <button className="close-button" onClick={handleCancelRemoveMember}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <p>Are you sure you want to remove <strong>{memberToRemove.username}</strong> from this project?</p>
              <div className="confirmation-actions">
                <button 
                  className="confirm-button primary" 
                  onClick={handleConfirmRemoveMember}
                >
                  Yes, Remove
                </button>
                <button 
                  className="confirm-button secondary" 
                  onClick={handleCancelRemoveMember}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Popup */}
      {isStatusPopupOpen && (
        <div className="popup-overlay">
          <div className="status-popup">
            <div className="popup-header">
              <h2>Update Project Status</h2>
              <button className="close-button" onClick={() => setIsStatusPopupOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="status-options">
                <button
                  className="status-option"
                  style={{ backgroundColor: getStatusColor('ON_HOLD') }}
                  onClick={() => handleStatusSelect('ON_HOLD')}
                >
                  On Hold
                </button>
                <button
                  className="status-option"
                  style={{ backgroundColor: getStatusColor('ACTIVE') }}
                  onClick={() => handleStatusSelect('ACTIVE')}
                >
                  Active
                </button>
                <button
                  className="status-option"
                  style={{ backgroundColor: getStatusColor('COMPLETED') }}
                  onClick={() => handleStatusSelect('COMPLETED')}
                >
                  Completed
                </button>
                <button
                  className="status-option"
                  style={{ backgroundColor: getStatusColor('CANCELLED') }}
                  onClick={() => handleStatusSelect('CANCELLED')}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Popup */}
      {isConfirmPopupOpen && (
        <div className="popup-overlay">
          <div className="confirmation-popup">
            <div className="popup-header">
              <h2>Confirm Status Update</h2>
              <button className="close-button" onClick={handleCancelStatusUpdate}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <p>Are you sure you want to update the project status to <strong>{getStatusDisplayName(selectedStatus)}</strong>?</p>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-button primary"
                  onClick={handleConfirmStatusUpdate}
                >
                  Yes, Update Status
                </button>
                <button 
                  className="confirm-button secondary"
                  onClick={handleCancelStatusUpdate}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {success && (
        <div className="toast success">
          <FaCheckCircle />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="toast error">
          <FaExclamationCircle />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {showUpdateProject && (
        <UpdateProjectPopup
          isOpen={showUpdateProject}
          onClose={() => setShowUpdateProject(false)}
          projectData={projectData}
          onProjectUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
};

export default ProjectDashboard; 
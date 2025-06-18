import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaEdit, FaTrash, FaCheck, FaPaperclip,
    FaEllipsisV, FaUserCircle, FaClock, FaCalendarAlt,
    FaCheckCircle, FaTimes, FaPlus, FaFile, FaFileImage,
    FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive,
    FaDownload, FaChevronRight, FaEye
} from 'react-icons/fa';
import './TaskDashboard.css';
import { TASK_ENDPOINTS, AUTH_ENDPOINTS, TASK_CHECKLIST } from '../../../config/apiEndpoints';
import { getToken, getTenantId } from '../../../utils/storageUtils';
import CommentPopUp from './CommentPopUp/CommentPopUp';
import AttachmentPopUp from './AttachmentPopUp/AttachmentPopUp';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';

const TaskDashboard = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [showCommentPopUp, setShowCommentPopUp] = useState(false);
    const [showAttachmentPopUp, setShowAttachmentPopUp] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

    useEffect(() => {
        const fetchTaskDetails = async () => {
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
                const response = await axios.get(TASK_ENDPOINTS.GET_TASK(taskId), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-TenantID': tenantId
                    }
                });
                setTaskDetails(response.data);
                
            } catch (err) {
                console.error('Error fetching task details:', err);
                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                } else if (err.response?.status === 403) {
                    setError('You do not have permission to access this task.');
                } else {
                    setError('Failed to fetch task details. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        if (taskId) fetchTaskDetails();
    }, [taskId, navigate]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const token = getToken();
            const tenantId = getTenantId();
            if (!token) {
                console.error('Authentication token not found');
                return;
            }
            if (!tenantId) {
                console.error('Tenant ID not found');
                return;
            }
            try {
                const response = await axios.get(AUTH_ENDPOINTS.GET_ALL_USERS, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-TenantID': tenantId
                    }
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching all users:', err);
                if (err.response) {
                    console.error('Response:', err.response.data);
                }
            }
        };
        fetchAllUsers();
    }, []);

    // Helper functions for status and priority colors (case-sensitive)
    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO': return '#F59E0B'; // Amber
            case 'In_Progress': return '#2563EB'; // Blue
            case 'Completed': return '#10B981'; // Green
            default: return '#6B7280'; // Gray
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#EF4444'; // Red
            case 'MEDIUM': return '#F59E0B'; // Amber
            case 'LOW': return '#10B981'; // Green
            default: return '#6B7280'; // Gray
        }
    };

    // Helper for date formatting
    const formatReadableDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper to trim microseconds from ISO string (for Safari/JS compatibility)
    const trimMicroseconds = (isoString) => {
        if (!isoString) return '';
        // Remove microseconds if present (e.g., 2025-05-22T14:46:08.754135 -> 2025-05-22T14:46:08.754)
        return isoString.replace(/(\.\d{3})\d*(Z)?$/, '$1$2');
    };

    const formatCommentTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(trimMicroseconds(isoString));
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Helper to get user info (username and roles) from userId
    const getUserInfo = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return { username: 'Unknown User', roles: [] };
        return { username: user.username, roles: user.roles };
    };

    // Helper to format a role string
    const formatRole = (roles) => {
        if (!roles || roles.length === 0) return '';
        // Use the first role for display
        const role = roles[0];
        const roleName = role.replace('ROLE_', '').toLowerCase();
        switch (roleName) {
            case 'tenant_admin': return 'Tenant Admin';
            case 'project_manager': return 'Project Manager';
            case 'team_member': return 'Team Member';
            case 'client': return 'Client';
            default: return roleName.charAt(0).toUpperCase() + roleName.slice(1);
        }
    };

    // Render loading or error states
    if (loading) {
        return <div className="loading-state">Loading task details...</div>;
    }
    if (error) {
        return <div className="error-state">{error}</div>;
    }
    if (!taskDetails) {
        return <div className="error-state">No task details found.</div>;
    }

    const getFileIcon = (fileType) => {
        const type = fileType || '';
        if (type.includes('image')) return <FaFileImage />;
        if (type.includes('pdf')) return <FaFilePdf />;
        if (type.includes('word') || type.includes('officedocument.wordprocessingml')) return <FaFileWord />;
        if (type.includes('excel') || type.includes('officedocument.spreadsheetml')) return <FaFileExcel />;
        if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return <FaFileArchive />;
        return <FaFile />;
    };

    const calculateChecklistProgress = () => {
        const checklist = taskDetails.checklists || [];
        if (checklist.length === 0) return 0;
        const completed = checklist.filter(item => item.completed).length;
        return Math.round((completed / checklist.length) * 100);
    };

    const handleStatusChange = (newStatus) => {
        console.log(`Changing status to: ${newStatus}`);
        // In a real app, you'd send an API request here
        setShowStatusDropdown(false);
    };

    const handleAddChecklistItem = async () => {
        if (!newChecklistItem.trim()) return;
        setConfirmDialog({
            open: true,
            message: 'Are you sure you want to add this checklist item?',
            onConfirm: async () => {
                const token = getToken();
                const tenantId = getTenantId();
                if (!token || !tenantId) return setConfirmDialog({ open: false });
                try {
                    await axios.post(TASK_CHECKLIST.ADD_TASK_CHECKLIST, {
                        taskId: taskDetails.id,
                        item: newChecklistItem.trim(),
                        completed: false
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-TenantID': tenantId
                        }
                    });
                    setNewChecklistItem('');
                    // Refresh task details
                    if (taskId) {
                        const response = await axios.get(TASK_ENDPOINTS.GET_TASK(taskId), {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'X-TenantID': tenantId
                            }
                        });
                        setTaskDetails(response.data);
                    }
                } catch (err) {
                    console.error('Error adding checklist item:', err);
                } finally {
                    setConfirmDialog({ open: false });
                }
            }
        });
    };

    const handleRemoveChecklistItem = (id) => {
        setConfirmDialog({
            open: true,
            message: 'Are you sure you want to delete this checklist item?',
            onConfirm: async () => {
                const token = getToken();
                const tenantId = getTenantId();
                if (!token || !tenantId) return setConfirmDialog({ open: false });
                try {
                    await axios.delete(TASK_CHECKLIST.REMOVE_TASK_CHECKLIST(id), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-TenantID': tenantId
                        }
                    });
                    // Refresh task details
                    if (taskId) {
                        const response = await axios.get(TASK_ENDPOINTS.GET_TASK(taskId), {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'X-TenantID': tenantId
                            }
                        });
                        setTaskDetails(response.data);
                    }
                } catch (err) {
                    console.error('Error removing checklist item:', err);
                } finally {
                    setConfirmDialog({ open: false });
                }
            }
        });
    };

    const handleToggleChecklistStatus = (id) => {
        setConfirmDialog({
            open: true,
            message: 'Are you sure you want to change the status of this checklist item?',
            onConfirm: async () => {
                const token = getToken();
                const tenantId = getTenantId();
                if (!token || !tenantId) return setConfirmDialog({ open: false });
                try {
                    await axios.patch(TASK_CHECKLIST.TOGGLE_STATUS_CHECKLIST(id), {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-TenantID': tenantId
                        }
                    });
                    // Refresh task details
                    if (taskId) {
                        const response = await axios.get(TASK_ENDPOINTS.GET_TASK(taskId), {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'X-TenantID': tenantId
                            }
                        });
                        setTaskDetails(response.data);
                    }
                } catch (err) {
                    console.error('Error toggling checklist status:', err);
                } finally {
                    setConfirmDialog({ open: false });
                }
            }
        });
    };

  return (
        <div className="task-dashboard">
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb">
                <FaArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
                
            </div>

            {/* Header Section */}
            <div className="task-header-main">
                <div className="task-header-left">
                    <div className="task-title-section">
                        <div className="task-id-badge">{taskDetails.id}</div>
                        <h1 className="task-detail-title">{taskDetails.title}</h1>
                    </div>
                    <div className="task-meta-info">
                        <div className="meta-info-group">
                            <span className="status-label" style={{ backgroundColor: getStatusColor(taskDetails.status) }}>
                                <span className="status-dot"></span>
                                {taskDetails.status}
                            </span>
                            <span className="priority-label" style={{ backgroundColor: getPriorityColor(taskDetails.priority) }}>
                                <span className="priority-dot"></span>
                                {taskDetails.priority}
                            </span>
                        </div>
                        <div className="meta-info-group">
                            <span className="due-date-info">
                                <FaCalendarAlt />
                                <span>Due {formatReadableDate(taskDetails.dueDate)}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="header-actions-right">
                    <button className="action-button-header edit-button">
                        <FaEdit />
                        <span>Edit Task</span>
                    </button>
                    <button className="action-button-header delete-button">
                        <FaTrash />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="task-content-grid">
                {/* Description Card */}
                <div className="task-card description-card">
                    <h2 className="card-title">Description</h2>
                    <p className="task-description-text">{taskDetails.description}</p>
                    <div className="user-date-info-grid">
                        <div>
                            <span className="info-label">Created</span>
                            <span className="date-time">{formatReadableDate(taskDetails.createdAt)}</span>
                        </div>
                        <div>
                            <span className="info-label">Last Updated</span>
                            <span className="date-time">{formatReadableDate(taskDetails.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Task Checklist Card */}
                <div className="task-card checklist-card">
                    <h2 className="card-title">Task Checklist</h2>
                    <div className="checklist-progress-bar-container">
                        <div className="progress-text-display">{calculateChecklistProgress()}% Complete</div>
                        <div className="progress-bar-fill" style={{ width: `${calculateChecklistProgress()}%` }}></div>
                    </div>
                    <div className="checklist-items-list">
                        {(taskDetails.checklists || []).map(item => (
                            <div key={item.id} className="checklist-item-entry">
                                <input type="checkbox" checked={item.completed} onChange={() => handleToggleChecklistStatus(item.id)} />
                                <span className={item.completed ? 'completed-item' : ''}>{item.item}</span>
                                <button className="remove-checklist-item" onClick={() => handleRemoveChecklistItem(item.id)}><FaTimes /></button>
                            </div>
                        ))}
                    </div>
                    <div className="add-new-checklist-item">
                        <input
                            type="text"
                            placeholder="Add new checklist item..."
                            value={newChecklistItem}
                            onChange={(e) => setNewChecklistItem(e.target.value)}
                        />
                        <button className="add-checklist-button" onClick={handleAddChecklistItem}><FaPlus /></button>
                    </div>
                </div>

                {/* Comments Card */}
                <div className="task-card comments-card">
                    <div className="section-header-row">
                        <h2 className="card-title">Comments</h2>
                        <button className="view-all-section-btn" onClick={() => setShowCommentPopUp(true)}>
                            <FaEye style={{ marginRight: 6 }} /> View All
                        </button>
                    </div>
                    <div className="comments-list-container">
                        {(() => {
                            const latest = (taskDetails.comments || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                            if (!latest) return <div className="comment-item comment-empty">No comments yet.</div>;
                            const userInfo = getUserInfo(latest.userId);
                            return (
                                <div key={latest.id} className="comment-item">
                                    <div className="comment-header-row">
                                        <div className="user-details comment-user-details">
                                            <FaUserCircle className="user-icon" />
                                            <span>{userInfo.username}</span>
                                            {userInfo.roles.length > 0 && (
                                                <span className="user-role-badge">{formatRole(userInfo.roles)}</span>
                                            )}
                                        </div>
                                        <span className="comment-timestamp">{formatCommentTime(latest.createdAt)}</span>
                                    </div>
                                    <p className="comment-content-text">{latest.content}</p>
                                </div>
                            );
                        })()}
                    </div>
                    <div className="new-comment-input-area">
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="add-comment-button">Add Comment</button>
                    </div>
                    <CommentPopUp
                        isOpen={showCommentPopUp}
                        comments={taskDetails.comments}
                        getUserInfo={getUserInfo}
                        formatRole={formatRole}
                        formatCommentTime={formatCommentTime}
                        onClose={() => setShowCommentPopUp(false)}
                    />
                </div>

                {/* Attachments Card */}
                <div className="task-card attachments-card">
                    <div className="section-header-row">
                        <h2 className="card-title">Attachments</h2>
                        <button className="view-all-section-btn" onClick={() => setShowAttachmentPopUp(true)}>
                            <FaEye style={{ marginRight: 6 }} /> View All
                        </button>
                    </div>
                    <div className="upload-zone">
                        <FaPaperclip className="upload-icon-main" />
                        <span>Drag files here or click to upload</span>
                    </div>
                    <div className="attachments-list-container">
                        {(taskDetails.attachments || []).slice(0, 3).map(attachment => (
                            <div key={attachment.id} className="attachment-item-entry">
                                <div className="file-icon-wrapper">{getFileIcon(attachment.fileType)}</div>
                                <div className="attachment-details">
                                    <span className="attachment-file-name">{attachment.fileName}</span>
                                    <span className="attachment-meta-info">
                                        {attachment.fileType} • {attachment.fileSize} bytes
                                    </span>
                                </div>
                                <button className="download-attachment-button"><FaDownload /></button>
                            </div>
                        ))}
                    </div>
                    <AttachmentPopUp
                        isOpen={showAttachmentPopUp}
                        attachments={taskDetails.attachments}
                        getFileIcon={getFileIcon}
                        getUserInfo={getUserInfo}
                        formatCommentTime={formatCommentTime}
                        onClose={() => setShowAttachmentPopUp(false)}
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal (not shown in images, but good practice to keep) */}
            {/* {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Delete Task</h2>
                        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="delete-button" onClick={() => { setShowDeleteConfirm(false); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )} */}
            <ConfirmDialog
                isOpen={confirmDialog.open}
                message={confirmDialog.message}
                onConfirm={async () => { if (confirmDialog.onConfirm) await confirmDialog.onConfirm(); }}
                onCancel={() => setConfirmDialog({ open: false })}
            />
    </div>
  );
};

export default TaskDashboard; 
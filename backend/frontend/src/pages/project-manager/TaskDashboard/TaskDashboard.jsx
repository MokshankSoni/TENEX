import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaEdit, FaTrash, FaCheck, FaPaperclip,
    FaEllipsisV, FaUserCircle, FaClock, FaCalendarAlt,
    FaCheckCircle, FaTimes, FaPlus, FaFile, FaFileImage,
    FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive,
    FaDownload, FaChevronRight
} from 'react-icons/fa';
import './TaskDashboard.css';
import { TASK_ENDPOINTS } from '../../../config/apiEndpoints';
import { getToken, getTenantId } from '../../../utils/storageUtils';

const TaskDashboard = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.log(response.data);
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

    const formatCommentTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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
                                <input type="checkbox" checked={item.completed} onChange={() => {}} />
                                <span className={item.completed ? 'completed-item' : ''}>{item.item}</span>
                                <button className="remove-checklist-item"><FaTimes /></button>
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
                        <button className="add-checklist-button"><FaPlus /></button>
                    </div>
                </div>

                {/* Comments Card */}
                <div className="task-card comments-card">
                    <h2 className="card-title">Comments</h2>
                    <div className="comments-list-container">
                        {taskDetails.comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-header-row">
                                    <div className="user-details comment-user-details"><FaUserCircle className="user-icon" /><span>{comment.user}</span></div>
                                    <span className="comment-timestamp">{formatCommentTime(comment.timestamp)}</span>
                                </div>
                                <p className="comment-content-text">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="new-comment-input-area">
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="add-comment-button">Add Comment</button>
                    </div>
                </div>

                {/* Attachments Card */}
                <div className="task-card attachments-card">
                    <h2 className="card-title">Attachments</h2>
                    <div className="upload-zone">
                        <FaPaperclip className="upload-icon-main" />
                        <span>Drag files here or click to upload</span>
                    </div>
                    <div className="attachments-list-container">
                        {(taskDetails.attachments || []).map(attachment => (
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
    </div>
  );
};

export default TaskDashboard; 
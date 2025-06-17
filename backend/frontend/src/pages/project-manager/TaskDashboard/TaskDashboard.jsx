import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaCheck, FaPaperclip,
    FaEllipsisV, FaUserCircle, FaClock, FaCalendarAlt,
    FaCheckCircle, FaTimes, FaPlus, FaFile, FaFileImage,
    FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive,
    FaDownload, FaChevronRight
} from 'react-icons/fa';
import './TaskDashboard.css';

const TaskDashboard = () => {
    const navigate = useNavigate();
  const { taskId } = useParams();
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newChecklistItem, setNewChecklistItem] = useState('');

    // Hardcoded data for demonstration
    const taskData = {
        id: 'TASK-001',
        title: 'Implement User Authentication System',
        description: 'Develop a secure authentication system with JWT tokens, including login, registration, and password reset functionality. This system should handle user sessions securely and provide proper error handling.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2024-03-15T00:00:00Z', // Changed to ISO string for consistent date parsing
        estimatedTime: '40 hours',
        project: {
            id: 'PROJ-001',
            name: 'E-commerce Platform'
        },
        createdBy: {
            id: 1,
            name: 'John Doe',
            avatar: null
        },
        assignedTo: {
            id: 2,
            name: 'Jane Smith',
            avatar: null
        },
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-15T14:30:00Z',
        checklist: [
            { id: 1, text: 'Set up JWT authentication', completed: true },
            { id: 2, text: 'Implement login functionality', completed: true },
            { id: 3, text: 'Create registration system', completed: false },
            { id: 4, text: 'Add password reset feature', completed: false },
            { id: 5, text: 'Add rate limiting for security', completed: false } // Added this based on image
        ],
        statusHistory: [
            // Note: Status history is not visible in the provided images, so it's kept as data but not rendered.
            { id: 1, oldStatus: 'TODO', newStatus: 'IN_PROGRESS', changedBy: 'John Doe', timestamp: '2024-02-01T10:00:00' },
            { id: 2, oldStatus: 'IN_PROGRESS', newStatus: 'IN_REVIEW', changedBy: 'Jane Smith', timestamp: '2024-02-10T15:30:00' },
            { id: 3, oldStatus: 'IN_REVIEW', newStatus: 'IN_PROGRESS', changedBy: 'John Doe', timestamp: '2024-02-15T14:30:00' }
        ],
        comments: [
            { id: 1, user: 'John Doe', content: 'Started working on the authentication system. JWT setup is complete.', timestamp: '2024-02-01T10:05:00' },
            { id: 2, user: 'Jane Smith', content: 'Please make sure to implement rate limiting for login attempts to prevent brute force attacks.', timestamp: '2024-02-02T11:20:00' },
            { id: 3, user: 'John Doe', content: 'Will add rate limiting in the next iteration. Currently focusing on core functionality.', timestamp: '2024-02-03T09:15:00' } // Added this based on image
        ],
        attachments: [
            { id: 1, name: 'auth-design.pdf', type: 'application/pdf', size: '2.5MB', uploadedBy: 'John Doe', timestamp: '2024-02-01T10:10:00' },
            { id: 2, name: 'api-specs.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '1.2MB', uploadedBy: 'Jane Smith', timestamp: '2024-02-02T11:30:00' },
            { id: 3, name: 'security-requirements.txt', type: 'text/plain', size: '45KB', uploadedBy: 'Jane Smith', timestamp: '2024-02-02T11:30:00' } // Added this based on image
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO': return '#F59E0B'; // Amber
            case 'IN_PROGRESS': return '#2563EB'; // Blue
            case 'IN_REVIEW': return '#8B5CF6'; // Purple
            case 'COMPLETED': return '#10B981'; // Green
            case 'BLOCKED': return '#EF4444'; // Red
            default: return '#6B7280'; // Gray
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return '#EF4444'; // Red
            case 'MEDIUM': return '#F59E0B'; // Amber
            case 'LOW': return '#10B981'; // Green
            default: return '#6B7280'; // Gray
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('image')) return <FaFileImage />;
        if (fileType.includes('pdf')) return <FaFilePdf />;
        if (fileType.includes('word') || fileType.includes('officedocument.wordprocessingml')) return <FaFileWord />;
        if (fileType.includes('excel') || fileType.includes('officedocument.spreadsheetml')) return <FaFileExcel />;
        if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return <FaFileArchive />;
        return <FaFile />;
    };

    const formatReadableDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatCommentTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const calculateChecklistProgress = () => {
        if (taskData.checklist.length === 0) return 0;
        const completed = taskData.checklist.filter(item => item.completed).length;
        return Math.round((completed / taskData.checklist.length) * 100);
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
                        <div className="task-id-badge">{taskData.id}</div>
                        <h1 className="task-detail-title">{taskData.title}</h1>
                    </div>
                    <div className="task-meta-info">
                        <div className="meta-info-group">
                            <span className="status-label" style={{ backgroundColor: getStatusColor(taskData.status) }}>
                                <span className="status-dot"></span>
                                {taskData.status.replace('_', ' ')}
                            </span>
                            <span className="priority-label" style={{ backgroundColor: getPriorityColor(taskData.priority) }}>
                                <span className="priority-dot"></span>
                                {taskData.priority}
                            </span>
                        </div>
                        <div className="meta-info-group">
                            <span className="due-date-info">
                                <FaCalendarAlt />
                                <span>Due {formatReadableDate(taskData.dueDate)}</span>
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
                    <p className="task-description-text">{taskData.description}</p>
                    <div className="user-date-info-grid">
                        <div>
                            <span className="info-label">Created By</span>
                            <div className="user-details"><FaUserCircle className="user-icon" /><span>{taskData.createdBy.name}</span></div>
                        </div>
                        <div>
                            <span className="info-label">Assigned To</span>
                            <div className="user-details"><FaUserCircle className="user-icon" /><span>{taskData.assignedTo.name}</span></div>
                        </div>
                        <div>
                            <span className="info-label">Created</span>
                            <span className="date-time">{formatReadableDate(taskData.createdAt)}</span>
                        </div>
                        <div>
                            <span className="info-label">Last Updated</span>
                            <span className="date-time">{formatReadableDate(taskData.updatedAt)}</span>
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
                        {taskData.checklist.map(item => (
                            <div key={item.id} className="checklist-item-entry">
                                <input type="checkbox" checked={item.completed} onChange={() => {}} />
                                <span className={item.completed ? 'completed-item' : ''}>{item.text}</span>
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
                        {taskData.comments.map(comment => (
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
                        {taskData.attachments.map(attachment => (
                            <div key={attachment.id} className="attachment-item-entry">
                                <div className="file-icon-wrapper">{getFileIcon(attachment.type)}</div>
                                <div className="attachment-details">
                                    <span className="attachment-file-name">{attachment.name}</span>
                                    <span className="attachment-meta-info">{attachment.size} • {attachment.uploadedBy}</span>
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
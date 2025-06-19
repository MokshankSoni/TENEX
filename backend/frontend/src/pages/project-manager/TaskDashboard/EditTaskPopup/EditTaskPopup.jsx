import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { TASK_ENDPOINTS } from '../../../../config/apiEndpoints';
import { getToken, getTenantId, getUserData } from '../../../../utils/storageUtils';
import './EditTaskPopup.css';

const EditTaskPopup = ({ task, onClose, onTaskUpdated }) => {
    const [editTaskForm, setEditTaskForm] = useState({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'TODO',
        projectId: task.projectId || null,
        assignedTo: task.assignedTo || null,
        createdBy: task.createdBy || getUserData()?.id,
        estimatedTime: task.estimatedTime || null,
        updatedAt: new Date().toISOString()
    });

    const handleEditTaskChange = (e) => {
        const { name, value } = e.target;
        setEditTaskForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditTaskSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        const tenantId = getTenantId();
        
        if (!token || !tenantId) {
            console.error('Missing authentication credentials');
            return;
        }

        try {
            const updateData = {
                ...editTaskForm,
                createdBy: task.createdBy, // Preserve the original creator
                assignedTo: task.assignedTo, // Preserve the original assignee
                estimatedTime: task.estimatedTime // Preserve the original estimated time
            };

            await axios.put(TASK_ENDPOINTS.UPDATE_TASK(task.id), updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-TenantID': tenantId
                }
            });
            onTaskUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    return (
        <div className="edit-task-popup-overlay">
            <div className="edit-task-popup">
                <div className="edit-task-popup-header">
                    <h2>Edit Task</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleEditTaskSubmit} className="edit-task-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={editTaskForm.title}
                            onChange={handleEditTaskChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={editTaskForm.description}
                            onChange={handleEditTaskChange}
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={editTaskForm.priority}
                            onChange={handleEditTaskChange}
                        >
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={editTaskForm.status}
                            onChange={handleEditTaskChange}
                        >
                            <option value="TODO">To Do</option>
                            <option value="In_Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={editTaskForm.dueDate}
                            onChange={handleEditTaskChange}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskPopup; 
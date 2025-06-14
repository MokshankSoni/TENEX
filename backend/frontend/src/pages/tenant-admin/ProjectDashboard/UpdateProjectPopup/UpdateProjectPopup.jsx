import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { getToken, getTenantId } from '../../../../utils/storageUtils';
import { PROJECT_ENDPOINTS } from '../../../../config/apiEndpoints';
import { toast } from 'react-toastify';
import './UpdateProjectPopup.css';

const UpdateProjectPopup = ({ isOpen, onClose, projectData, onProjectUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectData) {
      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().split('T')[0] : '',
        endDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : '',
        status: projectData.status || ''
      });
    }
  }, [projectData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.put(
        PROJECT_ENDPOINTS.UPDATE_PROJECT(projectData.id),
        {
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-TenantId': tenantId,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Project updated successfully!', {
          autoClose: 1300,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onProjectUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project', {
        autoClose: 1300,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-project-overlay">
      <div className="update-project-popup">
        <div className="popup-header">
          <h2>Update Project</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="update-project-form">
          <div className="form-group">
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectPopup; 
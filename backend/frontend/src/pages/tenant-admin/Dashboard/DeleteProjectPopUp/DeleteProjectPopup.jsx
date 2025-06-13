import React, { useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { PROJECT_ENDPOINTS } from '../../../../config/apiEndpoints';
import { getToken, getTenantId } from '../../../../utils/storageUtils';
import axios from 'axios';
import './DeleteProjectPopup.css';

const DeleteProjectPopup = ({ isOpen, onClose, projects, onProjectDeleted }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    try {
      const token = getToken();
      const tenantId = getTenantId();

      const response = await axios.delete(
        PROJECT_ENDPOINTS.DELETE_PROJECT(selectedProject.id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-TenantId': tenantId
          }
        }
      );

      if (response.status === 200) {
        // Call the callback to update the projects list in the parent component
        if (onProjectDeleted) {
          onProjectDeleted(selectedProject.id);
        }
        // Close the confirmation dialog and main popup
        setSelectedProject(null);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancelDelete = () => {
    setSelectedProject(null);
  };

  if (!isOpen) return null;

  return (
    <div className="delete-project-overlay">
      <div className="delete-project-popup">
        <div className="popup-header">
          <h2>Delete Project</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-info">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick(project);
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete project "{selectedProject.name}"?</p>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirmDelete();
                  }}
                >
                  Delete
                </button>
                <button 
                  className="cancel-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelDelete();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteProjectPopup; 
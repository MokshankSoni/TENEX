import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECT_ENDPOINTS, USER_PROJECT_ASSIGNMENT } from '../../../../config/apiEndpoints';
import { useAuth } from '../../../../hooks/useAuth';
import { getTenantId, getToken } from '../../../../utils/storageUtils';
import axios from 'axios';
import './ProjectPopUp.css';

const ProjectPopUp = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Storage utilities
  const token = getToken();
  const tenantId = getTenantId();

  useEffect(() => {
    if (isOpen) {
      fetchAssignedProjects();
    }
  }, [isOpen]);

  const fetchAssignedProjects = async () => {
    setLoading(true);
    setError('');
    try {
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!tenantId) {
        throw new Error('Tenant ID not found');
      }

      // First, get the project assignments
      const response = await axios.get(USER_PROJECT_ASSIGNMENT.MY_ASSIGNMENTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-TenantID': tenantId
        }
      });

      // Handle different response formats
      let assignments = [];
      if (Array.isArray(response.data)) {
        assignments = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object, try to find the array inside it
        assignments = Object.values(response.data).find(val => Array.isArray(val)) || [];
      }


      if (assignments.length === 0) {
        setProjects([]);
        return;
      }

      // Then, fetch details for each assigned project
      const projectDetails = await Promise.all(
        assignments.map(async (assignment) => {
          try {
            const projectUrl = PROJECT_ENDPOINTS.GET_PROJECT(assignment.projectId);
            const { data: projectData } = await axios.get(projectUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-TenantID': tenantId
              }
            });
            return projectData;
          } catch (err) {
            console.error('Error fetching project details:', err);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validProjects = projectDetails.filter(project => project !== null);
      setProjects(validProjects);
    } catch (err) {
      console.error('Error in fetchAssignedProjects:', err);
      setError('Failed to fetch projects');
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view projects.');
      } else {
        setError('Failed to fetch projects. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/project-manager/project/${project.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="project-popup-overlay" onClick={onClose}>
      <div className="project-popup-content" onClick={e => e.stopPropagation()}>
        <div className="project-popup-header">
          <h2>My Projects</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="projects-container">
            {projects.map(project => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => handleProjectClick(project)}
              >
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-status">
                  <span className={`status-badge ${project.status.toLowerCase()}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="project-details">
                  <span className="detail-item">
                    <i className="fas fa-calendar"></i>
                    Start: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  <span className="detail-item">
                    <i className="fas fa-flag-checkered"></i>
                    End: {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPopUp; 
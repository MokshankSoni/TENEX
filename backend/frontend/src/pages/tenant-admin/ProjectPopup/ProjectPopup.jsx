import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { PROJECT_ENDPOINTS } from '../../../config/apiEndpoints';
import './ProjectPopup.css';

const ProjectPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(PROJECT_ENDPOINTS.GET_PROJECTS);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/tenant-admin/project/${project.id}`, { state: { projectData: project } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="project-popup-overlay" onClick={onClose}>
      <div className="project-popup-content" onClick={e => e.stopPropagation()}>
        <div className="project-popup-header">
          <h2>Projects</h2>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPopup; 
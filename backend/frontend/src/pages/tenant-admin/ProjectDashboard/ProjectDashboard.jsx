import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Button from '../../../components/common/Button/Button';
import { PROJECT_ENDPOINTS } from '../../../config/apiEndpoints';
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.GET_PROJECT(projectId));
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/tenant-admin/dashboard');
  };

  if (loading) {
    return (
      <div className="project-dashboard-container">
        <div className="loading">Loading project details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-dashboard-container">
        <div className="error">Project not found</div>
      </div>
    );
  }

  return (
    <div className="project-dashboard-container">
      <div className="project-dashboard-header">
        <Button
          type="button"
          variant="secondary"
          size="medium"
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
        <h1>{project.name}</h1>
      </div>

      <div className="project-dashboard-content">
        <div className="project-info-card">
          <h2>Project Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Status</label>
              <span className={`status-badge ${project.status.toLowerCase()}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <div className="info-item">
              <label>Start Date</label>
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>End Date</label>
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Created At</label>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="project-description-card">
          <h2>Description</h2>
          <p>{project.description}</p>
        </div>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default ProjectDashboard; 
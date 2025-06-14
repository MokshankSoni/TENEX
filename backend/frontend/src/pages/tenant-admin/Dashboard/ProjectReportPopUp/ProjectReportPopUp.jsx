import React from 'react';
import { FaTimes, FaCalendarAlt, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import './ProjectReportPopUp.css';

const ProjectReportPopUp = ({ isOpen, onClose, projects }) => {
  if (!isOpen) return null;

  const calculateProjectMetrics = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const onHoldProjects = projects.filter(p => p.status === 'ON_HOLD').length;
    const cancelledProjects = projects.filter(p => p.status === 'CANCELLED').length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      onHoldProjects,
      cancelledProjects
    };
  };

  const calculateProjectTimeline = (project) => {
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

    return {
      totalDays,
      daysElapsed,
      daysRemaining,
      progressPercentage,
      isOverdue: daysRemaining < 0
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <FaChartLine className="status-icon active" />;
      case 'COMPLETED':
        return <FaCheckCircle className="status-icon completed" />;
      case 'ON_HOLD':
        return <FaClock className="status-icon on-hold" />;
      case 'CANCELLED':
        return <FaExclamationTriangle className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const metrics = calculateProjectMetrics();

  return (
    <div className="project-report-overlay">
      <div className="project-report-popup">
        <div className="popup-header">
          <h2>Project Report</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="report-content">
          {/* Summary Section */}
          <div className="summary-section">
            <h3>Project Summary</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-value">{metrics.totalProjects}</span>
                <span className="metric-label">Total Projects</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{metrics.activeProjects}</span>
                <span className="metric-label">Active Projects</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{metrics.completedProjects}</span>
                <span className="metric-label">Completed Projects</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{metrics.onHoldProjects}</span>
                <span className="metric-label">On Hold</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{metrics.cancelledProjects}</span>
                <span className="metric-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="projects-section">
            <h3>Project Details</h3>
            <div className="projects-list">
              {projects.map((project) => {
                const timeline = calculateProjectTimeline(project);
                return (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h4>{project.name}</h4>
                      <div className="project-status">
                        {getStatusIcon(project.status)}
                        <span>{project.status}</span>
                      </div>
                    </div>
                    
                    <div className="project-timeline">
                      <div className="timeline-info">
                        <FaCalendarAlt className="timeline-icon" />
                        <div className="timeline-details">
                          <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                          <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${timeline.progressPercentage}%` }}
                        />
                      </div>
                      
                      <div className="timeline-metrics">
                        <span className={timeline.isOverdue ? 'overdue' : ''}>
                          {timeline.isOverdue 
                            ? `${Math.abs(timeline.daysRemaining)} days overdue`
                            : `${timeline.daysRemaining} days remaining`}
                        </span>
                        <span>{Math.round(timeline.progressPercentage)}% complete</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPopUp; 
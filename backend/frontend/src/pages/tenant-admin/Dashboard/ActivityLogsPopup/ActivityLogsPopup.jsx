import React, { useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken, getTenantId } from '../../../../utils/storageUtils';
import { ACTIVITY_LOG_ENDPOINTS } from '../../../../config/apiEndpoints';
import './ActivityLogsPopup.css';

const ActivityLogsPopup = ({ isOpen, onClose, activityLogs, users, getUserName, getTimeAgo, formatAction }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDeleteOldestLogs = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const token = getToken();
      const tenantId = getTenantId();

      if (!token || !tenantId) {
        setError('Authentication token or tenant ID is missing');
        return;
      }

      await axios.delete(ACTIVITY_LOG_ENDPOINTS.DELETE_OLDEST_LOGS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-TenantId': tenantId
        }
      });

      // Show success toast
      toast.success('Oldest 20 logs deleted successfully', {
        position: "top-right",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close the popup and redirect to dashboard
      onClose();
      navigate('/tenant-admin/dashboard');
    } catch (err) {
      console.error('Error deleting oldest logs:', err);
      setError('Failed to delete oldest logs. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="activity-logs-overlay">
      <div className="activity-logs-popup">
        <div className="popup-header">
          <h2>Activity Logs</h2>
          <div className="header-actions">
            <button 
              className="delete-oldest-button"
              onClick={handleDeleteOldestLogs}
              disabled={isDeleting}
            >
              <FaTrash /> Delete Oldest 20 Logs
            </button>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="activity-logs-list">
          {[...activityLogs].reverse().map((log) => (
            <div key={log.id} className="activity-log-item">
              <div className="activity-log-info">
                <span className="user-name">{getUserName(log.userId)}</span>
                <span className="activity-action">{formatAction(log.action)}</span>
                <span className="activity-time">{getTimeAgo(log.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPopup; 
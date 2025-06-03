import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { validateDate, validateFutureDate } from '../../../utils/validators';
import { formatDate } from '../../../utils/dateUtils';
import api from '../../../services/api';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ON_HOLD'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    const startDateError = validateFutureDate(formData.startDate, 'Start date');
    if (startDateError) {
      newErrors.startDate = startDateError;
    }

    const endDateError = validateDate(formData.endDate, 'End date');
    if (endDateError) {
      newErrors.endDate = endDateError;
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/projects', formData);
      
      if (response.status === 201) {
        // Redirect to projects list or dashboard
        navigate('/tenant-admin/dashboard');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-container">
      <div className="create-project-content">
        <h1 className="create-project-title">Create New Project</h1>
        <p className="create-project-subtitle">
          Fill in the details below to create a new project.
        </p>

        <form onSubmit={handleSubmit} className="create-project-form">
          <Input
            type="text"
            name="name"
            label="Project Name"
            value={formData.name}
            placeholder="Enter project name"
            error={errors.name}
            onChange={handleChange}
            required
            size="medium"
            fullWidth
          />

          <Input
            type="text"
            name="description"
            label="Description"
            value={formData.description}
            placeholder="Enter project description"
            error={errors.description}
            onChange={handleChange}
            required
            size="medium"
            fullWidth
          />

          <Input
            type="date"
            name="startDate"
            label="Start Date"
            value={formData.startDate}
            error={errors.startDate}
            onChange={handleChange}
            required
            size="medium"
            fullWidth
          />

          <Input
            type="date"
            name="endDate"
            label="End Date"
            value={formData.endDate}
            error={errors.endDate}
            onChange={handleChange}
            required
            size="medium"
            fullWidth
          />

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ON_HOLD">On Hold</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {error && <div className="create-project-error">{error}</div>}

          <div className="create-project-actions">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              onClick={() => navigate('/tenant-admin/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              loading={loading}
              disabled={loading}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject; 
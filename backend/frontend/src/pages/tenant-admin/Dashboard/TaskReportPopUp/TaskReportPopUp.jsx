import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './TaskReportPopUp.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TaskReportPopUp = ({ isOpen, onClose, tasks }) => {
  const [selectedPriority, setSelectedPriority] = useState(null);

  const getPriorityData = () => {
    const priorityCounts = {
      HIGH: tasks.filter(task => task.priority.toUpperCase() === 'HIGH').length,
      MEDIUM: tasks.filter(task => task.priority.toUpperCase() === 'MEDIUM').length,
      LOW: tasks.filter(task => task.priority.toUpperCase() === 'LOW').length
    };

    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          label: 'Number of Tasks',
          data: [priorityCounts.HIGH, priorityCounts.MEDIUM, priorityCounts.LOW],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getStatusDataByPriority = (priority) => {
    const priorityTasks = tasks.filter(task => task.priority.toUpperCase() === priority.toUpperCase());
    const statusCounts = {
      TODO: priorityTasks.filter(task => task.status.toUpperCase() === 'TODO').length,
      IN_PROGRESS: priorityTasks.filter(task => task.status.toUpperCase() === 'IN_PROGRESS').length,
      COMPLETED: priorityTasks.filter(task => task.status.toUpperCase() === 'COMPLETED').length
    };

    return {
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [
        {
          data: [statusCounts.TODO, statusCounts.IN_PROGRESS, statusCounts.COMPLETED],
          backgroundColor: [
            'rgba(255, 206, 86, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution by Priority',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Status Distribution for ${selectedPriority} Priority Tasks`,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-report-overlay">
      <div className="task-report-popup">
        <div className="popup-header">
          <h2>Task Reports</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="charts-container">
          <div className="main-chart-section">
            <div className="bar-chart-container">
              <Bar data={getPriorityData()} options={barOptions} />
            </div>
          </div>

          <div className="priority-sections">
            <div 
              className={`priority-section ${selectedPriority === 'HIGH' ? 'active' : ''}`}
              onClick={() => setSelectedPriority('HIGH')}
            >
              <div className="priority-header">
                <h3>High Priority</h3>
                <span className="priority-count">{tasks.filter(task => task.priority.toUpperCase() === 'HIGH').length}</span>
              </div>
              <div className="priority-stats">
                <div className="stat-item">
                  <span className="stat-label">To Do</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'HIGH' && task.status.toUpperCase() === 'TODO').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'HIGH' && task.status.toUpperCase() === 'IN_PROGRESS').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'HIGH' && task.status.toUpperCase() === 'COMPLETED').length}</span>
                </div>
              </div>
            </div>

            <div 
              className={`priority-section ${selectedPriority === 'MEDIUM' ? 'active' : ''}`}
              onClick={() => setSelectedPriority('MEDIUM')}
            >
              <div className="priority-header">
                <h3>Medium Priority</h3>
                <span className="priority-count">{tasks.filter(task => task.priority.toUpperCase() === 'MEDIUM').length}</span>
              </div>
              <div className="priority-stats">
                <div className="stat-item">
                  <span className="stat-label">To Do</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'MEDIUM' && task.status.toUpperCase() === 'TODO').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'MEDIUM' && task.status.toUpperCase() === 'IN_PROGRESS').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'MEDIUM' && task.status.toUpperCase() === 'COMPLETED').length}</span>
                </div>
              </div>
            </div>

            <div 
              className={`priority-section ${selectedPriority === 'LOW' ? 'active' : ''}`}
              onClick={() => setSelectedPriority('LOW')}
            >
              <div className="priority-header">
                <h3>Low Priority</h3>
                <span className="priority-count">{tasks.filter(task => task.priority.toUpperCase() === 'LOW').length}</span>
              </div>
              <div className="priority-stats">
                <div className="stat-item">
                  <span className="stat-label">To Do</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'LOW' && task.status.toUpperCase() === 'TODO').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'LOW' && task.status.toUpperCase() === 'IN_PROGRESS').length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{tasks.filter(task => task.priority.toUpperCase() === 'LOW' && task.status.toUpperCase() === 'COMPLETED').length}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedPriority && (
            <div className="pie-chart-section">
              <div className="pie-chart-container">
                <Pie data={getStatusDataByPriority(selectedPriority)} options={pieOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskReportPopUp; 
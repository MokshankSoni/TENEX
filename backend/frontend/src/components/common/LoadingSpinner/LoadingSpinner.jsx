// src/components/common/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  className = '',
  text = ''
}) => {
  const spinnerClass = [
    'loading-spinner',
    `loading-spinner-${size}`,
    `loading-spinner-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="loading-spinner-container">
      <div className={spinnerClass}>
        <div className="loading-spinner-circle"></div>
      </div>
      {text && (
        <span className="loading-spinner-text">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
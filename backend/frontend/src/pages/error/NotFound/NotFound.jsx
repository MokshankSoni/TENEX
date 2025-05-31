import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button primary">
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="not-found-button secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 
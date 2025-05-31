import React from 'react';
import { Link } from 'react-router-dom';
import './ServerError.css';

const ServerError = () => {
  return (
    <div className="server-error-container">
      <div className="server-error-content">
        <h1 className="server-error-title">500</h1>
        <h2 className="server-error-subtitle">Internal Server Error</h2>
        <p className="server-error-message">
          Oops! Something went wrong on our end. Our team has been notified and is
          working to fix the issue. Please try again later.
        </p>
        <div className="server-error-actions">
          <Link to="/" className="server-error-button primary">
            Go to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="server-error-button secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerError; 
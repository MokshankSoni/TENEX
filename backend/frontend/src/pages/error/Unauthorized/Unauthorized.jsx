import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">401</h1>
        <h2 className="unauthorized-subtitle">Unauthorized Access</h2>
        <p className="unauthorized-message">
          You don't have permission to access this page. Please sign in with the
          appropriate credentials or contact your administrator for access.
        </p>
        <div className="unauthorized-actions">
          <Link to="/signin" className="unauthorized-button primary">
            Sign In
          </Link>
          <button
            onClick={() => window.history.back()}
            className="unauthorized-button secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 
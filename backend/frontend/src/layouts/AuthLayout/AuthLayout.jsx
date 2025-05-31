// src/layouts/AuthLayout/AuthLayout.jsx
import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          {children}
        </div>

        <div className="auth-layout-footer">
          <div className="auth-footer-content">
            <p className="auth-footer-text">
              © 2025 Project Management System. All rights reserved.
            </p>
            <div className="auth-footer-links">
              <a href="/privacy" className="auth-footer-link">Privacy Policy</a>
              <a href="/terms" className="auth-footer-link">Terms of Service</a>
              <a href="/support" className="auth-footer-link">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
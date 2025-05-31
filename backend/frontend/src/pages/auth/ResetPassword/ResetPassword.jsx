import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './ResetPassword.css';

const ResetPassword = () => {
  const { resetPassword, loading, error } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-content">
          <h1 className="reset-password-title">Invalid Reset Link</h1>
          <p className="reset-password-message">
            The password reset link is invalid or has expired.
            Please request a new password reset link.
          </p>
          <div className="reset-password-actions">
            <Link to="/forgot-password" className="reset-password-link">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    try {
      await resetPassword(token, email, values.password);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset failed:', err);
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    isSubmitting
  } = useForm(
    {
      password: '',
      confirmPassword: ''
    },
    validate,
    handleSubmit
  );

  if (isSubmitted) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-content">
          <h1 className="reset-password-title">Password Reset Successful</h1>
          <p className="reset-password-message">
            Your password has been successfully reset.
            You can now sign in with your new password.
          </p>
          <div className="reset-password-actions">
            <Button
              variant="primary"
              size="medium"
              fullWidth
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <h1 className="reset-password-title">Reset Password</h1>
        <p className="reset-password-subtitle">
          Please enter your new password below.
        </p>

        <form onSubmit={submitForm} className="reset-password-form">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="New Password"
            value={values.password}
            placeholder="Enter your new password"
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <div className="reset-password-show-password">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showPassword">Show password</label>
          </div>

          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            label="Confirm New Password"
            value={values.confirmPassword}
            placeholder="Confirm your new password"
            error={errors.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <div className="reset-password-show-password">
            <input
              type="checkbox"
              id="showConfirmPassword"
              checked={showConfirmPassword}
              onChange={(e) => setShowConfirmPassword(e.target.checked)}
            />
            <label htmlFor="showConfirmPassword">Show password</label>
          </div>

          {error && <div className="reset-password-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            Reset Password
          </Button>
        </form>

        <div className="reset-password-footer">
          <p>
            Remember your password?{' '}
            <Link to="/signin" className="reset-password-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 
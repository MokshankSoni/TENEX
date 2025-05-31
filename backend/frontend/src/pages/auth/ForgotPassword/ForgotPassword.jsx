import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { forgotPassword, loading, error } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    try {
      await forgotPassword(values.email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset request failed:', err);
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
      email: ''
    },
    validate,
    handleSubmit
  );

  if (isSubmitted) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <h1 className="forgot-password-title">Check Your Email</h1>
          <p className="forgot-password-message">
            We've sent password reset instructions to your email address.
            Please check your inbox and follow the link to reset your password.
          </p>
          <div className="forgot-password-actions">
            <Link to="/signin" className="forgot-password-link">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <p className="forgot-password-subtitle">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={submitForm} className="forgot-password-form">
          <Input
            type="email"
            name="email"
            label="Email"
            value={values.email}
            placeholder="Enter your email"
            error={errors.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          {error && <div className="forgot-password-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            Send Reset Instructions
          </Button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password?{' '}
            <Link to="/signin" className="forgot-password-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 
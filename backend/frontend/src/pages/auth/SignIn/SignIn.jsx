// src/pages/auth/SignIn/SignIn.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './SignIn.css';

const SignIn = () => {
  const { signIn, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Username is required';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.tenantId) {
      errors.tenantId = 'Tenant ID is required';
    }

    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    try {
      await signIn(values);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Sign in failed:', err);
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
      username: '',
      password: '',
      tenantId: ''
    },
    validate,
    handleSubmit
  );

  return (
    <div className="signin-container">
      <div className="signin-content">
        <h1 className="signin-title">Sign In</h1>
        <p className="signin-subtitle">
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={submitForm} className="signin-form">
          <Input
            type="text"
            name="username"
            label="Username"
            value={values.username}
            placeholder="Enter your username"
            error={errors.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <Input
            type="text"
            name="tenantId"
            label="Tenant ID"
            value={values.tenantId}
            placeholder="Enter your tenant ID"
            error={errors.tenantId}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Password"
            value={values.password}
            placeholder="Enter your password"
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <div className="signin-options">
            <label className="signin-remember">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show password</span>
            </label>

            <Link to="/forgot-password" className="signin-forgot">
              Forgot password?
            </Link>
          </div>

          {error && <div className="signin-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <div className="signin-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="signin-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
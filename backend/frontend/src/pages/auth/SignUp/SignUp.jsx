import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './SignUp.css';

const SignUp = () => {
  const { signUp, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { value: 'superAdmin', label: 'Super Admin' },
    { value: 'tenantAdmin', label: 'Tenant Admin' },
    { value: 'projectManager', label: 'Project Manager' },
    { value: 'teamMember', label: 'Team Member' },
    { value: 'client', label: 'Client' }
  ];

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Username is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!values.tenantId) {
      errors.tenantId = 'Tenant ID is required';
    }

    if (!values.role) {
      errors.role = 'Role is required';
    }

    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        tenantId: values.tenantId,
        roles: [values.role] // Use selected role
      };
      await signUp(userData);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Sign up failed:', err);
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
      email: '',
      password: '',
      confirmPassword: '',
      tenantId: '',
      role: 'teamMember' // Default role
    },
    validate,
    handleSubmit
  );

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">
          Join us today! Please fill in your details to create an account.
        </p>

        <form onSubmit={submitForm} className="signup-form">
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

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.role ? 'is-invalid' : ''}`}
              required
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Password"
            value={values.password}
            placeholder="Create a password"
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            label="Confirm Password"
            value={values.confirmPassword}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            size="medium"
            fullWidth
          />

          <div className="signup-options">
            <label className="signup-show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show password</span>
            </label>

            <label className="signup-show-confirm-password">
              <input
                type="checkbox"
                checked={showConfirmPassword}
                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <span>Show confirm password</span>
            </label>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            fullWidth
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          >
            Sign Up
          </Button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="signup-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 
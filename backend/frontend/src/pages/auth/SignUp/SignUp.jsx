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

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

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
      await signUp(values);
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
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
          <div className="signup-name-fields">
            <Input
              type="text"
              name="firstName"
              label="First Name"
              value={values.firstName}
              placeholder="Enter your first name"
              error={errors.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              size="medium"
              fullWidth
            />

            <Input
              type="text"
              name="lastName"
              label="Last Name"
              value={values.lastName}
              placeholder="Enter your last name"
              error={errors.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              size="medium"
              fullWidth
            />
          </div>

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
            Create Account
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
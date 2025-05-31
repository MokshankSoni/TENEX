// src/utils/validators.js

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

// Password validation
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  return '';
};

// Strong password validation
export const validateStrongPassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return '';
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 20) {
    return 'Username must be less than 20 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

// Tenant ID validation
export const validateTenantId = (tenantId) => {
  if (!tenantId) {
    return 'Tenant ID is required';
  }
  if (tenantId.length < 2) {
    return 'Tenant ID must be at least 2 characters long';
  }
  if (tenantId.length > 50) {
    return 'Tenant ID must be less than 50 characters';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(tenantId)) {
    return 'Tenant ID can only contain letters, numbers, hyphens, and underscores';
  }
  return '';
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return '';
};

// URL validation
export const validateUrl = (url) => {
  if (!url) {
    return '';
  }
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

// Generic length validation
export const validateLength = (value, minLength, maxLength, fieldName = 'Field') => {
  if (!value) {
    return `${fieldName} is required`;
  }
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  if (maxLength && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return '';
};

// Number validation
export const validateNumber = (value, min, max, fieldName = 'Field') => {
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (max !== undefined && num > max) {
    return `${fieldName} must be at most ${max}`;
  }
  return '';
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return `${fieldName} is required`;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  return '';
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return `${fieldName} must be in the future`;
  }
  return '';
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
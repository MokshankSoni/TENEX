// src/components/common/Input/Input.jsx
import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  label,
  required = false,
  disabled = false,
  size = 'medium',
  fullWidth = true,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const inputClass = [
    'input',
    `input-${size}`,
    fullWidth ? 'input-full-width' : '',
    error ? 'input-error' : '',
    disabled ? 'input-disabled' : '',
    leftIcon ? 'input-with-left-icon' : '',
    rightIcon ? 'input-with-right-icon' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClass = [
    'input-container',
    fullWidth ? 'input-container-full-width' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {leftIcon && (
          <span className="input-icon input-icon-left">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          required={required}
          disabled={disabled}
          className={inputClass}
          {...props}
        />

        {rightIcon && (
          <span className="input-icon input-icon-right">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <span className="input-error-message">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
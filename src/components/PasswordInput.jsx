import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/PasswordInput.css';
import { memo } from 'react';

export const PasswordInput = memo(({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  label,
  error = false,
  errorMessage = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`password-input-container ${error ? 'error' : ''}`} data-testid="password-input-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`password-input ${error ? 'error' : ''}`}
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={toggleShowPassword}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
      {error && errorMessage && (
        <span className="error-text">{errorMessage}</span>
      )}
    </div>
  );
});

PasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string
};
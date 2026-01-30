import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/PasswordInput.css';
import { memo } from 'react';

export const PasswordInput = memo(({
  id,
  name,
  value,
  onChange,
  placeholder = " ",
  required = false,
  label = "Пароль",
  error = false,
  errorMessage = '',
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="floating-input-wrapper" data-type="password">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`floating-input ${error ? 'error' : ''}`}
        autoComplete={autoComplete}
      />
      <label htmlFor={id} className="floating-label">{label}</label>
      <button
        type="button"
        className="password-toggle-button password-toggle-button--floating"
        onClick={toggleShowPassword}
        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
      >
        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
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
  label: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  autoComplete: PropTypes.string
};
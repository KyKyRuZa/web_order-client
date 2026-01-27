import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/PasswordInput.css';

export const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  label 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-container">
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
          className="password-input"
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
    </div>
  );
};

PasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string
};
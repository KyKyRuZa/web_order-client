import React from 'react';
import { Spinner } from './Spinner';
import '../styles/Button.css';

export const Button = ({ 
  children, 
  isLoading = false, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  type = 'button', 
  onClick, 
  className = '', 
  ...props 
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    isLoading ? 'btn-loading' : '',
    disabled || isLoading ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={16} className="btn-spinner" />
          <span className="btn-text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
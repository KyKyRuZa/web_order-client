import React from 'react';
import '../styles/Spinner.css';

export const Spinner = ({ size, color, className }) => {
  const spinnerStyle = {
    width: size ? `${size}px` : undefined,
    height: size ? `${size}px` : undefined,
    borderColor: color ? `${color} transparent transparent transparent` : undefined,
  };

  return (
    <div className={`spinner-container ${className || ''}`} data-testid="spinner-container">
      <div
        className={`spinner ${className || ''}`}
        data-testid="spinner"
        style={spinnerStyle}
      ></div>
    </div>
  );
};
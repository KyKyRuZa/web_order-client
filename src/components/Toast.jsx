import { useEffect, useState } from 'react';
import '../styles/Toast.css';

export const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close">&times;</button>
          </div>
        </div>
      ))}
    </div>
  );
};
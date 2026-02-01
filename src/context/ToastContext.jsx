import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/utils/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper function to generate unique IDs
let toastCounter = 0;
const generateUniqueId = () => {
  return `toast-${++toastCounter}-${Date.now()}`;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = generateUniqueId();
    const newToast = { id, message, type };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Автоматически удаляем тост через 5 секунд
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
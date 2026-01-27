import React, { createContext, useContext, useState, useCallback } from 'react';
import { applicationsAPI } from '../api';

const ApplicationsContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};

export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationsAPI.getAll(filters);

      if (response.success) {
        setApplications(response.data.applications || []);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Ошибка получения заявок');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (applicationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationsAPI.create(applicationData);

      if (response.success) {
        // Добавляем новую заявку в список
        setApplications(prev => [...prev, response.data.application]);
        return { success: true, application: response.data.application };
      } else {
        throw new Error(response.message || 'Ошибка создания заявки');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (id, applicationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationsAPI.update(id, applicationData);

      if (response.success) {
        // Обновляем заявку в списке
        setApplications(prev =>
          prev.map(app => app.id === id ? response.data.application : app)
        );
        return { success: true, application: response.data.application };
      } else {
        throw new Error(response.message || 'Ошибка обновления заявки');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationsAPI.delete(id);

      if (response.success) {
        // Удаляем заявку из списка
        setApplications(prev => prev.filter(app => app.id !== id));
        return { success: true };
      } else {
        throw new Error(response.message || 'Ошибка удаления заявки');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const submitApplication = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await applicationsAPI.submit(id);

      if (response.success) {
        // Обновляем статус заявки в списке
        setApplications(prev =>
          prev.map(app =>
            app.id === id
              ? { ...app, status: response.data.application.status, statusDisplay: response.data.application.statusDisplay }
              : app
          )
        );
        return { success: true, application: response.data.application };
      } else {
        throw new Error(response.message || 'Ошибка отправки заявки');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    submitApplication
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};
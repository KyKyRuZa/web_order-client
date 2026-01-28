import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';
import { showApiNotification } from '../utils/toastUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async (showToast) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        // Токен недействителен, очищаем
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        if (showToast) {
          showApiNotification(response, showToast, 'Ошибка проверки статуса аутентификации');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      if (showToast) {
        showToast('Ошибка проверки статуса аутентификации', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка токена из localStorage при запуске
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Проверяем валидность токена через API
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  const login = useCallback(async (email, password, showToast) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { user, tokens } = response.data;

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        setUser(user);
        setIsAuthenticated(true);

        if (showToast) {
          showToast('Успешный вход в систему', 'success');
        }

        return { success: true, user };
      } else {
        if (showToast) {
          showApiNotification(response, showToast);
        }
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (showToast) {
        showToast('Ошибка входа в систему', 'error');
      }
      return { success: false, message: 'Ошибка подключения к серверу' };
    }
  }, []);

  const register = useCallback(async (userData, showToast) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        const { user, tokens } = response.data;

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        setUser(user);
        setIsAuthenticated(true);

        if (showToast) {
          showToast('Успешная регистрация', 'success');
        }

        return { success: true, user };
      } else {
        if (showToast) {
          showApiNotification(response, showToast);
        }
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (error) {
      console.error('Register error:', error);
      if (showToast) {
        showToast('Ошибка регистрации', 'error');
      }
      return { success: false, message: 'Ошибка подключения к серверу' };
    }
  }, []);

  const logout = useCallback(async (showToast) => {
    try {
      const response = await authAPI.logout();

      if (!response.success && showToast) {
        showApiNotification(response, showToast, 'Ошибка выхода из системы');
      }
    } catch (error) {
      console.error('Logout error:', error);
      if (showToast) {
        showToast('Ошибка выхода из системы', 'error');
      }
    } finally {
      // В любом случае очищаем локальное хранилище
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);

      // Перенаправляем на главную страницу
      window.location.href = '/';
    }
  }, []);

  const updateProfile = useCallback(async (profileData, showToast) => {
    try {
      const response = await authAPI.updateProfile(profileData);

      if (response.success) {
        setUser(response.data.user);

        if (showToast) {
          showToast('Профиль успешно обновлен', 'success');
        }

        return { success: true, user: response.data.user };
      } else {
        if (showToast) {
          showApiNotification(response, showToast);
        }
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      if (showToast) {
        showToast('Ошибка обновления профиля', 'error');
      }
      return { success: false, message: 'Ошибка обновления профиля' };
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
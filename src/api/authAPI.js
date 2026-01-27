import api from './axios';

export const authAPI = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Вход
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Выход
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Получение профиля
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Обновление токена
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // Восстановление пароля
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Сброс пароля
  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  },

  // Подтверждение email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Деактивация аккаунта
  deactivateAccount: async () => {
    const response = await api.post('/auth/deactivate');
    return response.data;
  },

  // Изменение пароля
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};
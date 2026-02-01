import api from './axios';

export const notificationsAPI = {
  // Получение уведомлений пользователя
  getNotifications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  // Получение количества непрочитанных уведомлений
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Отметка уведомления как прочитанного
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Отметка всех уведомлений как прочитанных
  markAllAsRead: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.patch(`/notifications/mark-all-read?${params}`);
    return response.data;
  },

  // Удаление уведомления
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};
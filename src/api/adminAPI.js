import api from './axios';

export const adminAPI = {
  // Заявки
  getApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/applications?${params.toString()}`);
    return response.data;
  },

  getApplicationDetails: async (id) => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/admin/applications/${id}/status`, statusData);
    return response.data;
  },

  assignManager: async (id, managerId) => {
    const response = await api.put(`/admin/applications/${id}/assign`, { managerId });
    return response.data;
  },

  addInternalNote: async (id, noteData) => {
    const response = await api.post(`/admin/applications/${id}/notes`, noteData);
    return response.data;
  },

  resetToDraft: async (id) => {
    const response = await api.post(`/admin/applications/${id}/reset-to-draft`);
    return response.data;
  },

  // Пользователи
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  updateUserRole: async (userId, roleData) => {
    const response = await api.put(`/admin/users/${userId}/role`, roleData);
    return response.data;
  },

  // Статистика
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  },

  // Экспорт
  exportApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/applications/export?${params.toString()}`);
    return response.data;
  }
};
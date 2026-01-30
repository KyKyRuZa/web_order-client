import api from './axios';

export const adminAPI = {
  // Заявки
  getApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/applications?${params}`);
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

  resetToDraft: async (id) => {
    const response = await api.post(`/admin/applications/${id}/reset-to-draft`);
    return response.data;
  },

  assignManager: async (id, managerId) => {
    const response = await api.put(`/admin/applications/${id}/assign`, { manager_id: managerId });
    return response.data;
  },

  addInternalNote: async (id, noteData) => {
    const response = await api.post(`/admin/applications/${id}/notes`, { note: noteData });
    return response.data;
  },

  // Пользователи
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  updateUserRole: async (id, roleData) => {
    const response = await api.put(`/admin/users/${id}/role`, roleData);
    return response.data;
  },

  getUserApplications: async (id, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users/${id}/applications?${params}`);
    return response.data;
  },

  // Статистика
  getDashboardStats: async () => {
    const response = await api.get(`/admin/stats/dashboard`);
    return response.data;
  },

  getManagerLoad: async () => {
    const response = await api.get('/admin/manager-load');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/admin/recent-activity');
    return response.data;
  }
};
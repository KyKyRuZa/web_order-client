import api from './axios';

export const auditAPI = {
  // Получение логов аудита с фильтрацией
  getLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/audit/logs?${params}`);
    return response.data;
  },

  // Получение конкретного лога по ID
  getLogById: async (id) => {
    const response = await api.get(`/audit/logs/${id}`);
    return response.data;
  },

  // Получение логов для конкретного пользователя
  getLogsByUser: async (userId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/audit/users/${userId}?${params}`);
    return response.data;
  },

  // Получение логов для конкретной сущности
  getLogsByEntity: async (entity, entityId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/audit/entities/${entity}/${entityId}?${params}`);
    return response.data;
  },

  // Получение статистики аудита
  getStats: async () => {
    const response = await api.get('/audit/stats');
    return response.data;
  },

  // Получение последних действий пользователя
  getRecentActions: async (limit = 10) => {
    const response = await api.get(`/audit/recent-actions?limit=${limit}`);
    return response.data;
  },

  // Получение логов за определенный период
  getLogsByPeriod: async (startDate, endDate, filters = {}) => {
    const params = new URLSearchParams(filters);
    params.append('dateFrom', startDate);
    params.append('dateTo', endDate);
    const response = await api.get(`/audit/logs-by-period?${params}`);
    return response.data;
  },

  // Получение логов с определенным уровнем критичности
  getLogsBySeverity: async (severity, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/audit/severity/${severity}?${params}`);
    return response.data;
  }
};
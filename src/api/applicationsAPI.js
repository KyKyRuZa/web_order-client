import api from './axios';

export const applicationsAPI = {
  // Получение всех заявок
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/applications?${params}`);
    return response.data;
  },

  // Создание новой заявки
  create: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Получение заявки по ID
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Обновление заявки
  update: async (id, applicationData) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  },

  // Удаление заявки
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // Отправка заявки
  submit: async (id) => {
    const response = await api.post(`/applications/${id}/submit`);
    return response.data;
  },

  // Изменение статуса заявки
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  },

  // Получение доступных переходов статуса
  getStatusTransitions: async (id) => {
    const response = await api.get(`/applications/${id}/transitions`);
    return response.data;
  },

  // Загрузка файла к заявке
  uploadFile: async (id, fileData) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    if (fileData.category) formData.append('category', fileData.category);
    if (fileData.description) formData.append('description', fileData.description);

    const response = await api.post(`/applications/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Получение файлов заявки
  getFiles: async (id) => {
    const response = await api.get(`/applications/${id}/files`);
    return response.data;
  },

  // Удаление файла
  deleteFile: async (fileId) => {
    const response = await api.delete(`/applications/files/${fileId}`);
    return response.data;
  },

  // Назначение менеджера
  assignManager: async (id, managerId) => {
    const response = await api.put(`/applications/${id}/assign`, { manager_id: managerId });
    return response.data;
  },

  // Возврат в черновик
  resetToDraft: async (id) => {
    const response = await api.post(`/applications/${id}/reset-to-draft`);
    return response.data;
  }
};
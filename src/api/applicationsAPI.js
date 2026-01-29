import api from './axios';

export const applicationsAPI = {
  // Получение всех заявок
  getAll: async (filters = {}) => {
    // Преобразуем фильтры из camelCase в snake_case
    const transformedFilters = {};
    for (const [key, value] of Object.entries(filters)) {
      switch(key) {
        case 'serviceType':
          transformedFilters.service_type = value;
          break;
        case 'expectedBudget':
          transformedFilters.expected_budget = value;
          break;
        case 'contactFullName':
          transformedFilters.contact_full_name = value;
          break;
        case 'contactEmail':
          transformedFilters.contact_email = value;
          break;
        case 'contactPhone':
          transformedFilters.contact_phone = value;
          break;
        case 'companyName':
          transformedFilters.company_name = value;
          break;
        case 'budgetRange':
          transformedFilters.budget_range = value;
          break;
        case 'priority':
          transformedFilters.priority = value;
          break;
        default:
          transformedFilters[key] = value;
          break;
      }
    }

    const params = new URLSearchParams(transformedFilters);
    const response = await api.get(`/applications?${params.toString()}`);
    return response.data;
  },

  // Получение заявки по ID
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Создание заявки
  create: async (applicationData) => {
    // Преобразуем данные из camelCase в snake_case перед отправкой
    const transformedData = transformApplicationData(applicationData);
    const response = await api.post('/applications', transformedData);
    return response.data;
  },

  // Обновление заявки
  update: async (id, applicationData) => {
    // Преобразуем данные из camelCase в snake_case перед отправкой
    const transformedData = transformApplicationData(applicationData);
    const response = await api.put(`/applications/${id}`, transformedData);
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

  // Методы для работы с заметками
  // Создание новой заметки к заявке
  createNote: async (applicationId, noteData) => {
    const response = await api.post(`/applications/${applicationId}/notes`, noteData);
    return response.data;
  },

  // Получение всех заметок к заявке
  getNotes: async (applicationId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/applications/${applicationId}/notes?${params.toString()}`);
    return response.data;
  },

  // Получение заметки по ID
  getNoteById: async (noteId) => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  },

  // Обновление заметки
  updateNote: async (noteId, noteData) => {
    const response = await api.put(`/notes/${noteId}`, noteData);
    return response.data;
  },

  // Удаление заметки
  deleteNote: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  },

  // Закрепление/открепление заметки
  toggleNotePin: async (noteId) => {
    const response = await api.post(`/notes/${noteId}/pin`);
    return response.data;
  }
};

// Вспомогательная функция для преобразования данных из camelCase в snake_case
function transformApplicationData(data) {
  const transformed = {};
  for (const [key, value] of Object.entries(data)) {
    switch(key) {
      case 'serviceType':
        transformed.service_type = value;
        break;
      case 'expectedBudget':
        transformed.expected_budget = value;
        break;
      case 'contactFullName':
        transformed.contact_full_name = value;
        break;
      case 'contactEmail':
        transformed.contact_email = value;
        break;
      case 'contactPhone':
        transformed.contact_phone = value;
        break;
      case 'companyName':
        transformed.company_name = value;
        break;
      case 'budgetRange':
        transformed.budget_range = value;
        break;
      case 'priority':
        transformed.priority = value;
        break;
      default:
        transformed[key] = value;
        break;
    }
  }
  return transformed;
}
import api from './axios';

export const notesAPI = {
  // Создание новой заметки к заявке
  createNote: async (applicationId, noteData) => {
    const response = await api.post(`/notes/applications/${applicationId}/notes`, noteData);
    return response.data;
  },

  // Получение всех заметок к заявке
  getNotesByApplication: async (applicationId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/notes/applications/${applicationId}/notes?${params}`);
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
  togglePin: async (noteId) => {
    const response = await api.post(`/notes/${noteId}/pin`);
    return response.data;
  }
};
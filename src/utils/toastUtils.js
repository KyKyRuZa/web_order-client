import { useToast } from '../context/ToastContext';

export const AUTH_ERROR_MESSAGES = {
  // Login errors
  'Invalid credentials': 'Ошибка аутентификации: неверный email или пароль',
  'User not found': 'Пользователь с таким email не найден',
  'User deactivated': 'Аккаунт деактивирован',
  'Email not verified': 'Email не подтвержден. Проверьте вашу почту.',

  // Registration errors
  'User already exists': 'Пользователь с таким email уже зарегистрирован',
  'Email is required': 'Email обязателен для заполнения',
  'Password is required': 'Пароль обязателен для заполнения',
  'Password too short': 'Пароль должен содержать минимум 6 символов',
  'Invalid email format': 'Некорректный формат email',
  'Full name is required': 'ФИО обязательно для заполнения',

  // Password change errors
  'Current password is incorrect': 'Текущий пароль неверен',
  'New password must be different': 'Новый пароль должен отличаться от текущего',

  // General errors
  'Access denied': 'Недостаточно прав для выполнения действия',
  'Resource not found': 'Запрашиваемый ресурс не найден',
  'Validation error': 'Ошибка валидации данных',
  'Server error': 'Ошибка сервера. Попробуйте позже',
  'Network error': 'Ошибка сети. Проверьте подключение к интернету',
  'Rate limit exceeded': 'Слишком много запросов. Попробуйте позже'
};

/**
 * Maps server error codes to user-friendly messages
 */
export const mapServerError = (error, defaultMessage = 'Произошла ошибка при выполнении запроса') => {
  if (!error) return defaultMessage;

  // Check if error is a response object
  if (error.response) {
    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        return data?.message || 'Некорректный запрос';
      case 401:
        return data?.message || 'Требуется аутентификация';
      case 403:
        return data?.message || 'Недостаточно прав для выполнения действия';
      case 404:
        return data?.message || 'Запрашиваемый ресурс не найден';
      case 429:
        return data?.message || 'Слишком много запросов. Попробуйте позже';
      case 500:
        return data?.message || 'Ошибка сервера. Попробуйте позже';
      default:
        return data?.message || defaultMessage;
    }
  }

  // Handle network errors
  if (error.request) {
    return 'Ошибка сети. Проверьте подключение к интернету.';
  }

  // Handle other errors
  return error.message || defaultMessage;
};

/**
 * Shows notification based on API response
 */
export const showApiNotification = (response, actionName = 'Действие', type = 'info') => {
  const { useToastStore } = require('../context/ToastContext'); // Dynamic import to avoid circular dependency
  
  if (response.success) {
    const message = response.message || `${actionName} выполнено успешно`;
    useToastStore.getState().addToast(message, 'success');
  } else {
    const message = response.message || `Ошибка при ${actionName.toLowerCase()}`;
    useToastStore.getState().addToast(message, 'error');
  }
};

/**
 * Formats API error for display
 */
export const formatApiError = (error) => {
  if (!error) return 'Неизвестная ошибка';

  // If it's a validation error with detailed field errors
  if (error.errors && Array.isArray(error.errors)) {
    const fieldErrors = error.errors.map(err => 
      `${err.field ? err.field + ': ' : ''}${err.message}`
    ).join('; ');
    return fieldErrors;
  }

  // If it's a general error message
  return error.message || 'Произошла ошибка';
};

/**
 * Validates API response
 */
export const validateApiResponse = (response) => {
  if (!response) {
    return { isValid: false, error: 'Отсутствует ответ от сервера' };
  }

  if (!response.success) {
    return { isValid: false, error: response.message || 'Неизвестная ошибка' };
  }

  return { isValid: true, data: response.data };
};

/**
 * Converts snake_case to camelCase for API responses
 */
export const snakeToCamel = (obj) => {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj instanceof File) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

/**
 * Converts camelCase to snake_case for API requests
 */
export const camelToSnake = (obj) => {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj instanceof File) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};
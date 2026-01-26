// Утилиты для работы с API
export const handleApiError = (error, defaultMessage = 'Произошла ошибка при выполнении запроса') => {
  console.error('API Error:', error);

  if (error.response) {
    // Сервер вернул ошибку
    const { status, data } = error.response;

    if (status === 401) {
      // Токен истек или недействителен - очистить данные аутентификации
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return 'Сессия истекла. Пожалуйста, войдите снова.';
    } else if (status === 403) {
      return 'Доступ запрещен. Недостаточно прав.';
    } else if (status === 404) {
      return 'Запрашиваемый ресурс не найден.';
    } else if (data && data.message) {
      return data.message;
    }
  } else if (error.request) {
    // Запрос был сделан, но нет ответа
    return 'Нет соединения с сервером. Проверьте подключение к интернету.';
  }

  return defaultMessage;
};

// Функция для проверки успешности ответа
export const isApiResponseSuccess = (response) => {
  return response && response.success === true;
};

// Функция для получения данных из ответа
export const getApiData = (response, defaultValue = null) => {
  if (isApiResponseSuccess(response) && response.data) {
    return response.data;
  }
  return defaultValue;
};

// Утилиты для работы с телефонными номерами
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  let formatted = '';
  if (digitsOnly.length > 0) formatted = '+' + digitsOnly.substring(0, 1);
  if (digitsOnly.length > 1) formatted += ' (' + digitsOnly.substring(1, 4);
  if (digitsOnly.length > 4) formatted += ') ' + digitsOnly.substring(4, 7);
  if (digitsOnly.length > 7) formatted += '-' + digitsOnly.substring(7, 9);
  if (digitsOnly.length > 9) formatted += '-' + digitsOnly.substring(9, 11);
  return formatted;
};

export const extractPhoneForServer = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};
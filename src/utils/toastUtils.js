/**
 * Specific error messages for different authentication errors
 */
export const AUTH_ERROR_MESSAGES = {
  // Login errors
  'Invalid credentials': 'Ошибка аутентификации: неверный email или пароль',
  'Account not found': 'Ошибка аутентификации: аккаунт не найден',
  'Account deactivated': 'Ошибка аутентификации: аккаунт деактивирован',
  'Email not verified': 'Ошибка аутентификации: email не подтвержден',

  // Registration errors
  'Email already exists': 'Ошибка регистрации: пользователь с таким email уже существует',
  'Invalid email format': 'Ошибка регистрации: неправильный формат email',
  'Password too weak': 'Ошибка регистрации: пароль слишком слабый',
  'Phone already exists': 'Ошибка регистрации: пользователь с таким телефоном уже существует',

  // General errors
  'Network error': 'Ошибка сети: проверьте подключение к интернету',
  'Server error': 'Ошибка сервера: попробуйте позже',
  'Connection timeout': 'Ошибка соединения: превышено время ожидания',
  'Unauthorized': 'Ошибка доступа: требуется аутентификация',
  'Forbidden': 'Ошибка доступа: недостаточно прав',
  'Not found': 'Ошибка: запрашиваемый ресурс не найден',
  'Validation error': 'Ошибка валидации: проверьте введенные данные',

  // Default fallback
  'default': 'Произошла ошибка: попробуйте позже'
};

/**
 * Maps API error messages to user-friendly messages
 */
export const mapApiErrorMessage = (apiMessage) => {
  return AUTH_ERROR_MESSAGES[apiMessage] || AUTH_ERROR_MESSAGES.default || apiMessage;
};

/**
 * Shows an appropriate toast notification based on the API response
 */
export const showApiNotification = (response, showToast, successMessage = null) => {
  if (response.success) {
    if (successMessage) {
      showToast(successMessage, 'success');
    }
  } else {
    const userFriendlyMessage = mapApiErrorMessage(response.message);
    showToast(userFriendlyMessage, 'error');
  }
};
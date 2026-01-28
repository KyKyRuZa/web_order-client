import validator from 'validator';

// Валидация email
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Валидация телефона (российский формат)
export const validatePhone = (phone) => {
  // Убираем все символы кроме цифр
  const digitsOnly = phone.replace(/\D/g, '');
  // Проверяем, начинается ли с 7 или 8 и состоит из 11 цифр
  return /^(7|8)\d{10}$/.test(digitsOnly);
};

// Валидация пароля
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Валидация ФИО
export const validateFullName = (fullName) => {
  // Проверяем, что строка не пустая и содержит хотя бы 2 символа
  return fullName.trim().length >= 2;
};

// Валидация названия компании
export const validateCompanyName = (companyName) => {
  // Проверяем, что строка не пустая (если указана) и содержит хотя бы 2 символа
  return !companyName || companyName.trim().length >= 2;
};

// Валидация названия проекта
export const validateProjectTitle = (title) => {
  return title.trim().length >= 5;
};

// Валидация описания
export const validateDescription = (description) => {
  // Проверяем, что описание не слишком короткое (если указано)
  return !description || description.trim().length >= 10;
};

// Санитизация ввода
export const sanitizeInput = (input) => {
  // Очистка строки от потенциально опасных символов
  if (typeof input !== 'string') return input;

  return validator.escape(input.trim());
};

// Остальные функции остаются с использованием validator.js
export const validateUrl = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  });
};

export const validateString = (str, options = {}) => {
  const {
    minLength = 1,
    maxLength = Infinity,
    allowEmpty = false
  } = options;

  if (!allowEmpty && !str) return false;
  if (str.length < minLength || str.length > maxLength) return false;

  return true;
};

// Экспортируем валидатор для использования в других местах
export default validator;
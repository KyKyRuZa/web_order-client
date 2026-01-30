import validator from 'validator';

// Валидация email
export const validateEmail = (email) => {
  // Проверяем, что email не содержит пробелов
  if (typeof email !== 'string' || email.includes(' ')) {
    return false;
  }

  // Используем validator для проверки формата email
  return validator.isEmail(email);
};

// Валидация пароля
export const validatePassword = (password) => {
  if (typeof password !== 'string') {
    return false;
  }

  // Минимум 8 символов, одна заглавная, одна строчная, одна цифра
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Валидация ФИО
export const validateFullName = (fullName) => {
  if (typeof fullName !== 'string') {
    return false;
  }

  // Проверяем, что ФИО содержит только буквы, пробелы и дефисы, и имеет длину от 2 до 100 символов
  const fullNameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,100}$/;
  return fullNameRegex.test(fullName.trim());
};

// Валидация телефона
export const validatePhone = (phone) => {
  if (typeof phone !== 'string') {
    return false;
  }

  // Проверяем формат телефона (международный формат)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Валидация названия компании
export const validateCompanyName = (companyName) => {
  if (typeof companyName !== 'string') {
    return true; // Поле необязательное, поэтому возвращаем true если undefined/null
  }

  // Проверяем, что название компании не превышает 100 символов
  return companyName.length <= 100;
};

// Валидация заголовка заявки
export const validateTitle = (title) => {
  if (typeof title !== 'string') {
    return false;
  }

  // Проверяем, что заголовок содержит от 5 до 200 символов
  return title.length >= 5 && title.length <= 200;
};

// Валидация описания заявки
export const validateDescription = (description) => {
  if (typeof description !== 'string') {
    return true; // Поле необязательное
  }

  // Проверяем, что описание не превышает 5000 символов
  return description.length <= 5000;
};

// Валидация бюджета
export const validateBudget = (budget) => {
  // Проверяем, что бюджет - это число и неотрицательное
  return typeof budget === 'number' && budget >= 0;
};

// Валидация URL
export const validateUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }

  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  });
};

// Валидация даты
export const validateDate = (dateString) => {
  if (typeof dateString !== 'string') {
    return false;
  }

  // Проверяем, что строка является валидной датой
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
};

// Валидация UUID
export const validateUUID = (uuid) => {
  if (typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Комплексная валидация данных регистрации
export const validateRegisterData = (userData) => {
  const errors = [];

  if (!validateEmail(userData.email)) {
    errors.push('Некорректный формат email');
  }

  if (!validatePassword(userData.password)) {
    errors.push('Пароль должен содержать минимум 8 символов, включая заглавную букву, строчную букву и цифру');
  }

  if (!validateFullName(userData.fullName)) {
    errors.push('ФИО должно содержать только буквы, иметь длину от 2 до 100 символов');
  }

  if (userData.phone && !validatePhone(userData.phone)) {
    errors.push('Некорректный формат телефона');
  }

  if (userData.companyName && !validateCompanyName(userData.companyName)) {
    errors.push('Название компании не должно превышать 100 символов');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Комплексная валидация данных заявки
export const validateApplicationData = (applicationData) => {
  const errors = [];

  if (!validateTitle(applicationData.title)) {
    errors.push('Заголовок должен содержать от 5 до 200 символов');
  }

  if (!validateDescription(applicationData.description)) {
    errors.push('Описание не должно превышать 5000 символов');
  }

  if (applicationData.budget && !validateBudget(applicationData.budget)) {
    errors.push('Бюджет должен быть неотрицательным числом');
  }

  if (applicationData.contactEmail && !validateEmail(applicationData.contactEmail)) {
    errors.push('Некорректный формат email контакта');
  }

  if (applicationData.contact_phone && !validatePhone(applicationData.contact_phone)) {
    errors.push('Некорректный формат телефона контакта');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Валидация типа услуги
export const validateServiceType = (serviceType) => {
  const validServiceTypes = [
    'landing_page',
    'corporate_site',
    'ecommerce',
    'web_application',
    'other'
  ];
  
  return validServiceTypes.includes(serviceType);
};

// Валидация приоритета
export const validatePriority = (priority) => {
  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  return validPriorities.includes(priority);
};

// Валидация статуса
export const validateStatus = (status) => {
  const validStatuses = [
    'draft',
    'submitted',
    'in_review',
    'approved',
    'in_progress',
    'completed',
    'cancelled',
    'rejected'
  ];
  
  return validStatuses.includes(status);
};

// Валидация типа файла
export const validateFileType = (fileType) => {
  const validFileTypes = [
    'technical_spec',
    'design_reference',
    'content',
    'other'
  ];
  
  return validFileTypes.includes(fileType);
};

// Валидация типа заметки
export const validateNoteType = (noteType) => {
  const validNoteTypes = [
    'internal',
    'comment',
    'system',
    'change_log'
  ];
  
  return validNoteTypes.includes(noteType);
};
/**
 * Извлекает чистый номер телефона для отправки на сервер
 * Убирает все символы, кроме цифр, и оставляет только 11-значный номер
 * @param {string} phone - Номер телефона в любом формате
 * @returns {string} - Очищенный номер телефона (например, '79666666666')
 */
export const extractPhoneForServer = (phone) => {
  if (!phone) return '';

  // Убираем все символы, кроме цифр
  const cleaned = phone.replace(/\D/g, '');

  // Если начинается с 8, заменяем на 7
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    return '7' + cleaned.substring(1);
  }

  // Если начинается с 7 и длина 11, возвращаем как есть
  if (cleaned.startsWith('7') && cleaned.length === 11) {
    return cleaned;
  }

  // Если начинается с +7, убираем +
  if (cleaned.startsWith('7') && cleaned.length === 12) {
    return cleaned.substring(1);
  }

  // Если длина 10 (без 7 или 8), добавляем 7 в начало
  if (cleaned.length === 10) {
    return '7' + cleaned;
  }

  // В остальных случаях возвращаем очищенный номер
  return cleaned;
};
# API Layer

Эта папка содержит все функции, связанные с API-запросами в приложении.

## Структура

- `axios.js` - базовая конфигурация axios с интерцепторами
- `authAPI.js` - функции для аутентификации (регистрация, вход, профиль и т.д.)
- `applicationsAPI.js` - функции для работы с заявками
- `utils.js` - утилиты для обработки ошибок и вспомогательные функции
- `index.js` - точка экспорта для всех API-сервисов

## Использование

### В контекстах
```javascript
import { authAPI } from '../api';
// или
import { applicationsAPI } from '../api';

const response = await authAPI.login(credentials);
```

### В компонентах
Компоненты должны использовать контексты, а не напрямую API-функции, для лучшей тестируемости и управления состоянием.

## Интерцепторы

Axios настроен с двумя интерцепторами:
- Request interceptor: автоматически добавляет токен авторизации к каждому запросу
- Response interceptor: обрабатывает ошибки и автоматически обновляет токен при 401 ошибке

## Обработка ошибок

Используйте утилиты из `utils.js` для обработки ошибок API:

```javascript
import { handleApiError } from '../api/utils';

try {
  const response = await someApiCall();
} catch (error) {
  const errorMessage = handleApiError(error);
  // обработка ошибки
}
```
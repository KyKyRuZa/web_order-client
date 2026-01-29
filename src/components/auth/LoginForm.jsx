import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PasswordInput } from '../PasswordInput';
import { Button } from '../Button';
import '../../styles/AuthForm.css';

export const LoginForm = ({ onSwitchToRegister, onSuccess, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Show validation errors as toast notifications
      Object.values(newErrors).forEach(error => {
        showToast(error, 'error');
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password, showToast);

      if (result.success) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Ошибка входа. Пожалуйста, попробуйте снова.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Вход в аккаунт</h2>
        <p className="auth-subtitle">Введите свои данные для входа</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="floating-input-wrapper" data-type="email">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`floating-input ${errors.email ? 'error' : ''}`}
                placeholder=" "
                autoComplete="email"
              />
              <label htmlFor="email" className="floating-label">Email</label>
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              label="Пароль"
              error={!!errors.password}
              errorMessage={errors.password}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="submit-btn"
            fullWidth={true}
          >
            Войти
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Нет аккаунта?{' '}
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToRegister}
            >
              Зарегистрироваться
            </button>
          </p>
          <p>
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToForgotPassword}
            >
              Забыли пароль?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
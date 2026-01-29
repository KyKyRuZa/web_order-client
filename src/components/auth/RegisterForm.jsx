import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../Button';
import { PasswordInput } from '../PasswordInput';
import { extractPhoneForServer } from '../../api/utils';
import '../../styles/AuthForm.css';

export const RegisterForm = ({ onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] !== '7') {
      value = '7' + value;
    }
    let formatted = '';
    if (value.length > 0) formatted = '+' + value.substring(0, 1);
    if (value.length > 1) formatted += ' (' + value.substring(1, 4);
    if (value.length > 4) formatted += ') ' + value.substring(4, 7);
    if (value.length > 7) formatted += '-' + value.substring(7, 9);
    if (value.length > 9) formatted += '-' + value.substring(9, 11);

    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'ФИО обязательно';
    if (!formData.email.trim()) newErrors.email = 'Email обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!formData.phone.trim()) newErrors.phone = 'Телефон обязателен';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach(error => {
        showToast(error, 'error');
      });
      return;
    }

    setIsLoading(true);

    try {
      const phoneForServer = extractPhoneForServer(formData.phone);

      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: phoneForServer,
        companyName: formData.companyName
      };

      const result = await register(userData, showToast);

      if (result.success) {
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Ошибка регистрации. Пожалуйста, попробуйте снова.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Создать аккаунт</h2>
        <p className="auth-subtitle">Заполните данные для регистрации</p>

        <form onSubmit={handleSubmit}>
          {/* ФИО */}
          <div className="form-group">
            <div className="floating-input-wrapper" data-type="name">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`floating-input ${errors.fullName ? 'error' : ''}`}
                placeholder=" "
                autoComplete="name"
              />
              <label htmlFor="fullName" className="floating-label">ФИО</label>
            </div>
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* Email */}
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

          {/* Пароль */}
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
              autoComplete="new-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Подтверждение пароля */}
          <div className="form-group">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              label="Подтвердите пароль"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Телефон */}
          <div className="form-group">
            <div className="floating-input-wrapper" data-type="phone">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`floating-input ${errors.phone ? 'error' : ''}`}
                placeholder=" "
                autoComplete="tel"
              />
              <label htmlFor="phone" className="floating-label">Телефон</label>
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Название компании */}
          <div className="form-group">
            <div className="floating-input-wrapper" data-type="company">
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="floating-input"
                placeholder=" "
                autoComplete="organization"
              />
              <label htmlFor="companyName" className="floating-label">Название компании</label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="submit-btn"
            fullWidth={true}
          >
            Зарегистрироваться
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Уже есть аккаунт?{' '}
            <button
              type="button"
              className="switch-link"
              onClick={onSwitchToLogin}
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очистка ошибки при изменении поля
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
    
    // Валидация
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'ФИО обязательно';
    if (!formData.email.trim()) newErrors.email = 'Email обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!formData.phone.trim()) newErrors.phone = 'Телефон обязателен';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Подготовка данных для отправки - телефон преобразуем в формат без форматирования
      const phoneForServer = extractPhoneForServer(formData.phone);

      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: phoneForServer,
        companyName: formData.companyName
      };

      const result = await register(userData);
      
      if (result.success) {
        onSuccess && onSuccess();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Ошибка регистрации. Пожалуйста, попроруйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Создать аккаунт</h2>
        <p className="auth-subtitle">Заполните данные для регистрации</p>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">ФИО</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Иванов Иван Иванович"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="email@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+7 (___) ___-__-__"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="companyName">Название компании (необязательно)</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Название вашей компании"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
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
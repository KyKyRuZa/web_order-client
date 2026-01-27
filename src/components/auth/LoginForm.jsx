import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../PasswordInput';
import '../../styles/AuthForm.css';

export const LoginForm = ({ onSwitchToRegister, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

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
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        onSuccess && onSuccess();
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Ошибка входа. Пожалуйста, попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Вход в аккаунт</h2>
        <p className="auth-subtitle">Введите свои данные для входа</p>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit}>
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
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              label="Пароль"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
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
        </div>
      </div>
    </div>
  );
};
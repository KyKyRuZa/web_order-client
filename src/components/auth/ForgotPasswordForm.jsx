import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../api';
import { PasswordInput } from '../PasswordInput';
import '../../styles/AuthForm.css';

export const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setNewPasswordConfirm] = useState('');
  const { showToast } = useToast();

  // Проверяем, есть ли токен в URL при загрузке компонента
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      setResetToken(token);
      setStep('reset'); // Переходим к шагу сброса пароля
    }
  }, []);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authAPI.forgotPassword(email);

      if (result.success) {
        showToast('Ссылка для сброса пароля отправлена на ваш email', 'success');
        setStep('reset');
      } else {
        showToast(result.message || 'Ошибка при отправке ссылки для сброса пароля', 'error');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast(error.response?.data?.message || 'Ошибка при отправке ссылки для сброса пароля', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Новые пароли не совпадают', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authAPI.resetPassword(resetToken, newPassword);

      if (result.success) {
        showToast('Пароль успешно изменен! Теперь вы можете войти в систему', 'success');
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        showToast(result.message || 'Ошибка при сбросе пароля', 'error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showToast(error.response?.data?.message || 'Ошибка при сбросе пароля', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{step === 'email' ? 'Восстановление пароля' : 'Сброс пароля'}</h2>
        <p className="auth-description">
          {step === 'email' 
            ? 'Введите ваш email, и мы отправим ссылку для сброса пароля' 
            : 'Введите новый пароль'}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleSendResetLink}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Отправить ссылку'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                placeholder="Введите новый пароль"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                minLength="6"
                placeholder="Подтвердите новый пароль"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Сброс пароля...' : 'Сбросить пароль'}
            </button>
          </form>
        )}

        <div className="auth-switch">
          <button type="button" onClick={onSwitchToLogin} className="switch-link">
            ← Назад к входу
          </button>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Header';
import { PasswordInput } from '../PasswordInput';
import { authAPI } from '../../api';
import { extractPhoneForServer } from '../../api/utils';
import '../../styles/ProfilePage.css';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'account'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: ''
  });

  useEffect(() => {
    if (user && !isEditing) {
      const timer = setTimeout(() => {
        setFormData({
          fullName: user.full_name || '',
          email: user.email || '',
          phone: user.phone || '',
          companyName: user.company_name || ''
        });
      });
      return () => clearTimeout(timer);
    }
  }, [user, isEditing]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    try {
      // Подготовка данных для отправки - телефон преобразуем в формат без форматирования
      const phoneForServer = extractPhoneForServer(formData.phone);

      const profileData = {
        ...formData,
        phone: phoneForServer
      };

      const result = await updateProfile(profileData);

      if (result.success) {
        setSuccessMessage('Профиль успешно обновлен!');
        setErrorMessage('');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage('Ошибка обновления профиля');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    // Очистка ошибки при изменении поля
    if (passwordErrorMessage) {
      setPasswordErrorMessage('');
    }
    if (passwordSuccessMessage) {
      setPasswordSuccessMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Проверка соответствия новых паролей
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMessage('Новые пароли не совпадают');
      return;
    }

    try {
      const result = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setPasswordSuccessMessage('Пароль успешно изменен!');
        setPasswordErrorMessage('');
        // Очистка формы
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordErrorMessage(result.message || 'Ошибка изменения пароля');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordErrorMessage(error.response?.data?.message || 'Ошибка изменения пароля');
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-message">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Профиль пользователя</h1>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Выйти
            </button>
          </div>

          {/* Вкладки */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Профиль
            </button>
            <button
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Безопасность
            </button>
            <button
              className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Управление аккаунтом
            </button>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          {/* Содержимое вкладок */}
          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="tab-pane">
                <div className="profile-info">
                  <div className="profile-card">
                    <div className="profile-avatar">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="40" r="20" fill="var(--accent)" />
                        <path d="M30,80 Q50,65 70,80 T90,80" fill="var(--accent)" />
                      </svg>
                    </div>

                    <div className="profile-details">
                      <div className="detail-item">
                        <span className="label">ФИО:</span>
                        <span className="value">{user.full_name}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Email:</span>
                        <span className="value">{user.email}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Телефон:</span>
                        <span className="value">{user.phone || 'Не указан'}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Компания:</span>
                        <span className="value">{user.company_name || 'Не указана'}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Роль:</span>
                        <span className="value">
                          {user.role === 'admin' ? 'Администратор' :
                           user.role === 'manager' ? 'Менеджер' : 'Клиент'}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Дата регистрации:</span>
                        <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Отменить' : 'Редактировать профиль'}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="profile-edit">
                    <h3>Редактировать профиль</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="fullName">ФИО</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                        <small className="field-note">Email нельзя изменить</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companyName">Название компании</label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsEditing(false)}
                        >
                          Отменить
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Сохранить изменения
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="tab-pane">
                <div className="password-change-form">
                  <h3>Изменить пароль</h3>

                  {passwordSuccessMessage && (
                    <div className="success-message">{passwordSuccessMessage}</div>
                  )}

                  {passwordErrorMessage && (
                    <div className="error-message">{passwordErrorMessage}</div>
                  )}

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <PasswordInput
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        label="Текущий пароль"
                      />
                    </div>

                    <div className="form-group">
                      <PasswordInput
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                        label="Новый пароль"
                      />
                    </div>

                    <div className="form-group">
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                        label="Подтвердите новый пароль"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                          setPasswordErrorMessage('');
                          setPasswordSuccessMessage('');
                        }}
                      >
                        Отменить
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Изменить пароль
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="tab-pane">
                <div className="account-management-section">
                  <div className="danger-zone">
                    <p>Внимание! При деактивации аккаунта все ваши данные будут удалены и доступ к аккаунту будет потерян.</p>

                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        if (window.confirm('Вы уверены, что хотите деактивировать свой аккаунт? Это действие необратимо.')) {
                          try {
                            const result = await authAPI.deactivateAccount();

                            if (result.success) {
                              alert('Ваш аккаунт успешно деактивирован. Вы будете перенаправлены на главную страницу.');
                              logout(); // Выход из системы
                            } else {
                              alert(result.message || 'Ошибка деактивации аккаунта');
                            }
                          } catch (error) {
                            console.error('Deactivate account error:', error);
                            alert(error.response?.data?.message || 'Ошибка деактивации аккаунта');
                          }
                        }
                      }}
                    >
                      Деактивировать аккаунт
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
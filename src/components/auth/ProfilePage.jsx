import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Header } from '../layout/Header';
import { PasswordInput } from '../utils/PasswordInput';
import { authAPI } from '../../api';
import { extractPhoneForServer } from '../../api/utils';
import { ApplicationsList } from '../applications/ApplicationsList';
import { ConfirmationModal } from '../utils/Modal';
import { Button } from '../utils/Button';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import '../../styles/ProfilePage.css';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
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

      const result = await updateProfile(profileData, showToast);

      if (result.success) {
        showToast('Профиль успешно обновлен!', 'success');
        setIsEditing(false);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Ошибка обновления профиля', 'error');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Проверка соответствия новых паролей
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Новые пароли не совпадают', 'error');
      return;
    }

    try {
      console.log('DEBUG: Attempting to change password with data:', {
        currentPassword: passwordData.currentPassword ? '[PROVIDED]' : '[NOT PROVIDED]',
        newPassword: passwordData.newPassword ? '[PROVIDED]' : '[NOT PROVIDED]',
        confirmPassword: passwordData.confirmPassword ? '[PROVIDED]' : '[NOT PROVIDED]'
      });

      const result = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      console.log('DEBUG: Password change result:', result);

      if (result.success) {
        showToast('Пароль успешно изменен! Пожалуйста, войдите снова.', 'success');
        // Очистка формы
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          logout();
        }, 2000); 
      } else {
        showToast(result.message || 'Ошибка изменения пароля', 'error');
      }
    } catch (error) {
      console.error('Password change error:', error);
      console.error('Password change error details:', error.response?.data || error.message);
      showToast(error.response?.data?.message || 'Ошибка изменения пароля', 'error');
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
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Button variant="primary" size="md" onClick={() => window.location.href = '/admin'}>
                Админ-панель
              </Button>
            )}
            
          </div>

          {/* Основной контейнер с двумя колонками */}
          <div className="profile-layout">
            {/* Левая колонка - аватар и информация о пользователе */}
            <div className="profile-info-column">
              <div className="profile-card">
                <div className="profile-avatar">
                  <FontAwesomeIcon icon="user" style={{ fontSize: '4rem', color: 'var(--accent)' }} />
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

              <div className="account-actions">
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setShowDeactivateModal(true)}
                  fullWidth={true}
                >
                  Деактивировать аккаунт
                </Button>
                
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleLogout}
                  fullWidth={true}
                >
                  Выйти
                </Button>

                

                <ConfirmationModal
                  isOpen={showDeactivateModal}
                  onClose={() => setShowDeactivateModal(false)}
                  title="Деактивация аккаунта"
                  message="Внимание! При деактивации аккаунта все ваши данные будут удалены и доступ к аккаунту будет потерян. Вы уверены, что хотите деактивировать свой аккаунт?"
                  onConfirm={async () => {
                    try {
                      const result = await authAPI.deactivateAccount();

                      if (result.success) {
                        showToast('Ваш аккаунт успешно деактивирован. Вы будете перенаправлены на главную страницу.', 'success');
                        logout(); // Выход из системы
                      } else {
                        showToast(result.message || 'Ошибка деактивации аккаунта', 'error');
                      }
                    } catch (error) {
                      console.error('Deactivate account error:', error);
                      showToast(error.response?.data?.message || 'Ошибка деактивации аккаунта', 'error');
                    } finally {
                      setShowDeactivateModal(false);
                    }
                  }}
                  confirmText="Деактивировать"
                  cancelText="Отмена"
                />
              </div>
            </div>

            {/* Правая колонка - вкладки */}
            <div className="profile-tabs-column">
              {/* Вкладки */}
              <div className="tabs">
                <button 
                  className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Профиль
                </button>
                <button 
                  className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  Безопасность
                </button>
                <button 
                  className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  Мои заявки
                </button>
                <button 
                  className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Уведомления
                </button>
              </div>

              {/* Содержимое вкладок */}
              <div className="tab-content">
                {activeTab === 'profile' && (
                  <div className="tab-pane">
                    <div className="profile-edit-section">
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
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                          >
                            Сохранить изменения
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="tab-pane">
                    <div className="password-change-form">
                      <h3>Изменить пароль</h3>

                      <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                          <label htmlFor="currentPassword">Текущий пароль</label>
                          <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="newPassword">Новый пароль</label>
                          <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength="6"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
                          <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength="6"
                          />
                        </div>

                        <div className="form-actions">
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => {
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              });
                            }}
                          >
                            Отменить
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                          >
                            Изменить пароль
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="tab-pane">
                    <div className="notifications-settings">
                      <h3>Настройки уведомлений</h3>
                      <p>Функционал настройки уведомлений в разработке</p>
                    </div>
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="tab-pane">
                    <ApplicationsList />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
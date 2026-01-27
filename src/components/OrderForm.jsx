import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Путь к контексту аутентификации
import { useApplications } from '../context/ApplicationsContext'; // Путь к контексту заявок
import { extractPhoneForServer } from '../api/utils';
import { FontAwesomeIcon } from './FontAwesomeIcon';
import '../styles/OrderForm.css';

export const OrderForm = ({ id }) => {
  const { user, isAuthenticated } = useAuth();
  const { createApplication } = useApplications();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    contactFullName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const customSelectRef = useRef(null);

  const serviceOptions = [
    { value: '', label: 'Выберите услугу' },
    { value: 'web_application', label: 'Веб-приложение' },
    { value: 'landing_page', label: 'Лендинг' },
    { value: 'corporate_site', label: 'Корпоративный сайт' },
    { value: 'ecommerce', label: 'Интернет-магазин' },
    { value: 'redesign', label: 'Редизайн' },
    { value: 'other', label: 'Другое' }
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        setFormData(prev => {
          const updatedData = {
            ...prev,
            contactFullName: user.full_name || prev.contactFullName,
            contactEmail: user.email || prev.contactEmail,
            contactPhone: user.phone || prev.contactPhone,
            companyName: user.company_name || prev.companyName
          };

          // Проверяем, изменились ли данные
          if (
            prev.contactFullName !== updatedData.contactFullName ||
            prev.contactEmail !== updatedData.contactEmail ||
            prev.contactPhone !== updatedData.contactPhone ||
            prev.companyName !== updatedData.companyName
          ) {
            return updatedData;
          }

          return prev;
        });
      });
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customSelectRef.current && !customSelectRef.current.contains(event.target)) {
        setIsServiceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

    setFormData(prev => ({ ...prev, contactPhone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (formData.title.length < 5) newErrors.title = 'Название должно быть не менее 5 символов';
    if (!formData.serviceType) newErrors.serviceType = 'Тип услуги обязателен';
    if (!formData.contactFullName.trim()) newErrors.contactFullName = 'Контактное лицо обязательно';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email обязателен';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Телефон обязателен';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Подготовка данных для отправки
      const phoneForServer = extractPhoneForServer(formData.contactPhone);

      const applicationData = {
        title: formData.title,
        description: formData.description,
        serviceType: formData.serviceType,
        contactFullName: formData.contactFullName,
        contactEmail: formData.contactEmail,
        contactPhone: phoneForServer,
        companyName: formData.companyName
      };

      // Отправка заявки через контекст
      const result = await createApplication(applicationData);

      if (result.success) {
        setIsSubmitted(true);
        // Сброс формы
        setFormData({
          title: '',
          description: '',
          serviceType: '',
          contactFullName: isAuthenticated && user ? user.full_name || '' : '',
          contactEmail: isAuthenticated && user ? user.email || '' : '',
          contactPhone: isAuthenticated && user ? user.phone || '' : '',
          companyName: isAuthenticated && user ? user.company_name || '' : ''
        });
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setErrors({ submit: 'Ошибка отправки заявки' });
    }
  };


  return (
    <section className="order" id={id || "order"}>
      <div className="order-container">
        <div className="section-header">
          <span className="section-label">Заказать</span>
          <h2 className="section-title">Начните проект</h2>
          <p className="section-desc">
            Заполните форму и мы свяжемся с вами в течение 24 часов
          </p>
        </div>
        <div className="order-form">
          {!isSubmitted ? (
            <form id="orderForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Название проекта</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                  placeholder="Краткое описание проекта"
                  required
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Описание проекта</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Расскажите о вашем проекте..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service">Тип услуги</label>
                  <div className="custom-select-wrapper" ref={customSelectRef}>
                    <button
                      type="button"
                      className={`custom-select ${errors.serviceType ? 'error' : ''}`}
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    >
                      <span>
                        {formData.serviceType
                          ? serviceOptions.find(opt => opt.value === formData.serviceType)?.label
                          : "Выберите услугу"}
                      </span>
                      <span className="custom-select-arrow">▼</span>
                    </button>

                    {isServiceDropdownOpen && (
                      <div className="custom-dropdown-options">
                        {serviceOptions.filter(option => option.value !== '').map((option) => (
                          <div
                            key={option.value}
                            className="dropdown-option"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, serviceType: option.value }));
                              setIsServiceDropdownOpen(false);
                              if (errors.serviceType) {
                                setErrors(prev => ({ ...prev, serviceType: '' }));
                              }
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.serviceType && <span className="error-text">{errors.serviceType}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="companyName">Компания</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Название компании"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactFullName">Имя</label>
                  <input
                    type="text"
                    id="contactFullName"
                    name="contactFullName"
                    value={formData.contactFullName}
                    onChange={handleChange}
                    className={errors.contactFullName ? 'error' : ''}
                    placeholder="Ваше имя"
                    required
                  />
                  {errors.contactFullName && <span className="error-text">{errors.contactFullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={errors.contactEmail ? 'error' : ''}
                    placeholder="email@company.com"
                    required
                  />
                  {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Телефон</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handlePhoneChange}
                  className={errors.contactPhone ? 'error' : ''}
                  required
                  placeholder="+7 (___) ___-__-__"
                />
                {errors.contactPhone && <span className="error-text">{errors.contactPhone}</span>}
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Отправить заявку
              </button>

              {errors.submit && (
                <div className="error-message">{errors.submit}</div>
              )}
            </form>
          ) : (
            <div className="form-success">
              <FontAwesomeIcon icon={['fas', 'check-circle']} style={{ fontSize: '5rem', color: '#00d4aa' }} />
              <h3>Заявка отправлена!</h3>
              <p>Мы свяжемся с вами в ближайшее время</p>
              <button
                className="btn btn-secondary"
                onClick={() => setIsSubmitted(false)}
              >
                Отправить еще одну
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
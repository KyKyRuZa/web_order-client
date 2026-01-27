import { useState } from 'react';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '../../components/FontAwesomeIcon';
import { extractPhoneForServer } from '../../api/utils';
import '../../styles/ApplicationForm.css';

export const ApplicationForm = ({ onSuccess, onCancel }) => {
  const { createApplication } = useApplications();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    contactFullName: user?.full_name || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    companyName: user?.company_name || '',
    budgetRange: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const serviceTypes = [
    { value: 'landing_page', label: 'Лендинг' },
    { value: 'corporate_site', label: 'Корпоративный сайт' },
    { value: 'ecommerce', label: 'Интернет-магазин' },
    { value: 'web_application', label: 'Веб-приложение' },
    { value: 'redesign', label: 'Редизайн' },
    { value: 'other', label: 'Другое' }
  ];

  const budgetRanges = [
    { value: 'under_50k', label: 'До 50 000 ₽' },
    { value: '50k_100k', label: '50 000 - 100 000 ₽' },
    { value: '100k_300k', label: '100 000 - 300 000 ₽' },
    { value: '300k_500k', label: '300 000 - 500 000 ₽' },
    { value: 'negotiable', label: 'По договоренности' }
  ];

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

    setIsLoading(true);

    try {
      // Подготовка данных для отправки - телефон преобразуем в формат без форматирования
      const phoneForServer = extractPhoneForServer(formData.contactPhone);

      const applicationData = {
        ...formData,
        contactPhone: phoneForServer
      };

      const result = await createApplication(applicationData);

      if (result.success) {
        onSuccess && onSuccess(result.application);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Application creation error:', error);
      setErrors({ general: 'Ошибка создания заявки' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="application-form-overlay">
      <div className="application-form-container">
        <div className="application-form-header">
          <h2>Создать новую заявку</h2>
          <button className="close-button" onClick={onCancel}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="title">Название заявки *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Краткое описание проекта"
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
              placeholder="Подробное описание ваших требований..."
              rows="4"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="serviceType">Тип услуги *</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={errors.serviceType ? 'error' : ''}
              >
                <option value="">Выберите тип услуги</option>
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.serviceType && <span className="error-text">{errors.serviceType}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="budgetRange">Бюджетный диапазон</label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
              >
                <option value="">Выберите диапазон</option>
                {budgetRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="contactFullName">Контактное лицо *</label>
            <input
              type="text"
              id="contactFullName"
              name="contactFullName"
              value={formData.contactFullName}
              onChange={handleChange}
              className={errors.contactFullName ? 'error' : ''}
              placeholder="Ваше имя и фамилия"
            />
            {errors.contactFullName && <span className="error-text">{errors.contactFullName}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Email *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={errors.contactEmail ? 'error' : ''}
                placeholder="email@example.com"
              />
              {errors.contactEmail && <span className="error-text">{errors.contactEmail}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="contactPhone">Телефон *</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handlePhoneChange}
                className={errors.contactPhone ? 'error' : ''}
                placeholder="+7 (___) ___-__-__"
              />
              {errors.contactPhone && <span className="error-text">{errors.contactPhone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="companyName">Название компании</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Название вашей компании"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
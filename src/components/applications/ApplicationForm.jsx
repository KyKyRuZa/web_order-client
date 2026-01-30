import { useState } from 'react';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../utils/FileUpload';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import { extractPhoneForServer } from '../../api/utils';
import { Button } from '../utils/Button';
import '../../styles/ApplicationForm.css';

export const ApplicationForm = ({ onSuccess, onCancel }) => {
  const { createApplication } = useApplications();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    contact_full_name: user?.full_name || '',
    contact_email: user?.email || '',
    contact_phone: user?.phone || '',
    company_name: user?.company_name || '',
    expected_budget: null
  });

  const [createdApplication, setCreatedApplication] = useState(null);
  
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

    setFormData(prev => ({ ...prev, contact_phone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (formData.title.length < 5) newErrors.title = 'Название должно быть не менее 5 символов';
    if (!formData.service_type) newErrors.service_type = 'Тип услуги обязателен';
    if (!formData.contact_full_name.trim()) newErrors.contact_full_name = 'Контактное лицо обязательно';
    if (!formData.contact_email.trim()) newErrors.contact_email = 'Email обязателен';
    if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Телефон обязателен';

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
      // Подготовка данных для отправки - телефон преобразуем в формат без форматирования
      const phoneForServer = extractPhoneForServer(formData.contact_phone);

      const applicationData = {
        ...formData,
        contact_phone: phoneForServer
      };

      const result = await createApplication(applicationData);

      if (result.success) {
        setCreatedApplication(result.application);
        showToast('Заявка успешно создана', 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Application creation error:', error);
      showToast('Ошибка создания заявки', 'error');
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
              <label htmlFor="service_type">Тип услуги *</label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className={errors.service_type ? 'error' : ''}
              >
                <option value="">Выберите тип услуги</option>
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.service_type && <span className="error-text">{errors.service_type}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="expected_budget">Ожидаемый бюджет (₽)</label>
              <input
                type="number"
                id="expected_budget"
                name="expected_budget"
                value={formData.expected_budget || ''}
                onChange={(e) => setFormData({...formData, expected_budget: e.target.value ? Number(e.target.value) : null})}
                placeholder="Введите сумму бюджета"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="contact_full_name">Контактное лицо *</label>
            <input
              type="text"
              id="contact_full_name"
              name="contact_full_name"
              value={formData.contact_full_name}
              onChange={handleChange}
              className={errors.contact_full_name ? 'error' : ''}
              placeholder="Ваше имя и фамилия"
            />
            {errors.contact_full_name && <span className="error-text">{errors.contact_full_name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact_email">Email *</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className={errors.contact_email ? 'error' : ''}
                placeholder="email@example.com"
              />
              {errors.contact_email && <span className="error-text">{errors.contact_email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contact_phone">Телефон *</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handlePhoneChange}
                className={errors.contact_phone ? 'error' : ''}
                placeholder="+7 (___) ___-__-__"
              />
              {errors.contact_phone && <span className="error-text">{errors.contact_phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="company_name">Название компании</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Название вашей компании"
            />
          </div>

          {createdApplication && (
            <div className="file-upload-section">
              <h3>Загрузить файлы к заявке</h3>
              <FileUpload
                applicationId={createdApplication.id}
                initialFiles={createdApplication.files || []}
              />
            </div>
          )}

          {!createdApplication && (
            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onCancel}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать заявку'}
              </Button>
            </div>
          )}

          {createdApplication && (
            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onCancel}
              >
                Закрыть
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
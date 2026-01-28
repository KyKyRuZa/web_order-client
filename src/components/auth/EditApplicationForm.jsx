import { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../FileUpload';
import { extractPhoneForServer } from '../../api/utils';
import { FontAwesomeIcon } from '../FontAwesomeIcon';
import '../../styles/EditApplicationForm.css';

export const EditApplicationForm = ({ application, onClose, onSave }) => {
  const { updateApplication } = useApplications();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    serviceType: '',
    description: '',
    contactFullName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    budgetRange: 'negotiable',
    priority: 'medium',
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем данные заявки при монтировании компонента
  useEffect(() => {
    if (application) {
      setFormData({
        title: application.title || '',
        serviceType: application.service_type || '',
        description: application.description || '',
        contactFullName: application.contact_full_name || '',
        contactEmail: application.contact_email || '',
        contactPhone: application.contact_phone || '',
        companyName: application.company_name || '',
        budgetRange: application.budget_range || 'negotiable',
        priority: application.priority || 'medium',
        attachments: application.files || []
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Укажите название заявки';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Выберите тип услуги';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Опишите вашу заявку';
    }

    if (!formData.contactFullName.trim()) {
      newErrors.contactFullName = 'Укажите контактное лицо';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Укажите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Некорректный email';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Укажите телефон';
    }

    setErrors(newErrors);

    // Show validation errors as toast notifications
    Object.values(newErrors).forEach(error => {
      showToast(error, 'error');
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Подготовка данных для отправки
      const phoneForServer = extractPhoneForServer(formData.contactPhone);
      
      const applicationData = {
        title: formData.title,
        service_type: formData.serviceType,
        description: formData.description,
        contact_full_name: formData.contactFullName,
        contact_email: formData.contactEmail,
        contact_phone: phoneForServer,
        company_name: formData.companyName,
        budget_range: formData.budgetRange,
        priority: formData.priority
      };
      
      const result = await updateApplication(application.id, applicationData);
      
      if (result.success) {
        showToast('Заявка успешно обновлена', 'success');
        onSave(result.application);
      } else {
        showToast(result.message || 'Ошибка обновления заявки', 'error');
      }
    } catch (error) {
      console.error('Update application error:', error);
      showToast('Ошибка обновления заявки', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="application-form-overlay">
      <div className="application-form-modal">
        <div className="application-form-header">
          <h2>Редактировать заявку</h2>
          <button className="close-btn" onClick={handleClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Название заявки *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
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
                <option value="website_development">Разработка сайта</option>
                <option value="crm_system">CRM-система</option>
                <option value="corporate_messenger">Корпоративный мессенджер</option>
                <option value="mobile_app">Мобильное приложение</option>
                <option value="consultation">Консультация</option>
                <option value="other">Другое</option>
              </select>
              {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Описание заявки *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactFullName">Контактное лицо *</label>
              <input
                type="text"
                id="contactFullName"
                name="contactFullName"
                value={formData.contactFullName}
                onChange={handleChange}
                className={errors.contactFullName ? 'error' : ''}
              />
              {errors.contactFullName && <span className="error-message">{errors.contactFullName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Email *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={errors.contactEmail ? 'error' : ''}
              />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
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
              />
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>
          </div>
          
          <div className="form-row">
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
            
            <div className="form-group">
              <label htmlFor="budgetRange">Бюджет</label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
              >
                <option value="negotiable">По договоренности</option>
                <option value="under_50k">До 50 000 ₽</option>
                <option value="50k_100k">50 000 - 100 000 ₽</option>
                <option value="100k_300k">100 000 - 300 000 ₽</option>
                <option value="300k_500k">300 000 - 500 000 ₽</option>
                <option value="over_500k">Более 500 000 ₽</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Приоритет</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>
          </div>

          <div className="file-upload-section">
            <h3>Файлы заявки</h3>
            <FileUpload
              applicationId={application.id}
              initialFiles={application.files || []}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
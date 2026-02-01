import { useState, useEffect } from 'react';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../utils/FileUpload';
import { applicationsAPI } from '../../api';
import { extractPhoneForServer } from '../../api/utils';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import { Button } from '../utils/Button';
import '../../styles/EditApplicationForm.css';

export const EditApplicationForm = ({ application, onClose, onSave }) => {
  const { updateApplication } = useApplications();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    service_type: '',
    description: '',
    contact_full_name: '',
    contact_email: '',
    contact_phone: '',
    company_name: '',
    expected_budget: null,
    priority: 'medium'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем данные заявки при монтировании компонента
  useEffect(() => {
    if (application) {
      setFormData({
        title: application.title || '',
        service_type: application.service_type || '',
        description: application.description || '',
        contact_full_name: application.contact_full_name || '',
        contact_email: application.contact_email || '',
        contact_phone: application.contact_phone || '',
        company_name: application.company_name || '',
        expected_budget: application.expected_budget || null,
        priority: application.priority || 'medium'
      });

      // Initialize uploaded files with existing files
      setUploadedFiles(application.files || []);
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

    setFormData(prev => ({ ...prev, contact_phone: formatted }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Укажите название заявки';
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Выберите тип услуги';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Опишите вашу заявку';
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Укажите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Некорректный email';
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Укажите телефон';
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

      const applicationData = {
        title: formData.title,
        service_type: formData.service_type,
        description: formData.description,
        contact_full_name: formData.contact_full_name,
        contact_email: formData.contact_email,
        contact_phone: extractPhoneForServer(formData.contact_phone),
        company_name: formData.company_name,
        expected_budget: formData.expected_budget,
        priority: formData.priority
      };

      const result = await updateApplication(application.id, applicationData);

      if (result.success) {
        // Если есть новые файлы для загрузки, загружаем их после обновления заявки
        if (uploadedFiles.some(file => !file.id)) { // Проверяем, есть ли новые файлы (без ID)
          const newFiles = uploadedFiles.filter(file => !file.id);
          showToast(`Обновление заявки выполнено, загружаем ${newFiles.length} файл(ов)...`, 'info');

          // Upload each new file to the updated application
          for (const fileObj of newFiles) {
            const fileData = {
              file: fileObj.file,
              category: 'other',
              description: fileObj.name
            };

            try {
              const uploadResult = await applicationsAPI.uploadFile(application.id, fileData);
              if (uploadResult.success) {
                showToast(`Файл ${fileObj.name} успешно загружен`, 'success');
              } else {
                showToast(`Ошибка загрузки файла ${fileObj.name}: ${uploadResult.message}`, 'error');
              }
            } catch (fileError) {
              console.error(`Ошибка загрузки файла ${fileObj.name}:`, fileError);
              showToast(`Ошибка загрузки файла ${fileObj.name}`, 'error');
            }
          }
        }

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
              <label htmlFor="service_type">Тип услуги *</label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className={errors.service_type ? 'error' : ''}
              >
                <option value="">Выберите тип услуги</option>
                <option value="landing_page">Лендинг</option>
                <option value="corporate_site">Корпоративный сайт</option>
                <option value="ecommerce">Интернет-магазин</option>
                <option value="web_application">Веб-приложение</option>
                <option value="other">Другое</option>
              </select>
              {errors.service_type && <span className="error-message">{errors.service_type}</span>}
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
              <label htmlFor="contact_email">Email *</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className={errors.contact_email ? 'error' : ''}
              />
              {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
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
              />
              {errors.contact_phone && <span className="error-message">{errors.contact_phone}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company_name">Название компании</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
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
            {!(user && user.role === 'client') && (
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
              )}
          </div>

          <div className="file-upload-section">
            <h3>Файлы заявки</h3>
            <FileUpload
              onFilesSelected={setUploadedFiles}
              maxFiles={5}
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClose}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Сохранить изменения
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
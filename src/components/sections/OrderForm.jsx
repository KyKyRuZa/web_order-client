import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Путь к контексту аутентификации
import { useApplications } from '../context/ApplicationsContext'; // Путь к контексту заявок
import { useToast } from '../context/ToastContext';
import { extractPhoneForServer } from '../api/utils';
import { applicationsAPI } from '../api';
import { FontAwesomeIcon } from './utils/FontAwesomeIcon';
import { FileUpload } from './utils/FileUpload';
import { Button } from './utils/Button';
import '../styles/OrderForm.css';

export const OrderForm = ({ id }) => {
  const { user, isAuthenticated } = useAuth();
  const { createApplication } = useApplications();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    contact_full_name: '',
    contact_email: '',
    contact_phone: '',
    company_name: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
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

    try {
      // Подготовка данных для отправки
      const phoneForServer = extractPhoneForServer(formData.contactPhone);

      const applicationData = {
        title: formData.title,
        description: formData.description,
        service_type: formData.service_type,
        contact_full_name: formData.contact_full_name,
        contact_email: formData.contact_email,
        contact_phone: phoneForServer,
        company_name: formData.company_name
      };

      // Отправка заявки через контекст
      const result = await createApplication(applicationData);

      if (result.success) {
        // Если есть файлы для загрузки, загружаем их после создания заявки
        if (uploadedFiles.length > 0) {
          // Note: In a real implementation, you might want to show progress for file uploads
          showToast(`Заявка создана, загружаем ${uploadedFiles.length} файл(ов)...`, 'info');

          // Upload each file to the newly created application
          for (const fileObj of uploadedFiles) {
            const fileData = {
              file: fileObj.file,
              category: 'other',
              description: fileObj.name
            };

            try {
              await applicationsAPI.uploadFile(result.application.id, fileData);
              showToast(`Файл ${fileObj.name} успешно загружен`, 'success');
            } catch (fileError) {
              console.error(`Ошибка загрузки файла ${fileObj.name}:`, fileError);
              showToast(`Ошибка загрузки файла ${fileObj.name}`, 'error');
            }
          }
        }

        setIsSubmitted(true);
        showToast('Заявка успешно отправлена', 'success');

        // Сброс формы и файлов
        setFormData({
          title: '',
          description: '',
          service_type: '',
          contact_full_name: isAuthenticated && user ? user.full_name || '' : '',
          contact_email: isAuthenticated && user ? user.email || '' : '',
          contact_phone: isAuthenticated && user ? user.phone || '' : '',
          company_name: isAuthenticated && user ? user.company_name || '' : ''
        });
        setUploadedFiles([]); // Clear uploaded files
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      showToast('Ошибка отправки заявки', 'error');
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
                      className={`custom-select ${errors.service_type ? 'error' : ''}`}
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    >
                      <span>
                        {formData.service_type
                          ? serviceOptions.find(opt => opt.value === formData.service_type)?.label
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
                              setFormData(prev => ({ ...prev, service_type: option.value }));
                              setIsServiceDropdownOpen(false);
                              if (errors.service_type) {
                                setErrors(prev => ({ ...prev, service_type: '' }));
                              }
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.service_type && <span className="error-text">{errors.service_type}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="company_name">Компания</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Название компании"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact_full_name">Имя</label>
                  <input
                    type="text"
                    id="contact_full_name"
                    name="contact_full_name"
                    value={formData.contact_full_name}
                    onChange={handleChange}
                    className={errors.contact_full_name ? 'error' : ''}
                    placeholder="Ваше имя"
                    required
                  />
                  {errors.contact_full_name && <span className="error-text">{errors.contact_full_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contact_email">Email</label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className={errors.contact_email ? 'error' : ''}
                    placeholder="email@company.com"
                    required
                  />
                  {errors.contact_email && <span className="error-text">{errors.contact_email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact_phone">Телефон</label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handlePhoneChange}
                  className={errors.contact_phone ? 'error' : ''}
                  required
                  placeholder="+7 (___) ___-__-__"
                />
                {errors.contact_phone && <span className="error-text">{errors.contact_phone}</span>}
              </div>

              <div className="form-group">
                <FileUpload
                  onFilesSelected={setUploadedFiles}
                  maxFiles={5}
                />
              </div>

              <div className="submit-btn-container">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="submit-btn"
                >
                  Отправить заявку
                </Button>
              </div>
            </form>
          ) : (
            <div className="form-success">
              <FontAwesomeIcon icon={['fas', 'check-circle']} style={{ fontSize: '5rem', color: '#00d4aa' }} />
              <h3>Заявка отправлена!</h3>
              <p>Мы свяжемся с вами в ближайшее время</p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsSubmitted(false)}
              >
                Отправить еще одну
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
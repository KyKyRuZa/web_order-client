import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import { adminAPI, applicationsAPI } from '../../api';
import { ApplicationNotes } from './ApplicationNotes'; // Импортируем компонент заметок
import '../../styles/ApplicationDetailsModal.css';

export const ApplicationDetailsModal = ({ applicationId, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplicationDetails();
    }
  }, [isOpen, applicationId, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // Определяем, какой API использовать в зависимости от роли пользователя
      if (user && (user.role === 'admin' || user.role === 'manager')) {
        // Администраторы и менеджеры используют adminAPI
        response = await adminAPI.getApplicationDetails(applicationId);

        // Загружаем список менеджеров для администраторов и менеджеров
        if (user.role === 'admin' || user.role === 'manager') {
          const usersResponse = await adminAPI.getUsers({ role: 'manager' });
          if (usersResponse.success) {
            setManagers(usersResponse.data.users || []);
          }
        }
      } else {
        // Обычные пользователи используют applicationsAPI
        response = await applicationsAPI.getById(applicationId);
      }

      if (response.success) {
        setApplication(response.data.application || response.data);
      } else {
        setError(response.message || 'Ошибка загрузки заявки');
      }
    } catch (err) {
      console.error('Load application details error:', err);
      setError('Не удалось загрузить детали заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!user || !(user.role === 'admin' || user.role === 'manager')) {
      showToast('Недостаточно прав для изменения статуса', 'error');
      return;
    }

    try {
      const response = await adminAPI.updateApplicationStatus(applicationId, { status: newStatus });

      if (response.success) {
        // Обновляем статус в локальном состоянии
        setApplication(prevApp => ({
          ...prevApp,
          status: newStatus,
          statusDisplay: getStatusDisplay(newStatus)
        }));
        showToast('Статус заявки успешно изменен', 'success');
      } else {
        showToast(response.message || 'Ошибка изменения статуса', 'error');
      }
    } catch (error) {
      console.error('Update status error:', error);
      showToast(error.response?.data?.message || 'Ошибка изменения статуса', 'error');
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'draft': 'Черновик',
      'submitted': 'Отправлено',
      'in_review': 'На рассмотрении',
      'needs_info': 'Требуется информация',
      'estimated': 'Оценено',
      'approved': 'Утверждено',
      'in_progress': 'В работе',
      'completed': 'Завершено',
      'cancelled': 'Отменено',
      'rejected': 'Отклонено'
    };

    return statusMap[status] || status;
  };

  const handleAssignManager = async (managerId) => {
    if (!user || !(user.role === 'admin' || user.role === 'manager')) {
      showToast('Недостаточно прав для назначения менеджера', 'error');
      return;
    }

    try {
      const response = await adminAPI.assignManager(applicationId, managerId);

      if (response.success) {
        // Обновляем данные в локальном состоянии
        setApplication(prevApp => ({
          ...prevApp,
          assigned_to: managerId,
          assigned_manager_name: response.data?.new_manager?.full_name || 'Назначенный менеджер'
        }));
        showToast('Менеджер успешно назначен', 'success');
      } else {
        showToast(response.message || 'Ошибка назначения менеджера', 'error');
      }
    } catch (error) {
      console.error('Assign manager error:', error);
      showToast(error.response?.data?.message || 'Ошибка назначения менеджера', 'error');
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content application-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user.role === 'client' ? 'Детали заявки' : `Детали заявки #${applicationId}`}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>

        {loading ? (
          <div className="modal-body">
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
              <span>Загрузка...</span>
            </div>
          </div>
        ) : error ? (
          <div className="modal-body">
            <div className="error-message">{error}</div>
          </div>
        ) : application ? (
          <div className="modal-body">
            <div className="application-details-grid">
              <div className="detail-item">
                <label>Название:</label>
                <span>{application.title}</span>
              </div>

              <div className="detail-item">
                <label>Описание:</label>
                <span>{application.description}</span>
              </div>

              <div className="detail-item">
                <label>Статус:</label>
                <div className="status-control">
                  {user && (user.role === 'admin' || user.role === 'manager') ? (
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="status-select"
                    >
                      <option value="draft">Черновик</option>
                      <option value="submitted">Отправлено</option>
                      <option value="in_review">На рассмотрении</option>
                      <option value="needs_info">Требуется информация</option>
                      <option value="estimated">Оценено</option>
                      <option value="approved">Утверждено</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Отменено</option>
                      <option value="rejected">Отклонено</option>
                    </select>
                  ) : application.status === 'draft' && application.user_id === user.id ? (
                    <div className="draft-controls">
                      <span className={`status-badge status-${application.status}`}>
                        {application.statusDisplay}
                      </span>
                    </div>
                  ) : (
                    <span className={`status-badge status-${application.status}`}>
                      {application.statusDisplay}
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <label>Тип услуги:</label>
                <span>{application.serviceTypeDisplay || application.service_type}</span>
              </div>

              {!(user && user.role === 'client') && (
                <div className="detail-item">
                  <label>Приоритет:</label>
                  <span className={`priority-badge priority-${application.priority}`}>
                    {application.priorityDisplay}
                  </span>
                </div>
              )}

              <div className="detail-item">
                <label>Email клиента:</label>
                <span>{application.contact_email}</span>
              </div>

              <div className="detail-item">
                <label>Телефон клиента:</label>
                <span>
                  {application.contact_phone ?
                    (() => {
                      let cleanPhone = application.contact_phone.replace(/\D/g, '');
                      if (cleanPhone.length >= 11) {
                        // Форматируем как +7 (XXX) XXX-XX-XX
                        return `+7 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7, 9)}-${cleanPhone.slice(9, 11)}`;
                      }
                      return application.contact_phone; // Возвращаем как есть, если формат нестандартный
                    })()
                    : 'Не указан'}
                </span>
              </div>

              {!(user && user.role === 'client') && (
                <div className="detail-item">
                  <label>Назначенный менеджер:</label>
                  <div className="manager-control">
                    {user && (user.role === 'admin' || user.role === 'manager') ? (
                      <select
                        value={application.assigned_to || ''}
                        onChange={(e) => handleAssignManager(e.target.value)}
                        className="manager-select"
                      >
                        <option value="">Выберите менеджера</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.full_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{application.assigned_manager_name || 'Не назначен'}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="detail-item">
                <label>Ожидаемый бюджет:</label>
                <span>{application.expected_budget ? new Intl.NumberFormat('ru-RU').format(application.expected_budget) + ' ₽' : 'Не указан'}</span>
              </div>

              <div className="detail-item">
                <label>Дата создания:</label>
                <span>{new Date(application.created_at).toLocaleString()}</span>
              </div>

              {!(user && user.role === 'client') && (
                <div className="detail-item">
                  <label>Дата обновления:</label>
                  <span>{new Date(application.updated_at).toLocaleString()}</span>
                </div>
              )}

              <div className="detail-item full-width">
                <label>Файлы:</label>
                <div className="files-list">
                  {application.files && application.files.length > 0 ? (
                    <ul>
                      {application.files.map(file => (
                        <li key={file.id} className="file-item">
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon="file" /> {file.original_name || file.filename || 'Файл'}
                          </a>
                          <span className="file-size">({formatFileSize(file.size)})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Нет прикрепленных файлов</span>
                  )}
                </div>
              </div>

              {!(user && user.role === 'client') && (
                <div className="detail-item full-width">
                  <label>История статусов:</label>
                  <div className="status-history">
                    {application.status_history && application.status_history.length > 0 ? (
                      <ul>
                        {application.status_history.map(history => (
                          <li key={history.id} className="status-change">
                            <div className="status-change-info">
                              <span className={`status-badge status-${history.new_status}`}>
                                {history.new_status_display}
                              </span>
                              <span className="status-change-date">
                                {new Date(history.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="status-change-by">
                              {history.changed_by ? `Изменено: ${history.changed_by}` : 'Автоматически'}
                            </div>
                            {history.comment && (
                              <div className="status-change-comment">
                                Комментарий: {history.comment}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>История статусов отсутствует</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Компонент заметок */}
            <div className="notes-section-wrapper">
              <ApplicationNotes applicationId={applicationId} />
            </div>
          </div>
        ) : null}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
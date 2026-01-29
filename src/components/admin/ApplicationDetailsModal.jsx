import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import { adminAPI, applicationsAPI } from '../../api';
import { ApplicationNotes } from './ApplicationNotes'; // Импортируем компонент заметок
import '../../styles/ApplicationDetailsModal.css';

export const ApplicationDetailsModal = ({ applicationId, isOpen, onClose, onUpdate }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      loadApplicationDetails();
    }
  }, [isOpen, applicationId]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Попробуем сначала получить данные через adminAPI, затем через applicationsAPI
      let response;
      try {
        response = await adminAPI.getApplicationDetails(applicationId);
      } catch (adminError) {
        // Если ошибка с adminAPI, пробуем через applicationsAPI
        try {
          response = await applicationsAPI.getById(applicationId);
        } catch (userError) {
          // Если оба варианта не сработали, выбрасываем ошибку
          throw new Error('Не удалось загрузить детали заявки');
        }
      }

      if (response.success) {
        setApplication(response.data.application || response.data);
      } else {
        setError(response.message || 'Ошибка загрузки заявки');
      }
    } catch (err) {
      console.error('Load application details error:', err);
      setError('Ошибка загрузки заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content application-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Детали заявки #{applicationId}</h3>
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
                <span className={`status-badge status-${application.status}`}>
                  {application.statusDisplay}
                </span>
              </div>

              <div className="detail-item">
                <label>Тип услуги:</label>
                <span>{application.serviceTypeDisplay || application.service_type}</span>
              </div>

              <div className="detail-item">
                <label>Приоритет:</label>
                <span className={`priority-badge priority-${application.priority}`}>
                  {application.priorityDisplay}
                </span>
              </div>

              <div className="detail-item">
                <label>Клиент:</label>
                <span>{application.contact_full_name}</span>
              </div>

              <div className="detail-item">
                <label>Email клиента:</label>
                <span>{application.contact_email}</span>
              </div>

              <div className="detail-item">
                <label>Телефон клиента:</label>
                <span>{application.contact_phone}</span>
              </div>

              <div className="detail-item">
                <label>Назначенный менеджер:</label>
                <span>{application.assigned_manager_name || 'Не назначен'}</span>
              </div>

              <div className="detail-item">
                <label>Ожидаемый бюджет:</label>
                <span>{application.expected_budget ? new Intl.NumberFormat('ru-RU').format(application.expected_budget) + ' ₽' : 'Не указан'}</span>
              </div>

              <div className="detail-item">
                <label>Дата создания:</label>
                <span>{new Date(application.created_at).toLocaleString()}</span>
              </div>

              <div className="detail-item">
                <label>Дата обновления:</label>
                <span>{new Date(application.updated_at).toLocaleString()}</span>
              </div>

              <div className="detail-item full-width">
                <label>Файлы:</label>
                <div className="files-list">
                  {application.files && application.files.length > 0 ? (
                    <ul>
                      {application.files.map(file => (
                        <li key={file.id} className="file-item">
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon="file" /> {file.filename}
                          </a>
                          <span className="file-size">({file.size})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Нет прикрепленных файлов</span>
                  )}
                </div>
              </div>

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
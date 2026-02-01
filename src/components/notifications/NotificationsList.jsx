import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notificationsAPI } from '../../api';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import '../../styles/NotificationsList.css';

export const NotificationsList = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await notificationsAPI.getNotifications({ page, limit: 10 });

      if (response.success) {
        setNotifications(response.data.notifications || []);
        setPagination(response.data.pagination || {});
      } else {
        setError(response.message || 'Ошибка загрузки уведомлений');
      }
    } catch (error) {
      console.error('Load notifications error:', error);
      setError('Не удалось загрузить уведомления');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await notificationsAPI.markAsRead(notificationId);

      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        showToast('Уведомление отмечено как прочитанное', 'success');
      } else {
        showToast(response.message || 'Ошибка отметки уведомления', 'error');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      showToast('Ошибка отметки уведомления', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationsAPI.markAllAsRead();

      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        showToast('Все уведомления отмечены как прочитанные', 'success');
      } else {
        showToast(response.message || 'Ошибка отметки уведомлений', 'error');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      showToast('Ошибка отметки уведомлений', 'error');
    }
  };

  if (loading) {
    return (
      <div className="notifications-list">
        <div className="notifications-header">
          <h3>Уведомления</h3>
        </div>
        <div className="loading-spinner">
          <FontAwesomeIcon icon="spinner" spin />
          <span>Загрузка уведомлений...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-list">
        <div className="notifications-header">
          <h3>Уведомления</h3>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="notifications-list">
      <div className="notifications-header">
        <h3>Уведомления</h3>
        {notifications.some(n => !n.is_read) && (
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            Отметить все как прочитанные
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <FontAwesomeIcon icon="bell" />
          <p>У вас пока нет уведомлений</p>
        </div>
      ) : (
        <div className="notifications-grid">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-date">
                    {new Date(notification.created_at).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              {!notification.is_read && (
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => markAsRead(notification.id)}
                >
                  Отметить как прочитанное
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => loadNotifications(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Назад
          </button>
          <span>{pagination.page} из {pagination.pages}</span>
          <button 
            onClick={() => loadNotifications(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};
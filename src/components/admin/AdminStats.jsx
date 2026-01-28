import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../Button';
import '../../styles/AdminStats.css';

export const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Ошибка получения статистики');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError(err.message);
      showToast('Ошибка загрузки статистики', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-stats-container">
        <div className="stats-loading">Загрузка статистики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats-container">
        <div className="stats-error">{error}</div>
        <button className="btn btn-primary" onClick={fetchStats}>Повторить попытку</button>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <div className="stats-header">
        <h2>Статистика</h2>
        <Button variant="secondary" size="md" onClick={fetchStats}>Обновить</Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalApplications || 0}</div>
          <div className="stat-label">Всего заявок</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.pendingApplications || 0}</div>
          <div className="stat-label">В ожидании</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.inProgressApplications || 0}</div>
          <div className="stat-label">В работе</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.completedApplications || 0}</div>
          <div className="stat-label">Завершено</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Всего пользователей</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats?.activeUsers || 0}</div>
          <div className="stat-label">Активных пользователей</div>
        </div>

        <div className="stat-card stat-card-wide">
          <div className="stat-chart-placeholder">
            <h3>Статусы заявок</h3>
            <div className="chart-bars">
              {stats?.applicationStatuses?.map((status) => (
                <div key={status.status} className="chart-bar">
                  <div className="bar-label">{status.statusDisplay}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(status.count / stats.totalApplications) * 100}%` }}
                    ></div>
                    <div className="bar-count">{status.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-wide">
          <div className="stat-chart-placeholder">
            <h3>Типы услуг</h3>
            <div className="chart-bars">
              {stats?.serviceTypes?.map((service) => (
                <div key={service.type} className="chart-bar">
                  <div className="bar-label">{service.typeDisplay}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(service.count / stats.totalApplications) * 100}%` }}
                    ></div>
                    <div className="bar-count">{service.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
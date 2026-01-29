import { useToast } from '../../context/ToastContext';
import { Button } from '../utils/Button';
import '../../styles/AdminStats.css';

export const AdminStats = ({ statsData, onRefresh }) => {
  const { showToast } = useToast();

  if (!statsData) {
    return (
      <div className="admin-stats-container">
        <div className="stats-loading">Загрузка статистики...</div>
      </div>
    );
  }

  if (!statsData.overview) {
    return (
      <div className="admin-stats-container">
        <div className="stats-error">Нет данных для отображения</div>
        <Button variant="secondary" size="md" onClick={onRefresh}>Обновить</Button>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <div className="stats-header">
        <h2>Статистика</h2>
        <Button variant="secondary" size="md" onClick={onRefresh}>Обновить</Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statsData?.overview?.total_applications || 0}</div>
          <div className="stat-label">Всего заявок</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statsData?.overview?.active_applications || 0}</div>
          <div className="stat-label">Активных</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statsData?.overview?.attention_needed || 0}</div>
          <div className="stat-label">Требуют внимания</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{statsData?.overview?.total_users || 0}</div>
          <div className="stat-label">Всего пользователей</div>
        </div>

        <div className="stat-card stat-card-wide">
          <div className="stat-chart-placeholder">
            <h3>Статусы заявок</h3>
            <div className="chart-bars">
              {statsData?.by_status?.map((status) => (
                <div key={status.status} className="chart-bar">
                  <div className="bar-label">{status.status_display}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(status.count / statsData.overview.total_applications) * 100}%` }}
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
              {statsData?.by_service?.map((service) => (
                <div key={service.service_type} className="chart-bar">
                  <div className="bar-label">{service.service_type_display}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(service.count / statsData.overview.total_applications) * 100}%` }}
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
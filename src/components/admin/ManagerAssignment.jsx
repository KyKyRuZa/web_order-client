import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { adminAPI } from '../../api';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import '../../styles/ManagerAssignment.css';

export const ManagerAssignment = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
    loadManagers();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getApplications({ page: 1, limit: 50 });
      if (response.success) {
        setApplications(response.data.applications || []);
      } else {
        showToast(response.message || 'Ошибка загрузки заявок', 'error');
      }
    } catch (err) {
      console.error('Load applications error:', err);
      setError('Ошибка загрузки заявок');
      showToast('Ошибка загрузки заявок', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      const response = await adminAPI.getUsers({ role: 'manager', page: 1, limit: 100 });
      if (response.success) {
        setManagers(response.data.users || []);
      } else {
        showToast(response.message || 'Ошибка загрузки менеджеров', 'error');
      }
    } catch (err) {
      console.error('Load managers error:', err);
      showToast('Ошибка загрузки менеджеров', 'error');
    }
  };

  const handleAssignManager = async (applicationId, managerId) => {
    try {
      const response = await adminAPI.assignManager(applicationId, managerId);

      if (response.success) {
        // Обновляем заявку в локальном состоянии
        setApplications(prevApps =>
          prevApps.map(app =>
            app.id === applicationId
              ? { ...app, assigned_manager_id: managerId, assigned_manager_name: managers.find(m => m.id === managerId)?.full_name }
              : app
          )
        );
        showToast('Менеджер успешно назначен', 'success');
      } else {
        showToast(response.message || 'Ошибка назначения менеджера', 'error');
      }
    } catch (error) {
      console.error('Assign manager error:', error);
      showToast(error.response?.data?.message || 'Ошибка назначения менеджера', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <FontAwesomeIcon icon="spinner" spin />
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="manager-assignment">
      <h2>Назначение менеджеров</h2>
      <p>Назначьте менеджеров на заявки</p>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Статус</th>
              <th>Клиент</th>
              <th>Назначенный менеджер</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.title}</td>
                <td>
                  <span className={`status-badge status-${app.status}`}>
                    {app.statusDisplay}
                  </span>
                </td>
                <td>{app.contact_full_name}</td>
                <td>
                  {app.assigned_manager_name || 'Не назначен'}
                </td>
                <td>
                  <select
                    value={app.assigned_manager_id || ''}
                    onChange={(e) => handleAssignManager(app.id, e.target.value)}
                    className="manager-select"
                  >
                    <option value="">Выберите менеджера</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.full_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
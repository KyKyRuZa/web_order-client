import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Header';
import { FontAwesomeIcon } from '../FontAwesomeIcon';
import { adminAPI } from '../../api';
import { AdminStats } from './AdminStats';
import '../../styles/AdminPanel.css';

export const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'rejected', 'active'

  // Проверяем права доступа
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getApplications({ page: 1, limit: 50 });
      if (response.success) {
        setApplications(response.data.applications || []);
      }
    } catch (err) {
      setError('Ошибка загрузки заявок');
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await adminAPI.updateApplicationStatus(applicationId, { status: newStatus });

      if (response.success) {
        // Обновляем статус в локальном состоянии
        setApplications(prevApps =>
          prevApps.map(app =>
            app.id === applicationId
              ? { ...app, status: newStatus, statusDisplay: getStatusDisplay(newStatus) }
              : app
          )
        );
      } else {
        alert(response.message || 'Ошибка изменения статуса');
      }
    } catch (error) {
      console.error('Update status error:', error);
      alert(error.response?.data?.message || 'Ошибка изменения статуса');
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

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.getUsers({ page: 1, limit: 50 });
      if (response.success) {
        setUsers(response.data.users || []);
      } else {
        setError(response.message || 'Ошибка загрузки пользователей');
      }
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isManager && activeTab === 'applications') {
      fetchApplications();
    }
    if (isAdmin && activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'dashboard') {
      // Загружаем данные для дашборда
      if (isManager) {
        fetchApplications();
      }
      if (isAdmin) {
        fetchUsers();
      }
    }
  }, [activeTab, isAdmin, isManager, fetchApplications, fetchUsers]);

  useEffect(() => {
    // Фильтруем заявки в зависимости от выбранного фильтра
    if (statusFilter === 'all') {
      setFilteredApplications(applications);
    } else if (statusFilter === 'rejected') {
      setFilteredApplications(applications.filter(app => app.status === 'rejected'));
    } else if (statusFilter === 'active') {
      setFilteredApplications(applications.filter(app => app.status !== 'rejected'));
    }
  }, [applications, statusFilter]);

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: 'chart-bar', allowed: isManager },
    { id: 'applications', label: 'Заявки', icon: 'folder', allowed: isManager },
    { id: 'statistics', label: 'Статистика', icon: 'chart-line', allowed: isAdmin },
    { id: 'users', label: 'Пользователи', icon: 'users', allowed: isAdmin },
    { id: 'reports', label: 'Отчеты', icon: 'file-alt', allowed: isAdmin },
  ].filter(tab => tab.allowed);

  return (
    <>
      <Header />
      <div className="admin-panel">
        <div className="admin-container">
          <aside className="admin-sidebar">
            <div className="admin-user-info">
              <h3>Админ-панель</h3>
              <p>{user?.full_name}</p>
              <span className={`role-badge role-${user?.role}`}>
                {user?.role === 'admin' ? 'Администратор' : 'Менеджер'}
              </span>
            </div>
            
            <nav className="admin-nav">
              <ul>
                {tabs.map(tab => (
                  <li key={tab.id}>
                    <button
                      className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <FontAwesomeIcon icon={tab.icon} />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="admin-main">
            {loading && (
              <div className="loading-spinner">
                <FontAwesomeIcon icon="spinner" spin />
                <span>Загрузка...</span>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                <h2>Дашборд</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon bg-blue">
                      <FontAwesomeIcon icon="folder" />
                    </div>
                    <div className="stat-info">
                      <h3>{applications.length}</h3>
                      <p>Всего заявок</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon bg-green">
                      <FontAwesomeIcon icon="check-circle" />
                    </div>
                    <div className="stat-info">
                      <h3>{applications.filter(a => a.status === 'approved' || a.status === 'completed').length}</h3>
                      <p>Одобренных</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon bg-orange">
                      <FontAwesomeIcon icon="clock" />
                    </div>
                    <div className="stat-info">
                      <h3>{applications.filter(a => a.status === 'in_review' || a.status === 'submitted').length}</h3>
                      <p>На рассмотрении</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon bg-red">
                      <FontAwesomeIcon icon="user" />
                    </div>
                    <div className="stat-info">
                      <h3>{users.length}</h3>
                      <p>Пользователей</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="applications-content">
                <div className="applications-header">
                  <h2>Заявки</h2>
                  <div className="filter-controls">
                    <label htmlFor="statusFilter">Фильтр по статусу:</label>
                    <select
                      id="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">Все</option>
                      <option value="active">Активные</option>
                      <option value="rejected">Отклоненные</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Статус</th>
                        <th>Тип услуги</th>
                        <th>Дата создания</th>
                        <th>Клиент</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => (
                        <tr key={app.id}>
                          <td>{app.id}</td>
                          <td>{app.title}</td>
                          <td>
                            <span className={`status-badge status-${app.status}`}>
                              {app.statusDisplay}
                            </span>
                          </td>
                          <td>{app.serviceTypeDisplay}</td>
                          <td>{new Date(app.created_at).toLocaleDateString()}</td>
                          <td>{app.contact_full_name}</td>
                          <td>
                            <button className="action-btn view-btn">
                              <FontAwesomeIcon icon="eye" />
                            </button>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-content">
                <h2>Пользователи</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Дата регистрации</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(userItem => (
                        <tr key={userItem.id}>
                          <td>{userItem.id}</td>
                          <td>{userItem.full_name}</td>
                          <td>{userItem.email}</td>
                          <td>
                            <span className={`role-badge role-${userItem.role}`}>
                              {userItem.role === 'admin' ? 'Админ' : 
                               userItem.role === 'manager' ? 'Менеджер' : 'Клиент'}
                            </span>
                          </td>
                          <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${userItem.is_email_verified ? 'status-active' : 'status-inactive'}`}>
                              {userItem.is_email_verified ? 'Активен' : 'Неактивен'}
                            </span>
                          </td>
                          <td>
                            <button className="action-btn edit-btn">
                              <FontAwesomeIcon icon="edit" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="reports-content">
                <h2>Отчеты</h2>
                <p>Функционал отчетов в разработке</p>
              </div>
            )}

            {activeTab === 'statistics' && (
              <AdminStats />
            )}
          </main>
        </div>
      </div>
    </>
  );
};
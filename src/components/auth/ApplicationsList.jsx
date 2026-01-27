import { useEffect } from 'react';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../Header';
import '../../styles/ApplicationsList.css';

export const ApplicationsList = () => {
  const { applications, loading, error, fetchApplications } = useApplications();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]); // Убрали fetchApplications из зависимостей, так как она может быть новой функцией при каждом рендере

  if (!user) {
    return (
      <>
        <Header />
        <div className="applications-page">
          <div className="applications-container">
            <div className="auth-required">
              <h2>Для просмотра заявок необходимо войти в аккаунт</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="applications-page">
          <div className="applications-container">
            <div className="loading">Загрузка заявок...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="applications-page">
          <div className="applications-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="applications-page">
        <div className="applications-container">  
        {applications.length === 0 ? (
          <div className="no-applications">
            <p>У вас пока нет заявок</p>
            <p>Создайте первую заявку, чтобы начать сотрудничество с нами</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <h3>{application.title}</h3>
                  <span className={`status-badge status-${application.status}`}>
                    {application.statusDisplay}
                  </span>
                </div>
                
                <div className="application-details">
                  <div className="detail-item">
                    <span className="label">Тип услуги:</span>
                    <span className="value">{application.serviceTypeDisplay}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Дата создания:</span>
                    <span className="value">{new Date(application.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Контактное лицо:</span>
                    <span className="value">{application.contact_full_name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Компания:</span>
                    <span className="value">{application.company_name || 'Не указана'}</span>
                  </div>
                  
                  {application.budget_range && (
                    <div className="detail-item">
                      <span className="label">Бюджет:</span>
                      <span className="value">
                        {application.budget_range === 'under_50k' && 'До 50 000 ₽'}
                        {application.budget_range === '50k_100k' && '50 000 - 100 000 ₽'}
                        {application.budget_range === '100k_300k' && '100 000 - 300 000 ₽'}
                        {application.budget_range === '300k_500k' && '300 000 - 500 000 ₽'}
                        {application.budget_range === 'negotiable' && 'По договоренности'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="application-actions">
                  <button className="btn btn-secondary">Подробнее</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
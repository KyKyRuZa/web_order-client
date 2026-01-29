import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ProfilePage } from '../components/auth/ProfilePage';
import { ApplicationsList } from '../components/auth/ApplicationsList';
import { AdminPanel } from '../components/admin/AdminPanel';
import { RequireRole } from '../components/common/RequireRole';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import App from '../components/core/App';

import '../styles/AppRouter.css';

export const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { loading } = useAuth();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Функция для навигации
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Пока контекст аутентификации загружается, показываем основное приложение
  if (loading) {
    return <App />;
  }

  // Обработка маршрутов
  if (currentPath === '/login' || currentPath === '/signin') {
    return (
      <div className="auth-page">
        <LoginForm
          onSwitchToRegister={() => navigate('/register')}
          onSuccess={() => navigate('/')}
          onSwitchToForgotPassword={() => navigate('/forgot-password')}
        />
      </div>
    );
  }

  if (currentPath === '/register' || currentPath === '/signup') {
    return (
      <div className="auth-page">
        <RegisterForm
          onSwitchToLogin={() => navigate('/login')}
          onSuccess={() => navigate('/')}
        />
      </div>
    );
  }

  if (currentPath === '/forgot-password') {
    return (
      <div className="auth-page">
        <ForgotPasswordForm
          onSwitchToLogin={() => navigate('/login')}
        />
      </div>
    );
  }

  if (currentPath === '/profile') {
    return <ProfilePage />;
  }

  if (currentPath === '/my-applications') {
    return <ApplicationsList />;
  }

  if (currentPath === '/admin' || currentPath === '/admin-panel') {
    return (
      <RequireRole allowedRoles={['admin', 'manager']} redirectTo="/">
        <AdminPanel />
      </RequireRole>
    );
  }

  // Для всех остальных маршрутов показываем основное приложение
  return <App />;
};
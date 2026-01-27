import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { ProfilePage } from './auth/ProfilePage';
import { ApplicationsList } from './auth/ApplicationsList';
import { AdminPanel } from './admin/AdminPanel';
import App from './App';

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

  if (currentPath === '/profile') {
    return <ProfilePage />;
  }

  if (currentPath === '/my-applications') {
    return <ApplicationsList />;
  }

  if (currentPath === '/admin' || currentPath === '/admin-panel') {
    return <AdminPanel />;
  }

  // Для всех остальных маршрутов показываем основное приложение
  return <App />;
};
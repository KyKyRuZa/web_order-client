import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const RequireRole = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Если пользователь не авторизован или у него нет разрешенной роли
      if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = redirectTo;
      }
    }
  }, [user, loading, allowedRoles, redirectTo]);

  // Если пользователь загружается, показываем заглушку
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: 'var(--text-primary)'
      }}>
        Загрузка...
      </div>
    );
  }

  // Если пользователь авторизован и имеет разрешенную роль, показываем дочерние элементы
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // В противном случае ничего не показываем (редирект произойдет через useEffect)
  return null;
};
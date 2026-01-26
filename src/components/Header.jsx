import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';
import { Logo } from './Logo';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header>
      <div className="header-container">
        <Logo />
        <nav>
          <ul className={isMenuOpen ? 'active' : ''} id="nav-menu">
            <li><a href="#home" onClick={closeMenu}>Главная</a></li>
            <li><a href="#services" onClick={closeMenu}>Услуги</a></li>
            <li><a href="#about" onClick={closeMenu}>О нас</a></li>
            <li><a href="#order" onClick={closeMenu}>Заказать</a></li>
            <li><a href="#contact" onClick={closeMenu}>Контакты</a></li>

            {/* Дополнительные ссылки для аутентифицированных пользователей */}
            {isAuthenticated ? (
              <>
                <li><a href="/profile" onClick={closeMenu}>Профиль</a></li>
                <li><a href="/my-applications" onClick={closeMenu}>Мои заявки</a></li>
                <li><button onClick={handleLogout} className="logout-btn">Выйти</button></li>
              </>
            ) : (
              <li><a href="/login" onClick={closeMenu}>Войти</a></li>
            )}
          </ul>
        </nav>
        <button className="mobile-menu" onClick={toggleMenu}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
};
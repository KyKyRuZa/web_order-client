import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import '../../styles/Header.css';
import { Logo } from '../common/Logo';

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

  
  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    closeMenu();

    // Если мы на главной странице, просто скроллим
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если мы на другой странице, переходим на главную и скроллим
      window.location.href = `/${anchor}`;
    }
  };

  return (
    <header>
      <div className="header-container">
        <Logo />
        <nav>
          <ul className={isMenuOpen ? 'active' : ''} id="nav-menu">
            <li><a href="#home" onClick={(e) => handleAnchorClick(e, '#home')}>Главная</a></li>
            <li><a href="#services" onClick={(e) => handleAnchorClick(e, '#services')}>Услуги</a></li>
            <li><a href="#about" onClick={(e) => handleAnchorClick(e, '#about')}>О нас</a></li>
            <li><a href="#order" onClick={(e) => handleAnchorClick(e, '#order')}>Заказать</a></li>
            <li><a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>Контакты</a></li>

            {/* Дополнительные ссылки для аутентифицированных пользователей */}
            {isAuthenticated ? (
              <>
                <li><a href="/profile" onClick={closeMenu}>Профиль</a></li>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <li><a href="/admin" onClick={closeMenu}>Админ-панель</a></li>
                )}
                <li><button onClick={handleLogout} className="logout-btn">Выйти</button></li>
              </>
            ) : (
              <li><a href="/login" onClick={closeMenu}>Войти</a></li>
            )}
          </ul>
        </nav>
        <button className="mobile-menu" onClick={toggleMenu}>
          <FontAwesomeIcon icon="bars" />
        </button>
      </div>
    </header>
  );
};
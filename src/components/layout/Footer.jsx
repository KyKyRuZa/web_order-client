import '../../styles/Footer.css';

export const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <svg viewBox="0 0 40 40" width="32" height="32">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />
            <circle cx="12" cy="16" r="4" fill="url(#logoGrad)" />
            <circle cx="28" cy="16" r="4" fill="url(#logoGrad)" />
            <circle cx="20" cy="28" r="4" fill="url(#logoGrad)" />
            <line
              x1="12"
              y1="16"
              x2="20"
              y2="28"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />
            <line
              x1="28"
              y1="16"
              x2="20"
              y2="28"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="16"
              x2="28"
              y2="16"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />
          </svg>
          <span>Relate Lab</span>
        </div>
        <div className="footer-links">
          <a href="#home">Главная</a>
          <a href="#services">Услуги</a>
          <a href="#about">О нас</a>
          <a href="#contact">Контакты</a>
        </div>
      </div>
      <p className="copyright">© 2026 Relate Lab. Все права защищены.</p>
    </footer>
  );
};
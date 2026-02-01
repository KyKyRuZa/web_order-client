import '../../styles/Footer.css';
import { Logo } from '../common/Logo';
export const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
        <Logo/>
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
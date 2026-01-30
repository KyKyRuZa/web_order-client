import { Button } from '../utils/Button';
import '../../styles/Hero.css';

export const Hero = ({ id }) => {
  return (
    <section className="hero" id={id || "home"}>
      <div className="hero-content">
        <div className="hero-badge">Инновационные IT-решения</div>
        <h1>Создаём <span>цифровые связи</span> для вашего бизнеса</h1>
        <p>
          Разработка современных веб-приложений, корпоративных мессенджеров и
          CRM-систем. Технологии, которые объединяют.
        </p>
        <div className="hero-buttons">
          <Button variant="primary" size="lg" onClick={() => document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' })}>Начать проект</Button>
          <Button variant="secondary" size="lg" onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}>Узнать больше</Button>
        </div>
      </div>
    </section>
  );
};
import '../styles/Hero.css';

export const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">Инновационные IT-решения</div>
        <h1>Создаём <span>цифровые связи</span> для вашего бизнеса</h1>
        <p>
          Разработка современных веб-приложений, корпоративных мессенджеров и
          CRM-систем. Технологии, которые объединяют.
        </p>
        <div className="hero-buttons">
          <a href="#order" className="btn btn-primary">Начать проект</a>
          <a href="#services" className="btn btn-secondary">Узнать больше</a>
        </div>
      </div>
    </section>
  );
};
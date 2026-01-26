import '../styles/About.css';

export const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-visual">
          <svg viewBox="0 0 200 200">
            <defs>
              <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4aa" />
                <stop offset="100%" stopColor="#00a080" />
              </linearGradient>
            </defs>
            <line
              x1="100"
              y1="40"
              x2="40"
              y2="100"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1="100"
              y1="40"
              x2="160"
              y2="100"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="100"
              x2="70"
              y2="160"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1="160"
              y1="100"
              x2="130"
              y2="160"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1="70"
              y1="160"
              x2="130"
              y2="160"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="100"
              x2="160"
              y2="100"
              stroke="#00d4aa"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle cx="100" cy="40" r="15" fill="url(#nodeGrad)" />
            <circle cx="40" cy="100" r="12" fill="url(#nodeGrad)" />
            <circle cx="160" cy="100" r="12" fill="url(#nodeGrad)" />
            <circle cx="70" cy="160" r="10" fill="url(#nodeGrad)" />
            <circle cx="130" cy="160" r="10" fill="url(#nodeGrad)" />
            <circle
              cx="100"
              cy="100"
              r="20"
              fill="url(#nodeGrad)"
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="about-content">
          <span className="section-label">О компании</span>
          <h2>Relate Lab — связи решают всё</h2>
          <p>
            Мы специализируемся на создании цифровых экосистем, которые
            объединяют людей, процессы и данные в единое целое.
          </p>
          <p>
            Наш подход — это глубокое понимание бизнес-процессов клиента и
            применение передовых технологий для создания решений, которые
            работают.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Проектов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Лет опыта</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
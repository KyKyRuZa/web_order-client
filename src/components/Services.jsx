import '../styles/Services.css';

export const Services = () => {
  const services = [
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'Веб-разработка',
      description: 'Современные веб-приложения с отзывчивым дизайном и высокой производительностью',
      features: ['Корпоративные порталы', 'E-commerce решения', 'SaaS платформы', 'Progressive Web Apps']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: 'Корпоративные мессенджеры',
      description: 'Защищённые платформы для коммуникации внутри вашей организации',
      features: ['Шифрование данных', 'Видеоконференции', 'Файловый обмен', 'API интеграции']
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      ),
      title: 'CRM системы',
      description: 'Индивидуальные решения для управления взаимоотношениями с клиентами',
      features: ['Управление лидами', 'Аналитика продаж', 'Автоматизация', 'Отчётность']
    }
  ];

  return (
    <section className="services" id="services">
      <div className="section-header">
        <span className="section-label">Услуги</span>
        <h2 className="section-title">Что мы создаём</h2>
        <p className="section-desc">
          Полный цикл разработки цифровых продуктов для бизнеса любого масштаба
        </p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
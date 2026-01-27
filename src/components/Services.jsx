import { FontAwesomeIcon } from './FontAwesomeIcon';
import '../styles/Services.css';

export const Services = () => {
  const services = [
    {
      icon: 'laptop-code',
      title: 'Веб-разработка',
      description: 'Современные веб-приложения с отзывчивым дизайном и высокой производительностью',
      features: ['Корпоративные порталы', 'E-commerce решения', 'SaaS платформы', 'Progressive Web Apps']
    },
    {
      icon: 'comments',
      title: 'Корпоративные мессенджеры',
      description: 'Защищённые платформы для коммуникации внутри вашей организации',
      features: ['Шифрование данных', 'Видеоконференции', 'Файловый обмен', 'API интеграции']
    },
    {
      icon: 'chart-line',
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
            <div className="service-icon">
              <FontAwesomeIcon icon={service.icon} />
            </div>
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
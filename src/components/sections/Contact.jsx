import { FontAwesomeIcon } from './utils/FontAwesomeIcon';
import '../styles/Contact.css';

export const Contact = ({ id }) => {
  const contacts = [
    {
      icon: 'phone',
      title: 'Телефон',
      value: '+7 (495) 123-45-67'
    },
    {
      icon: 'envelope',
      title: 'Email',
      value: 'hello@relatelab.ru'
    },
    {
      icon: 'map-marker-alt',
      title: 'Офис',
      value: 'Москва, Пресненская наб. 12'
    },
    {
      icon: 'clock',
      title: 'Режим работы',
      value: 'Пн-Пт: 9:00 - 19:00'
    }
  ];

  return (
    <section className="contact" id={id || "contact"}>
      <div className="contact-grid">
        {contacts.map((contact, index) => (
          <div className="contact-card" key={index}>
            <div className="contact-icon">
              <FontAwesomeIcon icon={contact.icon} />
            </div>
            <div className="contact-info">
              <h4>{contact.title}</h4>
              <p>{contact.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
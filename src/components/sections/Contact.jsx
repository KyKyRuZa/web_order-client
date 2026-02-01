import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import '../../styles/Contact.css';

export const Contact = ({ id }) => {
  const contacts = [
    {
      icon: 'phone',
      title: 'Телефон',
      value: '+7 (987) 207-02-06'
    },
    {
      icon: 'envelope',
      title: 'Email',
      value: 'support@relatelab.ru'
    },
    {
      icon: 'map-marker-alt',
      title: 'Офис',
      value: 'Казань, Большая Красная улица, 42'
    },
    {
      icon: 'clock',
      title: 'Режим работы',
      value: 'Пн-Пт: 9:00 - 21:00'  
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
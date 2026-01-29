import PropTypes from 'prop-types';

export const FontAwesomeIcon = ({ icon, className, spin, ...props }) => {
  let iconClass;

  if (Array.isArray(icon)) {
    // Если передан массив [prefix, icon], например ['fas', 'home']
    iconClass = `${icon[0]} fa-${icon[1]}`;
  } else if (typeof icon === 'string') {
    // Если передана строка, добавляем префикс по умолчанию
    iconClass = `fas fa-${icon}`;
  } else {
    // Если передан другой формат, используем как есть
    iconClass = icon;
  }

  const spinClass = spin ? 'fa-spin' : '';
  const classes = `fa-icon ${spinClass} ${className || ''}`;

  return <i className={`${iconClass} ${classes}`} data-testid="fa-icon" {...props}></i>;
};

FontAwesomeIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
  spin: PropTypes.bool
};
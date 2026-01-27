import PropTypes from 'prop-types';

export const FontAwesomeIcon = ({ icon, className, ...props }) => {
  const iconClass = typeof icon === 'string' ? `fas fa-${icon}` : icon;
  const classes = `fa-icon ${className || ''}`;

  return <i className={`${iconClass} ${classes}`} {...props}></i>;
};

FontAwesomeIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string
};
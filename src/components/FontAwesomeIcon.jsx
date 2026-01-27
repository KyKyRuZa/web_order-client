import PropTypes from 'prop-types';

export const FontAwesomeIcon = ({ icon, className, spin, ...props }) => {
  const iconClass = typeof icon === 'string' ? `fas fa-${icon}` : icon;
  const spinClass = spin ? 'fa-spin' : '';
  const classes = `fa-icon ${spinClass} ${className || ''}`;

  return <i className={`${iconClass} ${classes}`} {...props}></i>;
};

FontAwesomeIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
  spin: PropTypes.bool
};
import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style = {},
  fullWidth = false,
  ...props
}) => {
  // Определяем стили в зависимости от варианта и размера
  const getBaseStyles = () => ({
    display: fullWidth ? 'flex' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: getPadding(),
    border: 'none',
    borderRadius: '8px',
    fontSize: getFontSize(),
    fontWeight: 500,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    minWidth: fullWidth ? '100%' : 'auto',
    width: fullWidth ? '100%' : 'auto',
    opacity: (disabled || isLoading) ? 0.6 : 1,
  });

  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent, #00d4aa)',
          color: 'var(--text-light, white)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-card-hover, #1a1a25)',
          color: 'var(--text-primary, #ffffff)',
          border: '1px solid var(--border, #2d2d3a)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger, #ff4757)',
          color: 'var(--text-light, white)',
        };
      default:
        return {
          backgroundColor: 'var(--accent, #00d4aa)',
          color: 'var(--text-light, white)',
        };
    }
  };

  const getHoverStyles = () => {
    if (disabled || isLoading) return {};

    switch(variant) {
      case 'primary':
        return {
          backgroundColor: '#00c09a',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-card, #12121a)',
          transform: 'translateY(-2px)',
        };
      case 'danger':
        return {
          backgroundColor: '#ff5252',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(255, 107, 129, 0.3)',
        };
      default:
        return {};
    }
  };

  const getPadding = () => {
    switch(size) {
      case 'sm':
        return '0.5rem 1rem';
      case 'lg':
        return '1rem 2rem';
      case 'md':
      default:
        return '0.75rem 1.5rem';
    }
  };

  const getFontSize = () => {
    switch(size) {
      case 'sm':
        return '0.875rem';
      case 'lg':
        return '1.125rem';
      case 'md':
      default:
        return '1rem';
    }
  };

  const buttonStyle = {
    ...getBaseStyles(),
    ...getVariantStyles(),
    ...style,
  };

  const hoverStyle = getHoverStyles();

  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  const finalStyle = {
    ...buttonStyle,
    ...(isHovered ? hoverStyle : {}),
  };

  return (
    <button
      type={type}
      style={finalStyle}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={16} style={{ width: '1rem', height: '1rem' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
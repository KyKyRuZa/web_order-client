import logo from '../../assets/logo.svg';
import '../../styles/Logo.css'

export const Logo = () => {
  return (
    <div className="logo">
      <img src={logo} alt="Relate Lab Logo" className="logo-image" />
      <span className="logo-text">RELATELAB</span>
    </div>
  );
};
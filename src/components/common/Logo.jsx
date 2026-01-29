export const Logo = () => {
  return (
    <div className="logo" >
      <svg viewBox="0 0 40 40">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#00a080" />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="2"
        />
        <circle cx="12" cy="16" r="4" fill="url(#logoGrad)" />
        <circle cx="28" cy="16" r="4" fill="url(#logoGrad)" />
        <circle cx="20" cy="28" r="4" fill="url(#logoGrad)" />
        <line
          x1="12"
          y1="16"
          x2="20"
          y2="28"
          stroke="url(#logoGrad)"
          strokeWidth="2"
        />
        <line
          x1="28"
          y1="16"
          x2="20"
          y2="28"
          stroke="url(#logoGrad)"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="16"
          x2="28"
          y2="16"
          stroke="url(#logoGrad)"
          strokeWidth="2"
        />
      </svg>
      <span className="logo-text">Relate Lab</span>
    </div>
  );
};
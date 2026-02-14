interface LogoMarkProps {
  size?: number
  className?: string
  opacity?: number
}

export function LogoMark({ size = 40, className = '', opacity = 1 }: LogoMarkProps) {
  const saffron = '#F59E0B'
  const green = '#138808'
  const navy = '#0A1024'

  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 48 36"
      fill="none"
      className={className}
      style={{ opacity }}
      aria-label="Saksham logo"
    >
      <defs>
        <linearGradient id="flagStroke" x1="0" y1="0" x2="48" y2="0">
          <stop offset="0%" stopColor={saffron} stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor={green} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="irisFill" x1="0" y1="0" x2="0" y2="48">
          <stop offset="0%" stopColor={navy} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0f1d4a" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d="M3 18c4.2-7 12.4-12 21-12s16.8 5 21 12c-4.2 7-12.4 12-21 12S7.2 25 3 18Z"
        stroke="url(#flagStroke)"
        strokeWidth="2.4"
        fill="url(#flagStroke)"
        fillOpacity="0.07"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="18" r="9" fill="url(#irisFill)" stroke="url(#flagStroke)" strokeWidth="1.8" />
      <path
        d="M15 18c0-5 4-9 9-9s9 4 9 9c0 5-4 9-9 9s-9-4-9-9Z"
        stroke="#f5f7ff"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <path
        d="M16 18.5h16M17.5 14c2.1 1.6 4.2 2.4 6.5 2.4 2.3 0 4.4-.8 6.5-2.4M17.5 23c2.1-1.6 4.2-2.4 6.5-2.4 2.3 0 4.4.8 6.5 2.4"
        stroke="#7fb8ff"
        strokeOpacity="0.65"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="24" cy="18" r="4.5" stroke="#9fd5ff" strokeWidth="1.2" fill="none" />
      <path
        d="M24 12.5c-.8 0-1.3 1.2-1.3 5.5 0 4.3.5 5.5 1.3 5.5s1.3-1.2 1.3-5.5c0-4.3-.5-5.5-1.3-5.5Z"
        stroke="#9fd5ff"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

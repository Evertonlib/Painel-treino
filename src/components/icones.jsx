const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export function IconeCronometro({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V9M9 3h6M12 3v2" />
    </svg>
  )
}

export function IconeHalter({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M6 9v6M4 10.5v3M18 9v6M20 10.5v3M8 12h8" />
    </svg>
  )
}

export function IconeSol({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function IconeLua({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

export function IconeAlerta({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10.5v4M12 17.5v.1" />
    </svg>
  )
}

export function IconeBandeira({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M5 3v18M5 4h13l-3 4 3 4H5" />
    </svg>
  )
}

export function IconeCalendario({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  )
}

export function IconeCaixaVazia({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M3.5 10 6 4h12l2.5 6M3.5 10v9a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-9M3.5 10h6l1 2h3l1-2h6" />
    </svg>
  )
}

export function IconeUpload({ className = 'h-4 w-4', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 15V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  )
}

export function IconePista({ className = 'h-6 w-6', ...props }) {
  return (
    <svg {...base} className={className} strokeWidth="2" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="6" />
      <path d="M9 6v12M15 6v12" strokeDasharray="1.5 2.5" />
    </svg>
  )
}

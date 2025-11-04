export function Logo() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <defs>
        <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#42A878", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#2D7A5C", stopOpacity: 1 }} />
        </linearGradient>

        <pattern id="batikPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="#F5F1E8" opacity="0.3" />
          <path d="M 5 5 L 15 15" stroke="#F5F1E8" strokeWidth="0.5" opacity="0.2" />
          <path d="M 15 5 L 5 15" stroke="#F5F1E8" strokeWidth="0.5" opacity="0.2" />
        </pattern>
      </defs>

      {/* Main plate circle */}
      <circle cx="100" cy="100" r="95" fill="url(#plateGradient)" stroke="#8B7355" strokeWidth="2" />

      {/* Batik pattern on plate */}
      <circle cx="100" cy="100" r="93" fill="url(#batikPattern)" />

      {/* Inner plate circle */}
      <circle cx="100" cy="100" r="80" fill="#F5F1E8" opacity="0.95" />

      {/* Clock hand representing "Waktu" (time) */}
      <g transform="translate(100, 100)">
        <line x1="0" y1="0" x2="0" y2="-45" stroke="#42A878" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="0" x2="35" y2="0" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />

        {/* Center circle */}
        <circle cx="0" cy="0" r="5" fill="#8B7355" />

        {/* Decorative rice grains */}
        <g fill="#42A878" opacity="0.7">
          <ellipse cx="0" cy="-28" rx="3" ry="8" transform="rotate(0)" />
          <ellipse cx="20" cy="-20" rx="3" ry="8" transform="rotate(45)" />
          <ellipse cx="28" cy="0" rx="3" ry="8" transform="rotate(90)" />
          <ellipse cx="20" cy="20" rx="3" ry="8" transform="rotate(135)" />
        </g>

        {/* Batik flower pattern */}
        <g fill="#8B7355" opacity="0.6">
          <circle cx="-35" cy="-35" r="2" />
          <circle cx="35" cy="-35" r="2" />
          <circle cx="-35" cy="35" r="2" />
          <circle cx="35" cy="35" r="2" />
        </g>
      </g>

      {/* Outer decorative ring */}
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#8B7355"
        strokeWidth="1"
        opacity="0.5"
        strokeDasharray="3,2"
      />
    </svg>
  )
}

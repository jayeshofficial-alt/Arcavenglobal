import React from 'react';

interface LogoProps {
  variant?: 'dark-bg' | 'light-bg';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark-bg',
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  const isDark = variant === 'dark-bg';
  
  const sizeMap = {
    sm: { height: 32, textScale: 'text-lg', subScale: 'text-[9px]' },
    md: { height: 42, textScale: 'text-2xl', subScale: 'text-[10px]' },
    lg: { height: 56, textScale: 'text-3xl', subScale: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Radiant Sun & Horizon Icon */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          height={currentSize.height}
          viewBox="0 0 160 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* Sun Core Gradient */}
            <linearGradient id="sunGrad" x1="80" y1="90" x2="80" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="50%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF4500" />
            </linearGradient>

            {/* Sun Glow / Rays Radial Gradient */}
            <radialGradient id="rayGlow" cx="80" cy="85" r="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF275" stopOpacity="1" />
              <stop offset="40%" stopColor="#FF9900" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF4D00" stopOpacity="0" />
            </radialGradient>

            {/* Horizon Arc Orange Gradient */}
            <linearGradient id="arcOrange" x1="0" y1="80" x2="160" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF9900" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FFAA00" />
              <stop offset="70%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FF7000" stopOpacity="0.2" />
            </linearGradient>

            {/* Sub Arc Blue Glow */}
            <linearGradient id="arcBlue" x1="20" y1="85" x2="140" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </linearGradient>

            <filter id="sunBlur" x="-10" y="-10" width="180" height="120" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Glow */}
          <circle cx="80" cy="82" r="50" fill="url(#rayGlow)" opacity="0.4" />

          {/* Semicircle Rising Sun */}
          <path
            d="M 25 82 A 55 55 0 0 1 135 82 Z"
            fill="url(#sunGrad)"
          />

          {/* Sunburst Rays */}
          <g opacity="0.95">
            {/* Center Ray */}
            <polygon points="80,82 78,14 82,14" fill="#FFE57F" />
            {/* Left Rays */}
            <polygon points="80,82 62,22 65,21" fill="#FFD54F" />
            <polygon points="80,82 46,36 50,34" fill="#FFCA28" />
            <polygon points="80,82 34,55 38,52" fill="#FFA726" />
            {/* Right Rays */}
            <polygon points="80,82 98,22 95,21" fill="#FFD54F" />
            <polygon points="80,82 114,36 110,34" fill="#FFCA28" />
            <polygon points="80,82 126,55 122,52" fill="#FFA726" />
          </g>

          {/* Brilliant Central Focal Flare */}
          <circle cx="80" cy="80" r="14" fill="#FFFBEB" filter="url(#sunBlur)" opacity="0.9" />
          <circle cx="80" cy="80" r="7" fill="#FFFFFF" />

          {/* Upper Orange Horizon Arc */}
          <path
            d="M 5 86 Q 80 50 155 86"
            stroke="url(#arcOrange)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle Lower Cyan/Blue Crescent Arc */}
          <path
            d="M 25 88 Q 80 62 135 88"
            stroke="url(#arcBlue)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className={`font-heading font-bold tracking-tight leading-none ${currentSize.textScale}`}>
          <span className="text-[#FF8C00]">Arcaven</span>
          <span className={isDark ? 'text-white' : 'text-[#001233]'}>global</span>
        </div>
        
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`font-medium tracking-wider uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'} ${currentSize.subScale}`}>
              Organic Food Export
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#2D5A27]" />
            <span className={`text-[9px] font-semibold text-[#2D5A27]`}>
              ISO 9001:2015
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';

interface EmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showMotto?: boolean;
  className?: string;
  variant?: 'gold' | 'monochrome' | 'navy' | 'light';
}

/**
 * Authentic State Emblem of India (Ashoka Lion Capital with "सत्यमेव जयते")
 * Formatted for official Indian Government web portals (GIGW 3.0 standard).
 */
export const NationalEmblem: React.FC<EmblemProps> = ({
  size = 'md',
  showMotto = true,
  className = '',
  variant = 'monochrome'
}) => {
  const sizeMap = {
    xs: 'w-6 h-8',
    sm: 'w-8 h-11',
    md: 'w-11 h-15',
    lg: 'w-14 h-19',
    xl: 'w-20 h-28'
  };

  const colorClass =
    variant === 'gold'
      ? 'text-amber-600'
      : variant === 'navy'
      ? 'text-[#0B2E59]'
      : variant === 'light'
      ? 'text-white'
      : 'text-slate-800 dark:text-slate-200';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 135"
        className={`${sizeMap[size]} ${colorClass} fill-current transition-colors`}
        aria-label="State Emblem of India - Ashoka Lion Capital"
      >
        {/* Crown of the Lions / Mane contours */}
        <g id="lions-group">
          {/* Central Lion Head */}
          <path d="M 50 4 C 44 4, 39 8, 38 14 C 37 17, 36 21, 38 25 C 40 29, 44 32, 50 32 C 56 32, 60 29, 62 25 C 64 21, 63 17, 62 14 C 61 8, 56 4, 50 4 Z" />
          {/* Facial features and nose */}
          <path d="M 48 13 L 52 13 L 51 20 L 49 20 Z" fill="#ffffff" opacity="0.3" />
          <circle cx="44" cy="15" r="1.6" fill="#ffffff" opacity="0.4" />
          <circle cx="56" cy="15" r="1.6" fill="#ffffff" opacity="0.4" />
          <path d="M 46 23 Q 50 26 54 23" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.4" />

          {/* Left Lion Profile */}
          <path d="M 37 14 C 32 15, 27 18, 25 24 C 23 30, 24 37, 28 42 C 32 46, 38 48, 41 47 C 39 42, 38 36, 38 31 C 37 25, 37 19, 37 14 Z" />
          <circle cx="29" cy="24" r="1.4" fill="#ffffff" opacity="0.4" />

          {/* Right Lion Profile */}
          <path d="M 63 14 C 68 15, 73 18, 75 24 C 77 30, 76 37, 72 42 C 68 46, 62 48, 59 47 C 61 42, 62 36, 62 31 C 63 25, 63 19, 63 14 Z" />
          <circle cx="71" cy="24" r="1.4" fill="#ffffff" opacity="0.4" />

          {/* Paws and muscular front chest */}
          <path d="M 41 33 C 39 37, 36 43, 35 50 C 37 54, 43 55, 45 52 C 45 46, 44 40, 43 35 Z" />
          <path d="M 59 33 C 61 37, 64 43, 65 50 C 63 54, 57 55, 55 52 C 55 46, 56 40, 57 35 Z" />
          <path d="M 46 34 L 54 34 L 53 52 L 47 52 Z" />
        </g>

        {/* The Circular Abacus (Base frieze) */}
        <g id="abacus-base" transform="translate(0, 56)">
          {/* Abacus frieze band */}
          <rect x="16" y="0" width="68" height="18" rx="2" />

          {/* Center Ashoka Chakra on Abacus */}
          <circle cx="50" cy="9" r="6.5" fill="#ffffff" opacity="0.25" />
          <circle cx="50" cy="9" r="6" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
          <circle cx="50" cy="9" r="1.5" fill="#ffffff" opacity="0.9" />
          {/* 8 spokes representation */}
          <line x1="50" y1="3.5" x2="50" y2="14.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="44.5" y1="9" x2="55.5" y2="9" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="46" y1="5" x2="54" y2="13" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="46" y1="13" x2="54" y2="5" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />

          {/* Galloping Horse (Left frieze) */}
          <path
            d="M 23 11 C 25 7, 29 8, 31 10 C 33 11, 33 14, 29 14 C 27 14, 25 15, 23 14 Z"
            fill="#ffffff"
            opacity="0.6"
          />

          {/* Indian Zebu Bull (Right frieze) */}
          <path
            d="M 77 11 C 75 7, 71 8, 69 10 C 67 11, 67 14, 71 14 C 73 14, 75 15, 77 14 Z"
            fill="#ffffff"
            opacity="0.6"
          />

          {/* Inverted Bell Lotus Foundation */}
          <path
            d="M 20 20 C 26 27, 36 32, 50 32 C 64 32, 74 27, 80 20 L 76 18 L 24 18 Z"
            opacity="0.9"
          />
          {/* Lotus petal fluting lines */}
          <line x1="50" y1="20" x2="50" y2="31" stroke="#ffffff" strokeWidth="0.9" opacity="0.3" />
          <line x1="40" y1="20" x2="43" y2="29" stroke="#ffffff" strokeWidth="0.9" opacity="0.3" />
          <line x1="60" y1="20" x2="57" y2="29" stroke="#ffffff" strokeWidth="0.9" opacity="0.3" />
          <line x1="30" y1="20" x2="35" y2="26" stroke="#ffffff" strokeWidth="0.9" opacity="0.3" />
          <line x1="70" y1="20" x2="65" y2="26" stroke="#ffffff" strokeWidth="0.9" opacity="0.3" />

          {/* Step pediment base line */}
          <rect x="22" y="33" width="56" height="3.5" rx="1" />
        </g>

        {/* National Motto: सत्यमेव जयते (Devanagari inscription below lotus) */}
        {showMotto && (
          <text
            x="50"
            y="114"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="bold"
            letterSpacing="0.8"
            fontFamily="'Tiro Devanagari Hindi', 'Rozha One', 'Noto Sans Devanagari', 'Segoe UI', sans-serif"
            className="fill-current"
          >
            सत्यमेव जयते
          </text>
        )}
      </svg>
    </div>
  );
};

/**
 * 24-Spoke Indian Ashoka Chakra SVG Wheel
 */
export const AshokaChakra: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className = 'text-[#000080]'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block ${className}`}
      aria-label="Ashoka Chakra"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
      {/* 24 Spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="7"
            stroke="currentColor"
            strokeWidth="2.8"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
    </svg>
  );
};

/**
 * Official Indian Tricolor Micro Band
 */
export const TirangaBar: React.FC<{ height?: string; withChakra?: boolean }> = ({
  height = 'h-1.5',
  withChakra = false
}) => {
  return (
    <div className={`w-full ${height} flex items-center relative overflow-hidden select-none`}>
      <div className="flex-1 h-full bg-[#FF9933]" title="Saffron / शौर्य एवं त्याग" />
      <div className="flex-1 h-full bg-[#FFFFFF] relative flex items-center justify-center">
        {withChakra && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AshokaChakra size={12} className="text-[#000080]" />
          </div>
        )}
      </div>
      <div className="flex-1 h-full bg-[#138808]" title="Green / समृद्धि एवं विश्वास" />
    </div>
  );
};

/**
 * Digital India Initiative Seal
 */
export const DigitalIndiaBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs ${className}`}
    title="Digital India - Power To Empower"
  >
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 via-blue-600 to-green-600 p-0.5 flex items-center justify-center">
      <span className="text-[9px] font-black text-white leading-none">DI</span>
    </div>
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
        Digital India
      </span>
      <span className="text-[8px] text-slate-500 font-medium">Power to Empower</span>
    </div>
  </div>
);

/**
 * Smart India Hackathon Seal
 */
export const SIHBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs ${className}`}
    title="Smart India Hackathon - World's Biggest Open Innovation Movement"
  >
    <div className="w-5 h-5 rounded bg-[#FF9933] text-white flex items-center justify-center font-black text-[10px] shadow-xs">
      SIH
    </div>
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] font-extrabold text-[#0B2E59] dark:text-amber-400 uppercase tracking-tight">
        SIH 2026
      </span>
      <span className="text-[8px] text-slate-500 font-medium">Smart Governance</span>
    </div>
  </div>
);

/**
 * MyGov / Meri Sarkar Initiative Seal
 */
export const MyGovBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-xs ${className}`}
    title="MyGov - Meri Sarkar"
  >
    <span className="text-[10px] font-black text-[#FF9933]">my</span>
    <span className="text-[10px] font-black text-[#0B2E59] dark:text-sky-400">Gov</span>
    <span className="text-[9px] font-semibold text-slate-400 ml-0.5">मेरी सरकार</span>
  </div>
);

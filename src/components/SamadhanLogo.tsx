import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
  preferImage?: boolean;
}

export const SamadhanLogo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
  dark = false,
  preferImage = false
}) => {
  const [imgError, setImgError] = useState(false);

  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isHero = size === 'hero';
  const isXl = size === 'xl';

  // If hero/xl or explicitly requested, show the authentic official brand lockup with emblem
  if ((isHero || isXl || preferImage) && !imgError) {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <div
          className={`relative flex items-center justify-center rounded-3xl bg-white shadow-md border border-slate-200/90 p-2 overflow-hidden transition-all hover:shadow-lg ${
            isXl ? 'w-32 h-32 sm:w-40 sm:h-40' : isHero ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16'
          }`}
        >
          <img
            src="/samadhan-logo.png"
            alt="समाधान SAMADHAN Logo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-baseline gap-2.5">
            <span
              className={`font-black tracking-tight text-[#073F68] ${
                isXl ? 'text-3xl sm:text-4xl' : isHero ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}
              style={{ fontFamily: "'Tiro Devanagari Hindi', 'Rozha One', 'Noto Sans Devanagari', sans-serif" }}
            >
              समाधान
            </span>
            <span className="text-[#F57A16] font-extrabold text-sm sm:text-base tracking-widest uppercase">
              — SAMADHAN —
            </span>
          </div>

          {showTagline && (
            <p
              className={`font-semibold tracking-wide text-[#087D70] mt-1 ${
                isXl ? 'text-sm sm:text-base' : isHero ? 'text-xs sm:text-sm' : 'text-xs'
              }`}
            >
              From Community Problems to Student Innovation
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title="समाधान — SAMADHAN (From Community Problems to Student Innovation)"
    >
      {/* Precision Vector Emblem Icon */}
      <div
        className={`relative flex-shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 transition-transform ${
          isSm ? 'w-9 h-9 p-1' : isLg ? 'w-14 h-14 p-1.5' : isHero ? 'w-20 h-20 p-2 shadow-md' : 'w-11 h-11 p-1.5'
        }`}
      >
        <img
          src="/samadhan-logo.png"
          alt="SAMADHAN Logo"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to SVG if image not loaded
            e.currentTarget.style.display = 'none';
          }}
          className="w-full h-full object-contain rounded-xl"
        />
        <svg viewBox="0 0 100 100" className="w-full h-full hidden">
          <defs>
            <linearGradient id="logoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F57A16" />
              <stop offset="100%" stopColor="#FF9933" />
            </linearGradient>
            <linearGradient id="logoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#087D70" />
              <stop offset="100%" stopColor="#159447" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2.5" />
          <path d="M 22 36 A 35 35 0 0 1 78 36" fill="none" stroke="url(#logoOrange)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 78 64 A 35 35 0 0 1 22 64" fill="none" stroke="url(#logoTeal)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="50" r="14" fill="#073F68" />
          <circle cx="50" cy="50" r="8" fill="#ffffff" />
          <circle cx="50" cy="50" r="4" fill="#F57A16" />
        </svg>
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-bold tracking-tight text-[#F57A16] ${
              isSm ? 'text-sm' : isLg ? 'text-xl' : isHero ? 'text-3xl' : 'text-base'
            }`}
            style={{ fontFamily: "'Tiro Devanagari Hindi', 'Rozha One', 'Noto Sans Devanagari', sans-serif" }}
          >
            समाधान
          </span>
          <span
            className={`font-extrabold tracking-wider ${dark ? 'text-white' : 'text-[#073F68]'} ${
              isSm ? 'text-base' : isLg ? 'text-2xl' : isHero ? 'text-4xl' : 'text-xl'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            SAMADHAN
          </span>
        </div>

        {showTagline && !isSm && (
          <span
            className={`font-semibold tracking-normal mt-1 ${
              dark ? 'text-slate-300' : 'text-[#087D70]'
            } ${isHero ? 'text-sm mt-2' : isLg ? 'text-xs' : 'text-[11px]'}`}
          >
            From Community Problems to Student Innovation
          </span>
        )}
      </div>
    </div>
  );
};

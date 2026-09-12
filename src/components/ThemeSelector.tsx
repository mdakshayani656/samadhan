import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Type, Check, ChevronDown } from 'lucide-react';
import {
  getTheme,
  toggleTheme,
  getFont,
  setFont,
  subscribeToTheme,
  AVAILABLE_FONTS,
  ThemeMode
} from '../lib/theme';

interface ThemeSelectorProps {
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const [theme, setLocalTheme] = useState<ThemeMode>(getTheme());
  const [activeFont, setActiveFont] = useState<string>(getFont());
  const [showFontMenu, setShowFontMenu] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribeToTheme((settings) => {
      setLocalTheme(settings.theme);
      setActiveFont(settings.font);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setShowFontMenu(false);
      }
    };
    if (showFontMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFontMenu]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const currentFontObj = AVAILABLE_FONTS.find((f) => f.id === activeFont) || AVAILABLE_FONTS[0];

  return (
    <div className="flex items-center gap-1 relative">
      {/* Light / Dark Mode Toggle Button */}
      <button
        onClick={handleToggleTheme}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        title={`Current mode: ${theme === 'dark' ? 'Dark' : 'Light'}. Click to switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode.`}
        aria-label={`Toggle theme (currently ${theme})`}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-180 duration-300" />
            <span className="hidden sm:inline text-[11px] font-medium text-amber-300">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-blue-300 animate-in spin-in-180 duration-300" />
            <span className="hidden sm:inline text-[11px] font-medium text-slate-300">Dark</span>
          </>
        )}
      </button>

      {/* Font Selector Dropdown Button */}
      <div className="relative" ref={fontMenuRef}>
        <button
          onClick={() => setShowFontMenu(!showFontMenu)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white shadow-sm"
          title={`Active Font: ${currentFontObj.name}. Click to change font.`}
          aria-label="Select typography font"
        >
          <Type className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline text-[11px] font-medium max-w-[70px] truncate text-slate-300">
            {currentFontObj.id === 'outfit' ? 'Outfit' : currentFontObj.name.split(' ')[0]}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Dropdown Menu */}
        {showFontMenu && (
          <div className="absolute right-0 mt-1 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
              Typography Font
            </div>
            {AVAILABLE_FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => {
                  setFont(font.id);
                  setShowFontMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                  activeFont === font.id
                    ? 'bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs">{font.name}</span>
                  <span className="text-[10px] text-slate-400" style={{ fontFamily: font.cssValue }}>
                    The quick brown fox
                  </span>
                </div>
                {activeFont === font.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

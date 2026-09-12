import React, { useState, useEffect } from 'react';
import {
  NationalEmblem,
  TirangaBar,
  DigitalIndiaBadge,
  SIHBadge,
  MyGovBadge
} from './NationalEmblem';
import {
  getTheme,
  toggleTheme,
  getFontSize,
  setFontSize,
  getLanguage,
  toggleLanguage,
  subscribeToTheme,
  FontSizeScale,
  PortalLanguage,
  ThemeMode
} from '../lib/theme';
import { Sun, Moon, Volume2, Globe, Eye, ArrowUpRight } from 'lucide-react';

interface GovAccessibilityHeaderProps {
  onSkipToContent?: () => void;
}

export const GovAccessibilityHeader: React.FC<GovAccessibilityHeaderProps> = ({
  onSkipToContent
}) => {
  const [theme, setLocalTheme] = useState<ThemeMode>(getTheme());
  const [fontSize, setLocalFontSize] = useState<FontSizeScale>(getFontSize());
  const [language, setLocalLanguage] = useState<PortalLanguage>(getLanguage());
  const [screenReaderActive, setScreenReaderActive] = useState(false);

  useEffect(() => {
    const unsub = subscribeToTheme((settings) => {
      setLocalTheme(settings.theme);
      setLocalFontSize(settings.fontSize);
      setLocalLanguage(settings.language);
    });
    return unsub;
  }, []);

  const handleFontSizeChange = (size: FontSizeScale) => {
    setFontSize(size);
  };

  const handleToggleLang = () => {
    toggleLanguage();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSkipToContent) {
      onSkipToContent();
    } else {
      const mainEl = document.getElementById('main-content') || document.querySelector('main');
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: 'smooth' });
        mainEl.focus();
      }
    }
  };

  const isHindi = language === 'hi';

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#07111D] text-slate-700 dark:text-slate-200 select-none text-[11px] border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Tiranga Tricolor Ribbon */}
      <TirangaBar height="h-1" withChakra={false} />

      {/* Official Government Accessibility Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government Masthead Entity */}
        <div className="flex items-center gap-2.5">
          <NationalEmblem size="xs" variant="monochrome" showMotto={false} className="opacity-90" />
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 dark:text-white">
              <span>{isHindi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                {isHindi ? 'Government of India' : 'भारत सरकार'}
              </span>
            </div>
            <span className="text-[10px] text-[#0B2E59] dark:text-amber-300 font-semibold">
              {isHindi
                ? 'आवासन और शहरी कार्य मंत्रालय | शिक्षा मंत्रालय'
                : 'Ministry of Housing & Urban Affairs • Ministry of Education'}
            </span>
          </div>
        </div>

        {/* Right: GIGW Accessibility Toolbar & Language Switcher */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Skip to Main Content */}
          <a
            href="#main-content"
            onClick={handleSkip}
            className="hidden md:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white underline underline-offset-2 transition-colors focus:ring-2 focus:ring-[#0B2E59] rounded px-1"
            title="Skip to Main Content / मुख्य सामग्री पर जाएं"
          >
            <span>{isHindi ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}</span>
          </a>

          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 hidden md:block" />

          {/* Screen Reader Access Helper */}
          <button
            onClick={() => setScreenReaderActive(!screenReaderActive)}
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors text-[10px] ${
              screenReaderActive
                ? 'bg-[#0B2E59] text-white font-bold'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
            }`}
            title="Screen Reader Access"
            aria-label="Screen Reader Access"
          >
            <Volume2 className="w-3 h-3 text-[#0B2E59] dark:text-amber-400" />
            <span className="hidden lg:inline">Screen Reader</span>
          </button>

          {/* Font Resizing Controls (A- / A / A+) */}
          <div
            className="inline-flex items-center rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-0.5 shadow-2xs"
            role="group"
            aria-label="Font Size Controls"
          >
            <button
              onClick={() => handleFontSizeChange('small')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                fontSize === 'small'
                  ? 'bg-[#0B2E59] text-white'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Decrease Font Size (A-)"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange('normal')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                fontSize === 'normal'
                  ? 'bg-[#0B2E59] text-white'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Standard Font Size (A)"
            >
              A
            </button>
            <button
              onClick={() => handleFontSizeChange('large')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                fontSize === 'large' || fontSize === 'larger'
                  ? 'bg-[#0B2E59] text-white'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
              title="Increase Font Size (A+)"
            >
              A+
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => toggleTheme()}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors text-[10px] shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle High Contrast or Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3 h-3 text-amber-500" />
                <span className="hidden lg:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-slate-700" />
                <span className="hidden lg:inline">Dark</span>
              </>
            )}
          </button>

          {/* Language Switcher (English / हिन्दी) */}
          <button
            onClick={handleToggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[11px] shadow-xs hover:brightness-105 transition-all cursor-pointer"
            title="Toggle Portal Language (English / हिन्दी)"
            aria-label="Change Language to English or Hindi"
          >
            <Globe className="w-3 h-3 text-slate-950" />
            <span>{isHindi ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

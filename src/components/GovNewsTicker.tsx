import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, ChevronLeft, Pause, Play } from 'lucide-react';
import { getLanguage } from '../lib/theme';

const NOTICES = [
  {
    id: 1,
    category: 'GAZETTE NOTIFICATION',
    textEn:
      'Under National Civic Innovation SOP 2026, Urban Local Bodies (ULBs) have completed Step-2 ground verification for 89.4% of logged civic issues.',
    textHi:
      'राष्ट्रीय नागरिक नवाचार मानक संचालन प्रक्रिया 2026 के अंतर्गत, नगर निकायों द्वारा 89.4% नागरिक समस्याओं का द्वितीय चरण जमीनी सत्यापन पूर्ण कर लिया गया है।'
  },
  {
    id: 2,
    category: 'AI ENGINE UPDATE',
    textEn:
      'AI Duplicate Suppression Active: 4,120 multi-citizen reports consolidated into actionable master challenge tickets without duplicate municipal overhead.',
    textHi:
      'एआई डुप्लिकेट समाधान सक्रिय: 4,120 नागरिक शिकायतों को बिना दोहराव के संयुक्त मास्टर चुनौती में सफलतापूर्वक समेकित किया गया।'
  },
  {
    id: 3,
    category: 'INNOVATION GRANTS',
    textEn:
      'District Municipal Grant Cell disbursed ₹4.85 Crore to 142 Collegiate Labs for physical prototyping under Smart Cities Mission.',
    textHi:
      'स्मार्ट सिटीज मिशन के तहत जिला नगर अनुदान प्रकोष्ठ द्वारा 142 कॉलेज प्रयोगशालाओं को ₹4.85 करोड़ की प्रोटोटाइपिंग राशि स्वीकृत की गई।'
  },
  {
    id: 4,
    category: 'CITIZEN ADVISORY',
    textEn:
      'Report potholes, contaminated water, and electrical faults with geo-tagged images. Resolution tracking is open to public audit under GIGW 3.0.',
    textHi:
      'सड़क गड्ढे, दूषित जल एवं विद्युत दोषों को जियो-टैग फोटो के साथ दर्ज करें। समाधान स्थिति जीआईजीडब्ल्यू 3.0 के तहत सार्वजनिक जांच हेतु उपलब्ध है।'
  }
];

export const GovNewsTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const lang = getLanguage();
  const isHi = lang === 'hi';

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTICES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeNotice = NOTICES[currentIndex];

  return (
    <div className="w-full bg-amber-50 dark:bg-[#0e1e33] border-b border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-1.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Urgent Label Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#E65100] text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
            <Bell className="w-3 h-3 animate-bounce" />
            <span>{isHi ? 'ताज़ा सूचना' : 'Official Notice'}</span>
          </span>
          <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-bold text-[9px] uppercase tracking-wider">
            {activeNotice.category}
          </span>
        </div>

        {/* Message Text */}
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-xs text-slate-800 dark:text-slate-100 font-medium">
            {isHi ? activeNotice.textHi : activeNotice.textEn}
          </p>
        </div>

        {/* Accessibility Ticker Controls (Pause / Prev / Next) */}
        <div className="flex items-center gap-1 flex-shrink-0 text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + NOTICES.length) % NOTICES.length)}
            className="p-0.5 hover:text-slate-900 dark:hover:text-white rounded hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
            title="Previous Bulletin"
            aria-label="Previous Notice"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-0.5 hover:text-slate-900 dark:hover:text-white rounded hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
            title={isPlaying ? 'Pause Auto-scroll' : 'Play Auto-scroll'}
            aria-label="Toggle Ticker Auto-scroll"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % NOTICES.length)}
            className="p-0.5 hover:text-slate-900 dark:hover:text-white rounded hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
            title="Next Bulletin"
            aria-label="Next Notice"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

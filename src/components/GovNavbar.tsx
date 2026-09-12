import React, { useState } from 'react';
import { NationalEmblem, DigitalIndiaBadge, SIHBadge, MyGovBadge } from './NationalEmblem';
import { SamadhanLogo } from './SamadhanLogo';
import { UserRole } from '../types';
import { getLanguage } from '../lib/theme';
import {
  PhoneCall,
  Menu,
  X,
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  FileText,
  Home,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface GovNavbarProps {
  currentRole?: UserRole | null;
  onSelectRole?: (role: UserRole) => void;
  onGoHome?: () => void;
  onOpenReport?: () => void;
  onOpenPublicCharter?: () => void;
  activeNavItem?: string;
}

export const GovNavbar: React.FC<GovNavbarProps> = ({
  currentRole,
  onSelectRole,
  onGoHome,
  onOpenReport,
  onOpenPublicCharter,
  activeNavItem = 'home'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lang = getLanguage();
  const isHi = lang === 'hi';

  const navLinks = [
    {
      id: 'home',
      labelEn: 'Home',
      labelHi: 'मुख्य पृष्ठ',
      icon: Home,
      action: onGoHome
    },
    {
      id: 'citizen',
      labelEn: 'Citizen Services',
      labelHi: 'नागरिक सेवाएं',
      icon: Users,
      badge: 'Lodge & Track',
      action: () => onSelectRole?.('citizen')
    },
    {
      id: 'government',
      labelEn: 'Administrative Verification',
      labelHi: 'प्रशासनिक सत्यापन',
      icon: ShieldCheck,
      badge: 'Step 2 SOP',
      action: () => onSelectRole?.('government')
    },
    {
      id: 'college',
      labelEn: 'Student Innovation Labs',
      labelHi: 'छात्र नवाचार',
      icon: GraduationCap,
      action: () => onSelectRole?.('college')
    },
    {
      id: 'industry',
      labelEn: 'Industry Technical Vetting',
      labelHi: 'उद्योग मूल्यांकन',
      icon: Building2,
      action: () => onSelectRole?.('industry')
    },
    {
      id: 'charter',
      labelEn: 'Citizen Charter & SLAs',
      labelHi: 'नागरिक घोषणापत्र',
      icon: FileText,
      action: onOpenPublicCharter
    }
  ];

  return (
    <nav className="w-full bg-white dark:bg-[#0c1626] border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40 transition-colors">
      {/* Primary Brand Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Left: National Emblem + SAMADHAN Brand Lockup */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#0B2E59] rounded-lg p-1 -m-1"
            title="Return to SAMADHAN National Portal Homepage"
          >
            {/* Authentic Lion Capital */}
            <div className="hidden xs:flex flex-col items-center justify-center pr-2 border-r border-slate-200 dark:border-slate-700">
              <NationalEmblem size="sm" variant="monochrome" showMotto={true} />
            </div>

            {/* SAMADHAN Emblem & Typography */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-1 flex items-center justify-center flex-shrink-0">
                <img
                  src="/samadhan-logo.png"
                  alt="SAMADHAN National Seal"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-bold text-base sm:text-xl text-[#F57A16] leading-none"
                    style={{ fontFamily: "'Tiro Devanagari Hindi', 'Rozha One', serif" }}
                  >
                    समाधान
                  </span>
                  <span className="font-extrabold text-base sm:text-xl text-[#0B2E59] dark:text-sky-300 leading-none tracking-wide">
                    SAMADHAN
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#087D70] dark:text-emerald-400 mt-1 line-clamp-1">
                  {isHi
                    ? 'राष्ट्रीय नागरिक समस्या निवारण एवं नवाचार मंच'
                    : 'National Civic Issue Redressal & Innovation Convergence Portal'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Smart India Hackathon • MoHUA & Ministry of Education Collaboration
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right: Official Government Partner Badges & Helpline */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Initiative Badges (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <DigitalIndiaBadge />
            <SIHBadge />
            <MyGovBadge />
          </div>

          {/* National Citizen Helpline Callout */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                {isHi ? 'नागरिक हेल्पलाइन' : 'Citizen Helpline'}
              </span>
              <span className="text-xs font-extrabold tracking-wide text-slate-900 dark:text-white">
                1913 / 1800-11-2026
              </span>
            </div>
          </div>

          {/* Quick Action Button: Lodge Grievance */}
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="px-3 sm:px-4 py-2 rounded-lg bg-[#E65100] hover:bg-[#D84315] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isHi ? 'समस्या दर्ज करें' : 'Lodge Problem'}</span>
              <span className="hidden md:inline text-xs font-normal opacity-80">(Free)</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Official Government Navigation Strip */}
      <div className="hidden md:block bg-[#F1F5F9] dark:bg-[#0c1a2d] text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`px-3.5 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-all relative border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-[#0B2E59] dark:text-amber-300 border-[#0B2E59] dark:border-amber-400 bg-white dark:bg-slate-800 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#0B2E59] dark:hover:text-white border-transparent hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isHi ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[9px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-600/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {isHi ? 'अखिल भारतीय नागरिक ग्रिड सक्रिय' : 'National Civic Grid Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0c1a2d] text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.action?.();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-[#0B2E59] dark:text-amber-300 border border-amber-300 dark:border-amber-500 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{isHi ? item.labelHi : item.labelEn}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/20 text-slate-800 dark:text-white text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Toll-Free Helpline: 1800-11-2026</span>
            <span className="text-[#087D70] dark:text-amber-300 font-bold">GIGW Compliant</span>
          </div>
        </div>
      )}
    </nav>
  );
};

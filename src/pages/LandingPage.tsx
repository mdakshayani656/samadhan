import React, { useState, useEffect } from 'react';
import { GovNavbar } from '../components/GovNavbar';
import { GovNewsTicker } from '../components/GovNewsTicker';
import { GovFooter } from '../components/GovFooter';
import {
  NationalEmblem,
  AshokaChakra,
  TirangaBar,
  DigitalIndiaBadge,
  SIHBadge,
  MyGovBadge
} from '../components/NationalEmblem';
import { OfficialVerificationSeal } from '../components/OfficialVerificationSeal';
import { CitizenCharterModal } from '../components/CitizenCharterModal';
import { OfficialCircularsModal } from '../components/OfficialCircularsModal';
import { UserRole } from '../types';
import { DEMO_CREDENTIALS, setCurrentUser, loadDatabase } from '../data/storage';
import { getLanguage, subscribeToTheme } from '../lib/theme';
import {
  Users,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  Award,
  Lock,
  Mail,
  Shield,
  KeyRound,
  ExternalLink,
  Bot,
  FileText,
  PhoneCall,
  Search,
  BadgeAlert,
  AlertCircle,
  BarChart3,
  IndianRupee,
  Calendar
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole?: (role: UserRole) => void;
  onLoginSuccess?: (role: UserRole) => void;
  onExploreAllRoles?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onLoginSuccess,
  onExploreAllRoles
}) => {
  // Single Sign-On Role Tab State
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.citizen.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.citizen.pass);
  const [captchaAnswer, setCaptchaAnswer] = useState('7');
  const [captchaInput, setCaptchaInput] = useState('7');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals state
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isCircularsOpen, setIsCircularsOpen] = useState(false);

  // Language state
  const [lang, setLang] = useState(getLanguage());
  useEffect(() => {
    const unsub = subscribeToTheme((s) => setLang(s.language));
    return unsub;
  }, []);
  const isHi = lang === 'hi';

  // Live Database Metrics
  const db = loadDatabase();
  const totalProblems = db.problems.length;
  const duplicateSuppressed = db.problems.reduce(
    (acc, p) => acc + (p.additionalReports ? p.additionalReports.length : p.duplicate ? 1 : 0),
    0
  );
  const verifiedCount = db.problems.filter((p) => p.verified).length;
  const inDevelopmentCount = db.problems.filter(
    (p) => p.solutionSubmitted || p.prototypeFinalized || p.status === 'Implementation'
  ).length;
  const solvedCount = db.problems.filter((p) => p.status === 'Problem Solved').length;
  const totalFunding = db.problems.reduce(
    (acc, p) => (p.fundingApproved && p.fundingAmount ? acc + p.fundingAmount : acc),
    0
  );

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].pass);
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const cred = DEMO_CREDENTIALS[selectedRole];
      if (email.trim().toLowerCase() === cred.email.toLowerCase() && password === cred.pass) {
        setCurrentUser({
          role: selectedRole,
          email: cred.email,
          name: cred.name,
          organization: cred.org
        });
        setLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(selectedRole);
        }
      } else {
        setLoading(false);
        setError(
          `Invalid official credentials. Please use official email: ${cred.email} and pass: ${cred.pass}`
        );
      }
    }, 200);
  };

  const handle1ClickLogin = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentUser({
      role: role,
      email: cred.email,
      name: cred.name,
      organization: cred.org
    });
    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
  };

  const operationalStages = [
    {
      stage: '01',
      titleEn: 'Citizen Grievance',
      titleHi: 'नागरिक समस्या',
      descEn: 'Geo-tagged photographic reporting with ward mapping.',
      descHi: 'जियो-टैग्ड फोटो एवं वार्ड के साथ पंजीकरण।',
      sla: 'Immediate',
      authority: 'Citizen',
      icon: Users,
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
    },
    {
      stage: '02',
      titleEn: 'AI Deduplication',
      titleHi: 'एआई समेकन',
      descEn: 'Semantic clustering into unified civic challenges.',
      descHi: 'समान समस्याओं का स्वतः समेकन।',
      sla: '< 3s',
      authority: 'NIC AI',
      icon: Bot,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
    },
    {
      stage: '03',
      titleEn: 'ULB Ground Audit',
      titleHi: 'भौतिक सत्यापन',
      descEn: 'Mandatory 48-hr on-site physical inspection by nodal officers.',
      descHi: '48 घंटे में जमीनी भौतिक सत्यापन।',
      sla: '48 Hours',
      authority: 'ULB Officer',
      icon: ShieldCheck,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    },
    {
      stage: '04',
      titleEn: 'Lab Prototyping',
      titleHi: 'छात्र प्रोटोटाइप',
      descEn: 'Student engineering labs build working functional solutions.',
      descHi: 'इंजीनियरिंग टीमों द्वारा प्रोटोटाइप निर्माण।',
      sla: '14 Days',
      authority: 'Student Lab',
      icon: GraduationCap,
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      stage: '05',
      titleEn: 'Industry Vetting',
      titleHi: 'उद्योग मूल्यांकन',
      descEn: 'Corporate R&D mentors review safety and query revisions.',
      descHi: 'उद्योग विशेषज्ञों द्वारा तकनीकी जांच एवं सुझाव।',
      sla: '7 Days',
      authority: 'Industry R&D',
      icon: Building2,
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
    },
    {
      stage: '06',
      titleEn: 'Municipal Grant',
      titleHi: 'अनुदान स्वीकृति',
      descEn: 'Treasury funds sanctioned for live field deployment.',
      descHi: 'जमीनी क्रियान्वयन हेतु बजट स्वीकृति।',
      sla: 'Sanctioned',
      authority: 'Municipal Wing',
      icon: CheckCircle2,
      badgeColor: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F4F6F9] dark:bg-[#070f1a] text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* Global Background Logo Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.04] select-none">
        <img
          src="/samadhan-logo.png"
          alt=""
          aria-hidden="true"
          className="w-[750px] max-w-none object-contain"
        />
      </div>

      {/* Official Government Navigation Bar */}
      <GovNavbar
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSelectRole={onSelectRole}
        onOpenReport={() => onSelectRole?.('citizen')}
        onOpenPublicCharter={() => setIsCharterOpen(true)}
      />

      {/* Official Ministry Gazette Ticker */}
      <GovNewsTicker />

      {/* Hero Section: Official National Masthead & Digital India Initiative Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F4F8FC] to-[#EAF2F8] dark:bg-gradient-to-b dark:from-[#0b1b30] dark:via-[#071526] dark:to-[#050f1c] text-slate-900 dark:text-white border-b-4 border-[#087D70] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 shadow-xs">
        {/* Prominent SAMADHAN Logo Watermark in Hero */}
        <div className="absolute right-[-20px] sm:right-8 lg:right-20 top-1/2 -translate-y-1/2 opacity-[0.11] dark:opacity-[0.14] pointer-events-none select-none z-0">
          <img
            src="/samadhan-logo.png"
            alt=""
            aria-hidden="true"
            className="w-[320px] sm:w-[460px] lg:w-[560px] max-w-none object-contain drop-shadow-sm"
          />
        </div>

        {/* Subtle Ashoka Chakra watermark background */}
        <div className="absolute left-[-40px] top-[-30px] opacity-[0.05] pointer-events-none text-[#0B2E59] dark:text-white">
          <AshokaChakra size={300} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Official Government Mandate & Vision */}
          <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
            {/* National Motto & Ministry Identification */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800/80 border border-amber-300 dark:border-amber-500/30 shadow-2xs text-xs">
              <span className="font-extrabold text-[#D84315] dark:text-amber-400 tracking-wider">सत्यमेव जयते</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">
                NUDM • MoHUA & MoE
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {isHi ? (
                  <span>
                    नागरिक समस्याएं • <span className="text-[#0B2E59] dark:text-amber-400">छात्र नवाचार</span>
                  </span>
                ) : (
                  <span>
                    Civic Problems to <br />
                    <span className="text-[#0B2E59] dark:text-amber-400">Student Innovation</span>
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
                {isHi
                  ? 'सत्यापित नागरिक समस्याओं का कॉलेज प्रयोगशालाओं द्वारा समाधान एवं सरकारी अनुदान।'
                  : 'Verified community challenges engineered by student innovation labs and funded by municipalities.'}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onSelectRole?.('citizen')}
                className="px-4 py-2.5 rounded-lg bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isHi ? 'शिकायत दर्ज करें' : 'Lodge Grievance'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCharterOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#E65100] dark:text-amber-400" />
                <span>{isHi ? 'नागरिक घोषणापत्र' : 'Citizen Charter'}</span>
              </button>

              <button
                onClick={() => setIsCircularsOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#087D70] dark:text-emerald-400" />
                <span>{isHi ? 'परिपत्र' : 'Circulars'}</span>
              </button>
            </div>

            {/* Statutory Compliance Indicator */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087D70] dark:text-emerald-400" />
                <span>GIGW 3.0</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087D70] dark:text-emerald-400" />
                <span>RTI Act</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087D70] dark:text-emerald-400" />
                <span>Zero Duplication</span>
              </div>
            </div>
          </div>

          {/* Right Column: Jan Parichay / Meri Pehchaan Style Single Sign-On (SSO) Card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
              {/* SSO Official Masthead */}
              <div className="bg-[#EBF3FB] dark:bg-[#0c1e36] text-slate-900 dark:text-white p-3.5 sm:p-4 border-b-2 border-[#0B2E59] dark:border-amber-400 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <NationalEmblem size="xs" variant="monochrome" showMotto={false} />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#0B2E59] dark:text-amber-300 font-black block">
                      NATIONAL SINGLE SIGN-ON (SSO)
                    </span>
                    <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                      {isHi ? 'अधिकारी एवं हितधारक लॉगिन' : 'Stakeholder Login'}
                    </h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-400/20 text-[#0B2E59] dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-black text-[10px] uppercase tracking-wider">
                  Verified
                </span>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('citizen')}
                  className={`py-2.5 px-1 text-center transition-all border-b-2 ${
                    selectedRole === 'citizen'
                      ? 'border-[#E65100] text-[#E65100] dark:text-orange-400 bg-white dark:bg-slate-900 font-extrabold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="block text-[11px] sm:text-xs">Citizen</span>
                  <span className="text-[9px] font-normal text-slate-400">नागरिक</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTabChange('government')}
                  className={`py-2.5 px-1 text-center transition-all border-b-2 ${
                    selectedRole === 'government'
                      ? 'border-[#0B2E59] text-[#0B2E59] dark:text-sky-400 bg-white dark:bg-slate-900 font-extrabold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="block text-[11px] sm:text-xs">Officer</span>
                  <span className="text-[9px] font-normal text-slate-400">प्रशासन</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTabChange('college')}
                  className={`py-2.5 px-1 text-center transition-all border-b-2 ${
                    selectedRole === 'college'
                      ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-white dark:bg-slate-900 font-extrabold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="block text-[11px] sm:text-xs">Lab</span>
                  <span className="text-[9px] font-normal text-slate-400">कॉलेज</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTabChange('industry')}
                  className={`py-2.5 px-1 text-center transition-all border-b-2 ${
                    selectedRole === 'industry'
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 font-extrabold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span className="block text-[11px] sm:text-xs">Industry</span>
                  <span className="text-[9px] font-normal text-slate-400">उद्योग</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="p-4 sm:p-5 space-y-3">
                {/* Active Role Card Preview */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {DEMO_CREDENTIALS[selectedRole].name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {DEMO_CREDENTIALS[selectedRole].org}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handle1ClickLogin(selectedRole)}
                    className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Bypass form and login directly"
                  >
                    <span>1-Click Enter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {error && (
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email / Jan Parichay ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-[#0B2E59] outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-[#0B2E59] outline-none"
                    />
                  </div>
                </div>

                {/* Statutory Captcha Simulation */}
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    Captcha: 4 + 3 = ?
                  </span>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center font-bold text-xs"
                  />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Verified
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#0B2E59] hover:bg-[#071C35] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* National Civic Redressal Statistics Board (NIC Live Grid) */}
      <section className="bg-white dark:bg-[#0a1526] border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 shadow-xs relative overflow-hidden">
        {/* Subtle Watermark in Metrics Section */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] dark:opacity-[0.05] pointer-events-none select-none z-0">
          <img src="/samadhan-logo.png" alt="" aria-hidden="true" className="w-[360px] object-contain" />
        </div>

        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
                {isHi ? 'नागरिक निवारण एवं नवाचार आंकड़े' : 'Live Redressal & Innovation Metrics'}
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              National Municipal Database • Live Sync
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Card 1 */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Total Grievances
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#0B2E59] dark:text-sky-400">
                {totalProblems + 412}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Across 48 ULBs</span>
            </div>

            {/* Card 2 */}
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-left">
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-sky-300 block">
                Duplicates Merged
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-800 dark:text-sky-400">
                {duplicateSuppressed + 28}
              </span>
              <span className="text-[9px] text-blue-600/80 dark:text-blue-400 block mt-0.5">
                AI Clustered
              </span>
            </div>

            {/* Card 3 */}
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                ULB Verified
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400">
                {verifiedCount}
              </span>
              <span className="text-[9px] text-emerald-600/80 dark:text-emerald-400 block mt-0.5">
                On-Site Inspected
              </span>
            </div>

            {/* Card 4 */}
            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-left">
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
                Lab Prototypes
              </span>
              <span className="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-400">
                {inDevelopmentCount + 14}
              </span>
              <span className="text-[9px] text-purple-600/80 dark:text-purple-400 block mt-0.5">
                Active Teams
              </span>
            </div>

            {/* Card 5 */}
            <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-left">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">
                Grants Sanctioned
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-400">
                ₹{(totalFunding / 100000 + 4.85).toFixed(2)} Cr
              </span>
              <span className="text-[9px] text-amber-600/80 dark:text-amber-400 block mt-0.5">
                Fund Disbursed
              </span>
            </div>

            {/* Card 6 */}
            <div className="p-3 rounded-xl border border-green-200 dark:border-green-900/60 bg-green-50/40 dark:bg-green-950/20 text-left">
              <span className="text-[10px] uppercase font-bold text-green-700 dark:text-green-300 block">
                Field Resolved
              </span>
              <span className="text-xl sm:text-2xl font-black text-green-800 dark:text-green-400">
                {solvedCount + 89}
              </span>
              <span className="text-[9px] text-green-600/80 dark:text-green-400 block mt-0.5">
                Audited & Closed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Standard Operating Procedure (SOP) Section */}
      <section className="relative overflow-hidden py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle SAMADHAN Logo Watermark in SOP Section */}
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 opacity-[0.04] dark:opacity-[0.07] pointer-events-none select-none z-0">
          <img
            src="/samadhan-logo.png"
            alt=""
            aria-hidden="true"
            className="w-[480px] max-w-none object-contain"
          />
        </div>

        <div className="space-y-2 text-center max-w-2xl mx-auto mb-8 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B2E59] dark:text-amber-400">
            SOP • 6-STAGE WORKFLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHi ? '6-चरणीय समाधान प्रक्रिया' : 'Civic-to-Innovation Lifecycle'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isHi
              ? 'नागरिक रिपोर्ट से लेकर नगर निकाय सत्यापन और कॉलेज प्रोटोटाइप का चरणबद्ध प्रवाह।'
              : 'Audited municipal verification, collegiate lab allocation, and real-world deployment.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {operationalStages.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.stage}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0B2E59] dark:hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400 font-mono">
                      STAGE {st.stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${st.badgeColor}`}>
                      SLA: {st.sla}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0B2E59] dark:text-sky-300 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {isHi ? st.titleHi : st.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isHi ? st.descHi : st.descEn}
                  </p>
                </div>

                <div className="pt-3 mt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Nodal:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {st.authority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Government Verification & Gazette Orders Showcase */}
      <section className="bg-slate-100/70 dark:bg-[#091424] border-y border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B2E59] dark:text-amber-400 block">
                OFFICIAL CERTIFICATION
              </span>
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                {isHi ? 'नगर निकाय सत्यापन प्रमाण' : 'Municipal Field Audit Certification'}
              </h2>
            </div>
            <button
              onClick={() => setIsCircularsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#0B2E59] text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Gazette Orders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OfficialVerificationSeal
              status="verified"
              officerName="Shri Rajesh Verma, IAS"
              department="Municipal Engineering & Public Works"
              referenceNo="GOI/MOHUA/2026/SOP-STEP2-089"
              date="10-SEP-2026"
            />
            <OfficialVerificationSeal
              status="funded"
              officerName="Dr. Sunita Murthy"
              department="District Municipal Innovation Grant Cell"
              referenceNo="GOI/AICTE/SIH/2026/GRANT-042"
              date="08-SEP-2026"
            />
            <OfficialVerificationSeal
              status="solved"
              officerName="Shri Amit Deshmukh"
              department="Urban Infrastructure Quality Commission"
              referenceNo="GOI/ULB/SOLVED/2026/FIELD-014"
              date="05-SEP-2026"
            />
          </div>
        </div>
      </section>

      {/* Official Modals */}
      <CitizenCharterModal isOpen={isCharterOpen} onClose={() => setIsCharterOpen(false)} />
      <OfficialCircularsModal
        isOpen={isCircularsOpen}
        onClose={() => setIsCircularsOpen(false)}
      />

      {/* Official Government Footer */}
      <GovFooter />
    </div>
  );
};

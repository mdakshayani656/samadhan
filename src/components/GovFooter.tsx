import React from 'react';
import { NationalEmblem, AshokaChakra, TirangaBar } from './NationalEmblem';
import { ExternalLink, ShieldCheck, CheckCircle, Mail, Phone, MapPin, Award } from 'lucide-react';
import { getLanguage } from '../lib/theme';

export const GovFooter: React.FC = () => {
  const lang = getLanguage();
  const isHi = lang === 'hi';

  return (
    <footer className="w-full bg-[#F1F5F9] dark:bg-[#071324] text-slate-700 dark:text-slate-300 text-xs border-t-4 border-[#FF9933] select-none transition-colors">
      {/* Top Banner with Ministries & National Crest */}
      <div className="border-b border-slate-300/80 dark:border-slate-800 bg-[#E8EEF5] dark:bg-[#0a1b33] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <NationalEmblem size="sm" variant="monochrome" showMotto={true} />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide">
                {isHi
                  ? 'समाधान — राष्ट्रीय नागरिक समस्या निवारण मंच'
                  : 'SAMADHAN — National Civic Issue Redressal & Innovation Convergence Portal'}
              </span>
              <span className="text-xs text-[#0B2E59] dark:text-amber-300 font-bold mt-0.5">
                {isHi
                  ? 'आवासन और शहरी कार्य मंत्रालय एवं शिक्षा मंत्रालय, भारत सरकार'
                  : 'Ministry of Housing & Urban Affairs & Ministry of Education, Government of India'}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">
                In collaboration with Smart India Hackathon (SIH 2026) & National Informatics Centre (NIC)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Grievance SLA</span>
              <span className="text-xs font-black text-[#E65100] dark:text-amber-400">48-Hr Ground Audit</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Audit Standard</span>
              <span className="text-xs font-black text-[#087D70] dark:text-emerald-400">GIGW 3.0 Certified</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Helpline</span>
              <span className="text-xs font-black text-[#0B2E59] dark:text-sky-300">1913 / 1800-11-2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Structured Directory (GIGW 3.0 Mandatory) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Government Initiatives */}
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase border-b-2 border-[#FF9933] pb-2 mb-3">
            {isHi ? 'सरकारी पोर्टल एवं पहल' : 'National Portals & Links'}
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-medium">
            <li>
              <a
                href="https://www.india.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B2E59] dark:hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>National Portal of India (india.gov.in)</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="https://www.mygov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B2E59] dark:hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>MyGov — Citizen Engagement</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="https://www.digitalindia.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B2E59] dark:hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>Digital India Programme</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="https://sih.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B2E59] dark:hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>Smart India Hackathon (SIH 2026)</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0B2E59] dark:hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>Open Government Data (data.gov.in)</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 2: Legal & Statutory Framework */}
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase border-b-2 border-[#FF9933] pb-2 mb-3">
            {isHi ? 'कानूनी एवं प्रशासनिक ढांचा' : 'Governance & Rights'}
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-medium">
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Right to Information (RTI Act 2005)
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Digital Personal Data Protection Act 2023
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Citizen Charter & Redressal Timeline
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              CPGRAMS Central Grievance Portal
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Municipal Innovation Grant Sanction Rules
            </li>
          </ul>
        </div>

        {/* Col 3: Official Policies (GIGW Mandatory) */}
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase border-b-2 border-[#FF9933] pb-2 mb-3">
            {isHi ? 'वेबसाइट नीतियां' : 'Website Policies'}
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-medium">
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Website Policies & Compliance (GIGW 3.0)
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Hyperlinking Policy
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Privacy & Security Policy
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Copyright Policy
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Terms of Use & Disclaimer
            </li>
            <li className="hover:text-[#0B2E59] dark:hover:text-amber-300 cursor-pointer">
              Accessibility Statement (WCAG 2.1 AA)
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Nodal Web Information Manager */}
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase border-b-2 border-[#FF9933] pb-2 mb-3">
            {isHi ? 'नोडल संपर्क एवं सहायता' : 'Web Information Manager'}
          </h4>
          <div className="space-y-2.5 text-slate-600 dark:text-slate-300 text-xs font-medium">
            <p className="font-bold text-slate-900 dark:text-white">
              Directorate of Civic Innovation & Technology
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E65100] mt-0.5 flex-shrink-0" />
              <span>Nirman Bhawan, Maulana Azad Road, New Delhi — 110011</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#087D70] flex-shrink-0" />
              <span>grievance-samadhan@nic.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#0B2E59] flex-shrink-0" />
              <span>National Citizen Toll Free: 1800-11-2026</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Technical Host: National Informatics Centre (NIC)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Attribution Bar */}
      <div className="border-t border-slate-300 dark:border-slate-800 bg-[#E2E8F0] dark:bg-[#060e1a] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex flex-col text-center md:text-left">
            <p className="text-slate-800 dark:text-slate-300 font-semibold">
              © {new Date().getFullYear()} National Civic Technology Mission, Ministry of Housing and Urban Affairs & Ministry of Education.
            </p>
            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
              Portal Designed, Developed and Hosted by{' '}
              <strong className="text-slate-900 dark:text-white">National Informatics Centre (NIC)</strong>, Government of India.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-center md:text-right font-medium">
            <span>Last Reviewed & Updated: <strong>10 September 2026</strong></span>
            <span>•</span>
            <span>Portal Version: <strong>3.4.2 (GIGW 3.0)</strong></span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#0B2E59] dark:text-amber-300 font-mono text-[10px] font-bold shadow-2xs">
              Total Portal Hits: 1,894,210
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

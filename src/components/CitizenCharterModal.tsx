import React from 'react';
import { X, FileText, Download, CheckCircle2, Shield, Printer, ExternalLink } from 'lucide-react';
import { NationalEmblem } from './NationalEmblem';
import { getLanguage } from '../lib/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenCharterModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const lang = getLanguage();
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Official Header */}
        <div className="bg-[#0B2E59] text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <NationalEmblem size="xs" variant="light" showMotto={false} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                GOVERNMENT OF INDIA • CITIZEN CHARTER
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isHi ? 'नागरिक घोषणापत्र एवं सेवा स्तर समझौता (SLA)' : 'Citizen Charter & Service Level Agreements (SLAs)'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Gazette Preamble */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <h4 className="font-extrabold text-[#0B2E59] dark:text-amber-300 text-sm mb-1">
              {isHi ? 'नागरिक अधिकार एवं सेवा प्रतिबद्धता' : 'Public Commitment to Transparent Civic Redressal'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Under the National Urban Innovation Framework, every citizen has the statutory right to a verified, time-bound response. AI duplicate merging ensures civic issues gain collective priority without administrative clutter.
            </p>
          </div>

          {/* SLA Table */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-3">
              Standard Operating Timelines (SOP SLAs)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold">
                  <tr>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Stage / चरण</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Action Required</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Statutory SLA</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Nodal Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold">Stage 01 & 02</td>
                    <td className="p-3">AI Duplicate Check & Master Ticket Consolidation</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Real-time (&lt; 3 Sec)</td>
                    <td className="p-3">Automated AI Civic Engine</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Stage 03</td>
                    <td className="p-3">Step-2 Physical On-Site Verification</td>
                    <td className="p-3 text-blue-700 dark:text-sky-400 font-bold">Within 48 Hours</td>
                    <td className="p-3">ULB Assistant Municipal Commissioner</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Stage 04 & 05</td>
                    <td className="p-3">Geo-Alert to Nearby Colleges & Prototype Build</td>
                    <td className="p-3 text-purple-700 dark:text-purple-400 font-bold">14 Days</td>
                    <td className="p-3">Collegiate Lab R&D Deans</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Stage 06 & 07</td>
                    <td className="p-3">Industry Technical Vetting & Grant Disbursal</td>
                    <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">7 Days</td>
                    <td className="p-3">Industry Council & District Collector</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Stage 08</td>
                    <td className="p-3">Ground Implementation & Public Photo Proof</td>
                    <td className="p-3 text-green-700 dark:text-green-400 font-bold">As per Engineering Scope</td>
                    <td className="p-3">Municipal Execution Wing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Grievance Escalation Hierarchy */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Appellate Redressal Hierarchy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Level 1 — Ward Officer</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Initial inspection, ground audit within 48 hours.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Level 2 — Municipal Commissioner</span>
                <span className="text-[11px] text-slate-500 mt-1 block">First appellate authority for delays beyond SLA.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Level 3 — MoHUA CPGRAMS</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Central Ministry Oversight & Digital Audit Cell.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Certified compliant with GIGW 3.0 & RTI Act Section 4(1)(b)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0B2E59] text-white font-bold rounded-lg text-xs hover:bg-[#071C35] transition-colors"
          >
            Close Charter
          </button>
        </div>
      </div>
    </div>
  );
};

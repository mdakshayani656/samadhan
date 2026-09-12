import React from 'react';
import { X, FileText, Download, CheckCircle2, Shield, Calendar, Building } from 'lucide-react';
import { NationalEmblem } from './NationalEmblem';
import { getLanguage } from '../lib/theme';

interface CircularsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

const CIRCULARS = [
  {
    id: 'sop-01',
    refNo: 'F.No. MoHUA/NUIF/2026/SOP-01',
    titleEn: 'Standard Operating Procedure for Step-2 Municipal Ground Inspections',
    titleHi: 'द्वितीय चरण नगर निकाय भौतिक सत्यापन हेतु मानक संचालन प्रक्रिया (एसओपी)',
    date: '15 January 2026',
    ministry: 'Ministry of Housing & Urban Affairs',
    description:
      'Mandatory guidelines for Urban Local Body (ULB) Nodal Officers for on-site verification of citizen complaints prior to collegiate challenge activation. Establishes 48-hour SLA.'
  },
  {
    id: 'sih-04',
    refNo: 'F.No. AICTE/SIH/2026/GRANT-04',
    titleEn: 'Collegiate Civic Innovation Lab Grant Disbursal Framework',
    titleHi: 'कॉलेज नागरिक नवाचार लैब अनुदान आवंटन दिशा-निर्देश',
    date: '02 February 2026',
    ministry: 'Ministry of Education & Smart India Hackathon',
    description:
      'Sanction rules governing allocation of up to ₹5,00,000 in prototyping seed grants for student multidisciplinary teams solving verified municipal issues.'
  },
  {
    id: 'ai-09',
    refNo: 'F.No. NIC/CIVIC/2026/DATA-09',
    titleEn: 'AI Deduplication & Semantic Consolidation Technical Specification',
    titleHi: 'एआई डुप्लिकेट निराकरण एवं शब्दार्थ समेकन तकनीकी विनिर्देश',
    date: '10 March 2026',
    ministry: 'National Informatics Centre (NIC)',
    description:
      'Technical architecture guidelines for vector embedding comparisons, geo-distance proximity clustering, and automated multi-citizen testimony concatenation.'
  }
];

export const OfficialCircularsModal: React.FC<CircularsModalProps> = ({ isOpen, onClose }) => {
  const lang = getLanguage();
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B2E59] text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <NationalEmblem size="xs" variant="light" showMotto={false} />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                GOVERNMENT GAZETTE & CIRCULARS REPOSITORY
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isHi ? 'सरकारी परिपत्र एवं राजपत्र अधिसूचनाएं' : 'Official Guidelines, Circulars & Sanction Orders'}
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

        {/* Circulars List */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {CIRCULARS.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0B2E59] dark:hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span>{doc.refNo}</span>
                  <span>•</span>
                  <span className="text-slate-500">{doc.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isHi ? doc.titleHi : doc.titleEn}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium pt-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{doc.ministry}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    alert(`Official Gazette document [${doc.refNo}] opened in verified digital reader.`);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[#0B2E59] hover:bg-[#071C35] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Published under authority of The Gazette of India, New Delhi.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-lg text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

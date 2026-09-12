import React from 'react';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { NationalEmblem } from './NationalEmblem';

interface SealProps {
  status?: 'verified' | 'funded' | 'solved' | 'inspection_passed';
  officerName?: string;
  department?: string;
  referenceNo?: string;
  date?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OfficialVerificationSeal: React.FC<SealProps> = ({
  status = 'verified',
  officerName = 'Shri Rajesh Verma, IAS',
  department = 'Municipal Public Works & Infrastructure',
  referenceNo = 'GOI/MOHUA/2026/CIVIC-042',
  date = '10-SEP-2026',
  size = 'md'
}) => {
  const isVerified = status === 'verified';
  const isFunded = status === 'funded';
  const isSolved = status === 'solved';

  const borderColor = isSolved
    ? 'border-emerald-600 text-emerald-800 dark:border-emerald-500 dark:text-emerald-400'
    : isFunded
    ? 'border-blue-700 text-blue-900 dark:border-sky-500 dark:text-sky-300'
    : 'border-[#0B2E59] text-[#0B2E59] dark:border-amber-400 dark:text-amber-300';

  const title = isSolved
    ? 'PROJECT SOLVED & IMPLEMENTED'
    : isFunded
    ? 'GRANT SANCTIONED & APPROVED'
    : 'STEP-2 FIELD INSPECTION PASSED';

  const hindiTitle = isSolved
    ? 'जमीनी क्रियान्वयन पूर्ण'
    : isFunded
    ? 'अनुदान स्वीकृत एवं आवंटित'
    : 'द्वितीय चरण भौतिक सत्यापन प्रमाणित';

  return (
    <div
      className={`inline-flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border-2 border-dashed ${borderColor} bg-white/90 dark:bg-slate-900/90 shadow-xs relative overflow-hidden select-none`}
      title="Official Government Verification Seal (GIGW 3.0 Standard)"
    >
      {/* Circular Official Seal Badge */}
      <div className="w-12 h-12 rounded-full border-2 border-current flex flex-col items-center justify-center p-1 relative flex-shrink-0 bg-slate-50 dark:bg-slate-800">
        <NationalEmblem size="xs" variant="monochrome" showMotto={false} className="opacity-90" />
        <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5 leading-none">
          GOVT. SEAL
        </span>
      </div>

      {/* Official Metadata Lockup */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs font-black tracking-wide uppercase">{title}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
          {hindiTitle}
        </span>
        <div className="flex flex-wrap items-center gap-x-2 text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
          <span>Ref: {referenceNo}</span>
          <span>•</span>
          <span>Nodal: {officerName}</span>
          <span>•</span>
          <span>Date: {date}</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ProblemStatus } from '../types';
import {
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  Bell,
  Users,
  FileCheck,
  Building2,
  Award,
  IndianRupee,
  Wrench,
  PartyPopper,
  XCircle,
  HelpCircle,
  AlertCircle,
  FileSignature
} from 'lucide-react';

interface StatusBadgeProps {
  status: ProblemStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;

  switch (status) {
    case 'Problem Submitted':
      bg = 'bg-slate-100 text-slate-800 border-slate-300';
      Icon = Clock;
      break;
    case 'AI Analysis Completed':
      bg = 'bg-sky-50 text-sky-800 border-sky-200';
      Icon = Sparkles;
      break;
    case 'Sent to Government for Verification':
      bg = 'bg-amber-50 text-amber-900 border-amber-300';
      Icon = Send;
      break;
    case 'Verified by Government':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle2;
      break;
    case 'Nearby Colleges Notified':
      bg = 'bg-blue-50 text-blue-800 border-blue-200';
      Icon = Bell;
      break;
    case 'Student Team Formed':
      bg = 'bg-purple-50 text-purple-800 border-purple-200';
      Icon = Users;
      break;
    case 'Solution Submitted':
      bg = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      Icon = FileCheck;
      break;
    case 'Under Industry Review':
      bg = 'bg-orange-50 text-orange-900 border-orange-300';
      Icon = Building2;
      break;
    case 'Queries Raised by Industry':
      bg = 'bg-amber-100 text-amber-900 border-amber-400 font-bold animate-pulse';
      Icon = AlertCircle;
      break;
    case 'Joint Grant Sanction Proposed':
      bg = 'bg-indigo-100 text-indigo-950 border-indigo-300 font-bold';
      Icon = FileSignature;
      break;
    case 'Industry Prototype Finalized':
      bg = 'bg-teal-50 text-teal-900 border-teal-300';
      Icon = Award;
      break;
    case 'Government Funding Approved':
      bg = 'bg-green-50 text-green-900 border-green-300';
      Icon = IndianRupee;
      break;
    case 'Implementation':
      bg = 'bg-cyan-50 text-cyan-900 border-cyan-300';
      Icon = Wrench;
      break;
    case 'Problem Solved':
      bg = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
      Icon = PartyPopper;
      break;
    case 'Rejected':
      bg = 'bg-rose-50 text-rose-800 border-rose-300';
      Icon = XCircle;
      break;
    case 'More Information Requested':
      bg = 'bg-amber-100 text-amber-900 border-amber-300';
      Icon = HelpCircle;
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses} transition-colors whitespace-nowrap`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};

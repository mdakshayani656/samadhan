import React from 'react';
import { Problem, ProblemStatus } from '../types';
import {
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
  Lightbulb,
  Building,
  Award,
  IndianRupee,
  Wrench,
  PartyPopper,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface TimelineTrackerProps {
  problem: Problem;
  compact?: boolean;
}

interface TimelineStage {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  isCompleted: (p: Problem) => boolean;
  isCurrent: (p: Problem) => boolean;
  getTimestamp: (p: Problem) => string | undefined;
  details?: (p: Problem) => string | undefined;
}

const STAGES: TimelineStage[] = [
  {
    key: 'submitted',
    title: 'Problem Submitted',
    subtitle: 'Citizen registered civic hazard',
    icon: Clock,
    isCompleted: () => true,
    isCurrent: (p) => p.status === 'Problem Submitted',
    getTimestamp: (p) => p.createdAt,
    details: (p) => `Reported by ${p.citizenName || 'Citizen'} • Location: ${p.location}`
  },
  {
    key: 'ai',
    title: 'AI Analysis Completed',
    subtitle: 'Step 1 — Advisory duplicate & validity check',
    icon: Sparkles,
    isCompleted: (p) => p.aiDone,
    isCurrent: (p) => p.status === 'AI Analysis Completed',
    getTimestamp: (p) => p.createdAt,
    details: (p) =>
      `Confidence: ${p.aiConfidence}% • Severity: ${p.priority} • Duplicate Risk: ${p.duplicate ? 'Flagged' : 'None detected'}`
  },
  {
    key: 'sent_govt',
    title: 'Sent to Government',
    subtitle: 'Dispatched to administrative nodal officer',
    icon: AlertCircle,
    isCompleted: (p) => p.aiDone,
    isCurrent: (p) => p.status === 'Sent to Government for Verification',
    getTimestamp: (p) => p.createdAt,
    details: () => 'Awaiting official field inspection and administrative review'
  },
  {
    key: 'govt_verified',
    title: 'Verified by Government',
    subtitle: 'Step 2 — Official ground verification',
    icon: ShieldCheck,
    isCompleted: (p) => p.verified,
    isCurrent: (p) => p.status === 'Verified by Government',
    getTimestamp: (p) => (p.verified ? p.updatedAt : undefined),
    details: (p) =>
      p.governmentRemarks
        ? `Official Inspection: "${p.governmentRemarks}"`
        : 'Authenticated as genuine civic challenge'
  },
  {
    key: 'college_notified',
    title: 'Nearby Colleges Notified',
    subtitle: 'Mapped to regional engineering institutions',
    icon: GraduationCap,
    isCompleted: (p) => p.collegeNotified || p.teamFormed || p.solutionSubmitted,
    isCurrent: (p) => p.status === 'Nearby Colleges Notified',
    getTimestamp: (p) => (p.collegeNotified ? p.updatedAt : undefined),
    details: (p) =>
      p.matchedColleges
        ? `Broadcasted to ${p.matchedColleges.length} regional technical institutions`
        : 'Open challenge broadcasted to academic research cells'
  },
  {
    key: 'team_formed',
    title: 'Student Team Formed',
    subtitle: 'Collegiate innovators take up problem',
    icon: Users,
    isCompleted: (p) => p.teamFormed || p.solutionSubmitted,
    isCurrent: (p) => p.status === 'Student Team Formed',
    getTimestamp: (p) => (p.teamFormed ? p.updatedAt : undefined),
    details: (p) => (p.teamId ? `Active Team: ${p.teamId} registered in Innovation Cell` : undefined)
  },
  {
    key: 'solution_submitted',
    title: 'Solution Submitted',
    subtitle: 'Student team developed working prototype',
    icon: Lightbulb,
    isCompleted: (p) => p.solutionSubmitted,
    isCurrent: (p) => p.status === 'Solution Submitted',
    getTimestamp: (p) => (p.solutionSubmitted ? p.updatedAt : undefined),
    details: (p) => (p.solutionId ? `Solution #${p.solutionId} filed with hardware specifications` : undefined)
  },
  {
    key: 'industry_review',
    title: 'Industry Review',
    subtitle: 'Technical feasibility & scalability evaluation',
    icon: Building,
    isCompleted: (p) => p.industryReviewed,
    isCurrent: (p) => p.status === 'Under Industry Review',
    getTimestamp: (p) => (p.industryReviewed ? p.updatedAt : undefined),
    details: (p) =>
      p.industryRemarks
        ? `Industry feedback: "${p.industryRemarks}"`
        : 'Corporate R&D partners vetting manufacturability'
  },
  {
    key: 'prototype_finalized',
    title: 'Prototype Finalized',
    subtitle: 'Industrial validation confirmed',
    icon: Award,
    isCompleted: (p) => p.prototypeFinalized,
    isCurrent: (p) => p.status === 'Industry Prototype Finalized',
    getTimestamp: (p) => (p.prototypeFinalized ? p.updatedAt : undefined),
    details: () => 'Design specifications locked for civic deployment'
  },
  {
    key: 'funding_approved',
    title: 'Government Funding Approved',
    subtitle: 'Implementation grant sanctioned',
    icon: IndianRupee,
    isCompleted: (p) => p.fundingApproved,
    isCurrent: (p) => p.status === 'Government Funding Approved',
    getTimestamp: (p) => (p.fundingApproved ? p.updatedAt : undefined),
    details: (p) =>
      p.fundingAmount
        ? `Grant of ₹${p.fundingAmount.toLocaleString('en-IN')} officially sanctioned`
        : undefined
  },
  {
    key: 'implementation',
    title: 'Implementation',
    subtitle: 'Ground rollout and execution',
    icon: Wrench,
    isCompleted: (p) => p.implemented,
    isCurrent: (p) => p.status === 'Implementation',
    getTimestamp: (p) => (p.implemented ? p.updatedAt : undefined),
    details: () => 'Field installation and municipal pilot execution underway'
  },
  {
    key: 'problem_solved',
    title: 'Problem Solved',
    subtitle: 'Civic issue completely resolved',
    icon: PartyPopper,
    isCompleted: (p) => p.status === 'Problem Solved',
    isCurrent: (p) => p.status === 'Problem Solved',
    getTimestamp: (p) => p.solvedAt,
    details: () => '🎉 Ground solution active & verified. Citizen notified.'
  }
];

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ problem, compact = false }) => {
  if (problem.status === 'Rejected') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-800 flex items-start gap-3">
        <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-rose-900">Proposal Rejected During Verification</h4>
          <p className="text-sm text-rose-700 mt-1">
            {problem.governmentRemarks || 'The report could not be verified by the administrative field team.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:top-3 before:bottom-3 before:left-3.5 sm:before:left-4.5 before:w-0.5 before:bg-slate-200">
        {STAGES.map((stage) => {
          const completed = stage.isCompleted(problem);
          const current = stage.isCurrent(problem);
          const timestamp = stage.getTimestamp(problem);
          const detail = stage.details ? stage.details(problem) : undefined;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative group">
              {/* Bullet node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  completed
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                    : current
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {completed ? (
                  <CheckCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Content Card */}
              <div
                className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                  current
                    ? 'bg-blue-50/60 border-blue-200 shadow-sm'
                    : completed
                    ? 'bg-white border-slate-200/90'
                    : 'bg-slate-50/50 border-slate-200/50 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm sm:text-base font-bold ${
                        completed
                          ? 'text-slate-900'
                          : current
                          ? 'text-blue-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.title}
                    </h4>
                    {current && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  {timestamp && (
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 font-medium">{stage.subtitle}</p>

                {detail && (completed || current) && !compact && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 bg-slate-50/80 rounded-lg p-2 font-mono">
                    {detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

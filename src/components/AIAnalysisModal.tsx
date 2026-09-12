import React from 'react';
import { AIAnalysisReport, Problem } from '../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
  X,
  Bot,
  Layers,
  Users
} from 'lucide-react';

interface AIAnalysisModalProps {
  report: AIAnalysisReport;
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  report,
  problem,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const isMerged = Boolean(report.isCombinedIntoExisting || (report.duplicateDetected && report.matchedExistingProblemId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header with official Gov/Tech theme */}
        <div className={`p-6 relative text-white ${
          isMerged
            ? 'bg-gradient-to-r from-[#073F68] via-[#087D70] to-[#159447]'
            : 'bg-gradient-to-r from-[#073F68] to-[#087D70]'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              {isMerged ? <Layers className="w-6 h-6 text-amber-300" /> : <Bot className="w-6 h-6 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded-md">
                  Step 1 Completed
                </span>
                {isMerged ? (
                  <span className="text-xs text-emerald-200 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Combined into Single Master Problem
                  </span>
                ) : (
                  <span className="text-xs text-white/80 font-medium">Preliminary Advisory AI Report</span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {isMerged ? 'AI Duplicate Check & Unified Consolidation' : 'AI Analysis & Duplicate Screening'}
              </h2>
            </div>
          </div>
        </div>

        {/* Feature Highlight: Merged Problem Banner */}
        {isMerged && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg flex-shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    No Duplicate Created — Consolidated into Master Problem #{problem.id}
                  </h4>
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {problem.communityReportCount || 2} Citizen Reports Merged
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  The AI scanned previous records and identified a <strong>{report.duplicateProbability}% semantic & geospatial match</strong> with existing problem <strong>#{problem.id}</strong>. Instead of generating multiple redundant tickets, SAMADHAN automatically combined all reports into this single master issue.
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  ✓ Your photo and description have been appended as verified citizen evidence, elevating its priority level to <strong>{problem.priority}</strong> for municipal field inspection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advisory Notice Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-800/50 px-6 py-2.5 flex items-center gap-3 text-amber-900 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Official Protocol Notice:</strong> AI acts solely as an advisory filter. Final legal verification is conducted by designated Government Nodal Officers in Step 2.
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Problem Overview */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#073F68] dark:text-sky-400 tracking-wider uppercase">
                    Master Problem ID: {problem.id}
                  </span>
                  {problem.communityReportCount && problem.communityReportCount > 1 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 rounded-md">
                      <Users className="w-3 h-3" /> {problem.communityReportCount} Citizens Reported
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-1">{problem.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{problem.location}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {problem.category}
              </span>
            </div>
          </div>

          {/* AI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Confidence */}
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800/50 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 uppercase">AI Confidence</span>
              <div className="text-2xl font-black text-sky-900 dark:text-sky-100 mt-1">{report.confidenceScore}%</div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Deterministic Score</span>
            </div>

            {/* Duplicate Status */}
            <div
              className={`rounded-xl p-3 text-center border ${
                isMerged
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : report.duplicateDetected
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase">Records Check</span>
              <div className="text-sm font-bold mt-1.5 flex items-center justify-center gap-1">
                {isMerged ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Combined in 1</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Unique Issue</span>
                  </>
                )}
              </div>
              <span className="text-[10px] opacity-75">
                {isMerged ? `${report.duplicateProbability}% Match Merged` : '0 Duplicates Found'}
              </span>
            </div>

            {/* Severity */}
            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/50 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 uppercase">Assessed Severity</span>
              <div className="text-lg font-black text-purple-900 dark:text-purple-100 mt-1">{report.severity}</div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Priority: {report.priority}</span>
            </div>

            {/* Evidence Quality */}
            <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800/50 rounded-xl p-3 text-center">
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 uppercase">Evidence Check</span>
              <div className="text-sm font-bold text-teal-900 dark:text-teal-100 mt-1.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{report.evidenceQuality}</span>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Media Verified</span>
            </div>
          </div>

          {/* Detailed Observations */}
          <div className="space-y-3">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-850">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Structured Problem Classification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Suggested Category: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{report.suggestedCategory}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Detected Problem Type: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{report.detectedProblemType}</strong>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                <strong>Media Analysis:</strong> {report.mediaRelevance}
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    AI Recommendation & Forwarding Status
                  </h4>
                  <p className="text-sm font-medium text-blue-950 dark:text-blue-100 mt-1">
                    {report.recommendation}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Status: Automatically routed to the Government Administrative Nodal Queue for Step 2 human field inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Timestamp: {new Date(report.analyzedAt).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#073F68] hover:bg-[#063354] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isMerged ? 'Track Master Problem in My Reports' : 'Done — View in My Reports'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

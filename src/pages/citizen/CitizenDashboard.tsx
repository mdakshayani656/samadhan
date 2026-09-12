import React, { useState } from 'react';
import { SamadhanLogo } from '../../components/SamadhanLogo';
import { StatusBadge } from '../../components/StatusBadge';
import { TimelineTracker } from '../../components/TimelineTracker';
import { Problem, UserRole } from '../../types';
import { loadDatabase, getCurrentUser } from '../../data/storage';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Users,
  Layers
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigateTab: (tab: 'dashboard' | 'report' | 'my-reports' | 'notifications') => void;
  activeTab: 'dashboard' | 'report' | 'my-reports' | 'notifications';
  onLogout: () => void;
  onOpenReportForm: () => void;
  onOpenNotifications: () => void;
  selectedProblemId?: string | null;
  onSelectProblem: (id: string | null) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigateTab,
  activeTab,
  onLogout,
  onOpenReportForm,
  onOpenNotifications,
  selectedProblemId,
  onSelectProblem
}) => {
  const db = loadDatabase();
  const user = getCurrentUser();
  const problems = db.problems;

  // Statistics
  const totalReports = problems.length;
  const aiAnalyzedCount = problems.filter((p) => p.aiDone).length;
  const govtVerifiedCount = problems.filter((p) => p.verified).length;
  const solvedCount = problems.filter((p) => p.status === 'Problem Solved').length;

  const selectedProblem = selectedProblemId
    ? problems.find((p) => p.id === selectedProblemId)
    : null;

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-100">
            <SamadhanLogo size="sm" showTagline={true} />
            <div className="mt-3 px-2 py-1 bg-orange-50 border border-orange-200/80 rounded-lg text-[11px] font-bold text-[#F57A16] flex items-center gap-1.5">
              <span>👤</span>
              <span>Citizen Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => {
                onSelectProblem(null);
                onNavigateTab('dashboard');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'dashboard' && !selectedProblemId
                  ? 'bg-[#073F68] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={onOpenReportForm}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'report'
                  ? 'bg-[#F57A16] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#F57A16]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Problem</span>
            </button>

            <button
              onClick={() => {
                onSelectProblem(null);
                onNavigateTab('my-reports');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'my-reports' || (activeTab === 'dashboard' && selectedProblemId)
                  ? 'bg-[#073F68] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Reports & Tracking</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Citizen User'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'citizen@demo.com'}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {selectedProblem ? (
          /* Detailed Single Report Tracking View (Section 21) */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onSelectProblem(null)}
                className="text-xs font-bold text-[#073F68] hover:underline flex items-center gap-1"
              >
                ← Back to All Reports
              </button>
              <StatusBadge status={selectedProblem.status} size="lg" />
            </div>

            {/* Top Overview Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                {selectedProblem.photo && (
                  <div className="w-full md:w-60 h-44 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src={selectedProblem.photo}
                      alt={selectedProblem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>ID: {selectedProblem.id}</span>
                    <span>•</span>
                    <span className="text-[#087D70]">{selectedProblem.category}</span>
                    <span>•</span>
                    <span className="text-[#F57A16]">Priority: {selectedProblem.priority}</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#073F68]">
                    {selectedProblem.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedProblem.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-2">
                    <MapPin className="w-4 h-4 text-[#073F68]" />
                    <span>{selectedProblem.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Solved Success Banner if resolved */}
            {selectedProblem.status === 'Problem Solved' && (
              <div className="bg-gradient-to-r from-emerald-600 to-[#087D70] text-white rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold">🎉 Problem Solved & Ground Executed!</h3>
                    <p className="text-xs text-white/90 mt-1">
                      From your report to collegiate innovation and industrial deployment, this issue
                      has been completely addressed. Thank you for your active civic participation!
                    </p>
                  </div>
                </div>

                {selectedProblem.afterPhoto && (
                  <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider block mb-2">
                        Before Resolution
                      </span>
                      <img
                        src={selectedProblem.photo}
                        alt="Before"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 object-cover rounded-xl"
                      />
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider block mb-2">
                        After Student & Govt Implementation
                      </span>
                      <img
                        src={selectedProblem.afterPhoto}
                        alt="After"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 object-cover rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Consolidated Citizen Submissions (AI Merged) */}
            {selectedProblem.additionalReports && selectedProblem.additionalReports.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        AI Deduplication & Merging
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {selectedProblem.communityReportCount || selectedProblem.additionalReports.length + 1} Citizen Reports Merged
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#073F68] mt-1">
                      Consolidated Community Testimonies & Field Evidence
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      The AI checked previous records and prevented duplicate tickets by combining these resident submissions into this single master problem.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedProblem.additionalReports.map((rep) => (
                    <div key={rep.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row gap-4 items-start">
                      {rep.photo && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                          <img src={rep.photo} alt="Citizen evidence" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900">{rep.citizenName}</span>
                          <span className="text-[11px] text-slate-500">{new Date(rep.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rep.description}</p>
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                            {rep.similarityScore}% AI Match
                          </span>
                          <span>{rep.similarityReason}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Vertical Timeline Tracking (Section 21) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#087D70]">
                  Live Lifecycle Audit Trail
                </span>
                <h2 className="text-lg font-extrabold text-[#073F68]">
                  Problem-to-Solution Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Chronological progression through AI screening, Government ground verification,
                  college team prototyping, and implementation funding.
                </p>
              </div>

              <TimelineTracker problem={selectedProblem} />
            </div>
          </div>
        ) : (
          /* Dashboard Home View */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073F68]">
                  Citizen Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Track how your reported community problems move toward real-world solutions.
                </p>
              </div>
              <button
                onClick={onOpenReportForm}
                className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#F57A16] to-[#e66c08] hover:shadow-lg hover:shadow-orange-500/20 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report New Problem</span>
              </button>
            </div>

            {/* 4 Key Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  My Reports
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#073F68] mt-2">
                  {totalReports}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Logged in database</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  AI Analyzed
                </span>
                <div className="text-2xl sm:text-3xl font-black text-sky-900 mt-2">
                  {aiAnalyzedCount}
                </div>
                <span className="text-[11px] text-sky-600 font-medium">Step 1 Triage complete</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Govt Verified
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-2">
                  {govtVerifiedCount}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Step 2 Official check</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
                <span className="text-xs font-bold text-[#159447] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#159447]" />
                  Problems Solved
                </span>
                <div className="text-2xl sm:text-3xl font-black text-green-900 mt-2">
                  {solvedCount}
                </div>
                <span className="text-[11px] text-green-700 font-medium">Ground implemented</span>
              </div>
            </div>

            {/* Recent Reports List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-extrabold text-[#073F68]">Recent Civic Reports</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any card to inspect full timeline and innovation lifecycle
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Total: {problems.length}
                </span>
              </div>

              <div className="space-y-4">
                {problems.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#073F68] hover:shadow-md transition-all bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {prob.photo && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                          <img
                            src={prob.photo}
                            alt={prob.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            {prob.id}
                          </span>
                          {prob.communityReportCount && prob.communityReportCount > 1 && (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200/80 inline-flex items-center gap-1">
                              <Users className="w-3 h-3 text-emerald-600" />
                              <span>{prob.communityReportCount} Reports Merged</span>
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                            {prob.category}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-orange-50 text-orange-800 rounded">
                            {prob.priority} Priority
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {prob.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prob.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <StatusBadge status={prob.status} />
                      <button
                        onClick={() => onSelectProblem(prob.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#073F68] hover:text-white rounded-lg text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

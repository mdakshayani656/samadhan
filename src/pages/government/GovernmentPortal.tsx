import React, { useState } from 'react';
import { SamadhanLogo } from '../../components/SamadhanLogo';
import { StatusBadge } from '../../components/StatusBadge';
import { NationalEmblem, TirangaBar } from '../../components/NationalEmblem';
import { OfficialVerificationSeal } from '../../components/OfficialVerificationSeal';
import { Problem, UserRole, StudentSolution, IndustryEvaluation, FundingDetails } from '../../types';
import {
  loadDatabase,
  getCurrentUser,
  verifyProblemByGovernment,
  approveGovernmentFunding,
  markImplementationComplete
} from '../../data/storage';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  IndianRupee,
  LogOut,
  BarChart3,
  Sparkles,
  MapPin,
  AlertTriangle,
  Send,
  Building,
  GraduationCap,
  Award,
  Wrench,
  Check
} from 'lucide-react';

interface GovernmentPortalProps {
  onLogout: () => void;
  onOpenNotifications: () => void;
  initialTab?: 'pending' | 'verified' | 'funding' | 'analytics';
}

export const GovernmentPortal: React.FC<GovernmentPortalProps> = ({
  onLogout,
  onOpenNotifications,
  initialTab = 'pending'
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'funding' | 'analytics'>(
    initialTab
  );
  const [selectedVerifyProblem, setSelectedVerifyProblem] = useState<Problem | null>(null);

  // Verification Form state
  const [actionChoice, setActionChoice] = useState<'verify' | 'reject' | 'request_info'>('verify');
  const [remarks, setRemarks] = useState(
    'Ground verified by Executive Engineer. High severity due to commuter flow. Approved for immediate collegiate challenge.'
  );
  const [assignedDept, setAssignedDept] = useState('Municipal Public Works & Infrastructure');
  const [verifySuccessMsg, setVerifySuccessMsg] = useState('');

  // Funding modal state
  const [fundingAmountInput, setFundingAmountInput] = useState<number>(350000);
  const [fundingSuccessMsg, setFundingSuccessMsg] = useState('');

  const db = loadDatabase();
  const user = getCurrentUser();
  const problems = db.problems;

  // Tabs filtering
  const pendingProblems = problems.filter((p) => !p.verified && !p.rejected);
  const verifiedProblems = problems.filter((p) => p.verified);
  const rejectedProblems = problems.filter((p) => p.rejected);
  const fundingPendingProblems = problems.filter(
    (p) => (p.prototypeFinalized || p.jointGrantProposed) && !p.fundingApproved
  );
  const fundedProjects = problems.filter((p) => p.fundingApproved);
  const solvedProblems = problems.filter((p) => p.status === 'Problem Solved');

  // Ground verification submit handler (Step 2)
  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerifyProblem) return;

    verifyProblemByGovernment(
      selectedVerifyProblem.id,
      actionChoice,
      remarks,
      user?.name || 'Executive Officer'
    );

    setVerifySuccessMsg(`Action registered: "${actionChoice.toUpperCase()}" for ${selectedVerifyProblem.id}. Nearby colleges and citizen have been notified!`);
    setTimeout(() => {
      setVerifySuccessMsg('');
      setSelectedVerifyProblem(null);
      setActiveTab('verified');
    }, 1500);
  };

  const handleApproveFunding = (problemId: string, cost: number) => {
    approveGovernmentFunding(
      problemId,
      cost || 300000,
      user?.name || 'Collector & District Magistrate'
    );
    setFundingSuccessMsg(`Grant of ₹${(cost || 300000).toLocaleString('en-IN')} officially sanctioned!`);
    setTimeout(() => setFundingSuccessMsg(''), 2500);
  };

  const handleMarkComplete = (problemId: string) => {
    markImplementationComplete(problemId);
    setFundingSuccessMsg(`Problem ${problemId} marked as IMPLEMENTED & SOLVED! Citizen notified.`);
    setTimeout(() => setFundingSuccessMsg(''), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] dark:bg-[#070e17] flex flex-col md:flex-row text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Sidebar */}
      <aside className="w-full md:w-72 bg-[#0B2E59] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#082242] shadow-lg">
        <div>
          {/* Official Indian Tricolor Micro Band */}
          <TirangaBar height="h-1" withChakra={false} />

          {/* Official Government Masthead */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <NationalEmblem size="xs" variant="light" showMotto={false} className="opacity-95" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                GOVERNMENT OF INDIA
              </span>
              <span className="text-xs font-black text-white leading-tight">
                नगर प्रशासन एवं सत्यापन कक्ष
              </span>
              <span className="text-[9px] text-slate-300 mt-0.5">
                Municipal Grievance & Grant Cell
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => {
                setSelectedVerifyProblem(null);
                setActiveTab('pending');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Pending Verification</span>
              </div>
              {pendingProblems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                  {pendingProblems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedVerifyProblem(null);
                setActiveTab('verified');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verified'
                  ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Problems</span>
            </button>

            <button
              onClick={() => {
                setSelectedVerifyProblem(null);
                setActiveTab('funding');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'funding'
                  ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IndianRupee className="w-4 h-4 text-amber-300" />
                <span>Funding & Projects</span>
              </div>
              {fundingPendingProblems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900">
                  {fundingPendingProblems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedVerifyProblem(null);
                setActiveTab('analytics');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-300" />
              <span>Civic Analytics</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Portal Alerts</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </button>
          </nav>
        </div>

        {/* Nodal Officer Session Info */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 mb-3">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Nodal Officer'}</p>
            <p className="text-[11px] text-slate-300 truncate">
              {user?.organization || 'District Administration'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-200 bg-rose-900/40 hover:bg-rose-900/60 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Officer Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {verifySuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{verifySuccessMsg}</span>
          </div>
        )}

        {fundingSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{fundingSuccessMsg}</span>
          </div>
        )}

        {/* SECTION 12: GOVERNMENT VERIFICATION VIEW (Step 2 - Human Ground Verification) */}
        {selectedVerifyProblem ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedVerifyProblem(null)}
                className="text-xs font-bold text-[#073F68] hover:underline flex items-center gap-1"
              >
                ← Back to Pending List
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#073F68] px-2.5 py-1 rounded-md">
                  Step 2 Protocol
                </span>
                <StatusBadge status={selectedVerifyProblem.status} />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#073F68]">
                Government Ground Verification
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Step 2 — Official human administrative verification after Step 1 AI advisory screening.
              </p>
            </div>

            {/* Citizen Report Dossier */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Citizen Submitted Dossier
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedVerifyProblem.photo && (
                  <div className="h-48 md:h-auto rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={selectedVerifyProblem.photo}
                      alt={selectedVerifyProblem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      ID: {selectedVerifyProblem.id}
                    </span>
                    <span className="text-xs font-semibold text-[#087D70] bg-teal-50 px-2 py-0.5 rounded">
                      {selectedVerifyProblem.category}
                    </span>
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      Priority: {selectedVerifyProblem.priority}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedVerifyProblem.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedVerifyProblem.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-[#073F68]" />
                    <span>{selectedVerifyProblem.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 AI Report Review */}
            {db.aiReports[selectedVerifyProblem.id] && (
              <div className="bg-sky-50/70 border border-sky-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-600" />
                    <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wider">
                      Step 1: Advisory AI Screening Report
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-white text-sky-800 px-2.5 py-1 rounded-md border border-sky-200">
                    Confidence: {db.aiReports[selectedVerifyProblem.id].confidenceScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 block">Duplicate Check</span>
                    <strong className="text-slate-800">
                      {db.aiReports[selectedVerifyProblem.id].duplicateDetected
                        ? 'Potential Overlap'
                        : 'No Duplicate Found'}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 block">Assessed Severity</span>
                    <strong className="text-slate-800">
                      {db.aiReports[selectedVerifyProblem.id].severity}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 block">Evidence Check</span>
                    <strong className="text-slate-800">
                      {db.aiReports[selectedVerifyProblem.id].evidenceQuality}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-sky-100">
                    <span className="text-slate-400 block">Detected Type</span>
                    <strong className="text-slate-800">
                      {db.aiReports[selectedVerifyProblem.id].detectedProblemType}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-sky-900 bg-white/80 p-3 rounded-xl border border-sky-200/80">
                  <strong>AI Recommendation:</strong> {db.aiReports[selectedVerifyProblem.id].recommendation}
                </div>
              </div>
            )}

            {/* Clearly Separated Panel: GOVERNMENT GROUND VERIFICATION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#073F68] shadow-lg">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#073F68]">
                  Official Verification Panel
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  GOVERNMENT GROUND VERIFICATION
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Only after Government verifies this report will it become an official challenge
                  broadcasted to nearby engineering colleges.
                </p>
              </div>

              <form onSubmit={handleConfirmVerification} className="space-y-6">
                {/* 3 Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      actionChoice === 'verify'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verify Problem</span>
                      </div>
                      <input
                        type="radio"
                        name="govt_action"
                        checked={actionChoice === 'verify'}
                        onChange={() => setActionChoice('verify')}
                        className="accent-emerald-600 w-4 h-4"
                      />
                    </div>
                    <p className="text-[11px] opacity-80">
                      This is a genuine civic challenge. Publish to colleges.
                    </p>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      actionChoice === 'reject'
                        ? 'border-rose-600 bg-rose-50/70 text-rose-950 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Reject</span>
                      </div>
                      <input
                        type="radio"
                        name="govt_action"
                        checked={actionChoice === 'reject'}
                        onChange={() => setActionChoice('reject')}
                        className="accent-rose-600 w-4 h-4"
                      />
                    </div>
                    <p className="text-[11px] opacity-80">
                      Invalid, duplicate, or out of administrative jurisdiction.
                    </p>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      actionChoice === 'request_info'
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Request Info</span>
                      </div>
                      <input
                        type="radio"
                        name="govt_action"
                        checked={actionChoice === 'request_info'}
                        onChange={() => setActionChoice('request_info')}
                        className="accent-amber-600 w-4 h-4"
                      />
                    </div>
                    <p className="text-[11px] opacity-80">
                      Ask citizen for clearer location or additional media.
                    </p>
                  </label>
                </div>

                {/* Assigned Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Assigned Municipal Department
                  </label>
                  <input
                    type="text"
                    value={assignedDept}
                    onChange={(e) => setAssignedDept(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>

                {/* Remarks Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Inspection Remarks & Guidelines for Colleges *
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                    placeholder="Enter official ground report observations, constraints, and target outcomes for collegiate teams..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 text-sm font-extrabold text-white bg-[#073F68] hover:bg-[#052d4b] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Verification & Notify Colleges</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard Default Views */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073F68]">
                Government Administration Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Ground verification authority, collegiate challenge dispatch, and municipal innovation grant management.
              </p>
            </div>

            {/* 6 Key Statistics Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-amber-600 uppercase">Pending</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{pendingProblems.length}</div>
                <span className="text-[10px] text-slate-400">Step 2 Review</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Verified</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{verifiedProblems.length}</div>
                <span className="text-[10px] text-slate-400">Published Challenges</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-purple-600 uppercase">College Teams</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{db.teams.length}</div>
                <span className="text-[10px] text-slate-400">Active Innovators</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-teal-600 uppercase">In Development</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{db.solutions.length}</div>
                <span className="text-[10px] text-slate-400">Prototypes Vetted</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase">Funding Stage</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{fundingPendingProblems.length}</div>
                <span className="text-[10px] text-slate-400">Grant Sanctions</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
                <span className="text-[11px] font-bold text-[#159447] uppercase">Solved</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{solvedProblems.length}</div>
                <span className="text-[10px] text-slate-400">Fully Executed</span>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#073F68]">
                      Pending Human Ground Verification ({pendingProblems.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Citizens have submitted these reports and AI has generated Step 1 advisory reports. Ground verification is required.
                    </p>
                  </div>
                </div>

                {pendingProblems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="text-sm font-bold text-slate-700">All Submitted Reports Verified!</p>
                    <p className="text-xs text-slate-500 mt-1">
                      No pending items require field inspection at this moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProblems.map((prob) => {
                      const report = db.aiReports[prob.id];
                      return (
                        <div
                          key={prob.id}
                          className="p-5 rounded-2xl border-2 border-amber-200/80 bg-amber-50/30 hover:border-[#073F68] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            {prob.photo && (
                              <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                                <img
                                  src={prob.photo}
                                  alt={prob.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">{prob.id}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                                  {prob.category}
                                </span>
                                {report && (
                                  <span className="text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">
                                    AI Confidence: {report.confidenceScore}%
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-slate-900">{prob.title}</h3>
                              <p className="text-xs text-slate-600 line-clamp-1">{prob.description}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{prob.location}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                            <button
                              onClick={() => setSelectedVerifyProblem(prob)}
                              className="w-full md:w-auto px-4 py-2.5 bg-[#073F68] hover:bg-[#052d4b] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <ShieldCheck className="w-4 h-4 text-amber-300" />
                              <span>Perform Ground Verification</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'verified' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#073F68]">
                      Verified Challenges Published ({verifiedProblems.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Problems authenticated by Government and active in university innovation cells.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {verifiedProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {prob.photo && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                            <img
                              src={prob.photo}
                              alt={prob.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">{prob.id}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                              {prob.category}
                            </span>
                            <StatusBadge status={prob.status} size="sm" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{prob.title}</h3>
                          <p className="text-xs text-slate-500">{prob.location}</p>
                          {prob.governmentRemarks && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 mt-1">
                              <strong>Govt Remarks:</strong> {prob.governmentRemarks}
                            </p>
                          )}
                          <div className="pt-2">
                            <OfficialVerificationSeal
                              status={prob.status === 'Problem Solved' ? 'solved' : prob.fundingApproved ? 'funded' : 'verified'}
                              officerName="Shri Rajesh Verma, IAS"
                              department="Municipal Engineering & Public Works"
                              referenceNo={`GOI/ULB/2026/${prob.id}`}
                              date="10-SEP-2026"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <span className="text-xs font-bold text-[#087D70] dark:text-emerald-400">
                          {prob.matchedColleges?.length || 3} Nearby Colleges Notified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Funding & Implementation Tab */}
            {activeTab === 'funding' && (
              <div className="space-y-8">
                {/* Pending Funding Approvals (Finalized by Industry) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Step 7: Government Funding
                    </span>
                    <h2 className="text-lg font-extrabold text-[#073F68]">
                      Industry-Finalized Prototypes Ready for Grant Approval ({fundingPendingProblems.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Industrial partners have vetted and finalized these prototypes. Approve implementation grants to deploy on the ground.
                    </p>
                  </div>

                  {fundingPendingProblems.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <IndianRupee className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No projects pending funding disbursement</p>
                      <p className="text-xs text-slate-500 mt-1">
                        When industry finalizes a prototype, it appears here for collector sanction.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fundingPendingProblems.map((prob) => {
                        const sol = db.solutions.find((s) => s.id === prob.solutionId);
                        const evaluation = sol ? db.evaluations[sol.id] : null;
                        const jointProposal = sol?.jointGrantProposal || (prob.jointGrantProposalId && db.jointProposals ? db.jointProposals[prob.jointGrantProposalId] : null);
                        const sanctionAmount = jointProposal?.proposedSanctionAmount || sol?.estimatedCost || 350000;

                        return (
                          <div
                            key={prob.id}
                            className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all ${
                              jointProposal
                                ? 'border-indigo-300 bg-indigo-50/40 shadow-sm'
                                : 'border-teal-200 bg-teal-50/30'
                            }`}
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">{prob.id}</span>
                                {jointProposal ? (
                                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-600 text-white flex items-center gap-1">
                                    <span>🤝</span> Joint Student-Industry Proposal
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white">
                                    Industry Finalized
                                  </span>
                                )}
                                <span className="text-xs font-semibold text-slate-500">📍 {prob.location}</span>
                              </div>

                              <h3 className="text-base sm:text-lg font-black text-[#073F68]">{prob.title}</h3>

                              {jointProposal ? (
                                <div className="text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-indigo-200 space-y-1.5 shadow-2xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                                    <span>
                                      <strong>Student Team:</strong> {jointProposal.studentTeamName} ({jointProposal.collegeName})
                                    </span>
                                    <span>
                                      <strong>Lead:</strong> {jointProposal.studentLeaderName}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span>
                                      <strong>Industry Partner:</strong> {jointProposal.industryName}
                                    </span>
                                    <span>
                                      <strong>Mentor:</strong> {jointProposal.industryMentorName}
                                    </span>
                                  </div>
                                  <p className="text-indigo-900 italic pt-1 border-t border-slate-100">
                                    "{jointProposal.industryEndorsementStatement}"
                                  </p>
                                  <div className="pt-1 flex items-center gap-4 text-[11px] font-bold text-indigo-950">
                                    <span>Requested Sanction: ₹{sanctionAmount.toLocaleString('en-IN')}</span>
                                    <span>•</span>
                                    <span>Deployment Timeline: {jointProposal.projectedTimelineWeeks} Weeks</span>
                                  </div>
                                </div>
                              ) : (
                                sol && (
                                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-teal-100 space-y-1">
                                    <p>
                                      <strong>Solution:</strong> {sol.solutionName} ({sol.teamName})
                                    </p>
                                    <p>
                                      <strong>Industry Evaluator:</strong> {evaluation?.industryName || 'Andhra Smart Infra'}
                                    </p>
                                    <p>
                                      <strong>Estimated Implementation Budget:</strong> ₹
                                      {sol.estimatedCost.toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full md:w-auto flex-shrink-0">
                              <button
                                onClick={() => handleApproveFunding(prob.id, sanctionAmount)}
                                className={`w-full md:w-auto px-6 py-3.5 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                  jointProposal
                                    ? 'bg-gradient-to-r from-indigo-700 to-[#073F68] hover:from-indigo-800 hover:to-[#052d4b]'
                                    : 'bg-gradient-to-r from-emerald-600 to-[#087D70]'
                                }`}
                              >
                                <span>🏛️</span>
                                <span>Sanction Grant (₹{sanctionAmount.toLocaleString('en-IN')})</span>
                              </button>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Direct Treasury Release Order
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Ground Implementation Management (Section 20) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#087D70]">
                      Step 8: Field Rollout & Problem Solved
                    </span>
                    <h2 className="text-lg font-extrabold text-[#073F68]">
                      Funded Projects in Active Implementation
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Once ground engineering completes, click "Mark Implementation Complete" to resolve the issue and notify the reporting citizen.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {fundedProjects.map((prob) => (
                      <div
                        key={prob.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">{prob.id}</span>
                            <StatusBadge status={prob.status} size="sm" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{prob.title}</h3>
                          <p className="text-xs text-slate-500">{prob.location}</p>
                          <p className="text-xs text-emerald-700 font-semibold">
                            Grant Approved: ₹{(prob.fundingAmount || 320000).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          {prob.status === 'Problem Solved' ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Implementation Complete</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkComplete(prob.id)}
                              className="w-full md:w-auto px-5 py-2.5 bg-[#087D70] hover:bg-[#065e54] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <Wrench className="w-4 h-4 text-amber-300" />
                              <span>Mark Implementation Complete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-[#073F68]">
                    Civic Challenge Analytics & SIH Metrics
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time KPIs of citizen submissions converted into collegiate patents and municipal solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-500">Average Turnaround</span>
                    <div className="text-3xl font-black text-[#073F68] mt-2">14.2 Days</div>
                    <p className="text-[11px] text-slate-400 mt-1">From citizen report to prototype vetting</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-500">AI Triage Accuracy</span>
                    <div className="text-3xl font-black text-sky-700 mt-2">94.8%</div>
                    <p className="text-[11px] text-slate-400 mt-1">Correlation with ground engineer verification</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-500">Total Grants Sanctioned</span>
                    <div className="text-3xl font-black text-[#159447] mt-2">₹6,05,000</div>
                    <p className="text-[11px] text-slate-400 mt-1">Disbursed across regional collegiate cells</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

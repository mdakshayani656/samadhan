import React, { useState } from 'react';
import { SamadhanLogo } from '../../components/SamadhanLogo';
import { StatusBadge } from '../../components/StatusBadge';
import { StudentSolution, Problem, PrototypeQuery, JointGrantProposal } from '../../types';
import {
  loadDatabase,
  getCurrentUser,
  finalizeIndustryEvaluation,
  raiseIndustryQuery,
  submitJointGrantProposal
} from '../../data/storage';
import {
  Building2,
  FileCheck,
  Award,
  MessageSquare,
  Users,
  LogOut,
  Bell,
  Star,
  CheckCircle2,
  ArrowRight,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Send,
  IndianRupee,
  HelpCircle,
  History,
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface IndustryPortalProps {
  onLogout: () => void;
  onOpenNotifications: () => void;
  onSwitchToGovernment?: () => void;
}

export const IndustryPortal: React.FC<IndustryPortalProps> = ({
  onLogout,
  onOpenNotifications,
  onSwitchToGovernment
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'approved' | 'collaborations'>('review');
  const [selectedSolutionForEval, setSelectedSolutionForEval] = useState<StudentSolution | null>(null);

  // Query raising state
  const [selectedSolutionForQuery, setSelectedSolutionForQuery] = useState<StudentSolution | null>(null);
  const [queryText, setQueryText] = useState('');
  const [requestedModifications, setRequestedModifications] = useState('');
  const [queryPriority, setQueryPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Joint Grant Proposal state (Industry + Students to Government)
  const [selectedSolutionForJointGrant, setSelectedSolutionForJointGrant] = useState<StudentSolution | null>(null);
  const [jointSanctionAmount, setJointSanctionAmount] = useState<number>(350000);
  const [jointMentorName, setJointMentorName] = useState<string>('Dr. V. Srinivas, VP of Engineering');
  const [jointMentorDesignation, setJointMentorDesignation] = useState<string>('Principal Infrastructure Specialist & Industry Mentor');
  const [jointEndorsementStatement, setJointEndorsementStatement] = useState<string>(
    'The student prototype has been rigorously vetted by our engineering team. It demonstrates high field durability and economic viability. We jointly propose immediate sanction of municipal innovation funds to deploy this solution in live civic zones.'
  );
  const [jointTimelineWeeks, setJointTimelineWeeks] = useState<number>(4);

  // Evaluation form parameters (Section 18)
  const [techFeas, setTechFeas] = useState(5);
  const [scalability, setScalability] = useState(5);
  const [costViab, setCostViab] = useState(4);
  const [manufacturability, setManufacturability] = useState(5);
  const [deploymentFeas, setDeploymentFeas] = useState(5);
  const [impactScore, setImpactScore] = useState(5);
  const [feedback, setFeedback] = useState(
    'Excellent physical prototype design. Uses domestic components with high reliability. Suitable for direct municipal trial deployment.'
  );
  const [toastMsg, setToastMsg] = useState('');

  const db = loadDatabase();
  const user = getCurrentUser();

  // All solutions submitted by student teams
  const solutions = db.solutions;
  const pendingReviewSolutions = solutions.filter((s) => {
    const prob = db.problems.find((p) => p.id === s.problemId);
    return prob && !prob.prototypeFinalized && !prob.jointGrantProposed;
  });
  const approvedSolutions = solutions.filter((s) => {
    const prob = db.problems.find((p) => p.id === s.problemId);
    return prob && (prob.prototypeFinalized || prob.jointGrantProposed);
  });

  const handleOpenQueryModal = (sol: StudentSolution) => {
    setSelectedSolutionForQuery(sol);
    setQueryText(
      'The component power draw and water ingress sealing require optimization for continuous outdoor monsoon operation.'
    );
    setRequestedModifications(
      'Replace exposed relay with an IP67 rated enclosure and add reverse-polarity fuse protection in the BOM.'
    );
    setQueryPriority('high');
  };

  const handleRaiseQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForQuery) return;

    raiseIndustryQuery({
      solutionId: selectedSolutionForQuery.id,
      problemId: selectedSolutionForQuery.problemId,
      industryName: user?.organization || 'Andhra Smart Infrastructure Technologies Ltd.',
      evaluatorName: user?.name || 'Dr. V. Srinivas, VP of Engineering',
      queryText,
      requestedModifications,
      priority: queryPriority
    });

    setToastMsg(`Queries sent to Student Team! Prototype returned for modification.`);
    setTimeout(() => {
      setToastMsg('');
      setSelectedSolutionForQuery(null);
    }, 1500);
  };

  const handleOpenJointGrantModal = (sol: StudentSolution) => {
    setSelectedSolutionForJointGrant(sol);
    setJointSanctionAmount(sol.estimatedCost || 350000);
    setJointMentorName(user?.name || 'Dr. V. Srinivas, VP of Engineering');
    setJointMentorDesignation('Principal Infrastructure Specialist & Industry Mentor');
  };

  const handleJointGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForJointGrant) return;

    submitJointGrantProposal({
      problemId: selectedSolutionForJointGrant.problemId,
      solutionId: selectedSolutionForJointGrant.id,
      industryName: user?.organization || 'Andhra Smart Infrastructure Technologies Ltd.',
      industryMentorName: jointMentorName,
      industryDesignation: jointMentorDesignation,
      proposedSanctionAmount: jointSanctionAmount,
      industryEndorsementStatement: jointEndorsementStatement,
      technicalFeasibilityScore: 5,
      manufacturabilityRating: 5,
      projectedTimelineWeeks: jointTimelineWeeks
    });

    setToastMsg(
      `Joint proposal submitted! Industry & Student Team have officially gone to Government to sanction money.`
    );
    setTimeout(() => {
      setToastMsg('');
      setSelectedSolutionForJointGrant(null);
      setActiveTab('approved');
    }, 1500);
  };

  const handleFinalizeEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForEval) return;

    finalizeIndustryEvaluation({
      solutionId: selectedSolutionForEval.id,
      problemId: selectedSolutionForEval.problemId,
      industryName: user?.organization || 'Andhra Smart Infrastructure Technologies Ltd.',
      evaluatorName: user?.name || 'Dr. V. Srinivas, VP of Engineering',
      technicalFeasibility: techFeas,
      scalability: scalability,
      costViability: costViab,
      manufacturability: manufacturability,
      deploymentFeasibility: deploymentFeas,
      expectedImpact: impactScore,
      feedback: feedback,
      verdict: 'Finalized'
    });

    setToastMsg(`Prototype finalized! Status updated to "Industry Prototype Finalized". Government notified for grant approval.`);
    setTimeout(() => {
      setToastMsg('');
      setSelectedSolutionForEval(null);
      setActiveTab('approved');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-100">
            <SamadhanLogo size="sm" showTagline={true} />
            <div className="mt-3 px-2 py-1 bg-teal-50 border border-teal-200/80 rounded-lg text-[11px] font-bold text-[#087D70] flex items-center gap-1.5">
              <span>🏭</span>
              <span>Industry Partner Portal</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('review')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'review'
                  ? 'bg-[#087D70] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4" />
                <span>Prototypes for Review</span>
              </div>
              {pendingReviewSolutions.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {pendingReviewSolutions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-[#087D70] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Approved Projects ({approvedSolutions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('collaborations')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'collaborations'
                  ? 'bg-[#087D70] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Academic Collaborations</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Portal Alerts</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#087D70]" />
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100 mb-3">
            <p className="text-xs font-bold text-[#073F68] truncate">
              {user?.name || 'Dr. V. Srinivas'}
            </p>
            <p className="text-[11px] text-[#087D70] truncate">
              {user?.organization || 'Andhra Smart Infrastructure'}
            </p>
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

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {toastMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-700 text-white font-bold text-sm shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab 1: Prototypes for Review (Section 17) */}
        {activeTab === 'review' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#087D70]">
                  Step 6: Industry Evaluation
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073F68] mt-1">
                  Prototypes Awaiting Industry Review ({pendingReviewSolutions.length})
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Student innovators have submitted functional designs. Vet them for scalability,
                  manufacturability, and cost before forwarding to Government for grant funding.
                </p>
              </div>
            </div>

            {pendingReviewSolutions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">All Prototypes Evaluated</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Check the Approved Projects tab to review finalized submissions and joint government proposals.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingReviewSolutions.map((sol) => {
                  const prob = db.problems.find((p) => p.id === sol.problemId);
                  const team = db.teams.find((t) => t.id === sol.teamId);
                  const pendingQueries = (sol.queries || []).filter((q) => q.status === 'pending');
                  const resolvedQueries = (sol.queries || []).filter((q) => q.status === 'resolved');

                  return (
                    <div
                      key={sol.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
                              Team: {sol.teamName}
                            </span>
                            <span className="text-xs text-purple-700 font-semibold">• {sol.collegeName}</span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              Revision v{sol.version || 1}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-slate-900">{sol.solutionName}</h3>
                          {prob && (
                            <p className="text-xs text-slate-500">
                              Civic Problem: <strong className="text-slate-700">{prob.id}: {prob.title}</strong> (📍 {prob.location})
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                            {sol.readinessLevel || 'TRL-5 Validated'}
                          </span>
                          {prob && <StatusBadge status={prob.status} size="sm" />}
                        </div>
                      </div>

                      {/* 2-Column Technical Overview */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Technical Prototype Specs (7 cols) */}
                        <div className="lg:col-span-7 space-y-3">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Prototype Technical Specification
                            </span>
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {sol.prototypeDescription}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Estimated Unit Cost</span>
                                <strong className="text-slate-900">₹{sol.estimatedCost.toLocaleString('en-IN')}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Technology Stack</span>
                                <strong className="text-slate-900 truncate block">
                                  {sol.technologiesUsed.join(', ')}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Documentation / CAD</span>
                                {sol.prototypeDocUrl ? (
                                  <a
                                    href={sol.prototypeDocUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#087D70] font-bold hover:underline inline-flex items-center gap-1"
                                  >
                                    <span>View Files</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  <span className="text-slate-400">Not attached</span>
                                )}
                              </div>
                            </div>

                            {sol.billOfMaterials && (
                              <div className="pt-2 border-t border-slate-200/70 text-[11px]">
                                <span className="text-slate-400 text-[10px] block">Bill of Materials (BOM):</span>
                                <span className="text-slate-700 font-mono text-[10px]">{sol.billOfMaterials}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Student Innovator Squad (5 cols) */}
                        <div className="lg:col-span-5 space-y-2">
                          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                              Student Innovation Squad
                            </span>
                            <p className="text-slate-700">
                              <strong>Lead Innovator:</strong> {team?.leaderName || 'Aditya Varma'}
                            </p>
                            <p className="text-slate-600">
                              <strong>Department:</strong> {team?.department || 'Mechanical & Mechatronics'}
                            </p>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Squad Members:</span>
                              <div className="flex flex-wrap gap-1">
                                {(team?.members || ['Aditya Varma', 'Pooja Reddy', 'K. Sai Charan']).map((m, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-900 text-[10px] font-semibold"
                                  >
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QUERY FEEDBACK LOOP STATUS BOXES */}
                      {/* Case A: Active pending queries sent to students */}
                      {pendingQueries.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 text-xs animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span>Query Loop Active — Sent to Student Team for Modification</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                              Awaiting Student Revision
                            </span>
                          </div>
                          <p className="text-amber-950 font-medium">
                            <strong>Query Mentioned:</strong> "{pendingQueries[0].queryText}"
                          </p>
                          {pendingQueries[0].requestedModifications && (
                            <p className="text-amber-900 text-[11px]">
                              <strong>Requested Modifications:</strong> {pendingQueries[0].requestedModifications}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Case B: Resolved queries where students modified and resubmitted */}
                      {resolvedQueries.length > 0 && pendingQueries.length === 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-emerald-900 font-bold">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Student Team Responded with Modified Prototype (v{sol.version})</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                              Ready for Endorsement
                            </span>
                          </div>
                          <p className="text-slate-700 text-xs">
                            <strong>Student Team Response:</strong> "{resolvedQueries[0].studentResponse}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons Row */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                        {/* 1. Raise Query Button */}
                        <button
                          onClick={() => handleOpenQueryModal(sol)}
                          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-700" />
                          <span>Mention Queries & Request Modification</span>
                        </button>

                        {/* 2. Direct Joint Submission to Government for Money Sanction (When Industry Likes Solution) */}
                        <button
                          onClick={() => handleOpenJointGrantModal(sol)}
                          className="px-5 py-2.5 bg-[#073F68] hover:bg-[#052d4b] text-white rounded-xl text-xs font-black shadow transition-all flex items-center gap-2 group"
                        >
                          <span className="text-base">🤝</span>
                          <span>Go to Government with Team to Sanction Money</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* 3. Metric Evaluation Button */}
                        <button
                          onClick={() => setSelectedSolutionForEval(sol)}
                          className="px-4 py-2.5 bg-[#087D70] hover:bg-[#065e54] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Award className="w-4 h-4 text-amber-300" />
                          <span>Evaluate Specs</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Approved Projects & Joint Proposals */}
        {activeTab === 'approved' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#073F68]">
                  Industry-Finalized & Joint Government Proposals ({approvedSolutions.length})
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Prototypes vetted by Industry and submitted jointly with student teams to the Government to sanction funds.
                </p>
              </div>

              {onSwitchToGovernment && (
                <button
                  onClick={onSwitchToGovernment}
                  className="px-4 py-2 bg-[#073F68] hover:bg-[#052d4b] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Switch to Govt Funding View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {approvedSolutions.map((sol) => {
                const prob = db.problems.find((p) => p.id === sol.problemId);
                const evalData = db.evaluations[sol.id];
                const jointProposal = sol.jointGrantProposal || (prob?.jointGrantProposalId && db.jointProposals ? db.jointProposals[prob.jointGrantProposalId] : null);

                return (
                  <div
                    key={sol.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">{sol.id}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {sol.teamName} ({sol.collegeName})
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">{sol.solutionName}</h3>
                        <p className="text-xs text-teal-800 font-semibold">
                          Vetted by {evalData?.industryName || 'Andhra Smart Infrastructure'}
                        </p>
                      </div>
                      {prob && <StatusBadge status={prob.status} />}
                    </div>

                    {/* Joint Proposal Banner */}
                    {jointProposal && (
                      <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🤝</span> Joint Grant Proposal Submitted to Government
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                            {prob?.fundingApproved ? 'Grant Sanctioned' : 'Awaiting Collector Sanction'}
                          </span>
                        </div>
                        <p className="text-indigo-900">
                          Industry Mentor <strong>{jointProposal.industryMentorName}</strong> and Student Lead <strong>{jointProposal.studentLeaderName}</strong> have jointly approached the District Administration to sanction funds for immediate deployment.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-medium text-[11px]">
                          <div>
                            <span className="text-indigo-600 block text-[10px]">Proposed Sanction</span>
                            <strong className="text-indigo-950 text-xs">₹{jointProposal.proposedSanctionAmount.toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span className="text-indigo-600 block text-[10px]">Projected Timeline</span>
                            <strong className="text-indigo-950">{jointProposal.projectedTimelineWeeks} Weeks</strong>
                          </div>
                          <div>
                            <span className="text-indigo-600 block text-[10px]">Endorsement Status</span>
                            <strong className="text-emerald-700">Verified by R&D</strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-indigo-800 bg-white/80 p-2 rounded-xl border border-indigo-100 italic">
                          "{jointProposal.industryEndorsementStatement}"
                        </p>
                      </div>
                    )}

                    {evalData && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Feasibility</span>
                          <strong className="text-slate-800">{evalData.technicalFeasibility}/5</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Scalability</span>
                          <strong className="text-slate-800">{evalData.scalability}/5</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Cost Viability</span>
                          <strong className="text-slate-800">{evalData.costViability}/5</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Manufacture</span>
                          <strong className="text-slate-800">{evalData.manufacturability}/5</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Deployment</span>
                          <strong className="text-slate-800">{evalData.deploymentFeasibility}/5</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Impact</span>
                          <strong className="text-slate-800">{evalData.expectedImpact}/5</strong>
                        </div>
                      </div>
                    )}

                    {evalData?.feedback && !jointProposal && (
                      <p className="text-xs text-slate-600 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                        <strong>Industry Feedback:</strong> "{evalData.feedback}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Collaborations */}
        {activeTab === 'collaborations' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#073F68]">Collegiate Innovation Hub Partners</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We partner with premier regional engineering faculties to incubate student prototypes from
              ideation stage into field-ready municipal hardware.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900">KL University Robotics Wing</h4>
                <p className="text-xs text-slate-500 mt-1">Autonomous asphalt pavers, road surface telemetry, pavement sensors.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900">Government Engineering College</h4>
                <p className="text-xs text-slate-500 mt-1">Sanitation robotics, bio-methanation digesters, smart canal lights.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: INDUSTRY EVALUATION (Section 18) */}
      {selectedSolutionForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-[#087D70] rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Industry Prototype Evaluation</h3>
                  <p className="text-xs text-slate-500">Solution: {selectedSolutionForEval.solutionName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSolutionForEval(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalizeEvaluation} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <p><strong>Team:</strong> {selectedSolutionForEval.teamName} ({selectedSolutionForEval.collegeName})</p>
                <p><strong>Estimated Cost:</strong> ₹{selectedSolutionForEval.estimatedCost.toLocaleString('en-IN')}</p>
                <p className="line-clamp-2"><strong>Specs:</strong> {selectedSolutionForEval.prototypeDescription}</p>
              </div>

              {/* 6 Metric Rating Selects */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Technical Feasibility</label>
                  <select
                    value={techFeas}
                    onChange={(e) => setTechFeas(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scalability</label>
                  <select
                    value={scalability}
                    onChange={(e) => setScalability(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Viability</label>
                  <select
                    value={costViab}
                    onChange={(e) => setCostViab(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturability</label>
                  <select
                    value={manufacturability}
                    onChange={(e) => setManufacturability(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deployment Feasibility</label>
                  <select
                    value={deploymentFeas}
                    onChange={(e) => setDeploymentFeas(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Impact</label>
                  <select
                    value={impactScore}
                    onChange={(e) => setImpactScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} / 5 Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Industry Evaluation Remarks & Deployment Recommendations *
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087D70]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSolutionForEval(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-[#087D70] hover:bg-[#065e54] rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalize Prototype for Government</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RAISE QUERY & REQUEST MODIFICATION FROM STUDENT TEAM */}
      {selectedSolutionForQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Engineering Feedback Loop
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Raise Technical Queries & Request Modification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mention technical or structural shortcomings to <strong>{selectedSolutionForQuery.teamName}</strong> ({selectedSolutionForQuery.collegeName}). The prototype will be sent back for engineering revision.
                </p>
              </div>
              <button
                onClick={() => setSelectedSolutionForQuery(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block">Prototype: {selectedSolutionForQuery.solutionName} (v{selectedSolutionForQuery.version || 1})</span>
              <span className="text-slate-600 text-[11px] block mt-0.5">Estimated Unit Cost: ₹{selectedSolutionForQuery.estimatedCost.toLocaleString('en-IN')}</span>
            </div>

            <form onSubmit={handleRaiseQuerySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mention Your Technical Query / Performance Deficiencies *
                </label>
                <textarea
                  rows={3}
                  required
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="E.g. Ingress protection is insufficient for monsoon conditions; battery discharge rate exceeds safe limits under peak sunlight..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specific Engineering Modifications Required by Student Team *
                </label>
                <textarea
                  rows={2}
                  required
                  value={requestedModifications}
                  onChange={(e) => setRequestedModifications(e.target.value)}
                  placeholder="E.g. Switch from open relays to IP67 sealed solid-state relays, add a heatsink to the inverter module..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modification Priority</label>
                  <select
                    value={queryPriority}
                    onChange={(e) => setQueryPriority(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="high">Critical / High (Must Fix)</option>
                    <option value="medium">Medium (Design Improvement)</option>
                    <option value="low">Low (Minor Advisory)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Evaluating Industry</label>
                  <input
                    type="text"
                    disabled
                    value={user?.organization || 'Andhra Smart Infrastructure'}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSolutionForQuery(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Queries to Student Team</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT JOINT GRANT PROPOSAL TO GOVERNMENT (WHEN INDUSTRY LIKES SOLUTION) */}
      {selectedSolutionForJointGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-black uppercase">
                  <span>🏛️</span> Joint Government Sanction Order
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Go to Government with Student Team to Sanction Money
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  As the Industry Partner, you endorse <strong>{selectedSolutionForJointGrant.solutionName}</strong> and jointly approach the Municipal / State Government to sanction seed capital & deployment funds.
                </p>
              </div>
              <button
                onClick={() => setSelectedSolutionForJointGrant(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Joint Collaboration Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Innovator Squad</span>
                <p className="font-extrabold text-slate-900">{selectedSolutionForJointGrant.teamName}</p>
                <p className="text-slate-600 text-[11px]">{selectedSolutionForJointGrant.collegeName}</p>
              </div>
              <div className="space-y-1 sm:border-l sm:border-indigo-200 sm:pl-3">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Industry Co-Signer</span>
                <p className="font-extrabold text-slate-900">{user?.organization || 'Andhra Smart Infrastructure'}</p>
                <p className="text-slate-600 text-[11px]">{user?.name || 'Dr. V. Srinivas, VP of Engineering'}</p>
              </div>
            </div>

            <form onSubmit={handleJointGrantSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Grant Money to Sanction from Government (INR ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={10000}
                      step={10000}
                      value={jointSanctionAmount}
                      onChange={(e) => setJointSanctionAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Recommended: Unit Prototype Cost × Initial Pilot Batch of 5-10 installations.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Projected Deployment Timeline (Weeks) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={24}
                    value={jointTimelineWeeks}
                    onChange={(e) => setJointTimelineWeeks(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Fabrication, calibration, on-site civic zone commissioning.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Joint Endorsement & Letter of Justification to District Collector *
                </label>
                <textarea
                  rows={3}
                  required
                  value={jointEndorsementStatement}
                  onChange={(e) => setJointEndorsementStatement(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  By submitting, a joint formal gazette proposal will be generated for the Municipal Administration. The Nodal Officer will review and release the sanctioned funds directly for implementation.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSolutionForJointGrant(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-black text-white bg-[#073F68] hover:bg-[#052d4b] rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <span className="text-base">🏛️</span>
                  <span>Submit Joint Proposal to Government</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SamadhanLogo } from '../../components/SamadhanLogo';
import { StatusBadge } from '../../components/StatusBadge';
import { Problem, StudentTeam, StudentSolution, PrototypeQuery } from '../../types';
import {
  loadDatabase,
  getCurrentUser,
  createStudentTeam,
  submitStudentSolution,
  respondToIndustryQuery
} from '../../data/storage';
import {
  GraduationCap,
  Users,
  Lightbulb,
  FileCheck,
  Bell,
  LogOut,
  MapPin,
  Sparkles,
  CheckCircle2,
  Building,
  Upload,
  ArrowRight,
  X,
  Send,
  HelpCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';

interface CollegePortalProps {
  onLogout: () => void;
  onOpenNotifications: () => void;
  onSwitchToIndustry?: () => void;
}

export const CollegePortal: React.FC<CollegePortalProps> = ({
  onLogout,
  onOpenNotifications,
  onSwitchToIndustry
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'teams' | 'submit' | 'mentorship'>('challenges');
  const [selectedProblemForTeam, setSelectedProblemForTeam] = useState<Problem | null>(null);
  const [selectedProblemForSolution, setSelectedProblemForSolution] = useState<Problem | null>(null);
  const [selectedTeamForPrototype, setSelectedTeamForPrototype] = useState<StudentTeam | null>(null);

  // Query Modification Modal State
  const [selectedQueryForMod, setSelectedQueryForMod] = useState<{
    query: PrototypeQuery;
    solution: StudentSolution;
    problem: Problem;
  } | null>(null);
  const [queryResponseText, setQueryResponseText] = useState('');
  const [modPrototypeDesc, setModPrototypeDesc] = useState('');
  const [modEstimatedCost, setModEstimatedCost] = useState<number>(0);
  const [modDocUrl, setModDocUrl] = useState('');

  // Form a Team Modal State
  const [teamName, setTeamName] = useState('SAMADHAN Innovators');
  const [leaderName, setLeaderName] = useState('Aditya Varma (Final Year Civil & Robotics)');
  const [membersInput, setMembersInput] = useState('Aditya Varma, Pooja Reddy, K. Sai Charan, Sneha Patel');
  const [collegeName, setCollegeName] = useState('KL University (Smart Infrastructure Innovation Lab)');
  const [department, setDepartment] = useState('Robotics & Structural Materials Engineering');

  // Submit Solution / Prototype Form State
  const [solutionName, setSolutionName] = useState('Rapid Eco-Bitumen Cold-Patching Unit');
  const [targetIndustry, setTargetIndustry] = useState('Andhra Smart Infrastructure Technologies Ltd.');
  const [readinessLevel, setReadinessLevel] = useState('TRL-5: Working Sub-scale Hardware Validated');
  const [billOfMaterials, setBillOfMaterials] = useState(
    'ESP32 IoT Controller, Micro-compressor, Heated Nozzle, Pavement temperature sensors'
  );
  const [prototypeDocUrl, setPrototypeDocUrl] = useState('https://github.com/samadhan-innovators/rapid-cold-bitumen-v1');
  const [solutionDesc, setSolutionDesc] = useState(
    'Automated mobile asphalt-dispensing unit that applies recycled plastic-infused cold bitumen that sets in 25 mins without heavy rollers.'
  );
  const [prototypeDesc, setPrototypeDesc] = useState(
    'Working 1:1 scale pneumatic applicator cart equipped with compaction roller and microwave pavement binder heating.'
  );
  const [techUsed, setTechUsed] = useState('Plastic-Enhanced Cold Bitumen, ESP32 IoT Dispenser, Pneumatic Compactor');
  const [estimatedCost, setEstimatedCost] = useState(285000);
  const [expectedImpact, setExpectedImpact] = useState('90% reduction in road repair turnaround time; 70% cheaper than traditional asphalt mobilization.');
  const [toastMsg, setToastMsg] = useState('');

  const db = loadDatabase();
  const user = getCurrentUser();

  // ONLY government-verified problems appear in Available Challenges (Requirement 13)
  const availableChallenges = db.problems.filter((p) => p.verified);
  const myTeams = db.teams;
  const mySolutions = db.solutions;

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemForTeam) return;

    const membersArray = membersInput.split(',').map((m) => m.trim()).filter(Boolean);

    createStudentTeam(
      selectedProblemForTeam.id,
      teamName,
      leaderName,
      membersArray,
      collegeName,
      department
    );

    setToastMsg(`Team "${teamName}" registered for ${selectedProblemForTeam.id}! Status: "Student Team Formed".`);
    setTimeout(() => {
      setToastMsg('');
      setSelectedProblemForTeam(null);
      setActiveTab('teams');
    }, 1500);
  };

  const handleOpenSubmitPrototype = (problem: Problem, team?: StudentTeam) => {
    setSelectedProblemForSolution(problem);
    if (team) {
      setSelectedTeamForPrototype(team);
    } else {
      const foundTeam = db.teams.find((t) => t.problemId === problem.id);
      setSelectedTeamForPrototype(foundTeam || null);
    }
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemForSolution) return;

    const team = selectedTeamForPrototype || db.teams.find((t) => t.problemId === selectedProblemForSolution.id) || db.teams[0];

    submitStudentSolution({
      problemId: selectedProblemForSolution.id,
      teamId: team ? team.id : 'TEAM-801',
      solutionName,
      description: solutionDesc,
      prototypeDescription: prototypeDesc,
      technologiesUsed: techUsed.split(',').map((t) => t.trim()),
      estimatedCost,
      expectedImpact,
      targetIndustry,
      readinessLevel,
      billOfMaterials,
      prototypeDocUrl
    });

    setToastMsg(`Prototype submitted to ${targetIndustry}! Status: "Under Industry Review".`);
    setTimeout(() => {
      setToastMsg('');
      setSelectedProblemForSolution(null);
      setSelectedTeamForPrototype(null);
      setActiveTab('teams');
    }, 1500);
  };

  const handleOpenQueryModModal = (query: PrototypeQuery, solution: StudentSolution, problem: Problem) => {
    setSelectedQueryForMod({ query, solution, problem });
    setQueryResponseText('');
    setModPrototypeDesc(solution.prototypeDescription);
    setModEstimatedCost(solution.estimatedCost);
    setModDocUrl(solution.prototypeDocUrl || '');
  };

  const handleSubmitQueryModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQueryForMod) return;

    const { query, solution, problem } = selectedQueryForMod;

    respondToIndustryQuery({
      solutionId: solution.id,
      problemId: problem.id,
      queryId: query.id,
      studentResponse: queryResponseText,
      updatedPrototypeDescription: modPrototypeDesc,
      updatedCost: modEstimatedCost,
      updatedDocUrl: modDocUrl
    });

    // Also inform server API
    fetch(`/api/problems/${problem.id}/solutions/${solution.id}/queries/${query.id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentResponse: queryResponseText,
        updatedPrototypeDescription: modPrototypeDesc,
        updatedCost: modEstimatedCost,
        updatedDocUrl: modDocUrl
      })
    }).catch((err) => console.warn('[API] Query respond failed:', err));

    setToastMsg(`Modifications sent back to ${query.industryName}! Reviewer notified.`);
    setTimeout(() => {
      setToastMsg('');
      setSelectedQueryForMod(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-100">
            <SamadhanLogo size="sm" showTagline={true} />
            <div className="mt-3 px-2 py-1 bg-purple-50 border border-purple-200/80 rounded-lg text-[11px] font-bold text-purple-700 flex items-center gap-1.5">
              <span>🎓</span>
              <span>University / College Portal</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4" />
                <span>Available Challenges</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {availableChallenges.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'teams'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Teams ({myTeams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'submit'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Submitted Solutions ({mySolutions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mentorship')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'mentorship'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Industry Mentorship</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Challenge Alerts</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-purple-600" />
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 mb-3">
            <p className="text-xs font-bold text-purple-950 truncate">
              {user?.name || 'Student Innovators'}
            </p>
            <p className="text-[11px] text-purple-700 truncate">
              {user?.organization || 'KL University / Govt College'}
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
          <div className="mb-6 p-4 rounded-2xl bg-purple-700 text-white font-bold text-sm shadow-md flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab 1: Available Challenges (Section 13 & 14) */}
        {activeTab === 'challenges' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Government-Verified Problems
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#073F68] mt-1">
                Available Civic Challenges Near You
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                These problems have completed Step 1 AI screening and Step 2 official Government ground
                verification. Form a collegiate team to build a working prototype.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableChallenges.map((prob) => {
                const colleges = prob.matchedColleges || [
                  { name: 'Government Engineering College', distance: '2.3 km away' },
                  { name: 'KL University', distance: '3.1 km away' },
                  { name: 'VSR College of Engineering', distance: '4.5 km away' }
                ];

                return (
                  <div
                    key={prob.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {prob.photo && (
                        <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 relative">
                          <img
                            src={prob.photo}
                            alt={prob.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow">
                            {prob.category}
                          </span>
                          <span className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Govt Verified</span>
                          </span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">ID: {prob.id}</span>
                          <StatusBadge status={prob.status} size="sm" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{prob.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {prob.description}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#073F68]" />
                          <span>{prob.location}</span>
                        </p>
                      </div>

                      {/* Nearby College Matching (Section 14) */}
                      <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 text-xs">
                        <span className="text-[11px] font-bold text-purple-900 block mb-1">
                          Mapped Proximity Institutions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {colleges.slice(0, 3).map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-purple-200 text-purple-950 rounded text-[11px] font-medium"
                            >
                              {col.name} ({col.distance})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedProblemForTeam(prob)}
                        className="flex-1 py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Form a Team</span>
                      </button>

                      <button
                        onClick={() => setSelectedProblemForSolution(prob)}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Solution</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: My Teams (Section 15) */}
        {activeTab === 'teams' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#073F68]">
                Student Innovation Teams ({myTeams.length})
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Collegiate squads actively engineering prototypes for verified civic challenges.
              </p>
            </div>

            <div className="space-y-6">
              {myTeams.map((team) => {
                const prob = db.problems.find((p) => p.id === team.problemId);
                const sol = db.solutions.find((s) => s.teamId === team.id || s.problemId === team.problemId);
                const pendingQueries = (sol?.queries || []).filter((q) => q.status === 'pending');
                const resolvedQueries = (sol?.queries || []).filter((q) => q.status === 'resolved');

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
                          {team.id}
                        </span>
                        <h3 className="text-lg font-black text-slate-900">{team.teamName}</h3>
                        <span className="text-xs text-purple-700 font-semibold">• {team.collegeName}</span>
                      </div>
                      {prob && <StatusBadge status={prob.status} size="sm" />}
                    </div>

                    {/* 2-Column Responsive Layout: Left = Team & Target, Right = Prototype Submission & Review Column */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Column: Team Squad Details (5 cols) */}
                      <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>
                            <strong className="text-slate-900">Lead Innovator:</strong> {team.leaderName}
                          </p>
                          <p>
                            <strong className="text-slate-900">Department:</strong> {team.department}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Team Innovators
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {team.members.map((m, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {prob && (
                          <div className="mt-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs">
                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
                              Assigned Civic Challenge
                            </span>
                            <span className="font-bold text-purple-950 block mt-0.5">
                              {prob.id}: {prob.title}
                            </span>
                            <span className="text-slate-500 text-[11px] block mt-0.5">
                              📍 {prob.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Dedicated Prototype Submission & Industry Review Column (7 cols) */}
                      <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Prototype & Industry Pipeline Column
                              </span>
                            </div>
                            {sol && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                Revision v{sol.version || 1}
                              </span>
                            )}
                          </div>

                          {/* CASE 1: NO PROTOTYPE SUBMITTED YET */}
                          {!sol && (
                            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 text-center space-y-3">
                              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Lightbulb className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">No Prototype Submitted to Industry Yet</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                                  Your squad is formed! Next step: Add your technical prototype, bill of materials, and CAD documentation to submit for industry partner inspection.
                                </p>
                              </div>
                              {prob && (
                                <button
                                  onClick={() => handleOpenSubmitPrototype(prob, team)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073F68] hover:bg-[#052d4b] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                  <Send className="w-3.5 h-3.5 text-amber-300" />
                                  <span>➕ Add Prototype & Submit to Industry</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* CASE 2: PROTOTYPE ALREADY SUBMITTED */}
                          {sol && (
                            <div className="space-y-3">
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-extrabold text-sm text-slate-900">{sol.solutionName}</h4>
                                    <p className="text-slate-500 text-[11px] mt-0.5">
                                      Vetting Partner: <strong className="text-slate-800">{sol.targetIndustry || 'Andhra Smart Infrastructure Technologies'}</strong>
                                    </p>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                                    {sol.readinessLevel || 'TRL-5 Validated'}
                                  </span>
                                </div>

                                <p className="text-slate-600 text-xs line-clamp-2">
                                  {sol.prototypeDescription}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                                  <span>
                                    💰 Estimated: <strong className="text-slate-800">₹{sol.estimatedCost.toLocaleString('en-IN')}</strong>
                                  </span>
                                  {sol.billOfMaterials && (
                                    <span className="truncate max-w-[220px]">
                                      🔩 BOM: {sol.billOfMaterials}
                                    </span>
                                  )}
                                  {sol.prototypeDocUrl && (
                                    <a
                                      href={sol.prototypeDocUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[#087D70] font-bold hover:underline"
                                    >
                                      <span>CAD / Specs</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* SUB-CASE A: INDUSTRY RAISED QUERIES (ACTION REQUIRED) */}
                              {pendingQueries.length > 0 && prob && (
                                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                                  <div className="flex items-start gap-2.5">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-black uppercase tracking-wider text-amber-900">
                                          Industry Queries Raised (Modifications Required)
                                        </h5>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                                          Action Pending
                                        </span>
                                      </div>
                                      <p className="text-xs text-amber-800 mt-1">
                                        <strong>{pendingQueries[0].industryName}:</strong> "{pendingQueries[0].queryText}"
                                      </p>
                                      {pendingQueries[0].requestedModifications && (
                                        <div className="mt-1.5 p-2 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                                          <strong>Requested Modifications:</strong> {pendingQueries[0].requestedModifications}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="pt-2 flex justify-end">
                                    <button
                                      onClick={() => handleOpenQueryModModal(pendingQueries[0], sol, prob)}
                                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                      <span>Respond & Submit Modified Prototype</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* SUB-CASE B: RESOLVED QUERIES HISTORY */}
                              {resolvedQueries.length > 0 && pendingQueries.length === 0 && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
                                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Technical Query Resolved (v{sol.version})</span>
                                  </div>
                                  <p className="text-slate-600 text-[11px]">
                                    <strong>Team Response:</strong> "{resolvedQueries[0].studentResponse}"
                                  </p>
                                </div>
                              )}

                              {/* SUB-CASE C: JOINT GRANT SANCTION PROPOSED TO GOVERNMENT */}
                              {(sol.jointGrantProposal || prob?.jointGrantProposed) && (
                                <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 shadow-sm space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                                      <span>🤝</span> Joint Grant Proposal Submitted to Government
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                                      Pending Collector Sanction
                                    </span>
                                  </div>
                                  <p className="text-indigo-900 leading-tight">
                                    Industry partner <strong>{sol.jointGrantProposal?.industryName || 'Industry Evaluator'}</strong> liked your solution and went directly to Government with your student squad to sanction money!
                                  </p>
                                  <div className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center justify-between">
                                    <span>Proposed Grant: <strong>₹{(sol.jointGrantProposal?.proposedSanctionAmount || 350000).toLocaleString('en-IN')}</strong></span>
                                    <span className="text-[11px] text-slate-500">Est. Timeline: {sol.jointGrantProposal?.projectedTimelineWeeks || 4} wks</span>
                                  </div>
                                </div>
                              )}

                              {/* SUB-CASE D: GOVERNMENT SANCTION APPROVED */}
                              {prob?.fundingApproved && (
                                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between text-emerald-900 font-black">
                                    <span className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span>Government Sanction Order Disbursed!</span>
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-950">
                                      ₹{(prob.fundingAmount || 300000).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <p className="text-emerald-800 text-[11px]">
                                    Municipal Innovation Grant sanctioned under official order. Materials mobilization and deployment on ground ready.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Submitted Solutions */}
        {activeTab === 'submit' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#073F68]">
                  Submitted Solutions ({mySolutions.length})
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Prototypes currently under industry technical evaluation or approved for grant funding.
                </p>
              </div>

              {onSwitchToIndustry && (
                <button
                  onClick={onSwitchToIndustry}
                  className="px-4 py-2 bg-[#087D70] hover:bg-[#065e54] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Switch to Industry Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {mySolutions.map((sol) => {
                const prob = db.problems.find((p) => p.id === sol.problemId);
                const evalData = db.evaluations[sol.id];
                return (
                  <div
                    key={sol.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400">ID: {sol.id}</span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">{sol.solutionName}</h3>
                        <p className="text-xs text-purple-700 font-semibold">
                          By Team {sol.teamName} • {sol.collegeName}
                        </p>
                      </div>
                      {prob && <StatusBadge status={prob.status} />}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {sol.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Estimated Unit Cost</span>
                        <strong className="text-slate-800">
                          ₹{sol.estimatedCost.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Expected Impact</span>
                        <strong className="text-slate-800">{sol.expectedImpact}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tech Stack</span>
                        <strong className="text-slate-800">{sol.technologiesUsed.join(', ')}</strong>
                      </div>
                    </div>

                    {evalData && (
                      <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#087D70] uppercase tracking-wider">
                            Industry Verdict: {evalData.verdict}
                          </span>
                          <span className="text-slate-500">By {evalData.industryName}</span>
                        </div>
                        <p className="text-slate-700">"{evalData.feedback}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Mentorship */}
        {activeTab === 'mentorship' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#073F68]">Industry Mentorship & Fabrication Cells</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Connect with vetted hardware engineers, municipal materials consultants, and smart sensor
              manufacturers to polish your prototypes before final collector grant disbursement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900">Andhra Smart Infrastructure R&D</h4>
                <p className="text-xs text-slate-500 mt-1">Materials engineering, cold bitumen formulation, and road sensor telemetry.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900">GreenGrid Technologies</h4>
                <p className="text-xs text-slate-500 mt-1">Solar LiFePO4 micro-controllers, LoRaWAN mesh gateways, and water pipeline telemetry.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Form a Team (Section 15) */}
      {selectedProblemForTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Form a Student Innovation Team</h3>
                  <p className="text-xs text-slate-500">Problem ID: {selectedProblemForTeam.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProblemForTeam(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  placeholder="e.g., SAMADHAN Innovators"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Team Leader *
                </label>
                <input
                  type="text"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Team Members (comma-separated) *
                </label>
                <input
                  type="text"
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  required
                  placeholder="Aditya Varma, Pooja Reddy, K. Sai Charan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  University / College *
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department / Lab
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProblemForTeam(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow transition-colors"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Submit Student Solution / Prototype to Industry */}
      {selectedProblemForSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Submit Prototype to Industry Partner</h3>
                  <p className="text-xs text-slate-500">For {selectedProblemForSolution.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProblemForSolution(null);
                  setSelectedTeamForPrototype(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Prototype Name *
                  </label>
                  <input
                    type="text"
                    value={solutionName}
                    onChange={(e) => setSolutionName(e.target.value)}
                    required
                    placeholder="e.g. Rapid Eco-Bitumen Cold-Patching Unit"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Industry Partner *
                  </label>
                  <select
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  >
                    <option value="Andhra Smart Infrastructure Technologies Ltd.">Andhra Smart Infrastructure Technologies Ltd.</option>
                    <option value="L&T Sustainable Infrastructure R&D">L&T Sustainable Infrastructure R&D</option>
                    <option value="GreenGrid Urban Mobility Systems">GreenGrid Urban Mobility Systems</option>
                    <option value="Municipal Engineering Labs">Municipal Engineering Labs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Technology Readiness Level (TRL) *
                  </label>
                  <select
                    value={readinessLevel}
                    onChange={(e) => setReadinessLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  >
                    <option value="TRL-4: Component / Breadboard Lab Validated">TRL-4: Component / Breadboard Lab Validated</option>
                    <option value="TRL-5: Working Sub-scale Hardware Validated">TRL-5: Working Sub-scale Hardware Validated</option>
                    <option value="TRL-6: Prototype Tested in Relevant Field Environment">TRL-6: Prototype Tested in Relevant Field Environment</option>
                    <option value="TRL-7: Integrated Operational Prototype">TRL-7: Integrated Operational Prototype</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Estimated Production Budget (INR ₹) *
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Prototype Technical Specifications *
                </label>
                <textarea
                  rows={2}
                  value={prototypeDesc}
                  onChange={(e) => setPrototypeDesc(e.target.value)}
                  required
                  placeholder="Detail working components, mechanism, power delivery, sensors, or structural materials..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Component Bill of Materials (BOM)
                </label>
                <input
                  type="text"
                  value={billOfMaterials}
                  onChange={(e) => setBillOfMaterials(e.target.value)}
                  placeholder="e.g. ESP32 Controller, Micro-compressor, Heated Nozzle, Pavement sensors"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    CAD / GitHub / Documentation URL
                  </label>
                  <input
                    type="url"
                    value={prototypeDocUrl}
                    onChange={(e) => setPrototypeDocUrl(e.target.value)}
                    placeholder="https://github.com/... or Google Drive CAD link"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Core Technologies *
                  </label>
                  <input
                    type="text"
                    value={techUsed}
                    onChange={(e) => setTechUsed(e.target.value)}
                    required
                    placeholder="e.g. Cold Bitumen, ESP32 IoT, Compactor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Expected Civic & Municipal Impact *
                </label>
                <input
                  type="text"
                  value={expectedImpact}
                  onChange={(e) => setExpectedImpact(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073F68]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProblemForSolution(null);
                    setSelectedTeamForPrototype(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-[#073F68] hover:bg-[#052d4b] rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Submit Prototype to Industry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Review Industry Queries & Submit Modified Prototype */}
      {selectedQueryForMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Industry Queries & Modification Request</h3>
                  <p className="text-xs text-slate-500">
                    Query from {selectedQueryForMod.query.industryName} ({selectedQueryForMod.query.evaluatorName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQueryForMod(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 mb-4 space-y-2 text-xs">
              <div>
                <span className="font-extrabold uppercase tracking-wider text-amber-900 block text-[10px]">
                  Technical Query / Concerns Raised
                </span>
                <p className="text-amber-950 font-medium mt-0.5">"{selectedQueryForMod.query.queryText}"</p>
              </div>

              {selectedQueryForMod.query.requestedModifications && (
                <div className="pt-2 border-t border-amber-200/70">
                  <span className="font-extrabold uppercase tracking-wider text-amber-900 block text-[10px]">
                    Specific Modifications Requested
                  </span>
                  <p className="text-amber-950 font-medium mt-0.5">
                    {selectedQueryForMod.query.requestedModifications}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitQueryModification} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student Team Response to Queries *
                </label>
                <textarea
                  rows={3}
                  value={queryResponseText}
                  onChange={(e) => setQueryResponseText(e.target.value)}
                  required
                  placeholder="Explain the engineering modifications, component replacements, safety validations, or cost reductions made to address the query..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Updated Prototype Specifications (Revision v{(selectedQueryForMod.solution.version || 1) + 1}) *
                </label>
                <textarea
                  rows={2}
                  value={modPrototypeDesc}
                  onChange={(e) => setModPrototypeDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Updated Estimated Cost (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={modEstimatedCost}
                    onChange={(e) => setModEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Updated CAD / Schematic URL
                  </label>
                  <input
                    type="url"
                    value={modDocUrl}
                    onChange={(e) => setModDocUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedQueryForMod(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Revised Prototype to Industry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

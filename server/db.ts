import fs from 'fs';
import path from 'path';
import {
  SamadhanDatabase,
  Problem,
  AIAnalysisReport,
  StudentSolution,
  IndustryEvaluation,
  FundingDetails,
  NotificationItem,
  ProblemCategory,
  PriorityLevel,
  UserRole,
  PrototypeQuery,
  JointGrantProposal
} from '../src/types';
import { INITIAL_DATABASE, DEFAULT_COLLEGES } from '../src/data/initialData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'samadhan_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function loadServerDatabase(): SamadhanDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.problems)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[DB] Error loading database file, reinitializing with defaults:', err);
  }

  // If not exists or invalid, save and return INITIAL_DATABASE
  saveServerDatabase(INITIAL_DATABASE);
  return JSON.parse(JSON.stringify(INITIAL_DATABASE));
}

export function saveServerDatabase(db: SamadhanDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Error saving database file:', err);
  }
}

export function resetServerDatabase(): SamadhanDatabase {
  const freshDb = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  saveServerDatabase(freshDb);
  return freshDb;
}

// AI Duplicate Check and Similarity Assessment
function calculateSimilarity(
  newTitle: string,
  newDesc: string,
  newLoc: string,
  newCat: ProblemCategory,
  existing: Problem
): { score: number; reason: string } {
  const normalize = (text: string) =>
    (text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const newWords = new Set([...normalize(newTitle), ...normalize(newDesc)]);
  const existWords = new Set([...normalize(existing.title), ...normalize(existing.description)]);

  let commonCount = 0;
  for (const word of newWords) {
    if (existWords.has(word)) commonCount++;
  }

  const tokenScore = Math.min(50, Math.round((commonCount / Math.max(1, newWords.size)) * 60));

  const loc1 = (newLoc || '').toLowerCase();
  const loc2 = (existing.location || '').toLowerCase();
  const locWords = normalize(loc1);
  let locMatches = 0;
  for (const w of locWords) {
    if (loc2.includes(w)) locMatches++;
  }
  const locScore = locMatches > 0 ? Math.min(35, locMatches * 15) : 0;

  const catScore = newCat === existing.category ? 15 : 0;
  const totalScore = Math.min(99, tokenScore + locScore + catScore);

  let reason = '';
  if (totalScore >= 55) {
    if (locScore > 0 && catScore > 0) {
      reason = `High spatial proximity (${locMatches} location keywords matched) in same civic category (${newCat}).`;
    } else if (tokenScore >= 35) {
      reason = `Substantial descriptive overlap (${commonCount} matching problem terms) with existing ticket ${existing.id}.`;
    } else {
      reason = `Corroborating civic report matching existing incident parameters in ${existing.location}.`;
    }
  } else {
    reason = 'Insufficient overlap; classified as independent civic problem.';
  }

  return { score: totalScore, reason };
}

export function createOrMergeProblemOnServer(input: {
  title: string;
  description: string;
  location: string;
  category: ProblemCategory;
  priority: PriorityLevel;
  photo?: string;
  citizenName: string;
  citizenEmail: string;
}): { problem: Problem; aiReport: AIAnalysisReport; isCombined: boolean; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const now = new Date().toISOString();

  // Screen against existing non-solved problems
  let bestMatch: { problem: Problem; score: number; reason: string } | null = null;
  const activeExisting = db.problems.filter((p) => p.status !== 'Problem Solved' && p.status !== 'Rejected');

  for (const existing of activeExisting) {
    const { score, reason } = calculateSimilarity(
      input.title,
      input.description,
      input.location,
      input.category,
      existing
    );
    if (score >= 55) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { problem: existing, score, reason };
      }
    }
  }

  if (bestMatch) {
    // COMBINE / MERGE INTO EXISTING MASTER PROBLEM
    const target = bestMatch.problem;
    const currentCount = target.communityReportCount || 1;
    const updatedCount = currentCount + 1;

    const newReportId = `REP-${Date.now().toString().slice(-4)}`;
    const additionalReport = {
      id: newReportId,
      citizenName: input.citizenName,
      citizenEmail: input.citizenEmail,
      timestamp: now,
      description: input.description,
      photo: input.photo,
      locationDetails: input.location,
      similarityScore: bestMatch.score,
      similarityReason: bestMatch.reason
    };

    const updatedReports = [...(target.additionalReports || []), additionalReport];
    const updatedEmails = Array.from(new Set([...(target.reporterEmails || [target.citizenEmail || '']), input.citizenEmail]));

    // Escalate priority if multiple citizens report
    let escalatedPriority = target.priority;
    if (updatedCount >= 3) {
      escalatedPriority = 'High';
    } else if (updatedCount >= 2 && target.priority === 'Low') {
      escalatedPriority = 'Medium';
    }

    const updatedProblem: Problem = {
      ...target,
      communityReportCount: updatedCount,
      isConsolidatedMaster: true,
      additionalReports: updatedReports,
      reporterEmails: updatedEmails,
      priority: escalatedPriority,
      updatedAt: now
    };

    const problemIndex = db.problems.findIndex((p) => p.id === target.id);
    if (problemIndex !== -1) {
      db.problems[problemIndex] = updatedProblem;
    }

    // AI Analysis report showing consolidation
    const aiReport: AIAnalysisReport = {
      problemId: target.id,
      duplicateDetected: true,
      duplicateProbability: bestMatch.score,
      duplicateMatches: [target.id],
      matchedExistingProblemId: target.id,
      matchedExistingProblemTitle: target.title,
      isCombinedIntoExisting: true,
      consolidationSummary: `AI detected previous verified record ${target.id} at "${target.location}". Instead of creating duplicate tickets, your report was combined to strengthen community urgency (Total: ${updatedCount} reports).`,
      suggestedCategory: target.category,
      detectedProblemType: target.problemType,
      severity: escalatedPriority === 'High' ? 'Critical' : 'High',
      priority: escalatedPriority,
      evidenceQuality: input.photo ? 'Sufficient' : 'Moderate',
      mediaRelevance: input.photo
        ? 'Photographic evidence matches known geographic scene coordinates and severity criteria.'
        : 'Text description provided; cross-referenced with previous photo telemetry.',
      confidenceScore: bestMatch.score,
      recommendation: `Merged into Master Problem ${target.id}. Total citizen reports increased to ${updatedCount}. Escalated to municipal engineers for prioritized execution.`,
      analyzedAt: now
    };

    db.aiReports[target.id] = aiReport;

    // Add Notification for Citizen
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-c`,
      title: `Report Consolidated with ${target.id}`,
      message: `Your report for "${input.title}" matches existing record "${target.title}". Combined into master ticket with ${updatedCount} community testimonies.`,
      timestamp: now,
      targetRole: 'citizen',
      targetEmail: input.citizenEmail,
      problemId: target.id,
      read: false,
      type: 'info'
    });

    // Add Notification for Government
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-g`,
      title: `Urgency Escalated: ${target.id} (${updatedCount} Reports)`,
      message: `Multiple citizens have now reported "${target.title}". Community report count reached ${updatedCount}.`,
      timestamp: now,
      targetRole: 'government',
      problemId: target.id,
      read: false,
      type: 'alert'
    });

    saveServerDatabase(db);
    return { problem: updatedProblem, aiReport, isCombined: true, database: db };
  }

  // CREATE NEW PROBLEM (No duplicate match found)
  const newId = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
  const matchedColleges = DEFAULT_COLLEGES[input.category] || DEFAULT_COLLEGES['Other'];

  const newProblem: Problem = {
    id: newId,
    title: input.title,
    description: input.description,
    location: input.location,
    coordinates: { lat: 16.5062, lng: 80.648 },
    category: input.category,
    problemType: `${input.category} Hazard`,
    priority: input.priority,
    photo: input.photo,
    evidence: input.photo ? 'Sufficient' : 'Moderate',
    aiDone: true,
    duplicate: false,
    aiConfidence: 91,
    verified: false,
    collegeNotified: false,
    matchedColleges,
    teamFormed: false,
    solutionSubmitted: false,
    industryReviewed: false,
    prototypeFinalized: false,
    fundingApproved: false,
    implemented: false,
    status: 'AI Analysis Completed',
    createdAt: now,
    updatedAt: now,
    citizenName: input.citizenName,
    citizenEmail: input.citizenEmail,
    communityReportCount: 1,
    isConsolidatedMaster: false,
    reporterEmails: [input.citizenEmail],
    additionalReports: []
  };

  db.problems.unshift(newProblem);

  const aiReport: AIAnalysisReport = {
    problemId: newId,
    duplicateDetected: false,
    duplicateProbability: 8,
    isCombinedIntoExisting: false,
    suggestedCategory: input.category,
    detectedProblemType: `${input.category} Hazard`,
    severity: input.priority === 'High' ? 'High' : input.priority === 'Medium' ? 'Medium' : 'Low',
    priority: input.priority,
    evidenceQuality: input.photo ? 'Sufficient' : 'Moderate',
    mediaRelevance: 'Uploaded media and geolocation cross-referenced. No duplicate detected.',
    confidenceScore: 91,
    recommendation: 'Step 1 screening complete. Forwarded for Step 2 official Government ground verification.',
    analyzedAt: now
  };

  db.aiReports[newId] = aiReport;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-c`,
    title: `Problem ${newId} Submitted & AI Analyzed`,
    message: `Your report "${input.title}" passed Step 1 duplicate screening and has been sent to Government for field verification.`,
    timestamp: now,
    targetRole: 'citizen',
    targetEmail: input.citizenEmail,
    problemId: newId,
    read: false,
    type: 'info'
  });

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-g`,
    title: `New Problem Pending Verification: ${newId}`,
    message: `Citizen ${input.citizenName} reported "${input.title}" at ${input.location}. Step 2 ground inspection required.`,
    timestamp: now,
    targetRole: 'government',
    problemId: newId,
    read: false,
    type: 'alert'
  });

  saveServerDatabase(db);
  return { problem: newProblem, aiReport, isCombined: false, database: db };
}

export function verifyProblemOnServer(
  problemId: string,
  remarks: string,
  verifiedBy: string
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  problem.verified = true;
  problem.governmentRemarks = remarks;
  problem.collegeNotified = true;
  problem.status = 'Nearby Colleges Notified';
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-c`,
    title: `Problem ${problem.id} Verified by Government`,
    message: `Nodal officer confirmed ground validity: "${remarks}". Challenge broadcasted to engineering colleges.`,
    timestamp: now,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-col`,
    title: `New Civic Challenge Broadcast: ${problem.id}`,
    message: `Problem "${problem.title}" in ${problem.location} is verified. Student engineering teams can now form and submit solutions.`,
    timestamp: now,
    targetRole: 'college',
    problemId: problem.id,
    read: false,
    type: 'info'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function rejectProblemOnServer(
  problemId: string,
  remarks: string,
  rejectedBy: string
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  problem.verified = false;
  problem.governmentRemarks = remarks;
  problem.status = 'Rejected';
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-c`,
    title: `Problem ${problem.id} Status Update`,
    message: `Ground inspection review concluded: ${remarks}.`,
    timestamp: now,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: problem.id,
    read: false,
    type: 'warning'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function submitPrototypeOnServer(
  problemId: string,
  solutionData: {
    teamName: string;
    collegeName: string;
    solutionName: string;
    description: string;
    prototypeDescription: string;
    technologiesUsed: string[];
    estimatedCost: number;
    prototypePhoto?: string;
  }
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  const solutionId = `SOL-${Date.now().toString().slice(-4)}`;
  const teamId = `TEAM-${Date.now().toString().slice(-3)}`;

  problem.teamFormed = true;
  problem.teamId = teamId;
  problem.solutionSubmitted = true;
  problem.solutionId = solutionId;
  problem.status = 'Under Industry Review';
  problem.updatedAt = now;

  const newSolution: StudentSolution = {
    id: solutionId,
    problemId: problem.id,
    teamId,
    teamName: solutionData.teamName,
    collegeName: solutionData.collegeName,
    solutionName: solutionData.solutionName,
    description: solutionData.description,
    prototypeDescription: solutionData.prototypeDescription,
    technologiesUsed: solutionData.technologiesUsed,
    estimatedCost: solutionData.estimatedCost,
    expectedImpact: 'High Civic & Infrastructure Impact',
    prototypeImage: solutionData.prototypePhoto,
    submittedAt: now
  };

  db.solutions.unshift(newSolution);

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-ind`,
    title: `Solution Submitted for Review: ${problem.id}`,
    message: `Team "${solutionData.teamName}" from ${solutionData.collegeName} submitted prototype "${solutionData.solutionName}". Industry evaluation required.`,
    timestamp: now,
    targetRole: 'industry',
    problemId: problem.id,
    read: false,
    type: 'info'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function reviewSolutionOnServer(
  problemId: string,
  solutionId: string,
  evalData: {
    partnerName: string;
    partnerCompany: string;
    technicalFeasibility: 'Highly Feasible' | 'Feasible with Modifications' | 'Infeasible';
    manufacturabilityRating: number;
    estimatedMassProductionCost: number;
    feedback: string;
    approvedForScaling: boolean;
  }
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  problem.industryReviewed = true;
  problem.prototypeFinalized = evalData.approvedForScaling;
  problem.status = evalData.approvedForScaling
    ? 'Industry Prototype Finalized'
    : 'Under Industry Review';
  problem.updatedAt = now;

  const evaluation: IndustryEvaluation = {
    id: `EVAL-${Date.now().toString().slice(-4)}`,
    solutionId,
    problemId,
    industryName: evalData.partnerCompany,
    evaluatorName: evalData.partnerName,
    technicalFeasibility: evalData.technicalFeasibility === 'Highly Feasible' ? 5 : 4,
    scalability: 4,
    costViability: 4,
    manufacturability: Math.round(evalData.manufacturabilityRating / 20) || 4,
    deploymentFeasibility: 5,
    expectedImpact: 5,
    feedback: evalData.feedback,
    verdict: evalData.approvedForScaling ? 'Finalized' : 'Revision Needed',
    finalizedAt: now
  };

  db.evaluations[solutionId] = evaluation;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-gov`,
    title: `Prototype Industry Vetted: ${problem.id}`,
    message: `${evalData.partnerCompany} finalized review for "${problem.title}". Ready for Government funding sanction.`,
    timestamp: now,
    targetRole: 'government',
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function fundProblemOnServer(
  problemId: string,
  fundingData: {
    sanctionedAmount: number;
    disbursingAgency: string;
    sanctionOrderNumber: string;
    timelineWeeks: number;
  }
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  problem.fundingApproved = true;
  problem.fundingAmount = fundingData.sanctionedAmount;
  problem.status = 'Government Funding Approved';
  problem.updatedAt = now;

  const funding: FundingDetails = {
    problemId: problem.id,
    solutionId: problem.solutionId || 'SOL-GEN',
    approvedAmount: fundingData.sanctionedAmount,
    disbursedDate: now,
    grantType: 'Civic Innovation Grant',
    sanctionOfficer: fundingData.disbursingAgency,
    sanctionOrderNumber: fundingData.sanctionOrderNumber
  };

  db.funding[problem.id] = funding;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-all`,
    title: `Civic Innovation Grant Disbursed for ${problem.id}`,
    message: `₹${fundingData.sanctionedAmount.toLocaleString('en-IN')} approved by ${fundingData.disbursingAgency}. Ground implementation commences.`,
    timestamp: now,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function raiseIndustryQueryOnServer(
  problemId: string,
  solutionId: string,
  queryData: {
    industryName: string;
    evaluatorName: string;
    queryText: string;
    requestedModifications?: string;
  }
): { problem: Problem; query: PrototypeQuery; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  const solution = db.solutions.find((s) => s.id === solutionId);
  if (!problem || !solution) throw new Error('Problem or Solution not found');

  const now = new Date().toISOString();
  const query: PrototypeQuery = {
    id: `QRY-${Math.floor(100 + Math.random() * 900)}`,
    industryName: queryData.industryName,
    evaluatorName: queryData.evaluatorName,
    queryText: queryData.queryText,
    requestedModifications: queryData.requestedModifications,
    status: 'pending',
    createdAt: now
  };

  if (!solution.queries) solution.queries = [];
  solution.queries.unshift(query);

  problem.queriesPending = true;
  problem.status = 'Queries Raised by Industry';
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-qry`,
    title: `Industry Queries Raised for ${problem.id}`,
    message: `${queryData.industryName} requested modifications for "${solution.solutionName}": "${queryData.queryText}"`,
    timestamp: now,
    targetRole: 'college',
    problemId: problem.id,
    read: false,
    type: 'warning'
  });

  saveServerDatabase(db);
  return { problem, query, database: db };
}

export function respondToIndustryQueryOnServer(
  problemId: string,
  solutionId: string,
  queryId: string,
  resData: {
    studentResponse: string;
    updatedSolutionName?: string;
    updatedDescription?: string;
    updatedPrototypeDescription?: string;
    updatedCost?: number;
    updatedDocUrl?: string;
  }
): { problem: Problem; solution: StudentSolution; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  const solution = db.solutions.find((s) => s.id === solutionId);
  if (!problem || !solution) throw new Error('Problem or Solution not found');

  const now = new Date().toISOString();
  if (solution.queries) {
    const q = solution.queries.find((item) => item.id === queryId);
    if (q) {
      q.status = 'resolved';
      q.studentResponse = resData.studentResponse;
      q.resolvedAt = now;
    }
  }

  if (resData.updatedSolutionName) solution.solutionName = resData.updatedSolutionName;
  if (resData.updatedDescription) solution.description = resData.updatedDescription;
  if (resData.updatedPrototypeDescription) solution.prototypeDescription = resData.updatedPrototypeDescription;
  if (resData.updatedCost !== undefined) solution.estimatedCost = resData.updatedCost;
  if (resData.updatedDocUrl) solution.prototypeDocUrl = resData.updatedDocUrl;

  solution.version = (solution.version || 1) + 1;
  solution.lastModifiedAt = now;

  const stillPending = (solution.queries || []).some((q) => q.status === 'pending');
  problem.queriesPending = stillPending;
  problem.status = stillPending ? 'Queries Raised by Industry' : 'Under Industry Review';
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-mod-ack`,
    title: `Student Team Modified Prototype: ${problem.id}`,
    message: `Team "${solution.teamName}" revised prototype (v${solution.version}) addressing technical queries.`,
    timestamp: now,
    targetRole: 'industry',
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  saveServerDatabase(db);
  return { problem, solution, database: db };
}

export function submitJointProposalOnServer(
  problemId: string,
  solutionId: string,
  proposalData: {
    industryName: string;
    industryMentorName: string;
    industryDesignation?: string;
    proposedSanctionAmount: number;
    industryEndorsementStatement: string;
    projectedTimelineWeeks?: number;
  }
): { problem: Problem; proposal: JointGrantProposal; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  const solution = db.solutions.find((s) => s.id === solutionId);
  if (!problem || !solution) throw new Error('Problem or Solution not found');

  const team = db.teams.find((t) => t.id === solution.teamId);
  const now = new Date().toISOString();
  const proposalId = `JGP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const proposal: JointGrantProposal = {
    id: proposalId,
    problemId,
    solutionId,
    studentTeamId: solution.teamId,
    studentTeamName: solution.teamName,
    collegeName: solution.collegeName,
    studentLeaderName: team ? team.leaderName : 'Student Team Lead',
    department: team ? team.department : 'Engineering Innovation',
    industryName: proposalData.industryName,
    industryMentorName: proposalData.industryMentorName,
    industryDesignation: proposalData.industryDesignation || 'Principal Industry Specialist',
    solutionTitle: solution.solutionName,
    proposedSanctionAmount: proposalData.proposedSanctionAmount,
    industryEndorsementStatement: proposalData.industryEndorsementStatement,
    technicalFeasibilityScore: 5,
    manufacturabilityRating: 5,
    projectedTimelineWeeks: proposalData.projectedTimelineWeeks || 4,
    status: 'pending_government_sanction',
    submittedAt: now
  };

  if (!db.jointProposals) db.jointProposals = {};
  db.jointProposals[proposalId] = proposal;

  solution.jointGrantProposal = proposal;
  problem.jointGrantProposed = true;
  problem.jointGrantProposalId = proposalId;
  problem.prototypeFinalized = true;
  problem.status = 'Joint Grant Sanction Proposed';
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-joint`,
    title: `Joint Industry-Student Proposal for Sanction: ${problem.id}`,
    message: `${proposalData.industryName} and Team "${solution.teamName}" jointly applied to Government for ₹${proposalData.proposedSanctionAmount.toLocaleString('en-IN')}.`,
    timestamp: now,
    targetRole: 'government',
    problemId: problem.id,
    read: false,
    type: 'alert'
  });

  saveServerDatabase(db);
  return { problem, proposal, database: db };
}

export function sanctionJointProposalOnServer(
  proposalId: string,
  sanctionData: {
    sanctionedAmount: number;
    sanctionOfficer: string;
    sanctionOrderNumber?: string;
  }
): { problem: Problem; proposal: JointGrantProposal; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const proposal = db.jointProposals ? db.jointProposals[proposalId] : null;
  if (!proposal) throw new Error('Proposal not found');

  const problem = db.problems.find((p) => p.id === proposal.problemId);
  const solution = db.solutions.find((s) => s.id === proposal.solutionId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  const sanctionOrderNumber =
    sanctionData.sanctionOrderNumber ||
    `GO-MS/AP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

  proposal.status = 'sanctioned';
  proposal.sanctionedAt = now;
  proposal.sanctionOrderNumber = sanctionOrderNumber;
  proposal.sanctionOfficer = sanctionData.sanctionOfficer;

  const funding: FundingDetails = {
    problemId: problem.id,
    solutionId: proposal.solutionId,
    approvedAmount: sanctionData.sanctionedAmount,
    disbursedDate: now,
    grantType: 'Joint Industry-Student Municipal Innovation Grant',
    sanctionOfficer: sanctionData.sanctionOfficer,
    sanctionOrderNumber
  };

  db.funding[problem.id] = funding;
  problem.fundingApproved = true;
  problem.fundingAmount = sanctionData.sanctionedAmount;
  problem.status = 'Government Funding Approved';
  problem.updatedAt = now;

  if (solution) {
    solution.jointGrantProposal = proposal;
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-joint-sanc`,
    title: `Government Sanction Order Issued: ₹${sanctionData.sanctionedAmount.toLocaleString('en-IN')}`,
    message: `Joint grant sanctioned under order ${sanctionOrderNumber} for problem "${problem.title}".`,
    timestamp: now,
    targetRole: 'college',
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  saveServerDatabase(db);
  return { problem, proposal, database: db };
}

export function resolveProblemOnServer(
  problemId: string,
  resData: {
    afterPhoto: string;
    resolutionSummary: string;
  }
): { problem: Problem; database: SamadhanDatabase } {
  const db = loadServerDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) throw new Error('Problem not found');

  const now = new Date().toISOString();
  problem.implemented = true;
  problem.status = 'Problem Solved';
  problem.afterPhoto = resData.afterPhoto;
  problem.solvedAt = now;
  problem.updatedAt = now;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-solv`,
    title: `🎉 Problem ${problem.id} Solved on Ground!`,
    message: `Implementation verified with photographic proof. All ${problem.communityReportCount || 1} reporting citizens notified.`,
    timestamp: now,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: problem.id,
    read: false,
    type: 'success'
  });

  saveServerDatabase(db);
  return { problem, database: db };
}

export function markAllNotificationsReadOnServer(): SamadhanDatabase {
  const db = loadServerDatabase();
  db.notifications.forEach((n) => (n.read = true));
  saveServerDatabase(db);
  return db;
}

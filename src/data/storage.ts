import {
  SamadhanDatabase,
  Problem,
  AIAnalysisReport,
  StudentTeam,
  StudentSolution,
  IndustryEvaluation,
  FundingDetails,
  NotificationItem,
  UserRole,
  ProblemCategory,
  PriorityLevel,
  PrototypeQuery,
  JointGrantProposal
} from '../types';
import { INITIAL_DATABASE, DEFAULT_COLLEGES } from './initialData';

const STORAGE_KEY = 'SAMADHAN_DATABASE';
const CURRENT_USER_KEY = 'SAMADHAN_CURRENT_USER';

export interface UserSession {
  role: UserRole;
  email: string;
  name: string;
  organization?: string;
}

export interface RealtimeStatusInfo {
  status: 'connected' | 'connecting' | 'reconnecting' | 'offline';
  activeClients: number;
  lastSyncTime: string;
}

export const DEMO_CREDENTIALS: Record<
  UserRole,
  { email: string; pass: string; name: string; org: string; roleLabel: string }
> = {
  citizen: {
    email: 'citizen@demo.com',
    pass: 'demo123',
    name: 'Ramesh Babu',
    org: 'Civilian Resident (Mangalagiri)',
    roleLabel: 'Citizen'
  },
  college: {
    email: 'college@demo.com',
    pass: 'demo123',
    name: 'Aditya Varma & Innovators Team',
    org: 'KL University / Govt Engineering College',
    roleLabel: 'University / College Student Innovation Cell'
  },
  industry: {
    email: 'industry@demo.com',
    pass: 'demo123',
    name: 'Dr. V. Srinivas',
    org: 'Andhra Smart Infrastructure Technologies Ltd.',
    roleLabel: 'Industry R&D & Implementation Partner'
  },
  government: {
    email: 'government@demo.com',
    pass: 'demo123',
    name: 'Sri K. Venkatasubbaiah, IAS',
    org: 'District Administration & Municipal Directorate',
    roleLabel: 'Government Nodal Officer'
  }
};

// -------------------------------------------------------------
// Realtime WebSocket & Server Database Client
// -------------------------------------------------------------
let socket: WebSocket | null = null;
let realtimeStatus: 'connected' | 'connecting' | 'reconnecting' | 'offline' = 'connecting';
let activeClientsCount = 1;
let lastSyncTimestamp = new Date().toISOString();
let heartbeatInterval: any = null;
let reconnectTimeout: any = null;

export function getRealtimeConnectionInfo(): RealtimeStatusInfo {
  return {
    status: realtimeStatus,
    activeClients: activeClientsCount,
    lastSyncTime: lastSyncTimestamp
  };
}

export function subscribeToRealtimeConnection(callback: (info: RealtimeStatusInfo) => void): () => void {
  const handler = () => callback(getRealtimeConnectionInfo());
  window.addEventListener('samadhan_realtime_status_updated', handler);
  // Send current state immediately
  callback(getRealtimeConnectionInfo());
  return () => window.removeEventListener('samadhan_realtime_status_updated', handler);
}

function notifyRealtimeStatus() {
  window.dispatchEvent(new Event('samadhan_realtime_status_updated'));
}

export function initRealtimeClient() {
  if (typeof window === 'undefined') return;

  // Initial HTTP hydration from server database
  fetch('/api/database')
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Server returned non-200');
    })
    .then((db: SamadhanDatabase) => {
      if (db && Array.isArray(db.problems)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        lastSyncTimestamp = new Date().toISOString();
        window.dispatchEvent(new Event('samadhan_db_updated'));
        notifyRealtimeStatus();
      }
    })
    .catch((err) => {
      console.warn('[Realtime Client] Initial database fetch fallback to localStorage:', err);
    });

  // Connect WebSocket
  connectWebSocket();
}

function connectWebSocket() {
  if (typeof window === 'undefined') return;
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  realtimeStatus = 'connecting';
  notifyRealtimeStatus();

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('[Realtime WS] Connected to backend database stream.');
      realtimeStatus = 'connected';
      lastSyncTimestamp = new Date().toISOString();
      notifyRealtimeStatus();

      // Start periodic heartbeats
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'PING' }));
        }
      }, 20000);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'INIT_DATA' || message.type === 'DATABASE_SYNC') {
          if (message.data && Array.isArray(message.data.problems)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(message.data));
            lastSyncTimestamp = new Date().toISOString();
            if (message.activeClients) {
              activeClientsCount = message.activeClients;
            }
            window.dispatchEvent(new Event('samadhan_db_updated'));
            notifyRealtimeStatus();
          }
        } else if (message.type === 'PRESENCE_UPDATE') {
          if (message.data?.activeClients) {
            activeClientsCount = message.data.activeClients;
            notifyRealtimeStatus();
          }
        } else if (message.type === 'PROBLEM_CREATED' || message.type === 'PROBLEM_MERGED' || message.type === 'PROBLEM_SOLVED') {
          // Trigger instant refresh
          window.dispatchEvent(new Event('samadhan_db_updated'));
        }
      } catch (err) {
        console.error('[Realtime WS] Error processing incoming broadcast:', err);
      }
    };

    socket.onclose = () => {
      console.log('[Realtime WS] Disconnected from backend stream. Reconnecting in 3s...');
      realtimeStatus = 'reconnecting';
      notifyRealtimeStatus();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (err) => {
      console.warn('[Realtime WS] Connection error:', err);
      realtimeStatus = 'offline';
      notifyRealtimeStatus();
    };
  } catch (err) {
    console.error('[Realtime WS] Setup error:', err);
    realtimeStatus = 'offline';
    notifyRealtimeStatus();
  }
}

// Auto-run client hydration on file load
if (typeof window !== 'undefined') {
  initRealtimeClient();
}

// -------------------------------------------------------------
// Database Retrieval & Persistence
// -------------------------------------------------------------

export function loadDatabase(): SamadhanDatabase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
      return INITIAL_DATABASE;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to parse database from localStorage:', err);
    return INITIAL_DATABASE;
  }
}

export function saveDatabase(db: SamadhanDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event('samadhan_db_updated'));
  } catch (err) {
    console.error('Failed to write database to localStorage:', err);
  }
}

export function getCurrentUser(): UserSession | null {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserSession | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  window.dispatchEvent(new Event('samadhan_auth_updated'));
}

export function clearCurrentUser(): void {
  setCurrentUser(null);
}

export function subscribeToDatabase(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('samadhan_db_updated', handler);
  return () => window.removeEventListener('samadhan_db_updated', handler);
}

export function subscribeToAuth(callback: (user: UserSession | null) => void): () => void {
  const handler = () => callback(getCurrentUser());
  window.addEventListener('samadhan_auth_updated', handler);
  return () => window.removeEventListener('samadhan_auth_updated', handler);
}

export function resetDatabaseToDemo(): void {
  // Optimistic local reset
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
  window.dispatchEvent(new Event('samadhan_db_updated'));

  // Sync with backend server database
  fetch('/api/reset', { method: 'POST' }).catch((err) => {
    console.error('[API] Error calling /api/reset:', err);
  });
}

// -------------------------------------------------------------
// AI Engine Simulation (Deterministic duplicate screening & merging)
// -------------------------------------------------------------
export function runSimulatedAIAnalysis(
  title: string,
  description: string,
  category: ProblemCategory,
  location: string,
  hasMedia: boolean,
  existingProblems: Problem[]
): AIAnalysisReport {
  const textLower = (title + ' ' + description).toLowerCase();
  const locationLower = location.toLowerCase();

  let maxSimilarity = 0;
  let matchingTitles: string[] = [];
  let bestMatchProblem: Problem | null = null;

  for (const existing of existingProblems) {
    const existingTextLower = (existing.title + ' ' + existing.description).toLowerCase();
    const existingLocLower = (existing.location || '').toLowerCase();

    const existingTokens = new Set(
      existingTextLower
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
    const newTokens = new Set(
      textLower
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    let commonCount = 0;
    newTokens.forEach((token) => {
      if (existingTokens.has(token)) commonCount++;
    });

    let score = Math.round((commonCount / Math.max(1, Math.min(newTokens.size, 15))) * 100);

    // Location keywords boost
    const locKeywords = [
      'aiims',
      'mangalagiri',
      'guntur',
      'vijayawada',
      'junction',
      'nh-16',
      'market',
      'bazar',
      'nagar',
      'cross',
      'circle',
      'road'
    ];
    let sharedLocKeywords = 0;
    locKeywords.forEach((kw) => {
      if (locationLower.includes(kw) && existingLocLower.includes(kw)) {
        sharedLocKeywords++;
      }
    });

    if (sharedLocKeywords >= 1) {
      score += sharedLocKeywords * 20;
    }

    if (existing.category === category) {
      score += 15;
    }

    score = Math.min(99, score);

    if (score > maxSimilarity) {
      maxSimilarity = score;
      if (score >= 45) {
        bestMatchProblem = existing;
      }
    }

    if (score >= 40) {
      matchingTitles.push(`ID: ${existing.id} - ${existing.title} (${score}% overlap)`);
    }
  }

  const isDuplicate = maxSimilarity >= 50 && bestMatchProblem !== null;
  const duplicateProbability = isDuplicate ? Math.min(99, Math.max(72, maxSimilarity)) : Math.min(40, maxSimilarity);

  const isHighSeverity =
    textLower.includes('danger') ||
    textLower.includes('severe') ||
    textLower.includes('accident') ||
    textLower.includes('ambulance') ||
    textLower.includes('hospital') ||
    textLower.includes('burst') ||
    textLower.includes('emergency') ||
    textLower.includes('pothole') ||
    textLower.includes('broken');

  const severity = isHighSeverity ? 'Critical' : textLower.length > 80 ? 'High' : 'Medium';
  const priority: PriorityLevel = severity === 'Critical' || severity === 'High' ? 'High' : 'Medium';

  let detectedProblemType = 'Civic Infrastructure Hazard';
  if (textLower.includes('road') || textLower.includes('pothole') || textLower.includes('tar')) {
    detectedProblemType = 'Road Damage / Pothole';
  } else if (textLower.includes('waste') || textLower.includes('garbage') || textLower.includes('dump')) {
    detectedProblemType = 'Solid Waste / Sanitation Overflow';
  } else if (textLower.includes('water') || textLower.includes('leak') || textLower.includes('drain')) {
    detectedProblemType = 'Water Main Rupture / Drainage Clog';
  } else if (textLower.includes('light') || textLower.includes('electric') || textLower.includes('power')) {
    detectedProblemType = 'Electrical Outage / Street Lighting';
  } else if (textLower.includes('traffic') || textLower.includes('signal') || textLower.includes('jam')) {
    detectedProblemType = 'Traffic Signal Defect / Congestion';
  }

  let confidenceScore = 88;
  if (hasMedia) confidenceScore += 6;
  if (location.length > 5) confidenceScore += 3;
  if (description.length > 60) confidenceScore += 2;
  confidenceScore = Math.min(98, confidenceScore);

  let recommendation = '';
  let consolidationSummary = '';

  if (isDuplicate && bestMatchProblem) {
    recommendation = `Existing Problem Detected: Matches Master Record #${bestMatchProblem.id} ("${bestMatchProblem.title}") with ${duplicateProbability}% overlap. Intelligently consolidated into a single master problem to prevent duplicate civic tickets.`;
    consolidationSummary = `Combined with Master Ticket #${bestMatchProblem.id}. Total citizen reports merged: ${(bestMatchProblem.communityReportCount || 1) + 1}. Photographic evidence and citizen testimonies appended.`;
  } else if (isHighSeverity) {
    recommendation = `Forward to Government Ground Verification with HIGH PRIORITY. Immediate municipal engineering dispatch recommended.`;
  } else {
    recommendation = `Forward to Government Nodal Officer for Step-2 Human Ground Verification. Meets initial validity parameters.`;
  }

  return {
    problemId: bestMatchProblem ? bestMatchProblem.id : '',
    duplicateDetected: isDuplicate,
    duplicateProbability,
    duplicateMatches: matchingTitles,
    matchedExistingProblemId: bestMatchProblem ? bestMatchProblem.id : undefined,
    matchedExistingProblemTitle: bestMatchProblem ? bestMatchProblem.title : undefined,
    isCombinedIntoExisting: isDuplicate,
    consolidationSummary,
    suggestedCategory: category,
    detectedProblemType,
    severity,
    priority,
    evidenceQuality: hasMedia ? 'Sufficient' : 'Moderate',
    mediaRelevance: hasMedia
      ? 'Uploaded evidence visually correlates with reported category and geolocation coordinates.'
      : 'No media uploaded; textual and contextual geolocation data utilized for assessment.',
    confidenceScore,
    recommendation,
    analyzedAt: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// Database Action Handlers (Full-stack API + Optimistic Local)
// -------------------------------------------------------------

export function createProblem(data: {
  title: string;
  description: string;
  location: string;
  category: ProblemCategory;
  priority: PriorityLevel;
  photo?: string;
  citizenName: string;
  citizenEmail: string;
}): { problem: Problem; aiReport: AIAnalysisReport; isCombined?: boolean } {
  const db = loadDatabase();

  // Run AI analysis against all existing problems
  const aiReport = runSimulatedAIAnalysis(
    data.title,
    data.description,
    data.category,
    data.location,
    Boolean(data.photo),
    db.problems
  );

  let resultToReturn: { problem: Problem; aiReport: AIAnalysisReport; isCombined?: boolean };

  if (aiReport.duplicateDetected && aiReport.matchedExistingProblemId) {
    const existingIndex = db.problems.findIndex((p) => p.id === aiReport.matchedExistingProblemId);
    if (existingIndex !== -1) {
      const existing = db.problems[existingIndex];
      existing.communityReportCount = (existing.communityReportCount || 1) + 1;
      existing.isConsolidatedMaster = true;

      existing.reporterEmails = existing.reporterEmails || (existing.citizenEmail ? [existing.citizenEmail] : []);
      if (!existing.reporterEmails.includes(data.citizenEmail)) {
        existing.reporterEmails.push(data.citizenEmail);
      }

      existing.additionalReports = existing.additionalReports || [];
      existing.additionalReports.unshift({
        id: `REP-${Date.now()}`,
        citizenName: data.citizenName,
        citizenEmail: data.citizenEmail,
        timestamp: new Date().toISOString(),
        description: data.description,
        photo: data.photo,
        locationDetails: data.location,
        similarityScore: aiReport.duplicateProbability,
        similarityReason: `AI auto-merged this report into existing master record #${existing.id} (${aiReport.duplicateProbability}% match). Single unified problem maintained.`
      });

      if (existing.communityReportCount >= 3) {
        existing.priority = 'High';
      }
      existing.updatedAt = new Date().toISOString();

      aiReport.problemId = existing.id;
      aiReport.isCombinedIntoExisting = true;
      db.aiReports[existing.id] = aiReport;

      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-1`,
        targetRole: 'citizen',
        targetEmail: data.citizenEmail,
        problemId: existing.id,
        title: `Consolidated into Master Issue #${existing.id}`,
        message: `Your report was matched by AI with existing issue "${existing.title}". Combined into master problem with ${existing.communityReportCount} citizen reports.`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      });

      saveDatabase(db);
      resultToReturn = { problem: existing, aiReport, isCombined: true };
    } else {
      resultToReturn = createNewProblemRecord(db, data, aiReport);
    }
  } else {
    resultToReturn = createNewProblemRecord(db, data, aiReport);
  }

  // Push to backend REST API asynchronously for disk persistence & WebSocket broadcasting
  fetch('/api/problems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .catch((err) => console.warn('[API] /api/problems call failed, local state active:', err));

  return resultToReturn;
}

function createNewProblemRecord(
  db: SamadhanDatabase,
  data: {
    title: string;
    description: string;
    location: string;
    category: ProblemCategory;
    priority: PriorityLevel;
    photo?: string;
    citizenName: string;
    citizenEmail: string;
  },
  aiReport: AIAnalysisReport
) {
  const idNumber = 1293 + db.problems.length;
  const problemId = `SP-${idNumber}`;
  aiReport.problemId = problemId;

  const newProblem: Problem = {
    id: problemId,
    title: data.title,
    description: data.description,
    location: data.location,
    category: data.category,
    problemType: aiReport.detectedProblemType,
    priority: data.priority || aiReport.priority,
    photo: data.photo || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
    evidence: aiReport.evidenceQuality,
    aiDone: true,
    duplicate: false,
    aiConfidence: aiReport.confidenceScore,
    verified: false,
    collegeNotified: false,
    teamFormed: false,
    solutionSubmitted: false,
    industryReviewed: false,
    prototypeFinalized: false,
    fundingApproved: false,
    implemented: false,
    status: 'Sent to Government for Verification',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    citizenName: data.citizenName,
    citizenEmail: data.citizenEmail,
    communityReportCount: 1,
    reporterEmails: [data.citizenEmail],
    additionalReports: []
  };

  db.problems.unshift(newProblem);
  db.aiReports[problemId] = aiReport;

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    targetRole: 'government',
    problemId: problemId,
    title: 'New Problem Pending Ground Verification',
    message: `Citizen ${data.citizenName} reported "${data.title}". Step 2 field inspection required.`,
    type: 'alert',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  return { problem: newProblem, aiReport, isCombined: false };
}

// Government verifies problem
export function verifyProblemByGovernment(
  problemId: string,
  action: 'verify' | 'reject' | 'request_info',
  remarks: string,
  assignedOfficer: string = 'Sri K. Venkatasubbaiah, IAS'
): Problem | null {
  const db = loadDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) return null;

  if (action === 'verify') {
    problem.verified = true;
    problem.governmentRemarks = remarks;
    problem.collegeNotified = true;
    problem.status = 'Nearby Colleges Notified';
    problem.updatedAt = new Date().toISOString();

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-1`,
      targetRole: 'citizen',
      targetEmail: problem.citizenEmail,
      problemId: problemId,
      title: 'Problem Verified by Government!',
      message: `Your report "${problem.title}" has been verified on-ground. Engineering colleges have been alerted to build prototypes.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false
    });

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-2`,
      targetRole: 'college',
      problemId: problemId,
      title: 'New Civic Innovation Challenge Published',
      message: `Ground-verified problem "${problem.title}" in ${problem.location} is open for college student teams to engineer solutions.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });

    // Call backend API
    fetch(`/api/problems/${problemId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarks, verifiedBy: assignedOfficer })
    }).catch((err) => console.warn('[API] /verify failed:', err));
  } else if (action === 'reject') {
    problem.verified = false;
    problem.governmentRemarks = remarks;
    problem.status = 'Rejected';
    problem.updatedAt = new Date().toISOString();

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      targetRole: 'citizen',
      targetEmail: problem.citizenEmail,
      problemId: problemId,
      title: 'Problem Verification Notice',
      message: `Report "${problem.title}" could not be verified: ${remarks}`,
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    });

    // Call backend API
    fetch(`/api/problems/${problemId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarks, rejectedBy: assignedOfficer })
    }).catch((err) => console.warn('[API] /reject failed:', err));
  } else {
    problem.governmentRemarks = remarks;
    problem.status = 'More Information Requested';
    problem.updatedAt = new Date().toISOString();
  }

  saveDatabase(db);
  return problem;
}

// Student forms a team
export function createStudentTeam(
  problemId: string,
  teamName: string,
  leaderName: string,
  members: string[],
  collegeName: string,
  department: string
): StudentTeam {
  const db = loadDatabase();
  const teamId = `TEAM-${Math.floor(100 + Math.random() * 900)}`;

  const team: StudentTeam = {
    id: teamId,
    problemId,
    collegeName,
    teamName,
    leaderName,
    members,
    department,
    createdAt: new Date().toISOString()
  };

  db.teams.unshift(team);

  const problem = db.problems.find((p) => p.id === problemId);
  if (problem) {
    problem.teamFormed = true;
    problem.teamId = teamId;
    problem.status = 'Student Team Formed';
    problem.updatedAt = new Date().toISOString();

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      targetRole: 'citizen',
      targetEmail: problem.citizenEmail,
      problemId,
      title: 'Student Innovation Team Formed',
      message: `Team "${teamName}" from ${collegeName} has taken up challenge "${problem.title}".`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);
  return team;
}

// College team submits solution / prototype
export function submitStudentSolution(data: {
  problemId: string;
  teamId: string;
  solutionName: string;
  description: string;
  prototypeDescription: string;
  technologiesUsed: string[];
  estimatedCost: number;
  expectedImpact: string;
  prototypeImage?: string;
  prototypeDocUrl?: string;
  targetIndustry?: string;
  readinessLevel?: string;
  billOfMaterials?: string;
}): StudentSolution {
  const db = loadDatabase();
  const team = db.teams.find((t) => t.id === data.teamId);
  const solutionId = `SOL-${Math.floor(500 + Math.random() * 500)}`;

  const solution: StudentSolution = {
    id: solutionId,
    problemId: data.problemId,
    teamId: data.teamId,
    teamName: team ? team.teamName : 'Student Innovation Team',
    collegeName: team ? team.collegeName : 'Engineering College',
    solutionName: data.solutionName,
    description: data.description,
    prototypeDescription: data.prototypeDescription,
    technologiesUsed: data.technologiesUsed,
    estimatedCost: data.estimatedCost,
    expectedImpact: data.expectedImpact,
    prototypeImage:
      data.prototypeImage ||
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    prototypeDocUrl: data.prototypeDocUrl,
    targetIndustry: data.targetIndustry || 'Andhra Smart Infrastructure Technologies Ltd.',
    readinessLevel: data.readinessLevel || 'TRL-5: Working Sub-scale Hardware Validated',
    billOfMaterials: data.billOfMaterials,
    queries: [],
    version: 1,
    submittedAt: new Date().toISOString()
  };

  db.solutions.unshift(solution);

  const problem = db.problems.find((p) => p.id === data.problemId);
  if (problem) {
    problem.solutionSubmitted = true;
    problem.solutionId = solutionId;
    problem.queriesPending = false;
    problem.status = 'Under Industry Review';
    problem.updatedAt = new Date().toISOString();

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-1`,
      targetRole: 'industry',
      problemId: data.problemId,
      title: 'New Student Prototype Submitted for Industry Review',
      message: `Team "${solution.teamName}" submitted prototype "${solution.solutionName}" for problem "${problem.title}". Technical evaluation required.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-2`,
      targetRole: 'citizen',
      targetEmail: problem.citizenEmail,
      problemId: data.problemId,
      title: 'Solution Submitted to Industry',
      message: `A student prototype "${solution.solutionName}" has been submitted and is currently being evaluated by industrial engineering partners.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    });
  }

  saveDatabase(db);

  // Sync to server
  fetch(`/api/problems/${data.problemId}/solutions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamName: solution.teamName,
      collegeName: solution.collegeName,
      solutionName: solution.solutionName,
      description: solution.description,
      prototypeDescription: solution.prototypeDescription,
      technologiesUsed: solution.technologiesUsed,
      estimatedCost: solution.estimatedCost,
      prototypePhoto: solution.prototypeImage
    })
  }).catch((err) => console.warn('[API] /solutions failed:', err));

  return solution;
}

// Industry raises queries / requests modifications from student team
export function raiseIndustryQuery(data: {
  solutionId: string;
  problemId: string;
  industryName: string;
  evaluatorName: string;
  queryText: string;
  requestedModifications?: string;
  priority?: 'high' | 'medium' | 'low';
}): PrototypeQuery | null {
  const db = loadDatabase();
  const solution = db.solutions.find((s) => s.id === data.solutionId);
  const problem = db.problems.find((p) => p.id === data.problemId);
  if (!solution || !problem) return null;

  const query: PrototypeQuery = {
    id: `QRY-${Math.floor(100 + Math.random() * 900)}`,
    industryName: data.industryName,
    evaluatorName: data.evaluatorName,
    queryText: data.queryText,
    requestedModifications: data.requestedModifications,
    priority: data.priority || 'high',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (!solution.queries) solution.queries = [];
  solution.queries.unshift(query);

  problem.queriesPending = true;
  problem.status = 'Queries Raised by Industry';
  problem.updatedAt = new Date().toISOString();

  // Notify student team
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-query`,
    targetRole: 'college',
    problemId: data.problemId,
    title: 'Industry Queries Raised — Modification Requested',
    message: `${data.industryName} evaluated your prototype "${solution.solutionName}" and requested modifications: "${data.queryText}". Please revise and resubmit.`,
    type: 'warning',
    timestamp: new Date().toISOString(),
    read: false
  });

  // Notify citizen
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-query-cit`,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: data.problemId,
    title: 'Prototype Query Loop in Progress',
    message: `Industry technical experts requested minor design adjustments on the prototype for "${problem.title}". Students are updating the model.`,
    type: 'info',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  return query;
}

// Student team responds to industry query & modifies prototype
export function respondToIndustryQuery(data: {
  solutionId: string;
  problemId: string;
  queryId: string;
  studentResponse: string;
  updatedSolutionName?: string;
  updatedDescription?: string;
  updatedPrototypeDescription?: string;
  updatedCost?: number;
  updatedDocUrl?: string;
  updatedPhoto?: string;
}): StudentSolution | null {
  const db = loadDatabase();
  const solution = db.solutions.find((s) => s.id === data.solutionId);
  const problem = db.problems.find((p) => p.id === data.problemId);
  if (!solution || !problem) return null;

  if (solution.queries) {
    const q = solution.queries.find((item) => item.id === data.queryId);
    if (q) {
      q.status = 'resolved';
      q.studentResponse = data.studentResponse;
      q.resolvedAt = new Date().toISOString();
    }
  }

  // Update prototype details if modified
  if (data.updatedSolutionName) solution.solutionName = data.updatedSolutionName;
  if (data.updatedDescription) solution.description = data.updatedDescription;
  if (data.updatedPrototypeDescription) solution.prototypeDescription = data.updatedPrototypeDescription;
  if (data.updatedCost !== undefined) solution.estimatedCost = data.updatedCost;
  if (data.updatedDocUrl) solution.prototypeDocUrl = data.updatedDocUrl;
  if (data.updatedPhoto) solution.prototypeImage = data.updatedPhoto;

  solution.version = (solution.version || 1) + 1;
  solution.lastModifiedAt = new Date().toISOString();

  // Check if any other queries remain pending
  const stillPending = (solution.queries || []).some((q) => q.status === 'pending');
  problem.queriesPending = stillPending;
  problem.status = stillPending ? 'Queries Raised by Industry' : 'Under Industry Review';
  problem.updatedAt = new Date().toISOString();

  // Notify industry partner
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-mod-res`,
    targetRole: 'industry',
    problemId: data.problemId,
    title: 'Student Team Responded with Modified Prototype',
    message: `Team "${solution.teamName}" revised prototype (v${solution.version}) for "${solution.solutionName}" and addressed your technical queries. Ready for final endorsement.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  return solution;
}

// Industry + Student Team Jointly Submit Proposal to Government for Money Sanction
export function submitJointGrantProposal(data: {
  problemId: string;
  solutionId: string;
  industryName: string;
  industryMentorName: string;
  industryDesignation?: string;
  proposedSanctionAmount: number;
  industryEndorsementStatement: string;
  technicalFeasibilityScore?: number;
  manufacturabilityRating?: number;
  projectedTimelineWeeks?: number;
}): JointGrantProposal | null {
  const db = loadDatabase();
  const solution = db.solutions.find((s) => s.id === data.solutionId);
  const problem = db.problems.find((p) => p.id === data.problemId);
  if (!solution || !problem) return null;

  const team = db.teams.find((t) => t.id === solution.teamId);
  const proposalId = `JGP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const proposal: JointGrantProposal = {
    id: proposalId,
    problemId: data.problemId,
    solutionId: data.solutionId,
    studentTeamId: solution.teamId,
    studentTeamName: solution.teamName,
    collegeName: solution.collegeName,
    studentLeaderName: team ? team.leaderName : 'Student Team Lead',
    department: team ? team.department : 'Engineering Innovation',
    industryName: data.industryName,
    industryMentorName: data.industryMentorName,
    industryDesignation: data.industryDesignation || 'Principal Industry Specialist & Mentor',
    solutionTitle: solution.solutionName,
    proposedSanctionAmount: data.proposedSanctionAmount,
    industryEndorsementStatement: data.industryEndorsementStatement,
    technicalFeasibilityScore: data.technicalFeasibilityScore || 5,
    manufacturabilityRating: data.manufacturabilityRating || 5,
    projectedTimelineWeeks: data.projectedTimelineWeeks || 4,
    status: 'pending_government_sanction',
    submittedAt: new Date().toISOString()
  };

  if (!db.jointProposals) db.jointProposals = {};
  db.jointProposals[proposalId] = proposal;

  solution.jointGrantProposal = proposal;
  problem.jointGrantProposed = true;
  problem.jointGrantProposalId = proposalId;
  problem.prototypeFinalized = true;
  problem.status = 'Joint Grant Sanction Proposed';
  problem.updatedAt = new Date().toISOString();

  // Create or update evaluation record
  db.evaluations[solution.id] = {
    id: `EVAL-${Math.floor(300 + Math.random() * 700)}`,
    solutionId: solution.id,
    problemId: problem.id,
    industryName: data.industryName,
    evaluatorName: data.industryMentorName,
    technicalFeasibility: data.technicalFeasibilityScore || 5,
    scalability: 5,
    costViability: 5,
    manufacturability: data.manufacturabilityRating || 5,
    deploymentFeasibility: 5,
    expectedImpact: 5,
    feedback: data.industryEndorsementStatement,
    verdict: 'Finalized',
    finalizedAt: new Date().toISOString()
  };

  // Urgent notification to Government Nodal Officers
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-joint-gov`,
    targetRole: 'government',
    problemId: data.problemId,
    title: 'Joint Industry-Student Grant Sanction Application',
    message: `${data.industryName} and Team "${solution.teamName}" (${solution.collegeName}) jointly submitted proposal for "${problem.title}". Sanction of ₹${data.proposedSanctionAmount.toLocaleString('en-IN')} requested.`,
    type: 'alert',
    timestamp: new Date().toISOString(),
    read: false
  });

  // Notify student team
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-joint-stu`,
    targetRole: 'college',
    problemId: data.problemId,
    title: 'Joint Grant Application Submitted to Government!',
    message: `${data.industryName} endorsed your solution "${solution.solutionName}". Joint proposal submitted to District/Municipal Government for funding sanction.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  // Notify citizen
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-joint-cit`,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: data.problemId,
    title: 'Industry & Students Go to Government for Grant Sanction!',
    message: `Industry and collegiate innovators have finalized the solution for "${problem.title}" and presented a joint application to the Government for fund sanction.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  return proposal;
}

// Government sanctions joint proposal
export function sanctionJointProposalByGovernment(data: {
  proposalId: string;
  sanctionedAmount: number;
  sanctionOfficer: string;
  sanctionOrderNumber?: string;
  grantType?: string;
}): FundingDetails | null {
  const db = loadDatabase();
  const proposal = db.jointProposals ? db.jointProposals[data.proposalId] : null;
  if (!proposal) return null;

  const problem = db.problems.find((p) => p.id === proposal.problemId);
  const solution = db.solutions.find((s) => s.id === proposal.solutionId);
  if (!problem) return null;

  const sanctionOrderNumber =
    data.sanctionOrderNumber ||
    `GO-MS/AP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

  proposal.status = 'sanctioned';
  proposal.sanctionedAt = new Date().toISOString();
  proposal.sanctionOrderNumber = sanctionOrderNumber;
  proposal.sanctionOfficer = data.sanctionOfficer;

  const funding: FundingDetails = {
    problemId: problem.id,
    solutionId: proposal.solutionId,
    approvedAmount: data.sanctionedAmount,
    disbursedDate: new Date().toISOString(),
    grantType: data.grantType || 'ULB Municipal Innovation Implementation Grant',
    sanctionOfficer: data.sanctionOfficer,
    sanctionOrderNumber
  };

  db.funding[problem.id] = funding;
  problem.fundingApproved = true;
  problem.fundingAmount = data.sanctionedAmount;
  problem.status = 'Government Funding Approved';
  problem.updatedAt = new Date().toISOString();

  if (solution) {
    solution.jointGrantProposal = proposal;
  }

  // Notify all parties
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-sanc-stu`,
    targetRole: 'college',
    problemId: problem.id,
    title: `Government Sanctioned ₹${data.sanctionedAmount.toLocaleString('en-IN')}!`,
    message: `Joint grant sanctioned under order ${sanctionOrderNumber}. Municipal funds released to team "${proposal.studentTeamName}" and "${proposal.industryName}". Ground implementation begins!`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-sanc-ind`,
    targetRole: 'industry',
    problemId: problem.id,
    title: `Government Sanction Order Issued: ₹${data.sanctionedAmount.toLocaleString('en-IN')}`,
    message: `Official Government Sanction Order ${sanctionOrderNumber} approved for problem "${problem.title}". Industry partner authorized to oversee execution.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-sanc-cit`,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId: problem.id,
    title: 'Government Sanctions Full Funds for Civic Problem Resolution!',
    message: `Municipal Directorate sanctioned ₹${data.sanctionedAmount.toLocaleString('en-IN')} (Order: ${sanctionOrderNumber}). Field work starts immediately!`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);
  return funding;
}

// Industry evaluates and finalizes prototype
export function finalizeIndustryEvaluation(data: {
  solutionId: string;
  problemId: string;
  industryName: string;
  evaluatorName: string;
  technicalFeasibility: number;
  scalability: number;
  costViability: number;
  manufacturability: number;
  deploymentFeasibility: number;
  expectedImpact: number;
  feedback: string;
  verdict: 'Finalized' | 'Revision Needed' | 'Rejected';
}): IndustryEvaluation {
  const db = loadDatabase();
  const evalId = `EVAL-${Math.floor(300 + Math.random() * 700)}`;

  const evaluation: IndustryEvaluation = {
    id: evalId,
    solutionId: data.solutionId,
    problemId: data.problemId,
    industryName: data.industryName,
    evaluatorName: data.evaluatorName,
    technicalFeasibility: data.technicalFeasibility,
    scalability: data.scalability,
    costViability: data.costViability,
    manufacturability: data.manufacturability,
    deploymentFeasibility: data.deploymentFeasibility,
    expectedImpact: data.expectedImpact,
    feedback: data.feedback,
    verdict: data.verdict,
    finalizedAt: new Date().toISOString()
  };

  db.evaluations[data.solutionId] = evaluation;

  const problem = db.problems.find((p) => p.id === data.problemId);
  if (problem) {
    problem.industryReviewed = true;
    problem.industryRemarks = data.feedback;

    if (data.verdict === 'Finalized') {
      problem.prototypeFinalized = true;
      problem.status = 'Industry Prototype Finalized';
      problem.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-1`,
        targetRole: 'government',
        problemId: data.problemId,
        title: 'Industry Finalized Prototype Ready for Funding Approval',
        message: `${data.industryName} has vetted and finalized the prototype for "${problem.title}". Ready for grant sanctioning.`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
      });

      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-2`,
        targetRole: 'citizen',
        targetEmail: problem.citizenEmail,
        problemId: data.problemId,
        title: 'Prototype Approved by Industry',
        message: `Industrial experts have vetted the prototype for "${problem.title}". Moved to Government for funding sanction!`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }

  saveDatabase(db);

  // Sync to server
  fetch(`/api/problems/${data.problemId}/solutions/${data.solutionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      partnerName: data.evaluatorName,
      partnerCompany: data.industryName,
      technicalFeasibility: data.technicalFeasibility >= 75 ? 'Highly Feasible' : 'Feasible with Modifications',
      manufacturabilityRating: data.manufacturability,
      estimatedMassProductionCost: Math.round(data.costViability * 150),
      feedback: data.feedback,
      approvedForScaling: data.verdict === 'Finalized'
    })
  }).catch((err) => console.warn('[API] /review failed:', err));

  return evaluation;
}

// Government approves funding
export function approveGovernmentFunding(
  problemId: string,
  approvedAmount: number,
  sanctionOfficer: string,
  grantType: string = 'SIH Civic Innovation Implementation Grant'
): FundingDetails | null {
  const db = loadDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) return null;

  const funding: FundingDetails = {
    problemId,
    solutionId: problem.solutionId || 'SOL-GEN',
    approvedAmount,
    disbursedDate: new Date().toISOString(),
    grantType,
    sanctionOfficer,
    sanctionOrderNumber: `GO-MS/AP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
  };

  db.funding[problemId] = funding;
  problem.fundingApproved = true;
  problem.fundingAmount = approvedAmount;
  problem.status = 'Government Funding Approved';
  problem.updatedAt = new Date().toISOString();

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-1`,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId,
    title: 'Government Funding Approved!',
    message: `₹${approvedAmount.toLocaleString('en-IN')} sanctioned by ${sanctionOfficer} for "${problem.title}". Ground implementation begins immediately.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);

  // Sync to server
  fetch(`/api/problems/${problemId}/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sanctionedAmount: approvedAmount,
      disbursingAgency: sanctionOfficer,
      sanctionOrderNumber: funding.sanctionOrderNumber,
      timelineWeeks: 4
    })
  }).catch((err) => console.warn('[API] /fund failed:', err));

  return funding;
}

// Government marks implementation complete
export function markImplementationComplete(problemId: string, afterPhoto?: string): Problem | null {
  const db = loadDatabase();
  const problem = db.problems.find((p) => p.id === problemId);
  if (!problem) return null;

  problem.implemented = true;
  problem.status = 'Problem Solved';
  problem.solvedAt = new Date().toISOString();
  problem.updatedAt = new Date().toISOString();
  if (afterPhoto) {
    problem.afterPhoto = afterPhoto;
  } else if (!problem.afterPhoto) {
    problem.afterPhoto = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80';
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    targetRole: 'citizen',
    targetEmail: problem.citizenEmail,
    problemId,
    title: '🎉 Problem Solved & Implemented!',
    message: `Your reported problem "${problem.title}" has been successfully resolved on the ground with photographic proof!`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });

  saveDatabase(db);

  // Sync to server
  fetch(`/api/problems/${problemId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      afterPhoto: problem.afterPhoto,
      resolutionSummary: 'Executed and verified on ground with citizen confirmation.'
    })
  }).catch((err) => console.warn('[API] /resolve failed:', err));

  return problem;
}

export function markNotificationsAsRead(role: UserRole): void {
  const db = loadDatabase();
  db.notifications.forEach((n) => {
    if (n.targetRole === role || n.targetRole === 'all') {
      n.read = true;
    }
  });
  saveDatabase(db);

  // Sync to server
  fetch('/api/notifications/read-all', { method: 'POST' }).catch((err) =>
    console.warn('[API] /notifications/read-all failed:', err)
  );
}

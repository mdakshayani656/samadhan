export type UserRole = 'citizen' | 'college' | 'industry' | 'government';

export type ProblemStatus =
  | 'Problem Submitted'
  | 'AI Analysis Completed'
  | 'Sent to Government for Verification'
  | 'Verified by Government'
  | 'Nearby Colleges Notified'
  | 'Student Team Formed'
  | 'Solution Submitted'
  | 'Under Industry Review'
  | 'Queries Raised by Industry'
  | 'Joint Grant Sanction Proposed'
  | 'Industry Prototype Finalized'
  | 'Government Funding Approved'
  | 'Implementation'
  | 'Problem Solved'
  | 'Rejected'
  | 'More Information Requested';

export type ProblemCategory =
  | 'Infrastructure'
  | 'Environment'
  | 'Public Utilities'
  | 'Transport'
  | 'Education'
  | 'Healthcare'
  | 'Safety'
  | 'Other';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface AdditionalReport {
  id: string;
  citizenName: string;
  citizenEmail: string;
  timestamp: string;
  description: string;
  photo?: string;
  locationDetails: string;
  similarityScore: number;
  similarityReason: string;
}

export interface AIAnalysisReport {
  problemId: string;
  duplicateDetected: boolean;
  duplicateProbability: number;
  duplicateMatches?: string[];
  matchedExistingProblemId?: string;
  matchedExistingProblemTitle?: string;
  isCombinedIntoExisting?: boolean;
  consolidationSummary?: string;
  suggestedCategory: ProblemCategory;
  detectedProblemType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: PriorityLevel;
  evidenceQuality: 'Sufficient' | 'Moderate' | 'Insufficient';
  mediaRelevance: string;
  confidenceScore: number; // e.g. 92%
  recommendation: string;
  analyzedAt: string;
}

export interface GovernmentVerification {
  problemId: string;
  verifiedBy: string;
  action: 'verify' | 'reject' | 'request_info';
  remarks: string;
  timestamp: string;
  assignedDepartment?: string;
}

export interface CollegeMatch {
  name: string;
  distance: string;
  specialization: string;
  type: string;
}

export interface StudentTeam {
  id: string;
  problemId: string;
  collegeName: string;
  teamName: string;
  leaderName: string;
  members: string[];
  department: string;
  createdAt: string;
}

export interface PrototypeQuery {
  id: string;
  industryName: string;
  evaluatorName: string;
  queryText: string;
  requestedModifications?: string;
  priority?: 'high' | 'medium' | 'low';
  studentResponse?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface JointGrantProposal {
  id: string;
  problemId: string;
  solutionId: string;
  studentTeamId: string;
  studentTeamName: string;
  collegeName: string;
  studentLeaderName: string;
  department: string;
  industryName: string;
  industryMentorName: string;
  industryDesignation?: string;
  solutionTitle: string;
  proposedSanctionAmount: number; // in INR
  industryEndorsementStatement: string;
  technicalFeasibilityScore: number;
  manufacturabilityRating: number;
  projectedTimelineWeeks: number;
  status: 'pending_government_sanction' | 'sanctioned' | 'rejected';
  submittedAt: string;
  sanctionedAt?: string;
  sanctionOrderNumber?: string;
  sanctionOfficer?: string;
}

export interface StudentSolution {
  id: string;
  problemId: string;
  teamId: string;
  teamName: string;
  collegeName: string;
  solutionName: string;
  description: string;
  prototypeDescription: string;
  technologiesUsed: string[];
  estimatedCost: number; // in INR
  expectedImpact: string;
  prototypeImage?: string;
  prototypeDocUrl?: string;
  submittedAt: string;
  targetIndustry?: string;
  readinessLevel?: string; // e.g., 'TRL-5: Technology Validated in Relevant Environment'
  billOfMaterials?: string;
  queries?: PrototypeQuery[];
  jointGrantProposal?: JointGrantProposal;
  version?: number;
  lastModifiedAt?: string;
}

export interface IndustryEvaluation {
  id: string;
  solutionId: string;
  problemId: string;
  industryName: string;
  evaluatorName: string;
  technicalFeasibility: number; // 1 to 5
  scalability: number; // 1 to 5
  costViability: number; // 1 to 5
  manufacturability: number; // 1 to 5
  deploymentFeasibility: number; // 1 to 5
  expectedImpact: number; // 1 to 5
  feedback: string;
  verdict: 'Finalized' | 'Revision Needed' | 'Rejected';
  finalizedAt: string;
}

export interface FundingDetails {
  problemId: string;
  solutionId: string;
  approvedAmount: number;
  disbursedDate: string;
  grantType: string;
  sanctionOfficer: string;
  sanctionOrderNumber: string;
}

export interface Problem {
  id: string; // e.g., 'SP-1289'
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  category: ProblemCategory;
  problemType: string;
  priority: PriorityLevel;
  photo?: string;
  afterPhoto?: string;
  evidence: 'Sufficient' | 'Moderate' | 'Insufficient';
  
  // Workflow Flags
  aiDone: boolean;
  duplicate: boolean;
  aiConfidence: number;
  
  verified: boolean;
  rejected?: boolean;
  needsMoreInfo?: boolean;
  governmentRemarks?: string;
  
  collegeNotified: boolean;
  matchedColleges?: CollegeMatch[];
  
  teamFormed: boolean;
  teamId?: string;
  
  solutionSubmitted: boolean;
  solutionId?: string;
  
  industryReviewed: boolean;
  industryRemarks?: string;
  
  prototypeFinalized: boolean;
  
  // Industry-Student Collaboration & Grant Lifecycle
  queriesPending?: boolean;
  jointGrantProposed?: boolean;
  jointGrantProposalId?: string;

  fundingApproved: boolean;
  fundingAmount?: number;
  
  implemented: boolean;
  solvedAt?: string;
  
  status: ProblemStatus;
  createdAt: string;
  updatedAt: string;
  citizenName?: string;
  citizenEmail?: string;

  // Community Consolidation
  communityReportCount?: number;
  additionalReports?: AdditionalReport[];
  reporterEmails?: string[];
  isConsolidatedMaster?: boolean;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole | 'all';
  targetEmail?: string;
  problemId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface SamadhanDatabase {
  problems: Problem[];
  aiReports: Record<string, AIAnalysisReport>;
  teams: StudentTeam[];
  solutions: StudentSolution[];
  evaluations: Record<string, IndustryEvaluation>;
  funding: Record<string, FundingDetails>;
  jointProposals?: Record<string, JointGrantProposal>;
  notifications: NotificationItem[];
}

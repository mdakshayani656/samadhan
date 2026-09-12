import React from 'react';
import { SamadhanLogo } from '../components/SamadhanLogo';
import { UserRole } from '../types';
import {
  ArrowRight,
  ChevronLeft,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => void;
  onBackToHome: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onSelectRole,
  onBackToHome
}) => {
  const roles = [
    {
      role: 'citizen' as UserRole,
      title: 'Citizen',
      icon: '👤',
      tagline: 'Report and track community problems',
      description: 'Submit real-world civic hazards, receive automated AI pre-analysis, track government ground verification, and monitor collegiate prototypes.',
      color: 'hover:border-[#F57A16] hover:shadow-orange-500/10',
      badge: 'bg-orange-50 text-[#F57A16] border-orange-200',
      demoEmail: 'citizen@demo.com',
      demoPass: 'demo123'
    },
    {
      role: 'college' as UserRole,
      title: 'University / College',
      icon: '🎓',
      tagline: 'Receive challenges and develop solutions',
      description: 'Browse geo-located verified challenges in your vicinity, form student innovation teams, build physical/IoT prototypes, and submit to industry.',
      color: 'hover:border-purple-500 hover:shadow-purple-500/10',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      demoEmail: 'college@demo.com',
      demoPass: 'demo123'
    },
    {
      role: 'industry' as UserRole,
      title: 'Industry Partner',
      icon: '🏭',
      tagline: 'Evaluate solutions and develop prototypes',
      description: 'Review collegiate student prototypes, rate manufacturability and cost viability, provide industrial engineering input, and finalize for government.',
      color: 'hover:border-[#087D70] hover:shadow-teal-500/10',
      badge: 'bg-teal-50 text-[#087D70] border-teal-200',
      demoEmail: 'industry@demo.com',
      demoPass: 'demo123'
    },
    {
      role: 'government' as UserRole,
      title: 'Government Administration',
      icon: '🏛️',
      tagline: 'Verify problems, manage projects and release funding',
      description: 'Conduct official Step 2 ground inspections on AI-filtered reports, publish verified challenges to colleges, approve implementation grants, and close issues.',
      color: 'hover:border-[#073F68] hover:shadow-[#073F68]/10',
      badge: 'bg-blue-50 text-[#073F68] border-blue-200',
      demoEmail: 'government@demo.com',
      demoPass: 'demo123'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#073F68] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>
        <SamadhanLogo size="sm" />
      </div>

      {/* Center Cards */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087D70]">
            Portal Access
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073F68] mt-1">
            Choose Your Role
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Select your stakeholder account to enter the specialized SAMADHAN dashboard. Demo
            credentials will be loaded automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r) => (
            <div
              key={r.role}
              onClick={() => onSelectRole(r.role)}
              className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl cursor-pointer transition-all flex flex-col justify-between group ${r.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-105 transition-transform">
                    {r.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${r.badge}`}>
                    {r.title}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#073F68] transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs font-semibold text-[#087D70] mt-1">{r.tagline}</p>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{r.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-600 space-y-0.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Demo User:</span>
                    <strong className="font-mono text-slate-800">{r.demoEmail}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Password:</span>
                    <strong className="font-mono text-slate-800">{r.demoPass}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#073F68]">
                  <span>Sign In as {r.title}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prototype demo note */}
        <div className="mt-10 max-w-xl mx-auto bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Evaluation Mode:</strong> All roles use pre-configured test credentials. No
            external password storage or third-party OAuth is required for local judging.
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2">
        SAMADHAN National Prototype • Smart India Hackathon Architecture
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { SamadhanLogo } from '../components/SamadhanLogo';
import { UserRole } from '../types';
import { DEMO_CREDENTIALS, setCurrentUser } from '../data/storage';
import {
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Shield,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  initialRole: UserRole;
  onLoginSuccess: (role: UserRole) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole,
  onLoginSuccess,
  onBack
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(DEMO_CREDENTIALS[initialRole].email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS[initialRole].pass);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(DEMO_CREDENTIALS[selectedRole].email);
    setPassword(DEMO_CREDENTIALS[selectedRole].pass);
    setError('');
  }, [selectedRole]);

  const handleRoleTabChange = (r: UserRole) => {
    setSelectedRole(r);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const cred = DEMO_CREDENTIALS[selectedRole];
      if (email.trim().toLowerCase() === cred.email.toLowerCase() && password === cred.pass) {
        setCurrentUser({
          role: selectedRole,
          email: cred.email,
          name: cred.name,
          organization: cred.org
        });
        setLoading(false);
        onLoginSuccess(selectedRole);
      } else {
        setLoading(false);
        setError(`Invalid demo credentials. Use ${cred.email} and password ${cred.pass}`);
      }
    }, 300);
  };

  const handleQuickLogin = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentUser({
      role: role,
      email: cred.email,
      name: cred.name,
      organization: cred.org
    });
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#073F68] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F57A16] via-[#073F68] to-[#087D70]" />

          {/* Logo */}
          <div className="flex justify-center mb-6 pt-2">
            <SamadhanLogo size="md" showTagline={true} />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Sign In to SAMADHAN</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your stakeholder role to access dedicated workflow tools
            </p>
          </div>

          {/* Role selection tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            {(['citizen', 'government', 'college', 'industry'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleTabChange(r)}
                className={`py-2 text-[11px] font-bold rounded-lg capitalize transition-all ${
                  selectedRole === r
                    ? 'bg-white text-[#073F68] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'citizen' ? '👤 Citizen' : r === 'government' ? '🏛️ Govt' : r === 'college' ? '🎓 College' : '🏭 Industry'}
              </button>
            ))}
          </div>

          {/* Auto-filled Credential Hint Box */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3 mb-5 text-xs">
            <div className="flex items-center justify-between text-blue-900 font-bold mb-1">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                Demo Credentials Loaded
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                Test Mode
              </span>
            </div>
            <div className="text-slate-600 font-mono space-y-0.5 text-[11px]">
              <div>Email: <strong>{DEMO_CREDENTIALS[selectedRole].email}</strong></div>
              <div>Password: <strong>{DEMO_CREDENTIALS[selectedRole].pass}</strong></div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl mb-4 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#073F68] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#073F68] hover:bg-[#052d4b] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In as {DEMO_CREDENTIALS[selectedRole].roleLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Instant 1-click button */}
            <button
              type="button"
              onClick={() => handleQuickLogin(selectedRole)}
              className="w-full py-2 px-3 text-xs font-semibold text-[#087D70] bg-teal-50 hover:bg-teal-100/70 border border-teal-200 rounded-xl transition-all"
            >
              ⚡ Instant 1-Click Demo Login
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2">
        SAMADHAN Civic Tech • Ministry of Education & SIH
      </div>
    </div>
  );
};

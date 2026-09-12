import React, { useState, useEffect } from 'react';
import { UserRole, NotificationItem } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  DEMO_CREDENTIALS,
  resetDatabaseToDemo,
  loadDatabase,
  subscribeToRealtimeConnection,
  RealtimeStatusInfo
} from '../data/storage';
import {
  User,
  GraduationCap,
  Building2,
  Landmark,
  RotateCcw,
  Bell,
  CheckCircle,
  ExternalLink,
  Info,
  Radio,
  Wifi,
  Database
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface DemoHeaderBarProps {
  currentRole: UserRole | null;
  onRoleChange?: (role: UserRole) => void;
  onSwitchRole?: (role: UserRole) => void;
  onOpenNotifications?: () => void;
  onGoHome?: () => void;
}

export const DemoHeaderBar: React.FC<DemoHeaderBarProps> = ({
  currentRole,
  onRoleChange,
  onSwitchRole,
  onOpenNotifications,
  onGoHome
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [realtime, setRealtime] = useState<RealtimeStatusInfo>({
    status: 'connecting',
    activeClients: 1,
    lastSyncTime: new Date().toISOString()
  });

  const updateCount = () => {
    const db = loadDatabase();
    const count = db.notifications.filter(
      (n) => !n.read && (n.targetRole === currentRole || n.targetRole === 'all')
    ).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('samadhan_db_updated', updateCount);
    const unsubRealtime = subscribeToRealtimeConnection((info) => {
      setRealtime(info);
    });
    return () => {
      window.removeEventListener('samadhan_db_updated', updateCount);
      unsubRealtime();
    };
  }, [currentRole]);

  const handleSwitch = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentUser({
      role,
      email: cred.email,
      name: cred.name,
      organization: cred.org
    });
    if (onSwitchRole) {
      onSwitchRole(role);
    } else if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo problems and records back to default presentation state?')) {
      resetDatabaseToDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <header className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Notice: Official Prototype Marker */}
        <div className="flex items-center gap-2">
          {onGoHome ? (
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 hover:opacity-90 transition-all text-left group"
              title="Return to SAMADHAN National Portal Homepage"
            >
              <span className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40 text-[10px] tracking-wider uppercase group-hover:border-amber-400 transition-colors flex items-center gap-1">
                <span>🏛️</span>
                <span>SIH • GOI Prototype</span>
              </span>
              <span className="hidden sm:inline text-slate-300 text-[11px] font-medium group-hover:text-white transition-colors">
                National Civic Grid Sandbox
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40 text-[10px] tracking-wider uppercase flex items-center gap-1">
                <span>🏛️</span>
                <span>SIH • GOI Prototype</span>
              </span>
              <span className="hidden sm:inline text-slate-300 text-[11px] font-medium">
                National Civic Innovation Sandbox
              </span>
            </div>
          )}
        </div>

        {/* Center: Instant Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/95 p-1 rounded-lg border border-slate-700/80 shadow-inner">
          <span className="text-[10px] font-semibold text-slate-400 px-1.5 hidden md:inline">
            Fast Role Switch:
          </span>

          <button
            onClick={() => handleSwitch('citizen')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === 'citizen'
                ? 'bg-[#E65100] text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title="Citizen Portal (नागरिक)"
          >
            <User className="w-3 h-3" />
            <span>Citizen (नागरिक)</span>
          </button>

          <button
            onClick={() => handleSwitch('government')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === 'government'
                ? 'bg-[#0B2E59] text-white ring-1 ring-amber-400/50 shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title="Government Nodal Officer (प्रशासन)"
          >
            <Landmark className="w-3 h-3" />
            <span>Govt (प्रशासन)</span>
          </button>

          <button
            onClick={() => handleSwitch('college')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === 'college'
                ? 'bg-purple-700 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title="College Innovation Lab (विश्वविद्यालय)"
          >
            <GraduationCap className="w-3 h-3" />
            <span>College (कॉलेज)</span>
          </button>

          <button
            onClick={() => handleSwitch('industry')}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentRole === 'industry'
                ? 'bg-[#0D652D] text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title="Industry Technical Vetting (उद्योग)"
          >
            <Building2 className="w-3 h-3" />
            <span>Industry (उद्योग)</span>
          </button>
        </div>

        {/* Right Tools: Realtime status, Theme changer, Reset & Notifications */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode & Typography Font Switcher */}
          <ThemeSelector />

          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/90 border border-slate-700 text-[11px]"
            title={`Real-time WebSocket connection to server database. Last sync: ${new Date(realtime.lastSyncTime).toLocaleTimeString()}`}
          >
            <span className="relative flex h-2 w-2">
              {realtime.status === 'connected' ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
              )}
            </span>
            <span className="font-medium text-slate-300 flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400 hidden sm:inline" />
              <span className="hidden md:inline text-slate-400">DB:</span>
              <span
                className={
                  realtime.status === 'connected'
                    ? 'text-emerald-400 font-semibold'
                    : 'text-amber-400 font-medium'
                }
              >
                {realtime.status === 'connected' ? 'Live Synced' : 'Connecting'}
              </span>
            </span>
          </div>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="View Role Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={handleResetData}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
            title="Reset database to initial demo state"
          >
            <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">
              {resetSuccess ? 'Reset!' : 'Reset Demo'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

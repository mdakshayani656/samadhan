import React from 'react';
import { NotificationItem, UserRole } from '../types';
import { loadDatabase, markNotificationsAsRead } from '../data/storage';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  X
} from 'lucide-react';

interface NotificationsModalProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onSelectProblem?: (problemId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  role,
  isOpen,
  onClose,
  onSelectProblem
}) => {
  if (!isOpen) return null;

  const db = loadDatabase();
  const roleNotifications = db.notifications.filter(
    (n) => n.targetRole === role || n.targetRole === 'all'
  );

  const handleMarkAllRead = () => {
    markNotificationsAsRead(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#073F68] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Portal Notifications</h3>
              <p className="text-xs text-white/80 capitalize">
                Showing alerts for: {role} role
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {roleNotifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No alerts for this role yet</p>
            </div>
          ) : (
            roleNotifications.map((notif) => {
              let Icon = Info;
              let iconColor = 'text-blue-600 bg-blue-50 border-blue-200';
              if (notif.type === 'success') {
                Icon = CheckCircle2;
                iconColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
              } else if (notif.type === 'alert' || notif.type === 'warning') {
                Icon = AlertTriangle;
                iconColor = 'text-amber-600 bg-amber-50 border-amber-200';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.problemId && onSelectProblem) {
                      onSelectProblem(notif.problemId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notif.read ? 'bg-slate-50/70 border-slate-200/80' : 'bg-white border-blue-200 shadow-sm'
                  } ${notif.problemId ? 'cursor-pointer hover:border-[#073F68]' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${iconColor} flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(notif.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                      {notif.problemId && (
                        <span className="inline-block text-[10px] font-semibold text-[#087D70] mt-1.5 hover:underline">
                          View Related Problem →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#073F68] text-white rounded-lg text-xs font-bold hover:bg-[#063354] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

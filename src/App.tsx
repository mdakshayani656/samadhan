import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  subscribeToDatabase,
  subscribeToAuth,
  DEMO_CREDENTIALS
} from './data/storage';
import { DemoHeaderBar } from './components/DemoHeaderBar';
import { GovAccessibilityHeader } from './components/GovAccessibilityHeader';
import { NotificationsModal } from './components/NotificationsModal';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LoginPage } from './pages/LoginPage';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportProblem } from './pages/citizen/ReportProblem';
import { GovernmentPortal } from './pages/government/GovernmentPortal';
import { CollegePortal } from './pages/college/CollegePortal';
import { IndustryPortal } from './pages/industry/IndustryPortal';

type AppView = 'landing' | 'select-role' | 'login' | 'dashboard' | 'report-problem';

export default function App() {
  const [currentUser, setUser] = useState(getCurrentUser());
  const [view, setView] = useState<AppView>(currentUser ? 'dashboard' : 'landing');
  const [pendingRole, setPendingRole] = useState<UserRole>('citizen');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [citizenTab, setCitizenTab] = useState<'dashboard' | 'report' | 'my-reports' | 'notifications'>('dashboard');
  const [selectedCitizenProblemId, setSelectedCitizenProblemId] = useState<string | null>(null);
  const [govtInitialTab, setGovtInitialTab] = useState<'pending' | 'verified' | 'funding' | 'analytics'>('pending');

  // React to storage events
  useEffect(() => {
    const unsubDb = subscribeToDatabase(() => {
      // Force re-render on database changes
      setUser(getCurrentUser());
    });
    const unsubAuth = subscribeToAuth((updatedUser) => {
      setUser(updatedUser);
      if (updatedUser) {
        setView('dashboard');
      } else {
        setView('landing');
      }
    });

    return () => {
      unsubDb();
      unsubAuth();
    };
  }, []);

  const handleQuickSwitchRole = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    setCurrentUser({
      role: role,
      email: cred.email,
      name: cred.name,
      organization: cred.org
    });
    setView('dashboard');
    setSelectedCitizenProblemId(null);
  };

  const handleSelectRoleFromLanding = (role: UserRole) => {
    setPendingRole(role);
    setView('login');
  };

  const handleLogout = () => {
    clearCurrentUser();
    setView('landing');
    setSelectedCitizenProblemId(null);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setView('dashboard');
    setSelectedCitizenProblemId(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F8] dark:bg-[#090e17] flex flex-col text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-200 selection:text-slate-900">
      {/* Official Government of India Top Masthead & Accessibility Strip */}
      <GovAccessibilityHeader />

      {/* Top Demo Bar (Always present to allow seamless role switching, notifications, & quick reset) */}
      <DemoHeaderBar
        currentRole={currentUser?.role || null}
        onSwitchRole={handleQuickSwitchRole}
        onRoleChange={handleQuickSwitchRole}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onGoHome={() => {
          clearCurrentUser();
          setView('landing');
        }}
      />

      {/* Main Screen Router */}
      <div className="flex-1 flex flex-col">
        {view === 'landing' && (
          <LandingPage
            onSelectRole={handleSelectRoleFromLanding}
            onLoginSuccess={handleLoginSuccess}
            onExploreAllRoles={() => setView('select-role')}
          />
        )}

        {view === 'select-role' && (
          <RoleSelectionPage
            onSelectRole={(role) => {
              setPendingRole(role);
              setView('login');
            }}
            onBackToHome={() => setView('landing')}
          />
        )}

        {view === 'login' && (
          <LoginPage
            initialRole={pendingRole}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setView('select-role')}
          />
        )}

        {view === 'report-problem' && (
          <ReportProblem
            onBack={() => {
              setView('dashboard');
              setCitizenTab('dashboard');
            }}
            onSuccess={(problemId) => {
              setSelectedCitizenProblemId(problemId);
              setView('dashboard');
              setCitizenTab('my-reports');
            }}
          />
        )}

        {view === 'dashboard' && currentUser && (
          <>
            {currentUser.role === 'citizen' && (
              <CitizenDashboard
                activeTab={citizenTab}
                onNavigateTab={(tab) => {
                  if (tab === 'report') {
                    setView('report-problem');
                  } else {
                    setCitizenTab(tab);
                  }
                }}
                onOpenReportForm={() => setView('report-problem')}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onLogout={handleLogout}
                selectedProblemId={selectedCitizenProblemId}
                onSelectProblem={(id) => setSelectedCitizenProblemId(id)}
              />
            )}

            {currentUser.role === 'government' && (
              <GovernmentPortal
                initialTab={govtInitialTab}
                onLogout={handleLogout}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
              />
            )}

            {currentUser.role === 'college' && (
              <CollegePortal
                onLogout={handleLogout}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onSwitchToIndustry={() => handleQuickSwitchRole('industry')}
              />
            )}

            {currentUser.role === 'industry' && (
              <IndustryPortal
                onLogout={handleLogout}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onSwitchToGovernment={() => handleQuickSwitchRole('government')}
              />
            )}
          </>
        )}
      </div>

      {/* Unified Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectProblem={(problemId) => {
          setIsNotificationsOpen(false);
          if (currentUser?.role === 'citizen') {
            setSelectedCitizenProblemId(problemId);
            setCitizenTab('my-reports');
            setView('dashboard');
          }
        }}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Bell, Shield, LogOut, ChevronDown, UserCheck, 
  HelpCircle, Search, ShieldCheck, KeyRound, Sparkles, Check, 
  AlertTriangle, Lock, User
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { AdminSidebar } from '../components/admin-dashboard/AdminSidebar';

// SUB-VIEWS
import { AdminDashboardHomeView } from '../components/admin-dashboard/views/AdminDashboardHomeView';
import { AdminUserManagementView } from '../components/admin-dashboard/views/AdminUserManagementView';
import { AdminRolesPermissionsView } from '../components/admin-dashboard/views/AdminRolesPermissionsView';
import { SuperAdminManagementView } from '../components/admin-dashboard/views/SuperAdminManagementView';
import { AdminPatientManagementView } from '../components/admin-dashboard/views/AdminPatientManagementView';
import { AdminStaffManagementView } from '../components/admin-dashboard/views/AdminStaffManagementView';
import { AdminOperationsView } from '../components/admin-dashboard/views/AdminOperationsView';
import { AdminSecurityAuditView } from '../components/admin-dashboard/views/AdminSecurityAuditView';
import { AdminSystemSettingsView } from '../components/admin-dashboard/views/AdminSystemSettingsView';
import { AdminReportsAnalyticsView } from '../components/admin-dashboard/views/AdminReportsAnalyticsView';

interface AdminDashboardPageProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  initialNavId?: string;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  user,
  initialNavId = 'dashboard',
  onLogout,
  onNavigate: _onNavigate
}) => {
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Super Admin'>('Super Admin');
  const [activeNavId, setActiveNavId] = useState<string>(initialNavId);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const adminName = currentRole === 'Super Admin' ? 'Vikramaditya Rao' : 'Kavita Sundaram';
  const adminEmail = currentRole === 'Super Admin' ? 'superadmin@dhr-medicare.in' : 'admin.kavita@dhr-medicare.in';

  const SUPER_ADMIN_ONLY_VIEWS = [
    'admin-management',
    'roles-permissions',
    'system-config',
    'security-audit',
    'backup-recovery'
  ];

  const handleSelectNav = (id: string) => {
    setActiveNavId(id);
    localStorage.setItem('admin_active_nav_id', id);

    const targetUrl = `/admin/${id}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  };

  const isRestricted = currentRole === 'Admin' && SUPER_ADMIN_ONLY_VIEWS.includes(activeNavId);

  const renderContent = () => {
    if (isRestricted) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto p-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Super Admin Access Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This administrative module contains system-wide security, role assignment, and firewall policies. Please elevate your credentials to Super Admin.
            </p>
          </div>
          <button
            onClick={() => setCurrentRole('Super Admin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md cursor-pointer"
          >
            Switch Role to Super Admin
          </button>
        </div>
      );
    }

    switch (activeNavId) {
      case 'dashboard':
        return <AdminDashboardHomeView onNavigate={handleSelectNav} currentRole={currentRole} />;
      case 'users':
        return <AdminUserManagementView />;
      case 'patients':
        return <AdminPatientManagementView />;
      case 'doctors':
        return <AdminStaffManagementView type="doctor" />;
      case 'nurses':
        return <AdminStaffManagementView type="nurse" />;
      case 'pharmacists':
      case 'caregivers':
      case 'insurance':
        return <AdminOperationsView type="insurance" />;
      case 'pharmacy-orders':
      case 'prescriptions':
      case 'medical-records':
      case 'appointments':
      case 'vitals-monitoring':
      case 'notifications-dispatch':
        return <AdminOperationsView type="pharmacy" />;
      case 'admin-management':
        return <SuperAdminManagementView currentRole={currentRole} />;
      case 'roles-permissions':
        return <AdminRolesPermissionsView currentRole={currentRole} />;
      case 'system-config':
      case 'security-audit':
      case 'backup-recovery':
      case 'activity-logs':
        return <AdminSecurityAuditView currentRole={currentRole} />;
      case 'reports-analytics':
        return <AdminReportsAnalyticsView />;
      case 'settings':
        return <AdminSystemSettingsView />;
      default:
        return <AdminDashboardHomeView onNavigate={handleSelectNav} currentRole={currentRole} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      
      {/* 1. TOP EXECUTIVE HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 border font-mono ${
                currentRole === 'Super Admin'
                  ? 'text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-900/30 border-rose-500/30'
                  : 'text-blue-700 dark:text-cyan-300 bg-blue-500/10 dark:bg-cyan-900/30 border-blue-500/30'
              }`}>
                <Shield className="w-3.5 h-3.5" /> {currentRole} Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* DEMO ROLE SWITCHER PILL */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrentRole('Admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'Admin' 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setCurrentRole('Super Admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'Super Admin' 
                  ? 'bg-rose-500 text-white shadow-xs font-black' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Super Admin
            </button>
          </div>

          <button 
            onClick={() => handleSelectNav('security-audit')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="System Security Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse" />
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                currentRole === 'Super Admin' ? 'bg-rose-600' : 'bg-blue-600'
              }`}>
                {adminName.charAt(0)}
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 hidden md:block">{adminName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 space-y-1 text-xs font-bold"
                >
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="font-black text-slate-900 dark:text-white">{adminName}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{adminEmail}</p>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectNav('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-500" /> My Profile & Settings
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole(currentRole === 'Admin' ? 'Super Admin' : 'Admin');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Switch Role Mode
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {currentRole === 'Admin' ? '→ Super' : '→ Admin'}
                    </span>
                  </button>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar
            activeId={activeNavId}
            onSelectNav={handleSelectNav}
            currentRole={currentRole}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl"
              >
                <AdminSidebar
                  activeId={activeNavId}
                  onSelectNav={(id) => {
                    handleSelectNav(id);
                    setMobileSidebarOpen(false);
                  }}
                  currentRole={currentRole}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeNavId}-${currentRole}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

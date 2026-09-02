import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ChevronLeft,
  LockKeyhole,
  Building2
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';

interface AdminLoginPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: string) => void;
  onSuccessLogin?: (userData: {
    name: string;
    email: string;
    role: 'Admin' | 'Super Admin';
    department?: string;
  }) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigateHome,
  onNavigate: _onNavigate,
  onSuccessLogin
}) => {
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Super Admin'>('Super Admin');
  const [email, setEmail] = useState('superadmin@dhr-medicare.in');
  const [password, setPassword] = useState('Directorate@2026');
  const [securityKey, setSecurityKey] = useState('SUPER-ROOT-001');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Role preset credentials helper
  const handleSelectRole = (role: 'Admin' | 'Super Admin') => {
    setSelectedRole(role);
    if (role === 'Super Admin') {
      setEmail('superadmin@dhr-medicare.in');
      setPassword('Directorate@2026');
      setSecurityKey('SUPER-ROOT-001');
    } else {
      setEmail('admin.kavita@dhr-medicare.in');
      setPassword('HospitalAdmin@2026');
      setSecurityKey('ADM-EXEC-442');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const name = selectedRole === 'Super Admin' ? 'Vikramaditya Rao' : 'Kavita Sundaram';
      const userPayload = {
        name,
        email,
        role: selectedRole,
        department: selectedRole === 'Super Admin' ? 'National Health Directorate' : 'Hospital Executive Admin'
      };

      localStorage.setItem('app_user', JSON.stringify(userPayload));
      localStorage.setItem('app_is_logged_in', 'true');
      localStorage.setItem('admin_active_nav_id', 'dashboard');

      if (onSuccessLogin) {
        onSuccessLogin(userPayload);
      } else {
        window.location.href = '/admin/dashboard';
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans select-none relative">
      
      {/* SINGLE CENTERED CLEAN CARD (NO HEADER) */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-6 relative">
          
          {/* BACK TO HOME LINK */}
          <button
            onClick={onNavigateHome}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer absolute top-6 left-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* HEADER & DYNAMIC ROLE LOGO */}
          <div className="text-center space-y-2 pt-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300 ${
              selectedRole === 'Super Admin'
                ? 'bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 text-white shadow-rose-500/30 ring-4 ring-rose-500/10'
                : 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-500 text-white shadow-blue-500/30 ring-4 ring-blue-500/10'
            }`}>
              {selectedRole === 'Super Admin' ? (
                <KeyRound className="w-7 h-7" />
              ) : (
                <LockKeyhole className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
              {selectedRole === 'Super Admin' ? 'Super Admin Directorate' : 'Executive Authentication'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {selectedRole === 'Super Admin' ? 'Root master clearance & security overrides' : 'Authorized login for Hospital Admins'}
            </p>
          </div>

          {/* ROLE BASED ACCESS DROPDOWN SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Select Role
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {selectedRole === 'Super Admin' ? (
                  <KeyRound className="w-4 h-4 text-rose-500" />
                ) : (
                  <Shield className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                )}
              </div>
              <select
                value={selectedRole}
                onChange={(e) => handleSelectRole(e.target.value as 'Admin' | 'Super Admin')}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Administrative Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dhr-medicare.in"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Passphrase / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(prev => !prev);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors z-10"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hardware Token / PIN</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="e.g. SUPER-ROOT-001"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-blue-600 dark:text-cyan-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                selectedRole === 'Super Admin'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/20'
              } disabled:opacity-50 hover:scale-101`}
            >
              {isLoading ? (
                <span>Authenticating Node...</span>
              ) : (
                <>
                  <span>Sign In to {selectedRole} Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              256-Bit SSL Encrypted • ABDM National Node
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-900 font-mono">
        © 2026 MediCare Digital Health Records • Admin Directorate System
      </footer>

    </div>
  );
};

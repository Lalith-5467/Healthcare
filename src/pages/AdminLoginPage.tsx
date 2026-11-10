import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  LockKeyhole,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { authApi } from '../services/dhrApis';
import { setAuthToken } from '../services/apiClient';
import { safeLocalStorageSet } from '../utils/safeStorage';

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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('superadmin@dhr-medicare.in');
  const [password, setPassword] = useState('Admin@123');
  const [securityKey, setSecurityKey] = useState('SUPER-ROOT-001');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role preset credentials helper
  const handleSelectRole = (role: 'Admin' | 'Super Admin') => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'Super Admin') {
      setEmail('superadmin@dhr-medicare.in');
      setPassword('Admin@123');
      setSecurityKey('SUPER-ROOT-001');
    } else {
      setEmail('admin.kavita@dhr-medicare.in');
      setPassword('Admin@123');
      setSecurityKey('ADM-EXEC-442');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res && res.data && res.data.token) {
        const { user, token } = res.data;

        // Validate the authenticated user actually has admin privileges
        const upperRole = (user.role || '').toUpperCase();
        if (upperRole !== 'ADMIN' && upperRole !== 'SUPER_ADMIN') {
          throw new Error(
            `This account (${user.email}) is registered as "${user.role}". Only ADMIN or SUPER_ADMIN accounts can access the Admin Console.`
          );
        }

        setAuthToken(token);
        safeLocalStorageSet('token', token);
        safeLocalStorageSet('auth_token', token);

        const profile: any = user.profile || {};
        const resolvedRole: 'Admin' | 'Super Admin' = user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';
        const userPayload = {
          id: user.id,
          name: profile.fullName || (resolvedRole === 'Super Admin' ? 'Vikramaditya Rao' : 'Kavita Sundaram'),
          email: user.email,
          role: resolvedRole,
          department: resolvedRole === 'Super Admin' ? 'National Health Directorate' : 'Hospital Executive Admin',
        };

        safeLocalStorageSet('app_user', JSON.stringify(userPayload));
        safeLocalStorageSet('app_is_logged_in', 'true');
        safeLocalStorageSet('admin_active_nav_id', 'dashboard');

        if (onSuccessLogin) {
          onSuccessLogin(userPayload);
        } else {
          window.location.href = '/admin/dashboard';
        }
      } else {
        throw new Error(res?.message || 'Failed to authenticate administrator account.');
      }
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      const rawMsg: string = err?.message || '';
      let displayMsg: string;
      if (
        rawMsg === 'Failed to fetch' ||
        rawMsg.includes('NetworkError') ||
        rawMsg.includes('ERR_CONNECTION_REFUSED') ||
        rawMsg.includes('Unable to connect') ||
        err instanceof TypeError
      ) {
        displayMsg =
          'Authentication server is unavailable. Please verify the backend service is running on port 5000.';
      } else {
        displayMsg = rawMsg || 'Authentication failed. Please verify administrator credentials.';
      }
      setErrorMsg(displayMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans select-none relative selection:bg-[#00a896] selection:text-white">
      
      {/* SINGLE CENTERED CLEAN CARD (NO HEADER) */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-6 relative">
          
          {/* BACK TO HOME LINK */}
          <button
            onClick={onNavigateHome}
            className="text-xs font-bold text-slate-400 hover:text-[#00a896] dark:hover:text-teal-400 transition-colors flex items-center gap-1.5 cursor-pointer absolute top-6 left-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* HEADER & DYNAMIC ROLE LOGO */}
          <div className="text-center space-y-2 pt-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 bg-[#00a896] text-white">
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

          {/* ERROR ALERT */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROLE BASED ACCESS DROPDOWN SELECTOR */}
          <div className="space-y-1.5" ref={dropdownRef}>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Select Role
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] cursor-pointer transition-all"
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {selectedRole === 'Super Admin' ? (
                    <KeyRound className="w-4 h-4 text-[#00a896]" />
                  ) : (
                    <Shield className="w-4 h-4 text-[#00a896]" />
                  )}
                </div>
                <span>{selectedRole}</span>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180 text-[#00a896]' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-2xl z-50 space-y-1"
                  >
                    {(['Admin', 'Super Admin'] as const).map((role) => {
                      const isSelected = selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            handleSelectRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#00a896] text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-[#00a896]/10 hover:text-[#00a896]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {role === 'Super Admin' ? (
                              <KeyRound className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#00a896]'}`} />
                            ) : (
                              <Shield className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#00a896]'}`} />
                            )}
                            <span>{role}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]"
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
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]"
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
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#00a896]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hardware Token / PIN</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#00a896] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  placeholder="e.g. SUPER-ROOT-001"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-[#00a896] dark:text-[#00a896] focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 bg-[#00a896] hover:bg-[#009686] active:bg-[#00897b] text-white shadow-[#00a896]/25 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
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

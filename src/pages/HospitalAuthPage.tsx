import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Award
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { adminApi, hospitalAuthApi } from '../services/dhrApis';
import { type HospitalAdminRecord } from '../utils/adminMockStorage';

interface HospitalAuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigateHome: () => void;
  onNavigate: (page: string) => void;
  onSuccessLogin?: (hospital: HospitalAdminRecord) => void;
}

export const HospitalAuthPage: React.FC<HospitalAuthPageProps> = ({
  initialMode = 'login',
  onNavigateHome,
  onNavigate,
  onSuccessLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [facilityName, setFacilityName] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [bedCapacity, setBedCapacity] = useState<number | ''>('');
  const [accreditation, setAccreditation] = useState('NABH & JCI Accredited');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Handle Hospital Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessNotice(null);

    const emailClean = loginEmail.trim().toLowerCase();

    try {
      // Authenticate directly against database endpoint
      const res = await hospitalAuthApi.login({
        email: emailClean,
        password: loginPassword,
      });

      setIsLoading(false);

      if (res && res.data && res.data.hospital) {
        const foundHospital = res.data.hospital;

        // Store session tokens and active portal
        try {
          if (res.data.token) {
            localStorage.setItem('auth_token', res.data.token);
          }
          localStorage.setItem('active_hospital_portal', JSON.stringify(foundHospital));
          localStorage.setItem('app_is_logged_in', 'true');
          localStorage.setItem('app_user', JSON.stringify({
            name: foundHospital.adminName,
            email: foundHospital.adminEmail,
            role: 'Hospital Admin',
            hospital: foundHospital.name
          }));
        } catch {}

        if (onSuccessLogin) {
          onSuccessLogin(foundHospital);
        } else {
          onNavigate('hospital/dashboard');
        }
      } else {
        setErrorMsg('Failed to sign in. Please verify your administrator email.');
      }
    } catch (err: any) {
      setIsLoading(false);
      const serverMsg = err?.response?.data?.message || err?.message;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else {
        setErrorMsg('Unable to reach server. Please ensure the backend is running.');
      }
    }
  };

  // Handle Hospital Self-Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (!facilityName.trim()) {
      setErrorMsg('Hospital or Medical Center Name is required');
      setIsLoading(false);
      return;
    }

    if (!adminEmail.trim()) {
      setErrorMsg('Administrator Email is required');
      setIsLoading(false);
      return;
    }

    const newHospPayload = {
      name: facilityName.trim(),
      code: facilityCode.trim() || `HOSP-${Math.floor(100 + Math.random() * 900)}`,
      city: city.trim() || 'Chennai',
      state: state.trim() || 'Tamil Nadu',
      address: address.trim() || `${facilityName.trim()} Main Campus`,
      contactPhone: contactPhone.trim() || '+91 80 0000 0000',
      email: adminEmail.trim().toLowerCase(),
      adminName: adminName.trim() || 'Medical Director',
      adminEmail: adminEmail.trim().toLowerCase(),
      bedCapacity: Number(bedCapacity) || 0,
      accreditation: accreditation.trim() || 'NABH Accredited',
    };

    try {
      const res = await hospitalAuthApi.register(newHospPayload);
      setIsLoading(false);
      setSuccessNotice(
        `Facility "${facilityName}" registered successfully! It is now submitted for Admin review. Once approved by the Directorate, you can log in with ${adminEmail}.`
      );
      setMode('login');
      setLoginEmail(adminEmail);
    } catch (err: any) {
      setIsLoading(false);
      const serverMsg = err?.response?.data?.message || err?.message;
      setErrorMsg(serverMsg || 'Failed to submit hospital registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white flex flex-col justify-center items-center font-sans selection:bg-teal-500 selection:text-white relative">
      {/* MAIN CONTAINER */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0d1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/25 shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block font-mono">
                    Health Facility Network
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {mode === 'login' ? 'Hospital Management Portal' : 'Register New Hospital Facility'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Success Notice */}
            {successNotice && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="font-semibold">{successNotice}</div>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="font-semibold">{errorMsg}</div>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access your hospital's executive console, doctor directory, inpatient wards, and clinical administration.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hospital Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@hospital.in"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Administrative Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black tracking-wide shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isLoading ? 'Verifying Facility Credentials...' : 'Sign In to Hospital Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 text-center">
                  <span className="text-xs text-slate-500">Need to onboard a new hospital facility? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Register Facility
                  </button>
                </div>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-200 text-xs">
                  <span className="font-bold block">Hospital Self-Onboarding</span>
                  Once registered, your medical facility will be reviewed and approved by the Super Admin Directorate before opening for clinical duties.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital / Medical Center Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Apollo Super Specialty Hospital"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Facility Short Code
                    </label>
                    <input
                      type="text"
                      value={facilityCode}
                      onChange={(e) => setFacilityCode(e.target.value)}
                      placeholder="e.g. APO-CHN"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Bed Capacity
                    </label>
                    <input
                      type="number"
                      value={bedCapacity}
                      onChange={(e) => setBedCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Tamil Nadu"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 21 Greams Lane, Thousand Lights"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Admin Officer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Narayan"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@hospital.in"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Admin Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Accreditation
                    </label>
                    <input
                      type="text"
                      value={accreditation}
                      onChange={(e) => setAccreditation(e.target.value)}
                      placeholder="e.g. NABH & JCI Accredited"
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black tracking-wide shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{isLoading ? 'Submitting Registration...' : 'Submit Facility for Approval'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3 text-center">
                  <span className="text-xs text-slate-500">Already registered? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0b1120]">
        MediCare National Health Infrastructure • ABDM Compliant Facility Network
      </footer>
    </div>
  );
};

export default HospitalAuthPage;


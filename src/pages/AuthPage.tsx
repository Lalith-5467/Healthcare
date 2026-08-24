import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Activity, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  ChevronLeft,
  KeyRound
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  onSuccessLogin?: (userData: { name: string; email: string; abhaId?: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'login',
  onNavigateHome,
  onSuccessLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode with initialMode prop when changed
  useEffect(() => {
    setMode(initialMode);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [initialMode]);

  // Form states
  const [role, setRole] = useState<'patient' | 'doctor' | 'caregiver'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Status & feedback states
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-teal-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 15, label: 'Very Weak', color: 'bg-rose-600' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please check again.');
        return;
      }
      if (!agreedTerms) {
        setErrorMsg('Please accept the Terms of Service & ABDM Privacy Policy.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (onSuccessLogin) {
          onSuccessLogin({
            name: fullName || (email ? email.split('@')[0] : 'Lalith Patel'),
            email: email || 'lalith.patel@abdm.in',
            abhaId: abhaId || '91-8472-9104-5821@abdm'
          });
        } else {
          onNavigateHome();
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden flex flex-col justify-center">
      
      {/* BACKGROUND DECORATIVE GLOW ORBS */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00a896]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#0f3980]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP NAVIGATION BACK LINK */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#00a896] dark:hover:text-cyan-400 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00a896]" />
          <span>256-Bit Encrypted Portal</span>
        </div>
      </div>

      {/* MAIN CONTAINER GRID */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN - BRAND & FEATURE SHOWCASE (DESKTOP) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#0f3980] via-[#0b1b36] to-[#081224] p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-blue-900/50"
        >
          {/* DECORATIVE MESH IN OVERLAY */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

          {/* TOP CONTENT */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <Logo showBadge />
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-cyan-300 rounded-full border border-teal-400/30">
                ABDM Verified
              </span>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {mode === 'login' 
                  ? 'Access Your Unified Health Ecosystem' 
                  : 'Start Your Encrypted Health Journey'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Seamlessly manage ABHA health records, track live vitals, and coordinate family care with enterprise-grade privacy standards.
              </p>
            </div>

            {/* FEATURE HIGHLIGHT CARDS */}
            <div className="space-y-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:bg-white/15 transition-all">
                <div className="p-2 rounded-xl bg-[#00a896]/30 text-cyan-300 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ayushman Bharat (ABHA) Integration</h4>
                  <p className="text-[11px] text-slate-300">Instantly fetch lab reports, doctor prescriptions, and hospital discharge summaries.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:bg-white/15 transition-all">
                <div className="p-2 rounded-xl bg-orange-500/30 text-orange-300 mt-0.5">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Emergency SOS Medical Card</h4>
                  <p className="text-[11px] text-slate-300">Offline-scannable QR containing critical allergies, blood group & emergency contacts.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:bg-white/15 transition-all">
                <div className="p-2 rounded-xl bg-cyan-500/30 text-cyan-300 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero-Knowledge Data Vault</h4>
                  <p className="text-[11px] text-slate-300">Your health data is end-to-end encrypted with granular consent revocation controls.</p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM TESTIMONIAL / TRUST METRICS */}
          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-[#0f3980] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-[#0f3980] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-[#0f3980] object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" alt="User" />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Trusted by 50,000+ Patients</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <span>★ 4.9/5 Rating</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - THE AUTHENTICATION FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            {/* SEGMENTED SWITCHER (LOGIN vs REGISTER) */}
            <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 flex items-center mb-8 relative">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#00a896] text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Account</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#00a896] text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Register New Account</span>
              </button>
            </div>

            {/* FORM TITLE */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {mode === 'login' ? 'Welcome back to MediCare' : 'Create your health profile'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Enter your credentials to securely access your medical records'
                  : 'Join the connected healthcare network with ABDM health ID support'}
              </p>
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-6 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* SUCCESS INTERACTIVE FEEDBACK */}
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {mode === 'login' ? 'Authentication Successful!' : 'Registration Complete!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  {mode === 'login' 
                    ? 'Loading your personalized health dashboard and ABHA medical records...' 
                    : 'Your encrypted account has been provisioned. Redirecting to home...'}
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                  <div className="bg-[#00a896] h-full animate-pulse w-full" />
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ROLE SELECTOR PIILL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Account Portal Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'patient', label: 'Patient' },
                      { id: 'caregiver', label: 'Caregiver' },
                      { id: 'doctor', label: 'Doctor / Provider' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id as any)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                          role === item.id
                            ? 'bg-[#0f3980]/10 border-[#0f3980] text-[#0f3980] dark:bg-cyan-500/10 dark:border-cyan-400 dark:text-cyan-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* REGISTER ONLY: FULL NAME & PHONE */}
                {mode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lalith Patel"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* EMAIL OR ABHA ADDRESS */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {mode === 'login' ? 'Email Address or ABHA ID' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="patient@abdm.in or user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                {/* REGISTER ONLY: OPTIONAL ABHA ID */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ABHA Health ID <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setAbhaId('91-8472-9104-5821@abdm')}
                        className="text-[10px] text-[#00a896] dark:text-cyan-400 hover:underline font-semibold"
                      >
                        Auto-fill sample ID
                      </button>
                    </div>
                    <div className="relative">
                      <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="14-digit ABHA ID or username@abdm"
                        value={abhaId}
                        onChange={(e) => setAbhaId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* PASSWORD FIELDS */}
                <div className={mode === 'register' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-1'}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PASSWORD STRENGTH BAR FOR REGISTER */}
                {mode === 'register' && password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Password Strength:</span>
                      <span className={`font-bold ${strength.score > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                    </div>
                  </div>
                )}

                {/* OPTIONS FOR LOGIN: REMEMBER ME & FORGOT PASSWORD */}
                {mode === 'login' ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#00a896] focus:ring-[#00a896]"
                      />
                      <span>Remember this device</span>
                    </label>

                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }} className="text-[#00a896] dark:text-cyan-400 font-bold hover:underline">
                      Forgot password?
                    </a>
                  </div>
                ) : (
                  /* OPTIONS FOR REGISTER: TERMS & PRIVACY */
                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#00a896] focus:ring-[#00a896]"
                      />
                      <span>
                        I agree to the <a href="#" className="text-[#00a896] dark:text-cyan-400 font-bold hover:underline">Terms of Service</a> & <a href="#" className="text-[#00a896] dark:text-cyan-400 font-bold hover:underline">ABDM Health Privacy Policy</a>.
                      </span>
                    </label>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-xs font-bold text-white bg-[#00a896] hover:bg-[#00897b] shadow-lg shadow-teal-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Encrypted Profile'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* SOCIAL / SINGLE SIGN-ON DIVIDER */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Or Continue With Digital Health SSO
                  </span>
                </div>

                {/* SSO BUTTONS */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setEmail('abha.user@abdm.in'); setPassword('AbdmPass@2026'); }}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00a896] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-teal-500" />
                    <span>ABHA (ABDM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setEmail('user.google@gmail.com'); setPassword('GooglePass@2026'); }}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00a896] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="text-blue-500 font-bold">G</span>
                    <span>Google Login</span>
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* BOTTOM TOGGLE CAPTION */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have a MediCare account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="text-[#00a896] dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Create one in 1 minute
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="text-[#00a896] dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

        </motion.div>

      </div>
    </div>
  );
};

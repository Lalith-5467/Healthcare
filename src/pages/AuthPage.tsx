import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  KeyRound,
  UserPlus,
  HeartHandshake,
  Stethoscope,
  Zap,
  Check,
  Calendar,
  Heart,
  Droplet,
  PhoneCall,
  Users,
  AlertCircle,
  Hash,
  Award,
  Building2,
  FileCheck2,
  Video,
  Shield,
  Briefcase
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigateHome: () => void;
  onNavigate?: (page: string) => void;
  onSuccessLogin?: (userData: { 
    name: string; 
    email: string; 
    role?: string;
    abhaId?: string;
    bloodGroup?: string;
    age?: number;
    phone?: string;
    emergencyContact?: string;
    specialization?: string;
    hospitalAffiliation?: string;
  }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'login',
  onNavigateHome,
  onSuccessLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [initialMode]);

  // Role Selection
  const [role, setRole] = useState<'patient' | 'doctor' | 'caregiver'>('patient');

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Patient Specific States
  const [abhaId, setAbhaId] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [familyPhone, setFamilyPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [allergies, setAllergies] = useState('');

  // Caregiver Specific States
  const [caregiverType, setCaregiverType] = useState('Family Member');
  const [caregiverGovId, setCaregiverGovId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('Parent');
  const [patientAbhaId, setPatientAbhaId] = useState('');
  const [authorizationScope, setAuthorizationScope] = useState('Full Medical Proxy');

  // Doctor Specific States
  const [medicalCouncilRegNo, setMedicalCouncilRegNo] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [qualifications, setQualifications] = useState('MBBS, MD');
  const [experienceYears, setExperienceYears] = useState('10');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [hprAddress, setHprAddress] = useState('');
  const [teleConsultReady, setTeleConsultReady] = useState(true);

  // Status feedback states
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-calculate age from DOB
  const handleDobChange = (dateStr: string) => {
    setDob(dateStr);
    if (dateStr) {
      const birthDate = new Date(dateStr);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge < 130) {
        setAge(calculatedAge.toString());
      }
    }
  };

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

  const handleQuickDemoFill = () => {
    setErrorMsg('');
    setPassword('MediCare@2026');
    setConfirmPassword('MediCare@2026');
    setAgreedTerms(true);

    if (role === 'patient') {
      setFullName('Lalith Patel');
      setEmail('lalith.patel@abdm.in');
      setPhone('+91 98765 43210');
      setDob('1992-05-14');
      setAge('34');
      setGender('Male');
      setBloodGroup('O+');
      setFamilyPhone('+91 98765 11223');
      setEmergencyContactName('Priya Patel (Spouse)');
      setAllergies('Penicillin, Dust');
      setAbhaId('14-8472-9104-5821');
    } else if (role === 'caregiver') {
      setFullName('Sunita Rao');
      setEmail('sunita.caregiver@abdm.in');
      setPhone('+91 98111 22334');
      setCaregiverType('Family Member');
      setCaregiverGovId('9842-1940-5821');
      setPatientName('Ramesh Rao (Father)');
      setPatientRelation('Parent');
      setPatientAbhaId('14-9981-4432-1109');
      setAuthorizationScope('Full Medical Proxy');
    } else if (role === 'doctor') {
      setFullName('Dr. Rajesh Varma');
      setEmail('dr.varma@apollohealthcare.in');
      setPhone('+91 98222 33445');
      setMedicalCouncilRegNo('NMC-2014-089421');
      setSpecialization('Cardiology');
      setQualifications('MBBS, MD (Cardiology), DM');
      setExperienceYears('14');
      setHospitalAffiliation('Apollo Multi-Specialty Hospital, Chennai');
      setHprAddress('dr.varma@hpr.abdm');
      setTeleConsultReady(true);
    }
  };

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
            name: fullName || (email ? email.split('@')[0] : (role === 'doctor' ? 'Dr. Rajesh Varma' : 'Lalith Patel')),
            email: email || 'lalith.patel@abdm.in',
            role: role === 'doctor' ? 'Doctor' : (role === 'caregiver' ? 'Caregiver' : 'Patient'),
            abhaId: role === 'doctor' ? (hprAddress || 'dr.varma@hpr.abdm') : (abhaId || '91-8472-9104-5821@abdm'),
            bloodGroup: bloodGroup || 'O+',
            age: age ? parseInt(age, 10) : 34,
            phone: phone || '+91 98765 43210',
            emergencyContact: familyPhone || '+91 98765 11223',
            specialization: role === 'doctor' ? specialization : undefined,
            hospitalAffiliation: role === 'doctor' ? hospitalAffiliation : undefined
          });
        } else {
          onNavigateHome();
        }
      }, 1200);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden flex flex-col justify-center select-none">
      
      {/* BACKGROUND DECORATIVE GLOW ACCENTS */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#00a896]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* CORNER NAVIGATION: TOP-LEFT BACK TO HOME BUTTON */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-8 z-50">
        <motion.button
          whileHover={{ x: -3, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-slate-850/95 hover:bg-white dark:hover:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-100 hover:text-[#00a896] dark:hover:text-cyan-300 border border-slate-200/90 dark:border-slate-700 shadow-md backdrop-blur-xl transition-all cursor-pointer group"
          title="Return to MediCare Landing Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5] text-[#00a896] dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* MAIN CONTAINER (CENTERED ON REGISTER, 2-COLUMN ON LOGIN) */}
      <div className={`mx-auto w-full relative z-10 pt-10 sm:pt-6 ${
        mode === 'register' 
          ? 'max-w-2xl' 
          : 'max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch'
      }`}>
        
        {/* LEFT COLUMN - HERO POSTER & VALUE PROPOSITION (ONLY SHOWN ON LOGIN) */}
        {mode === 'login' && (
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="h-full rounded-3xl bg-gradient-to-br from-[#0b172a] via-[#091b36] to-[#040e1e] p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-700/60">
              {/* AMBIENT MESH OVERLAY */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* TOP HEADER */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <Logo showBadge />
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-cyan-300 rounded-full border border-teal-400/30 font-mono shadow-xs">
                    ABDM Verified
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Access Your Unified Health Ecosystem
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Seamlessly manage ABHA health records, track live vitals, emergency SOS contacts, and coordinate care with enterprise-grade privacy standards.
                  </p>
                </div>

                {/* VALUE CARDS */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:border-teal-500/40 transition-all">
                    <div className="p-2.5 rounded-xl bg-teal-500/20 text-cyan-300 mt-0.5 border border-teal-500/30">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Ayushman Bharat (ABHA) Integration</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Instantly fetch verified lab reports, prescriptions, and hospital discharge summaries.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:border-teal-500/40 transition-all">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 mt-0.5 border border-rose-500/30">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Emergency SOS Medical Card</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Offline-scannable QR matrix containing critical allergies, blood group & emergency contacts.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:border-teal-500/40 transition-all">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 mt-0.5 border border-cyan-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Zero-Knowledge Data Vault</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Your health data is 256-bit encrypted with granular 1-tap consent revocation controls.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM TRUST METRICS */}
              <div className="relative z-10 pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Patient" />
                    <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Patient" />
                    <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80" alt="Patient" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">50,000+ Active Patients</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-400 font-extrabold">
                  <span>★ 4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AUTHENTICATION FORM (FULL-WIDTH CENTERED ON REGISTER, RIGHT-COLUMN ON LOGIN) */}
        <motion.div 
          initial={{ opacity: 0, y: mode === 'register' ? 20 : 0, x: mode === 'login' ? 30 : 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.5 }}
          className={mode === 'register' ? 'w-full' : 'lg:col-span-7'}
        >
          <div className="h-full rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
            <div>
              {/* SEGMENTED SWITCHER (LOGIN vs REGISTER) */}
              <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center mb-6 relative">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    mode === 'login'
                      ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    mode === 'register'
                      ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register New Account</span>
                </button>
              </div>

              {/* FORM HEADING */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {mode === 'login' 
                    ? 'Welcome back to MediCare' 
                    : (role === 'doctor' 
                        ? 'Doctor & Healthcare Provider Portal' 
                        : (role === 'caregiver' 
                            ? 'Caregiver & Guardian Portal Registration' 
                            : 'Patient Personal Health Registration'))}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {mode === 'login'
                    ? 'Enter your credentials to securely access your medical records and care circle.'
                    : (role === 'doctor'
                        ? 'Register your clinical credentials, medical license, and hospital affiliations.'
                        : (role === 'caregiver'
                            ? 'Set up family or professional proxy access to oversee patient vitals and medications.'
                            : 'Fill in your medical details to set up your personal health card and ABDM ecosystem.'))}
                </p>
              </div>

              {/* ERROR FEEDBACK ALERT */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold mb-6 flex items-center gap-2.5 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* SUCCESS ANIMATION FEEDBACK */}
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-4 my-6"
                >
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h4 className="text-xl font-black text-[#00a896] dark:text-cyan-300">
                    {mode === 'login' ? 'Authentication Successful!' : 'Registration Complete!'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
                    {mode === 'login' 
                      ? 'Loading your personalized health dashboard and ABHA medical records...' 
                      : `Your ${role.toUpperCase()} profile and authorization credentials have been provisioned. Redirecting...`}
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                    <div className="bg-gradient-to-r from-[#00a896] to-cyan-400 h-full animate-pulse w-full" />
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* ROLE SELECTOR CARDS */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider font-mono">
                      Select Portal Access Role
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'patient', label: 'Patient', icon: User },
                        { id: 'caregiver', label: 'Caregiver', icon: HeartHandshake },
                        { id: 'doctor', label: 'Doctor', icon: Stethoscope }
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => { setRole(item.id as any); setErrorMsg(''); }}
                            className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-500/15 border-[#00a896] dark:border-cyan-400 text-[#00a896] dark:text-cyan-300 shadow-sm ring-2 ring-teal-500/20'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <ItemIcon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* =========================================================================
                      PATIENT REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'patient' && (
                    <>
                      {/* SECTION 1: BASIC INFO */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Lalith Patel"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: MEDICAL DEMOGRAPHICS */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider font-mono">
                            Patient Medical Demographics
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
                            <div className="relative">
                              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                type="date"
                                required
                                value={dob}
                                onChange={(e) => handleDobChange(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age (Yrs)</label>
                            <div className="relative">
                              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                              <input
                                type="number"
                                min="1"
                                max="125"
                                required
                                placeholder="34"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full pl-8 pr-2 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Gender</label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors cursor-pointer"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                              <span>Blood Group</span>
                            </label>
                            <select
                              value={bloodGroup}
                              onChange={(e) => setBloodGroup(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#00a896] dark:text-cyan-300 focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors cursor-pointer"
                            >
                              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                              <span>Allergies / Conditions</span>
                              <span className="text-[10px] text-slate-400 font-mono">Optional</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Penicillin, Asthma"
                              value={allergies}
                              onChange={(e) => setAllergies(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: EMERGENCY & FAMILY CONTACT */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                          <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider font-mono">
                            Emergency & Family Contact
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Family Emergency Number</label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                              <input
                                type="tel"
                                required
                                placeholder="+91 98765 11223"
                                value={familyPhone}
                                onChange={(e) => setFamilyPhone(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Name & Relation</label>
                            <div className="relative">
                              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                              <input
                                type="text"
                                placeholder="e.g. Priya Patel (Spouse)"
                                value={emergencyContactName}
                                onChange={(e) => setEmergencyContactName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: ABHA GOVERNMENT HEALTH ID */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>Ayushman Bharat Health ID (ABHA)</span>
                          <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono">Optional · Government ID</span>
                        </label>
                        <div className="relative">
                          <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            placeholder="e.g. 14-XXXX-XXXX-8921"
                            value={abhaId}
                            onChange={(e) => setAbhaId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* =========================================================================
                      CAREGIVER REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'caregiver' && (
                    <>
                      {/* CAREGIVER IDENTITY */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caregiver Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sunita Rao"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caregiver Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98111 22334"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* CAREGIVER TYPE & GOV ID */}
                      <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 space-y-3">
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />
                          <span className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider font-mono">
                            Caregiver Verification & Authority
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caregiver Classification</label>
                            <select
                              value={caregiverType}
                              onChange={(e) => setCaregiverType(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                            >
                              <option value="Family Member">Family Member / Next-of-Kin</option>
                              <option value="Professional Nurse / Aide">Professional Nurse / Medical Aide</option>
                              <option value="Legal Guardian">Designated Legal Guardian</option>
                              <option value="Elder Care Specialist">Elder Care Companion</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Government ID / Aadhaar No.</label>
                            <div className="relative">
                              <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                              <input
                                type="text"
                                required
                                placeholder="e.g. 9842-1940-5821"
                                value={caregiverGovId}
                                onChange={(e) => setCaregiverGovId(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* LINKED PATIENT PROFILE */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                          <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider font-mono">
                            Assigned / Linked Patient Information
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Patient Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ramesh Rao"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Relationship to Patient</label>
                            <select
                              value={patientRelation}
                              onChange={(e) => setPatientRelation(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors cursor-pointer"
                            >
                              <option value="Parent">Parent (Father / Mother)</option>
                              <option value="Spouse">Spouse (Husband / Wife)</option>
                              <option value="Child">Child (Son / Daughter)</option>
                              <option value="Sibling">Sibling (Brother / Sister)</option>
                              <option value="Assigned Ward">Assigned Ward / Client</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                              <span>Patient ABHA ID</span>
                              <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono">Optional</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 14-9981-4432-1109"
                              value={patientAbhaId}
                              onChange={(e) => setPatientAbhaId(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Caregiving Authority Scope</label>
                            <select
                              value={authorizationScope}
                              onChange={(e) => setAuthorizationScope(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#00a896] dark:text-cyan-300 focus:outline-none focus:border-[#00a896] transition-colors cursor-pointer"
                            >
                              <option value="Full Medical Proxy">Full Medical Proxy (Manage All)</option>
                              <option value="Medication & Vitals Supervisor">Medication & Vitals Supervisor</option>
                              <option value="View Health Records Only">View Health Records Only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* =========================================================================
                      DOCTOR / HEALTHCARE PROVIDER REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'doctor' && (
                    <>
                      {/* DOCTOR BASIC INFO */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Doctor Full Name (with Title)</label>
                          <div className="relative">
                            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Rajesh Varma"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Direct Contact Phone</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98222 33445"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* CLINICAL CREDENTIALS */}
                      <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/40 space-y-3">
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-cyan-500" />
                          <span className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-300 tracking-wider font-mono">
                            Clinical Credentials & Medical Council Registration
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Medical Council Reg. No. (NMC / State)</label>
                            <div className="relative">
                              <FileCheck2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                              <input
                                type="text"
                                required
                                placeholder="e.g. NMC-2014-089421"
                                value={medicalCouncilRegNo}
                                onChange={(e) => setMedicalCouncilRegNo(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Specialization</label>
                            <select
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                              <option value="Cardiology">Cardiology (Heart Specialist)</option>
                              <option value="Neurology">Neurology (Brain & Spine)</option>
                              <option value="Orthopedics">Orthopedic Surgery (Bones & Joints)</option>
                              <option value="General Medicine">General Medicine / Internal Physician</option>
                              <option value="Pediatrics">Pediatrics (Child Care)</option>
                              <option value="Dermatology">Dermatology (Skin & Hair)</option>
                              <option value="Oncology">Oncology (Cancer Specialist)</option>
                              <option value="Endocrinology">Endocrinology (Diabetes & Hormones)</option>
                              <option value="Psychiatry">Psychiatry & Mental Health</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Qualifications & Degrees</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. MBBS, MD (Cardiology), DM"
                              value={qualifications}
                              onChange={(e) => setQualifications(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Clinical Experience (Years)</label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              required
                              placeholder="14"
                              value={experienceYears}
                              onChange={(e) => setExperienceYears(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* HOSPITAL / CLINIC AFFILIATION & HPR ID */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                          <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider font-mono">
                            Hospital Affiliation & ABDM Registry
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hospital / Clinic Practice Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Multi-Specialty Hospital, Chennai"
                              value={hospitalAffiliation}
                              onChange={(e) => setHospitalAffiliation(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                <span>ABDM Registry ID (HPR)</span>
                                <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono">Optional</span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. dr.varma@hpr.abdm"
                                value={hprAddress}
                                onChange={(e) => setHprAddress(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors font-mono"
                              />
                            </div>

                            <div className="flex items-center gap-2 pt-5">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                                <input
                                  type="checkbox"
                                  checked={teleConsultReady}
                                  onChange={(e) => setTeleConsultReady(e.target.checked)}
                                  className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 cursor-pointer"
                                />
                                <div className="flex items-center gap-1.5">
                                  <Video className="w-3.5 h-3.5 text-teal-500" />
                                  <span>Available for Tele-Consultation</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* EMAIL ADDRESS (COMMON FOR ALL ROLES) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {mode === 'login' 
                        ? 'Email Address or Health ID' 
                        : (role === 'doctor' ? 'Official Professional Email' : 'Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder={role === 'doctor' ? 'e.g. dr.varma@apollohealthcare.in' : 'e.g. user@abdm.in'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD (COMMON FOR ALL ROLES) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* DYNAMIC PASSWORD STRENGTH METER (REGISTER) */}
                    {mode === 'register' && password && (
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500 dark:text-slate-400 font-mono">Password Strength:</span>
                          <span className={`${strength.score >= 75 ? 'text-teal-600 dark:text-cyan-400' : 'text-amber-500'} font-mono`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${strength.color}`} 
                            style={{ width: `${strength.score}%` }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* REGISTER ONLY: CONFIRM PASSWORD */}
                  {mode === 'register' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* REMEMBER ME & TERMS */}
                  <div className="flex items-center justify-between pt-1">
                    {mode === 'login' ? (
                      <>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 cursor-pointer"
                          />
                          <span>Remember this device</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setErrorMsg('Password reset link has been dispatched to your registered email.')}
                          className="text-xs font-bold text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </>
                    ) : (
                      <label className="flex items-start gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 mt-0.5 cursor-pointer"
                        />
                        <span className="leading-snug">
                          I agree to MediCare’s <span className="text-[#00a896] dark:text-cyan-400 font-bold">Terms of Service</span> & <span className="text-[#00a896] dark:text-cyan-400 font-bold">ABDM Healthcare Protocol</span>.
                        </span>
                      </label>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 border border-teal-400/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          {mode === 'login' 
                            ? 'Secure Sign In' 
                            : (role === 'doctor' 
                                ? 'Complete Clinical Provider Registration' 
                                : (role === 'caregiver' 
                                    ? 'Authorize & Register Caregiver' 
                                    : 'Create Encrypted Health Account'))}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* SWITCH MODE FOOTER PROMPT */}
            <div className="pt-5 border-t border-slate-200 dark:border-slate-800 text-center mt-5">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {mode === 'login' ? "Don't have a MediCare account yet? " : "Already registered with MediCare? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setErrorMsg('');
                  }}
                  className="font-black text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer ml-1"
                >
                  {mode === 'login' ? 'Register Now' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

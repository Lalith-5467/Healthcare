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
  Briefcase,
  Pill,
  HeartPulse
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
  const [role, setRole] = useState<'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance'>('patient');

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
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [allergies, setAllergies] = useState('');

  // Caregiver Specific States
  const [caregiverType, setCaregiverType] = useState('');
  const [caregiverGovId, setCaregiverGovId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [patientAbhaId, setPatientAbhaId] = useState('');
  const [authorizationScope, setAuthorizationScope] = useState('');

  // Doctor Specific States
  const [medicalCouncilRegNo, setMedicalCouncilRegNo] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [hprAddress, setHprAddress] = useState('');
  const [teleConsultReady, setTeleConsultReady] = useState(true);

  // Pharmacist Specific States
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pciNumber, setPciNumber] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyType, setPharmacyType] = useState('Retail Pharmacy');

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
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-300 dark:bg-slate-700' };
    let s = 0;
    if (pass.length >= 8) s += 1;
    if (/[A-Z]/.test(pass)) s += 1;
    if (/[0-9]/.test(pass)) s += 1;
    if (/[^A-Za-z0-9]/.test(pass)) s += 1;

    if (s <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (s === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (s === 3) return { score: 75, label: 'Good', color: 'bg-teal-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
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
          const isPharm = role === 'pharmacist';
          const isDoc = role === 'doctor';
          const isCare = role === 'caregiver';
          const isNurse = role === 'nurse';
          const isIns = role === 'insurance';

          onSuccessLogin({
            name: fullName || (isPharm ? (email ? email.split('@')[0] : 'Registered Pharmacist') : isDoc ? 'Dr. Rajesh Varma' : isNurse ? 'Nurse Sarah' : isIns ? 'Insurance Dealer' : (email ? email.split('@')[0] : 'Ragul Kumar')),
            email: email || (isPharm ? 'pharmacist@apollocentral.in' : isDoc ? 'dr.varma@hpr.abdm' : isNurse ? 'sarah.nurse@hpr.abdm' : isIns ? 'dealer@insurance.com' : 'ragul.kumar@abdm.in'),
            role: isPharm ? 'Pharmacist' : isDoc ? 'Doctor' : isCare ? 'Caregiver' : isNurse ? 'Nurse' : isIns ? 'Insurance' : 'Patient',
            abhaId: isPharm ? undefined : isDoc ? (hprAddress || 'dr.varma@hpr.abdm') : (abhaId || '91-8472-9104-5821@abdm'),
            bloodGroup: bloodGroup || 'O+',
            age: age ? parseInt(age, 10) : 34,
            phone: phone || '+91 98765 43210',
            emergencyContact: familyPhone || '+91 98765 11223',
            specialization: isDoc ? specialization : undefined,
            hospitalAffiliation: isDoc ? hospitalAffiliation : (isPharm ? (pharmacyName || 'Apollo Central Pharmacy') : undefined)
          });
        } else {
          onNavigateHome();
        }
      }, 1000);
    }, 800);
  };

  // Consistent Input Field Class
  const inputClass = "w-full h-11 px-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all";
  const inputWithIconClass = "w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all";
  const labelClass = "text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden flex flex-col justify-center select-none">
      
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-100 hover:text-[#00a896] dark:hover:text-cyan-300 border border-slate-200/90 dark:border-slate-700 shadow-md backdrop-blur-xl transition-all cursor-pointer group"
          title="Return to MediCare Landing Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5] text-[#00a896] dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* MAIN CONTAINER (CENTERED ON REGISTER, 2-COLUMN ON LOGIN) */}
      <div className={`mx-auto w-full relative z-10 pt-8 sm:pt-4 ${
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
            <div className="h-full rounded-3xl bg-gradient-to-br from-[#0b172a] via-[#091b36] to-[#040e1e] p-8 lg:p-10 text-slate-900 dark:text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-700/60">
              {/* AMBIENT MESH OVERLAY */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* TOP HEADER */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <Logo showBadge variant="dark" />
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-cyan-300 rounded-full border border-teal-400/30 font-mono shadow-xs">
                    ABDM Verified
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                    Access Your Unified Health Ecosystem
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
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
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Ayushman Bharat (ABHA) Integration</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Instantly fetch verified lab reports, prescriptions, and hospital discharge summaries.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:border-teal-500/40 transition-all">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 mt-0.5 border border-rose-500/30">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Emergency SOS Medical Card</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Offline-scannable QR matrix containing critical allergies, blood group & emergency contacts.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-start gap-3 hover:border-teal-500/40 transition-all">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 mt-0.5 border border-cyan-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Zero-Knowledge Data Vault</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Your health data is 256-bit encrypted with granular 1-tap consent revocation controls.</p>
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
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">50,000+ Active Patients</span>
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
          <div className="h-full rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
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
                  <span>Sign In</span>
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
                  <span>Register</span>
                </button>
              </div>

              {/* FORM HEADING */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {mode === 'login' ? (
                    <span>
                      Welcome back to <span className="text-slate-900 dark:text-white font-extrabold">Medi</span><span className="text-[#00a896] dark:text-cyan-400 font-extrabold">Care</span>
                    </span>
                  ) : (role === 'pharmacist'
                      ? 'Pharmacist & Pharmacy Portal Registration'
                      : role === 'doctor' 
                      ? 'Doctor & Healthcare Provider Portal' 
                      : (role === 'caregiver' 
                          ? 'Caregiver & Guardian Portal Registration' 
                          : 'Patient Personal Health Registration'))}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {mode === 'login'
                    ? 'Enter your credentials to securely access your medical records and care circle.'
                    : (role === 'pharmacist'
                        ? 'Register your pharmacy store, drug license (DL No.), and PCI registration credentials.'
                        : role === 'doctor'
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
                  
                  {/* ROLE SELECTOR PILLS */}
                  <div className="space-y-1.5 pb-1">
                    <label className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider font-mono">
                      Account Role
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'patient', label: 'Patient', icon: User },
                        { id: 'pharmacist', label: 'Pharmacist', icon: Pill },
                        { id: 'doctor', label: 'Doctor', icon: Stethoscope },
                        { id: 'caregiver', label: 'Caregiver', icon: HeartHandshake },
                        { id: 'nurse', label: 'Nurse', icon: HeartPulse },
                        { id: 'insurance', label: 'Insurance', icon: ShieldCheck }
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => { setRole(item.id as any); setErrorMsg(''); }}
                            className={`h-11 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-500/15 border-[#00a896] dark:border-cyan-400 text-[#00a896] dark:text-cyan-300 shadow-sm ring-2 ring-teal-500/20'
                                : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <ItemIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* =========================================================================
                      PATIENT REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'patient' && (
                    <div className="space-y-4">
                      {/* ROW 1: FULL NAME & PRIMARY PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Lalith Patel"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: DOB, AGE, GENDER */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                        <div className="sm:col-span-5">
                          <label className={labelClass}>Date of Birth</label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="date"
                              required
                              value={dob}
                              onChange={(e) => handleDobChange(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label className={labelClass}>Age (Yrs)</label>
                          <div className="relative">
                            <Hash className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="number"
                              min="1"
                              max="125"
                              required
                              placeholder="34"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label className={labelClass}>Gender</label>
                          <select
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className={`${inputClass} ${!gender ? 'text-slate-500 dark:text-slate-400' : ''}`}
                          >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: BLOOD GROUP & ALLERGIES */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Blood Group</label>
                          <select
                            required
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className={`${inputClass} ${bloodGroup ? 'font-bold text-[#00a896] dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'}`}
                          >
                            <option value="" disabled>Select Blood Group</option>
                            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={`${labelClass} flex items-center justify-between`}>
                            <span>Allergies / Conditions</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Optional</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Penicillin, Dust, Asthma"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* ROW 4: EMERGENCY FAMILY CONTACT */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Family Emergency Phone</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 11223"
                              value={familyPhone}
                              onChange={(e) => setFamilyPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Contact Name & Relation</label>
                          <div className="relative">
                            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Priya Patel (Spouse)"
                              value={emergencyContactName}
                              onChange={(e) => setEmergencyContactName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 5: OPTIONAL ABHA ID */}
                      <div>
                        <label className={`${labelClass} flex items-center justify-between`}>
                          <span>Ayushman Bharat Health ID (ABHA)</span>
                          <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono font-medium">Optional · Government ID</span>
                        </label>
                        <div className="relative">
                          <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="e.g. 14-XXXX-XXXX-8921"
                            value={abhaId}
                            onChange={(e) => setAbhaId(e.target.value)}
                            className={`${inputWithIconClass} font-mono`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      CAREGIVER REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'caregiver' && (
                    <div className="space-y-4">
                      {/* ROW 1: FULL NAME & PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Caregiver Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sunita Rao"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Contact Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98111 22334"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: CLASSIFICATION & GOV ID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Caregiver Classification</label>
                          <select
                            required
                            value={caregiverType}
                            onChange={(e) => setCaregiverType(e.target.value)}
                            className={`${inputClass} ${!caregiverType ? 'text-slate-500 dark:text-slate-400' : ''}`}
                          >
                            <option value="" disabled>Select Classification</option>
                            <option value="Family Member">Family Member / Next-of-Kin</option>
                            <option value="Professional Nurse / Aide">Professional Nurse / Medical Aide</option>
                            <option value="Legal Guardian">Designated Legal Guardian</option>
                            <option value="Elder Care Specialist">Elder Care Companion</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>Aadhaar / National ID No.</label>
                          <div className="relative">
                            <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. 9842-1940-5821"
                              value={caregiverGovId}
                              onChange={(e) => setCaregiverGovId(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 3: LINKED PATIENT NAME & RELATIONSHIP */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Assigned Patient Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ramesh Rao"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Relationship to Patient</label>
                          <select
                            required
                            value={patientRelation}
                            onChange={(e) => setPatientRelation(e.target.value)}
                            className={`${inputClass} ${!patientRelation ? 'text-slate-500 dark:text-slate-400' : ''}`}
                          >
                            <option value="" disabled>Select Relationship</option>
                            <option value="Parent">Parent (Father / Mother)</option>
                            <option value="Spouse">Spouse (Husband / Wife)</option>
                            <option value="Child">Child (Son / Daughter)</option>
                            <option value="Sibling">Sibling (Brother / Sister)</option>
                            <option value="Assigned Ward">Assigned Ward / Client</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 4: PATIENT ABHA & AUTHORITY SCOPE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={`${labelClass} flex items-center justify-between`}>
                            <span>Patient ABHA ID</span>
                            <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono font-medium">Optional</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 14-9981-4432-1109"
                            value={patientAbhaId}
                            onChange={(e) => setPatientAbhaId(e.target.value)}
                            className={`${inputClass} font-mono`}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Caregiving Proxy Scope</label>
                          <select
                            required
                            value={authorizationScope}
                            onChange={(e) => setAuthorizationScope(e.target.value)}
                            className={`${inputClass} ${authorizationScope ? 'font-bold text-[#00a896] dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'}`}
                          >
                            <option value="" disabled>Select Authorization Scope</option>
                            <option value="Full Medical Proxy">Full Medical Proxy (Manage All)</option>
                            <option value="Medication & Vitals Supervisor">Medication & Vitals Supervisor</option>
                            <option value="View Health Records Only">View Health Records Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      DOCTOR / HEALTHCARE PROVIDER REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'doctor' && (
                    <div className="space-y-4">
                      {/* ROW 1: DOCTOR NAME & PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Doctor Full Name</label>
                          <div className="relative">
                            <Stethoscope className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Rajesh Varma"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Direct Contact Phone</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98222 33445"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: MEDICAL COUNCIL REG NO & SPECIALIZATION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Medical Council Registration No.</label>
                          <div className="relative">
                            <FileCheck2 className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. NMC-2014-089421"
                              value={medicalCouncilRegNo}
                              onChange={(e) => setMedicalCouncilRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Primary Specialization</label>
                          <select
                            required
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className={`${inputClass} ${specialization ? 'font-bold text-cyan-600 dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'}`}
                          >
                            <option value="" disabled>Select Specialization</option>
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

                      {/* ROW 3: QUALIFICATIONS & EXPERIENCE */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                        <div className="sm:col-span-8">
                          <label className={labelClass}>Qualifications & Degrees</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. MBBS, MD (Cardiology), DM"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className={labelClass}>Experience (Yrs)</label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            required
                            placeholder="14"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* ROW 4: HOSPITAL AFFILIATION */}
                      <div>
                        <label className={labelClass}>Hospital / Clinic Practice Name</label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apollo Multi-Specialty Hospital, Chennai"
                            value={hospitalAffiliation}
                            onChange={(e) => setHospitalAffiliation(e.target.value)}
                            className={inputWithIconClass}
                          />
                        </div>
                      </div>

                      {/* ROW 5: HPR REGISTRY & TELECONSULTATION TOGGLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                        <div>
                          <label className={`${labelClass} flex items-center justify-between`}>
                            <span>ABDM Registry ID (HPR)</span>
                            <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono font-medium">Optional</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. dr.varma@hpr.abdm"
                            value={hprAddress}
                            onChange={(e) => setHprAddress(e.target.value)}
                            className={`${inputClass} font-mono`}
                          />
                        </div>

                        <div className="pt-5 sm:pt-6">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={teleConsultReady}
                              onChange={(e) => setTeleConsultReady(e.target.checked)}
                              className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                              <span>Available for Tele-Consultation</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      PHARMACIST REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'pharmacist' && (
                    <div className="space-y-4">
                      {/* ROW 1: PHARMACIST NAME & CONTACT PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Pharmacist Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Suresh Nair"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Official Contact Phone <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98401 23456"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: PHARMACY STORE NAME & DISPENSARY TYPE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Pharmacy / Store Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Central Pharmacy"
                              value={pharmacyName}
                              onChange={(e) => setPharmacyName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Dispensary Type <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={pharmacyType}
                            onChange={(e) => setPharmacyType(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Retail Pharmacy">Retail Community Pharmacy</option>
                            <option value="Hospital Pharmacy">Hospital In-House Pharmacy</option>
                            <option value="24x7 Emergency Pharmacy">24x7 Emergency Pharmacy</option>
                            <option value="Jan Aushadhi Kendra">Pradhan Mantri Jan Aushadhi Kendra</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: DRUG LICENSE & PCI REGISTRATION NO. */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Drug License No. (DL No.) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <FileCheck2 className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. DL-TN-2024-PH-8941"
                              value={licenseNumber}
                              onChange={(e) => setLicenseNumber(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            PCI Registration No. <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. PCI-TN-84910"
                              value={pciNumber}
                              onChange={(e) => setPciNumber(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 4: STORE ADDRESS / LOCATION */}
                      <div>
                        <label className={labelClass}>
                          Pharmacy Store Physical Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Plot 42, Anna Salai, Guindy, Chennai, Tamil Nadu - 600032"
                          value={pharmacyAddress}
                          onChange={(e) => setPharmacyAddress(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL / IDENTIFIER (COMMON FOR ALL ROLES) */}
                  <div>
                    <label className={labelClass}>
                      {mode === 'login' 
                        ? (role === 'pharmacist' 
                            ? 'Pharmacy Email or License ID' 
                            : role === 'doctor' 
                            ? 'Professional Email or Doctor ID' 
                            : 'Email Address or ABHA Health ID')
                        : (role === 'pharmacist' 
                            ? 'Official Pharmacy Email' 
                            : role === 'doctor' 
                            ? 'Official Professional Email' 
                            : 'Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={mode === 'login' ? 'text' : 'email'}
                        required
                        placeholder={
                          role === 'pharmacist'
                            ? 'e.g. pharmacy@apollo.in or DL-TN-1024'
                            : role === 'doctor'
                            ? 'e.g. dr.varma@apollohealthcare.in'
                            : 'e.g. user@abdm.in or 91-8472-9104-5821'
                        }
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputWithIconClass}
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD (COMMON FOR ALL ROLES) */}
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* DYNAMIC PASSWORD STRENGTH METER (REGISTER) */}
                    {mode === 'register' && password && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500 dark:text-slate-400 font-mono">Password Strength:</span>
                          <span className={`${strength.score >= 75 ? 'text-teal-600 dark:text-cyan-400' : 'text-amber-500'} font-mono`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
                    <div>
                      <label className={labelClass}>Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={inputWithIconClass}
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
                    className="w-full h-12 rounded-xl font-black text-sm text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 border border-teal-400/30 disabled:opacity-50"
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

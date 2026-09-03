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
  initialRole?: 'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance';
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
  initialRole = 'patient',
  onNavigateHome,
  onSuccessLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [initialMode]);

  // Role Selection (default initialized to initialRole)
  const [role, setRole] = useState<'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance'>(initialRole);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

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

  // Nurse Specific States
  const [nursingCouncilRegNo, setNursingCouncilRegNo] = useState('');
  const [nursingQualification, setNursingQualification] = useState('B.Sc Nursing / GNM');
  const [nurseDepartment, setNurseDepartment] = useState('Home Healthcare & Emergency Telemetry');
  const [nurseSpecialty, setNurseSpecialty] = useState('Post-Op Wound Care & IV Infusion');
  const [nurseHospital, setNurseHospital] = useState('');
  const [nurseShift, setNurseShift] = useState('Day Shift (08:00 AM - 06:00 PM)');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  // Pharmacist Specific States
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pciNumber, setPciNumber] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyType, setPharmacyType] = useState('Retail Pharmacy');

  // Insurance / TPA Specific States
  const [insuranceOrgName, setInsuranceOrgName] = useState('');
  const [irdaRegNo, setIrdaRegNo] = useState('');
  const [tpaLicenseNo, setTpaLicenseNo] = useState('');
  const [insuranceType, setInsuranceType] = useState('Stand-Alone Health Insurer');
  const [officerDesignation, setOfficerDesignation] = useState('Senior Claims Adjudicator');
  const [employeeId, setEmployeeId] = useState('');
  const [cashlessEmpanelmentReady, setCashlessEmpanelmentReady] = useState(true);

  // Status feedback states
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7X9K');

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

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

  // Helper for dynamic role login config
  const getRoleLoginDetails = (r: 'patient' | 'doctor' | 'nurse' | 'caregiver' | 'pharmacist' | 'insurance') => {
    switch (r) {
      case 'patient':
        return {
          title: 'Sign in as Patient',
          badge: 'Patient Health Portal',
          label: 'Email Address or ABHA Health ID',
          placeholder: 'e.g. user@abdm.in or 91-8472-9104-5821',
          icon: User
        };
      case 'doctor':
        return {
          title: 'Sign in as Doctor',
          badge: 'Clinical Provider Portal',
          label: 'Doctor ID or Email',
          placeholder: 'e.g. dr.varma@apollohealthcare.in or DOC-7721',
          icon: Stethoscope
        };
      case 'nurse':
        return {
          title: 'Sign in as Nurse',
          badge: 'Nurse & Home Telemetry Station',
          label: 'Nurse ID or Email',
          placeholder: 'e.g. RN-7701 or sarah.nurse@hpr.abdm',
          icon: HeartPulse
        };
      case 'caregiver':
        return {
          title: 'Sign in as Caregiver',
          badge: 'Caregiver & Guardian Portal',
          label: 'Mobile Number or Email',
          placeholder: 'e.g. +91 98765 43210 or anita.caregiver@abdm.in',
          icon: HeartHandshake
        };
      case 'pharmacist':
        return {
          title: 'Sign in as Pharmacist',
          badge: 'Pharmacy & Drug Dispensary',
          label: 'Pharmacist ID or Email',
          placeholder: 'e.g. pharmacy@apollo.in or DL-TN-1024',
          icon: Pill
        };
      case 'insurance':
        return {
          title: 'Sign in as Insurance / TPA',
          badge: 'Insurance Claims Clearinghouse',
          label: 'Organization ID or Employee ID',
          placeholder: 'e.g. TPA-INS-8821 or dealer@insurance.com',
          icon: ShieldCheck
        };
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

          const userRole = isPharm 
            ? 'Pharmacist' 
            : isDoc 
            ? 'Doctor' 
            : isCare 
            ? 'Caregiver' 
            : isNurse 
            ? 'Nurse' 
            : isIns 
            ? 'Insurance' 
            : 'Patient';

          // Helper to extract clean human-readable name from login identifier/email
          const deriveNameFromIdentifier = (identifier: string): string => {
            if (!identifier) return '';
            const raw = identifier.includes('@') ? identifier.split('@')[0] : identifier;
            const cleaned = raw.replace(/[._-]/g, ' ').trim();
            if (cleaned.length > 0) {
              return cleaned
                .split(' ')
                .filter(Boolean)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            }
            return raw.trim();
          };

          const realDisplayName = fullName.trim() || deriveNameFromIdentifier(email);

          // Store authentication token & user for API calls
          if (isPharm) {
            localStorage.setItem(
              'token',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtdGpxMHlvZTAwMDZpMHJneXdoN2ZhdTAiLCJlbWFpbCI6ImRlbW8ucGhhcm1hY2lzdEBleGFtcGxlLnRlc3QiLCJyb2xlIjoiUEhBUk1BQ0lTVCIsImlhdCI6MTc4ODM0MTk3NiwiZXhwIjoxNzg4OTQ2Nzc2fQ.lMh2tb0HojJTMwPGT1qT_oD5lB6zVAaVQtZxIGj_oVk'
            );
            if (realDisplayName) {
              localStorage.setItem('pharmacist_user_name', realDisplayName);
            }
          }

          const resolvedUserData = {
            name: realDisplayName || (isPharm ? 'Registered Pharmacist' : isDoc ? 'Dr. Practitioner' : isCare ? 'Caregiver Guardian' : isNurse ? 'Nurse Specialist' : isIns ? 'Insurance Officer' : 'Valued Patient'),
            email: email || (isPharm ? 'pharmacist@apollocentral.in' : isDoc ? 'doctor@hpr.abdm' : isCare ? 'caregiver@abdm.in' : isNurse ? 'nurse@hpr.abdm' : isIns ? 'tpa@insurance.com' : 'patient@abdm.in'),
            role: userRole,
            abhaId: isPharm ? undefined : isDoc ? (hprAddress || 'dr.practitioner@hpr.abdm') : isCare ? 'CG-8421-9902@abdm' : (abhaId || '91-8472-9104-5821@abdm'),
            bloodGroup: bloodGroup || 'O+',
            age: age ? parseInt(age, 10) : (isCare ? 32 : 34),
            phone: phone || '+91 98765 43210',
            emergencyContact: familyPhone || '+91 98765 11223',
            specialization: isDoc ? specialization : (isNurse ? nurseSpecialty : (isIns ? officerDesignation : undefined)),
            hospitalAffiliation: isDoc ? hospitalAffiliation : (isPharm ? (pharmacyName || 'Apollo Central Pharmacy') : (isNurse ? (nurseHospital || 'Apollo Central Home Healthcare') : (isIns ? (insuranceOrgName || 'Star Health Insurance') : undefined)))
          };

          try {
            localStorage.setItem('app_user', JSON.stringify(resolvedUserData));
            localStorage.setItem('app_is_logged_in', 'true');
          } catch {}

          onSuccessLogin(resolvedUserData);
        } else {
          onNavigateHome();
        }
      }, 1000);
    }, 800);
  };

<<<<<<< HEAD
  // Consistent Input Field Class (Light mode optimized on form panel)
  const inputClass = "w-full h-11 px-3.5 rounded-xl bg-slate-50/90 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs";
  const inputWithIconClass = "w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50/90 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs";
  const labelClass = "text-xs font-bold text-slate-700 block mb-1";
=======
  // Consistent Input Field Class
  const inputClass = "w-full h-11 px-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all";
  const inputWithIconClass = "w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all";
  const labelClass = "text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1";
>>>>>>> origin/main

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden flex flex-col justify-center select-none">
      
      {/* BACKGROUND DECORATIVE GLOW ACCENTS */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#00a896]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* CORNER NAVIGATION: TOP-LEFT BACK TO HOME BUTTON */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-8 z-50">
        <motion.button
          whileHover={{ x: -3, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNavigateHome}
<<<<<<< HEAD
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-xs font-black text-slate-800 hover:text-[#00a896] border border-slate-200 shadow-md backdrop-blur-xl transition-all cursor-pointer group"
=======
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-xs font-black text-slate-800 dark:text-slate-100 hover:text-[#00a896] dark:hover:text-cyan-300 border border-slate-200/90 dark:border-slate-700 shadow-md backdrop-blur-xl transition-all cursor-pointer group"
>>>>>>> origin/main
          title="Return to MediCare Landing Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5] text-[#00a896] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* MAIN DUAL-COLUMN CARD WITH SLIDING SWAP LAYOUT */}
      <div className="mx-auto w-full max-w-3xl lg:max-w-[840px] relative z-10 pt-8 sm:pt-4">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[560px] transition-all">
          
          {/* COLUMN 1: HERO / VALUE PROPOSITION SHOWCASE PANEL */}
          <motion.div 
            layout
            key={`hero-${mode}`}
            initial={{ opacity: 0, x: mode === 'login' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`p-7 lg:p-8 text-white flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#071933] to-[#040e1e] border-slate-700/60 ${
              mode === 'login' 
                ? 'lg:order-1 border-r' 
                : 'lg:order-2 border-l'
            }`}
          >
<<<<<<< HEAD
            {/* AMBIENT MESH OVERLAYS */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* TOP BRANDING */}
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <Logo showBadge variant="dark" />
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-cyan-300 rounded-full border border-teal-400/30 font-mono shadow-xs">
                  ABDM Verified
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                  {mode === 'login' 
                    ? 'Data Service for Medical & Clinical Ecosystem' 
                    : 'Join the Unified Healthcare Network'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {mode === 'login'
                    ? 'Integrated ABDM healthcare records, diagnostic telemetry, smart e-prescriptions, and cashless hospital gateway.'
                    : 'Create your verified account to access personalized health records, remote consultations, and 24x7 emergency response.'}
                </p>
              </div>
=======
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
>>>>>>> origin/main

              {/* CLINICAL WORKSTATION TELEMETRY & ROLE VISUAL HERO */}
              <div className="py-2 space-y-3">
                {mode === 'login' ? (
                  <div className="w-full p-4 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-slate-700/60 backdrop-blur-md shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Telemetry Server 2.4
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Smart Vitals</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Continuous ICU & Remote Monitoring</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>ABDM Vault</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Encrypted Health Information Exchange</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* ROLE-SPECIFIC HIGH-DEFINITION PORTRAIT WITH VERIFIED BADGE */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
                      <img 
                        src={
                          role === 'doctor'
                            ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=85'
                            : role === 'nurse'
                            ? 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=85'
                            : role === 'pharmacist'
                            ? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=85'
                            : role === 'insurance'
                            ? 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=85'
                            : role === 'caregiver'
                            ? 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=85'
                            : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=85'
                        } 
                        alt={role}
                        className="w-full h-48 object-cover object-center brightness-100 contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />
                      
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold text-white">
                        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-lg text-[11px]">
                          {role === 'doctor' && <Stethoscope className="w-3.5 h-3.5 text-teal-400" />}
                          {role === 'nurse' && <HeartPulse className="w-3.5 h-3.5 text-rose-400" />}
                          {role === 'pharmacist' && <Pill className="w-3.5 h-3.5 text-amber-400" />}
                          {role === 'insurance' && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                          {role === 'caregiver' && <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />}
                          {role === 'patient' && <User className="w-3.5 h-3.5 text-cyan-400" />}
                          <span className="capitalize">{role} Verified Portal</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase bg-teal-500/25 text-teal-300 px-2 py-0.5 rounded-md border border-teal-400/40 font-bold">
                          ABDM Ready
                        </span>
                      </div>
                    </div>

                    {/* DYNAMIC ROLE ACCREDITATION & FEATURE TILES (FILLS VERTICAL SPACE BEAUTIFULLY) */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-white">
                            {role === 'doctor' ? 'Clinical Tele-Consultation'
                              : role === 'nurse' ? 'Rapid GPS Shift Dispatch'
                              : role === 'pharmacist' ? 'Real-time e-Rx Dispensation'
                              : role === 'insurance' ? 'Instant Cashless Pre-Auth'
                              : role === 'caregiver' ? 'Multi-Patient Health Ward'
                              : 'Personal Health Records (ABHA)'}
                          </h5>
                          <p className="text-[10px] text-slate-300">
                            {role === 'doctor' ? 'HIPAA & ABDM compliant video consults'
                              : role === 'nurse' ? 'Direct patient homecare telemetry'
                              : role === 'pharmacist' ? 'Automated digital inventory sync'
                              : role === 'insurance' ? 'Zero-touch claims adjudications'
                              : role === 'caregiver' ? 'Proxy authorization & vital alerts'
                              : 'Live vitals & offline emergency QR matrix'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-white">256-Bit Encrypted Data Vault</h5>
                          <p className="text-[10px] text-slate-300">National digital health exchange certified</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-white">
                            {role === 'insurance' ? 'IRDAI Gateway & TPA Clearinghouse'
                              : role === 'doctor' ? 'NMC Verified Medical Practitioner'
                              : role === 'nurse' ? 'State Nursing Council Accredited'
                              : role === 'pharmacist' ? 'PCI Licensed Drug Inventory'
                              : role === 'caregiver' ? 'Certified Family & Homecare Proxy'
                              : 'Unified 24x7 Emergency Network'}
                          </h5>
                          <p className="text-[10px] text-slate-300">
                            {role === 'insurance' ? 'Automated health insurance settlement protocol'
                              : role === 'doctor' ? 'Instant digital sign-off on medical chartings'
                              : role === 'nurse' ? 'Direct vitals telemetry & SOS alerts sync'
                              : role === 'pharmacist' ? 'Real-time e-prescription auto validation'
                              : role === 'caregiver' ? 'Encrypted care circle access & alerts'
                              : 'Instant ambulance dispatch & QR paramedic pass'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK SWAP CTA BUTTON */}
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center space-y-2">
                  <p className="text-xs text-slate-300 font-medium">
                    {mode === 'login' ? 'New to MediCare Healthcare?' : 'Already have a MediCare account?'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setErrorMsg('');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{mode === 'login' ? 'Create an Account' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM TRUST METRICS */}
            <div className="relative z-10 pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Patient" />
                  <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Patient" />
                  <img className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80" alt="Patient" />
                </div>
                <span className="text-[11px] font-bold text-slate-300">50,000+ Verified Accounts</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-400 font-extrabold">
                <span>★ 4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2: INTERACTIVE AUTHENTICATION FORM PANEL (PURE CRISP LIGHT MODE) */}
          <motion.div 
            layout
            key={`form-${mode}`}
            initial={{ opacity: 0, x: mode === 'login' ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`p-6 sm:p-8 flex flex-col justify-between bg-white text-slate-900 ${
              mode === 'login' 
                ? 'lg:order-2' 
                : 'lg:order-1'
            }`}
          >
            <div>
              {/* SEGMENTED SWITCHER (LOGIN vs REGISTER) */}
              <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center mb-6 relative">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    mode === 'login'
                      ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/25'
                      : 'text-slate-600 hover:text-slate-900'
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
                      ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>

              {/* FORM HEADING */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {mode === 'login' ? (
                    <span>
                      Welcome back to <span className="text-slate-900 font-extrabold">Medi</span><span className="text-[#00a896] font-extrabold">Care</span>
                    </span>
                  ) : (
                    role === 'pharmacist'
                      ? 'Pharmacist Registration'
                      : role === 'doctor' 
                      ? 'Doctor Registration' 
                      : role === 'nurse'
                      ? 'Nurse Registration'
                      : role === 'insurance'
                      ? 'Insurance / TPA Registration'
                      : role === 'caregiver' 
                      ? 'Caregiver Registration' 
                      : 'Patient Registration'
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {mode === 'login'
                    ? 'Enter your credentials to securely access your medical records and care circle.'
                    : (
                      role === 'pharmacist'
                        ? 'Enter your pharmacy store, drug license (DL No.), and PCI details.'
                        : role === 'doctor'
                        ? 'Enter your clinical credentials, medical license, and hospital affiliations.'
                        : role === 'nurse'
                        ? 'Enter your state nursing council registration, clinical specialty, and shift details.'
                        : role === 'insurance'
                        ? 'Enter your organization, IRDAI registration, and clearinghouse credentials.'
                        : role === 'caregiver'
                        ? 'Enter your caregiver authorization details to link with patient profiles.'
                        : 'Enter your details to create your personal health account and ABDM profile.'
                    )}
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
                  {/* =========================================================================
                      PATIENT REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'patient' && (
                    <div className="space-y-3.5">
                      {/* ROW 1: FULL NAME & PRIMARY PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Full Name <span className="text-rose-500">*</span></label>
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
                      NURSE REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'nurse' && (
                    <div className="space-y-4">
                      {/* ROW 1: FULL NAME & DIRECT CONTACT NUMBER */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Registered Nurse Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sarah Jenkins"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Contact Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98402 77011"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: STATE NURSING COUNCIL REGISTRATION & QUALIFICATION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            State Nursing Council Reg. No. (INC / TNC) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. RN-TN-2024-88492"
                              value={nursingCouncilRegNo}
                              onChange={(e) => setNursingCouncilRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Nursing Degree / Qualification <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={nursingQualification}
                            onChange={(e) => setNursingQualification(e.target.value)}
                            className={inputClass}
                          >
                            <option value="B.Sc Nursing / GNM">B.Sc Nursing / GNM Diploma</option>
                            <option value="Post Basic B.Sc Nursing">Post Basic B.Sc Nursing (P.B.B.Sc)</option>
                            <option value="M.Sc Critical Care Nursing">M.Sc Nursing (Critical Care)</option>
                            <option value="Nurse Practitioner in Critical Care (NPCC)">NPCC (Nurse Practitioner)</option>
                            <option value="ANM (Auxiliary Nurse Midwife)">ANM (Midwifery & Community)</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: PRIMARY CLINICAL SPECIALTY & DEPARTMENT */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Clinical Care Specialty <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={nurseSpecialty}
                            onChange={(e) => setNurseSpecialty(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Post-Op Wound Care & IV Infusion">Post-Op Surgical Wound Care & IV</option>
                            <option value="Elderly ICU & Catheterization">Geriatric ICU & Catheterization</option>
                            <option value="Pediatric Care & Vaccination">Pediatric Emergency & Immunization</option>
                            <option value="Palliative & Pain Telemetry">Palliative & Oncology Support</option>
                            <option value="General Bedside Care">General Bedside & Vitals Monitoring</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>Hospital / Health Agency Affiliation</label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Central Home Healthcare"
                              value={nurseHospital}
                              onChange={(e) => setNurseHospital(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 4: PREFERRED SHIFT & RAPID DISPATCH TOGGLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                        <div>
                          <label className={labelClass}>Shift Duty Preference</label>
                          <select
                            value={nurseShift}
                            onChange={(e) => setNurseShift(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Day Shift (08:00 AM - 06:00 PM)">Day Shift (08:00 AM - 06:00 PM)</option>
                            <option value="Night Shift (08:00 PM - 06:00 AM)">Night Shift (08:00 PM - 06:00 AM)</option>
                            <option value="24-Hour Rotational On-Call">24-Hour Rotational On-Call</option>
                          </select>
                        </div>

                        <div className="pt-2 sm:pt-4">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={emergencyAvailable}
                              onChange={(e) => setEmergencyAvailable(e.target.checked)}
                              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <HeartPulse className="w-4 h-4 text-rose-500" />
                              <span>Ready for Emergency Rapid GPS Dispatch</span>
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

                  {/* =========================================================================
                      INSURANCE / TPA REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'insurance' && (
                    <div className="space-y-4">
                      {/* ROW 1: OFFICER FULL NAME & EMPLOYEE ID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Authorizing Officer Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rajesh S. (Claims Manager)"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Organization Employee ID / Code <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. TPA-INS-8821"
                              value={employeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: INSURANCE CO. / TPA ORGANIZATION NAME & ENTITY TYPE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            Insurance / TPA Company Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Star Health & Allied Insurance Co."
                              value={insuranceOrgName}
                              onChange={(e) => setInsuranceOrgName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Entity Classification <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={insuranceType}
                            onChange={(e) => setInsuranceType(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Stand-Alone Health Insurer">Stand-Alone Health Insurance (SAHI)</option>
                            <option value="General Insurance Provider">General Non-Life Insurance Company</option>
                            <option value="Licensed TPA Clearinghouse">Licensed Third Party Administrator (TPA)</option>
                            <option value="Government Scheme Payer">PM-JAY / State Government Health Scheme</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: IRDAI REGISTRATION NO. & TPA LICENSE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>
                            IRDAI Registration No. <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. IRDAI/HLT/SHAI/P-H/V.1/2024"
                              value={irdaRegNo}
                              onChange={(e) => setIrdaRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Officer Role / Designation <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={officerDesignation}
                            onChange={(e) => setOfficerDesignation(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Senior Claims Adjudicator">Senior Claims Adjudicator</option>
                            <option value="Chief Medical Officer (TPA)">Chief Medical Officer (TPA / Insurer)</option>
                            <option value="Cashless Pre-Auth Officer">Cashless Pre-Auth Desk Lead</option>
                            <option value="Grievance & Settlement Manager">Disbursement & Settlement Officer</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 4: CONTACT PHONE & CASHLESS GATEWAY TOGGLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                        <div>
                          <label className={labelClass}>
                            Official Clearinghouse Direct Phone <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 44 2828 8800"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div className="pt-2 sm:pt-4">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                            <input
                              type="checkbox"
                              checked={cashlessEmpanelmentReady}
                              onChange={(e) => setCashlessEmpanelmentReady(e.target.checked)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-blue-500" />
                              <span>Enable Instant ABDM Cashless Pre-Auth Gateway</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EMAIL / IDENTIFIER (DYNAMIC PER SELECTED ROLE IN LOGIN MODE) */}
                  <div>
                    <label className={labelClass}>
                      {mode === 'login' 
                        ? getRoleLoginDetails(role).label
                        : (role === 'pharmacist' 
                            ? 'Official Pharmacy Email' 
                            : role === 'doctor' 
                            ? 'Official Professional Email' 
                            : role === 'nurse'
                            ? 'Official Hospital Nurse Email'
                            : role === 'caregiver'
                            ? 'Caregiver Registered Email'
                            : role === 'insurance'
                            ? 'Official Clearinghouse Email'
                            : 'Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={mode === 'login' ? 'text' : 'email'}
                        required
                        placeholder={
                          mode === 'login'
                            ? getRoleLoginDetails(role).placeholder
                            : 'e.g. user@medicare.health'
                        }
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputWithIconClass}
                      />
                    </div>
                  </div>

<<<<<<< HEAD
                  {/* PASSWORD & CONFIRM PASSWORD (SIDE-BY-SIDE IN REGISTER, SINGLE IN LOGIN) */}
                  {mode === 'register' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                      <div>
                        <label className={labelClass}>Password <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
=======
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
>>>>>>> origin/main
                        </div>

                        {/* DYNAMIC PASSWORD STRENGTH METER */}
                        {password && (
                          <div className="pt-1.5 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-500 dark:text-slate-400 font-mono">Strength:</span>
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

                      <div>
                        <label className={labelClass}>Confirm Password <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    </div>
                  ) : (
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
                          className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] dark:focus:border-cyan-400 focus:ring-2 focus:ring-[#00a896]/15 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VERIFICATION CODE / CAPTCHA (MATCHING REFERENCE UI) */}
                  {mode === 'login' && (
                    <div>
                      <label className={labelClass}>Verification Code</label>
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex-1">
                          <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Enter Code"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            className={`${inputWithIconClass} font-mono uppercase tracking-widest`}
                          />
                        </div>

                        {/* STYLISH CAPTCHA BADGE WITH CLICK-TO-REFRESH */}
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all shadow-inner group"
                          title="Click to refresh captcha code"
                        >
                          <span className="font-mono text-sm font-black tracking-widest text-slate-700 dark:text-slate-200 italic line-through decoration-teal-500/60 select-none group-hover:scale-105 transition-transform">
                            {captchaCode}
                          </span>
                        </button>
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
          </motion.div>

        </div>
      </div>
    </div>
  );
};

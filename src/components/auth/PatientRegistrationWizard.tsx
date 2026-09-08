import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Heart,
  Droplet,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Scale,
  Ruler,
  Thermometer,
  HeartPulse,
  Users,
  PhoneCall,
  Check,
  Shield,
  KeyRound,
  RotateCw,
  FileCheck2
} from 'lucide-react';
import { authApi } from '../../services/dhrApis';
import { setAuthToken, clearAuthToken } from '../../services/apiClient';
import { showGlobalToast } from '../common/GlobalToastManager';
import { AUTH_CONFIG } from '../../config/authConfig';

interface PatientRegistrationWizardProps {
  onNavigateHome: () => void;
  onNavigateToLogin: () => void;
  onSuccessLogin?: (userData: any) => void;
  onToast?: (message: string) => void;
}

export const PatientRegistrationWizard: React.FC<PatientRegistrationWizardProps> = ({
  onNavigateHome,
  onNavigateToLogin,
  onSuccessLogin,
  onToast,
}) => {
  // Current Active Step: 1 = Basic Info, 2 = Account & Verification, 3 = Health Info
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // -------------------------------------------------------------
  // STEP 1: BASIC INFORMATION STATES
  // -------------------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [address, setAddress] = useState('');

  // -------------------------------------------------------------
  // STEP 2: ACCOUNT & VERIFICATION STATES
  // -------------------------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Email verification OTP states (Active when AUTH_CONFIG.EMAIL_VERIFICATION_ENABLED = true)
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpPreviewNotice, setOtpPreviewNotice] = useState<string | null>(null);

  // -------------------------------------------------------------
  // STEP 3: HEALTH INFORMATION STATES
  // -------------------------------------------------------------
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [diastolicBp, setDiastolicBp] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // -------------------------------------------------------------
  // FORM & SUBMISSION STATUS STATES
  // -------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Maximum allowed date of birth = Today (No future dates)
  const maxDobDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // -------------------------------------------------------------
  // DYNAMIC AGE CALCULATION FROM DOB
  // -------------------------------------------------------------
  const handleDobChange = (dateVal: string) => {
    setDob(dateVal);
    setFieldErrors((prev) => ({ ...prev, dob: '' }));

    if (dateVal) {
      const birthDate = new Date(dateVal);
      const today = new Date();
      if (birthDate > today) {
        setFieldErrors((prev) => ({ ...prev, dob: 'Date of birth cannot be in the future.' }));
        setAge('');
        return;
      }
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge < 130) {
        setAge(calculatedAge.toString());
      } else {
        setAge('');
      }
    } else {
      setAge('');
    }
  };

  // -------------------------------------------------------------
  // DYNAMIC BMI CALCULATION FROM WEIGHT & HEIGHT
  // Formula: weight (kg) / (height (m))^2
  // -------------------------------------------------------------
  const bmiInfo = useMemo(() => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { value: null, label: 'Enter height & weight', color: 'text-slate-400', badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
    }

    const heightInMeters = h / 100;
    const calculatedBmi = w / (heightInMeters * heightInMeters);

    if (calculatedBmi <= 0 || calculatedBmi > 100 || !isFinite(calculatedBmi)) {
      return { value: null, label: 'Invalid values', color: 'text-rose-500', badgeColor: 'bg-rose-50 text-rose-700' };
    }

    const roundedBmi = parseFloat(calculatedBmi.toFixed(2));
    let label = 'Normal Weight';
    let color = 'text-emerald-600 dark:text-emerald-400';
    let badgeColor = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';

    if (roundedBmi < 18.5) {
      label = 'Underweight';
      color = 'text-amber-600 dark:text-amber-400';
      badgeColor = 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    } else if (roundedBmi >= 25 && roundedBmi < 29.9) {
      label = 'Overweight';
      color = 'text-amber-600 dark:text-amber-400';
      badgeColor = 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    } else if (roundedBmi >= 30) {
      label = 'Obese';
      color = 'text-rose-600 dark:text-rose-400';
      badgeColor = 'bg-rose-500/10 text-rose-700 border-rose-500/20';
    }

    return { value: roundedBmi, label, color, badgeColor };
  }, [weightKg, heightCm]);

  // -------------------------------------------------------------
  // PASSWORD STRENGTH CALCULATION
  // -------------------------------------------------------------
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Empty', color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-teal-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  }, [password]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // -------------------------------------------------------------
  // EMAIL VERIFICATION HANDLERS (READY FOR FEATURE TOGGLE)
  // -------------------------------------------------------------
  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Enter a valid email address first.' }));
      return;
    }
    setOtpLoading(true);
    setFieldErrors((prev) => ({ ...prev, email: '' }));
    setErrorMsg('');

    try {
      const res = await authApi.sendOtp(email.trim());
      setIsOtpSent(true);
      setOtpCountdown(60);
      if (res.data?.previewCode) {
        setOtpPreviewNotice(`Verification Code: ${res.data.previewCode}`);
      }
      if (onToast) onToast(`Verification code sent to ${email}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to send verification code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setFieldErrors((prev) => ({ ...prev, otp: 'Please enter the 6-digit verification code.' }));
      return;
    }
    setOtpLoading(true);
    setFieldErrors((prev) => ({ ...prev, otp: '' }));
    setErrorMsg('');

    try {
      await authApi.verifyOtp(email.trim(), otpCode.trim());
      setIsEmailVerified(true);
      setOtpPreviewNotice(null);
      if (onToast) onToast('✓ Email verified successfully!');
    } catch (err: any) {
      setFieldErrors((prev) => ({ ...prev, otp: err.message || 'Invalid or expired code.' }));
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 1 VALIDATION & ADVANCEMENT
  // -------------------------------------------------------------
  const handleProceedToStep2 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters.';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (dob) {
      const birthDate = new Date(dob);
      if (birthDate > new Date()) {
        errors.dob = 'Date of birth cannot be in the future.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please complete all required fields correctly in Step 1.');
      return;
    }

    setFieldErrors({});
    setErrorMsg('');
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // STEP 2 VALIDATION & ADVANCEMENT
  // -------------------------------------------------------------
  const handleProceedToStep3 = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (AUTH_CONFIG.EMAIL_VERIFICATION_ENABLED && !isEmailVerified) {
      errors.emailVerification = 'Please verify your email address before continuing.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please fix the errors in Account details before continuing.');
      return;
    }

    setFieldErrors({});
    setErrorMsg('');
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // FINAL SUBMISSION (STEP 3 -> BACKEND TRANSACTION -> LOGIN)
  // -------------------------------------------------------------
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreedTerms) {
      setErrorMsg('Please accept the ABDM Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    const registrationPayload = {
      role: 'PATIENT',
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phoneNumber: phone.trim(),
      gender: gender || undefined,
      dateOfBirth: dob || undefined,
      address: address.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      familyPhone: familyPhone.trim() || undefined,
      bloodGroup: bloodGroup || undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      systolicBp: systolicBp ? parseInt(systolicBp, 10) : undefined,
      diastolicBp: diastolicBp ? parseInt(diastolicBp, 10) : undefined,
      heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
    };

    try {
      const authResponse = await authApi.register(registrationPayload);

      if (authResponse && authResponse.success) {
        clearAuthToken();
        localStorage.removeItem('app_user');
        localStorage.setItem('app_is_logged_in', 'false');

        setIsCompleted(true);

        setTimeout(() => {
          setLoading(false);
          showGlobalToast('Registration successful! Please sign in with your email and password.', 'success');
          onNavigateToLogin();
        }, 1000);
      } else {
        throw new Error(authResponse?.message || 'Registration failed. Please check inputs.');
      }
    } catch (err: any) {
      setLoading(false);
      const message =
        err.message ||
        (typeof err === 'string' ? err : 'Registration failed. Please verify your details and try again.');
      setErrorMsg(message);
    }
  };

  const inputClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs';
  const labelClass = 'text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1';

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      {/* ============================================================ */}
      {/* 3-STEP PROGRESS INDICATOR                                     */}
      {/* ============================================================ */}
      <div className="mb-8 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between relative">
          {/* Connecting background line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 z-0" />
          
          {/* Active filled line */}
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-[#00a896] to-teal-500 transition-all duration-500 z-0"
            style={{
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 4rem)',
            }}
          />

          {/* STEP 1 NODE */}
          <div className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => setCurrentStep(1)}>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                currentStep >= 1
                  ? 'bg-[#00a896] text-white ring-4 ring-[#00a896]/20'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {currentStep > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
            </div>
            <div className="text-center mt-2">
              <span className={`text-[11px] font-black uppercase tracking-wider block font-mono ${currentStep === 1 ? 'text-[#00a896]' : 'text-slate-500 dark:text-slate-400'}`}>
                Step 1
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white hidden sm:block">
                Basic Info
              </span>
            </div>
          </div>

          {/* STEP 2 NODE */}
          <div
            className="relative z-10 flex flex-col items-center group cursor-pointer"
            onClick={() => {
              if (fullName && phone) setCurrentStep(2);
            }}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                currentStep >= 2
                  ? 'bg-[#00a896] text-white ring-4 ring-[#00a896]/20'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {currentStep > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
            </div>
            <div className="text-center mt-2">
              <span className={`text-[11px] font-black uppercase tracking-wider block font-mono ${currentStep === 2 ? 'text-[#00a896]' : 'text-slate-500 dark:text-slate-400'}`}>
                Step 2
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white hidden sm:block">
                Account & Auth
              </span>
            </div>
          </div>

          {/* STEP 3 NODE */}
          <div
            className="relative z-10 flex flex-col items-center group cursor-pointer"
            onClick={() => {
              if (fullName && phone && email && password) setCurrentStep(3);
            }}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                currentStep >= 3
                  ? 'bg-[#00a896] text-white ring-4 ring-[#00a896]/20'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              3
            </div>
            <div className="text-center mt-2">
              <span className={`text-[11px] font-black uppercase tracking-wider block font-mono ${currentStep === 3 ? 'text-[#00a896]' : 'text-slate-500 dark:text-slate-400'}`}>
                Step 3
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white hidden sm:block">
                Health Info
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR ALERT BANNER */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-3 mb-6 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{errorMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Patient Account Created!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Welcome to MediCare, <strong>{fullName}</strong>. Your account and health records have been securely registered. Redirecting to your dashboard...
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#00a896] h-full animate-pulse w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* FORM CONTAINER WITH MULTI-STEP CARD TRANSITIONS               */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* TOP ACCENT STRIP */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00a896] via-teal-400 to-cyan-400" />

        {/* ============================================================ */}
        {/* STEP 1: BASIC INFORMATION                                    */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-teal-500/10 text-[#00a896] border border-teal-500/20 mb-2">
                <User className="w-3 h-3" />
                <span>Step 1 of 3 • Patient Profile</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Basic Personal Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your identity and demographic details to create your ABDM health record.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. FULL NAME */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`${inputClass} pl-10 ${fieldErrors.fullName ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                </div>
                {fieldErrors.fullName && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.fullName}</span>
                )}
              </div>

              {/* 2. DATE OF BIRTH */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    max={maxDobDate}
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className={`${inputClass} pl-10 ${fieldErrors.dob ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                </div>
                {fieldErrors.dob && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.dob}</span>
                )}
              </div>

              {/* 3. AGE (AUTO-CALCULATED FROM DOB) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Age</label>
                  {dob && age && (
                    <span className="text-[10px] font-black uppercase text-[#00a896] bg-teal-500/10 px-2 py-0.5 rounded-md font-mono">
                      ✓ Auto-Calculated
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="130"
                    placeholder="e.g. 29"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`${inputClass} bg-slate-100/70 dark:bg-slate-800 font-bold`}
                  />
                </div>
              </div>

              {/* 4. GENDER */}
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`${inputClass} ${!gender ? 'text-slate-400 dark:text-slate-500' : ''}`}
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* 5. PHONE NUMBER */}
              <div>
                <label className={labelClass}>
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={`${inputClass} pl-10 ${fieldErrors.phone ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                </div>
                {fieldErrors.phone && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.phone}</span>
                )}
              </div>

              {/* 6. EMERGENCY CONTACT NUMBER */}
              <div>
                <label className={labelClass}>Emergency Contact Number</label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543211"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* 7. FAMILY CONNECTED NUMBER */}
              <div>
                <label className={labelClass}>Family Connected Number</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543212"
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* 8. ADDRESS */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Residential Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="e.g. 24 MG Road, Bengaluru, Karnataka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 pl-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* STEP 1 NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Already registered? Sign In
              </button>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-[#00897b] hover:to-teal-700 text-white font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: ACCOUNT & VERIFICATION                               */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-teal-500/10 text-[#00a896] border border-teal-500/20 mb-2">
                <Lock className="w-3 h-3" />
                <span>Step 2 of 3 • Account & Security</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Account Credentials & Security
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up your login credentials. Your password will be securely hashed with bcrypt.
              </p>
            </div>

            <div className="space-y-4">
              {/* 1. EMAIL ADDRESS */}
              <div>
                <label className={labelClass}>
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya.sharma@medicare.local"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailVerified(false);
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`${inputClass} pl-10 ${fieldErrors.email ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                </div>
                {fieldErrors.email && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.email}</span>
                )}
              </div>

              {/* EMAIL VERIFICATION SECTION (FEATURE FLAG SUPPORT) */}
              {AUTH_CONFIG.EMAIL_VERIFICATION_ENABLED ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#00a896]" />
                      <span>Email Verification (OTP)</span>
                    </span>
                    {isEmailVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Pending Code
                      </span>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className={`${inputClass} tracking-widest text-center font-mono font-bold sm:w-48`}
                      />

                      {!isOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                          className="py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {otpLoading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || otpCode.length !== 6}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {otpLoading ? 'Verifying...' : 'Verify OTP'}
                          </button>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpCountdown > 0 || otpLoading}
                            className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {otpPreviewNotice && (
                    <p className="text-[11px] text-teal-600 dark:text-cyan-300 font-mono font-bold">
                      {otpPreviewNotice}
                    </p>
                  )}
                  {fieldErrors.otp && (
                    <span className="text-[11px] font-bold text-rose-500 block">{fieldErrors.otp}</span>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00a896]" />
                    <span>Instant Patient Verification Gateway active</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Direct Pass</span>
                </div>
              )}

              {/* 2. PASSWORD */}
              <div>
                <label className={labelClass}>
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 8 characters (e.g. Ananya@12345)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className={`${inputClass} pl-10 pr-10 ${fieldErrors.password ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH METER */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase font-mono">
                      <span className="text-slate-500">Security Strength:</span>
                      <span className="text-slate-800 dark:text-slate-200">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
                {fieldErrors.password && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.password}</span>
                )}
              </div>

              {/* 3. CONFIRM PASSWORD */}
              <div>
                <label className={labelClass}>
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`${inputClass} pl-10 pr-10 ${fieldErrors.confirmPassword ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* STEP 2 NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep3}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-[#00897b] hover:to-teal-700 text-white font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Health Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: HEALTH INFORMATION & REVIEW                           */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-teal-500/10 text-[#00a896] border border-teal-500/20 mb-2">
                <Heart className="w-3 h-3" />
                <span>Step 3 of 3 • Health Metrics</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Health Profile & Vitals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Record your baseline physical vitals. BMI is calculated automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. WEIGHT */}
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <div className="relative">
                  <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    placeholder="e.g. 65"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <span className="absolute right-3.5 top-3.5 text-[10px] font-mono font-bold text-slate-400">kg</span>
                </div>
              </div>

              {/* 2. HEIGHT */}
              <div>
                <label className={labelClass}>Height (cm)</label>
                <div className="relative">
                  <Ruler className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="260"
                    placeholder="e.g. 170"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <span className="absolute right-3.5 top-3.5 text-[10px] font-mono font-bold text-slate-400">cm</span>
                </div>
              </div>

              {/* 3. DYNAMIC BMI DISPLAY CARD */}
              <div>
                <label className={labelClass}>Calculated BMI</label>
                <div className="h-11 px-3.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-teal-500/5 dark:bg-slate-800 border border-teal-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00a896]" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {bmiInfo.value !== null ? bmiInfo.value : '—'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border font-mono ${bmiInfo.badgeColor}`}>
                    {bmiInfo.label}
                  </span>
                </div>
              </div>

              {/* 4. BLOOD PRESSURE (SYSTOLIC / DIASTOLIC) */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Blood Pressure (mmHg)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="50"
                      max="250"
                      placeholder="Systolic (e.g. 120)"
                      value={systolicBp}
                      onChange={(e) => setSystolicBp(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <span className="text-slate-400 font-black text-lg">/</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="30"
                      max="150"
                      placeholder="Diastolic (e.g. 80)"
                      value={diastolicBp}
                      onChange={(e) => setDiastolicBp(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* 5. BLOOD GROUP */}
              <div>
                <label className={labelClass}>Blood Group</label>
                <div className="relative">
                  <Droplet className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className={`${inputClass} pl-10 ${!bloodGroup ? 'text-slate-400' : ''}`}
                  >
                    <option value="" disabled hidden>Select Blood Group</option>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* 6. HEART RATE */}
              <div>
                <label className={labelClass}>Heart Rate (BPM)</label>
                <div className="relative">
                  <HeartPulse className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    min="30"
                    max="220"
                    placeholder="e.g. 72"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className={`${inputClass} pl-10 pr-12`}
                  />
                  <span className="absolute right-3.5 top-3.5 text-[10px] font-mono font-bold text-slate-400">BPM</span>
                </div>
              </div>

              {/* 7. BODY TEMPERATURE */}
              <div>
                <label className={labelClass}>Body Temp (°C)</label>
                <div className="relative">
                  <Thermometer className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="45"
                    placeholder="e.g. 36.8"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <span className="absolute right-3.5 top-3.5 text-[10px] font-mono font-bold text-slate-400">°C</span>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* FINAL REVIEW ACCORDION / SUMMARY CARD                         */}
            {/* ============================================================ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider block">
                Review Registration Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* BASIC INFO SUMMARY */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-[#00a896] uppercase font-mono block">Patient Profile</span>
                  <strong className="text-slate-900 dark:text-white block truncate">{fullName || '—'}</strong>
                  <p className="text-slate-500 text-[11px]">
                    {gender} {age ? `• ${age} yrs` : ''} {dob ? `(${dob})` : ''}
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">Phone: {phone || '—'}</p>
                </div>

                {/* ACCOUNT SUMMARY */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 uppercase font-mono block">Account</span>
                  <strong className="text-slate-900 dark:text-white block truncate">{email || '—'}</strong>
                  <p className="text-slate-500 text-[11px]">Role: Patient Portal</p>
                  <p className="text-slate-400 font-mono text-[11px]">Password: ••••••••••••</p>
                </div>

                {/* HEALTH SUMMARY */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-rose-500 uppercase font-mono block">Health & Vitals</span>
                  <strong className="text-slate-900 dark:text-white block">
                    Blood Group: {bloodGroup}
                  </strong>
                  <p className="text-slate-500 text-[11px]">
                    BMI: {bmiInfo.value ?? '—'} {weightKg ? `(${weightKg} kg / ${heightCm || '—'} cm)` : ''}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    BP: {systolicBp && diastolicBp ? `${systolicBp}/${diastolicBp} mmHg` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* TERMS & PRIVACY POLICY CHECKBOX */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#00a896] border-slate-300 focus:ring-[#00a896] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                I agree to the <strong className="text-slate-900 dark:text-white">ABDM Terms of Service</strong> and consent to the digital processing of my health vitals under encrypted patient privacy standards.
              </label>
            </div>

            {/* STEP 3 NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2</span>
              </button>

              <button
                type="submit"
                disabled={loading || !agreedTerms}
                className="py-3 px-7 rounded-2xl bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-[#00897b] hover:to-teal-700 text-white font-black text-xs transition-all shadow-xl shadow-teal-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

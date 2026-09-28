import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
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
  HeartPulse,
  RotateCw,
  Scale,
  Ruler,
  Thermometer,
  Check
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { authApi } from '../services/dhrApis';
import { setAuthToken, clearAuthToken } from '../services/apiClient';
import { safeLocalStorageSet, safeLocalStorageRemove, pruneLocalStorageQuota } from '../utils/safeStorage';
import { showGlobalToast } from '../components/common/GlobalToastManager';
import { AUTH_CONFIG } from '../config/authConfig';

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
  onNavigate,
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Patient 3-Step Wizard States
  const [patientRegStep, setPatientRegStep] = useState<1 | 2 | 3>(1);
  const [abhaId, setAbhaId] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [address, setAddress] = useState('');
  const [allergies, setAllergies] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [systolicBp, setSystolicBp] = useState('');
  const [diastolicBp, setDiastolicBp] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');

  // Email Verification OTP States (Step 2)
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpPreviewNotice, setOtpPreviewNotice] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

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
  const [nursingQualification, setNursingQualification] = useState('');
  const [nurseSpecialty, setNurseSpecialty] = useState('');
  const [nurseHospital, setNurseHospital] = useState('');
  const [homeVisitAvailable, setHomeVisitAvailable] = useState(true);

  // Pharmacist Specific States
  const [pharmacyName, setPharmacyName] = useState('');
  const [drugLicenseNo, setDrugLicenseNo] = useState('');
  const [pharmacyRegNo, setPharmacyRegNo] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [digitalDispenseReady, setDigitalDispenseReady] = useState(true);

  // Insurance Specific States
  const [insuranceOrgName, setInsuranceOrgName] = useState('');
  const [irdaiRegNo, setIrdaiRegNo] = useState('');
  const [officerEmpId, setOfficerEmpId] = useState('');
  const [officerDesignation, setOfficerDesignation] = useState('');
  const [claimsClearanceLevel, setClaimsClearanceLevel] = useState('');

  // Generate random 4-character alpha-numeric captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // UI Flow States
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptcha());
  const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss error after 5 seconds
  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMsg(''), 5000);
  };

  // Clear error on any user input
  const clearError = () => {
    if (errorMsg) {
      setErrorMsg('');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    }
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
  };

  // Maximum allowed date of birth = Today (No future dates)
  const maxDobDate = new Date().toISOString().split('T')[0];

  // Auto-calculate age from DOB with future date protection
  const handleDobChange = (dateStr: string) => {
    setDob(dateStr);
    setErrorMsg('');
    if (dateStr) {
      const birthDate = new Date(dateStr);
      const today = new Date();
      if (birthDate > today) {
        setErrorMsg('Date of birth cannot be in the future.');
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

  // Dynamic BMI Calculation from Weight & Height
  const bmiInfo = (() => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { value: null, label: 'Enter height & weight', badgeColor: 'bg-slate-100 text-slate-600' };
    }

    const heightInMeters = h / 100;
    const calculatedBmi = w / (heightInMeters * heightInMeters);

    if (calculatedBmi <= 0 || calculatedBmi > 100 || !isFinite(calculatedBmi)) {
      return { value: null, label: 'Invalid values', badgeColor: 'bg-rose-50 text-rose-700' };
    }

    const roundedBmi = parseFloat(calculatedBmi.toFixed(2));
    let label = 'Normal Weight';
    let badgeColor = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20';

    if (roundedBmi < 18.5) {
      label = 'Underweight';
      badgeColor = 'bg-amber-500/10 text-amber-700 border border-amber-500/20';
    } else if (roundedBmi >= 25 && roundedBmi < 29.9) {
      label = 'Overweight';
      badgeColor = 'bg-amber-500/10 text-amber-700 border border-amber-500/20';
    } else if (roundedBmi >= 30) {
      label = 'Obese';
      badgeColor = 'bg-rose-500/10 text-rose-700 border border-rose-500/20';
    }

    return { value: roundedBmi, label, badgeColor };
  })();

  // 6-digit OTP input boxes refs and handlers
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpBoxChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const current = (otpCode || '').padEnd(6, ' ').split('').slice(0, 6);
    current[index] = digit || ' ';
    const combined = current.join('').trimEnd();
    setOtpCode(combined);
    clearError();

    // auto-focus next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if ((!otpCode[index] || otpCode[index] === ' ') && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (otpCode && otpCode.trim().length === 6) {
        handleVerifyOtp();
      } else {
        showError('Please enter all 6 digits of the verification code.');
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      setOtpCode(pasted);
      clearError();
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  // Keyboard Enter-key navigation ref and handler for Patient Registration
  const patientFormRef = React.useRef<HTMLDivElement>(null);

  const focusNavElement = (navKey: string) => {
    if (!patientFormRef.current) return;
    const targetEl = patientFormRef.current.querySelector<HTMLElement>(`[data-nav="${navKey}"]`);
    if (targetEl && !targetEl.hasAttribute('disabled')) {
      targetEl.focus();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handlePatientKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;

    const target = e.target as HTMLElement;
    if (!target) return;

    const tagName = target.tagName.toLowerCase();

    // 1. Textarea: allow normal newline behavior
    if (tagName === 'textarea') {
      return;
    }

    // 2. Buttons: allow normal execution on Enter
    if (tagName === 'button') {
      return;
    }

    // 3. OTP inputs: managed separately by handleOtpKeyDown
    if (target.getAttribute('data-otp-input') === 'true') {
      return;
    }

    const currentNav = target.getAttribute('data-nav');

    // Prevent default form submission on inputs
    e.preventDefault();

    // -------------------------------------------------------------
    // STEP 1 ENTER NAVIGATION
    // -------------------------------------------------------------
    if (patientRegStep === 1) {
      if (currentNav === 'email') {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          showError('Please enter a valid email address.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('password');
        return;
      }

      if (currentNav === 'password') {
        if (!password || password.length < 8) {
          showError('Password must be at least 8 characters long.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('confirmPassword');
        return;
      }

      if (currentNav === 'confirmPassword') {
        if (!confirmPassword) {
          showError('Please confirm your password.');
          target.focus();
          return;
        }
        if (password !== confirmPassword) {
          showError('Passwords do not match. Please verify.');
          target.focus();
          return;
        }
        clearError();

        // Move to OTP verification area
        if (isEmailVerified) {
          focusNavElement('continueStep1');
        } else if (isOtpSent && otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
          otpInputRefs.current[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          focusNavElement('sendOtp');
        }
        return;
      }
    }

    // -------------------------------------------------------------
    // STEP 2 ENTER NAVIGATION
    // -------------------------------------------------------------
    if (patientRegStep === 2) {
      if (currentNav === 'fullName') {
        if (!fullName.trim() || fullName.trim().length < 2) {
          showError('Please enter your full name (minimum 2 characters).');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('dob');
        return;
      }

      if (currentNav === 'dob') {
        if (!dob) {
          showError('Please enter your date of birth.');
          target.focus();
          return;
        }
        if (new Date(dob) > new Date()) {
          showError('Date of birth cannot be in the future.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('gender');
        return;
      }

      if (currentNav === 'gender') {
        if (!gender || gender === 'Select Gender') {
          showError('Please select your gender.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('phone');
        return;
      }

      if (currentNav === 'phone') {
        if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
          showError('Please enter a valid 10-digit mobile number.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('emergencyContactPhone');
        return;
      }

      if (currentNav === 'emergencyContactPhone') {
        if (!emergencyContactPhone.trim() || emergencyContactPhone.replace(/[^0-9]/g, '').length < 10) {
          showError('Please enter a valid 10-digit emergency contact number.');
          target.focus();
          return;
        }
        clearError();
        focusNavElement('bloodGroup');
        return;
      }

      if (currentNav === 'bloodGroup') {
        clearError();
        focusNavElement('allergies');
        return;
      }

      if (currentNav === 'allergies') {
        clearError();
        focusNavElement('familyPhone');
        return;
      }

      if (currentNav === 'familyPhone') {
        clearError();
        focusNavElement('address');
        return;
      }

      if (currentNav === 'address') {
        clearError();
        focusNavElement('abhaId');
        return;
      }

      if (currentNav === 'abhaId') {
        clearError();
        focusNavElement('continueStep2');
        return;
      }
    }

    // -------------------------------------------------------------
    // STEP 3 ENTER NAVIGATION
    // -------------------------------------------------------------
    if (patientRegStep === 3) {
      if (currentNav === 'weightKg') {
        clearError();
        focusNavElement('heightCm');
        return;
      }

      if (currentNav === 'heightCm') {
        // Skip BMI (auto-calculated and read-only) -> move to Blood Pressure
        clearError();
        focusNavElement('systolicBp');
        return;
      }

      if (currentNav === 'systolicBp') {
        clearError();
        focusNavElement('diastolicBp');
        return;
      }

      if (currentNav === 'diastolicBp') {
        clearError();
        focusNavElement('heartRate');
        return;
      }

      if (currentNav === 'heartRate') {
        clearError();
        focusNavElement('temperature');
        return;
      }

      if (currentNav === 'temperature') {
        // Move focus to Create MediCare Account button without submitting automatically
        clearError();
        focusNavElement('createAccount');
        return;
      }
    }

    // Fallback: If current field did not match a specific rule, use DOM order
    if (patientFormRef.current) {
      const candidates = Array.from(
        patientFormRef.current.querySelectorAll<HTMLElement>(
          'input:not([type="hidden"]):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]):not([readonly]), [data-nav]'
        )
      ).filter(el => {
        if (el.tagName.toLowerCase() === 'button' && !el.getAttribute('data-nav')) return false;
        return true;
      });

      const idx = candidates.indexOf(target);
      if (idx !== -1 && idx < candidates.length - 1) {
        const next = candidates[idx + 1];
        next.focus();
        next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Email OTP Handlers for Step 1
  const handleSendOtp = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError('Please enter a valid email address first.');
      return;
    }
    setOtpLoading(true);
    clearError();
    try {
      const res = await authApi.sendOtp(email.trim());
      setIsOtpSent(true);
      setOtpCountdown(60);
      if (res.data?.previewCode) {
        setOtpPreviewNotice(`Verification Code: ${res.data.previewCode}`);
      }
      showGlobalToast(`Verification code sent to ${email.trim()}`, 'success');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      showError(err?.message || 'Unable to send verification code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      showError('Please enter the full 6-digit verification code.');
      return;
    }
    setOtpLoading(true);
    clearError();
    try {
      await authApi.verifyOtp(email.trim(), otpCode.trim());
      setIsEmailVerified(true);
      setOtpPreviewNotice(null);
      showGlobalToast('✓ Email verified successfully!', 'success');
    } catch (err: any) {
      showError(err?.message || 'Invalid or expired verification code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 1 (Account & Verification) -> Step 2 (Personal Info) Advancement
  const handleProceedToStep2 = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match. Please verify.');
      return;
    }
    if (!isEmailVerified) {
      showError('Please verify your email address using the 6-digit OTP before continuing.');
      return;
    }
    clearError();
    setPatientRegStep(2);
  };

  // Step 2 (Personal Info) -> Step 3 (Medical Info) Advancement
  const handleProceedToStep3 = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      showError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!dob) {
      showError('Please enter your date of birth.');
      return;
    }
    if (dob && new Date(dob) > new Date()) {
      showError('Date of birth cannot be in the future.');
      return;
    }
    if (!gender || gender === 'Select Gender') {
      showError('Please select your gender.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!emergencyContactPhone.trim() || emergencyContactPhone.replace(/[^0-9]/g, '').length < 10) {
      showError('Please enter a valid 10-digit emergency contact number.');
      return;
    }
    clearError();
    setPatientRegStep(3);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);

    if (mode === 'register') {
      if (role === 'patient') {
        if (patientRegStep === 1) {
          handleProceedToStep2();
          return;
        }
        if (patientRegStep === 2) {
          handleProceedToStep3();
          return;
        }
        if (!isEmailVerified) {
          showError('Please verify your email address using the 6-digit OTP.');
          return;
        }
      }
      if (password !== confirmPassword) {
        showError('Passwords do not match. Please check again.');
        return;
      }
      if (!agreedTerms) {
        showError('Please accept the Terms of Service & ABDM Privacy Policy.');
        return;
      }
    } else {
      // Validate Verification Code / Captcha for Login
      if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
        showError('Invalid verification code / CAPTCHA. Please enter the code shown.');
        refreshCaptcha();
        return;
      }
    }

    setLoading(true);

    const prismaRoleMap: Record<string, string> = {
      patient: 'PATIENT',
      doctor: 'DOCTOR',
      nurse: 'NURSE',
      pharmacist: 'PHARMACIST',
      caregiver: 'CAREGIVER',
      insurance: 'INSURANCE_PROVIDER',
    };

    const userRoleDisplayMap: Record<string, string> = {
      patient: 'Patient',
      doctor: 'Doctor',
      nurse: 'Nurse',
      pharmacist: 'Pharmacist',
      caregiver: 'Caregiver',
      insurance: 'Insurance',
      PATIENT: 'Patient',
      DOCTOR: 'Doctor',
      NURSE: 'Nurse',
      PHARMACIST: 'Pharmacist',
      CAREGIVER: 'Caregiver',
      INSURANCE_PROVIDER: 'Insurance',
      ADMIN: 'Admin',
      SUPER_ADMIN: 'Super Admin',
    };

    try {
      let authResponse;

      if (mode === 'register') {
        const prismaRole = prismaRoleMap[role] || 'PATIENT';
        const registerPayload = {
          email: email.trim(),
          password,
          role: prismaRole,
          fullName: fullName.trim() || undefined,
          phoneNumber: phone.trim() || undefined,
          abhaId: abhaId.trim() || undefined,
          gender: (gender && gender !== 'Select Gender') ? gender : undefined,
          dateOfBirth: dob || undefined,
          bloodGroup: (bloodGroup && bloodGroup !== 'Select Blood Group') ? bloodGroup.trim() : undefined,
          blood_group: (bloodGroup && bloodGroup !== 'Select Blood Group') ? bloodGroup.trim() : undefined,
          address: address.trim() || undefined,
          emergencyContactName: emergencyContactName.trim() || undefined,
          emergencyContactPhone: emergencyContactPhone.trim() || familyPhone.trim() || undefined,
          familyPhone: familyPhone.trim() || undefined,
          heightCm: heightCm ? parseFloat(heightCm) : undefined,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
          systolicBp: systolicBp ? parseInt(systolicBp, 10) : undefined,
          diastolicBp: diastolicBp ? parseInt(diastolicBp, 10) : undefined,
          heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
          temperature: temperature ? parseFloat(temperature) : undefined,
          speciality: specialization || (role === 'nurse' ? nurseSpecialty : undefined),
          hospital: hospitalAffiliation || (role === 'nurse' ? nurseHospital : (role === 'pharmacist' ? pharmacyName : undefined)),
          providerName: insuranceOrgName || undefined,
        };

        const authResponse = await authApi.register(registerPayload);
        if (authResponse && authResponse.success) {
          clearAuthToken();
          safeLocalStorageRemove('app_user');
          safeLocalStorageSet('app_is_logged_in', 'false');
          setPassword('');
          setConfirmPassword('');
          setLoading(false);
          setSubmitted(false);
          setMode('login');
          showGlobalToast('Registration successful! Please sign in with your email and password.', 'success');
          if (onNavigate) {
            onNavigate('login');
          }
          return;
        } else {
          throw new Error(authResponse?.message || 'Registration failed.');
        }
      } else {
        const authResponse = await authApi.login({
          email: email.trim(),
          password,
        });

        if (authResponse && authResponse.data && authResponse.data.token) {
          const { user, token } = authResponse.data;
          setAuthToken(token);
          safeLocalStorageSet('token', token);
          safeLocalStorageSet('auth_token', token);

          const profile: any = user.profile || {};
          const authoritativeRole = userRoleDisplayMap[user.role] || userRoleDisplayMap[user.role?.toLowerCase?.()] || user.role || 'Patient';
          const resolvedUserData = {
            id: user.id,
            profileId: profile.id,
            name: profile.fullName || profile.providerName || user.email.split('@')[0],
            email: user.email,
            role: authoritativeRole,
            abhaId: user.abhaId || profile.abhaId,
            bloodGroup: profile.bloodGroup || bloodGroup || 'O+',
            age: profile.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()) : (age ? parseInt(age, 10) : 28),
            phone: user.phoneNumber || phone,
            emergencyContact: profile.emergencyContactPhone || emergencyContactPhone || phone,
            familyPhone: profile.familyPhone || familyPhone,
            heightCm: profile.heightCm || (heightCm ? parseFloat(heightCm) : undefined),
            weightKg: weightKg ? parseFloat(weightKg) : undefined,
            bmi: bmiInfo.value,
            specialization: profile.speciality,
            hospitalAffiliation: profile.hospital,
          };

          safeLocalStorageSet('app_user', JSON.stringify(resolvedUserData));
          safeLocalStorageSet('app_is_logged_in', 'true');

          setSubmitted(true);
          setTimeout(() => {
            setLoading(false);
            setSubmitted(false);
            if (onSuccessLogin) {
              onSuccessLogin(resolvedUserData);
            } else {
              onNavigateHome();
            }
          }, 600);
        } else {
          throw new Error(authResponse?.message || 'Authentication request failed.');
        }
      }
    } catch (err: any) {
      setLoading(false);
      setSubmitted(false);
      const rawMsg: string = err?.message || '';

      let displayMsg: string;
      const isNetworkError =
        rawMsg === 'Failed to fetch' ||
        rawMsg.includes('NetworkError') ||
        rawMsg.includes('ERR_CONNECTION_REFUSED') ||
        rawMsg.includes('Unable to connect') ||
        (err instanceof TypeError && rawMsg === 'Failed to fetch');

      if (isNetworkError) {
        displayMsg = 'Authentication server is unavailable. Please verify the backend service is running on port 5000.';
        refreshCaptcha(); // regenerate only on network failure
      } else {
        // Credential/auth/validation errors — keep the same captcha so user doesn't have to re-read it
        displayMsg = rawMsg || 'Authentication failed. Please check your credentials.';
      }

      showError(displayMsg);
    }
  };

  // Consistent Input Field Class (Light mode optimized on form panel)
  const inputClass = "w-full h-12 px-4 rounded-xl bg-slate-50/90 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs";
  const inputWithIconClass = "w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/90 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs";
  const labelClass = "text-[13px] font-semibold text-slate-700 block mb-1.5";

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden flex flex-col justify-center select-none">
      
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-xs font-black text-slate-800 hover:text-[#00a896] border border-slate-200 shadow-md backdrop-blur-xl transition-all cursor-pointer group"
          title="Return to MediCare Landing Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5] text-[#00a896] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* MAIN DUAL-COLUMN CARD (45/55 SPLIT) */}
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl relative z-10 pt-4 sm:pt-6">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-all">
          
          {/* COLUMN 1: LEFT MEDICARE BRANDING & STATIC VISUAL PANEL (45%) */}
          <div 
            className="p-7 sm:p-9 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#061B33] to-[#040e1e] border-slate-800 lg:col-span-5 lg:order-1 border-r border-slate-800/80"
          >
            {/* AMBIENT MESH OVERLAYS */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* TOP BRANDING & HEADLINE */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <Logo showBadge variant="dark" />
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-cyan-300 rounded-full border border-teal-400/30 font-mono shadow-xs">
                    ABDM Verified
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 font-mono shadow-xs">
                    ABDM Ready
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white">
                  {mode === 'login' 
                    ? 'Unified Healthcare & ABHA Ecosystem' 
                    : 'Join the Unified Healthcare Network'}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {mode === 'login'
                    ? 'Integrated ABDM healthcare records, diagnostic telemetry, smart e-prescriptions, and cashless hospital gateway.'
                    : 'Create your verified account to access personalized health records, remote consultations, and 24x7 emergency response.'}
                </p>
              </div>

              {/* HEALTHCARE STATIC IMAGE CONTAINER (STATIC VISUAL - NO CAROUSEL / SLIDERS) */}
              <div className="py-1">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg bg-slate-950">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=85" 
                    alt="MediCare Digital Health Ecosystem"
                    className="w-full h-40 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
                    <span className="text-[11px] bg-slate-900/90 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>MediCare Smart Network</span>
                    </span>
                    <span className="text-[10px] font-mono text-teal-300">ABDM Compliant</span>
                  </div>
                </div>
              </div>

              {/* 3 COMPACT BENEFIT TILES */}
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Personal Health Records</h5>
                    <p className="text-[11px] text-slate-300">Live vitals & health records</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Secure Health Data</h5>
                    <p className="text-[11px] text-slate-300">Protected digital health information</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">24×7 Emergency Network</h5>
                    <p className="text-[11px] text-slate-300">Emergency healthcare support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECONDARY SWITCHER LINK */}
            <div className="relative z-10 pt-4 border-t border-white/10 mt-3 text-center">
              <p className="text-xs text-slate-300">
                {mode === 'login' ? 'New to MediCare Healthcare?' : 'Already have a MediCare account?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  const newMode = mode === 'login' ? 'register' : 'login';
                  setMode(newMode);
                  clearError();
                  if (onNavigate) onNavigate(newMode);
                }}
                className="mt-1.5 text-xs font-bold text-teal-300 hover:text-teal-200 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{mode === 'login' ? 'Create an Account' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* COLUMN 2: INTERACTIVE FORM PANEL (55%) */}
          <div 
            className="p-7 sm:p-9 lg:p-10 flex flex-col justify-between bg-white text-slate-900 lg:col-span-7 lg:order-2 overflow-y-auto max-h-[92vh] lg:max-h-none"
          >
            <div>
              {/* SEGMENTED SWITCHER (LOGIN vs REGISTER) */}
              <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center mb-6 relative">
                <button
                  type="button"
                  onClick={() => { 
                    setMode('login'); 
                    clearError(); 
                    if (onNavigate) onNavigate('login');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    mode === 'login'
                      ? 'bg-[#00a896] text-white shadow-sm'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { 
                    setMode('register'); 
                    clearError(); 
                    if (onNavigate) onNavigate('register');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    mode === 'register'
                      ? 'bg-[#00a896] text-white shadow-sm'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>

              {/* FORM HEADING */}
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {mode === 'login' ? (
                    <span>
                      Welcome back to <span className="text-slate-900">Medi</span><span className="text-[#00a896]">Care</span>
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
                <p className="text-xs text-slate-500 mt-1 font-normal">
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
                        : 'Create your personal health account and ABHA profile.'
                    )}
                </p>
              </div>

              {/* ERROR FEEDBACK ALERT */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-5 flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* SUCCESS ANIMATION FEEDBACK */}
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-4 my-6"
                >
                  <div className="w-14 h-14 rounded-full bg-teal-100 text-[#00a896] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#00a896]">
                    {mode === 'login' ? 'Authentication Successful!' : 'Registration Complete!'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-normal">
                    {mode === 'login' 
                      ? 'Loading your personalized health dashboard and ABHA medical records...' 
                      : `Your ${role.toUpperCase()} profile and authorization credentials have been provisioned. Redirecting...`}
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                    <div className="bg-[#00a896] h-full animate-pulse w-full" />
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* =========================================================================
                      PATIENT 3-STEP REGISTRATION WIZARD (REORGANIZED 3 STEPS)
                      STEP 1: Account & Email Verification
                      STEP 2: Personal Information (2-Column Layout)
                      STEP 3: Medical Information & Vitals Summary
                      ========================================================================= */}
                  {mode === 'register' && role === 'patient' && (
                    <div ref={patientFormRef} onKeyDown={handlePatientKeyDown} className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start pt-1">
                      
                      {/* VERTICAL STEPPER RAIL (BESIDE THE FORM) */}
                      <div className="w-full md:w-52 lg:w-60 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-slate-200/90 md:pr-5">
                        <div className="flex flex-row md:flex-col justify-between md:justify-start gap-2 md:gap-0 relative">
                          
                          {/* STEP 1: ACCOUNT & VERIFICATION */}
                          <div className="flex items-start gap-3 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                              patientRegStep > 1 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : patientRegStep === 1 
                                ? 'bg-[#00a896] text-white ring-4 ring-teal-500/20 shadow-sm' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {patientRegStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '01'}
                            </div>
                            <div className="hidden sm:block">
                              <p className={`text-[10px] uppercase font-black tracking-wider ${
                                patientRegStep === 1 ? 'text-[#00a896]' : patientRegStep > 1 ? 'text-teal-700' : 'text-slate-400'
                              }`}>01</p>
                              <p className={`text-xs font-bold leading-tight ${
                                patientRegStep === 1 ? 'text-slate-900' : patientRegStep > 1 ? 'text-slate-700' : 'text-slate-400'
                              }`}>Account & Verification</p>
                              <p className="text-[11px] text-slate-400 hidden lg:block leading-tight mt-0.5">
                                Create your secure account & verify email
                              </p>
                            </div>
                          </div>

                          {/* VERTICAL CONNECTOR 1 -> 2 */}
                          <div className="hidden md:block w-0.5 h-12 ml-4 my-1 transition-all duration-300">
                            <div className={`w-full h-full ${patientRegStep > 1 ? 'bg-teal-500' : 'bg-slate-200'}`} />
                          </div>

                          {/* STEP 2: PERSONAL INFORMATION */}
                          <div className="flex items-start gap-3 relative z-10 md:mt-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                              patientRegStep > 2 
                                ? 'bg-teal-600 text-white shadow-sm' 
                                : patientRegStep === 2 
                                ? 'bg-[#00a896] text-white ring-4 ring-teal-500/20 shadow-sm' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {patientRegStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '02'}
                            </div>
                            <div className="hidden sm:block">
                              <p className={`text-[10px] uppercase font-black tracking-wider ${
                                patientRegStep === 2 ? 'text-[#00a896]' : patientRegStep > 2 ? 'text-teal-700' : 'text-slate-400'
                              }`}>02</p>
                              <p className={`text-xs font-bold leading-tight ${
                                patientRegStep === 2 ? 'text-slate-900' : patientRegStep > 2 ? 'text-slate-700' : 'text-slate-400'
                              }`}>Personal Information</p>
                              <p className="text-[11px] text-slate-400 hidden lg:block leading-tight mt-0.5">
                                Tell us about yourself
                              </p>
                            </div>
                          </div>

                          {/* VERTICAL CONNECTOR 2 -> 3 */}
                          <div className="hidden md:block w-0.5 h-12 ml-4 my-1 transition-all duration-300">
                            <div className={`w-full h-full ${patientRegStep > 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />
                          </div>

                          {/* STEP 3: MEDICAL INFORMATION */}
                          <div className="flex items-start gap-3 relative z-10 md:mt-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                              patientRegStep === 3 
                                ? 'bg-[#00a896] text-white ring-4 ring-teal-500/20 shadow-sm' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              03
                            </div>
                            <div className="hidden sm:block">
                              <p className={`text-[10px] uppercase font-black tracking-wider ${
                                patientRegStep === 3 ? 'text-[#00a896]' : 'text-slate-400'
                              }`}>03</p>
                              <p className={`text-xs font-bold leading-tight ${
                                patientRegStep === 3 ? 'text-slate-900' : 'text-slate-400'
                              }`}>Medical Information</p>
                              <p className="text-[11px] text-slate-400 hidden lg:block leading-tight mt-0.5">
                                Add your health & vital information
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* CURRENT STEP FORM FIELDS */}
                      <div className="flex-1 min-w-0 w-full space-y-4">
                        
                        {/* -------------------------------------------------------------
                            STEP 1: ACCOUNT & EMAIL VERIFICATION
                            ------------------------------------------------------------- */}
                        {patientRegStep === 1 && (
                          <div className="space-y-4">
                            <div className="pb-1">
                              <h4 className="text-base font-bold text-slate-900">Account & Email Verification</h4>
                              <p className="text-xs text-slate-500">Create your secure MediCare credentials and verify your email.</p>
                            </div>

                            {/* EMAIL ADDRESS */}
                            <div>
                              <label className={labelClass}>Email Address <span className="text-rose-500">*</span></label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    data-nav="email"
                                    type="email"
                                    required
                                    placeholder="e.g. user@medicare.health"
                                    value={email}
                                    onChange={(e) => {
                                      setEmail(e.target.value);
                                      if (isEmailVerified) setIsEmailVerified(false);
                                      clearError();
                                    }}
                                    className={inputWithIconClass}
                                  />
                                </div>
                                <button
                                  data-nav="sendOtp"
                                  type="button"
                                  onClick={handleSendOtp}
                                  disabled={otpLoading || otpCountdown > 0 || isEmailVerified}
                                  className="px-4 h-12 rounded-xl text-xs font-bold bg-[#00a896] hover:bg-teal-600 text-white shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {otpLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : otpCountdown > 0 ? (
                                    `Resend in ${otpCountdown}s`
                                  ) : isEmailVerified ? (
                                    'Verified'
                                  ) : isOtpSent ? (
                                    'Resend Code'
                                  ) : (
                                    'Send OTP'
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* PASSWORD & CONFIRM PASSWORD */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                              <div>
                                <label className={labelClass}>Password <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    data-nav="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                    className="w-full h-12 pl-11 pr-10 rounded-xl bg-slate-50/90 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs"
                                  />
                                  <button
                                    tabIndex={-1}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>

                                {/* PASSWORD STRENGTH METER */}
                                {password && (
                                  <div className="pt-2 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                      <span className="text-slate-500 font-mono">Strength:</span>
                                      <span className={`${strength.score >= 75 ? 'text-teal-600' : 'text-amber-500'} font-mono`}>
                                        {strength.label}
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                                    data-nav="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                                    className="w-full h-12 pl-11 pr-10 rounded-xl bg-slate-50/90 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs"
                                  />
                                  <button
                                    tabIndex={-1}
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* EMAIL OTP VERIFICATION SECTION */}
                            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-[#00a896]" />
                                  <span>Email Verification</span>
                                </span>
                                {isEmailVerified ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Verified</span>
                                  </span>
                                ) : isOtpSent ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                    Code Dispatched
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-400">
                                    Verification Required
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500">
                                {isOtpSent 
                                  ? "We've sent a 6-digit verification code to your email address." 
                                  : "Click 'Send OTP' above to receive your 6-digit security code."}
                              </p>

                              {/* OTP SIMULATION PREVIEW NOTICE */}
                              {otpPreviewNotice && (
                                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium flex items-center justify-between">
                                  <span className="font-mono font-bold">{otpPreviewNotice}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => setOtpPreviewNotice(null)} 
                                    className="text-teal-600 hover:text-teal-900 font-bold ml-2 cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}

                              {/* 6-DIGIT OTP BOXES: [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] */}
                              {!isEmailVerified && (
                                <div className="space-y-3 pt-1">
                                  <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                                    {[0, 1, 2, 3, 4, 5].map((index) => {
                                      const char = otpCode[index] && otpCode[index] !== ' ' ? otpCode[index] : '';
                                      return (
                                        <input
                                          key={index}
                                          ref={(el) => (otpInputRefs.current[index] = el)}
                                          data-nav={`otp-${index}`}
                                          data-otp-input="true"
                                          type="text"
                                          inputMode="numeric"
                                          maxLength={1}
                                          value={char}
                                          disabled={!isOtpSent || isEmailVerified}
                                          onChange={(e) => handleOtpBoxChange(index, e.target.value)}
                                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                          className="w-10 sm:w-12 h-12 text-center text-lg font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/20 transition-all font-mono disabled:bg-slate-100 disabled:cursor-not-allowed shadow-xs"
                                        />
                                      );
                                    })}
                                  </div>

                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                                    <button
                                      data-nav="verifyOtp"
                                      type="button"
                                      onClick={handleVerifyOtp}
                                      disabled={otpLoading || !otpCode || otpCode.trim().length !== 6 || isEmailVerified}
                                      className="w-full sm:w-auto px-5 h-10 rounded-xl text-xs font-bold bg-[#00a896] hover:bg-teal-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {otpLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <>
                                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                          <span>Verify Email</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={handleSendOtp}
                                      disabled={otpLoading || otpCountdown > 0 || isEmailVerified}
                                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                                    >
                                      {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : 'Resend Code'}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* SUCCESS STATE */}
                              {isEmailVerified && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                  <span>✓ Email verified successfully</span>
                                </div>
                              )}
                            </div>

                            {/* STEP 1 ACTION: CONTINUE */}
                            <div className="pt-2 space-y-2">
                              <motion.button
                                data-nav="continueStep1"
                                whileHover={isEmailVerified ? { scale: 1.01 } : {}}
                                whileTap={isEmailVerified ? { scale: 0.99 } : {}}
                                type="button"
                                disabled={!isEmailVerified}
                                onClick={handleProceedToStep2}
                                className="w-full h-12 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border border-teal-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span>Continue to Personal Information</span>
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                              
                              {!isEmailVerified && (
                                <p className="text-[11px] text-center text-slate-400">
                                  Please verify your email using the 6-digit OTP code before continuing.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* -------------------------------------------------------------
                            STEP 2: PERSONAL INFORMATION (CLEAN 2-COLUMN LAYOUT)
                            ------------------------------------------------------------- */}
                        {patientRegStep === 2 && (
                          <div className="space-y-4">
                            <div className="pb-1">
                              <h4 className="text-base font-bold text-slate-900">Personal Information</h4>
                              <p className="text-xs text-slate-500">Tell us a little about yourself to create your health profile.</p>
                            </div>

                            {/* 2-COLUMN GRID (LEFT: Full Name, DOB, Gender, Mobile, Emergency | RIGHT: Blood Group, Allergies, Family Number, Address, ABHA ID) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                              
                              {/* LEFT COLUMN */}
                              <div className="space-y-3.5">
                                {/* FULL NAME */}
                                <div>
                                  <label className={labelClass}>Full Name <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="fullName"
                                      type="text"
                                      required
                                      placeholder="e.g. Lalith Patel"
                                      value={fullName}
                                      onChange={(e) => { setFullName(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>

                                {/* DATE OF BIRTH */}
                                <div>
                                  <label className={labelClass}>Date of Birth <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="dob"
                                      type="date"
                                      required
                                      max={maxDobDate}
                                      value={dob}
                                      onChange={(e) => handleDobChange(e.target.value)}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                  {age ? (
                                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                      Age: <span className="text-slate-800 font-bold">{age} years</span>
                                    </p>
                                  ) : (
                                    <p className="text-[11px] text-slate-400 mt-1">Calculated automatically</p>
                                  )}
                                </div>

                                {/* GENDER */}
                                <div>
                                  <label className={labelClass}>Gender <span className="text-rose-500">*</span></label>
                                  <select
                                    data-nav="gender"
                                    required
                                    value={gender}
                                    onChange={(e) => { setGender(e.target.value); clearError(); }}
                                    className={`${inputClass} ${!gender || gender === 'Select Gender' ? 'text-slate-400' : 'font-medium text-slate-800'}`}
                                  >
                                    <option value="" disabled hidden>Select Gender</option>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                  </select>
                                </div>

                                {/* MOBILE NUMBER */}
                                <div>
                                  <label className={labelClass}>Mobile Number <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="phone"
                                      type="tel"
                                      required
                                      placeholder="+91 98765 43210"
                                      value={phone}
                                      onChange={(e) => { setPhone(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>

                                {/* EMERGENCY CONTACT NUMBER */}
                                <div>
                                  <label className={labelClass}>Emergency Contact Number <span className="text-rose-500">*</span></label>
                                  <div className="relative">
                                    <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="emergencyContactPhone"
                                      type="tel"
                                      required
                                      placeholder="+91 98765 11223"
                                      value={emergencyContactPhone}
                                      onChange={(e) => { setEmergencyContactPhone(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* RIGHT COLUMN */}
                              <div className="space-y-3.5">
                                {/* BLOOD GROUP */}
                                <div>
                                  <label className={labelClass}>Blood Group</label>
                                  <select
                                    data-nav="bloodGroup"
                                    value={bloodGroup}
                                    onChange={(e) => {
                                      setBloodGroup(e.target.value);
                                      clearError();
                                    }}
                                    className={`${inputClass} ${!bloodGroup || bloodGroup === 'Select Blood Group' ? 'text-slate-400' : 'font-bold text-[#00a896]'}`}
                                  >
                                    <option value="" disabled hidden>Select Blood Group</option>
                                    <option value="">Select Blood Group</option>
                                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                                      <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* ALLERGIES */}
                                <div>
                                  <label className={labelClass}>Allergies</label>
                                  <input
                                    data-nav="allergies"
                                    type="text"
                                    placeholder="Enter known allergies (e.g. Penicillin, Asthma)"
                                    value={allergies}
                                    onChange={(e) => { setAllergies(e.target.value); clearError(); }}
                                    className={inputClass}
                                  />
                                </div>

                                {/* FAMILY CONNECTED NUMBER */}
                                <div>
                                  <label className={labelClass}>Family Connected Number <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
                                  <div className="relative">
                                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="familyPhone"
                                      type="tel"
                                      placeholder="+91 98765 44332"
                                      value={familyPhone}
                                      onChange={(e) => { setFamilyPhone(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>

                                {/* RESIDENTIAL ADDRESS */}
                                <div>
                                  <label className={labelClass}>Residential Address</label>
                                  <input
                                    data-nav="address"
                                    type="text"
                                    placeholder="Flat 402, Green Meadows, Bengaluru, Karnataka"
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value); clearError(); }}
                                    className={inputClass}
                                  />
                                </div>

                                {/* ABHA HEALTH ID */}
                                <div>
                                  <label className={labelClass}>ABHA Health ID <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
                                  <div className="relative">
                                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="abhaId"
                                      type="text"
                                      placeholder="e.g. 14-XXXX-XXXX-8921"
                                      value={abhaId}
                                      onChange={(e) => { setAbhaId(e.target.value); clearError(); }}
                                      className={`${inputWithIconClass} font-mono`}
                                    />
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* STEP 2 ACTIONS */}
                            <div className="grid grid-cols-2 gap-3.5 pt-3">
                              <button
                                type="button"
                                onClick={() => { clearError(); setPatientRegStep(1); }}
                                className="h-12 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                              </button>

                              <motion.button
                                data-nav="continueStep2"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="button"
                                onClick={handleProceedToStep3}
                                className="h-12 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-teal-400/20"
                              >
                                <span>Continue to Medical Information</span>
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {/* -------------------------------------------------------------
                            STEP 3: MEDICAL INFORMATION & FINAL SUBMISSION
                            ------------------------------------------------------------- */}
                        {patientRegStep === 3 && (
                          <div className="space-y-4">
                            <div className="pb-1">
                              <h4 className="text-base font-bold text-slate-900">Medical Information</h4>
                              <p className="text-xs text-slate-500">Add your current health measurements to complete your health profile.</p>
                            </div>

                            {/* SECTION 1: BODY MEASUREMENTS */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                <Scale className="w-4 h-4 text-[#00a896]" />
                                <span>Body Measurements</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                  <label className={labelClass}>Weight (kg)</label>
                                  <div className="relative">
                                    <Scale className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="weightKg"
                                      type="number"
                                      min="20"
                                      max="300"
                                      step="0.1"
                                      placeholder="e.g. 65"
                                      value={weightKg}
                                      onChange={(e) => { setWeightKg(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className={labelClass}>Height (cm)</label>
                                  <div className="relative">
                                    <Ruler className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      data-nav="heightCm"
                                      type="number"
                                      min="50"
                                      max="250"
                                      step="0.5"
                                      placeholder="e.g. 170"
                                      value={heightCm}
                                      onChange={(e) => { setHeightCm(e.target.value); clearError(); }}
                                      className={inputWithIconClass}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* DYNAMIC READ-ONLY BMI DISPLAY */}
                              <div className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-[#00a896]" />
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">Body Mass Index (BMI)</p>
                                    <p className="text-[11px] text-slate-400">Calculated automatically</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-slate-900 font-mono">
                                    {bmiInfo.value ? bmiInfo.value : '—'}
                                  </span>
                                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${bmiInfo.badgeColor}`}>
                                    {bmiInfo.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* SECTION 2: VITAL SIGNS */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                <HeartPulse className="w-4 h-4 text-[#00a896]" />
                                <span>Vital Signs</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                  <label className={labelClass}>Blood Pressure (mmHg)</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      data-nav="systolicBp"
                                      type="number"
                                      min="60"
                                      max="220"
                                      placeholder="120 (Sys)"
                                      value={systolicBp}
                                      onChange={(e) => setSystolicBp(e.target.value)}
                                      className={inputClass}
                                    />
                                    <input
                                      data-nav="diastolicBp"
                                      type="number"
                                      min="40"
                                      max="140"
                                      placeholder="80 (Dia)"
                                      value={diastolicBp}
                                      onChange={(e) => setDiastolicBp(e.target.value)}
                                      className={inputClass}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className={labelClass}>Heart Rate & Temp</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      data-nav="heartRate"
                                      type="number"
                                      min="40"
                                      max="200"
                                      placeholder="72 BPM"
                                      value={heartRate}
                                      onChange={(e) => setHeartRate(e.target.value)}
                                      className={inputClass}
                                    />
                                    <input
                                      data-nav="temperature"
                                      type="number"
                                      step="0.1"
                                      min="90"
                                      max="110"
                                      placeholder="98.6 °F"
                                      value={temperature}
                                      onChange={(e) => setTemperature(e.target.value)}
                                      className={inputClass}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* REGISTRATION READINESS SUMMARY */}
                            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registration Summary</p>
                              
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span>Account & Credentials</span>
                                </span>
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  ✓ Email verified ({email})
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span>Personal Information</span>
                                </span>
                                <span className="text-[11px] font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-full">
                                  ✓ Completed ({fullName || 'Profile Details'})
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[#00a896]" />
                                  <span>Medical Information</span>
                                </span>
                                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                                  ✓ Completed
                                </span>
                              </div>
                            </div>

                            {/* TERMS CHECKBOX */}
                            <div className="pt-1">
                              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={agreedTerms}
                                  onChange={(e) => { setAgreedTerms(e.target.checked); clearError(); }}
                                  className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 mt-0.5 cursor-pointer"
                                />
                                <span className="leading-snug">
                                  I agree to MediCare’s <span className="text-[#00a896] font-bold">Terms of Service</span> & <span className="text-[#00a896] font-bold">ABDM Healthcare Protocol</span>.
                                </span>
                              </label>
                            </div>

                            {/* STEP 3 ACTIONS */}
                            <div className="grid grid-cols-2 gap-3.5 pt-2">
                              <button
                                type="button"
                                onClick={() => { clearError(); setPatientRegStep(2); }}
                                className="h-12 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                              </button>

                              <motion.button
                                data-nav="createAccount"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="h-12 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-teal-400/20 disabled:opacity-50"
                              >
                                {loading ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <span>Create MediCare Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        )}
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
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                            className={`${inputClass} ${!caregiverType ? 'text-slate-400' : ''}`}
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
                            <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                            className={`${inputClass} ${!patientRelation ? 'text-slate-400' : ''}`}
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
                            className={`${inputClass} ${authorizationScope ? 'font-bold text-[#00a896] dark:text-cyan-300' : 'text-slate-400'}`}
                          >
                            <option value="" disabled>Select Authorization Scope</option>
                            <option value="Full Medical Proxy">Full Medical Proxy (Manage All)</option>
                            <option value="Medication & Vitals Supervisor">Medication & Vitals Supervisor</option>
                            <option value="Appointment & Teleconsult Aide">Appointment & Teleconsult Aide</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      DOCTOR / CLINICIAN REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'doctor' && (
                    <div className="space-y-4">
                      {/* ROW 1: DOCTOR FULL NAME & PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Doctor Full Name <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Priya Sharma"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Doctor Contact Phone <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98450 11223"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: MEDICAL COUNCIL REGISTRATION NO. & SPECIALIZATION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Medical Council Reg. No. <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. KMC-2014-98421"
                              value={medicalCouncilRegNo}
                              onChange={(e) => setMedicalCouncilRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Primary Medical Speciality <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className={`${inputClass} ${specialization ? 'font-bold text-[#00a896] dark:text-cyan-300' : 'text-slate-400'}`}
                          >
                            <option value="" disabled>Select Speciality</option>
                            <option value="General Physician">General Medicine / Physician</option>
                            <option value="Cardiology">Cardiology & Vascular Medicine</option>
                            <option value="Endocrinology">Endocrinology & Diabetology</option>
                            <option value="Pediatrics">Pediatrics & Neonatology</option>
                            <option value="Orthopedics">Orthopedics & Joint Care</option>
                            <option value="Neurology">Neurology & Neuro-Surgery</option>
                            <option value="Dermatology">Dermatology & Cosmetology</option>
                            <option value="Psychiatry">Psychiatry & Mental Health</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: QUALIFICATIONS & YEARS OF EXPERIENCE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Medical Qualifications <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. MBBS, MD (General Medicine)"
                              value={qualifications}
                              onChange={(e) => setQualifications(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Years of Clinical Experience</label>
                          <div className="relative">
                            <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="number"
                              min="0"
                              max="60"
                              placeholder="e.g. 12"
                              value={experienceYears}
                              onChange={(e) => setExperienceYears(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 4: HOSPITAL AFFILIATION & HPR (HEALTHCARE PROFESSIONAL REGISTRY) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Hospital / Clinic Affiliation <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Super Speciality Hospital"
                              value={hospitalAffiliation}
                              onChange={(e) => setHospitalAffiliation(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`${labelClass} flex items-center justify-between`}>
                            <span>Healthcare Professional ID (HPR)</span>
                            <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono font-medium">Optional</span>
                          </label>
                          <div className="relative">
                            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="e.g. 21-8842-1092@hpr"
                              value={hprAddress}
                              onChange={(e) => setHprAddress(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 5: TELECONSULT TOGGLE */}
                      <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Enable MediCare Tele-Consultation & E-Prescription Desk
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={teleConsultReady}
                          onChange={(e) => setTeleConsultReady(e.target.checked)}
                          className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      NURSE REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'nurse' && (
                    <div className="space-y-4">
                      {/* ROW 1: FULL NAME & PHONE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Nurse Full Name <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sister Anjali Mathew"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Nurse Contact Phone <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 94441 55667"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: NURSING COUNCIL REG NO & QUALIFICATION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>State Nursing Council Reg. No. <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. KNC-RN-RM-2018-4421"
                              value={nursingCouncilRegNo}
                              onChange={(e) => setNursingCouncilRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Nursing Degree / Diploma <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={nursingQualification}
                            onChange={(e) => setNursingQualification(e.target.value)}
                            className={`${inputClass} ${!nursingQualification ? 'text-slate-400' : ''}`}
                          >
                            <option value="" disabled hidden>Select Degree / Diploma</option>
                            <option value="">Select Degree / Diploma</option>
                            <option value="B.Sc Nursing / GNM">B.Sc Nursing / GNM (4-Year Registered)</option>
                            <option value="M.Sc Nursing">M.Sc Nursing (Post-Graduate Specialist)</option>
                            <option value="Post Basic B.Sc">Post-Basic B.Sc Nursing</option>
                            <option value="ANM Diploma">Auxiliary Nurse Midwife (ANM)</option>
                          </select>
                        </div>
                      </div>

                      {/* ROW 3: SPECIALTY & AFFILIATED HOSPITAL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Clinical Specialty <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={nurseSpecialty}
                            onChange={(e) => setNurseSpecialty(e.target.value)}
                            className={`${inputClass} ${!nurseSpecialty ? 'text-slate-400' : ''}`}
                          >
                            <option value="" disabled hidden>Select Clinical Specialty</option>
                            <option value="">Select Clinical Specialty</option>
                            <option value="Critical Care & ICU">Critical Care & Intensive Care (ICU)</option>
                            <option value="Emergency & Trauma">Emergency & Trauma Triage</option>
                            <option value="Pediatric & Neonatal Care">Pediatric & Neonatal Care (NICU)</option>
                            <option value="Geriatric & Home Healthcare">Geriatric & Home Healthcare</option>
                            <option value="Operation Theater Specialist">Operation Theater (OT) Specialist</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>Current Hospital / Nursing Home <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Fortis Memorial Hospital"
                              value={nurseHospital}
                              onChange={(e) => setNurseHospital(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 4: HOME VISIT CAPABILITY TOGGLE */}
                      <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Available for Home Vitals Monitoring & Nurse Booking
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={homeVisitAvailable}
                          onChange={(e) => setHomeVisitAvailable(e.target.checked)}
                          className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 dark:border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      PHARMACIST REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'pharmacist' && (
                    <div className="space-y-4">
                      {/* ROW 1: PHARMACY STORE / DISPENSARY NAME & PHARMACIST NAME */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Pharmacy / Store Name <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Pharmacy #4401"
                              value={pharmacyName}
                              onChange={(e) => setPharmacyName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Licensed Pharmacist Name <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Suresh Gowda, B.Pharm"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className={inputWithIconClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: DRUG LICENSE (DL) & STATE PHARMACY COUNCIL (PCI) REG NO. */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className={labelClass}>Drug License No. (Form 20/21) <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Pill className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. KA-BNG-20-48210 / 21-48211"
                              value={drugLicenseNo}
                              onChange={(e) => setDrugLicenseNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>PCI Pharmacist Reg. No. <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. KSPC-REG-2016-5590"
                              value={pharmacyRegNo}
                              onChange={(e) => setPharmacyRegNo(e.target.value)}
                              className={`${inputWithIconClass} font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ROW 3: PHARMACY ADDRESS & PINCODE */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Store Physical Address <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 14th Cross, 4th Block, Koramangala, Bengaluru"
                            value={pharmacyAddress}
                            onChange={(e) => setPharmacyAddress(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Postal Pincode <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="560034"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className={`${inputClass} font-mono`}
                          />
                        </div>
                      </div>

                      {/* ROW 4: CONTACT PHONE & DIGITAL DISPENSE GATEWAY TOGGLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                        <div>
                          <label className={labelClass}>Pharmacy Phone / Hotline <span className="text-rose-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 80 2553 9988"
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
                              checked={digitalDispenseReady}
                              onChange={(e) => setDigitalDispenseReady(e.target.checked)}
                              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span>Enable Instant ABDM E-Prescription Dispense Gateway</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      INSURANCE / TPA REGISTRATION FORM
                      ========================================================================= */}
                  {mode === 'register' && role === 'insurance' && (
                    <div className="space-y-4">
                      {/* ROW 1: AUTHORIZING OFFICER NAME & EMPLOYEE ID */}
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
                              value={officerEmpId}
                              onChange={(e) => setOfficerEmpId(e.target.value)}
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
                            value={claimsClearanceLevel}
                            onChange={(e) => setClaimsClearanceLevel(e.target.value)}
                            className={`${inputClass} ${!claimsClearanceLevel ? 'text-slate-400' : ''}`}
                          >
                            <option value="" disabled hidden>Select Entity Classification</option>
                            <option value="">Select Entity Classification</option>
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
                              value={irdaiRegNo}
                              onChange={(e) => setIrdaiRegNo(e.target.value)}
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
                            className={`${inputClass} ${!officerDesignation ? 'text-slate-400' : ''}`}
                          >
                            <option value="" disabled hidden>Select Officer Role / Designation</option>
                            <option value="">Select Officer Role / Designation</option>
                            <option value="Senior Claims Assessor">Senior Claims Assessor</option>
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
                      </div>
                    </div>
                  )}

                  {/* =========================================================================
                      NON-PATIENT OR LOGIN MODE CREDENTIALS & SUBMIT BLOCK
                      ========================================================================= */}
                  {!(mode === 'register' && role === 'patient') && (
                    <>
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
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={mode === 'login' ? 'text' : 'email'}
                            required
                            placeholder={
                              mode === 'login'
                                ? getRoleLoginDetails(role).placeholder
                                : 'e.g. user@medicare.health'
                            }
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearError(); }}
                            className={inputWithIconClass}
                          />
                        </div>
                      </div>

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
                                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/90 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* DYNAMIC PASSWORD STRENGTH METER */}
                            {password && (
                              <div className="pt-1.5 space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                  <span className="text-slate-500 font-mono">Strength:</span>
                                  <span className={`${strength.score >= 75 ? 'text-teal-600' : 'text-amber-500'} font-mono`}>
                                    {strength.label}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
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
                                type={showConfirmPassword ? 'text' : 'password'}
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
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50/90 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00a896] focus:ring-2 focus:ring-[#00a896]/15 transition-all shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                              className="h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-2 cursor-pointer select-none transition-all shadow-inner group"
                              title="Click to refresh verification code"
                            >
                              <span className="font-mono text-sm font-black tracking-widest text-slate-800 italic line-through decoration-[#00a896]/70 select-none group-hover:scale-105 transition-transform">
                                {captchaCode}
                              </span>
                              <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00a896] group-hover:rotate-180 transition-all duration-300" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* REMEMBER ME & TERMS */}
                      <div className="flex items-center justify-between pt-1">
                        {mode === 'login' ? (
                          <>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 cursor-pointer"
                              />
                              <span>Remember this device</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setErrorMsg('Password reset link has been dispatched to your registered email.')}
                              className="text-xs font-bold text-[#00a896] hover:underline cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </>
                        ) : (
                          <label className="flex items-start gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                            <input
                              type="checkbox"
                              checked={agreedTerms}
                              onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] border-slate-300 mt-0.5 cursor-pointer"
                            />
                            <span className="leading-snug">
                              I agree to MediCare’s <span className="text-[#00a896] font-bold">Terms of Service</span> & <span className="text-[#00a896] font-bold">ABDM Healthcare Protocol</span>.
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
                        className="w-full h-12 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 border border-teal-400/30 disabled:opacity-50"
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
                    </>
                  )}
                </form>
              )}
            </div>

            {/* SWITCH MODE FOOTER PROMPT */}
            <div className="pt-5 border-t border-slate-200 text-center mt-5">
              <p className="text-xs text-slate-600 font-medium">
                {mode === 'login' ? "Don't have a MediCare account yet? " : "Already registered with MediCare? "}
                <button
                  type="button"
                  onClick={() => {
                    const newMode = mode === 'login' ? 'register' : 'login';
                    setMode(newMode);
                    clearError();
                    if (onNavigate) onNavigate(newMode);
                  }}
                  className="font-black text-[#00a896] hover:underline cursor-pointer ml-1"
                >
                  {mode === 'login' ? 'Register Now' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

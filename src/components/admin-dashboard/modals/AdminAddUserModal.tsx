import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Building, 
  Stethoscope, 
  Heart, 
  FileText, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Lock,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { adminApi } from '../../../services/dhrApis';

interface AdminAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export type AdminRoleOption = 
  | 'Patient' 
  | 'Doctor' 
  | 'Nurse' 
  | 'Pharmacist' 
  | 'Caregiver' 
  | 'Insurance' 
  | 'Admin';

const roleToDbMap: Record<AdminRoleOption, string> = {
  Patient: 'PATIENT',
  Doctor: 'DOCTOR',
  Nurse: 'NURSE',
  Pharmacist: 'PHARMACIST',
  Caregiver: 'CAREGIVER',
  Insurance: 'INSURANCE_PROVIDER',
  Admin: 'ADMIN',
};

export const AdminAddUserModal: React.FC<AdminAddUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  showToast,
}) => {
  const [selectedRole, setSelectedRole] = useState<AdminRoleOption | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // --- SECTION 1: PERSONAL INFORMATION ---
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // --- SECTION 2: CONTACT INFORMATION ---
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');

  // --- SECTION 3: ROLE-SPECIFIC FIELDS ---
  // A. Patient Clinical & Vitals
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [systolicBp, setSystolicBp] = useState('');
  const [diastolicBp, setDiastolicBp] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [allergies, setAllergies] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);

  // B. Doctor Fields
  const [medicalRegNo, setMedicalRegNo] = useState('');
  const [medicalCouncil, setMedicalCouncil] = useState('');
  const [doctorQualification, setDoctorQualification] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('');
  const [doctorExpYears, setDoctorExpYears] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('');
  const [doctorDepartment, setDoctorDepartment] = useState('');
  const [doctorDesignation, setDoctorDesignation] = useState('');
  const [doctorProfEmail, setDoctorProfEmail] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [doctorWorkingDays, setDoctorWorkingDays] = useState('');
  const [doctorWorkingHours, setDoctorWorkingHours] = useState('');

  // C. Nurse Fields
  const [nurseRegNo, setNurseRegNo] = useState('');
  const [nurseCouncil, setNurseCouncil] = useState('');
  const [nurseQualification, setNurseQualification] = useState('');
  const [nurseSpecialization, setNurseSpecialization] = useState('');
  const [nurseExpYears, setNurseExpYears] = useState('');
  const [nurseHospital, setNurseHospital] = useState('');
  const [nurseDepartment, setNurseDepartment] = useState('');
  const [nurseDesignation, setNurseDesignation] = useState('');
  const [nurseShift, setNurseShift] = useState('');
  const [nurseWorkingDays, setNurseWorkingDays] = useState('');
  const [nurseWorkingHours, setNurseWorkingHours] = useState('');

  // D. Pharmacist Fields
  const [pharmacyRegNo, setPharmacyRegNo] = useState('');
  const [pharmacyCouncil, setPharmacyCouncil] = useState('');
  const [pharmacyQualification, setPharmacyQualification] = useState('');
  const [pharmacyExpYears, setPharmacyExpYears] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyDepartment, setPharmacyDepartment] = useState('');
  const [pharmacyDesignation, setPharmacyDesignation] = useState('');
  const [pharmacyLicenseDetails, setPharmacyLicenseDetails] = useState('');
  const [pharmacyWorkingDays, setPharmacyWorkingDays] = useState('');
  const [pharmacyWorkingHours, setPharmacyWorkingHours] = useState('');

  // E. Caregiver Fields
  const [caregiverType, setCaregiverType] = useState('');
  const [caregiverQualification, setCaregiverQualification] = useState('');
  const [caregiverExpYears, setCaregiverExpYears] = useState('');
  const [caregiverOrg, setCaregiverOrg] = useState('');
  const [caregiverServiceType, setCaregiverServiceType] = useState('');
  const [caregiverAvailability, setCaregiverAvailability] = useState('');
  const [caregiverWorkingDays, setCaregiverWorkingDays] = useState('');
  const [caregiverWorkingHours, setCaregiverWorkingHours] = useState('');

  // F. Insurance / TPA Fields
  const [insuranceEmployeeId, setInsuranceEmployeeId] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [tpaName, setTpaName] = useState('');
  const [insuranceDesignation, setInsuranceDesignation] = useState('');
  const [insuranceDepartment, setInsuranceDepartment] = useState('');
  const [insuranceOfficeLocation, setInsuranceOfficeLocation] = useState('');
  const [insuranceProfEmail, setInsuranceProfEmail] = useState('');

  // G. Admin Fields
  const [adminEmployeeId, setAdminEmployeeId] = useState('');
  const [adminDepartment, setAdminDepartment] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('');

  // --- SECTION 4: ABHA & VERIFICATION ---
  const [abhaId, setAbhaId] = useState('');

  // --- SECTION 5: ACCOUNT SETTINGS ---
  const [temporaryPassword, setTemporaryPassword] = useState('Password@123');
  const [accountStatus, setAccountStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Auto-calculated Age from Date of Birth
  const calculatedAge = useMemo(() => {
    if (!dateOfBirth) return '';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    if (birthDate > today) return '';
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age >= 0 && age < 130) {
      return age.toString();
    }
    return '';
  }, [dateOfBirth]);

  // Auto-calculated BMI for Patient
  const calculatedBmi = useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  }, [heightCm, weightKg]);

  const resetForm = () => {
    setFullName('');
    setDateOfBirth('');
    setGender('');
    setBloodGroup('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setFamilyPhone('');
    setHeightCm('');
    setWeightKg('');
    setSystolicBp('');
    setDiastolicBp('');
    setHeartRate('');
    setTemperature('');
    setAllergies('');
    setMedicalRegNo('');
    setMedicalCouncil('');
    setDoctorQualification('');
    setDoctorSpecialization('');
    setDoctorExpYears('');
    setDoctorHospital('');
    setDoctorDepartment('');
    setDoctorDesignation('');
    setDoctorProfEmail('');
    setConsultationType('');
    setConsultationFee('');
    setDoctorWorkingDays('');
    setDoctorWorkingHours('');
    setNurseRegNo('');
    setNurseCouncil('');
    setNurseQualification('');
    setNurseSpecialization('');
    setNurseExpYears('');
    setNurseHospital('');
    setNurseDepartment('');
    setNurseDesignation('');
    setNurseShift('');
    setNurseWorkingDays('');
    setNurseWorkingHours('');
    setPharmacyRegNo('');
    setPharmacyCouncil('');
    setPharmacyQualification('');
    setPharmacyExpYears('');
    setPharmacyName('');
    setPharmacyDepartment('');
    setPharmacyDesignation('');
    setPharmacyLicenseDetails('');
    setPharmacyWorkingDays('');
    setPharmacyWorkingHours('');
    setCaregiverType('');
    setCaregiverQualification('');
    setCaregiverExpYears('');
    setCaregiverOrg('');
    setCaregiverServiceType('');
    setCaregiverAvailability('');
    setCaregiverWorkingDays('');
    setCaregiverWorkingHours('');
    setInsuranceEmployeeId('');
    setInsuranceCompany('');
    setTpaName('');
    setInsuranceDesignation('');
    setInsuranceDepartment('');
    setInsuranceOfficeLocation('');
    setInsuranceProfEmail('');
    setAdminEmployeeId('');
    setAdminDepartment('');
    setAdminDesignation('');
    setSelectedRole('');
    setAbhaId('');
    setTemporaryPassword('Password@123');
    setAccountStatus('ACTIVE');
    setErrorBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    // Basic Validation
    if (!selectedRole) {
      setErrorBanner('Please select a target system role.');
      return;
    }
    if (!fullName.trim()) {
      setErrorBanner('Full Legal Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorBanner('A valid Email Address is required.');
      return;
    }
    if (!temporaryPassword || temporaryPassword.length < 8) {
      setErrorBanner('Temporary password must be at least 8 characters long.');
      return;
    }

    if (selectedRole === 'Patient' && !consentAgreed) {
      setErrorBanner('Please confirm consent & healthcare protocol agreement for the patient.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dbRole = roleToDbMap[selectedRole] || 'PATIENT';

      const payload: Record<string, any> = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim() || undefined,
        password: temporaryPassword,
        role: dbRole,
        abhaId: abhaId.trim() || undefined,
        isActive: accountStatus === 'ACTIVE',
        gender,
        dateOfBirth: dateOfBirth || undefined,
        address: address.trim() || undefined,
        emergencyContactName: emergencyContactName.trim() || undefined,
        emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      };

      if (selectedRole === 'Patient') {
        payload.bloodGroup = bloodGroup;
        payload.familyPhone = familyPhone.trim() || undefined;
        payload.heightCm = heightCm ? parseFloat(heightCm) : undefined;
        payload.weightKg = weightKg ? parseFloat(weightKg) : undefined;
        payload.systolicBp = systolicBp ? parseInt(systolicBp, 10) : undefined;
        payload.diastolicBp = diastolicBp ? parseInt(diastolicBp, 10) : undefined;
        payload.heartRate = heartRate ? parseInt(heartRate, 10) : undefined;
        payload.temperature = temperature ? parseFloat(temperature) : undefined;
      } else if (selectedRole === 'Doctor') {
        payload.licenseNumber = medicalRegNo.trim() || undefined;
        payload.qualification = doctorQualification.trim() || undefined;
        payload.speciality = doctorSpecialization.trim() || 'General Medicine';
        payload.experienceYears = doctorExpYears ? parseInt(doctorExpYears, 10) : undefined;
        payload.hospital = doctorHospital.trim() || undefined;
        payload.consultationFee = consultationFee ? parseFloat(consultationFee) : 800;
        payload.about = `${doctorDesignation} in ${doctorDepartment}. ${consultationType}. Schedule: ${doctorWorkingDays} (${doctorWorkingHours}).`;
      } else if (selectedRole === 'Nurse') {
        payload.licenseNumber = nurseRegNo.trim() || undefined;
        payload.qualification = nurseQualification.trim() || undefined;
        payload.speciality = nurseSpecialization.trim() || undefined;
        payload.hospital = nurseHospital.trim() || undefined;
        payload.department = nurseDepartment.trim() || undefined;
      } else if (selectedRole === 'Pharmacist') {
        payload.licenseNumber = pharmacyRegNo.trim() || undefined;
        payload.qualification = pharmacyQualification.trim() || undefined;
        payload.pharmacyName = pharmacyName.trim() || undefined;
      } else if (selectedRole === 'Caregiver') {
        payload.relationship = caregiverType.trim() || 'Professional Caregiver';
        payload.qualification = caregiverQualification.trim() || undefined;
      } else if (selectedRole === 'Insurance') {
        payload.providerName = insuranceCompany.trim() || 'Insurance Provider';
        payload.licenseNumber = insuranceEmployeeId.trim() || undefined;
        payload.supportEmail = insuranceProfEmail.trim() || email.trim().toLowerCase();
        payload.supportPhone = phoneNumber.trim() || undefined;
      } else if (selectedRole === 'Admin') {
        payload.department = adminDepartment.trim() || 'System Administration';
      }

      await adminApi.createUser(payload);

      if (showToast) {
        showToast(`User ${fullName} created successfully as ${selectedRole} in MySQL database.`, 'success');
      }

      resetForm();
      onClose();
      onUserCreated();
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to create user. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-10 overflow-hidden"
        >
          {/* MODAL HEADER */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Create Role-Aware User Account
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {selectedRole ? (selectedRole === 'Insurance' ? 'Insurance / TPA' : selectedRole) : 'Select a Role'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Add user directly into MySQL database with complete role profile schema
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MODAL BODY (SCROLLABLE) */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Error Banner */}
            {errorBanner && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorBanner}</span>
              </motion.div>
            )}

            {/* TARGET SYSTEM ROLE SELECTOR */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target System Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as AdminRoleOption)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold ${!selectedRole ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'} focus:outline-none focus:border-blue-500 cursor-pointer appearance-none pr-10`}
                >
                  <option value="" disabled hidden>Select a system role</option>
                  <option value="">Select a system role</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Insurance">Insurance / TPA</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                <User className="w-4 h-4 text-blue-500" />
                <span>1. Personal Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'Doctor' ? 'e.g. Dr. Rajesh Varma' : selectedRole === 'Nurse' ? 'e.g. Nurse Sarah Jenkins' : 'e.g. Lalith Velarasi'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Date of Birth
                      </label>
                      {calculatedAge && (
                        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md font-mono border border-blue-500/20">
                          {calculatedAge} Yrs
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    {calculatedAge ? (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Age: <span className="text-slate-900 dark:text-white font-bold">{calculatedAge} years</span> (Auto-calculated)
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-1">Age will auto-calculate from birth date</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Gender</option>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedRole === 'Patient' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Blood Group <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Blood Group</option>
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Allergies & Pre-Existing Conditions <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin allergy, Asthma"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: CONTACT INFORMATION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>2. Contact Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@health.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Residential / Clinic Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 4B, Green Towers, Anna Salai, Guindy, Chennai - 600032"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Contact Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Ramesh Velarasi (Father)"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Contact Phone <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 98401 55667"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {selectedRole === 'Patient' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Family Connected Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    placeholder="+91 94441 82910"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* SECTION 3: ROLE-SPECIFIC PROFESSIONAL / CLINICAL INFORMATION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-purple-500" />
                <span>
                  3. {selectedRole === 'Patient' ? 'Clinical Health Baseline & Vitals' : `${selectedRole} Professional Credentials`}
                </span>
              </div>

              {/* 3A: PATIENT VITALS & PROTOCOL */}
              {selectedRole === 'Patient' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Height (cm) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="175"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="70"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Auto-Calculated BMI
                      </label>
                      <div className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center font-mono text-xs font-black text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
                        {calculatedBmi ? `${calculatedBmi} kg/m²` : '—'}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Blood Pressure (mmHg)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={systolicBp}
                          onChange={(e) => setSystolicBp(e.target.value)}
                          placeholder="120"
                          className="w-full h-10 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-none"
                        />
                        <span className="text-slate-400 font-bold">/</span>
                        <input
                          type="number"
                          value={diastolicBp}
                          onChange={(e) => setDiastolicBp(e.target.value)}
                          placeholder="80"
                          className="w-full h-10 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white text-center focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                        placeholder="74"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Body Temp (°F)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="98.6"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>Patient agrees to ABDM digital healthcare consent and clinical data governance protocols.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 3B: DOCTOR CREDENTIALS */}
              {selectedRole === 'Doctor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Medical Registration Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={medicalRegNo}
                        onChange={(e) => setMedicalRegNo(e.target.value)}
                        placeholder="e.g. TNMC-MED-84920"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Medical Registration Authority / Council
                      </label>
                      <input
                        type="text"
                        value={medicalCouncil}
                        onChange={(e) => setMedicalCouncil(e.target.value)}
                        placeholder="e.g. Tamil Nadu Medical Council / National Medical Commission"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Medical Qualification <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorQualification}
                        onChange={(e) => setDoctorQualification(e.target.value)}
                        placeholder="e.g. MBBS, MD (Internal Medicine)"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Clinical Specialization <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorSpecialization}
                        onChange={(e) => setDoctorSpecialization(e.target.value)}
                        placeholder="e.g. Cardiology, Neurology, General Practice"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={doctorExpYears}
                        onChange={(e) => setDoctorExpYears(e.target.value)}
                        placeholder="8"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hospital / Clinic Affiliation
                      </label>
                      <input
                        type="text"
                        value={doctorHospital}
                        onChange={(e) => setDoctorHospital(e.target.value)}
                        placeholder="e.g. Apollo Multi-Speciality Hospital, Chennai"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={doctorDepartment}
                        onChange={(e) => setDoctorDepartment(e.target.value)}
                        placeholder="e.g. Cardiology OPD"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={doctorDesignation}
                        onChange={(e) => setDoctorDesignation(e.target.value)}
                        placeholder="e.g. Senior Consultant"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="800"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Working Days & Schedule
                      </label>
                      <input
                        type="text"
                        value={doctorWorkingDays}
                        onChange={(e) => setDoctorWorkingDays(e.target.value)}
                        placeholder="Mon - Sat"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Consultation Working Hours
                      </label>
                      <input
                        type="text"
                        value={doctorWorkingHours}
                        onChange={(e) => setDoctorWorkingHours(e.target.value)}
                        placeholder="09:00 AM - 05:00 PM"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3C: NURSE CREDENTIALS */}
              {selectedRole === 'Nurse' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Nursing Registration Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nurseRegNo}
                        onChange={(e) => setNurseRegNo(e.target.value)}
                        placeholder="e.g. TNNMC-RN-99214"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Registration Council
                      </label>
                      <input
                        type="text"
                        value={nurseCouncil}
                        onChange={(e) => setNurseCouncil(e.target.value)}
                        placeholder="Tamil Nadu Nurses and Midwives Council"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Nursing Qualification <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nurseQualification}
                        onChange={(e) => setNurseQualification(e.target.value)}
                        placeholder="e.g. B.Sc. Nursing, GNM, RN"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Specialization / Clinical Focus
                      </label>
                      <input
                        type="text"
                        value={nurseSpecialization}
                        onChange={(e) => setNurseSpecialization(e.target.value)}
                        placeholder="e.g. Critical Care, Post-Op Care, Pediatrics"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={nurseExpYears}
                        onChange={(e) => setNurseExpYears(e.target.value)}
                        placeholder="5"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hospital / Nursing Station
                      </label>
                      <input
                        type="text"
                        value={nurseHospital}
                        onChange={(e) => setNurseHospital(e.target.value)}
                        placeholder="e.g. Apollo Central Hospital, Chennai"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={nurseDepartment}
                        onChange={(e) => setNurseDepartment(e.target.value)}
                        placeholder="e.g. Emergency & Triage"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={nurseDesignation}
                        onChange={(e) => setNurseDesignation(e.target.value)}
                        placeholder="e.g. Senior Registered Nurse"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Shift & Hours
                      </label>
                      <input
                        type="text"
                        value={nurseShift}
                        onChange={(e) => setNurseShift(e.target.value)}
                        placeholder="Day Shift (08:00 AM - 04:00 PM)"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3D: PHARMACIST CREDENTIALS */}
              {selectedRole === 'Pharmacist' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pharmacy Registration Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pharmacyRegNo}
                        onChange={(e) => setPharmacyRegNo(e.target.value)}
                        placeholder="e.g. PCI-TN-PH-49210"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pharmacy Council
                      </label>
                      <input
                        type="text"
                        value={pharmacyCouncil}
                        onChange={(e) => setPharmacyCouncil(e.target.value)}
                        placeholder="Pharmacy Council of India (PCI)"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pharmaceutical Qualification <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pharmacyQualification}
                        onChange={(e) => setPharmacyQualification(e.target.value)}
                        placeholder="e.g. B.Pharm / M.Pharm / Pharm.D"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pharmacy / Hospital Dispensary Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        placeholder="e.g. Apollo Central 24x7 Pharmacy"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={pharmacyExpYears}
                        onChange={(e) => setPharmacyExpYears(e.target.value)}
                        placeholder="4"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={pharmacyDepartment}
                        onChange={(e) => setPharmacyDepartment(e.target.value)}
                        placeholder="e.g. Outpatient Dispensary"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={pharmacyDesignation}
                        onChange={(e) => setPharmacyDesignation(e.target.value)}
                        placeholder="e.g. Registered Pharmacist"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3E: CAREGIVER CREDENTIALS */}
              {selectedRole === 'Caregiver' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Caregiver Type / Relationship <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={caregiverType}
                        onChange={(e) => setCaregiverType(e.target.value)}
                        placeholder="e.g. Professional Certified Caregiver, Family Guardian"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Qualification & Clinical Training
                      </label>
                      <input
                        type="text"
                        value={caregiverQualification}
                        onChange={(e) => setCaregiverQualification(e.target.value)}
                        placeholder="e.g. Certified Geriatric Care Assistant"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={caregiverExpYears}
                        onChange={(e) => setCaregiverExpYears(e.target.value)}
                        placeholder="3"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Healthcare Organization / Agency
                      </label>
                      <input
                        type="text"
                        value={caregiverOrg}
                        onChange={(e) => setCaregiverOrg(e.target.value)}
                        placeholder="e.g. Medicare Home Healthcare Services"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Caregiver Service Type
                      </label>
                      <input
                        type="text"
                        value={caregiverServiceType}
                        onChange={(e) => setCaregiverServiceType(e.target.value)}
                        placeholder="e.g. Elderly Care, Post-Op Rehabilitation"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Availability & Shift
                      </label>
                      <input
                        type="text"
                        value={caregiverAvailability}
                        onChange={(e) => setCaregiverAvailability(e.target.value)}
                        placeholder="e.g. Full-Time Day Shift (09:00 AM - 06:00 PM)"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3F: INSURANCE / TPA FIELDS */}
              {selectedRole === 'Insurance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Insurance Company / Provider <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={insuranceCompany}
                        onChange={(e) => setInsuranceCompany(e.target.value)}
                        placeholder="e.g. Star Health & Allied Insurance Co."
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        TPA Clearinghouse Name
                      </label>
                      <input
                        type="text"
                        value={tpaName}
                        onChange={(e) => setTpaName(e.target.value)}
                        placeholder="e.g. Medi Assist TPA Services"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Employee / Staff ID
                      </label>
                      <input
                        type="text"
                        value={insuranceEmployeeId}
                        onChange={(e) => setInsuranceEmployeeId(e.target.value)}
                        placeholder="e.g. IRDAI-EMP-7712"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={insuranceDesignation}
                        onChange={(e) => setInsuranceDesignation(e.target.value)}
                        placeholder="e.g. Senior Claims Officer"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={insuranceDepartment}
                        onChange={(e) => setInsuranceDepartment(e.target.value)}
                        placeholder="e.g. Health Pre-Authorizations"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Office Location / Branch
                    </label>
                    <input
                      type="text"
                      value={insuranceOfficeLocation}
                      onChange={(e) => setInsuranceOfficeLocation(e.target.value)}
                      placeholder="e.g. Nungambakkam, Chennai, Tamil Nadu"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 3G: ADMIN FIELDS */}
              {selectedRole === 'Admin' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Admin / Staff ID
                      </label>
                      <input
                        type="text"
                        value={adminEmployeeId}
                        onChange={(e) => setAdminEmployeeId(e.target.value)}
                        placeholder="e.g. ADM-9901"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Administrative Department
                      </label>
                      <input
                        type="text"
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value)}
                        placeholder="e.g. IT & Clinical Systems"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={adminDesignation}
                        onChange={(e) => setAdminDesignation(e.target.value)}
                        placeholder="e.g. Lead Administrator"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: ABHA & VERIFICATION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-cyan-500" />
                <span>4. ABHA & Digital Health Verification</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ABHA Health ID (Ayushman Bharat Digital Mission) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="e.g. 91-5467-1024-9988 or username@abdm"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  14-digit ABDM Health Number or registered ABHA Address for federated health record exchange.
                </p>
              </div>
            </div>

            {/* SECTION 5: ACCOUNT SETTINGS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>5. Account Security & Status</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Temporary Initial Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={temporaryPassword}
                    onChange={(e) => setTemporaryPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default is <span className="font-mono text-slate-600 dark:text-slate-300">Password@123</span>. User can change it after login.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Account Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={accountStatus}
                    onChange={(e) => setAccountStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE (Authorized for Immediate Login)</option>
                    <option value="INACTIVE">INACTIVE (Disabled)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER BUTTONS */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create {selectedRole} Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

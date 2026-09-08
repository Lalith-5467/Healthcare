import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  CalendarPlus, 
  Clock, 
  MapPin, 
  Star,
  Users,
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  X,
  Phone,
  ShieldCheck,
  ChevronDown,
  Heart,
  Droplets,
  Activity,
  ShieldAlert,
  Calendar,
  Building,
  User,
  AlertTriangle,
  Info,
  Sparkles,
  ClipboardList,
  Check
} from 'lucide-react';
import { useNurseWorkflow, type BookingStatus, type CareRequest } from '../../../utils/nurseWorkflowStorage';
import { clinicalApi } from '../../../services/dhrApis';

interface NurseBookingViewProps {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    age?: number;
    phone?: string;
    bloodGroup?: string;
    gender?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContact?: string;
    dateOfBirth?: string;
  };
}

export const ALL_HOME_CARE_SERVICES = [
  { id: 'post-surgery', title: 'Post-Surgery Care', desc: 'Surgical wound dressing, vitals monitoring, incision checks, and post-op medication admin.', icon: Stethoscope, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10', defaultCategory: 'Post-Surgical Recovery & Wound Care' },
  { id: 'elderly-assist', title: 'Elderly Assistance', desc: 'Daily living assistance, fall risk management, mobility support, and compassionate senior care.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', defaultCategory: 'Geriatric & Senior Wellness' },
  { id: 'newborn-care', title: 'Newborn Care', desc: 'Post-natal mother assistance, newborn hygiene, vitals check, and lactation/feeding support.', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', defaultCategory: 'Neonatal & Infant Health' },
  { id: 'iv-therapy', title: 'IV Therapy', desc: 'Sterile IV cannula setup, fluid hydration drips, and physician-prescribed infusion therapy.', icon: Droplets, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10', defaultCategory: 'Intravenous & Infusion Support' },
  { id: 'wound-dressing', title: 'Wound & Dressing Care', desc: 'Antiseptic debridement, sterile suture dressing, diabetic ulcer care, and burn management.', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10', defaultCategory: 'Advanced Wound Management' },
  { id: 'med-admin', title: 'Medication Administration', desc: 'Timely drug dispensing, adherence monitoring, nebulization, and complex prescription schedules.', icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/10', defaultCategory: 'Pharmacological Compliance' },
  { id: 'injection-vax', title: 'Injection / Vaccination Support', desc: 'Subcutaneous, intramuscular & intravenous injections, insulin administration, and home vaccines.', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/10', defaultCategory: 'Immunization & Injections' },
  { id: 'vital-signs', title: 'Vital Signs Monitoring', desc: 'Continuous blood pressure, SpO2, pulse, temperature, and blood glucose telemetry logs.', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10', defaultCategory: 'Cardiorespiratory Telemetry' },
  { id: 'chronic-care', title: 'Chronic Disease Care', desc: 'Long-term disease management for hypertension, COPD, kidney disorders, and heart failure.', icon: Heart, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10', defaultCategory: 'Chronic Disease Management' },
  { id: 'diabetes-care', title: 'Diabetes Care', desc: 'Capillary blood glucose testing, insulin titration support, foot ulcer inspection, and diet guidance.', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10', defaultCategory: 'Endocrine & Glycemic Control' },
  { id: 'catheter-care', title: 'Catheter Care', desc: 'Foley catheter insertion, bag replacement, bladder wash, and urinary hygiene maintenance.', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', defaultCategory: 'Urological Clinical Care' },
  { id: 'bedridden-care', title: 'Bedridden Patient Care', desc: 'Pressure ulcer prevention, 2-hourly position turning, sponge baths, and total bed care.', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', defaultCategory: 'Immobile Patient Nursing' },
  { id: 'physio-assist', title: 'Physiotherapy Assistance', desc: 'Bedside range-of-motion exercises, gait training, stroke recovery support, and mobility assistance.', icon: Activity, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/10', defaultCategory: 'Rehabilitation & Mobility' },
  { id: 'palliative-care', title: 'Palliative / Comfort Care', desc: 'Pain management support, symptom relief, emotional comfort, and dignified end-of-life care.', icon: Heart, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10', defaultCategory: 'Palliative & Comfort Nursing' },
  { id: 'maternal-care', title: 'Maternal & Postnatal Care', desc: 'Postpartum recovery, C-section incision care, breastfeeding support, and maternal vitals check.', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/10', defaultCategory: 'Maternal & Postnatal Health' },
  { id: 'night-nursing', title: 'Night Nursing Care', desc: 'Overnight vitals surveillance, nocturnal medication administration, and emergency overnight care.', icon: Clock, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', defaultCategory: 'Nocturnal Clinical Monitoring' },
];

export const NurseBookingView: React.FC<NurseBookingViewProps> = ({ user }) => {
  const { bookings, createBooking, updateBookingStatus, addNotification, refreshBookings } = useNurseWorkflow();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [myBookings, setMyBookings] = useState<CareRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form States
  // Section A: Care Service
  const [serviceType, setServiceType] = useState('Post-Surgery Care');
  const [careCategory, setCareCategory] = useState('Post-Surgical Recovery & Wound Care');

  // Section B: Patient Information (pre-populated from auth)
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [relationshipToPatient, setRelationshipToPatient] = useState('Self');

  // Section C: Care Schedule
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('4 Hours');
  const [bookingType, setBookingType] = useState<'One-time' | 'Recurring'>('One-time');
  const [repeatFrequency, setRepeatFrequency] = useState('Daily');
  const [endDate, setEndDate] = useState('');

  // Section D: Care Location
  const [address, setAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600001');
  const [locationType, setLocationType] = useState('Home');

  // Section E: Clinical Requirements
  const [conditionReason, setConditionReason] = useState('');
  const [mobilityStatus, setMobilityStatus] = useState('Needs Assistance');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalEquipment, setMedicalEquipment] = useState('Standard Nursing Kit');
  const [specialCareRequirements, setSpecialCareRequirements] = useState('');

  // Section F: Nurse Preference (Optional)
  const [nurseGenderPreference, setNurseGenderPreference] = useState('No Preference');
  const [preferredExperience, setPreferredExperience] = useState('General Home Care');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Section G: Emergency & Safety
  const [emergencyContactName, setEmergencyContactName] = useState(user?.emergencyContactName || 'Primary Emergency Contact');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user?.emergencyContactPhone || user?.emergencyContact || user?.phone || '');
  const [emergencyInstructions, setEmergencyInstructions] = useState('');

  // Section H: Additional Information
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Calculate patient age
  const calculatedAge = user?.age || (user?.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()) : 34);

  // Sync patient info when user changes
  useEffect(() => {
    if (user) {
      if (user.phone && !patientPhone) setPatientPhone(user.phone);
      if (user.address && !address) setAddress(user.address);
      if (user.emergencyContactName && !emergencyContactName) setEmergencyContactName(user.emergencyContactName);
      if ((user.emergencyContactPhone || user.emergencyContact) && !emergencyContactPhone) {
        setEmergencyContactPhone(user.emergencyContactPhone || user.emergencyContact || '');
      }
    }
  }, [user]);

  // Fetch patient's own bookings from backend
  const loadMyBookings = async () => {
    try {
      const res = await clinicalApi.getMyCareRequests();
      if (res && res.data && Array.isArray(res.data)) {
        setMyBookings(res.data);
      } else {
        // Filter local bookings for this patient
        const currentPatientName = user?.name || 'Lalith Velarasi';
        const filtered = bookings.filter(b => b.patientName.toLowerCase().includes(currentPatientName.toLowerCase()) || b.patientUserId === user?.id);
        setMyBookings(filtered.length > 0 ? filtered : bookings.slice(0, 2));
      }
    } catch {
      const currentPatientName = user?.name || 'Lalith Velarasi';
      const filtered = bookings.filter(b => b.patientName.toLowerCase().includes(currentPatientName.toLowerCase()) || b.patientUserId === user?.id);
      setMyBookings(filtered);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, [bookings, user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectServiceCard = (service: typeof ALL_HOME_CARE_SERVICES[0]) => {
    setServiceType(service.title);
    setCareCategory(service.defaultCategory);
    setIsBookingModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!serviceType) errs.serviceType = 'Please select a care service';
    if (!startDate) {
      errs.startDate = 'Start date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(startDate);
      if (selected < today) {
        errs.startDate = 'Start date cannot be in the past';
      }
    }

    if (!startTime) errs.startTime = 'Start time is required';
    if (!address.trim()) errs.address = 'Full care address is required';
    if (pincode && !/^\d{6}$/.test(pincode.trim())) errs.pincode = 'PIN Code must be a 6-digit number';
    if (!conditionReason.trim()) errs.conditionReason = 'Please specify reason for care or current condition';
    if (!emergencyContactName.trim()) errs.emergencyContactName = 'Emergency contact name is required';
    
    if (emergencyContactPhone && !/^[0-9+ \-()]{7,15}$/.test(emergencyContactPhone.trim())) {
      errs.emergencyContactPhone = 'Please enter a valid emergency phone number';
    }

    if (patientPhone && !/^[0-9+ \-()]{7,15}$/.test(patientPhone.trim())) {
      errs.patientPhone = 'Please enter a valid patient phone number';
    }

    if (bookingType === 'Recurring') {
      if (!endDate) {
        errs.endDate = 'End date is required for recurring bookings';
      } else if (new Date(endDate) <= new Date(startDate)) {
        errs.endDate = 'End date must be after start date';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('⚠️ Please correct the highlighted errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    const requestPayload = {
      serviceType,
      careCategory,
      scheduledDate: startDate || new Date().toISOString(),
      scheduledTime: startTime || '10:00 AM',
      duration,
      bookingType,
      repeatFrequency: bookingType === 'Recurring' ? repeatFrequency : null,
      endDate: bookingType === 'Recurring' ? endDate : null,
      location: address.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      locationType,
      conditionReason: conditionReason.trim(),
      mobilityStatus,
      currentMedications: currentMedications.trim(),
      allergies: allergies.trim() || 'None reported',
      medicalEquipment: medicalEquipment.trim(),
      specialCareRequirements: specialCareRequirements.trim(),
      nurseGenderPreference,
      preferredExperience,
      preferredLanguage,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyInstructions: emergencyInstructions.trim(),
      specialInstructions: specialInstructions.trim(),
      additionalNotes: additionalNotes.trim(),
      patientPhone: patientPhone.trim() || user?.phone || '',
      instructions: `${conditionReason.trim()}${specialInstructions.trim() ? `. Special: ${specialInstructions.trim()}` : ''}`,
    };

    try {
      const res = await clinicalApi.createNurseCareRequest(requestPayload);

      if (res && res.data) {
        addNotification(`New care request from ${res.data.patientName} for ${res.data.serviceType}.`, 'info');
        const current = JSON.parse(localStorage.getItem('medicare_nurse_bookings_v2') || '[]');
        const updated = [res.data, ...current.filter((b: any) => b.id !== res.data.id)];
        localStorage.setItem('medicare_nurse_bookings_v2', JSON.stringify(updated));
        window.dispatchEvent(new Event('medicare_sync_nurse'));
      } else {
        createBooking({
          patientName: user?.name || 'Lalith Velarasi',
          patientAge: `${calculatedAge} Years`,
          patientPhone: patientPhone.trim() || user?.phone || '+91 98765 43210',
          serviceType: serviceType,
          prefDate: startDate || 'Today',
          time: startTime || '10:00 AM',
          location: `${address.trim()}${city ? `, ${city}` : ''}`,
          instructions: `${conditionReason.trim()}${specialInstructions.trim() ? `. ${specialInstructions.trim()}` : ''}`
        });
      }

      await loadMyBookings();
      setIsBookingModalOpen(false);
      showToast('✓ Home care request submitted successfully! A certified nurse will review your request.');
      
      // Reset non-demographic fields
      setConditionReason('');
      setSpecialInstructions('');
      setAdditionalNotes('');
      setStartDate('');
    } catch {
      createBooking({
        patientName: user?.name || 'Lalith Velarasi',
        patientAge: `${calculatedAge} Years`,
        patientPhone: patientPhone.trim() || user?.phone || '+91 98765 43210',
        serviceType: serviceType,
        prefDate: startDate || 'Today',
        time: startTime || '10:00 AM',
        location: `${address.trim()}${city ? `, ${city}` : ''}`,
        instructions: `${conditionReason.trim()}${specialInstructions.trim() ? `. ${specialInstructions.trim()}` : ''}`
      });
      await loadMyBookings();
      setIsBookingModalOpen(false);
      showToast('✓ Home care request recorded!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = (id: string) => {
    updateBookingStatus(id, 'Cancelled');
    showToast('Booking cancelled successfully.');
    loadMyBookings();
  };

  const getTimelineStep = (status: BookingStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Scheduled': return 2;
      case 'On the Way': return 3;
      case 'Arrived': return 4;
      case 'Care in Progress': return 5;
      case 'Completed': return 6;
      default: return 0;
    }
  };

  const renderTimeline = (status: BookingStatus) => {
    const steps = ['Requested', 'Accepted', 'Scheduled', 'En Route', 'Arrived', 'Care Active'];
    const currentStep = getTimelineStep(status);

    return (
      <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
        <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wider flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-rose-500" /> Live Visit Tracking
        </h4>
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-2.5 relative z-10">
            {steps.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isPast ? 'bg-emerald-500 border-emerald-500' : 
                    isCurrent ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]' : 
                    'bg-slate-200 border-slate-200 dark:bg-slate-700 dark:border-slate-700'
                  }`}>
                    {isPast && <Check className="w-2.5 h-2.5 text-white" />}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                  </div>
                  <span className={`text-[11px] font-bold ${
                    isPast ? 'text-emerald-600 dark:text-emerald-400' :
                    isCurrent ? 'text-slate-900 dark:text-white' :
                    'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const activeMyBookings = myBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled' && b.status !== 'Rejected');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto space-y-6 font-sans pb-16 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 text-white text-xs ${
              toastMessage.includes('cancelled') || toastMessage.includes('⚠️') ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/5 dark:bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-800/10 rounded-2xl border border-rose-100 dark:border-rose-800/30 items-center justify-center">
            <Stethoscope className="w-8 h-8 text-rose-600 dark:text-rose-400 drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-widest text-rose-500 dark:text-rose-400 uppercase">
                CLINICAL HOME CARE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Active Patient: {user?.name || 'Lalith Velarasi'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              In-Home Nurse & Care Booking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Request hospital-certified nurses for post-op recovery, infusions, vital telemetry & chronic care at home.
            </p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsBookingModalOpen(true)}
          className="relative group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-rose-500/25 border border-rose-400/50 w-full sm:w-auto justify-center z-10 cursor-pointer text-xs"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Request Home Care</span>
        </motion.button>
      </motion.div>

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Active Bookings', value: activeMyBookings.length.toString(), icon: CalendarPlus, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/10' },
          { label: 'Home Care Services', value: ALL_HOME_CARE_SERVICES.length.toString(), icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Certified Staff', value: '100% RN', icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Emergency Protocol', value: '24/7 Live', icon: Heart, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT: LIVE TRACKING + EXPANDED SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: LIVE BOOKINGS & TRACKING (1 Col) */}
        <section className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              Live Bookings & Tracking
            </h2>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {activeMyBookings.length} Active
            </span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {activeMyBookings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
                  <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                    <CalendarPlus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Active Home Care Bookings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a service on the right to schedule a certified home nurse.
                  </p>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="mt-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    + Book New Service
                  </button>
                </div>
              ) : (
                activeMyBookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                    
                    <div className="flex justify-between items-start pl-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                            {booking.serviceType}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm">
                          {booking.nurseName || 'Awaiting Nurse Review'}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Req ID: {booking.id}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${
                        booking.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400' :
                        booking.status === 'Accepted' || booking.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400' :
                        booking.status === 'Care in Progress' || booking.status === 'On the Way' || booking.status === 'Arrived' ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400' :
                        'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 ml-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{booking.prefDate} at {booking.time} ({booking.duration || '4 Hours'})</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                      {booking.otpPin && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                          <span className="text-slate-500">Doorstep Auth PIN:</span>
                          <span className="font-mono font-black text-rose-600">{booking.otpPin}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pl-2">
                      {renderTimeline(booking.status)}
                    </div>
                    
                    <div className="pl-2 pt-1 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400">
                        Patient: <strong>{booking.patientName}</strong>
                      </span>
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase transition-colors"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
        
        {/* RIGHT COLUMN: ALL 16 EXPANDED HOME CARE SERVICES (2 Cols) */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              Available Home Nursing Services ({ALL_HOME_CARE_SERVICES.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Click any service to configure and book
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ALL_HOME_CARE_SERVICES.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => handleSelectServiceCard(service)}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all cursor-pointer hover:border-rose-300 dark:hover:border-rose-700/50 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${service.bg} ${service.color}`}>
                      <service.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Book Now <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Certified RN Visit</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Available Today</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. PROFESSIONAL MULTI-SECTION REQUEST HOME CARE MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col font-sans"
            >
              {/* MODAL HEADER */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <CalendarPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      Request In-Home Nursing Care
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fill out the clinical request. Authenticated Patient: <strong className="text-slate-700 dark:text-slate-200">{user?.name || 'Lalith Velarasi'}</strong>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* MODAL BODY (SCROLLABLE) */}
              <form onSubmit={handleBookService} className="p-6 overflow-y-auto space-y-6 text-xs">
                
                {/* SECTION A: CARE SERVICE */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5" /> Section A: Care Service
                    </h3>
                    <span className="text-[10px] text-slate-400">* Required Fields</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Service Type <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={serviceType}
                        onChange={(e) => {
                          setServiceType(e.target.value);
                          const match = ALL_HOME_CARE_SERVICES.find(s => s.title === e.target.value);
                          if (match) setCareCategory(match.defaultCategory);
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 font-bold dark:text-white"
                      >
                        {ALL_HOME_CARE_SERVICES.map(s => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                      {errors.serviceType && <p className="text-rose-500 text-[10px]">{errors.serviceType}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Care Category / Patient Need <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={careCategory}
                        onChange={(e) => setCareCategory(e.target.value)}
                        placeholder="e.g. Post-Surgical Recovery & Wound Care"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 font-medium dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION B: PATIENT INFORMATION (AUTHENTICATED IDENTITY) */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Section B: Patient Information (Authenticated Account)
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Patient Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Patient Full Name</label>
                      <input 
                        type="text" 
                        value={user?.name || 'Lalith Velarasi'} 
                        readOnly 
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Calculated Age & Gender</label>
                      <input 
                        type="text" 
                        value={`${calculatedAge} Years • ${user?.gender || 'Male'}`} 
                        readOnly 
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">
                        Patient Phone <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white" 
                        required
                      />
                      {errors.patientPhone && <p className="text-rose-500 text-[10px]">{errors.patientPhone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Relationship to Patient</label>
                      <select
                        value={relationshipToPatient}
                        onChange={(e) => setRelationshipToPatient(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="Self">Self</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Emergency Contact Name</label>
                      <input 
                        type="text" 
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="Emergency Contact Name"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Emergency Contact Phone</label>
                      <input 
                        type="text" 
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION C: CARE SCHEDULE */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <h3 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Section C: Care Schedule & Duration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Start Date <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="date" 
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-rose-500 font-bold dark:text-white" 
                        required 
                      />
                      {errors.startDate && <p className="text-rose-500 text-[10px]">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Start Time <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="08:00 AM">08:00 AM (Morning)</option>
                        <option value="10:00 AM">10:00 AM (Day)</option>
                        <option value="12:00 PM">12:00 PM (Noon)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="04:00 PM">04:00 PM (Evening)</option>
                        <option value="06:00 PM">06:00 PM (Evening)</option>
                        <option value="08:00 PM">08:00 PM (Night)</option>
                        <option value="10:00 PM">10:00 PM (Night Shift)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Expected Duration <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="2 Hours">2 Hours (Quick Procedure)</option>
                        <option value="4 Hours">4 Hours (Half Day)</option>
                        <option value="8 Hours">8 Hours (Full Shift)</option>
                        <option value="12 Hours">12 Hours (Day/Night Shift)</option>
                        <option value="24 Hours">24 Hours (Full-Time In-Home)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Booking Type <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="One-time">One-time Visit</option>
                        <option value="Recurring">Recurring Care</option>
                      </select>
                    </div>
                  </div>

                  {bookingType === 'Recurring' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Repeat Frequency</label>
                        <select 
                          value={repeatFrequency}
                          onChange={(e) => setRepeatFrequency(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Alternate Days">Alternate Days</option>
                          <option value="Custom">Custom Schedule</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Recurring End Date <span className="text-rose-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          value={endDate}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                          required={bookingType === 'Recurring'}
                        />
                        {errors.endDate && <p className="text-rose-500 text-[10px]">{errors.endDate}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION D: CARE LOCATION */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <h3 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Section D: Care Location & Landmark
                  </h3>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Full Care Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      rows={2} 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Door No, Street Name, Apartment Name..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-medium dark:text-white resize-none"
                      required
                    />
                    {errors.address && <p className="text-rose-500 text-[10px]">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Landmark</label>
                      <input 
                        type="text" 
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Metro / School"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Chennai"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">PIN Code</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="600001"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold dark:text-white"
                      />
                      {errors.pincode && <p className="text-rose-500 text-[10px]">{errors.pincode}</p>}
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Location Type</label>
                      <select 
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="Home">Home / House</option>
                        <option value="Apartment">Apartment / Gated Community</option>
                        <option value="Assisted Living">Assisted Living</option>
                        <option value="Other">Other Location</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION E: CLINICAL REQUIREMENTS */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <h3 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Section E: Clinical Requirements & Reason for Care
                  </h3>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Current Condition / Reason for Care <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      rows={2} 
                      value={conditionReason}
                      onChange={(e) => setConditionReason(e.target.value)}
                      placeholder="Describe symptoms, recent surgery, doctor prescriptions, or care requirements..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-medium dark:text-white resize-none"
                      required
                    />
                    {errors.conditionReason && <p className="text-rose-500 text-[10px]">{errors.conditionReason}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Mobility Status</label>
                      <select 
                        value={mobilityStatus}
                        onChange={(e) => setMobilityStatus(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold dark:text-white"
                      >
                        <option value="Independent">Independent</option>
                        <option value="Needs Assistance">Needs Assistance</option>
                        <option value="Bedridden">Bedridden</option>
                        <option value="Wheelchair">Wheelchair Bound</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Known Allergies</label>
                      <input 
                        type="text" 
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Penicillin, Latex, None"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Required Medical Equipment</label>
                      <input 
                        type="text" 
                        value={medicalEquipment}
                        onChange={(e) => setMedicalEquipment(e.target.value)}
                        placeholder="e.g. BP Monitor, IV Stand, Suction"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Current Medications & Special Requirements</label>
                    <input 
                      type="text" 
                      value={currentMedications}
                      onChange={(e) => setCurrentMedications(e.target.value)}
                      placeholder="e.g. Metformin 500mg, Amoxicillin 625mg twice daily"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-medium dark:text-white"
                    />
                  </div>
                </div>

                {/* SECTION F: NURSE PREFERENCE (OPTIONAL) */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Section F: Nurse Preference (Optional)
                    </h3>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Nurse Gender Preference</label>
                      <select 
                        value={nurseGenderPreference}
                        onChange={(e) => setNurseGenderPreference(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Female">Female Nurse</option>
                        <option value="Male">Male Nurse</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Experience</label>
                      <select 
                        value={preferredExperience}
                        onChange={(e) => setPreferredExperience(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      >
                        <option value="General Home Care">General Home Care</option>
                        <option value="Elderly Care">Elderly Care</option>
                        <option value="Pediatric / Newborn Care">Pediatric / Newborn Care</option>
                        <option value="Post-Surgery Care">Post-Surgery Care</option>
                        <option value="Critical Care Experience">Critical Care Experience</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Language</label>
                      <select 
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium dark:text-white"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Kannada">Kannada</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION G: EMERGENCY & SAFETY INSTRUCTIONS */}
                <div className="space-y-3 p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                  <h3 className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Section G: Emergency & Safety Instructions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Emergency Contact <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="Emergency Contact Name"
                        className="w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3 py-2 font-medium dark:text-white"
                        required
                      />
                      {errors.emergencyContactName && <p className="text-rose-500 text-[10px]">{errors.emergencyContactName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Emergency Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3 py-2 font-medium dark:text-white"
                        required
                      />
                      {errors.emergencyContactPhone && <p className="text-rose-500 text-[10px]">{errors.emergencyContactPhone}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Emergency Protocol & Critical Warnings</label>
                    <input 
                      type="text" 
                      value={emergencyInstructions}
                      onChange={(e) => setEmergencyInstructions(e.target.value)}
                      placeholder="e.g. In case of blood pressure drop, administer emergency saline and call Dr. Rajesh immediately"
                      className="w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-xl px-3.5 py-2 font-medium dark:text-white"
                    />
                  </div>
                </div>

                {/* SECTION H: ADDITIONAL INFORMATION */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <h3 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" /> Section H: Additional Notes & Instructions
                  </h3>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Special Instructions for Attending Nurse</label>
                    <textarea 
                      rows={2} 
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Patient has sensitive skin around incision; please use silicone dressing tape..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-medium dark:text-white resize-none"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/25 border border-rose-400/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <CalendarPlus className="w-5 h-5" />
                        <span>Confirm Home Care Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    By submitting, your request will be securely dispatched to the Hospital Nurse Station with ABDM compliance.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

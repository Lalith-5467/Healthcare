import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Info, 
  FileText, 
  CheckCircle,
  Stethoscope,
  Building2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { addHomeCareBooking, type DemoHomeCareBooking } from '../../mocks/caregiverHomeCareMock';
import { showGlobalToast } from '../common/GlobalToastManager';
import { globalNotificationService } from '../../services/globalNotificationService';

interface CaregiverBookingViewProps {
  user?: {
    name?: string;
    email?: string;
    address?: string;
  };
  onNavigate?: (navId: string) => void;
}

const DEPENDENT_OPTIONS = [
  { id: 'ward-1', name: 'Arun Raj', relationship: 'Father', age: 68, address: 'Flat 4B, Emerald Heights, T. Nagar, Chennai - 600017' },
  { id: 'ward-2', name: 'Priya Raj (Meena Kumar)', relationship: 'Mother', age: 64, address: 'No. 12, Rose Garden, Indiranagar, Bengaluru - 560038' },
  { id: 'ward-3', name: 'Karthik Raj', relationship: 'Child / Son', age: 12, address: 'House 88, Lake View Appts, Jubilee Hills, Hyderabad - 500033' },
  { id: 'ward-4', name: 'Meena Raj', relationship: 'Spouse', age: 62, address: 'Block C, Senior Paradise, Adyar, Chennai - 600020' },
];

const SERVICE_OPTIONS = [
  {
    id: 'geriatric',
    title: 'Geriatric Hygiene & Medication Support',
    serviceType: 'Routine Personal Care & Bedside Care',
    specialization: 'Geriatric Memory Care & Personal Hygiene',
    role: 'Caregiver' as const,
    description: 'Bedside hygiene, bathing assistance, pill timing setup, and mobility aid.',
    icon: HeartHandshake,
    estPrice: '₹450 / Visit'
  },
  {
    id: 'wound-dressing',
    title: 'Post-Op Wound Care & Vital Telemetry',
    serviceType: 'Daily Wound Care & Vital Telemetry Check',
    specialization: 'Post-op Wound Dressing & BP Monitoring',
    role: 'Nurse' as const,
    description: 'Sterile dressing change, BP, sugar & SpO2 telemetry monitoring by registered nurse.',
    icon: Stethoscope,
    estPrice: '₹750 / Visit'
  },
  {
    id: 'med-assist',
    title: 'Cognitive Assistance & Pill Setup',
    serviceType: 'Cognitive Assistance & Pill Setup',
    specialization: 'Geriatric Memory Care & Medication Assist',
    role: 'Nurse' as const,
    description: 'Daily medication organizer setup, cognitive exercises, and doctor prescription sync.',
    icon: FileText,
    estPrice: '₹600 / Visit'
  },
  {
    id: 'mobility',
    title: 'Senior Mobility & Physiotherapy Support',
    serviceType: 'Evening Assisted Walking & Mobility Exercise',
    specialization: 'Senior Mobility & Physiotherapy Support',
    role: 'Home Care Assistant' as const,
    description: 'Assisted walking, joint movement exercises, stair practice, and fall prevention.',
    icon: User,
    estPrice: '₹500 / Visit'
  },
  {
    id: 'physio',
    title: 'Hot Compress & Joint Pain Management',
    serviceType: 'Hot Compress Therapy & Pain Management',
    specialization: 'Rheumatology & Joint Pain Care',
    role: 'Nurse' as const,
    description: 'Therapeutic heat compress, joint pain massage, and prescribed exercise routine.',
    icon: ActivityIcon,
    estPrice: '₹650 / Visit'
  }
];

function ActivityIcon(props: any) {
  return (
    <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

export const CaregiverBookingView: React.FC<CaregiverBookingViewProps> = ({ user, onNavigate }) => {
  const { t } = useLanguage();

  // Form State
  const [selectedDependentId, setSelectedDependentId] = useState<string>('ward-1');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('geriatric');
  const [roleOverride, setRoleOverride] = useState<'Nurse' | 'Caregiver' | 'Home Care Assistant'>('Nurse');
  const [bookingDate, setBookingDate] = useState<string>('Today');
  const [bookingTime, setBookingTime] = useState<string>('05:30 PM');
  const [duration, setDuration] = useState<string>('1 Hour');
  const [address, setAddress] = useState<string>(
    user?.address || 'Flat 4B, Emerald Heights, T. Nagar, Chennai - 600017'
  );
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<DemoHomeCareBooking | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedDependent = DEPENDENT_OPTIONS.find(d => d.id === selectedDependentId) || DEPENDENT_OPTIONS[0];
  const selectedService = SERVICE_OPTIONS.find(s => s.id === selectedServiceId) || SERVICE_OPTIONS[0];

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!selectedDependentId) errs.dependent = t('caregiver.booking.err_dependent', 'Please select a dependent or family member.');
    if (!selectedServiceId) errs.service = t('caregiver.booking.err_service', 'Please select a care service type.');
    if (!roleOverride) errs.role = t('caregiver.booking.err_role', 'Please select a professional role.');
    if (!bookingDate) errs.date = t('caregiver.booking.err_date', 'Please specify the visit date.');
    if (!bookingTime) errs.time = t('caregiver.booking.err_time', 'Please select the visit time.');
    if (!duration) errs.duration = t('caregiver.booking.err_duration', 'Please specify the visit duration.');
    if (!address.trim()) errs.address = t('caregiver.booking.err_address', 'Please provide a valid home address.');

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      showGlobalToast('Please fill in all required booking details.', 'error');
      return;
    }

    setIsSubmitting(true);

    const professionalNames: Record<string, string> = {
      'Nurse': 'Nurse Sarah Jenkins',
      'Caregiver': 'Rajesh Kumar (Certified Caregiver)',
      'Home Care Assistant': 'Priya Sharma (Home Care Assistant)'
    };

    const newBooking: DemoHomeCareBooking = {
      bookingId: `hc-user-${Date.now()}`,
      dependentId: selectedDependent.id,
      dependentName: selectedDependent.name,
      careProfessionalName: professionalNames[roleOverride] || 'Nurse Sarah Jenkins',
      role: roleOverride,
      specialization: selectedService.specialization,
      serviceType: selectedService.serviceType,
      bookingDate: bookingDate === 'Today' ? 'Today' : bookingDate === 'Tomorrow' ? 'Tomorrow' : bookingDate,
      bookingTime,
      duration,
      status: 'Requested',
      address: address.trim() || selectedDependent.address,
      notes: notes.trim() || 'Patient booked home-care session via Patient Portal.',
      rawTimestamp: Date.now() + 1800000
    };

    // Store in caregiver mock & trigger notifications + sync
    addHomeCareBooking(newBooking);

    // Dispatch Global Notification & Voice for Patient
    globalNotificationService.dispatchNotification({
      id: `patient-booking-${Date.now()}`,
      recipientRole: 'PATIENT',
      title: 'Home Care Visit Requested',
      message: `In-home ${newBooking.serviceType} visit booked for ${newBooking.dependentName} on ${newBooking.bookingDate} at ${newBooking.bookingTime}.`,
      voiceText: `Your home care visit for ${newBooking.dependentName} has been booked for ${newBooking.bookingDate} at ${newBooking.bookingTime}.`,
      type: 'Nurse Booking',
      timestamp: 'Just now',
      read: false
    });

    // Dispatch Global Notification & Voice for Caregiver / Nurse
    globalNotificationService.dispatchNotification({
      id: `caregiver-booking-${Date.now()}`,
      recipientRole: 'CAREGIVER',
      dependentId: selectedDependent.id,
      wardName: selectedDependent.name,
      title: 'New Home Care Booking Requested',
      message: `Home care visit for ${newBooking.serviceType} booked for ${newBooking.bookingDate} at ${newBooking.bookingTime}.`,
      voiceText: `New home care visit requested for ${selectedDependent.name} on ${newBooking.bookingDate} at ${newBooking.bookingTime}.`,
      type: 'Nurse Booking',
      timestamp: 'Just now',
      read: false,
      relatedRoute: 'home-care'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      showGlobalToast(
        `🚨 In-Home ${roleOverride} Visit Booked for ${selectedDependent.name}! Caregiver notification dispatched.`,
        'success'
      );
    }, 600);
  };

  return (
    <div className="space-y-6 select-none pb-16">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50/80 via-white to-cyan-50/80 dark:from-[#0b1b36] dark:via-[#092b49] dark:to-[#041a2e] p-6 sm:p-8 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-black uppercase tracking-wider mb-2 border border-teal-500/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t('caregiver.booking.badge', 'Patient & Family Healthcare')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('caregiver.booking.title', 'Book In-Home Caregiver & Nurse Visit')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed mt-1">
              {t('caregiver.booking.subtitle', 'Schedule certified home-care nurses, geriatric caregivers, and physiotherapy assistants for yourself or family members.')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-cyan-300 font-extrabold text-xs border border-teal-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>{t('caregiver.booking.abdm_verified', 'ABDM Verified Care Network')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DRAWER / SUCCESS CARD */}
      <AnimatePresence>
        {confirmedBooking && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                    {t('caregiver.booking.success_title', 'In-Home Care Visit Requested Successfully!')}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    {t('caregiver.booking.booking_id', 'Booking ID:')} <strong className="font-mono">{confirmedBooking.bookingId}</strong> • {t('caregiver.booking.status', 'Status:')} <span className="uppercase font-black">{confirmedBooking.status}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              >
                {t('caregiver.booking.book_another', 'Book Another Visit')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium border-t border-emerald-200/60 dark:border-emerald-800/60">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{t('caregiver.booking.dependent', 'Dependent')}:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{confirmedBooking.dependentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{t('caregiver.booking.assigned_role', 'Assigned Professional')}:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{confirmedBooking.careProfessionalName} ({confirmedBooking.role})</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">{t('caregiver.booking.visit_schedule', 'Visit Schedule')}:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{confirmedBooking.bookingDate} • {confirmedBooking.bookingTime} ({confirmedBooking.duration})</strong>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Caregiver notification dispatched to active portal guardian popover.</span>
              </span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Go to Overview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN FORM GRID */}
      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 7 COLS: STEP FORM SECTIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: SELECT DEPENDENT */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span>1. {t('caregiver.booking.step_dependent', 'Select Dependent / Family Member')}</span>
              </h3>
              {errors.dependent && (
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.dependent}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEPENDENT_OPTIONS.map((dep) => {
                const isSelected = dep.id === selectedDependentId;
                return (
                  <div
                    key={dep.id}
                    onClick={() => {
                      setSelectedDependentId(dep.id);
                      setAddress(dep.address);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-cyan-950/40 border-teal-500 dark:border-cyan-400 ring-2 ring-teal-500/20 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                        {dep.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {dep.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                          {dep.relationship} • {dep.age} yrs
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECT CAREGIVER SERVICE TYPE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-cyan-500" />
                <span>2. {t('caregiver.booking.step_service', 'Select Caregiver Service Type')}</span>
              </h3>
            </div>

            <div className="space-y-3">
              {SERVICE_OPTIONS.map((srv) => {
                const isSelected = srv.id === selectedServiceId;
                const Icon = srv.icon;
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setRoleOverride(srv.role);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/20 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {srv.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {srv.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        {srv.estPrice}
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Covered
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CARE PROFESSIONAL ROLE & SCHEDULE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>3. {t('caregiver.booking.step_schedule', 'Role, Date & Visit Duration')}</span>
            </h3>

            {/* Role Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {t('caregiver.booking.professional_role', 'Care Professional Category')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Nurse', 'Caregiver', 'Home Care Assistant'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleOverride(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                      roleOverride === r
                        ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Date, Time, Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('caregiver.booking.visit_date', 'Visit Date')}
                </label>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white"
                >
                  <option value="Today">Today (Immediate)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="22 Sep 2026">22 Sep 2026</option>
                  <option value="23 Sep 2026">23 Sep 2026</option>
                  <option value="25 Sep 2026">25 Sep 2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('caregiver.booking.visit_time', 'Visit Time')}
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white"
                >
                  <option value="08:00 AM">08:00 AM (Morning)</option>
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Noon)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="05:30 PM">05:30 PM (Evening)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('caregiver.booking.duration', 'Duration')}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white"
                >
                  <option value="1 Hour">1 Hour (Quick Visit)</option>
                  <option value="2 Hours">2 Hours (Standard Visit)</option>
                  <option value="Half Day">Half Day (4 Hours)</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 4: HOME ADDRESS & SPECIAL INSTRUCTIONS */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>4. {t('caregiver.booking.step_location', 'Home Address & Care Instructions')}</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('caregiver.booking.home_address', 'Patient Home Address')}
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street Name, Landmark, City & Pincode..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-900 dark:text-white"
              />
              {errors.address && (
                <span className="text-[11px] text-rose-500 font-bold mt-1 block">{errors.address}</span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t('caregiver.booking.special_notes', 'Special Instructions for Professional (Optional)')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Check fasting sugar before insulin, knee brace required during walking practice..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

        </div>

        {/* RIGHT 5 COLS: LIVE BOOKING SUMMARY CARD & CONFIRM BUTTON */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>{t('caregiver.booking.summary_title', 'In-Home Booking Summary')}</span>
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {t('caregiver.booking.requested_badge', 'Requested')}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-slate-400">{t('caregiver.booking.target_dependent', 'Target Dependent')}:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedDependent.name} ({selectedDependent.relationship})</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-slate-400">{t('caregiver.booking.selected_service', 'Selected Service')}:</span>
                <span className="font-extrabold text-slate-900 dark:text-white max-w-[180px] truncate text-right">{selectedService.title}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-slate-400">{t('caregiver.booking.professional_role', 'Role')}:</span>
                <span className="font-black text-cyan-600 dark:text-cyan-400">{roleOverride}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-slate-400">{t('caregiver.booking.time_slot', 'Time Slot')}:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{bookingDate} • {bookingTime}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span className="text-slate-400">{t('caregiver.booking.duration_label', 'Duration')}:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{duration}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
              <p className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span>{t('caregiver.booking.est_charge', 'Estimated Fee')}:</span>
                <span className="text-teal-600 dark:text-cyan-400 text-sm font-black">{selectedService.estPrice}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Direct billing covered under Star Health / ABDM CarePlus Floater Policy.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching Caregiver Visit...' : t('caregiver.booking.confirm_btn', 'Confirm & Request Caregiver Visit')}</span>
            </button>

            <p className="text-[10px] text-center text-slate-400 font-semibold">
              Caregiver notification will be dispatched immediately to portal tracking popover.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
};

import React, { useState } from 'react';
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
  Zap,
  Phone,
  ShieldCheck,
  ChevronDown,
  Heart,
  Droplets,
  Activity
} from 'lucide-react';
import { useNurseWorkflow, type BookingStatus } from '../../../utils/nurseWorkflowStorage';

export const NurseBookingView: React.FC = () => {
  const { bookings, createBooking, updateBookingStatus, addNotification } = useNurseWorkflow();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [serviceType, setServiceType] = useState('Post-Surgery Care');
  const [prefDate, setPrefDate] = useState('');
  const [prefTime, setPrefTime] = useState('10:00 AM');
  const [instructions, setInstructions] = useState('');

  // Filter out completed/rejected to show only active in the main list
  const activeBookings = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Rejected');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create shared booking
    createBooking({
      patientName: 'Abinesh Kumar',
      patientAge: '34 Years',
      serviceType: serviceType,
      prefDate: prefDate,
      time: prefTime,
      location: 'Patient Home (Chennai)',
      instructions: instructions || 'Standard care requested.'
    });

    setIsBookingModalOpen(false);
    showToast("Nurse booking request submitted!");
    setPrefDate('');
    setInstructions('');
  };

  const handleCancelBooking = (id: string) => {
    updateBookingStatus(id, 'Rejected');
    showToast("Booking cancelled successfully.");
  };

  // Helper to map status to timeline indices
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
    const steps = ['Requested', 'Accepted', 'Scheduled', 'On the Way', 'Arrived', 'Care in Progress'];
    const currentStep = getTimelineStep(status);

    return (
      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
        <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider">Live Tracking</h4>
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-3 relative z-10">
            {steps.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isPast ? 'bg-emerald-500 border-emerald-500' : 
                    isCurrent ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]' : 
                    'bg-slate-200 border-slate-200 dark:bg-slate-700 dark:border-slate-700'
                  }`}>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-slate-900 dark:text-white" />}
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                  </div>
                  <span className={`text-xs font-bold ${
                    isPast ? 'text-emerald-600 dark:text-emerald-400' :
                    isCurrent ? 'text-slate-900 dark:text-white' :
                    'text-slate-500 dark:text-slate-400'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 font-sans pb-16 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white ${toastMessage.includes('cancelled') ? 'bg-rose-500' : 'bg-emerald-500'}`}
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
            <span className="text-[10px] font-black tracking-widest text-rose-500 dark:text-rose-400 uppercase mb-1 block">HOME CARE SERVICES</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              In-Home Nurse Booking
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Schedule qualified nurses for personalized home care
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsBookingModalOpen(true)}
          className="relative group flex items-center gap-2 bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] border border-rose-400/50 dark:border-rose-300/30 w-full sm:w-auto justify-center z-10"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CalendarPlus className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">Book a Nurse</span>
        </motion.button>
      </motion.div>

      {/* 2. QUICK HEALTH STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Bookings', value: activeBookings.length.toString(), icon: CalendarPlus, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/10' },
          { label: 'Nurses Available', value: '12', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Services', value: '8', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: ACTIVE BOOKINGS */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <Clock className="w-5 h-5 text-rose-500" />
            Live Bookings & Tracking
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {activeBookings.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No active bookings.</p>
                </div>
              ) : (
                activeBookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                    
                    <div className="flex justify-between items-start pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center border-2 border-rose-100 dark:border-rose-800/50">
                          <Users className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 dark:text-white text-base">{booking.nurseName || 'Awaiting Assignment'}</h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>Nurse</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${
                        booking.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400' :
                        booking.status === 'Accepted' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2 ml-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{booking.prefDate} at {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{booking.serviceType}</span>
                      </div>
                    </div>
                    
                    <div className="pl-2">
                      {renderTimeline(booking.status)}
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="flex items-center gap-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-black uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
        
        {/* RIGHT: AVAILABLE SERVICES */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            Available Services
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Post-Surgery Care', desc: 'Wound dressing, vitals, and medication admin.', icon: Stethoscope, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10' },
              { title: 'Elderly Assistance', desc: 'Daily living assistance, mobility help.', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
              { title: 'Newborn Care', desc: 'Post-natal support and baby vitals check.', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
              { title: 'IV Therapy', desc: 'In-home drip administration by certified RNs.', icon: Droplets, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
                whileHover={{ y: -3, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                onClick={() => { setServiceType(service.title); setIsBookingModalOpen(true); }}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all cursor-pointer hover:border-rose-300 dark:hover:border-rose-700/50"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${service.bg} ${service.color}`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{service.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Book Service <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarPlus className="w-5 h-5 text-rose-500" />
                  Request Home Care
                </h2>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleBookService} className="p-6 space-y-5">
                <div className="space-y-2 relative group">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service Type</label>
                  <div className="relative">
                    <select 
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all dark:text-white font-bold appearance-none cursor-pointer"
                    >
                      <option value="Post-Surgery Care">Post-Surgery Care</option>
                      <option value="Elderly Assistance">Elderly Assistance</option>
                      <option value="Newborn Care">Newborn Care</option>
                      <option value="IV Therapy">IV Therapy</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none group-focus-within:text-rose-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Date</label>
                    <input 
                      type="date" 
                      value={prefDate}
                      onChange={(e) => setPrefDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all dark:text-white font-bold text-sm" 
                      required 
                    />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Time</label>
                    <div className="relative">
                      <select 
                        value={prefTime}
                        onChange={(e) => setPrefTime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all dark:text-white font-bold text-sm appearance-none cursor-pointer"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none group-focus-within:text-rose-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Special Instructions</label>
                  <textarea 
                    rows={2} 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-all dark:text-white font-medium resize-none text-sm"
                    placeholder="Enter any specific requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-slate-900 dark:text-white font-black py-4 rounded-xl transition-all mt-2 shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] border border-rose-400/50"
                >
                  Confirm Request
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

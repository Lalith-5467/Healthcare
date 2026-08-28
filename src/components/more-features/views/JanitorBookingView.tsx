import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brush, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  CalendarPlus,
  Clock,
  ThumbsUp,
  X,
  Zap,
  ChevronDown
} from 'lucide-react';

export const JanitorBookingView: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('Deep Sanitization');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingModalOpen(false);
    showToast(`${selectedService} requested successfully!`);
  };

  const openBookingModal = (service: string) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
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
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white bg-emerald-500"
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 dark:bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 items-center justify-center">
            <Brush className="w-8 h-8 text-amber-600 dark:text-amber-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-amber-500 dark:text-amber-400 uppercase mb-1 block">HYGIENE & SANITATION</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Medical Cleaning Services
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Professional hospital-grade sanitization for patient rooms and homes
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openBookingModal('Deep Sanitization')}
          className="relative group flex items-center gap-2 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] border border-amber-400/50 dark:border-amber-300/30 w-full sm:w-auto justify-center z-10"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CalendarPlus className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">Request Service</span>
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
          { label: 'Active Requests', value: '0', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Avg Rating', value: '4.9', icon: ThumbsUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Certified Staff', value: '45+', icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Service Types', value: '3', icon: Brush, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10' }
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

      {/* 3. MAIN CONTENT: SERVICE PACKAGES */}
      <section className="space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Service Packages
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Package 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Deep Sanitization</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Comprehensive hospital-grade cleaning for post-infection recovery rooms or highly sensitive environments.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  99.9% Virus Elimination
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  EPA Approved Chemicals
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  Air Purification Included
                </li>
              </ul>
            </div>
            <button 
              onClick={() => openBookingModal('Deep Sanitization')}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black rounded-xl transition-colors group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 group-hover:text-amber-600 dark:group-hover:text-amber-400"
            >
              Select Package
            </button>
          </motion.div>

          {/* Package 2 (Popular) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.04)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-blue-500/50 shadow-lg flex flex-col justify-between group transition-all relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
              Most Requested
            </div>
            <div>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Equipment Cleaning</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Specialized cleaning and sanitization for medical equipment, concentrators, and hospital beds.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  Safe for Electronics
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  Medical Residue Removal
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  Odor Neutralization
                </li>
              </ul>
            </div>
            <button 
              onClick={() => openBookingModal('Equipment Cleaning')}
              className="w-full py-3.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black rounded-xl transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)]"
            >
              Select Package
            </button>
          </motion.div>

          {/* Package 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brush className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Routine Hygiene</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Standard medical-grade housekeeping designed for elderly and bedridden patients' daily living spaces.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  Daily or Weekly Plans
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  Allergen Reduction
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  Non-toxic Materials
                </li>
              </ul>
            </div>
            <button 
              onClick={() => openBookingModal('Routine Hygiene')}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black rounded-xl transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
            >
              Select Package
            </button>
          </motion.div>

        </div>
      </section>

      {/* 4. HEALTH INSIGHTS */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-3xl p-6 border border-amber-100/50 dark:border-amber-800/30 flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100 dark:border-amber-800/50">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">Hygiene Insights</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Did you know? Regular sanitization of oxygen concentrator filters and tubing can increase the lifespan of the equipment by up to 30% and prevent respiratory tract infections.
            </p>
          </div>
        </div>
      </motion.section>

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
                  <Brush className="w-5 h-5 text-amber-500" />
                  Request Cleaning
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
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Package Selected</label>
                  <div className="relative">
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all dark:text-white font-bold appearance-none cursor-pointer"
                    >
                      <option value="Deep Sanitization">Deep Sanitization</option>
                      <option value="Equipment Cleaning">Equipment Cleaning</option>
                      <option value="Routine Hygiene">Routine Hygiene</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-amber-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all dark:text-white font-bold" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Area / Equipment Details</label>
                  <textarea 
                    rows={2} 
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all dark:text-white font-medium resize-none"
                    placeholder="e.g., 2 bedrooms and oxygen concentrator..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black py-4 rounded-xl transition-all mt-2 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] border border-amber-400/50"
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

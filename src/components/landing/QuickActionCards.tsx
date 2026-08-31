import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ShieldCheck, ArrowRight, Building2, Siren } from 'lucide-react';

interface QuickActionCardsProps {
  onNavigate: (sectionId: string) => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 bg-slate-50 dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: DEPARTMENTS & SPECIALTIES */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden p-8 bg-slate-900 text-white shadow-lg group border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[220px]"
          >
            {/* BACKGROUND IMAGE WITH OVERLAY */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Departments & Specialties
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                Comprehensive medical departments for all your healthcare needs with dedicated specialist doctors.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button 
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <span>Explore Departments</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2: 24/7 EMERGENCY CARE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-br from-[#00a896] to-[#0284c7] text-slate-900 dark:text-white shadow-lg group flex flex-col justify-between min-h-[220px]"
          >
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-slate-900 dark:text-white flex items-center justify-center animate-pulse">
                <Siren className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                24/7 Emergency Care
              </h3>
              <p className="text-xs text-slate-900 dark:text-white/90 max-w-xs leading-relaxed">
                Our emergency response team is always equipped and ready to help you 24 hours a day.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between">
              <a 
                href="tel:+12345678900" 
                className="inline-flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+1 234 567 8900</span>
              </a>
            </div>
          </motion.div>

          {/* CARD 3: ABHA DIGITAL LOCKER */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden p-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg group border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between min-h-[220px]"
          >
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-[#00a896] dark:text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                ABHA Digital Health Locker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Securely link your Ayushman Bharat Digital ID to access all hospital lab reports & vitals in one place.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button 
                onClick={() => onNavigate('abha')}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0f3980] dark:text-cyan-400 hover:text-[#00a896] transition-colors"
              >
                <span>Explore ABHA Locker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

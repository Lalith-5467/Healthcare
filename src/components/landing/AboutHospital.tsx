import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Shield, UserCheck, Clock } from 'lucide-react';

interface AboutHospitalProps {
  onLearnMore?: () => void;
}

export const AboutHospital: React.FC<AboutHospitalProps> = ({ onLearnMore }) => {
  const highlights = [
    { title: 'Modern Infrastructure', icon: Building2 },
    { title: 'Advanced Medical Equipment', icon: Shield },
    { title: 'Experienced Medical Professionals', icon: UserCheck },
    { title: '24/7 Emergency Services', icon: Clock },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-[#0f172a] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400">
                Patient-Centered PHR Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                About Us
              </h2>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              MediCare is an advanced digital personal health record (PHR) and caregiver companion platform committed to delivering secure medical record management, emergency SOS accessibility, and seamless doctor sharing with cutting-edge privacy and patient-centered technology.
            </p>

            {/* CHECKLIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center text-[#00a896] dark:text-cyan-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* BUTTON */}
            <div className="pt-4">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[#00a896] dark:bg-cyan-600 hover:bg-[#008f80] dark:hover:bg-cyan-700 rounded-xl shadow-md transition-all active:scale-98 gap-2 cursor-pointer"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT HOSPITAL BUILDING IMAGE */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img 
                  src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=80" 
                  alt="MediCare Digital Health"
                  className="w-full h-[360px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

                {/* OVERLAY BADGE */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">MediCare Health Network</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Connected Digital Health Ecosystem</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-[#00a896] text-white rounded-full">
                      Secure & Private
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

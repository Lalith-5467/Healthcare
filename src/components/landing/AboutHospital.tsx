import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, QrCode, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutHospitalProps {
  onLearnMore?: () => void;
}

export const AboutHospital: React.FC<AboutHospitalProps> = ({ onLearnMore }) => {
  const highlights = [
    { title: 'Ayushman Bharat (ABHA) PHR', icon: Activity, desc: 'Unified longitudinal health record sync' },
    { title: 'Emergency SOS QR Matrix', icon: QrCode, desc: 'Instant offline first-responder access' },
    { title: 'Family & Caregiver Circle', icon: Users, desc: 'Secure proxy oversight & reminders' },
    { title: '256-Bit Encrypted Vault', icon: ShieldCheck, desc: 'Granular 1-tap consent revocation' },
  ];

  return (
    <section id="about" className="py-14 sm:py-16 bg-slate-50 dark:bg-[#070c18] transition-colors overflow-hidden relative">
      {/* BACKGROUND DECORATIVE ACCENTS */}
      <div className="absolute top-1/2 -left-24 w-96 h-96 bg-[#00a896]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 text-xs font-black uppercase tracking-wider mb-2 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen PHR Ecosystem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Empowering India with Unified Digital Healthcare
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              MediCare is India’s state-of-the-art Personal Health Record (PHR) and Caregiver platform. We seamlessly bridge hospital electronic health records (ABDM), patient-owned diagnostic histories, real-time vitals monitoring, and emergency QR lifelines into one cohesive, privacy-first interface.
            </p>

            {/* CHECKLIST HIGHLIGHTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-[#00a896]/40 transition-all flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 dark:bg-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA BUTTON */}
            <div className="pt-2">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-black text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-xl shadow-lg shadow-teal-500/25 transition-all active:scale-98 gap-2 cursor-pointer"
              >
                <span>Explore Complete Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT PROJECT HEALTHCARE VISUAL */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* MAIN FRAME */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img 
                  src="/about_us_healthcare.jpg" 
                  alt="MediCare Digital Health Consultations"
                  className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1000&q=80";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* TOP FLOATING BADGE */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-[#00a896] dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border border-white/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ABDM Integrated</span>
                  </span>

                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md border border-white/10">
                    Tele-Health Ready
                  </span>
                </div>

                {/* BOTTOM OVERLAY BADGE */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-700/80 shadow-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        MediCare Unified Health Network
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Patient Records · Real-Time Vitals · Emergency QR
                      </p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#00a896] text-white rounded-full shrink-0 shadow-xs">
                      100% Private
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

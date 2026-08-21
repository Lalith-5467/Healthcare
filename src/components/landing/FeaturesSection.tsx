import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Pill, 
  QrCode, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Lock,
  HeartPulse
} from 'lucide-react';

interface FeaturesSectionProps {
  onExploreFeature?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onExploreFeature }) => {
  const [activeTab, setActiveTab] = useState(0);

  const featureCategories = [
    {
      id: 'phr-locker',
      title: 'Digital Health Records',
      subtitle: 'Encrypted Document Locker',
      icon: FileText,
      badge: '100% Encrypted',
      badgeColor: 'bg-teal-500/20 text-[#00a896] border-teal-500/30',
      description: 'Store, categorize, and manage your lifetime medical history, lab reports, prescriptions, and vaccination certificates securely in one digital vault.',
      bullets: [
        'Automatic OCR categorization for diagnostic reports',
        'End-to-end encryption with HIPAA compliant security',
        'Instant search by date, doctor, or medical condition',
        'Downloadable consolidated PDF health summaries'
      ],
      previewStats: [
        { label: 'Storage', value: 'Unlimited PDF' },
        { label: 'Security', value: '256-Bit AES' },
        { label: 'Format', value: 'OCR Auto-Tag' }
      ]
    },
    {
      id: 'med-reminder',
      title: 'Medicine Reminders',
      subtitle: 'Automated Dosage Tracker',
      icon: Pill,
      badge: 'Smart Alerts',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Never miss an essential dose with intelligent notification reminders, dosage schedules, refill alerts, and daily adherence tracking.',
      bullets: [
        'Customizable recurring schedule (Morning, Noon, Night)',
        '1-Tap "Taken" or "Snooze" pill status logging',
        'Refill warning alerts when stock runs low',
        'Family adherence report sharing for elder care'
      ],
      previewStats: [
        { label: 'Adherence', value: '99.4% Rate' },
        { label: 'Alerts', value: 'Push & SMS' },
        { label: 'Tracking', value: 'Daily History' }
      ]
    },
    {
      id: 'doctor-share',
      title: 'Doctor & Clinic Sharing',
      subtitle: 'Time-Bound Access Control',
      icon: QrCode,
      badge: 'Consent Ready',
      badgeColor: 'bg-blue-500/20 text-cyan-400 border-blue-500/30',
      description: 'Share specific medical records with doctors, hospitals, or diagnostic labs via secure QR code scan, temporary web link, or OTP verification.',
      bullets: [
        'Time-limited access pins (15 mins, 1 hour, 24 hours)',
        'Select granular records (Only Lab Reports / Only Prescriptions)',
        'Instant revoke permission at any time with 1 tap',
        'ABHA integrated consent management architecture'
      ],
      previewStats: [
        { label: 'Access', value: 'Time-Bound' },
        { label: 'Verification', value: 'OTP / QR' },
        { label: 'Revoke', value: 'Instant 1-Tap' }
      ]
    },
    {
      id: 'emergency-sos',
      title: 'Emergency SOS Pass',
      subtitle: 'Instant Offline Health Card',
      icon: ShieldAlert,
      badge: 'Instant Access',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: 'Equip first responders and emergency care teams with immediate offline-ready access to blood group, severe allergies, and primary contact details.',
      bullets: [
        'Offline QR card viewable even without active internet',
        'Critical allergy warnings (Penicillin, Nuts, Sulfa)',
        'Emergency next-of-kin contact numbers',
        'Printable wallet card & lock-screen widget'
      ],
      previewStats: [
        { label: 'Speed', value: '< 2 Seconds' },
        { label: 'Offline', value: '100% Ready' },
        { label: 'Emergency', value: 'SOS QR Card' }
      ]
    }
  ];

  const activeFeature = featureCategories[activeTab];

  return (
    <section id="features" className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* AMBIENT GLOW BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00a896]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a896]/15 border border-[#00a896]/30 text-[#00a896] dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#00a896] animate-pulse" />
            <span>Core Platform Capabilities</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Features Designed for <br />
            <span className="text-[#00a896]">Your Total Healthcare Journey</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium"
          >
            From lifetime medical document storage to automated pill alerts and instant doctor sharing — explore how MediCare empowers you every day.
          </motion.p>
        </div>

        {/* INTERACTIVE FEATURE TAB SELECTOR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {featureCategories.map((cat, index) => {
            const Icon = cat.icon;
            const isActive = activeTab === index;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(index)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#00a896]/10 dark:bg-[#00a896]/20 border-[#00a896] shadow-lg ring-1 ring-[#00a896]'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-[#00a896] text-white' : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>
                <div>
                  <h3 className={`text-sm sm:text-base font-extrabold ${isActive ? 'text-[#00a896] dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ACTIVE FEATURE DISPLAY CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/90 backdrop-blur-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-slate-900 dark:text-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* LEFT FEATURE DETAILS */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00a896] text-white flex items-center justify-center shadow-lg shadow-teal-950/20">
                    {React.createElement(activeFeature.icon, { className: "w-6 h-6 stroke-[2.5]" })}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00a896]">
                      {activeFeature.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {activeFeature.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* BULLETS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeFeature.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                      <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={() => onExploreFeature && onExploreFeature(activeFeature.id)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-[#00a896] hover:bg-[#00897b] rounded-xl shadow-md transition-all active:scale-98 cursor-pointer border border-teal-500/30"
                  >
                    <span>Explore {activeFeature.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT STATS & PREVIEW GRAPHIC */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-inner flex flex-col justify-between gap-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#00a896]" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Feature Status</span>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-500/20 text-[#00a896] border border-teal-500/30">
                      Active & Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    {activeFeature.previewStats.map((stat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          {stat.label}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#00a896]/10 border border-[#00a896]/30 flex items-center gap-3 text-left">
                    <HeartPulse className="w-5 h-5 text-[#00a896] shrink-0" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Integrated directly into your personal health dashboard for seamless access anytime.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

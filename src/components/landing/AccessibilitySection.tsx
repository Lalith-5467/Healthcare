import React from 'react';
import { 
  Eye, 
  Mic, 
  SlidersHorizontal, 
  ShieldAlert, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const AccessibilitySection: React.FC = () => {
  const features = [
    {
      title: 'Elder-Friendly High Contrast',
      desc: 'Optimized typography hierarchy, high contrast color ratios, and extra-large touch targets for effortless readability.',
      icon: Eye,
    },
    {
      title: 'Voice Input & Assistive Controls',
      desc: 'Voice command readiness allowing patients to record symptoms, search records, or log medicine doses hands-free.',
      icon: Mic,
    },
    {
      title: 'Simplified 1-Tap Navigation',
      desc: 'Clutter-free navigation menus with persistent quick actions for SOS, medicine reminders, and doctor sharing.',
      icon: SlidersHorizontal,
    },
    {
      title: 'Instant Emergency Access',
      desc: 'Offline-ready emergency cards allowing first responders to access critical blood group and allergy details in seconds.',
      icon: ShieldAlert,
    },
  ];

  return (
    <section className="py-24 bg-blue-50/60 dark:bg-[#0b1426] border-y border-blue-100/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[#0f3980] dark:text-cyan-300 text-xs font-bold">
              <HeartHandshake className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Universal Care Standard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Healthcare Designed For Everyone
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Medical technology must be intuitive for users of all ages and abilities. MediCare is engineered with accessible typography, simplified controls, and elder-friendly workflows so every family member stays empowered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-[#0f3980] dark:text-cyan-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT VISUAL CARD */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accessibility Profile</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Elder & Senior Care Mode</span>
                    <CheckCircle2 className="w-5 h-5 text-[#00a896]" />
                  </h3>
                </div>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Active
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Text Size & Contrast</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">120% Font Scaling + High Contrast WCAG AAA</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0f3980] dark:text-cyan-400">Enabled</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Voice Guidance</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Audio readouts for medicine dosages & alerts</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0f3980] dark:text-cyan-400">Ready</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Caregiver Auto-Alerts</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Notifies daughter/son if dosage is unconfirmed</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0f3980] dark:text-cyan-400">Linked</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

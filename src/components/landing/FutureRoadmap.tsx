import React from 'react';
import { 
  Bot, 
  Home, 
  Watch, 
  Building2, 
  Video, 
  Sparkles
} from 'lucide-react';


export const FutureRoadmap: React.FC = () => {
  const roadmapItems = [
    {
      phase: 'Phase 2',
      title: 'AI Health Assistant & Prescription Scanning',
      desc: 'Instant OCR extraction of medical prescriptions and AI-based symptom guidance.',
      icon: Bot,
      status: 'In Development',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      phase: 'Phase 2',
      title: 'Nurse, Caretaker & Home Doctor Booking',
      desc: 'On-demand home visits from certified nurses, caregivers, and general practitioners.',
      icon: Home,
      status: 'Coming Soon',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      phase: 'Phase 3',
      title: 'Smartwatch & Wearable Device Sync',
      desc: 'Continuous real-time streaming of heart rate, SpO2, and ECG data directly into your PHR.',
      icon: Watch,
      status: 'Planned',
      badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      phase: 'Phase 3',
      title: 'Hospital, Lab & Pharmacy Direct Sync',
      desc: 'Automatic record ingestion from accredited diagnostic labs and hospital EHR systems.',
      icon: Building2,
      status: 'Planned',
      badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    },
    {
      phase: 'Phase 3',
      title: 'HD Teleconsultation & Smart Insurance Claims',
      desc: 'Seamless video consultations with specialists and automated insurance claim submissions.',
      icon: Video,
      status: 'Planned',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-cyan-300 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Product Innovation Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            What’s Coming Next to MediCare
          </h2>

          <p className="text-base text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
            We are continuously expanding our healthcare ecosystem to integrate advanced AI diagnostics, home nursing, smartwatch telemetry, and seamless hospital connectivity.
          </p>
        </div>

        {/* ROADMAP TIMELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl flex flex-col justify-between hover:border-blue-500/50 transition-all hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${item.badgeColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {item.phase}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Module Status</span>
                  <span className="text-cyan-400 font-bold">Planned Release</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

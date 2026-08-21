import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Stethoscope, 
  Pill, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

export const HealthTimeline: React.FC = () => {
  const timelineEvents = [
    {
      date: '19 AUG 2026',
      items: [
        {
          title: 'Cardiology Consultation',
          subtitle: 'Dr. Rajesh Kumar • Fortis Hospital',
          type: 'Consultation',
          icon: Stethoscope,
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        },
        {
          title: 'Prescription Issued',
          subtitle: 'Metformin 500mg, Telmisartan 40mg',
          type: 'Prescription',
          icon: Pill,
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        },
        {
          title: 'Blood Report Attached',
          subtitle: 'HbA1c & Fasting Glucose • Apollo Labs',
          type: 'Blood Report',
          icon: FileText,
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        },
        {
          title: 'Medication Care Plan Updated',
          subtitle: 'Daily 2-dose reminder activated',
          type: 'Medication Plan',
          icon: Activity,
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        },
      ],
    },
    {
      date: '18 AUG 2026',
      items: [
        {
          title: 'Lipid Profile Lab Report',
          subtitle: 'Uploaded via ABHA Health Gateway',
          type: 'Lab Report',
          icon: FileText,
          color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
        },
      ],
    },
    {
      date: '15 AUG 2026',
      items: [
        {
          title: 'Annual Physical Checkup',
          subtitle: 'General Physician Assessment • Max Clinic',
          type: 'Doctor Visit',
          icon: Calendar,
          color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        },
      ],
    },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#0B0F17]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#FF5B22]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5B22]">
              Chronological Health Story
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Patient Health Timeline.
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Every clinical event, lab test, and prescription organized in a single continuous stream.
          </p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-10">
          {/* VERTICAL LINE */}
          <div className="absolute top-0 bottom-0 left-2.5 sm:left-4 w-0.5 bg-gradient-to-b from-[#FF5B22] via-orange-500/40 to-transparent" />

          <div className="space-y-12">
            {timelineEvents.map((group, groupIdx) => (
              <motion.div
                key={groupIdx}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: groupIdx * 0.2 }}
                className="relative space-y-4"
              >
                {/* DATE NODE */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF5B22] border-4 border-white dark:border-[#0B0F17] shadow-md -ml-[19.5px] sm:-ml-[25.5px] shrink-0" />
                  <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                    {group.date}
                  </span>
                </div>

                {/* EVENT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 sm:pl-6">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={itemIdx}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-orange-500/40 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.color}`}>
                            {item.type}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-orange-500/10 group-hover:text-[#FF5B22] transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

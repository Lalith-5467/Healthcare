import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Pill, FileText, ShieldCheck } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: 'Appointment Scheduled with Dr. Rajesh Kumar',
    time: '10 mins ago',
    category: 'Appointment',
    icon: Calendar,
    accent: '#3b82f6',
    accentBg: 'rgba(59,130,246,.12)',
    accentBorder: 'rgba(59,130,246,.25)',
    categoryColor: '#2563eb',
    itemBg: 'rgba(239,246,255,.8)',
    itemBorder: 'rgba(59,130,246,.12)',
  },
  {
    id: 2,
    title: 'Amoxicillin 500mg marked as taken',
    time: '1 hour ago',
    category: 'Medication',
    icon: Pill,
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,.12)',
    accentBorder: 'rgba(245,158,11,.25)',
    categoryColor: '#d97706',
    itemBg: 'rgba(255,251,235,.8)',
    itemBorder: 'rgba(245,158,11,.12)',
  },
  {
    id: 3,
    title: 'CBC & Blood Panel report uploaded to ABDM Vault',
    time: '3 hours ago',
    category: 'Records',
    icon: FileText,
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,.12)',
    accentBorder: 'rgba(16,185,129,.25)',
    categoryColor: '#059669',
    itemBg: 'rgba(240,253,244,.8)',
    itemBorder: 'rgba(16,185,129,.12)',
  },
  {
    id: 4,
    title: 'CarePlus Family Floater policy verified',
    time: 'Yesterday',
    category: 'Insurance',
    icon: ShieldCheck,
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,.12)',
    accentBorder: 'rgba(6,182,212,.25)',
    categoryColor: '#0891b2',
    itemBg: 'rgba(236,254,255,.8)',
    itemBorder: 'rgba(6,182,212,.12)',
  },
];

export const RecentActivityTimeline: React.FC = () => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl font-sans relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg,#f8fafc 0%,#f0fdfa 50%,#ffffff 100%)',
        border: '1.5px solid rgba(20,184,166,.12)',
        boxShadow: '0 4px 24px rgba(20,184,166,.06), 0 1px 3px rgba(0,0,0,.04)'
      }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%)' }} />

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-md"
            style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)', boxShadow: '0 4px 12px rgba(99,102,241,.3)' }}>
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Patient Activity
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Real-time Portal Audit Feed</span>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[11px] font-bold"
          style={{ color: '#00a896' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#00a896' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#00a896' }} />
          </span>
          Live Feed
        </span>
      </div>

      {/* ── TIMELINE ── */}
      <div className="relative z-10">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          const isLast = idx === activities.length - 1;

          return (
            <div key={act.id} className="flex gap-4">
              {/* LEFT COLUMN — icon + vertical connector */}
              <div className="flex flex-col items-center shrink-0" style={{ width: '40px' }}>
                {/* Icon circle */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.07 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10"
                  style={{
                    background: act.accentBg,
                    border: `2px solid ${act.accentBorder}`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: act.accent }} />
                </motion.div>

                {/* Connector line — hidden for last item */}
                {!isLast && (
                  <div
                    className="flex-1 mt-1"
                    style={{
                      width: '2px',
                      minHeight: '20px',
                      background: `linear-gradient(to bottom, ${act.accent}40, ${activities[idx + 1].accent}20)`,
                      borderRadius: '2px',
                      marginBottom: '0px',
                    }}
                  />
                )}
              </div>

              {/* RIGHT COLUMN — content card */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className={`flex-1 rounded-2xl px-4 py-3 ${isLast ? 'mb-0' : 'mb-3'}`}
                style={{
                  background: act.itemBg,
                  border: `1px solid ${act.itemBorder}`,
                  boxShadow: '0 1px 6px rgba(0,0,0,.04)'
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                    {act.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono shrink-0 pt-px whitespace-nowrap">
                    {act.time}
                  </span>
                </div>
                <span className="mt-1 inline-block text-[10px] font-extrabold"
                  style={{ color: act.categoryColor }}>
                  {act.category}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

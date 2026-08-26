import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Moon, Footprints, Scale, Gauge, TrendingUp, TrendingDown } from 'lucide-react';

/* Mini sparkline SVG — 5 data points, accent-colored */
const Sparkline: React.FC<{ color: string; up: boolean }> = ({ color, up }) => {
  const points = up
    ? '0,16 12,12 24,13 36,8 48,4'
    : '0,4 12,8 24,6 36,11 48,14';
  return (
    <svg width="48" height="18" viewBox="0 0 48 18" fill="none" className="shrink-0 opacity-70">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

const metrics = [
  {
    id: 'heart',
    label: 'Heart Rate',
    value: '72 BPM',
    status: 'Normal',
    trend: '↓ 2% yesterday',
    isUp: false,
    icon: Heart,
    accent: '#f43f5e',
    accentBg: 'rgba(244,63,94,.1)',
    accentBorder: 'rgba(244,63,94,.2)',
    badgeClr: '#be123c',
    badgeBg: 'rgba(244,63,94,.08)',
  },
  {
    id: 'bp',
    label: 'Blood Pressure',
    value: '120/80',
    status: 'Optimal',
    trend: '120/80 mmHg',
    isUp: true,
    icon: Activity,
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,.1)',
    accentBorder: 'rgba(6,182,212,.2)',
    badgeClr: '#0e7490',
    badgeBg: 'rgba(6,182,212,.08)',
  },
  {
    id: 'sleep',
    label: 'Sleep Duration',
    value: '7h 42m',
    status: 'Restful',
    trend: '↑ 8% this week',
    isUp: true,
    icon: Moon,
    accent: '#818cf8',
    accentBg: 'rgba(129,140,248,.1)',
    accentBorder: 'rgba(129,140,248,.2)',
    badgeClr: '#4338ca',
    badgeBg: 'rgba(129,140,248,.08)',
  },
  {
    id: 'steps',
    label: 'Daily Steps',
    value: '6,842',
    status: 'Goal: 10k',
    trend: '68% completed',
    isUp: true,
    icon: Footprints,
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,.1)',
    accentBorder: 'rgba(16,185,129,.2)',
    badgeClr: '#065f46',
    badgeBg: 'rgba(16,185,129,.08)',
  },
  {
    id: 'weight',
    label: 'Body Weight',
    value: '72 kg',
    status: 'Stable',
    trend: 'No change',
    isUp: true,
    icon: Scale,
    accent: '#14b8a6',
    accentBg: 'rgba(20,184,166,.1)',
    accentBorder: 'rgba(20,184,166,.2)',
    badgeClr: '#0f766e',
    badgeBg: 'rgba(20,184,166,.08)',
  },
  {
    id: 'bmi',
    label: 'Body Mass Index',
    value: '23.8',
    status: 'Healthy',
    trend: 'Ideal range',
    isUp: true,
    icon: Gauge,
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,.1)',
    accentBorder: 'rgba(168,85,247,.2)',
    badgeClr: '#7e22ce',
    badgeBg: 'rgba(168,85,247,.08)',
  },
];

export const HealthSnapshotGrid: React.FC = () => {
  return (
    <div
      className="p-6 rounded-3xl space-y-4 font-sans relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg,#f8fafc 0%,#f0fdf9 50%,#ffffff 100%)',
        border: '1.5px solid rgba(20,184,166,.12)',
        boxShadow: '0 4px 24px rgba(20,184,166,.06), 0 1px 3px rgba(0,0,0,.04)'
      }}
    >
      {/* Decorative corner blob */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(20,184,166,.1) 0%,transparent 70%)' }} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Health Biometrics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Real-time vitals, sleep & physical activity snapshot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5 group min-w-0 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,.92)',
                border: `1px solid ${m.accentBorder}`,
                boxShadow: `0 2px 10px rgba(0,0,0,.04), 0 0 0 0 ${m.accent}`
              }}
            >
              {/* Top: circular icon + status badge */}
              <div className="flex items-center justify-between gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: m.accentBg, border: `1px solid ${m.accentBorder}` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: m.accent }} />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap"
                  style={{ background: m.badgeBg, color: m.badgeClr, border: `1px solid ${m.accentBorder}` }}>
                  {m.status}
                </span>
              </div>

              {/* Label + value */}
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 block truncate">{m.label}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight block mt-0.5 truncate"
                  style={{ letterSpacing: '-0.02em' }}>
                  {m.value}
                </span>
              </div>

              {/* Footer: sparkline + trend */}
              <div className="flex items-center justify-between gap-1 pt-1.5 min-w-0"
                style={{ borderTop: `1px solid ${m.accentBorder}` }}>
                <div className="flex items-center gap-1 text-[10px] font-bold min-w-0 truncate"
                  style={{ color: m.isUp ? '#10b981' : '#f43f5e' }}>
                  {m.isUp
                    ? <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                    : <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
                  <span className="truncate">{m.trend}</span>
                </div>
                <Sparkline color={m.accent} up={m.isUp} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

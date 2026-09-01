import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Pill, Activity, ShieldCheck, Users, Clock, ArrowRight,
  Bell, TrendingUp, Heart, CheckCircle2
} from 'lucide-react';

interface DashboardStatsGridProps {
  onNavigate: (id: string) => void;
}

/* ─────────────────────────────────────────────────────────────
   THEMED ILLUSTRATIONS — right-side art per card
   Width/height fixed at 56×56 so they never expand the card.
   ───────────────────────────────────────────────────────────── */

const CheckupArt = () => (
  <svg width="56" height="56" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="shrink-0 drop-shadow">
    {/* Clipboard */}
    <rect x="16" y="18" width="50" height="62" rx="9" fill="white" fillOpacity=".9" stroke="#c084fc" strokeWidth="2.5"/>
    <rect x="30" y="11" width="26" height="12" rx="5" fill="#a855f7"/>
    <circle cx="43" cy="17" r="3.5" fill="white"/>
    {/* Heart icon on clipboard */}
    <path d="M33 40 C33 35 39 35 42 40 C45 35 51 35 51 40 C51 47 42 53 42 53 C42 53 33 47 33 40Z" fill="#f87171"/>
    {/* Lines */}
    <line x1="26" y1="61" x2="62" y2="61" stroke="#ede9fe" strokeWidth="3" strokeLinecap="round"/>
    <line x1="26" y1="71" x2="52" y2="71" stroke="#ede9fe" strokeWidth="3" strokeLinecap="round"/>
    {/* Stethoscope */}
    <path d="M70 46 C83 46 83 74 66 74 C58 74 58 84 66 84" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <circle cx="66" cy="85" r="4" fill="#a855f7"/>
  </svg>
);

const InsuranceArt = () => (
  <svg width="56" height="56" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="shrink-0 drop-shadow">
    <defs>
      <linearGradient id="ig1" x1="12" y1="8" x2="78" y2="84" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93c5fd"/>
        <stop offset="1" stopColor="#1d4ed8"/>
      </linearGradient>
    </defs>
    {/* Shield */}
    <path d="M48 8 L80 24 V50 C80 70 48 86 48 86 C48 86 16 70 16 50 V24 Z" fill="url(#ig1)" stroke="#60a5fa" strokeWidth="2"/>
    {/* Checkmark */}
    <path d="M34 50 L44 60 L64 40" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Umbrella accent */}
    <ellipse cx="76" cy="70" rx="10" ry="5" fill="#fb923c" opacity=".9"/>
    <line x1="76" y1="70" x2="76" y2="82" stroke="#fb923c" strokeWidth="3" strokeLinecap="round"/>
    <path d="M72 82 Q76 86 80 82" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const FamilyArt = () => (
  <div className="flex items-center -space-x-2.5 shrink-0">
    {(
      [
        { emoji: '👨', from: '#60a5fa', to: '#2563eb' },
        { emoji: '👩', from: '#f472b6', to: '#db2777' },
        { emoji: '👦', from: '#fbbf24', to: '#d97706' },
      ] as { emoji: string; from: string; to: string }[]
    ).map((m, i) => (
      <div
        key={i}
        style={{ background: `linear-gradient(135deg, ${m.from}, ${m.to})`, zIndex: 3 - i }}
        className="relative w-9 h-9 rounded-full border-[2.5px] border-white shadow-md flex items-center justify-center text-[17px] leading-none"
      >
        {m.emoji}
      </div>
    ))}
    <div className="relative w-7 h-7 rounded-full border-[2.5px] border-white bg-emerald-100 shadow flex items-center justify-center text-[9px] font-black text-emerald-700" style={{ zIndex: 0 }}>
      +1
    </div>
  </div>
);

const AppointmentsArt = () => (
  <svg width="56" height="56" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="shrink-0 drop-shadow">
    <defs>
      <linearGradient id="ag1" x1="8" y1="16" x2="70" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a5b4fc"/>
        <stop offset="1" stopColor="#4338ca"/>
      </linearGradient>
    </defs>
    {/* Calendar body */}
    <rect x="8" y="20" width="60" height="60" rx="12" fill="url(#ag1)" stroke="#818cf8" strokeWidth="2"/>
    <path d="M8 38 H68" stroke="white" strokeWidth="2.5" strokeOpacity=".8"/>
    {/* Pins */}
    <rect x="22" y="10" width="8" height="16" rx="4" fill="#3730a3"/>
    <rect x="46" y="10" width="8" height="16" rx="4" fill="#3730a3"/>
    {/* Date cells */}
    <rect x="18" y="50" width="12" height="10" rx="4" fill="white" fillOpacity=".9"/>
    <rect x="38" y="50" width="12" height="10" rx="4" fill="white" fillOpacity=".9"/>
    {/* Clock overlay */}
    <circle cx="74" cy="68" r="16" fill="#1e3a8a" stroke="white" strokeWidth="2.5"/>
    <polyline points="74,60 74,68 79,72" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MedicinesArt = () => (
  <svg width="56" height="56" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="shrink-0 drop-shadow">
    {/* Medicine bottle */}
    <rect x="44" y="26" width="36" height="52" rx="9" fill="white" fillOpacity=".95" stroke="#f59e0b" strokeWidth="2.5"/>
    <rect x="48" y="16" width="28" height="12" rx="5" fill="#f59e0b"/>
    {/* Plus label inside */}
    <rect x="52" y="46" width="20" height="18" rx="4" fill="#fde68a"/>
    <path d="M58 55 H66 M62 51 V59" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Capsule pill */}
    <rect x="8" y="52" width="16" height="36" rx="8" transform="rotate(-38 16 70)" fill="#f87171" stroke="white" strokeWidth="2.5"/>
    <line x1="6" y1="52" x2="24" y2="52" transform="rotate(-38 15 70)" stroke="white" strokeWidth="2.5"/>
    {/* Small round pill */}
    <circle cx="20" cy="30" r="8" fill="#34d399" stroke="white" strokeWidth="2"/>
  </svg>
);

const HealthScoreArt = () => (
  <svg width="56" height="56" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="shrink-0 drop-shadow">
    {/* Background ring */}
    <circle cx="48" cy="48" r="38" stroke="#d1fae5" strokeWidth="10"/>
    {/* Progress ring — 85% */}
    <circle
      cx="48" cy="48" r="38"
      stroke="#10b981" strokeWidth="10"
      strokeDasharray="239" strokeDashoffset="36"
      strokeLinecap="round"
      transform="rotate(-90 48 48)"
    />
    {/* ECG pulse wave */}
    <path
      d="M18 48 L28 48 L34 34 L44 62 L52 38 L60 50 L66 44 L76 48"
      stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   DATA MODEL
   ───────────────────────────────────────────────────────────── */

interface StatItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  subtitle: string;
  icon: React.ElementType;
  iconGradient: string;
  iconShadow: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  accentColor: string;
  badgeText: string;
  badgeCls: string;
  footerText: string;
  footerIcon: React.ElementType;
  footerIconCls: string;
  footerBg: string;
  art: React.ReactNode;
}

const initialStats: StatItem[] = [
  {
    id: 'checkup',
    title: 'Health Check-Up',
    value: 'Due',
    subtitle: 'Scheduled in 30 days',
    icon: Clock,
    iconGradient: 'linear-gradient(135deg,#a855f7,#7c3aed)',
    iconShadow: '0 4px 12px rgba(168,85,247,.4)',
    cardBg: 'linear-gradient(160deg,#faf5ff 0%,#ede9fe 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(167,139,250,.35)',
    cardShadow: '0 2px 16px rgba(139,92,246,.08)',
    accentColor: '#7c3aed',
    badgeText: '📅 Scheduled in 30 days',
    badgeCls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200',
    footerText: 'Stay healthy! Check-up is coming',
    footerIcon: Bell,
    footerIconCls: 'text-violet-500',
    footerBg: 'bg-white/80 dark:bg-violet-950/60 border-violet-100 dark:border-violet-900/40',
    art: <CheckupArt />,
  },
  {
    id: 'insurance',
    title: 'Insurance Policy',
    value: '₹10L',
    subtitle: 'CarePlus Floater Active',
    icon: ShieldCheck,
    iconGradient: 'linear-gradient(135deg,#38bdf8,#1d4ed8)',
    iconShadow: '0 4px 12px rgba(59,130,246,.4)',
    cardBg: 'linear-gradient(160deg,#eff6ff 0%,#dbeafe 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(147,197,253,.4)',
    cardShadow: '0 2px 16px rgba(59,130,246,.08)',
    accentColor: '#1d4ed8',
    badgeText: '✓ Covered',
    badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
    footerText: "You're Protected · Coverage active",
    footerIcon: ShieldCheck,
    footerIconCls: 'text-blue-500',
    footerBg: 'bg-white/80 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/40',
    art: <InsuranceArt />,
  },
  {
    id: 'family',
    title: 'Family Members',
    value: '03',
    subtitle: 'Shared emergency records',
    icon: Users,
    iconGradient: 'linear-gradient(135deg,#34d399,#059669)',
    iconShadow: '0 4px 12px rgba(16,185,129,.4)',
    cardBg: 'linear-gradient(160deg,#f0fdf4 0%,#d1fae5 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(110,231,183,.4)',
    cardShadow: '0 2px 16px rgba(16,185,129,.08)',
    accentColor: '#059669',
    badgeText: '+ 3 Linked',
    badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200',
    footerText: 'Family Connected · Manage loved ones',
    footerIcon: Heart,
    footerIconCls: 'text-emerald-500',
    footerBg: 'bg-white/80 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40',
    art: <FamilyArt />,
  },
  {
    id: 'appointments',
    title: 'Appointments',
    value: '03',
    subtitle: '2 upcoming this week',
    icon: Calendar,
    iconGradient: 'linear-gradient(135deg,#818cf8,#4338ca)',
    iconShadow: '0 4px 12px rgba(99,102,241,.4)',
    cardBg: 'linear-gradient(160deg,#eef2ff 0%,#e0e7ff 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(165,180,252,.4)',
    cardShadow: '0 2px 16px rgba(99,102,241,.08)',
    accentColor: '#4338ca',
    badgeText: '📅 2 Upcoming',
    badgeCls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200',
    footerText: 'Stay on Track · Upcoming appts.',
    footerIcon: Calendar,
    footerIconCls: 'text-indigo-500',
    footerBg: 'bg-white/80 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40',
    art: <AppointmentsArt />,
  },
  {
    id: 'medicines',
    title: 'Active Medicines',
    value: '03',
    subtitle: '100% adherence today',
    icon: Pill,
    iconGradient: 'linear-gradient(135deg,#fb923c,#ea580c)',
    iconShadow: '0 4px 12px rgba(249,115,22,.4)',
    cardBg: 'linear-gradient(160deg,#fff7ed 0%,#fed7aa 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(253,186,116,.4)',
    cardShadow: '0 2px 16px rgba(249,115,22,.08)',
    accentColor: '#ea580c',
    badgeText: '✓ 100% On Time',
    badgeCls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    footerText: 'Great Adherence! Keep it up',
    footerIcon: CheckCircle2,
    footerIconCls: 'text-orange-500',
    footerBg: 'bg-white/80 dark:bg-orange-950/60 border-orange-100 dark:border-orange-900/40',
    art: <MedicinesArt />,
  },
  {
    id: 'analytics',
    title: 'Health Score',
    value: '85',
    unit: '/100',
    subtitle: '+4 points from last week',
    icon: Activity,
    iconGradient: 'linear-gradient(135deg,#2dd4bf,#059669)',
    iconShadow: '0 4px 12px rgba(20,184,166,.4)',
    cardBg: 'linear-gradient(160deg,#f0fdfa 0%,#ccfbf1 60%,#ffffff 100%)',
    cardBorder: '1px solid rgba(94,234,212,.4)',
    cardShadow: '0 2px 16px rgba(20,184,166,.08)',
    accentColor: '#0d9488',
    badgeText: '↑ +4 pts',
    badgeCls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-200',
    footerText: "Improving · You're doing great!",
    footerIcon: TrendingUp,
    footerIconCls: 'text-teal-500',
    footerBg: 'bg-white/80 dark:bg-teal-950/60 border-teal-100 dark:border-teal-900/40',
    art: <HealthScoreArt />,
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT — grid/padding/gap UNCHANGED
   ───────────────────────────────────────────────────────────── */

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<StatItem[]>(initialStats);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => {
      setItems(prev => {
        const copy = [...prev];
        const first = copy.shift();
        if (first) copy.push(first);
        return copy;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [isHovered, items]);

  return (
    /* ── ORIGINAL: grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 — UNCHANGED ── */
    <section onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="font-sans">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((s) => {
          const Icon = s.icon;
          const FooterIcon = s.footerIcon;

          return (
            <motion.div
              layout
              key={s.id}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(s.id)}
              /* ── ORIGINAL: rounded-2xl, overflow-hidden, cursor-pointer — UNCHANGED ── */
              className="relative overflow-hidden rounded-2xl cursor-pointer group transition-shadow duration-200"
              style={{
                background: s.cardBg,
                border: s.cardBorder,
                boxShadow: s.cardShadow,
              }}
            >
              {/* Soft radial glow top-right — purely decorative, no layout impact */}
              <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-60"
                style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

              {/* ── ORIGINAL inner wrapper: p-4, flex-col, gap-2.5 — UNCHANGED ── */}
              <div className="relative z-10 p-4 flex flex-col gap-2.5">

                {/* Row 1 — Icon circle + View → */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{ background: s.iconGradient, boxShadow: s.iconShadow }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); onNavigate(s.id); }}
                    className="flex items-center gap-0.5 text-[11px] font-bold group-hover:opacity-75 transition-opacity"
                    style={{ color: s.accentColor }}
                  >
                    View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Row 2 — Title · Value · Art */}
                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight truncate">
                      {s.title}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[1.6rem] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {s.value}
                      </span>
                      {s.unit && (
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{s.unit}</span>
                      )}
                    </div>
                  </div>
                  {/* Illustration — scales gently on hover, no layout shift */}
                  <div className="shrink-0 group-hover:scale-[1.06] transition-transform duration-300">
                    {s.art}
                  </div>
                </div>

                {/* Row 3 — Badge + subtitle */}
                <div className="flex flex-col gap-1">
                  <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badgeCls}`}>
                    {s.badgeText}
                  </span>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                    {s.subtitle}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-black/[.06] dark:border-white/[.06]" />

                {/* Row 4 — Footer info pill */}
                <div className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 border ${s.footerBg} shadow-sm`}>
                  <FooterIcon className={`w-3 h-3 shrink-0 ${s.footerIconCls}`} />
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {s.footerText}
                  </span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

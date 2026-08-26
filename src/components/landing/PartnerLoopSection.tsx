import React from 'react';
import { LogoLoop } from '../ui/LogoLoop';
import type { LogoItem } from '../ui/LogoLoop';

export const PartnerLoopSection: React.FC = () => {
  const healthcareLogos: LogoItem[] = [
    // 1. ABDM (Ayushman Bharat Digital Mission)
    {
      title: 'ABDM',
      ariaLabel: 'Ayushman Bharat Digital Mission Ecosystem',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 group-hover:bg-[#00a896] text-[#00a896] group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-teal-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300 font-mono">
              ABDM
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              National Health Network
            </span>
          </div>
        </div>
      ),
    },

    // 2. ABHA (Ayushman Bharat Health Account)
    {
      title: 'ABHA',
      ariaLabel: 'Ayushman Bharat Health Account',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-600 text-cyan-600 dark:text-cyan-400 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M7 15h4" />
              <path d="M7 11h2" />
              <circle cx="16" cy="11" r="2" />
              <path d="M14 17c0-1.5 1-2 2-2s2 .5 2 2" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300 font-mono">
              ABHA
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Digital Health ID
            </span>
          </div>
        </div>
      ),
    },

    // 3. SECURE HEALTH (Shield + Medical Cross)
    {
      title: 'Secure Health',
      ariaLabel: 'Secure Health Protocol',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 group-hover:bg-[#00a896] text-[#00a896] group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-teal-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300">
              Secure Health
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              HIPAA & ABDM Compliant
            </span>
          </div>
        </div>
      ),
    },

    // 4. DIGITAL RECORDS (Medical Document + Digital Connection)
    {
      title: 'Digital Records',
      ariaLabel: 'Digital Medical Records',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-600 text-cyan-600 dark:text-cyan-400 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 15h6" />
              <path d="M9 11h6" />
              <circle cx="16" cy="18" r="1.5" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300">
              Digital Records
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Unified Fast PHR Vault
            </span>
          </div>
        </div>
      ),
    },

    // 5. DOCTOR NETWORK (Stethoscope + Connected Nodes)
    {
      title: 'Doctor Network',
      ariaLabel: 'Verified Doctor Network',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 group-hover:bg-[#00a896] text-[#00a896] group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-teal-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300">
              Doctor Network
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Verified Practitioners
            </span>
          </div>
        </div>
      ),
    },

    // 6. HOSPITAL NETWORK (Hospital + Connected Telemetry)
    {
      title: 'Hospital Network',
      ariaLabel: 'Connected Hospital Network',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-600 text-cyan-600 dark:text-cyan-400 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 7v10" />
              <path d="M7 12h10" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300">
              Hospital Network
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Integrated OPD & Labs
            </span>
          </div>
        </div>
      ),
    },

    // 7. EMERGENCY CARE (Medical Cross + Pulse ECG)
    {
      title: 'Emergency Care',
      ariaLabel: 'Instant Emergency Care',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-rose-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-rose-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 group-hover:bg-rose-500 text-rose-500 group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-rose-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-rose-500 dark:group-hover:text-rose-400">
              Emergency Care
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              24/7 SOS Medical QR
            </span>
          </div>
        </div>
      ),
    },

    // 8. PROTECTED HEALTH DATA (Lock + Medical Security)
    {
      title: 'Protected Health Data',
      ariaLabel: '256-bit Protected Health Data',
      node: (
        <div className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-teal-500/10 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 group-hover:bg-[#00a896] text-[#00a896] group-hover:text-white flex items-center justify-center transition-colors duration-300 shrink-0 border border-teal-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300">
              Protected Health Data
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              256-Bit Zero-Knowledge
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-white dark:bg-[#0b1120] border-t border-b border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden relative">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-12 bg-teal-500/5 dark:bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* SECTION SUB-HEADING */}
      <div className="text-center mb-4 relative z-10">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
          POWERING INDIA&apos;S CONNECTED HEALTHCARE ECOSYSTEM
        </span>
      </div>

      {/* SEAMLESS INFINITE CONTINUOUS HEALTHCARE LOGOLOOP */}
      <div className="relative py-1">
        <LogoLoop
          logos={healthcareLogos}
          speed={45}
          direction="left"
          gap={32}
          logoHeight={48}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Trusted Healthcare Ecosystem Logos"
        />
      </div>
    </section>
  );
};

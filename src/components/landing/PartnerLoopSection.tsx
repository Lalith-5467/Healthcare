import React from 'react';
import { LogoLoop } from '../ui/LogoLoop';
import type { LogoItem } from '../ui/LogoLoop';

export const PartnerLoopSection: React.FC = () => {
  const brandLogos: LogoItem[] = [
    // 1. ABDM (National Digital Health Mission)
    {
      title: 'ABDM',
      ariaLabel: 'ABDM',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <path d="M16 3L5 8v8c0 6.63 4.7 12.89 11 14.5C22.3 28.89 27 22.63 27 16V8l-11-5z" />
            <path d="M16 10v12" />
            <path d="M10 16h12" />
            <circle cx="16" cy="16" r="3" className="fill-current stroke-none" />
          </svg>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 font-mono leading-none">
              ABDM
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Digital Mission
            </span>
          </div>
        </div>
      ),
    },

    // 2. ABHA (Ayushman Bharat Health Account)
    {
      title: 'ABHA',
      ariaLabel: 'ABHA',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <rect x="3" y="6" width="26" height="20" rx="4" />
            <circle cx="11" cy="16" r="3.5" />
            <path d="M18 13h7" />
            <path d="M18 18h4" />
            <path d="M7 22c0-2.2 1.8-4 4-4s4 1.8 4 4" />
          </svg>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 font-mono leading-none">
              ABHA
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Health ID
            </span>
          </div>
        </div>
      ),
    },

    // 3. SECURE HEALTH (Shield Cross)
    {
      title: 'Secure Health',
      ariaLabel: 'Secure Health',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <path d="M16 28s10-5 10-13V7L16 3 6 7v8c0 8 10 13 10 13z" />
            <path d="M12 15h8" />
            <path d="M16 11v8" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              Secure<span className="text-[#00a896] dark:text-cyan-400">Health</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Certified
            </span>
          </div>
        </div>
      ),
    },

    // 4. DIGITAL RECORDS (Doc + Pulse)
    {
      title: 'Digital Records',
      ariaLabel: 'Digital Records',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <path d="M19 3H8a3 3 0 0 0-3 3v20a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V11l-8-8z" />
            <polyline points="19 3 19 11 27 11" />
            <path d="M10 20h3l2-4 3 7 2-3h2" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              Digi<span className="text-[#00a896] dark:text-cyan-400">Records</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Fast PHR
            </span>
          </div>
        </div>
      ),
    },

    // 5. DOCTOR NETWORK (Stethoscope Node)
    {
      title: 'Doctor Network',
      ariaLabel: 'Doctor Network',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <path d="M6 5v6a8 8 0 0 0 16 0V5" />
            <path d="M14 19v3a6 6 0 0 0 6 6h1" />
            <circle cx="25" cy="28" r="2.5" className="fill-current stroke-none" />
            <circle cx="6" cy="5" r="1.5" className="fill-current" />
            <circle cx="22" cy="5" r="1.5" className="fill-current" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              Doc<span className="text-[#00a896] dark:text-cyan-400">Network</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Verified MDs
            </span>
          </div>
        </div>
      ),
    },

    // 6. HOSPITAL NETWORK (Hospital Telemetry)
    {
      title: 'Hospital Network',
      ariaLabel: 'Hospital Network',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <rect x="4" y="4" width="24" height="24" rx="3" />
            <path d="M16 9v14" />
            <path d="M9 16h14" />
            <circle cx="16" cy="16" r="5" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              Care<span className="text-[#00a896] dark:text-cyan-400">Network</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Hospitals & OPD
            </span>
          </div>
        </div>
      ),
    },

    // 7. EMERGENCY CARE (ECG Pulse Cross)
    {
      title: 'Emergency Care',
      ariaLabel: 'Emergency Care',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <path d="M29 16h-5l-4 11L12 5l-4 11H3" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              SOS<span className="text-rose-500">Pulse</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              Emergency QR
            </span>
          </div>
        </div>
      ),
    },

    // 8. DATA VAULT (256-Bit Lock)
    {
      title: 'Data Vault',
      ariaLabel: 'Protected Health Data Vault',
      node: (
        <div className="group flex items-center gap-2.5 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-108 select-none">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-400 transition-colors duration-300 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
            <rect x="5" y="14" width="22" height="14" rx="3" />
            <path d="M10 14V9a6 6 0 0 1 12 0v5" />
            <circle cx="16" cy="21" r="2" className="fill-current stroke-none" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-300 leading-none">
              Data<span className="text-[#00a896] dark:text-cyan-400">Vault</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              256-Bit Encrypted
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

      {/* PURE STANDALONE HEALTHCARE LOGO STRIP LOOP */}
      <div className="relative py-1">
        <LogoLoop
          logos={brandLogos}
          speed={40}
          direction="left"
          gap={56}
          logoHeight={40}
          hoverSpeed={0}
          scaleOnHover={false}
          fadeOut
          ariaLabel="Trusted Healthcare Ecosystem Brand Logos"
        />
      </div>
    </section>
  );
};

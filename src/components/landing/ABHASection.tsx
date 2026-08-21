import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Lock, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';


interface ABHASectionProps {
  onManageConnection: () => void;
}

export const ABHASection: React.FC<ABHASectionProps> = ({ onManageConnection }) => {
  const workflowSteps = [
    {
      step: '01',
      title: 'ABHA Identity',
      desc: 'Unique 14-digit government digital health ID linking your healthcare ecosystem.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Consent Gate',
      desc: 'Encrypted request generated whenever a hospital or doctor requests record access.',
      icon: Lock,
    },
    {
      step: '03',
      title: 'Authorized Records',
      desc: 'Targeted documents retrieved securely from linked HIP labs and diagnostic centers.',
      icon: FileCheck2,
    },
    {
      step: '04',
      title: 'Care Provider',
      desc: 'Attending doctor inspects verified medical history with time-bound authorization.',
      icon: Building2,
    },
  ];

  return (
    <section id="abha" className="py-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Official ABDM Integration Ready</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            Connected to India’s Digital Health Ecosystem
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
            MediCare integrates with Ayushman Bharat Digital Mission (ABDM). Your ABHA address works as your key to authorize and receive health records from participating healthcare providers nationwide.
          </p>
        </div>

        {/* WORKFLOW DIAGRAM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 relative">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3 shadow-md backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF5B22] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>

                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-slate-800 p-1 rounded-full text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE ABHA CARD */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                ABHA
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Ayushman Bharat Health Account</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ABDM Integration Status: Linked & Verified</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              ✓ Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-1">ABHA Number</p>
              <p className="font-mono text-lg font-bold text-[#00a896] dark:text-orange-400 tracking-wider">
                14-XXXX-XXXX-8921
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-1">ABHA Address</p>
              <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                lalith.patel@abdm
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              MediCare routes authorization requests strictly through official ABDM gateway protocols.
            </p>

            <button
              onClick={onManageConnection}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold text-white bg-[#00a896] hover:bg-[#00897b] shadow-md transition-all gap-2 shrink-0 cursor-pointer"
            >
              <span>Manage Connection</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Calendar, FileText, Sparkles, Check } from 'lucide-react';

interface TodaysFocusGridProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const TodaysFocusGrid: React.FC<TodaysFocusGridProps> = ({ onNavigate, onToast }) => {
  const [medTaken, setMedTaken] = useState(false);

  const handleTakeMed = () => {
    setMedTaken(true);
    onToast('✓ Amoxicillin 500mg marked as taken!');
  };

  return (
    <section className="space-y-3 font-sans h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Focus
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Your high-priority health tasks & scheduled activities for today.
          </p>
        </div>
      </div>

      {/* 2x2 Grid that perfectly fits the half-width dashboard column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">

        {/* CARD 1: MEDICINE */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100/40 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-amber-500/20 dark:border-amber-500/10 shadow-[0_4px_16px_rgba(245,158,11,0.08),_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(245,158,11,.12) 0%,transparent 70%)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#fde68a,#f59e0b)', boxShadow: '0 3px 10px rgba(245,158,11,.3)' }}>
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(245,158,11,.12)', color: '#92400e', border: '1px solid rgba(245,158,11,.25)' }}>
              12:00 PM
            </span>
          </div>

          <div className="my-2.5 space-y-0.5 relative z-10">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              Amoxicillin 500mg
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              1 Capsule after lunch
            </p>
          </div>

          <button
            onClick={handleTakeMed}
            disabled={medTaken}
            className="w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative z-10"
            style={medTaken
              ? { background: 'rgba(16,185,129,.12)', color: '#059669', border: '1px solid rgba(16,185,129,.25)' }
              : { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#1c1917', boxShadow: '0 3px 10px rgba(245,158,11,.3)' }}
          >
            {medTaken
              ? <><Check className="w-3.5 h-3.5" /><span>Taken ✓</span></>
              : <span>Take Dose Now</span>}
          </button>
        </motion.div>

        {/* CARD 2: APPOINTMENT */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/40 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-blue-500/20 dark:border-blue-500/10 shadow-[0_4px_16px_rgba(59,130,246,0.07),_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#93c5fd,#3b82f6)', boxShadow: '0 3px 10px rgba(59,130,246,.3)' }}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(59,130,246,.12)', color: '#1e40af', border: '1px solid rgba(59,130,246,.25)' }}>
              10:30 AM
            </span>
          </div>

          <div className="my-2.5 space-y-0.5 relative z-10">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              Dr. Rajesh Kumar
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Cardiology Tele-Consult
            </p>
          </div>

          <button
            onClick={() => onNavigate('appointments')}
            className="w-full py-2 px-3 rounded-xl text-white text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer relative z-10"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 3px 10px rgba(59,130,246,.3)' }}
          >
            View Appointment
          </button>
        </motion.div>

        {/* CARD 3: HEALTH RECORD */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100/40 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-green-500/20 dark:border-green-500/10 shadow-[0_4px_16px_rgba(34,197,94,0.07),_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(34,197,94,.1) 0%,transparent 70%)' }} />
          <div className="flex items-center justify-between relative z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#86efac,#16a34a)', boxShadow: '0 3px 10px rgba(22,163,74,.3)' }}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(34,197,94,.12)', color: '#166534', border: '1px solid rgba(34,197,94,.25)' }}>
              New Report
            </span>
          </div>

          <div className="my-2.5 space-y-0.5 relative z-10">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              CBC & Blood Panel
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Lab Results Ready to View
            </p>
          </div>

          <button
            onClick={() => onNavigate('records')}
            className="w-full py-2 px-3 rounded-xl text-white text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer relative z-10"
            style={{ background: 'linear-gradient(135deg,#00a896,#059669)', boxShadow: '0 3px 10px rgba(0,168,150,.3)' }}
          >
            View Lab Report
          </button>
        </motion.div>

        {/* CARD 4: AI HEALTH */}
        <motion.div
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
          style={{
            background: 'linear-gradient(150deg,#2e1065 0%,#3b0764 40%,#1e1b4b 100%)',
            border: '1.5px solid rgba(167,139,250,.25)',
            boxShadow: '0 4px 24px rgba(109,40,217,.2), 0 1px 3px rgba(0,0,0,.1)'
          }}
        >
          {/* Mesh glows */}
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(139,92,246,.25) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(6,182,212,.15) 0%,transparent 70%)' }} />

          <div className="flex items-center justify-between relative z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base"
              style={{ background: 'linear-gradient(135deg,rgba(139,92,246,.5),rgba(109,40,217,.7))', border: '1px solid rgba(167,139,250,.3)', boxShadow: '0 3px 10px rgba(109,40,217,.4)' }}>
              🤖
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,rgba(139,92,246,.4),rgba(99,102,241,.4))', border: '1px solid rgba(167,139,250,.3)', color: '#c4b5fd' }}>
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Powered</span>
            </span>
          </div>

          <div className="my-2.5 space-y-0.5 relative z-10">
            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
              Ask AI Assistant
            </h4>
            <p className="text-[11px] text-purple-300 font-medium">
              Instant symptoms & lab insights
            </p>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="w-full py-2 px-3 rounded-xl text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative z-10 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 3px 12px rgba(124,58,237,.4)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Companion</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

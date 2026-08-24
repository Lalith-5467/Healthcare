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
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Today's Focus
          </h2>
          <p className="text-xs text-slate-300">
            Your high-priority health tasks & scheduled activities for today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: MEDICINE */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Pill className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
              12:00 PM
            </span>
          </div>

          <div className="my-3 space-y-1">
            <h4 className="text-xs font-extrabold text-white line-clamp-1">Amoxicillin 500mg</h4>
            <p className="text-[11px] text-slate-300 font-medium">1 Capsule after lunch</p>
          </div>

          <button
            onClick={handleTakeMed}
            disabled={medTaken}
            className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${
              medTaken
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
            }`}
          >
            {medTaken ? (
              <>
                <Check className="w-4 h-4" />
                <span>Taken</span>
              </>
            ) : (
              <span>Take Dose Now</span>
            )}
          </button>
        </motion.div>

        {/* CARD 2: APPOINTMENT */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-blue-500/30 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-mono">
              10:30 AM
            </span>
          </div>

          <div className="my-3 space-y-1">
            <h4 className="text-xs font-extrabold text-white line-clamp-1">Dr. Rajesh Kumar</h4>
            <p className="text-[11px] text-slate-300 font-medium">Cardiology Tele-Consult</p>
          </div>

          <button
            onClick={() => onNavigate('appointments')}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer shadow"
          >
            View Appointment
          </button>
        </motion.div>

        {/* CARD 3: HEALTH RECORD */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              New Report
            </span>
          </div>

          <div className="my-3 space-y-1">
            <h4 className="text-xs font-extrabold text-white line-clamp-1">CBC & Blood Panel</h4>
            <p className="text-[11px] text-slate-300 font-medium">Lab Results Ready to View</p>
          </div>

          <button
            onClick={() => onNavigate('records')}
            className="w-full py-2 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer shadow"
          >
            View Lab Report
          </button>
        </motion.div>

        {/* CARD 4: AI HEALTH */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-lg hover:border-purple-400 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-4.5 h-4.5 text-purple-300" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-mono shadow-sm">
              AI Powered
            </span>
          </div>

          <div className="my-3 space-y-1">
            <h4 className="text-xs font-extrabold text-white line-clamp-1">Ask AI Assistant</h4>
            <p className="text-[11px] text-slate-300 font-medium">Instant symptoms & lab insights</p>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Companion</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

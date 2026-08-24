import React, { useState } from 'react';
import { Pill, Calendar, FileText, Sparkles, Check } from 'lucide-react';

interface TodaysFocusGridProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const TodaysFocusGrid: React.FC<TodaysFocusGridProps> = ({ onNavigate, onToast }) => {
  const [medTaken, setMedTaken] = useState(false);

  const handleTakeMed = () => {
    setMedTaken(true);
    onToast('Amoxicillin 500mg marked as taken!');
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Focus
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your important health activities for today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: MEDICINE */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Pill className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
              12:00 PM
            </span>
          </div>

          <div className="my-3 space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Medicine A (Amoxicillin)</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">1 Capsule after lunch</p>
          </div>

          <button
            onClick={handleTakeMed}
            disabled={medTaken}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              medTaken
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
            }`}
          >
            {medTaken ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Taken</span>
              </>
            ) : (
              <span>Take Now</span>
            )}
          </button>
        </div>

        {/* CARD 2: APPOINTMENT */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
              10:30 AM
            </span>
          </div>

          <div className="my-3 space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Dr. Rajesh Kumar</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">General Physician Consultation</p>
          </div>

          <button
            onClick={() => onNavigate('appointments')}
            className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm"
          >
            View Appointment
          </button>
        </div>

        {/* CARD 3: HEALTH RECORD */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              New Report
            </span>
          </div>

          <div className="my-3 space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">CBC & Blood Panel</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Lab Results Ready to View</p>
          </div>

          <button
            onClick={() => onNavigate('records')}
            className="w-full py-1.5 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm"
          >
            View Report
          </button>
        </div>

        {/* CARD 4: AI HEALTH */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              AI Powered
            </span>
          </div>

          <div className="my-3 space-y-0.5">
            <h4 className="text-xs font-bold text-white truncate">Ask AI Assistant</h4>
            <p className="text-[11px] text-slate-300">Instant symptoms & report breakdown</p>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask AI</span>
          </button>
        </div>

      </div>
    </section>
  );
};

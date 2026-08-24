import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SOSCountdownOverlayProps {
  countdown: number;
  isOpen: boolean;
  onCancel: () => void;
}

export const SOSCountdownOverlay: React.FC<SOSCountdownOverlayProps> = ({
  countdown,
  isOpen,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-rose-950/70 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-200 select-none font-sans">
      {/* GLOW BACKGROUND */}
      <div className="w-80 h-80 rounded-full bg-rose-500/20 absolute blur-3xl pointer-events-none animate-pulse" />

      {/* HEADER */}
      <div className="space-y-2 relative z-10 max-w-md">
        <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-200 dark:text-rose-300 border border-rose-400/40 text-xs font-extrabold font-mono uppercase tracking-widest inline-flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 animate-bounce text-rose-300" />
          <span>Emergency Alert Preparing</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Emergency SOS Sequence Active</h2>
        <p className="text-xs text-rose-100 dark:text-slate-300 font-medium">
          Press CANCEL SOS below if this was pressed by accident.
        </p>
      </div>

      {/* LARGE COUNTDOWN NUMBER */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-rose-900/90 dark:bg-rose-950/80 border-4 border-rose-400 dark:border-rose-500 flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-pulse">
          <span className="text-7xl sm:text-8xl font-black text-white dark:text-rose-400 font-mono tracking-tighter drop-shadow-lg">
            {countdown}
          </span>
        </div>
      </div>

      {/* CANCEL BUTTON */}
      <div className="relative z-10 w-full max-w-xs space-y-3">
        <button
          onClick={onCancel}
          className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-lg border-2 border-slate-300 dark:border-slate-700 shadow-2xl transition-transform active:scale-95 cursor-pointer font-sans"
        >
          🛑 CANCEL SOS NOW
        </button>

        <p className="text-[10px] text-rose-200 dark:text-slate-400 font-mono">
          Demo Simulation • No real emergency calls will be made
        </p>
      </div>
    </div>
  );
};

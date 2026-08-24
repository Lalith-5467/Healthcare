import React from 'react';
import { Upload, Scan, ShieldCheck } from 'lucide-react';

interface RecordsHeaderProps {
  onOpenUpload: () => void;
  onNavigateScan: () => void;
}

export const RecordsHeader: React.FC<RecordsHeaderProps> = ({
  onOpenUpload,
  onNavigateScan
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* TITLE & SUBTITLE */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Medical Records
          </h1>
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-[#00a896]/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>256-Bit Encrypted Vault</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Securely manage and access all your health documents in one place.
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        <button
          onClick={onNavigateScan}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Scan className="w-4 h-4 text-cyan-400" />
          <span>Scan Document</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Record</span>
        </button>
      </div>
    </header>
  );
};

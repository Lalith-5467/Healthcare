import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { CheckupHistoryItem } from './checkupData';

interface CheckupHistoryDrawerProps {
  record: CheckupHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onDeleteRecord?: (id: string) => void;
}

export const CheckupHistoryDrawer: React.FC<CheckupHistoryDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onDelete,
  onDeleteRecord,
}) => {
  if (!isOpen || !record) return null;

  const handleDelete = () => {
    if (onDelete) onDelete(record.id);
    else if (onDeleteRecord) onDeleteRecord(record.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
              {record.date} • {record.time}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{record.type}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECORD DETAILS */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs font-medium">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 font-sans font-medium">Completion Score:</span>
              <span className="font-extrabold text-[#00a896] dark:text-teal-400 text-sm">{record.completionScore}%</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-600 dark:text-slate-400 font-sans font-medium">Status:</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{record.status}</span>
            </div>
          </div>

          {/* ANSWERS BREAKDOWN */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-mono">Answers Log</h4>
            <div className="space-y-2 font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Wellness:</span> <strong>{record.answers.wellness}</strong></div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Energy:</span> <strong>{record.answers.energy}</strong></div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Sleep:</span> <strong>{record.answers.sleep}</strong></div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Activity:</span> <strong>{record.answers.activity}</strong></div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="w-full py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Check-Up Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};

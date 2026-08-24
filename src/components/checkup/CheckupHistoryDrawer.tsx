import React from 'react';
import { X, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import type { CheckupHistoryItem } from './checkupData';

interface CheckupHistoryDrawerProps {
  record: CheckupHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRecord: (id: string) => void;
}

export const CheckupHistoryDrawer: React.FC<CheckupHistoryDrawerProps> = ({
  record,
  isOpen,
  onClose,
  onDeleteRecord,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              {record.date} • {record.time}
            </span>
            <h3 className="text-base font-extrabold text-white">{record.type}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECORD DETAILS */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Completion Score:</span>
              <span className="font-mono font-bold text-teal-400 text-sm">{record.completionScore}%</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">{record.status}</span>
            </div>
          </div>

          {/* ANSWERS BREAKDOWN */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider text-slate-400">Answers Log</h4>
            <div className="space-y-2 font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Wellness:</span> <strong>{record.answers.wellness}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Energy:</span> <strong>{record.answers.energy}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Sleep:</span> <strong>{record.answers.sleep}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Activity:</span> <strong>{record.answers.activity}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Hydration:</span> <strong>{record.answers.hydration}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Mood:</span> <strong>{record.answers.mood}</strong></div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between"><span>Symptoms:</span> <strong>{record.answers.symptoms.join(', ')}</strong></div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDeleteRecord(record.id);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Check-Up Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};

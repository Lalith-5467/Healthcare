import React from 'react';
import { X, CheckCircle2, ShieldCheck, ExternalLink, Calendar, Bell, Activity } from 'lucide-react';
import type { CheckupHistoryItem } from './checkupData';

interface CheckupSummaryModalProps {
  record: CheckupHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToReminders: () => void;
}

export const CheckupSummaryModal: React.FC<CheckupSummaryModalProps> = ({
  record,
  isOpen,
  onClose,
  onNavigateToAnalytics,
  onNavigateToAppointments,
  onNavigateToReminders,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {record.date} • {record.time}
              </span>
              <h3 className="text-lg font-extrabold text-white">Check-Up Completed</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPLETION SCORE HERO CARD */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Form Completion Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-teal-400 font-mono">{record.completionScore}%</span>
              <span className="text-[11px] text-slate-300 font-semibold">Information Recorded</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-mono">
            Neutral Form Metric
          </span>
        </div>

        {/* SUMMARY RESPONSE BREAKDOWN */}
        <div className="space-y-3 text-xs">
          <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider text-slate-400">Recorded Activity Summary</h4>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Wellness:</span>
              <strong className="text-teal-400">{record.answers.wellness}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Energy:</span>
              <strong className="text-cyan-400">{record.answers.energy}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Sleep:</span>
              <strong className="text-purple-400">{record.answers.sleep}</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Hydration:</span>
              <strong className="text-blue-400">{record.answers.hydration}</strong>
            </div>
          </div>
        </div>

        {/* SAFETY NOTICE BANNER */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-bold">Personal Tracking Reminder</p>
            <p className="text-[11px] mt-0.5 opacity-90">
              This summary is generated from personal health tracking entries. It does not provide clinical diagnosis or medical treatment plans.
            </p>
          </div>
        </div>

        {/* CROSS MODULE ACTION BUTTONS */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onNavigateToAnalytics();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>View in Analytics</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToReminders();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Set Reminder</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToAppointments();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Discuss Activity in Appointments</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

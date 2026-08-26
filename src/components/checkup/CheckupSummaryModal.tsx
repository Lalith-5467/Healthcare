import React from 'react';
import { X, CheckCircle2, ShieldCheck, Calendar, Bell, Activity } from 'lucide-react';
import type { CheckupHistoryItem } from './checkupData';

interface CheckupSummaryModalProps {
  record: CheckupHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToAppointments?: () => void;
  onNavigateToReminders?: () => void;
}

export const CheckupSummaryModal: React.FC<CheckupSummaryModalProps> = ({
  record,
  isOpen,
  onClose,
  onNavigate,
  onNavigateToAnalytics,
  onNavigateToAppointments,
  onNavigateToReminders,
}) => {
  if (!isOpen || !record) return null;

  const goToAnalytics = () => {
    onClose();
    if (onNavigateToAnalytics) onNavigateToAnalytics();
    else if (onNavigate) onNavigate('analytics');
  };

  const goToAppointments = () => {
    onClose();
    if (onNavigateToAppointments) onNavigateToAppointments();
    else if (onNavigate) onNavigate('appointments');
  };

  const goToReminders = () => {
    onClose();
    if (onNavigateToReminders) onNavigateToReminders();
    else if (onNavigate) onNavigate('reminders');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                {record.date} • {record.time}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Check-Up Completed</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPLETION SCORE HERO CARD */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Form Completion Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#00a896] dark:text-teal-400 font-mono">{record.completionScore}%</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold font-sans">Information Recorded</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 font-mono">
            Neutral Form Metric
          </span>
        </div>

        {/* SUMMARY RESPONSE BREAKDOWN */}
        <div className="space-y-3 text-xs">
          <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-mono">Recorded Activity Summary</h4>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Wellness:</span>
              <strong className="text-[#00a896] dark:text-teal-400">{record.answers.wellness}</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Energy:</span>
              <strong className="text-[#00a896] dark:text-cyan-400">{record.answers.energy}</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Sleep:</span>
              <strong className="text-purple-700 dark:text-purple-400">{record.answers.sleep}</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Hydration:</span>
              <strong className="text-blue-700 dark:text-blue-400">{record.answers.hydration}</strong>
            </div>
          </div>
        </div>

        {/* SAFETY NOTICE BANNER */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 shadow-sm">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-bold">Personal Tracking Reminder</p>
            <p className="text-[11px] mt-0.5 opacity-90 font-medium">
              This summary is generated from personal health tracking entries. It does not provide clinical diagnosis or medical treatment plans.
            </p>
          </div>
        </div>

        {/* CROSS MODULE ACTION BUTTONS */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={goToAnalytics}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-teal-300 font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Activity className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
              <span>View in Analytics</span>
            </button>

            <button
              onClick={goToReminders}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Set Reminder</span>
            </button>
          </div>

          <button
            onClick={goToAppointments}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
            <span>Discuss Activity in Appointments</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

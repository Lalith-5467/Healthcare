import React from 'react';
import { X, Bell, Pill, Calendar, Package, Video, ExternalLink, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { ReminderItem, NotificationLog } from './remindersData';

interface ReminderDetailsDrawerProps {
  item: ReminderItem | NotificationLog | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: string) => void;
  onDismiss: (id: string) => void;
  onAcceptFollowUp?: (id: string) => void;
  onDeclineFollowUp?: (id: string) => void;
}

export const ReminderDetailsDrawer: React.FC<ReminderDetailsDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onNavigateModule,
  onDismiss,
  onAcceptFollowUp,
  onDeclineFollowUp,
}) => {
  if (!isOpen || !item) return null;

  const isReminder = 'repeat' in item;
  const remItem = isReminder ? (item as ReminderItem) : null;
  const isFollowUp = !!remItem?.sourcePrescriptionId || !!remItem?.followUpStatus;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Medication': return <Pill className="w-5 h-5 text-amber-500" />;
      case 'Appointment': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'Pharmacy': return <Package className="w-5 h-5 text-emerald-500" />;
      case 'Consultation': return <Video className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-[#00a896]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
                  {item.category} • {item.id}
                </span>
                {remItem?.sourcePrescriptionId ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20">
                    Scheduled
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    Upcoming
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="py-4 space-y-4 text-xs font-sans">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {item.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Scheduled Date:</span>
              <strong className="text-slate-900 dark:text-white">{item.date}</strong>
            </div>

            {isReminder && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Time:</span>
                <strong className="text-slate-900 dark:text-white">{(item as ReminderItem).time}</strong>
              </div>
            )}

            {remItem?.sourcePrescriptionId && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Source Prescription:</span>
                <strong className="text-[#00a896] dark:text-cyan-300">{remItem.sourcePrescriptionId}</strong>
              </div>
            )}

            {isReminder && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Frequency:</span>
                <strong className="text-[#00a896] dark:text-cyan-400">{(item as ReminderItem).repeat}</strong>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2.5 font-sans">
          {item.relatedModule && (
            <button
              onClick={() => {
                onClose();
                onNavigateModule(item.relatedModule!);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to {item.category} Module</span>
            </button>
          )}

          <button
            onClick={() => onDismiss(item.id)}
            className="w-full py-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dismiss Reminder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

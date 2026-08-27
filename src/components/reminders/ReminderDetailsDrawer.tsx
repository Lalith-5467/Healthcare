import React from 'react';
import { X, Bell, Pill, Calendar, Package, Video, ExternalLink, Trash2 } from 'lucide-react';
import type { ReminderItem, NotificationLog } from './remindersData';

interface ReminderDetailsDrawerProps {
  item: ReminderItem | NotificationLog | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: string) => void;
  onDismiss: (id: string) => void;
}

export const ReminderDetailsDrawer: React.FC<ReminderDetailsDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onNavigateModule,
  onDismiss,
}) => {
  if (!isOpen || !item) return null;

  const isReminder = 'repeat' in item;

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
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
                {item.category} • {item.id}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            {item.description}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-2.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">{isReminder ? 'Scheduled Time:' : 'Time:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {'time' in item ? item.time : item.timeAgo}
              </strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-500 font-sans">Date:</span>
              <strong className="text-slate-800 dark:text-slate-200">{item.date}</strong>
            </div>
            {isReminder && (
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500 font-sans">Frequency:</span>
                <strong className="text-teal-600 dark:text-teal-400">{(item as ReminderItem).repeat}</strong>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2 font-sans">
          {item.relatedModule && (
            <button
              onClick={() => {
                onClose();
                onNavigateModule(item.relatedModule!);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to {item.category} Page</span>
            </button>
          )}

          <button
            onClick={() => {
              onDismiss(item.id);
              onClose();
            }}
            className="w-full py-2 text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dismiss Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};

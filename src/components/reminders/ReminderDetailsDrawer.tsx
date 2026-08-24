import React from 'react';
import { X, Bell, Pill, Calendar, Package, Video, Settings, ExternalLink, Check, Trash2 } from 'lucide-react';
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
      case 'Medication': return <Pill className="w-5 h-5 text-amber-400" />;
      case 'Appointment': return <Calendar className="w-5 h-5 text-cyan-400" />;
      case 'Pharmacy': return <Package className="w-5 h-5 text-emerald-400" />;
      case 'Consultation': return <Video className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {item.category} • {item.id}
              </span>
              <h3 className="text-base font-extrabold text-white">{item.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div>
              <span className="font-bold text-slate-400 block mb-1">Description</span>
              <p className="text-slate-200 leading-relaxed">{item.description}</p>
            </div>

            {isReminder && (
              <>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                  <span className="text-slate-400">Scheduled Time:</span>
                  <span className="font-mono font-bold text-cyan-300">{(item as ReminderItem).date} • {(item as ReminderItem).time}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                  <span className="text-slate-400">Repeat Pattern:</span>
                  <span className="font-semibold text-white">{(item as ReminderItem).repeat}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                  <span className="text-slate-400">Notification Timing:</span>
                  <span className="font-semibold text-teal-400">{(item as ReminderItem).timing}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                  <span className="text-slate-400">Priority Level:</span>
                  <span className="font-bold text-amber-400">{(item as ReminderItem).priority}</span>
                </div>
              </>
            )}
          </div>

          {item.relatedModule && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
              <span className="font-bold text-cyan-300 block">Smart Module Connection</span>
              <p className="text-[11px] text-slate-300">
                This reminder is synchronized with the <strong className="text-white capitalize">{item.relatedModule}</strong> workspace.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          {item.relatedModule && (
            <button
              onClick={() => {
                onClose();
                onNavigateModule(item.relatedModule!);
              }}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Related Module ({item.relatedModule})</span>
            </button>
          )}

          <button
            onClick={() => {
              onDismiss(item.id);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dismiss Reminder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

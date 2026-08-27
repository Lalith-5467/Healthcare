import React from 'react';
import { X, Bell, Pill, Calendar, Package, Video, ExternalLink, Trash2, Clock } from 'lucide-react';
import type { ReminderItem, NotificationLog } from './remindersData';

interface ReminderDetailsDrawerProps {
  item: ReminderItem | NotificationLog | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: string) => void;
  onDismiss: (id: string) => void;
  onAcceptFollowUp?: (id: string) => void;
  onDeclineFollowUp?: (id: string) => void;
  onSnoozeReminder?: (id: string) => void;
}

export const ReminderDetailsDrawer: React.FC<ReminderDetailsDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onNavigateModule,
  onDismiss,
  onAcceptFollowUp,
  onDeclineFollowUp,
  onSnoozeReminder,
}) => {
  if (!isOpen || !item) return null;

  const isReminder = 'repeat' in item;
  const remItem = isReminder ? (item as ReminderItem) : null;
  const isPending = remItem?.status === 'Pending' || remItem?.followUpStatus === 'Pending';
  const isConfirmed = remItem?.status === 'Confirmed' || remItem?.status === 'Upcoming' || remItem?.status === 'Snoozed' || remItem?.status === 'Due Now' || remItem?.followUpStatus === 'Accepted';
  const isDeclined = remItem?.status === 'Declined' || remItem?.followUpStatus === 'Declined';
  const isCompleted = remItem?.status === 'Completed';
  const isCancelled = remItem?.status === 'Cancelled';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Medication': return <Pill className="w-5 h-5 text-amber-500" />;
      case 'Appointment': return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'Pharmacy': return <Package className="w-5 h-5 text-blue-500" />;
      case 'Consultation': return <Video className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-[#00a896]" />;
    }
  };

  const formatFullDate = (dStr: string) => {
    const months: Record<string, string> = {
      Jan: 'September', // fallback default
      Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
      Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
    };
    
    const parts = dStr.split(' ');
    if (parts.length === 3) {
      const monthPart = parts[1];
      const monthFull = months[monthPart] || monthPart;
      return `${parts[0]} ${monthFull} ${parts[2]}`;
    }
    return dStr;
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0 font-sans">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400 font-mono">
                  {item.category} Details
                </span>
                {isPending && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 font-mono font-mono">
                    Pending
                  </span>
                )}
                {isConfirmed && !isCompleted && !isDeclined && !isCancelled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 font-mono">
                    Confirmed
                  </span>
                )}
                {isCompleted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono font-mono">
                    Completed
                  </span>
                )}
                {isDeclined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20 font-mono">
                    Declined
                  </span>
                )}
                {isCancelled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-500/10 text-slate-600 border border-slate-500/20 font-mono">
                    Cancelled
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {isConfirmed && remItem?.category === 'Appointment' ? 'Appointment Details' : item.title}
              </h3>
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
          {item.description && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              {item.description}
            </p>
          )}

          {remItem?.category === 'Appointment' ? (
            <div className="space-y-3.5 pt-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Doctor</div>
                  <div className="text-xs font-extrabold text-slate-955 dark:text-white">{remItem.doctorName || 'Dr. Arun Kumar, MBBS, MD'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Department</div>
                  <div className="text-xs font-extrabold text-slate-955 dark:text-white">{remItem.clinicName || 'General Medicine'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Date</div>
                  <div className="text-xs font-extrabold text-slate-955 dark:text-white">{formatFullDate(remItem.date)}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Time</div>
                  <div className="text-xs font-extrabold text-slate-955 dark:text-white">{remItem.time}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Status</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      isPending ? 'bg-amber-400' :
                      isCompleted ? 'bg-emerald-400' :
                      isDeclined ? 'bg-rose-450' : 'bg-teal-400'
                    }`} />
                    <span className="text-xs font-extrabold text-slate-955 dark:text-white">
                      {isPending ? 'Pending' :
                       isCompleted ? 'Completed' :
                       isDeclined ? 'Declined' : 'Confirmed'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Reminder</div>
                  <div className="text-xs font-extrabold text-slate-955 dark:text-white">
                    {isDeclined ? 'Disabled' : 'Enabled'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Scheduled Date:</span>
                <strong className="text-slate-905 dark:text-white">{item.date}</strong>
              </div>

              {isReminder && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Time:</span>
                  <strong className="text-slate-905 dark:text-white">{(item as ReminderItem).time}</strong>
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
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2.5 font-sans">
          {/* PENDING ACTIONS */}
          {isPending && onAcceptFollowUp && onDeclineFollowUp && (
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => {
                  onAcceptFollowUp(item.id);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  onDeclineFollowUp(item.id);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                Decline
              </button>
            </div>
          )}

          {/* CONFIRMED ACTIONS */}
          {isConfirmed && !isCompleted && !isDeclined && !isCancelled && onSnoozeReminder && (
            <button
              onClick={() => {
                onSnoozeReminder(remItem!.id);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Clock className="w-4 h-4" />
              <span>Snooze Reminder</span>
            </button>
          )}

          {item.relatedModule && !isPending && !isCompleted && !isDeclined && !isCancelled && (
            <button
              onClick={() => {
                onClose();
                onNavigateModule(item.relatedModule!);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to {item.category} Module</span>
            </button>
          )}

          {/* Only show dismiss for non-pending and non-completed reminders */}
          {!isPending && !isCompleted && !isDeclined && !isCancelled && (
            <button
              onClick={() => onDismiss(item.id)}
              className="w-full py-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Dismiss Reminder</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar, Upload, QrCode, Pill, Building2, Activity } from 'lucide-react';

interface QuickActionsGridProps {
  onNavigate: (id: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onNavigate }) => {
  const actions = [
    { id: 'appointments', label: 'Book Appointment', icon: Calendar, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { id: 'scan', label: 'Upload Record', icon: Upload, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    { id: 'scan', label: 'Scan Document', icon: QrCode, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { id: 'medicines', label: 'Add Medicine', icon: Pill, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { id: 'hospitals', label: 'Find Hospital', icon: Building2, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'checkup', label: 'Health Check-up', icon: Activity, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' }
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(act.id)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/30 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer active:scale-98"
            >
              <div className={`p-2.5 rounded-xl border ${act.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { IconAlertCircle, IconCheck, IconClock, IconActivity } from '@tabler/icons-react';

const ALERTS = [
  {
    id: 1,
    patient: 'Meenakshi Raman',
    message: 'BP elevated',
    severity: 'critical',
    icon: IconActivity
  },
  {
    id: 2,
    patient: 'Lakshmi N.',
    message: 'Medication due in 20 min',
    severity: 'warning',
    icon: IconClock
  }
];

export const NursePatientAlerts: React.FC = () => {
  if (ALERTS.length === 0) {
    return (
      <section className="pt-2">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wider flex items-center gap-2">
          Patient alerts
        </h3>
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
          <IconCheck className="w-5 h-5" />
          No patient alerts right now
        </div>
      </section>
    );
  }

  return (
    <section className="pt-2">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wider flex items-center gap-2">
        Patient alerts <span className="text-slate-400 font-medium">· {ALERTS.length}</span>
      </h3>
      
      <div className="flex flex-col gap-2">
        {ALERTS.map(alert => (
          <div 
            key={alert.id}
            className={`flex items-start sm:items-center gap-3 p-3.5 rounded-xl border bg-white dark:bg-[#1b1e27] ${
              alert.severity === 'critical' 
                ? 'border-rose-200 dark:border-rose-900/40 shadow-[0_2px_10px_-4px_rgba(225,29,72,0.1)]' 
                : 'border-orange-200 dark:border-orange-900/40 shadow-[0_2px_10px_-4px_rgba(249,115,22,0.1)]'
            }`}
          >
            <div className={`mt-0.5 sm:mt-0 p-1.5 rounded-full ${
              alert.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
            }`}>
              <alert.icon className="w-4 h-4" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {alert.patient}
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className={`text-sm font-medium ${
                alert.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'
              }`}>
                {alert.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

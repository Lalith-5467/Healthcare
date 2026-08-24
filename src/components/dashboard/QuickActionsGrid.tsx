import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Upload, QrCode, Pill, Building2, Activity } from 'lucide-react';

interface QuickActionsGridProps {
  onNavigate: (id: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onNavigate }) => {
  const actions = [
    { id: 'appointments', label: 'Book Appointment', icon: Calendar, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'scan', label: 'Upload Record', icon: Upload, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
    { id: 'scan', label: 'Scan Document', icon: QrCode, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'medicines', label: 'Add Medicine', icon: Pill, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'hospitals', label: 'Find Hospital', icon: Building2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'checkup', label: 'Health Check-up', icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
  ];

  return (
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate(act.id)}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center text-center space-y-2.5 group cursor-pointer"
            >
              <div className={`p-3 rounded-2xl border ${act.color} group-hover:scale-110 transition-transform shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-white leading-tight font-sans">
                {act.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, QrCode } from 'lucide-react';

interface EmergencyQuickCardProps {
  onOpenEmergency: () => void;
}

export const EmergencyQuickCard: React.FC<EmergencyQuickCardProps> = ({ onOpenEmergency }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-rose-100/60 to-white dark:from-rose-950/50 dark:via-rose-900/30 dark:to-slate-900 border border-rose-200 dark:border-rose-500/40 text-slate-900 dark:text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group font-sans"
    >
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0 animate-pulse">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            24x7 Emergency Assistance
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
            Quick access to your emergency contacts, 108 ambulance dispatch, & SOS QR card.
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenEmergency}
        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
      >
        <QrCode className="w-4 h-4" />
        <span>Open SOS QR Card</span>
      </motion.button>
    </motion.div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, RefreshCw } from 'lucide-react';


interface ABHAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ABHAModal: React.FC<ABHAModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xl">
              ABHA
            </div>
            <div>
              <h3 className="text-xl font-extrabold">ABHA Connection Manager</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Government ABDM Ecosystem Token</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Connection Status</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active & Synced
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">ABHA Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">14-9842-7712-8921</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Linked Providers</span>
              <span className="font-semibold text-slate-900 dark:text-white">3 Diagnostic Labs & 2 Hospitals</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs space-y-1">
            <p className="font-bold text-[#FF5B22]">Security Assurance</p>
            <p className="text-slate-600 dark:text-slate-300">
              MediCare does not store raw medical records. Data is fetched on-demand using encrypted ABDM gateway sessions.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close Window
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full text-xs font-bold text-slate-900 dark:text-white bg-[#FF5B22] hover:bg-[#e54c15] shadow-md flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-Sync Gateway
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

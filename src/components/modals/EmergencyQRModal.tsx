import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';

interface EmergencyQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyQRModal: React.FC<EmergencyQRModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-500/50 shadow-2xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden font-sans"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER */}
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-rose-600 dark:text-rose-400">Emergency First Responder View</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Authorized Scan Simulation • Encrypted Gateway</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Patient Identity</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">Lalith Patel</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Blood Group</span>
                <span className="font-extrabold text-rose-700 dark:text-rose-400 text-sm bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">O+ Positive</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Emergency Phone</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">+91 98765 43210</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-extrabold">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Alerts for ER Triage</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1 font-medium">
                <li>Severe Penicillin Allergy (Anaphylaxis Risk)</li>
                <li>Type-1 Insulin Dependent Diabetes</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 text-center font-medium">
            ✓ Full longitudinal records, lab reports, and doctor consultation notes remain confidential.
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 shadow-lg cursor-pointer transition-all"
          >
            Close Emergency View
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

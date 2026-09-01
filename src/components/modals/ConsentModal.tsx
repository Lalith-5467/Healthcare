import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';


interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose }) => {
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
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Active Consent Tokens</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage granted record permissions</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>Dr. Rajesh Kumar (Cardiology)</span>
                <span className="text-emerald-500 font-semibold">Active</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">Granted: Blood Work, Vitals, ECG</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-amber-500 font-semibold">Expires: Aug 26, 2026</span>
                <button onClick={onClose} className="text-[11px] text-rose-500 hover:underline font-bold">Revoke Access</button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full text-xs font-bold text-slate-900 dark:text-white bg-[#FF5B22] hover:bg-[#e54c15] shadow-md"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

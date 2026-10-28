import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export interface AdminDeleteConfirmModalProps {
  isOpen: boolean;
  itemType: string; // e.g. "Patient", "Doctor", "Nurse", "User"
  itemName: string;
  itemId?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  isOpen,
  itemType,
  itemName,
  itemId,
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative overflow-hidden space-y-5"
        >
          {/* Top Row with Danger Badge & Close Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center shrink-0 shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Heading & Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Delete {itemType} Record?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                "{itemName}"
              </strong>{' '}
              {itemId ? (
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  (ID: {itemId})
                </span>
              ) : null}?
            </p>
          </div>

          {/* Warning Callout Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] font-medium text-amber-900 dark:text-amber-200 leading-snug space-y-0.5">
              <p className="font-bold">Permanent Removal</p>
              <p className="text-amber-800/90 dark:text-amber-300/80">
                This action cannot be undone. All associated clinical credentials and directory access permissions will be permanently revoked.
              </p>
            </div>
          </div>

          {/* Actions: Cancel & Confirm Delete */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting...' : `Delete ${itemType}`}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

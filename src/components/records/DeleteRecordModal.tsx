import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface DeleteRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecordItem | null;
  onConfirmDelete: (id: string) => void;
}

export const DeleteRecordModal: React.FC<DeleteRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onConfirmDelete
}) => {
  if (!isOpen || !record) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Delete Medical Record</h3>
              <p className="text-xs text-rose-400 font-semibold">Destructive Action</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
            <span className="font-extrabold text-white block">{record.title}</span>
            <p className="text-slate-400">{record.type} • {record.date} • {record.hospital}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Are you sure you want to delete this medical record? This record will be permanently removed from your frontend health vault.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirmDelete(record.id);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Record</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, UserCheck, Users } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface ShareRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecordItem | null;
  onToast: (msg: string) => void;
}

export const ShareRecordModal: React.FC<ShareRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !record) return null;

  const handleCopyLink = () => {
    setCopied(true);
    onToast('✓ Record sharing link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWithDoctor = () => {
    onToast(`✓ Shared ${record.title} with Dr. Rajesh Kumar via ABDM Consent`);
    onClose();
  };

  const handleShareWithFamily = () => {
    onToast(`✓ Shared ${record.title} with linked family members`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Share Medical Record</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">{record.title}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {/* COPY LINK OPTION */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Encrypted Access Link</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://health.abdm.in/records/share?id=${record.id}`}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* DIRECT SHARE ACTION BUTTONS */}
            <button
              onClick={handleShareWithDoctor}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                <span>Share with Doctor (ABDM Consent Engine)</span>
              </div>
            </button>

            <button
              onClick={handleShareWithFamily}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Share with Linked Family Vault</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

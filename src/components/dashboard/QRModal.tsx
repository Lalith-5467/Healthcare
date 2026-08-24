import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Copy, Check, ShieldCheck } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  abhaId?: string;
  userName?: string;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  abhaId = '91-8472-9104-5821@abdm',
  userName = 'Samson L.'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(abhaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden text-center"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* TITLE & HEADER */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-[#00a896] dark:text-cyan-300 text-[10px] font-extrabold uppercase border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ABDM Verified QR Code</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{userName}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">{abhaId}</p>
          </div>

          {/* QR CODE CONTAINER WITH SCANNING ANIMATION */}
          <div className="relative p-6 rounded-2xl bg-slate-50 dark:bg-white border border-slate-200 dark:border-transparent mx-auto w-48 h-48 flex items-center justify-center shadow-inner group">
            {/* SCANNING LINE */}
            <motion.div
              animate={{ y: [-70, 70, -70] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute w-40 h-0.5 bg-[#00a896] shadow-[0_0_12px_#00a896] z-10 pointer-events-none"
            />
            <QrCode className="w-32 h-32 text-slate-900" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Scan with any ABDM-compliant health app to instantly link and access medical records.
          </p>

          {/* COPY ACTION BUTTON */}
          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy ABHA ID</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

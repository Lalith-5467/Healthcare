import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Copy, Check, ShieldCheck, Share2 } from 'lucide-react';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-6 relative overflow-hidden text-center"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* TITLE & HEADER */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-[10px] font-extrabold uppercase border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ABDM Verified QR Code</span>
            </div>
            <h3 className="text-xl font-black tracking-tight">{userName}</h3>
            <p className="text-xs text-slate-400 font-mono">{abhaId}</p>
          </div>

          {/* QR CODE CONTAINER WITH SCANNING ANIMATION */}
          <div className="relative p-6 rounded-2xl bg-white mx-auto w-48 h-48 flex items-center justify-center shadow-inner group">
            {/* SCANNING LINE */}
            <motion.div
              animate={{ y: [-70, 70, -70] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute left-4 right-4 h-0.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
            />
            {/* MOCK QR CODE SVG */}
            <QrCode className="w-36 h-36 text-slate-900" />
          </div>

          <p className="text-[11px] text-slate-400">
            Scan with any ABDM compliant hospital scanner to grant consent-based record access.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Health ID'}</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Share QR</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

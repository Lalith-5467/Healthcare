import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ShieldCheck, Share2, ExternalLink } from 'lucide-react';
import { QRModal } from './QRModal';

interface HealthAccessCardProps {
  abhaId?: string;
  userName?: string;
  onToast?: (msg: string) => void;
}

export const HealthAccessCard: React.FC<HealthAccessCardProps> = ({
  abhaId = '91-8472-9104-5821@abdm',
  userName = 'Samson L.',
  onToast
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(abhaId);
    if (onToast) onToast('✓ ABHA Health ID copied to clipboard!');
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="p-6 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-[#0c182e] dark:to-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl relative overflow-hidden flex flex-col justify-between group font-sans"
      >
        {/* GLOW BACKGROUND EFFECT */}
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

        {/* HEADER */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-[#00a896] dark:text-cyan-400 border border-cyan-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Health Access ID
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium">ABDM Digital Health Vault</span>
            </div>
          </div>
          <span className="px-3 py-1 text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/30 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified ABHA</span>
          </span>
        </div>

        {/* CENTER CONTENT */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 relative z-10 shadow-xs">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Securely share your patient health record.
            </p>
            <p className="text-xs font-mono text-[#00a896] dark:text-cyan-300 font-extrabold truncate">
              {abhaId}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="p-2.5 rounded-xl bg-[#00a896] dark:bg-white text-white dark:text-slate-900 shrink-0 shadow-md cursor-pointer transition-transform"
            title="Click to expand QR Code"
          >
            <QrCode className="w-8 h-8" />
          </motion.div>
        </div>

        {/* BUTTONS */}
        <div className="pt-2 flex items-center gap-3 relative z-10 font-sans">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View QR Card</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-extrabold border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy ID</span>
          </motion.button>
        </div>
      </motion.div>

      <QRModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        abhaId={abhaId}
        userName={userName}
      />
    </>
  );
};

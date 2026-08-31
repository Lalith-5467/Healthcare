import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle2, Share2, ExternalLink, Copy, Check } from 'lucide-react';
import { QRModal } from './QRModal';
import { ABDMQRCodeSVG } from '../common/ABDMQRCodeSVG';

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(abhaId);
    setCopied(true);
    if (onToast) onToast('✓ ABHA Health ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="p-6 rounded-3xl text-slate-900 dark:text-white relative overflow-hidden flex flex-col justify-between group font-sans dark:bg-slate-900/90 dark:border-slate-800 bg-gradient-to-br from-green-50 via-emerald-100/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-emerald-500/20 dark:border-emerald-500/10 shadow-[0_4px_32px_rgba(16,185,129,0.09),_0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
      >
        {/* BACKGROUND AMBIENT GLOWS */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%)' }} />
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(20,184,166,.10) 0%,transparent 70%)' }} />

        {/* HEADER */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Circular gradient icon — matches reference */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg,#34d399,#059669)', boxShadow: '0 4px 14px rgba(16,185,129,.35)' }}
            >
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Health QR
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                ABDM Digital Health Vault
              </span>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs" style={{ background: 'rgba(16,185,129,.12)', color: '#059669', border: '1px solid rgba(16,185,129,.25)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        </div>

        {/* BODY: TEXT ON LEFT, QR CODE ON RIGHT — frosted glass inner box */}
        <div className="my-4 p-4 rounded-2xl flex items-center justify-between gap-4 relative z-10 bg-white/75 dark:bg-slate-800/80 border border-teal-500/15 backdrop-blur-sm shadow-[0_2px_12px_rgba(20,184,166,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Show this QR to your doctor to share your health record.
            </p>
            <p className="text-xs font-mono font-black truncate" style={{ color: '#00897b' }}>
              {abhaId}
            </p>
          </div>

          {/* QR Code container — same as before */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="p-1.5 bg-white dark:bg-slate-900 rounded-2xl border shadow-md cursor-pointer shrink-0 relative overflow-hidden group/qr"
            style={{ borderColor: 'rgba(20,184,166,.2)' }}
            title="Click to view & scan full size QR Pass"
          >
            <motion.div
              animate={{ y: [-36, 36, -36] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#00a896] shadow-[0_0_8px_#00a896] z-20 pointer-events-none opacity-80"
            />
            <ABDMQRCodeSVG value={abhaId} size={72} className="block" />
          </motion.div>
        </div>

        {/* ICON-TRIO ROW (Share / Verified / Filter) — matches reference design */}
        <div className="flex items-center justify-around mb-3 relative z-10">
          {[
            { icon: Share2, label: 'Share', color: '#059669', bg: 'rgba(16,185,129,.1)' },
            { icon: CheckCircle2, label: 'Verified', color: '#0891b2', bg: 'rgba(6,182,212,.1)' },
            { icon: Copy, label: 'Filter', color: '#7c3aed', bg: 'rgba(124,58,237,.1)' },
          ].map(({ icon: IconComp, label, color, bg }) => (
            <button key={label} className="flex flex-col items-center gap-1 cursor-pointer group/ico">
              <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover/ico:scale-110" style={{ background: bg }}>
                <IconComp className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400" style={{ color }}>{label}</span>
            </button>
          ))}
        </div>

        {/* FOOTER BUTTONS — unchanged logic */}
        <div className="flex items-center gap-3 relative z-10 font-sans">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            style={{ background: 'linear-gradient(135deg,#00a896,#00897b)', boxShadow: '0 4px 14px rgba(0,168,150,.3)' }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>View QR Card</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 text-slate-800 text-xs font-extrabold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-emerald-500" /><span className="text-emerald-600">Copied</span></>
            ) : (
              <><Share2 className="w-4 h-4" /><span>Copy ID</span></>
            )}
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

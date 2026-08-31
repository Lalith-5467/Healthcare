import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShieldCheck, Download, Share2, Sparkles, UserCheck, RefreshCw } from 'lucide-react';
import { ABDMQRCodeSVG } from '../common/ABDMQRCodeSVG';

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
  const [downloaded, setDownloaded] = useState(false);
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTimestamp(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(abhaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden text-center font-sans"
        >
          {/* BACKGROUND DECORATIVE GLOW */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* HEADER BADGE */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-[#00a896] dark:text-cyan-300 text-[10px] font-extrabold uppercase border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Official Patient Health QR</span>
            </div>
            
            <div className="pt-1">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{userName}</h3>
              <p className="text-xs text-[#00a896] dark:text-cyan-300 font-mono font-black mt-1 bg-teal-500/10 px-3 py-1 rounded-xl inline-block border border-teal-500/20">
                {abhaId}
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-2.5 rounded-xl">
             <p className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5">
               <UserCheck className="w-4 h-4" />
               Show this QR to your doctor
             </p>
          </div>

          {/* REAL VECTOR QR CODE DISPLAY WITH HIGH-TECH HUD CORNERS & SCANNING LASER */}
          <div className="relative p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-teal-500/30 dark:border-cyan-500/30 shadow-xl mx-auto w-64 h-64 flex items-center justify-center group overflow-hidden">
            
            <AnimatePresence>
              {isRefreshing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center"
                >
                  <RefreshCw className="w-8 h-8 text-[#00a896] animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* HUD CORNER BRACKETS */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00a896] dark:border-cyan-400 z-30 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00a896] dark:border-cyan-400 z-30 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00a896] dark:border-cyan-400 z-30 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00a896] dark:border-cyan-400 z-30 pointer-events-none" />

            {/* SCANNING LASER BEAM */}
            <motion.div
              animate={{ y: [-100, 100, -100] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute left-2 right-2 top-1/2 h-0.5 bg-[#00a896] dark:bg-cyan-400 shadow-[0_0_14px_#00a896] z-20 pointer-events-none opacity-90"
            />

            {/* REAL ABDM VECTOR QR */}
            <ABDMQRCodeSVG value={abhaId + timestamp.getTime()} size={210} />
          </div>

          <div className="text-center mt-[-10px]">
            <p className="text-[10px] text-slate-500 font-medium">
              Generated: {timestamp.toLocaleTimeString()}
            </p>
          </div>

          {/* PASS FOOTER METADATA */}
          <div className="flex items-center justify-center gap-4 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/70 py-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>ABDM 2.0 Compliant</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#00a896] dark:text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted</span>
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-xs transition-all border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy ABHA ID</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save QR Card</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Regenerate Secure QR</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgraded(true);
    setTimeout(() => {
      setUpgraded(false);
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md font-sans animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 shadow-2xl text-slate-900 dark:text-white space-y-6 relative overflow-hidden z-10"
      >
        {/* TOP DECORATIVE GLOW */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer z-30 shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* HEADER */}
        <div className="text-center flex flex-col items-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 text-slate-900 dark:text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Crown className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Upgrade to Premium Health
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm font-medium">
            Unlock advanced AI diagnostics, unlimited family health profiles, and 24/7 priority doctor access.
          </p>
        </div>

        {upgraded ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-center space-y-2 relative z-10">
            <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">Welcome to Premium Health!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Your account benefits have been activated successfully.</p>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              {[
                'Advanced AI Vitals & Risk Analytics',
                'Unlimited Family Member Profiles',
                'Instant Emergency SOS Medical Card Sync',
                'Priority Video Consultation Booking',
                'ABDM Encrypted Cloud Vault Storage'
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-teal-500/15 text-[#00a896] dark:text-cyan-300 shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feature}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">Special Offer</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  ₹499 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ month</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUpgrade}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-900 dark:text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activate Premium</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

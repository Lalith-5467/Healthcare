import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgraded(true);
    setTimeout(() => {
      setUpgraded(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl text-white space-y-6 relative overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER */}
          <div className="text-center flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Upgrade to Premium Health</h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Unlock advanced AI diagnostics, unlimited family health profiles, and 24/7 priority doctor access.
            </p>
          </div>

          {upgraded ? (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-extrabold text-emerald-400">Welcome to Premium Health!</h4>
              <p className="text-xs text-slate-300">Your account benefits have been activated (Frontend Demo).</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {[
                  'Advanced AI Vitals & Risk Analytics',
                  'Unlimited Family Member Profiles',
                  'Instant Emergency SOS Medical Card Sync',
                  'Priority Video Consultation Booking',
                  'ABDM Encrypted Cloud Vault Storage'
                ].map((feature, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                    <div className="p-1 rounded-md bg-teal-500/20 text-cyan-300">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Demo Special</span>
                  <div className="text-xl font-black text-white">₹0 <span className="text-xs font-normal text-slate-400">/ Free Upgrade</span></div>
                </div>
                <button
                  onClick={handleUpgrade}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Premium (Demo)</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

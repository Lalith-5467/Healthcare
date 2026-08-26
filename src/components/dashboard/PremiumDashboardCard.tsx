import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface PremiumDashboardCardProps {
  onOpenPremium: () => void;
}

export const PremiumDashboardCard: React.FC<PremiumDashboardCardProps> = ({ onOpenPremium }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.008 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-5 sm:p-6 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 group font-sans text-white"
      style={{
        background: 'linear-gradient(135deg, #091428 0%, #0e2246 45%, #0b2f52 80%, #07192f 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 12px 36px rgba(2, 132, 199, 0.18), 0 1px 3px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Crisp Ambient Lighting (No Muddy Blends) */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)' }} />

      {/* Content Section */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Crown className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Unlock Premium Health Portal
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono tracking-wider"
                style={{ background: 'rgba(245,158,11,.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,.3)' }}>
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Get deeper insights into your complete health records, vitals & AI assistance.
            </p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-3.5 pt-1 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Advanced Health Analytics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI Health Assistant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Family Health Manager</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpenPremium}
        className="px-5 py-3 rounded-2xl text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer relative z-10"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
          boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)'
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        <span>Explore Premium Plans</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
      </motion.button>
    </motion.div>
  );
};

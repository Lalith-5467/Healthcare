import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface FamilyConnectCardProps {
  onNavigate: (id: string) => void;
}

export const FamilyConnectCard: React.FC<FamilyConnectCardProps> = ({ onNavigate }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Family Connect Network
            </h3>
            <span className="text-xs text-slate-300 font-mono">Shared Dependent Records</span>
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 font-mono">
          3 Members
        </span>
      </div>

      {/* MEMBERS AVATARS PREVIEW */}
      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center -space-x-2">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="Priya" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Rohan" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
          <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80" alt="Kavita" className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" />
        </div>
        <span className="text-slate-300 font-sans font-bold">Priya, Rohan, Kavita</span>
      </div>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => onNavigate('family')}
          className="inline-flex items-center gap-1.5 font-extrabold text-cyan-300 hover:text-white transition-colors cursor-pointer font-sans"
        >
          <span>Open Family Connect</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-emerald-400 font-bold">Records Synced</span>
      </div>
    </motion.div>
  );
};

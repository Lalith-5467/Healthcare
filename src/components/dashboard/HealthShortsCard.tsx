import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthShortsCardProps {
  onOpenShorts: () => void;
}

export const HealthShortsCard: React.FC<HealthShortsCardProps> = ({ onOpenShorts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-zinc-900 to-black text-white rounded-3xl p-6 shadow-xl relative overflow-hidden cursor-pointer border border-zinc-800"
      onClick={onOpenShorts}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-700 backdrop-blur-md shrink-0 shadow-inner">
          <Play className="w-6 h-6 text-emerald-400 translate-x-0.5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            Health Shorts <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest rounded-md border border-emerald-500/30">New</span>
          </h3>
          <p className="text-sm font-medium text-zinc-400 mt-1 line-clamp-2">
            Watch personalized quick tips on Nattu Maruthuvam, diet, and wellness based on your health profile.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

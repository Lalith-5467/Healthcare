import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface AIAssistantDashboardCardProps {
  onNavigate: (id: string) => void;
}

export const AIAssistantDashboardCard: React.FC<AIAssistantDashboardCardProps> = ({ onNavigate }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/40 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group font-sans space-y-4"
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xl">
            🤖
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              AI Health Assistant Companion
            </h3>
            <p className="text-xs text-purple-300 font-mono">"How can I help you today?"</p>
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 font-mono flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo AI</span>
        </span>
      </div>

      <p className="text-xs text-slate-200 leading-relaxed font-medium relative z-10">
        Ask symptoms, explain medical terminology in simple language, or generate customized question checklists for your doctor visit.
      </p>

      {/* PROMPT ACTION CHIPS */}
      <div className="flex flex-wrap items-center gap-2 relative z-10 font-mono text-[11px]">
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-cyan-300 border border-slate-800 cursor-pointer font-sans font-extrabold"
        >
          📝 Prepare for Appointment
        </button>
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-purple-300 border border-slate-800 cursor-pointer font-sans font-extrabold"
        >
          📖 Explain Medical Term
        </button>
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-emerald-300 border border-slate-800 cursor-pointer font-sans font-extrabold"
        >
          💊 Medicine Info
        </button>
      </div>

      {/* FOOTER LINK */}
      <div className="pt-3 border-t border-purple-500/30 flex items-center justify-between relative z-10 font-mono text-xs">
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="inline-flex items-center gap-2 font-extrabold text-cyan-300 hover:text-white transition-colors cursor-pointer font-sans"
        >
          <span>Open AI Health Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-slate-300 font-bold">24x7 Available</span>
      </div>
    </motion.div>
  );
};

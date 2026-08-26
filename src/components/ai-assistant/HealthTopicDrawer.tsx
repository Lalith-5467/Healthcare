import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Check, Sparkles } from 'lucide-react';
import type { HealthTopicItem } from './aiAssistantData';

interface HealthTopicDrawerProps {
  topic: HealthTopicItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAskTopic: (query: string) => void;
}

export const HealthTopicDrawer: React.FC<HealthTopicDrawerProps> = ({
  topic,
  isOpen,
  onClose,
  onAskTopic,
}) => {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-xl max-h-[90vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-8 text-xs font-sans text-slate-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{topic.title}</h3>
              <span className="text-[11px] text-[#00a896] dark:text-cyan-300 font-mono font-bold">{topic.category} Guide</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-5 flex-1 overflow-y-auto pr-1">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-extrabold tracking-wider">Summary</span>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{topic.summary}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] text-[#00a896] dark:text-cyan-300 uppercase font-mono font-extrabold tracking-wider">Why It Matters</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{topic.whyItMatters}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Healthy Lifestyle Habits</h4>
            <div className="space-y-2 font-sans text-xs">
              {topic.healthyHabits.map((h) => (
                <div key={h} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-slate-800 dark:text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 font-extrabold shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            Close
          </button>
          <button
            onClick={() => {
              onAskTopic(`Tell me more about ${topic.title}`);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI About This Topic</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

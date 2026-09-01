import React from 'react';
import { Plus, Bookmark, BookOpen, ShieldCheck, Sparkles, Bot } from 'lucide-react';
import type { HealthTopicItem } from './aiAssistantData';

interface AIAssistantProfileSidebarProps {
  onNewChat: () => void;
  onOpenSavedNotes: () => void;
  topics: HealthTopicItem[];
  onSelectTopic: (topic: HealthTopicItem) => void;
}

export const AIAssistantProfileSidebar: React.FC<AIAssistantProfileSidebarProps> = ({
  onNewChat,
  onOpenSavedNotes,
  topics,
  onSelectTopic,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl text-xs font-sans text-slate-900 dark:text-white">
      {/* AVATAR & STATUS */}
      <div className="text-center space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#00a896] via-teal-500 to-cyan-600 border-2 border-teal-300/40 flex items-center justify-center text-slate-900 dark:text-white text-3xl shadow-lg mx-auto">
            <Bot className="w-8 h-8 text-slate-900 dark:text-white" />
          </div>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 absolute bottom-0 right-0 animate-pulse" />
        </div>

        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">AI Health Assistant</h3>
          <p className="text-[11px] text-[#00a896] dark:text-cyan-300 font-mono font-bold">Clinical Health Companion</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Ready to Help 24/7</span>
        </div>
      </div>

      {/* NEW CHAT CTA */}
      <button
        onClick={onNewChat}
        className="w-full py-2.5 px-4 rounded-2xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-[#00897b] hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>New Conversation</span>
      </button>

      {/* SAVED NOTES */}
      <button
        onClick={onOpenSavedNotes}
        className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-cyan-300 font-bold border border-slate-300 dark:border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Bookmark className="w-4 h-4 text-[#00a896]" />
        <span>Saved Health Notes</span>
      </button>

      {/* EXPLORE HEALTH TOPICS */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 tracking-wider font-mono">Explore Topics</span>
          <BookOpen className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
        </div>

        <div className="space-y-1.5 font-mono">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-left transition-colors flex items-center justify-between cursor-pointer group text-[11px]"
            >
              <span className="font-sans font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00a896] dark:group-hover:text-cyan-300 line-clamp-1">{t.title}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">&rarr;</span>
            </button>
          ))}
        </div>
      </div>

      {/* SAFETY DISCLAIMER NOTICE */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-600 dark:text-slate-400 space-y-1 font-mono">
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Clinical Disclaimer</span>
        </div>
        <p className="leading-relaxed font-sans font-medium">
          Provides general information only. Not a medical diagnosis or substitute for a qualified doctor.
        </p>
      </div>
    </div>
  );
};

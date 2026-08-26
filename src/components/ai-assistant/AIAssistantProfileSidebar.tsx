import React from 'react';
import { Plus, Bookmark, BookOpen, ShieldCheck } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl text-xs">
      {/* AVATAR & STATUS */}
      <div className="text-center space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-purple-400/40 flex items-center justify-center text-3xl shadow-lg mx-auto">
            🤖
          </div>
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 absolute bottom-0 right-0 animate-pulse" />
        </div>

        <div>
          <h3 className="font-extrabold text-white text-base">AI Health Assistant</h3>
          <p className="text-[11px] text-purple-300 font-mono">Healthcare Companion • Demo</p>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
          <span>● Ready to help</span>
        </div>
      </div>

      {/* NEW CHAT CTA */}
      <button
        onClick={onNewChat}
        className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>New Conversation</span>
      </button>

      {/* SAVED NOTES */}
      <button
        onClick={onOpenSavedNotes}
        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Bookmark className="w-4 h-4" />
        <span>Saved Health Notes</span>
      </button>

      {/* EXPLORE HEALTH TOPICS */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Explore Topics</span>
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
        </div>

        <div className="space-y-1.5 font-mono">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t)}
              className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-colors flex items-center justify-between cursor-pointer group text-[11px]"
            >
              <span className="font-sans font-bold text-slate-200 group-hover:text-purple-300 line-clamp-1">{t.title}</span>
              <span className="text-[10px] text-slate-500 shrink-0">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* SAFETY DISCLAIMER NOTICE */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-[10px] text-slate-400 space-y-1 font-mono">
        <div className="flex items-center gap-1 text-amber-300 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Not a Doctor</span>
        </div>
        <p className="leading-relaxed">
          Provides general information only. Not a substitute for a qualified doctor.
        </p>
      </div>
    </div>
  );
};

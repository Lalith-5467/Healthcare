import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{topic.title}</h3>
              <span className="text-[10px] text-purple-300 font-mono">{topic.category} Guide</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 py-4 flex-1 overflow-y-auto">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Summary</span>
            <p className="text-slate-200 leading-relaxed">{topic.summary}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-purple-300 uppercase font-mono font-bold">Why It Matters</span>
            <p className="text-slate-300 leading-relaxed">{topic.whyItMatters}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">Healthy Lifestyle Habits</h4>
            <div className="space-y-2 font-mono text-[11px]">
              {topic.healthyHabits.map((h) => (
                <div key={h} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2 text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-sans">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex justify-between gap-3 font-extrabold">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Close</button>
          <button
            onClick={() => {
              onAskTopic(`Tell me more about ${topic.title}`);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer text-center shadow-md"
          >
            Ask AI About This Topic
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, History, Trash2, MessageSquare, ChevronRight } from 'lucide-react';
import type { ChatConversation } from './aiAssistantData';

interface ChatHistoryDrawerProps {
  history: ChatConversation[];
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conv: ChatConversation) => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  history,
  isOpen,
  onClose,
  onSelectConversation,
  onDeleteConversation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Conversation History</h3>
              <p className="text-xs text-slate-400 font-mono">Past AI assistant health guidance logs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONVERSATION LIST */}
        <div className="space-y-3 py-4 flex-1 overflow-y-auto">
          {history.length > 0 ? (
            history.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv);
                  onClose();
                }}
                className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 cursor-pointer group transition-all font-mono"
              >
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white font-sans text-xs group-hover:text-cyan-300 transition-colors">{conv.title}</h4>
                  <span className="text-[10px] text-slate-400 block">{conv.date} • {conv.messages.length} messages</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 cursor-pointer"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-700 mb-2" />
              <p>No saved conversation history yet.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer text-center"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};

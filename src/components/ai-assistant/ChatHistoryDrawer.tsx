import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col justify-between shadow-2xl p-6 sm:p-8 text-xs font-sans text-slate-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Conversation History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Past AI assistant health guidance logs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONVERSATION LIST */}
        <div className="space-y-3 py-5 flex-1 overflow-y-auto pr-1">
          {history.length > 0 ? (
            history.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv);
                  onClose();
                }}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#00a896] dark:hover:border-cyan-500/40 flex items-center justify-between gap-3 cursor-pointer group transition-all font-sans shadow-xs"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors truncate">{conv.title}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">{conv.date} • {conv.messages.length} messages</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00a896] dark:group-hover:text-cyan-300" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No saved conversation history yet.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold cursor-pointer text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
          >
            Close History
          </button>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { X, Bookmark, Trash2, Copy } from 'lucide-react';
import type { SavedHealthNote } from './aiAssistantData';

interface SavedHealthNotesModalProps {
  notes: SavedHealthNote[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteNote: (id: string) => void;
  onCopyNote: (text: string) => void;
}

export const SavedHealthNotesModal: React.FC<SavedHealthNotesModalProps> = ({
  notes,
  isOpen,
  onClose,
  onDeleteNote,
  onCopyNote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col justify-between shadow-2xl p-6 sm:p-8 text-xs font-sans text-slate-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Saved Health Notes ({notes.length})</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Bookmarked AI guidance and doctor question checklists</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTES LIST */}
        <div className="space-y-3 py-4 overflow-y-auto flex-1 font-sans text-xs pr-1">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{note.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{note.date}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">{note.content}</p>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-slate-800/80 font-bold">
                  <button onClick={() => onCopyNote(note.content)} className="text-[#00a896] dark:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Note</span>
                  </button>

                  <button onClick={() => onDeleteNote(note.id)} className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>No saved health notes yet.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold cursor-pointer text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
          >
            Close Saved Notes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

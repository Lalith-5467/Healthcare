import React from 'react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs font-sans max-h-[85vh] flex flex-col justify-between">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Saved Health Notes ({notes.length})</h3>
              <p className="text-xs text-slate-400 font-mono">Bookmarked AI guidance and doctor question checklists</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTES LIST */}
        <div className="space-y-3 py-2 overflow-y-auto flex-1 font-mono text-[11px]">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white font-sans text-xs">{note.title}</h4>
                  <span className="text-[10px] text-slate-500">{note.date}</span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed whitespace-pre-line">{note.content}</p>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 font-bold">
                  <button onClick={() => onCopyNote(note.content)} className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button onClick={() => onDeleteNote(note.id)} className="text-rose-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono">
              <Bookmark className="w-8 h-8 mx-auto text-slate-700 mb-2" />
              <p>No saved health notes yet.</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer text-center"
          >
            Close Saved Notes
          </button>
        </div>
      </div>
    </div>
  );
};

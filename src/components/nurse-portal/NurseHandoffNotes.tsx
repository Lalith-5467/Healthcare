import React, { useState } from 'react';
import { IconClipboardList, IconSend } from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';
import { motion, AnimatePresence } from 'framer-motion';

export const NurseHandoffNotes: React.FC = () => {
  const [notes, setNotes] = useState(NURSING_MOCK_DATA.initialHandoffNotes);
  const [inputValue, setInputValue] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newNote = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: inputValue,
      author: 'Nurse Sarah', // current user
    };

    setNotes([newNote, ...notes]);
    setInputValue('');
  };

  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <IconClipboardList className="w-4 h-4 text-[#ec4899]" /> Shift Handoff
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 mb-4">
        <AnimatePresence>
          {notes.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-[#f6f7f9] dark:bg-[#12141a] rounded-xl border border-[#eceef1] dark:border-slate-800"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.author}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.note}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <form onSubmit={handleAddNote} className="relative mt-auto">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a handoff note..."
          className="w-full bg-[#f6f7f9] dark:bg-[#12141a] border border-[#eceef1] dark:border-slate-800 focus:bg-white dark:focus:bg-[#1b1e27] focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]/50 rounded-xl pl-4 pr-12 py-3 text-sm font-medium text-slate-900 dark:text-white transition-all outline-none"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#ec4899] hover:bg-[#db2777] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <IconSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Trash2, X, CheckSquare } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDownload: () => void;
  onBulkShare: () => void;
  onBulkDelete: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkDownload,
  onBulkShare,
  onBulkDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-slate-700 shadow-2xl text-white flex flex-wrap items-center gap-3 text-xs"
      >
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
          <span className="w-6 h-6 rounded-full bg-[#00a896] text-white font-black flex items-center justify-center text-xs">
            {selectedCount}
          </span>
          <span className="font-extrabold text-white">Records Selected</span>
        </div>

        <button
          onClick={selectedCount === totalCount ? onClearSelection : onSelectAll}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>{selectedCount === totalCount ? 'Deselect All' : 'Select All'}</span>
        </button>

        <button
          onClick={onBulkDownload}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        <button
          onClick={onBulkShare}
          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          onClick={onBulkDelete}
          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        <button
          onClick={onClearSelection}
          className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors ml-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

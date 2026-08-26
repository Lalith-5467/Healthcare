import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, LayoutList, Clock } from 'lucide-react';

interface RecordsSearchSortBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'list' | 'timeline';
  onViewModeChange: (mode: 'list' | 'timeline') => void;
}

export const RecordsSearchSortBar: React.FC<RecordsSearchSortBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenFilter,
  activeFilterCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl">
      {/* SEARCH FIELD */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search medical records by title, doctor, hospital, type, date..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a896]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* FILTER, SORT & VIEW TOGGLE */}
      <div className="flex items-center gap-2 shrink-0">
        {/* FILTER BUTTON */}
        <button
          onClick={onOpenFilter}
          className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-[#00a896]/20 text-cyan-300 border-[#00a896]'
              : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#00a896] text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* SORT DROPDOWN */}
        <div className="relative flex items-center">
          <div className="p-2.5 rounded-l-2xl bg-slate-50 dark:bg-slate-900 border-l border-t border-b border-slate-200/80 dark:border-slate-800 text-slate-400">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="py-2.5 pr-4 pl-1 rounded-r-2xl bg-slate-50 dark:bg-slate-900 border-r border-t border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Title (A - Z)</option>
            <option value="za">Title (Z - A)</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => onViewModeChange('list')}
            title="List View"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#00a896] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            title="Timeline View"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#00a896] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

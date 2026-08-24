import React from 'react';

interface RecordCategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CATEGORIES = [
  'All',
  'Lab Reports',
  'Prescriptions',
  'Consultations',
  'Imaging',
  'Discharge',
  'Vaccination',
  'Other'
];

export const RecordCategoryTabs: React.FC<RecordCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#00a896] to-cyan-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

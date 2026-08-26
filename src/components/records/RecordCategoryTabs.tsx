import React from 'react';

interface RecordCategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Lab Report', label: 'Lab Reports' },
  { id: 'Prescription', label: 'Prescriptions' },
  { id: 'Consultation', label: 'Consultations' },
  { id: 'Imaging', label: 'Imaging' },
  { id: 'Discharge', label: 'Discharge' },
  { id: 'Vaccination', label: 'Vaccination' },
  { id: 'Other', label: 'Other' }
];

export const RecordCategoryTabs: React.FC<RecordCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#00a896] to-cyan-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

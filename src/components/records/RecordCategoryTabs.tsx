import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface RecordCategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const RecordCategoryTabs: React.FC<RecordCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { t } = useLanguage();

  const categories = [
    { id: 'All', label: t('records.all_categories', 'All') },
    { id: 'Lab Report', label: t('records.lab_reports', 'Lab Reports') },
    { id: 'Prescription', label: t('records.prescriptions', 'Prescriptions') },
    { id: 'Consultation', label: t('records.consultations', 'Consultations') },
    { id: 'Imaging', label: t('records.imaging', 'Imaging') },
    { id: 'Discharge', label: t('records.discharge', 'Discharge') },
    { id: 'Vaccination', label: t('records.vaccination', 'Vaccination') },
    { id: 'Other', label: t('records.other', 'Other') }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
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


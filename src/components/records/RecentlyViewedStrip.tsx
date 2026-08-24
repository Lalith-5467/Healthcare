import React from 'react';
import { History, Eye } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface RecentlyViewedStripProps {
  recentRecords: MedicalRecordItem[];
  onViewRecord: (record: MedicalRecordItem) => void;
}

export const RecentlyViewedStrip: React.FC<RecentlyViewedStripProps> = ({
  recentRecords,
  onViewRecord
}) => {
  if (recentRecords.length === 0) return null;

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <History className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
          Recently Viewed Records
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {recentRecords.slice(0, 3).map((rec) => (
          <div
            key={rec.id}
            onClick={() => onViewRecord(rec)}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 hover:border-[#00a896] transition-all cursor-pointer flex items-center justify-between gap-2 group"
          >
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#00a896] transition-colors">
                {rec.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {rec.type} • {rec.date}
              </p>
            </div>
            <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

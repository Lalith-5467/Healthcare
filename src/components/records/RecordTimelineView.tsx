import React from 'react';
import type { MedicalRecordItem } from './recordsData';
import { RecordCard } from './RecordCard';

interface RecordTimelineViewProps {
  records: MedicalRecordItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onView: (record: MedicalRecordItem) => void;
  onDownload: (record: MedicalRecordItem) => void;
  onShare: (record: MedicalRecordItem) => void;
  onDelete: (record: MedicalRecordItem) => void;
  onRename: (record: MedicalRecordItem) => void;
}

export const RecordTimelineView: React.FC<RecordTimelineViewProps> = ({
  records,
  selectedIds,
  onToggleSelect,
  onToggleImportant,
  onView,
  onDownload,
  onShare,
  onDelete,
  onRename
}) => {
  return (
    <div className="space-y-0 font-sans">
      {records.map((rec, idx) => {
        const isLast = idx === records.length - 1;

        return (
          <div key={rec.id} className="flex items-stretch gap-4">
            {/* TRACK & CONNECTOR NODE */}
            <div className="flex flex-col items-center shrink-0 w-4 pt-4">
              <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-[#00a896] shadow-xs flex items-center justify-center shrink-0 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00a896]" />
              </div>

              {!isLast && (
                <div className="w-0.5 flex-1 min-h-[60px] bg-slate-200 dark:bg-slate-800 my-1" />
              )}
            </div>

            {/* RECORD CARD */}
            <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
              <RecordCard
                record={rec}
                isSelected={selectedIds.includes(rec.id)}
                onToggleSelect={onToggleSelect}
                onToggleImportant={onToggleImportant}
                onView={onView}
                onDownload={onDownload}
                onShare={onShare}
                onDelete={onDelete}
                onRename={onRename}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

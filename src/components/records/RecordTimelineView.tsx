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
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {records.map((rec) => (
        <div key={rec.id} className="relative">
          {/* TIMELINE CONNECTOR NODE */}
          <div className="absolute -left-6 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-[#00a896] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>

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
      ))}
    </div>
  );
};

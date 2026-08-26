import React from 'react';
import { Upload, Scan, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';

interface RecordsHeaderProps {
  onOpenUpload: () => void;
  onNavigateScan: () => void;
}

export const RecordsHeader: React.FC<RecordsHeaderProps> = ({
  onOpenUpload,
  onNavigateScan
}) => {
  return (
    <PageHeader
      title="Medical Records Vault"
      subtitle="Securely manage and access all your health documents in one place."
      badgeText="256-Bit Encrypted"
      badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
      rightElement={
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={onNavigateScan}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow"
          >
            <Scan className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
            <span>Scan Document</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Record</span>
          </button>
        </div>
      }
    />
  );
};

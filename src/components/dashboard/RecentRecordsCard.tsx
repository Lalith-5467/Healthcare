import React from 'react';
import { FileText, ArrowRight, Download } from 'lucide-react';

interface RecentRecordsCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const RecentRecordsCard: React.FC<RecentRecordsCardProps> = ({ onNavigate, onToast }) => {
  const records = [
    { id: 1, title: 'Complete Blood Count (CBC)', date: '21 Aug 2026', type: 'Lab Report', status: 'Normal', doctor: 'Dr. Anita Sharma' },
    { id: 2, title: 'General Prescription', date: '20 Aug 2026', type: 'Prescription', status: 'Active', doctor: 'Dr. Rajesh Kumar' },
    { id: 3, title: 'Cardiology ECG Trace', date: '18 Aug 2026', type: 'Diagnostics', status: 'Normal', doctor: 'Dr. Vikram Sethi' }
  ];

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    onToast(`Downloaded PDF report for ${title}`);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Records
            </h3>
            <span className="text-[11px] text-slate-400">ABDM Vault Encrypted Docs</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('records')}
          className="text-xs font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* RECORDS LIST */}
      <div className="space-y-2.5">
        {records.map((r) => (
          <div
            key={r.id}
            onClick={() => onNavigate('records')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 hover:border-teal-500/30 flex items-center justify-between gap-3 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-teal-500/10 text-cyan-400 border border-teal-500/20 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#00a896] transition-colors">
                  {r.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{r.type}</span>
                  <span>•</span>
                  <span>{r.date}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{r.doctor}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                {r.status}
              </span>
              <button
                onClick={(e) => handleDownload(e, r.title)}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

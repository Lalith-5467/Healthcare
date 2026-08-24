import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Download } from 'lucide-react';

interface RecentRecordsCardProps {
  onNavigate: (id: string) => void;
  onToast: (msg: string) => void;
}

export const RecentRecordsCard: React.FC<RecentRecordsCardProps> = ({ onNavigate, onToast }) => {
  const records = [
    { id: 1, title: 'Complete Blood Count (CBC)', date: '21 Aug 2026', type: 'Lab Report', status: 'Normal', doctor: 'Dr. Anita Sharma' },
    { id: 2, title: 'Cardiology Prescription', date: '20 Aug 2026', type: 'Prescription', status: 'Active', doctor: 'Dr. Rajesh Kumar' },
    { id: 3, title: 'ECG Diagnostics Trace', date: '18 Aug 2026', type: 'Diagnostics', status: 'Normal', doctor: 'Dr. Vikram Sethi' }
  ];

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    onToast(`✓ Downloaded PDF report for ${title}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Health Records
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">ABDM Vault Encrypted Documents</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('records')}
          className="text-xs font-extrabold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer font-sans"
        >
          <span>View All Records</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* RECORDS LIST */}
      <div className="space-y-2.5 font-mono text-[11px]">
        {records.map((r) => (
          <div
            key={r.id}
            onClick={() => onNavigate('records')}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors font-sans">
                  {r.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
                  <span>{r.type}</span>
                  <span>•</span>
                  <span>{r.date}</span>
                  <span>•</span>
                  <span className="font-extrabold text-[#00a896] dark:text-cyan-300 font-sans">{r.doctor}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                {r.status}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleDownload(e, r.title)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

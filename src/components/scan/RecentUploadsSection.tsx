import React from 'react';
import { FileText, CheckCircle2, Calendar, Clock, Upload, Camera, ExternalLink } from 'lucide-react';
import type { MedicalRecordItem } from '../records/recordsData';

interface RecentUploadsSectionProps {
  records: MedicalRecordItem[];
  onNavigateRecords: () => void;
  onStartScan: () => void;
  onStartUpload: () => void;
}

export const RecentUploadsSection: React.FC<RecentUploadsSectionProps> = ({
  records,
  onNavigateRecords,
  onStartScan,
  onStartUpload,
}) => {
  const recentRecords = records.slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Uploads</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Recently digitized and saved health documents</p>
        </div>

        {recentRecords.length > 0 && (
          <button
            onClick={onNavigateRecords}
            className="flex items-center gap-1.5 text-xs font-bold text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer"
          >
            <span>View All Medical Records</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recentRecords.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              onClick={onNavigateRecords}
              className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500/40 p-4 rounded-2xl transition-all cursor-pointer group space-y-3 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#00a896]/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved
                </span>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                  {record.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium font-mono">
                  <Calendar className="w-3 h-3 text-[#00a896] dark:text-cyan-400" />
                  <span>{record.date}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold">
                <span>{record.type}</span>
                <span>{record.fileSize || '1.8 MB'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl space-y-3">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Recent Scans Yet</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Start by scanning paper records or uploading a PDF file.</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartScan}
              className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Now</span>
            </button>
            <button
              onClick={onStartUpload}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

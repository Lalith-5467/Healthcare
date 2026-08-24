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
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white">Recent Uploads</h3>
          <p className="text-xs text-slate-400 mt-0.5">Recently digitized and saved health documents</p>
        </div>

        {recentRecords.length > 0 && (
          <button
            onClick={onNavigateRecords}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
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
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-teal-500/40 p-4 rounded-2xl transition-all cursor-pointer group space-y-3 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#00a896]/15 text-[#00a896] border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved
                </span>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {record.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{record.type}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{record.date}</span>
                </div>
                <span className="font-mono">{record.fileSize || '1.8 MB'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="py-12 px-6 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No documents uploaded yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Scan or upload your first medical document to organize your personal health records.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartScan}
              className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Document</span>
            </button>
            <button
              onClick={onStartUpload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

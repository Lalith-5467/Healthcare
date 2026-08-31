import React, { useState } from 'react';
import { Download, Upload, X, Activity, FileText, Settings, Database, CloudDownload, CloudUpload, Trash2, AlertOctagon } from 'lucide-react';

interface DataStorageSectionProps {
  onClearData: () => void;
  onExportData: (format: 'json' | 'csv') => void;
  onImportData: (file: File) => void;
}

export const DataStorageSection: React.FC<DataStorageSectionProps> = ({
  onClearData,
  onExportData,
  onImportData,
}) => {
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportData(e.target.files[0]);
    }
  };

  const totalUsed = 10.52;
  const maxStorage = 50.0;
  const percentage = (totalUsed / maxStorage) * 100;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Data & Storage Management</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Local cache storage breakdown, backup exports, and import tools</p>
        </div>
      </div>

      {/* DYNAMIC PROGRESS BAR */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Storage Usage</span>
          <span className="text-xs font-mono font-bold text-slate-500">{totalUsed.toFixed(2)} MB / {maxStorage} MB</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-[#00a896] rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* GLASSMORPHIC STORAGE BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-3 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
            <Activity className="w-5 h-5 text-blue-500 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block font-sans mb-1">Health Activity</span>
            <strong className="text-blue-600 dark:text-blue-400 text-lg font-extrabold font-mono">2.4 MB</strong>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-3 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <FileText className="w-5 h-5 text-indigo-500 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block font-sans mb-1">Stored Documents</span>
            <strong className="text-indigo-600 dark:text-indigo-400 text-lg font-extrabold font-mono">8.0 MB</strong>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-3 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
            <Settings className="w-5 h-5 text-amber-500 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block font-sans mb-1">Preferences Payload</span>
            <strong className="text-amber-600 dark:text-amber-400 text-lg font-extrabold font-mono">120 KB</strong>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-3 shadow-lg shadow-slate-200/20 hover:-translate-y-1 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#00a896]/10 flex items-center justify-center border border-[#00a896]/20 shadow-inner">
            <Database className="w-5 h-5 text-[#00a896] drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block font-sans mb-1">Total Local Storage</span>
            <strong className="text-[#00a896] text-lg font-extrabold font-mono">10.52 MB</strong>
          </div>
        </div>
      </div>

      {/* EXPORT & IMPORT ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
        <div className="p-6 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg shadow-slate-200/10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CloudDownload className="w-5 h-5 text-blue-600 dark:text-blue-400 drop-shadow-md" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">Export Patient Backup Data</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-medium">Download local settings & health journal history</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onExportData('json')}
              className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => onExportData('csv')}
              className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg shadow-slate-200/10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00a896]/10 rounded-lg">
              <CloudUpload className="w-5 h-5 text-[#00a896] drop-shadow-md" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">Import Data Backup</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-medium">Restore preferences from local backup file</p>
            </div>
          </div>
          <label className="w-full py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00a896]/90 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#00a896]/30 hover:-translate-y-0.5 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <Upload className="w-4 h-4" />
            <span>Select JSON Backup File</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* DANGER ZONE: CLEAR LOCAL CACHE */}
      <div className="p-5 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border-2 border-rose-100 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-rose-100 dark:bg-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 shadow-sm border border-rose-200 dark:border-rose-800/50">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-rose-700 dark:text-rose-400 text-sm font-sans">Clear Temporary Cache</h4>
            <p className="text-[11px] text-rose-600/70 dark:text-rose-400/70 font-sans font-medium mt-0.5">Clear temporary offline health journal cache files</p>
          </div>
        </div>
        
        <button
          onClick={() => setClearModalOpen(true)}
          className="relative z-10 shrink-0 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 transition-all hover:-translate-y-0.5"
        >
          Clear Cache
        </button>
      </div>

      {/* CLEAR MODAL */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                Clear Temporary Cache
              </h4>
              <button onClick={() => setClearModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Are you sure you want to clear temporary offline cache files? This action cannot be undone.</p>
            <div className="pt-2 flex justify-between gap-3 font-sans">
              <button onClick={() => setClearModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button
                onClick={() => {
                  onClearData();
                  setClearModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md transition-colors"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

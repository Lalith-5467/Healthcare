import React, { useState } from 'react';
import { Download, Upload, X } from 'lucide-react';

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

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Data & Storage Management</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Local cache storage breakdown, backup exports, and import tools</p>
        </div>
      </div>

      {/* STORAGE BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Health Activity Cache</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-lg font-extrabold font-mono">2.4 MB</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Stored Documents</span>
          <strong className="text-purple-700 dark:text-purple-300 text-lg font-extrabold font-mono">8.0 MB</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Preferences Payload</span>
          <strong className="text-amber-700 dark:text-amber-300 text-lg font-extrabold font-mono">120 KB</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Total Local Storage</span>
          <strong className="text-emerald-700 dark:text-emerald-400 text-lg font-extrabold font-mono">10.52 MB</strong>
        </div>
      </div>

      {/* EXPORT & IMPORT ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs font-sans">Export Patient Backup Data</h4>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">Download local settings & health journal history</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onExportData('json')}
              className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => onExportData('csv')}
              className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs font-sans">Import Data Backup</h4>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">Restore preferences from local backup file</p>
          </div>
          <label className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <span>Select JSON Backup File</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* CLEAR LOCAL CACHE */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs font-sans">Clear Temporary Cache</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium">Clear temporary offline health journal cache files</p>
        </div>

        <button
          onClick={() => setClearModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 cursor-pointer"
        >
          Clear Cache
        </button>
      </div>

      {/* CLEAR MODAL */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Clear Temporary Cache</h4>
              <button onClick={() => setClearModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Are you sure you want to clear temporary offline cache files?</p>
            <div className="pt-2 flex justify-between gap-3 font-sans">
              <button onClick={() => setClearModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">Cancel</button>
              <button
                onClick={() => {
                  onClearData();
                  setClearModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md"
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

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Data & Storage Management</h3>
          <p className="text-xs text-slate-400">Local cache storage breakdown, backup exports, and import tools</p>
        </div>
      </div>

      {/* STORAGE BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Health Activity Cache</span>
          <strong className="text-cyan-300 text-lg font-extrabold">2.4 MB</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Stored Documents</span>
          <strong className="text-purple-300 text-lg font-extrabold">8.0 MB</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Preferences Payload</span>
          <strong className="text-amber-300 text-lg font-extrabold">120 KB</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Total Local Storage</span>
          <strong className="text-emerald-400 text-lg font-extrabold">10.52 MB</strong>
        </div>
      </div>

      {/* EXPORT & IMPORT ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div>
            <h4 className="font-extrabold text-white text-xs font-sans">Export Patient Backup Data</h4>
            <p className="text-[11px] text-slate-400 font-sans">Download a copy of your demo settings and offline health logs</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onExportData('json')}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => onExportData('csv')}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div>
            <h4 className="font-extrabold text-white text-xs font-sans">Import Data Backup</h4>
            <p className="text-[11px] text-slate-400 font-sans">Restore local settings or demo data from a JSON file</p>
          </div>
          <label className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 text-center">
            <Upload className="w-3.5 h-3.5" />
            <span>Select JSON File to Import</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* CLEAR TEMPORARY DATA */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 font-sans">
        <div>
          <h4 className="font-extrabold text-white text-xs">Clear Temporary Application Data</h4>
          <p className="text-[11px] text-slate-400">Purge temporary cache files without losing saved health profile settings</p>
        </div>
        <button
          onClick={() => setClearModalOpen(true)}
          className="px-4 py-2 rounded-xl font-bold text-xs text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 cursor-pointer"
        >
          Clear Cache Data
        </button>
      </div>

      {/* CLEAR MODAL */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Clear Temporary Data?</h3>
              <button onClick={() => setClearModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This will reset non-critical temporary cache files. Saved profile settings and emergency contacts will remain intact.
            </p>
            <div className="pt-3 border-t border-slate-800 flex justify-between gap-3 font-extrabold">
              <button onClick={() => setClearModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  onClearData();
                  setClearModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer text-center"
              >
                Clear Data Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

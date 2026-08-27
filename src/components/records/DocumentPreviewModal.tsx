import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, ShieldCheck, FileText, Info } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecordItem | null;
  userName?: string;
  onDownload: (record: MedicalRecordItem) => void;
  onShare: (record: MedicalRecordItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  record,
  userName = 'Samson L.',
  onDownload,
  onShare
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !record) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-white flex flex-col overflow-hidden relative"
        >
          {/* TOP BAR */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{record.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {record.type} • {record.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showDetails ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="Toggle File Details"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DOCUMENT BODY */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950/40 font-sans">
            {/* SIMULATED OFFICIAL CLINICAL DOCUMENT SHEET */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
              {/* DOCUMENT HEADER BANNER */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    {record.hospital}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Clinical Diagnostics & Record Department</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 block">{record.id}</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                    {record.status} Report
                  </span>
                </div>
              </div>

              {/* PATIENT & DOCTOR INFO BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{userName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Attending Doctor</span>
                  <span className="font-bold text-slate-900 dark:text-white">{record.doctor}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Report</span>
                  <span className="font-bold text-slate-900 dark:text-white">{record.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">{record.type}</span>
                </div>
              </div>

              {/* METRICS OR NOTES CONTENT */}
              {record.metrics && record.metrics.length > 0 ? (
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Clinical Test Findings
                  </h5>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="p-2.5">Test Parameter</th>
                          <th className="p-2.5">Result Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {record.metrics.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white">{m.value}</td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400">Standard Adult Range</td>
                            <td className="p-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                m.status === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Clinical Notes & Impression</h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {record.notes || 'Official clinical record verified under ABDM health consent framework.'}
                  </p>
                </div>
              )}

              {/* FOOTER VERIFICATION */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Signed & ABDM Verified</span>
                </div>
                <span>Doc Ref: {record.fileName}</span>
              </div>
            </div>

            {/* OPTIONAL DETAILS PANEL */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-900 dark:text-white"
              >
                <h4 className="font-extrabold text-[#00a896] dark:text-cyan-300 uppercase tracking-wider">Document Metadata Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 dark:text-slate-300">
                  <div><span className="text-slate-400 dark:text-slate-500 block font-bold">Record ID:</span> {record.id}</div>
                  <div><span className="text-slate-400 dark:text-slate-500 block font-bold">File Name:</span> {record.fileName}</div>
                  <div><span className="text-slate-400 dark:text-slate-500 block font-bold">File Size:</span> {record.fileSize}</div>
                  <div><span className="text-slate-400 dark:text-slate-500 block font-bold">Status:</span> {record.status}</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Close Preview
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShare(record)}
                className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => onDownload(record)}
                className="px-5 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

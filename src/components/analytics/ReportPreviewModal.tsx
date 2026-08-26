import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: string;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  dateRange,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadedMsg, setDownloadedMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadedMsg('✓ Demo Health Activity Report PDF downloaded');
      setTimeout(() => setDownloadedMsg(null), 3000);
    }, 1200);
  };

  const handleDownloadCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadedMsg('✓ Demo Health Analytics Data CSV downloaded');
      setTimeout(() => setDownloadedMsg(null), 3000);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-sans print:p-0 print:bg-white print:text-black">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto text-slate-900 dark:text-white print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white print:p-0">
        {/* HEADER (HIDE ON PRINT) */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                Generated Report • {dateRange}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Demo Health Activity Report</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOAST NOTIFICATION FOR DOWNLOAD */}
        {downloadedMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadedMsg}</span>
          </div>
        )}

        {/* REPORT CONTENT BODY */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono space-y-2">
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Patient Name:</span><strong className="text-slate-900 dark:text-white font-sans">Lalith Patel</strong></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">ABHA ID:</span><strong className="text-[#00a896] dark:text-cyan-300">91-8472-9104-5821@abdm</strong></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Timeframe:</span><strong className="text-slate-900 dark:text-white">{dateRange}</strong></div>
            <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400 font-sans">Generated On:</span><strong className="text-slate-900 dark:text-white">24 Aug 2026</strong></div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">Summary Highlights</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
              <li>Overall Demo Health Score: 86 / 100 (+4% improvement)</li>
              <li>Medication Adherence: 91% completion rate</li>
              <li>Total Tele-consultations: 12 sessions completed</li>
              <li>Medical Records Synced: 24 active documents in vault</li>
            </ul>
          </div>
        </div>

        {/* FOOTER ACTIONS (HIDE ON PRINT) */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 print:hidden font-sans">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Print Report</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

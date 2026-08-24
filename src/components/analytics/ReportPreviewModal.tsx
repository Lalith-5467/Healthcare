import React, { useState } from 'react';
import { X, FileText, Download, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:text-black">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white print:p-0">
        {/* HEADER (HIDE ON PRINT) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Generated Report • {dateRange}
              </span>
              <h3 className="text-lg font-extrabold text-white">Demo Health Activity Report</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS TOAST */}
        {downloadedMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-2 print:hidden">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadedMsg}</span>
          </div>
        )}

        {/* REPORT CONTENT BODY (PRINT FRIENDLY) */}
        <div className="space-y-5 text-xs text-slate-300 print:text-black print:space-y-4">
          <div className="border border-amber-500/30 bg-amber-500/10 p-3 rounded-2xl text-amber-300 print:border-amber-400 print:text-amber-800 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-bold">Notice: Demo Health Activity Summary</p>
              <p className="text-[11px] mt-0.5 opacity-90">
                This summary is generated from frontend user activity data for personal organization. It is not a clinical medical record or diagnostic document.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 print:bg-slate-100 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block print:text-slate-600">Demo Health Score</span>
              <strong className="text-sm font-extrabold text-cyan-400 print:text-black font-mono">86 / 100</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block print:text-slate-600">Meds Adherence</span>
              <strong className="text-sm font-extrabold text-teal-400 print:text-black font-mono">91%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block print:text-slate-600">Appointments</span>
              <strong className="text-sm font-extrabold text-white print:text-black font-mono">8 visits</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block print:text-slate-600">Records Synced</span>
              <strong className="text-sm font-extrabold text-purple-300 print:text-black font-mono">24 files</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-sm print:text-black">Vital Trends Summary (Demo Data)</h4>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono print:bg-slate-50 print:border-slate-300">
              <div className="flex justify-between"><span>Heart Rate (Avg):</span><span className="font-bold text-cyan-300 print:text-black">72 BPM</span></div>
              <div className="flex justify-between"><span>Blood Pressure:</span><span className="font-bold text-cyan-300 print:text-black">120 / 80 mmHg</span></div>
              <div className="flex justify-between"><span>SpO2 Oxygen Saturation:</span><span className="font-bold text-cyan-300 print:text-black">98%</span></div>
              <div className="flex justify-between"><span>Body Weight Change:</span><span className="font-bold text-emerald-400 print:text-black">68 kg (-1.2 kg)</span></div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS (HIDE ON PRINT) */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Report</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {downloading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, FileCheck, Lightbulb } from 'lucide-react';

export const ScanTipsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-sans">
      {/* 1. TIPS FOR BETTER SCANS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Tips for Highest OCR Accuracy</h3>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Place the paper report on a flat, solid dark surface</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Ensure all 4 corners of the document are inside the frame</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Use good direct lighting or toggle the device scanner flash</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Avoid shadows or harsh overhead camera reflections</span>
          </li>
        </ul>
      </div>

      {/* 2. SUPPORTED DOCUMENTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896]">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Supported Formats</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-mono">
            PDF, JPG, PNG (max 25MB)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans">
          {[
            'Lab Reports',
            'Prescriptions',
            'Diagnostic Scans',
            'Discharge Notes',
            'Vaccine Certificates',
            'Medical Bills'
          ].map((type) => (
            <div
              key={type}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-bold text-xs text-slate-700 dark:text-slate-300"
            >
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

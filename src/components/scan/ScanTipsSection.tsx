import React from 'react';
import { CheckCircle2, FileCheck, Lightbulb } from 'lucide-react';

export const ScanTipsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
      {/* 1. TIPS FOR BETTER SCANS */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Tips for Better Scans</h3>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Place the document on a flat, contrasting surface</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Make sure the entire document is visible inside the frame</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Use good ambient lighting or toggle the scanner flash</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Avoid shadows and camera glare over medical text</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00a896] shrink-0" />
            <span>Keep the camera steady until auto-capture completes</span>
          </li>
        </ul>
      </div>

      {/* 2. SUPPORTED DOCUMENTS */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">You Can Upload</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
            PDF, JPG, PNG (max 10MB)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-sans">
          {[
            'Lab Reports',
            'Prescriptions',
            'Imaging Reports',
            'Discharge Summaries',
            'Vaccination Records',
            'Insurance Bills'
          ].map((type) => (
            <div
              key={type}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-bold text-xs text-slate-800 dark:text-slate-200"
            >
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

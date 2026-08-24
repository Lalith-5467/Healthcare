import React from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, Lightbulb, Sun, Smartphone, Sparkles, Layers } from 'lucide-react';

export const ScanTipsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. TIPS FOR BETTER SCANS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-white">Tips for Better Scans</h3>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300">
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">You Can Upload</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            PDF, JPG, PNG (max 10MB)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            'Lab Reports',
            'Prescriptions',
            'Imaging Reports',
            'Discharge Summaries',
            'Vaccination Records',
            'Insurance Documents'
          ].map((type) => (
            <div
              key={type}
              className="bg-slate-800/60 border border-slate-700/50 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-200 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#00a896]" />
              <span className="truncate">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

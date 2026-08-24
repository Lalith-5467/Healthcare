import React from 'react';
import { ExternalLink } from 'lucide-react';

interface EmergencySettingsSectionProps {
  onNavigateEmergency: () => void;
}

export const EmergencySettingsSection: React.FC<EmergencySettingsSectionProps> = ({
  onNavigateEmergency,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency & Safety Settings</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Preview emergency contacts, hospital preferences, and SOS sequence controls</p>
        </div>

        <button
          onClick={onNavigateEmergency}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Manage in SOS & Emergency</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* METADATA PREVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Primary Emergency Contact</span>
          <strong className="text-slate-900 dark:text-white text-sm font-extrabold font-sans">Priya Kumar (Mother)</strong>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">+91 98401 23456</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Preferred Emergency Hospital</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-sm font-extrabold font-sans">CityCare Hospital</strong>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">24x7 Cashless Bays</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">SOS Countdown Timer</span>
          <strong className="text-amber-700 dark:text-amber-300 text-sm font-extrabold font-sans">5 Seconds</strong>
          <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Confirmation Required</span>
        </div>
      </div>
    </div>
  );
};

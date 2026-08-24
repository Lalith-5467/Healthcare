import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FamilySettingsSectionProps {
  onNavigateFamily: () => void;
}

export const FamilySettingsSection: React.FC<FamilySettingsSectionProps> = ({
  onNavigateFamily,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Family Connect Settings</h3>
          <p className="text-xs text-slate-400">Dependent network summary and family record sharing permissions</p>
        </div>

        <button
          onClick={onNavigateFamily}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Manage Family Connect</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* METADATA PREVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Connected Members</span>
          <strong className="text-white text-base font-extrabold font-sans">3 Family Members</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Family Health Sharing</span>
          <strong className="text-emerald-400 text-base font-extrabold font-sans">Enabled</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Shared Emergency Records</span>
          <strong className="text-purple-300 text-base font-extrabold font-sans">Medical ID Shared</strong>
        </div>
      </div>
    </div>
  );
};

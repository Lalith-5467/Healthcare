import React from 'react';
import { ShieldAlert, Eye, Share2, Edit } from 'lucide-react';
import type { EmergencyMedicalInfo } from './emergencyData';

interface EmergencyMedicalIDCardProps {
  info: EmergencyMedicalInfo;
  onOpenFullID: () => void;
  onOpenEditInfo: () => void;
  onOpenShareID: () => void;
}

export const EmergencyMedicalIDCard: React.FC<EmergencyMedicalIDCardProps> = ({
  info,
  onOpenFullID,
  onOpenEditInfo,
  onOpenShareID,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency Medical ID</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-mono">
                {info.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Offline-scannable emergency responder information</p>
          </div>
        </div>

        <button
          onClick={onOpenEditInfo}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Information</span>
        </button>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Blood Group</span>
          <strong className="text-rose-700 dark:text-rose-400 text-lg font-extrabold font-sans">{info.bloodGroup}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Severe Allergies</span>
          <strong className="text-amber-700 dark:text-amber-300 text-xs font-sans line-clamp-1">{info.allergies}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Chronic Conditions</span>
          <strong className="text-purple-700 dark:text-purple-300 text-xs font-sans line-clamp-1">{info.conditions}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Emergency Medical ID</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-xs block font-bold">{info.medicalId}</strong>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
        <button
          onClick={onOpenFullID}
          className="px-4 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Eye className="w-4 h-4" />
          <span>View Full Digital Medical Card</span>
        </button>

        <button
          onClick={onOpenShareID}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Share Medical ID</span>
        </button>
      </div>
    </div>
  );
};

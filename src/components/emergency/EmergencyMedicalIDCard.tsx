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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Emergency Medical ID</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                {info.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-400">Offline-scannable emergency responder information</p>
          </div>
        </div>

        <button
          onClick={onOpenEditInfo}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Information</span>
        </button>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
          <strong className="text-rose-400 text-lg font-extrabold font-sans">{info.bloodGroup}</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Severe Allergies</span>
          <strong className="text-amber-300 text-xs font-sans line-clamp-1">{info.allergies}</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Chronic Conditions</span>
          <strong className="text-purple-300 text-xs font-sans line-clamp-1">{info.conditions}</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Preferred Hospital</span>
          <strong className="text-teal-300 text-xs font-sans line-clamp-1">{info.preferredHospital}</strong>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pt-2 flex justify-between gap-3 text-xs font-extrabold">
        <button
          onClick={onOpenFullID}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>View Full Medical ID Card</span>
        </button>

        <button
          onClick={onOpenShareID}
          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share ID</span>
        </button>
      </div>
    </div>
  );
};

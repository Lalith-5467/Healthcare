import React from 'react';
import { X, ShieldAlert, Share2 } from 'lucide-react';
import type { EmergencyMedicalInfo } from './emergencyData';

interface FullMedicalIDModalProps {
  info: EmergencyMedicalInfo;
  isOpen: boolean;
  onClose: () => void;
  onShareID: () => void;
}

export const FullMedicalIDModal: React.FC<FullMedicalIDModalProps> = ({
  info,
  isOpen,
  onClose,
  onShareID,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Emergency Medical ID Card</h3>
              <p className="text-xs text-slate-400">{info.medicalId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FULL ID CARD CONTENT */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 p-5 rounded-3xl border-2 border-rose-500/40 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-extrabold text-white text-base">{info.patientName}</h4>
              <span className="text-[10px] text-slate-400 font-mono">Patient ID: {info.medicalId}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex flex-col items-center justify-center text-rose-300 font-extrabold font-mono text-sm">
              <span>{info.bloodGroup}</span>
            </div>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Severe Allergies</span>
              <strong className="text-amber-300 font-sans">{info.allergies}</strong>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Medical Conditions</span>
              <strong className="text-purple-300 font-sans">{info.conditions}</strong>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Medications</span>
              <strong className="text-cyan-300 font-sans">{info.medications}</strong>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Preferred Hospital</span>
              <strong className="text-teal-300 font-sans">{info.preferredHospital}</strong>
            </div>
          </div>

          {/* DEMO QR CODE */}
          <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1 max-w-[130px] mx-auto shadow-md">
            <div className="w-20 h-20 bg-slate-900 rounded p-1 flex justify-between">
              <div className="w-4 h-4 bg-white rounded" />
              <div className="w-4 h-4 bg-rose-500 rounded" />
            </div>
            <span className="text-[9px] font-bold text-slate-900 font-mono">DEMO SOS QR</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={onShareID}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Medical ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};

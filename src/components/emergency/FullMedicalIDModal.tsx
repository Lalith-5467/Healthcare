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
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency Medical ID Card</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">{info.medicalId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FULL ID CARD CONTENT */}
        <div className="bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 p-5 rounded-3xl border-2 border-rose-400 dark:border-rose-500/40 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{info.patientName}</h4>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">Patient ID: {info.medicalId}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex flex-col items-center justify-center text-rose-700 dark:text-rose-300 font-extrabold font-mono text-sm">
              <span>{info.bloodGroup}</span>
            </div>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold block font-sans">Severe Allergies</span>
              <strong className="text-amber-700 dark:text-amber-300 font-sans">{info.allergies}</strong>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold block font-sans">Chronic Conditions</span>
              <strong className="text-purple-700 dark:text-purple-300 font-sans">{info.conditions}</strong>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold block font-sans">Current Medications</span>
              <strong className="text-slate-900 dark:text-white font-sans">{info.medications}</strong>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold block font-sans">Organ Donor Status</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-sans">{info.organDonor ? 'Organ Donor Registered' : 'Not Registered'}</strong>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 font-sans">
          <button
            onClick={onShareID}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Emergency Medical ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert, QrCode, Phone, AlertTriangle, Pill } from 'lucide-react';


interface EmergencyCardProps {
  onScanQR: () => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({ onScanQR }) => {
  return (
    <section id="emergency-sos" className="py-24 bg-red-50/40 dark:bg-[#180d14] relative overflow-hidden transition-colors border-y border-red-100 dark:border-red-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold mb-4">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Instant Emergency Access</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Critical Health Information When It Matters Most
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
            First responders and doctors can scan your offline-ready emergency QR card to instantly view blood group, critical allergies, active medications, and contact next-of-kin during emergency situations.
          </p>
        </div>

        {/* EMERGENCY CARD UI CONTAINER */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-900 dark:text-white border-2 border-red-500/50 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* TOP EMERGENCY BADGE */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-2.5 text-red-500 font-extrabold text-sm tracking-wider uppercase">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
              <span>OFFLINE EMERGENCY MEDICAL CARD</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full text-xs font-black bg-red-600 text-white shadow-md shadow-red-900/40">
              Blood Group: O+ Positive
            </div>
          </div>

          {/* CARD DETAILS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <p className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-widest font-bold">Patient Name</p>
              <p className="font-extrabold text-base text-slate-900 dark:text-white">Lalith Patel</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">ABHA: 14-8921-3341</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <p className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-widest font-bold">Emergency Contacts</p>
              <p className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +91 98765 43210 (Spouse)
              </p>
              <p className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +91 98765 43211 (Brother)
              </p>
            </div>
          </div>

          {/* ALLERGIES & CURRENT MEDICATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Known Severe Allergies</p>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-snug">Penicillin, Severe Sulfa Drugs, Peanut Anaphylaxis Risk</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 text-xs flex items-start gap-2.5">
              <Pill className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-purple-300">Active Daily Medications</p>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-snug">Vitamin D3 (1000 IU), Metformin 500mg, Aspirin 75mg</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON BAR */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Instant First-Responder Authorization</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Displays vital safety parameters without opening private medical history.
              </p>
            </div>

            <button
              onClick={onScanQR}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/40 transition-all gap-2.5 cursor-pointer shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>Open Emergency SOS</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};


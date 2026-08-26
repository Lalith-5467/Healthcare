import React from 'react';
import { ShieldCheck, QrCode, Droplet, CheckCircle2 } from 'lucide-react';

interface PatientIdentityCardProps {
  name?: string;
  age?: number;
  gender?: string;
  patientId?: string;
  bloodGroup?: string;
  avatarUrl?: string;
  onOpenQR: () => void;
}

export const PatientIdentityCard: React.FC<PatientIdentityCardProps> = ({
  name = 'Samson L.',
  age = 32,
  gender = 'Male',
  patientId = 'HR-2026-00124',
  bloodGroup = 'O+',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  onOpenQR
}) => {
  return (
    <div className="p-6 h-full rounded-3xl bg-gradient-to-br from-teal-50 via-cyan-50/60 to-white dark:from-slate-900 dark:via-[#0c192e] dark:to-slate-900 border border-teal-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 group font-sans">
      {/* AMBIENT GLOW */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-teal-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

      {/* LEFT AVATAR & IDENTITY */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-[#00a896]/30 shadow-lg">
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          </div>
          {/* VERIFIED BADGE ON AVATAR */}
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{name}</h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
            <span>{age} Years</span>
            <span>•</span>
            <span>{gender}</span>
            <span>•</span>
            <span className="font-mono text-[#00a896] dark:text-cyan-300 font-extrabold">{patientId}</span>
          </p>

          <div className="flex items-center gap-2 pt-1 font-mono">
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Droplet className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              <span>Blood Group: {bloodGroup}</span>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT VIEW HEALTH ID BUTTON */}
      <div className="relative z-10 self-start sm:self-center">
        <button
          onClick={onOpenQR}
          className="px-5 py-3 rounded-2xl bg-teal-500/10 dark:bg-cyan-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <QrCode className="w-4 h-4" />
          <span>View Health ID</span>
        </button>
      </div>
    </div>
  );
};

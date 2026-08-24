import React from 'react';
import { ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

interface EmergencyReadinessCardProps {
  hasContacts: boolean;
  hasMedicalInfo: boolean;
  hasTested: boolean;
}

export const EmergencyReadinessCard: React.FC<EmergencyReadinessCardProps> = ({
  hasContacts,
  hasMedicalInfo,
  hasTested,
}) => {
  const items = [
    { label: 'Emergency contact added', done: hasContacts },
    { label: 'Preferred hospital added', done: hasMedicalInfo },
    { label: 'Medical information added', done: hasMedicalInfo },
    { label: 'Emergency preferences configured', done: true },
    { label: 'SOS test completed', done: hasTested }
  ];

  const completedCount = items.filter((i) => i.done).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">Emergency Readiness</h3>
        </div>
        <span className="px-3 py-1 rounded-full font-mono font-extrabold text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          {percentage}% Ready
        </span>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-slate-300">
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <span className={item.done ? 'text-slate-200' : 'text-slate-500'}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

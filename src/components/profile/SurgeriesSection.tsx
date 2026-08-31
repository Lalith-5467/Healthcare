import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import type { SurgeryItem } from './AddSurgeryModal';
import { AddSurgeryModal } from './AddSurgeryModal';

interface SurgeriesSectionProps {
  onToast: (msg: string) => void;
}

export const SurgeriesSection: React.FC<SurgeriesSectionProps> = ({ onToast }) => {
  const [surgeries, setSurgeries] = useState<SurgeryItem[]>([
    { id: '1', name: 'Appendectomy', year: '2022', hospital: 'Apollo Hospital', doctor: 'Dr. Rajesh Kumar' },
    { id: '2', name: 'ACL Knee Reconstruction', year: '2020', hospital: 'Fortis Healthcare', doctor: 'Dr. Vikram Sethi' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (item: SurgeryItem) => {
    setSurgeries((prev) => [...prev, item]);
    onToast(`Added surgery: ${item.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setSurgeries((prev) => prev.filter((s) => s.id !== id));
    onToast(`Removed surgery: ${name}`);
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Previous Surgeries
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{surgeries.length} Recorded Procedures</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Surgery</span>
          </button>
        </div>

        {surgeries.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No previous surgeries recorded</p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-[#00a896] hover:underline cursor-pointer"
            >
              + Add Surgery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {surgeries.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {s.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {s.year}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hospital: <span className="font-semibold text-slate-700 dark:text-slate-300">{s.hospital}</span>
                  </p>
                  {s.doctor && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Surgeon: {s.doctor}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove Surgery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSurgeryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </>
  );
};

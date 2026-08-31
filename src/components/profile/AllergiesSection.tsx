import React, { useState } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import type { AllergyItem } from './AddAllergyModal';
import { AddAllergyModal } from './AddAllergyModal';

interface AllergiesSectionProps {
  onToast: (msg: string) => void;
}

export const AllergiesSection: React.FC<AllergiesSectionProps> = ({ onToast }) => {
  const [allergies, setAllergies] = useState<AllergyItem[]>([
    { id: '1', name: 'Penicillin', severity: 'Moderate', reaction: 'Skin Rash & Hives', notes: 'Diagnosed 2018' },
    { id: '2', name: 'Peanuts', severity: 'Severe', reaction: 'Anaphylactic throat swelling', notes: 'Requires EpiPen' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (item: AllergyItem) => {
    setAllergies((prev) => [...prev, item]);
    onToast(`Added allergy: ${item.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setAllergies((prev) => prev.filter((a) => a.id !== id));
    onToast(`Removed allergy: ${name}`);
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Allergies & Sensitivities
              </h3>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{allergies.length} Recorded Allergies</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Allergy</span>
          </button>
        </div>

        {allergies.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">No allergies recorded</p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-[#00a896] hover:underline cursor-pointer"
            >
              + Add Allergy Information
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allergies.map((a) => {
              const isSevere = a.severity === 'Severe';
              const isMod = a.severity === 'Moderate';
              const badgeBg = isSevere
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                : isMod
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700';

              return (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                        {a.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeBg}`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Reaction: <strong className="font-semibold text-slate-800 dark:text-slate-200">{a.reaction}</strong>
                    </p>
                    {a.notes && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">"{a.notes}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(a.id, a.name)}
                    className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Remove Allergy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddAllergyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </>
  );
};

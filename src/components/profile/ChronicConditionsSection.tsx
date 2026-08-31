import React, { useState } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';
import type { ConditionItem } from './AddConditionModal';
import { AddConditionModal } from './AddConditionModal';

interface ChronicConditionsSectionProps {
  onToast: (msg: string) => void;
}

export const ChronicConditionsSection: React.FC<ChronicConditionsSectionProps> = ({ onToast }) => {
  const [conditions, setConditions] = useState<ConditionItem[]>([
    { id: '1', name: 'Hypertension', status: 'Under monitoring', lastReviewed: '15 Aug 2026', notes: 'Daily BP log maintained' },
    { id: '2', name: 'Type 2 Diabetes', status: 'Managed', lastReviewed: '10 Jul 2026', notes: 'HbA1c: 6.2%' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (item: ConditionItem) => {
    setConditions((prev) => [...prev, item]);
    onToast(`Added condition: ${item.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
    onToast(`Removed condition: ${name}`);
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Chronic Conditions
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{conditions.length} Active Medical Conditions</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Condition</span>
          </button>
        </div>

        {conditions.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No chronic conditions recorded</p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-[#00a896] hover:underline cursor-pointer"
            >
              + Add Condition
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {c.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-cyan-400 border border-teal-500/20">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Last Reviewed: <span className="font-semibold">{c.lastReviewed}</span>
                  </p>
                  {c.notes && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">"{c.notes}"</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove Condition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddConditionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </>
  );
};

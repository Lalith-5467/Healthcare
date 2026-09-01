import React, { useState } from 'react';
import { X, Edit, Check } from 'lucide-react';
import type { MedicineItem } from './medicinesData';

interface EditMedicineModalProps {
  isOpen: boolean;
  medicine: MedicineItem | null;
  onClose: () => void;
  onSaveEdit?: (medId: string, updatedFields: Partial<MedicineItem>) => void;
  onSave?: (medId: string, updatedFields: Partial<MedicineItem>) => void;
}

export const EditMedicineModal: React.FC<EditMedicineModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onSaveEdit,
  onSave,
}) => {
  const [dosage, setDosage] = useState(medicine?.dosage || '500');
  const [instructions, setInstructions] = useState(medicine?.instructions || '');
  const [frequency, setFrequency] = useState(medicine?.frequency || 'Twice daily');

  React.useEffect(() => {
    if (medicine) {
      setDosage(medicine.dosage);
      setInstructions(medicine.instructions);
      setFrequency(medicine.frequency);
    }
  }, [medicine]);

  if (!isOpen || !medicine) return null;

  const handleSave = () => {
    const updates = {
      dosage,
      instructions,
      frequency
    };
    if (onSave) onSave(medicine.id, updates);
    if (onSaveEdit) onSaveEdit(medicine.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#00a896]" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Medication</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <span className="text-xs font-bold text-[#00a896] block">{medicine.name}</span>
          <p className="text-[11px] text-slate-500">Update dosage and prescription instructions</p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Dosage Amount ({medicine.unit})
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-[#00a896]"
            >
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Every 4 hours">Every 4 hours</option>
              <option value="As needed">As needed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

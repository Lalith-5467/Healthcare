import React, { useState } from 'react';
import { X, Edit, Check } from 'lucide-react';
import type { MedicineItem } from './medicinesData';

interface EditMedicineModalProps {
  isOpen: boolean;
  medicine: MedicineItem | null;
  onClose: () => void;
  onSaveEdit: (medId: string, updatedFields: Partial<MedicineItem>) => void;
}

export const EditMedicineModal: React.FC<EditMedicineModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onSaveEdit,
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
    onSaveEdit(medicine.id, {
      dosage,
      instructions,
      frequency
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white">Edit Medication</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <span className="text-xs font-bold text-teal-400 block">{medicine.name}</span>
          <p className="text-[11px] text-slate-400">Update dosage and prescription instructions</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Dosage Amount
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#00a896]"
            >
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Every 4 hours">Every 4 hours</option>
              <option value="As needed">As needed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Special Instructions
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896] resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Plus } from 'lucide-react';

export interface SurgeryItem {
  id: string;
  name: string;
  year: string;
  hospital: string;
  doctor?: string;
}

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: SurgeryItem) => void;
}

export const AddSurgeryModal: React.FC<AddSurgeryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('2023');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: Date.now().toString(),
      name,
      year,
      hospital: hospital || 'Apollo Hospital',
      doctor
    });

    setName('');
    setHospital('');
    setDoctor('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Add Previous Surgery</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Surgery Procedure Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Appendectomy, ACL Reconstruction"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2022"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Apollo Hospital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Surgeon / Doctor (Optional)</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Surgery</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

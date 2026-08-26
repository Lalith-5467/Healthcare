import React, { useState, useEffect } from 'react';
import { X, Edit, Check, Sparkles } from 'lucide-react';
import type { EmergencyMedicalInfo } from './emergencyData';

interface EditMedicalInfoModalProps {
  info: EmergencyMedicalInfo;
  isOpen: boolean;
  onClose: () => void;
  onSaveInfo: (updated: EmergencyMedicalInfo) => void;
}

export const EditMedicalInfoModal: React.FC<EditMedicalInfoModalProps> = ({
  info,
  isOpen,
  onClose,
  onSaveInfo,
}) => {
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [preferredHospital, setPreferredHospital] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (info) {
      setBloodGroup(info.bloodGroup);
      setAllergies(info.allergies);
      setConditions(info.conditions);
      setMedications(info.medications);
      setPreferredHospital(info.preferredHospital);
    }
  }, [info, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: EmergencyMedicalInfo = {
      ...info,
      bloodGroup,
      allergies,
      conditions,
      medications,
      preferredHospital
    };

    setTimeout(() => {
      setSaving(false);
      onSaveInfo(updated);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00a896]/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Emergency Medical Info</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Update critical responder triage data</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 font-medium">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Severe Allergies</label>
            <input
              type="text"
              required
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Chronic Conditions</label>
            <input
              type="text"
              required
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Current Medications</label>
            <input
              type="text"
              required
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Preferred Hospital</label>
            <input
              type="text"
              required
              value={preferredHospital}
              onChange={(e) => setPreferredHospital(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            {saving ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Saving Medical Info...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Medical ID Info</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

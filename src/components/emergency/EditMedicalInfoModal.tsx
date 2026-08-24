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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Edit Emergency Medical Info</h3>
              <p className="text-xs text-slate-400">Update responder allergy & blood group data</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Severe Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Medical Conditions</label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Hypertension, Asthma"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Current Medications</label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Amlodipine 5mg"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Preferred Hospital</label>
            <input
              type="text"
              value={preferredHospital}
              onChange={(e) => setPreferredHospital(e.target.value)}
              placeholder="e.g. CityCare Multispecialty Hospital"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Medical Info</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

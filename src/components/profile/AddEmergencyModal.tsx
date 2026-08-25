import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Save } from 'lucide-react';

export interface EmergencyInfoData {
  contactName: string;
  relationship: string;
  phone: string;
  preferredHospital: string;
  secondaryContact?: string;
  familyDoctor?: string;
  healthInsurance?: string;
  organDonor?: string;
  criticalNotes?: string;
}

interface AddEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EmergencyInfoData;
  onSave: (newData: EmergencyInfoData) => void;
}

export const AddEmergencyModal: React.FC<AddEmergencyModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave
}) => {
  const [contactName, setContactName] = useState(data.contactName);
  const [relationship, setRelationship] = useState(data.relationship);
  const [phone, setPhone] = useState(data.phone);
  const [preferredHospital, setPreferredHospital] = useState(data.preferredHospital);
  const [secondaryContact, setSecondaryContact] = useState(data.secondaryContact || '');
  const [familyDoctor, setFamilyDoctor] = useState(data.familyDoctor || '');
  const [healthInsurance, setHealthInsurance] = useState(data.healthInsurance || '');
  const [organDonor, setOrganDonor] = useState(data.organDonor || 'Not Specified');
  const [criticalNotes, setCriticalNotes] = useState(data.criticalNotes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      contactName,
      relationship,
      phone,
      preferredHospital,
      secondaryContact,
      familyDoctor,
      healthInsurance,
      organDonor,
      criticalNotes
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Manage Emergency Info</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Relationship</label>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Preferred Emergency Hospital</label>
              <input
                type="text"
                required
                value={preferredHospital}
                onChange={(e) => setPreferredHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1 mt-2">Secondary Contact</label>
              <input
                type="text"
                value={secondaryContact}
                onChange={(e) => setSecondaryContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                placeholder="Name & Phone"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Family Doctor</label>
              <input
                type="text"
                value={familyDoctor}
                onChange={(e) => setFamilyDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                placeholder="Dr. Name & Contact"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Health Insurance Details</label>
              <input
                type="text"
                value={healthInsurance}
                onChange={(e) => setHealthInsurance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                placeholder="Provider & Policy No."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Organ Donor</label>
              <select
                value={organDonor}
                onChange={(e) => setOrganDonor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              >
                <option value="Not Specified">Not Specified</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Critical Medical Notes</label>
              <input
                type="text"
                value={criticalNotes}
                onChange={(e) => setCriticalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                placeholder="e.g. Asthma, Penicillin allergy"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Info</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Save } from 'lucide-react';

export interface EmergencyInfoData {
  contactName: string;
  relationship: string;
  phone: string;
  preferredHospital: string;
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      contactName,
      relationship,
      phone,
      preferredHospital
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-white">Manage Emergency Info</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Relationship</label>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Preferred Emergency Hospital</label>
              <input
                type="text"
                required
                value={preferredHospital}
                onChange={(e) => setPreferredHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
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

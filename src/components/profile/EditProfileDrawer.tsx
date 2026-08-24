import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Heart } from 'lucide-react';

export interface ProfileFormData {
  name: string;
  dob: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  location: string;
  bloodGroup: string;
  height: string;
  weight: string;
  patientId: string;
}

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileFormData;
  onSave: (newData: ProfileFormData) => void;
}

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [activeTab, setActiveTab] = useState<'personal' | 'health'>('personal');

  if (!isOpen) return null;

  const handleChange = (key: keyof ProfileFormData, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* SLIDE-IN DRAWER PANEL */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col justify-between z-50 select-none overflow-y-auto"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight">Edit Health Profile</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB NAVIGATION */}
          <div className="px-6 pt-4 border-b border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'border-[#00a896] text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'health'
                  ? 'border-[#00a896] text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Health Vitals</span>
            </button>
          </div>

          {/* FORM BODY */}
          <form id="edit-profile-form" onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 text-xs">
            {activeTab === 'personal' ? (
              <>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => handleChange('dob', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Height</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                      placeholder="e.g. 174 cm"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Weight</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      placeholder="e.g. 72 kg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                    />
                  </div>
                </div>
              </>
            )}
          </form>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="edit-profile-form"
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

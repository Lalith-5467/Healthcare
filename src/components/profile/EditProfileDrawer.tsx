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
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* MODAL PANEL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-auto max-h-[90vh] bg-white border border-slate-200 text-slate-800 shadow-2xl rounded-2xl flex flex-col z-50 select-none overflow-hidden"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xl font-black tracking-tight text-slate-900">Edit Health Profile</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB NAVIGATION */}
          <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2 bg-white shrink-0">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'border-[#00a896] text-[#00a896]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'health'
                  ? 'border-[#00a896] text-[#00a896]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Health Vitals</span>
            </button>
          </div>

          {/* FORM BODY */}
          <form id="edit-profile-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto text-sm">
            {activeTab === 'personal' ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Date of Birth</label>
                    <input
                      type="text"
                      value={formData.dob}
                      onChange={(e) => handleChange('dob', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Height</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                      placeholder="e.g. 174 cm"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Weight</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      placeholder="e.g. 72 kg"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 focus:border-[#00a896] transition-all"
                    />
                  </div>
                </div>
              </>
            )}
          </form>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-slate-100 flex items-center gap-3 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="edit-profile-form"
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

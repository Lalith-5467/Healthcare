import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake,
  Save,
  X
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

interface CaregiverProfileViewProps {
  user?: { name: string; email: string; phone?: string; role?: string };
}

export const CaregiverProfileView: React.FC<CaregiverProfileViewProps> = ({ user }) => {
  const { wards } = useCaregiverWorkflow();
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Anita Sharma');
  const [preferredName, setPreferredName] = useState('Anita');
  const [dob, setDob] = useState('1982-05-14');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 11223');
  const [email, setEmail] = useState(user?.email || 'anita.caregiver@abdm.in');
  const [address, setAddress] = useState('Flat 4B, Shanti Apartments');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');

  // Emergency Contact
  const [emergName, setEmergName] = useState('Rajesh Sharma');
  const [emergRel, setEmergRel] = useState('Husband');
  const [emergPhone, setEmergPhone] = useState('+91 99887 77665');
  const [emergAltPhone, setEmergAltPhone] = useState('+91 99887 77666');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setToastMsg('Profile updated successfully');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 select-none pb-24">
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Caregiver Profile</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage your personal, professional, and caregiver identity information.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 self-start md:self-auto"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OVERVIEW & VERIFICATION (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PROFILE OVERVIEW CARD */}
          <div className="rounded-3xl bg-gradient-to-br from-teal-50 via-cyan-50 to-white dark:from-[#0b172a] dark:via-[#0b223c] dark:to-[#041224] p-6 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                  {name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight text-slate-900 dark:text-white">{name}</h3>
                  <p className="text-xs text-teal-600 dark:text-teal-300 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> ABDM Verified Caregiver
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-black px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Caregiver ID</span>
                <span className="font-mono font-black text-teal-700 dark:text-cyan-300">CG-8421-9902</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Caregiver Type</span>
                <span className="font-bold text-slate-900 dark:text-white">Family Caregiver</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Relationship</span>
                <span className="font-bold text-slate-900 dark:text-white">Daughter</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Dependents</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{wards.length}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Verification</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>

          {/* VERIFICATION & ACCOUNT STATUS */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Verification & Account</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">ABDM Caregiver ID</span>
                <span className="font-black text-slate-900 dark:text-white font-mono">CG-8421-9902@abdm</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">Identity Verification</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">KYC Status</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Complete</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">Account Status</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-bold px-2">
                <span>Profile Created: 15 Jan 2026</span>
                <span>Last Updated: 28 Aug 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORMS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <form id="profile-form" onSubmit={handleSave} className="space-y-6">
            
            {/* PERSONAL INFORMATION */}
            <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Full Legal Name</label>
                  {isEditing ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{name}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Preferred Name</label>
                  {isEditing ? (
                    <input type="text" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{preferredName}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{new Date(dob).toLocaleDateString('en-GB')}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Phone Number</label>
                  {isEditing ? (
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{phone}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-500 block mb-1">Email Address</label>
                  {isEditing ? (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{email}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-500 block mb-1">Address</label>
                  {isEditing ? (
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{address}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">City</label>
                  {isEditing ? (
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{city}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">State</label>
                  {isEditing ? (
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{state}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CAREGIVER INFORMATION */}
            <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-500" /> Caregiver Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Caregiver Type</label>
                  <div className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 font-black text-slate-900 dark:text-white opacity-80 cursor-not-allowed">
                    Family Caregiver
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Relationship</label>
                  <div className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 font-black text-slate-900 dark:text-white opacity-80 cursor-not-allowed">
                    Daughter
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Assigned Dependents</label>
                  <div className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 font-black text-slate-900 dark:text-white opacity-80 cursor-not-allowed">
                    {wards.length}
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Primary Caregiver</label>
                  <div className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 font-black text-emerald-600 dark:text-emerald-400 opacity-80 cursor-not-allowed">
                    Yes
                  </div>
                </div>
                <div className="sm:col-span-2 pt-2 text-[10px] text-slate-500 font-bold">
                  Note: Professional fields (Qualification, Registration Number) are not applicable for Family Caregivers.
                </div>
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Contact Name</label>
                  {isEditing ? (
                    <input type="text" value={emergName} onChange={(e) => setEmergName(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{emergName}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Relationship</label>
                  {isEditing ? (
                    <input type="text" value={emergRel} onChange={(e) => setEmergRel(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{emergRel}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Phone Number</label>
                  {isEditing ? (
                    <input type="tel" value={emergPhone} onChange={(e) => setEmergPhone(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{emergPhone}</p>
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Alternate Phone</label>
                  {isEditing ? (
                    <input type="tel" value={emergAltPhone} onChange={(e) => setEmergAltPhone(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  ) : (
                    <p className="h-10 px-3.5 flex items-center rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-transparent font-black text-slate-900 dark:text-white">{emergAltPhone}</p>
                  )}
                </div>
              </div>
            </div>

          </form>
        </div>

      </div>

      {/* STICKY BOTTOM BAR WHEN EDITING */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-[#0b1120] shadow-2xl border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[400px]"
          >
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">Edit Profile</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">You have unsaved changes.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                type="submit"
                form="profile-form"
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

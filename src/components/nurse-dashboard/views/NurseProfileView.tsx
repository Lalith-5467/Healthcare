import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Sparkles,
  HeartPulse,
  FileBadge
} from 'lucide-react';

export const NurseProfileView: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Nurse Sarah Jenkins',
    designation: 'Senior Registered Nurse (RN) • Critical Care Specialist',
    licenseNo: 'RN-TN-2024-88492',
    hospital: 'Apollo Central Health City, Chennai',
    department: 'Home Healthcare & Emergency Telemetry Unit',
    email: 'sarah.jenkins@medicare.health',
    phone: '+91 98402 77011',
    experience: '8+ Years',
    specialties: [
      'Post-Op Surgical Wound Care',
      'IV Infusions & Central Line Care',
      'Elderly ICU & Catheterization',
      'Pediatric Emergency Telemetry',
      'Palliative & Pain Management'
    ],
    shiftStatus: 'On Duty • Available for Dispatch',
    rating: '4.95 / 5.0 (340+ Verified Home Visits)',
    bio: 'Certified Critical Care Nurse with 8 years of intensive hospital and home healthcare experience. Specialized in rapid surgical recovery, sterile IV catheterizations, and continuous remote biometrics monitoring.'
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* SAVED TOAST */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Professional Profile & Credentials Updated Successfully!</span>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white/20 shrink-0">
            SJ
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {profile.shiftStatus}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                ID: RN-7701
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {profile.name}
            </h1>
            <p className="text-xs text-rose-200/80 font-semibold mt-0.5">
              {profile.designation}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 shadow-sm cursor-pointer transition-all flex items-center gap-2 self-start md:self-center"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
        </button>
      </div>

      {/* 2-COLUMN PROFILE CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: BADGES & CERTIFICATES */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-rose-500" /> License & Credentials
            </h3>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nursing License</span>
                <strong className="font-mono text-slate-900 dark:text-white">{profile.licenseNo}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">State Registry</span>
                <strong className="text-slate-900 dark:text-white">Tamil Nadu Nursing Council</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">ABDM Registry</span>
                <strong className="text-emerald-600 font-mono font-black">HP-RN-99201 (Active)</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Hospital Affiliation</span>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" />
                {profile.hospital}
              </p>
              <p className="text-slate-500 text-[11px]">{profile.department}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Patient Rating & Trust
            </h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">4.95 ⭐</p>
            <p className="text-xs text-slate-500">Based on 340+ verified in-home clinical visits and doctor peer reviews.</p>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INFO & SPECIALIZATIONS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 uppercase font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase font-bold mb-1">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border font-medium resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Clinical Bio & Overview</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Clinical Specializations & Procedures</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                    <strong className="text-slate-900 dark:text-white mt-0.5 block truncate">{profile.email}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Emergency Clinical Mobile</span>
                    <strong className="text-slate-900 dark:text-white mt-0.5 block">{profile.phone}</strong>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

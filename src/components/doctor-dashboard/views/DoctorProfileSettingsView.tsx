import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Stethoscope, 
  Award, 
  Clock, 
  Video, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const DoctorProfileSettingsView: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. Rajesh Varma',
    qualifications: 'MBBS, MD (General Medicine), DNB (Cardiology)',
    regNumber: 'MCI-TN-2015-84920',
    abdmDoctorId: 'HP-DOC-98210@abdm',
    hospital: 'Apollo Central Health City',
    specialty: 'Internal Medicine & Preventive Cardiology',
    opdRoom: 'OPD Suite 402, Block B',
    consultationFee: '800',
    videoConsultationEnabled: true,
    autoAcceptEmergency: true,
    teleConsultHours: '09:00 AM - 01:00 PM | 04:00 PM - 07:00 PM'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* TOAST */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Doctor Clinical Credentials & Settings Saved!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" /> Doctor Credentials & Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Practitioner Profile & Clinical Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Manage your Medical Council credentials, tele-health availability, and OPD consultation slots.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* DOCTOR CREDENTIALS CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00a896] to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{profile.name}</h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-cyan-950/60 dark:text-cyan-300 font-mono">
                  MCI Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{profile.qualifications}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">ABDM Registry: {profile.abdmDoctorId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Specialty & Department</label>
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Hospital Affiliation & OPD Room</label>
              <input
                type="text"
                value={`${profile.hospital} • ${profile.opdRoom}`}
                onChange={(e) => setProfile({ ...profile, opdRoom: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Consultation Fee (₹)</label>
              <input
                type="number"
                value={profile.consultationFee}
                onChange={(e) => setProfile({ ...profile, consultationFee: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Available Telemedicine Hours</label>
              <input
                type="text"
                value={profile.teleConsultHours}
                onChange={(e) => setProfile({ ...profile, teleConsultHours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Enable Video Tele-Consultations</p>
                <p className="text-[11px] text-slate-500">Allow patients to book and join verified WebRTC encrypted video appointments.</p>
              </div>
              <input
                type="checkbox"
                checked={profile.videoConsultationEnabled}
                onChange={(e) => setProfile({ ...profile, videoConsultationEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#00a896] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Auto-Accept Critical Emergency Alerts</p>
                <p className="text-[11px] text-slate-500">Instantly notify clinician when patient telemetry reports critical low SpO2 or hypertensive crisis.</p>
              </div>
              <input
                type="checkbox"
                checked={profile.autoAcceptEmergency}
                onChange={(e) => setProfile({ ...profile, autoAcceptEmergency: e.target.checked })}
                className="w-5 h-5 accent-[#00a896] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-500 hover:to-teal-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-teal-500/20 text-xs cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Practitioner Profile & Preferences</span>
        </button>

      </form>

    </div>
  );
};

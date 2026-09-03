import React, { useState } from 'react';
import { User, Edit, Camera, Check, Sparkles } from 'lucide-react';
import type { UserProfileSettings } from './settingsData';

interface ProfileSettingsSectionProps {
  profile: UserProfileSettings;
  onSaveProfile: (updated: UserProfileSettings) => void;
  onMarkUnsaved: () => void;
}

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  profile,
  onSaveProfile,
  onMarkUnsaved,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [dob, setDob] = useState(profile.dob);
  const [gender, setGender] = useState(profile.gender);
  const [location, setLocation] = useState(profile.location);
  const [bloodGroup] = useState(profile.bloodGroup);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profile.avatarUrl);
  const [saving, setSaving] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
          onMarkUnsaved();
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: UserProfileSettings = {
      ...profile,
      fullName,
      email,
      phone,
      dob,
      gender,
      location,
      bloodGroup,
      avatarUrl: avatarPreview
    };

    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      onSaveProfile(updated);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Profile</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Manage your personal profile information and patient identity</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#00a896] opacity-90 hover:opacity-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* AVATAR & BASIC METADATA */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#00a896] font-extrabold text-2xl overflow-hidden shadow-lg">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>

          <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00a896] opacity-90 hover:opacity-100 text-white cursor-pointer shadow-md transition-transform hover:scale-110">
            <Camera className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{fullName}</h4>
          <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">{email} • {phone}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-[#00a896] border border-slate-200 dark:border-slate-700 font-mono">
            Blood Group {bloodGroup}
          </span>
        </div>
      </div>

      {/* FORM / READ-ONLY GRID */}
      <form onSubmit={handleSave} className="space-y-4 font-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={email}
              onChange={(e) => { setEmail(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Date of Birth</label>
            <input
              type="date"
              disabled={!isEditing}
              value={dob}
              onChange={(e) => { setDob(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] dark:[color-scheme:dark] font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Gender</label>
            <select
              disabled={!isEditing}
              value={gender}
              onChange={(e) => { setGender(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] font-sans"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5 font-sans">Location</label>
            <input
              type="text"
              disabled={!isEditing}
              value={location}
              onChange={(e) => { setLocation(e.target.value); onMarkUnsaved(); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896] font-sans"
            />
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end font-sans">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] opacity-90 hover:opacity-100 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

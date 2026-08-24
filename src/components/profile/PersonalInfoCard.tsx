import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, Edit3 } from 'lucide-react';

interface PersonalInfoCardProps {
  name?: string;
  dob?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  location?: string;
  onOpenEdit: () => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  name = 'Samson L.',
  dob = '15 March 1994',
  age = 32,
  gender = 'Male',
  phone = '+91 98765 43210',
  email = 'samson.l@abdm.in',
  location = 'Chennai, India',
  onOpenEdit
}) => {
  const fields = [
    { label: 'Full Name', value: name, icon: User },
    { label: 'Date of Birth', value: dob, icon: Calendar },
    { label: 'Age', value: `${age} Years`, icon: Calendar },
    { label: 'Gender', value: gender, icon: User },
    { label: 'Phone Number', value: phone, icon: Phone },
    { label: 'Email Address', value: email, icon: Mail },
    { label: 'Location', value: location, icon: MapPin }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Personal Information
            </h3>
            <span className="text-[11px] text-slate-400">Demographic & Contact Details</span>
          </div>
        </div>

        <button
          onClick={onOpenEdit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* 2-COLUMN GRID ON DESKTOP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fields.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {f.label}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                  {f.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

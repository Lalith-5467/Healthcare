import React from 'react';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  location = 'Chennai, India'
}) => {
  const { t } = useLanguage();

  const localizedGender =
    gender?.toLowerCase() === 'female'
      ? t('profile.female', 'Female')
      : gender?.toLowerCase() === 'male'
      ? t('profile.male', 'Male')
      : gender || t('common.other', 'Other');

  const fields = [
    { label: t('profile.full_name', 'Full Name'), value: name, icon: User },
    { label: t('profile.dob', 'Date of Birth'), value: dob, icon: Calendar },
    { label: t('profile.age', 'Age'), value: `${age} ${t('common.years', 'Years')}`, icon: Calendar },
    { label: t('profile.gender', 'Gender'), value: localizedGender, icon: User },
    { label: t('profile.phone', 'Phone Number'), value: phone, icon: Phone },
    { label: t('profile.email', 'Email Address'), value: email, icon: Mail },
    { label: t('profile.location', 'Location'), value: location, icon: MapPin }
  ];

  return (
    <div className="p-6 h-full rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 max-w-4xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('profile.personal_info', 'Personal Information')}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('profile.demographic_details', 'Demographic & Contact Details')}
            </span>
          </div>
        </div>
      </div>

      {/* TABLE LAYOUT */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <table className="w-full text-left border-collapse">
          <tbody>
            {fields.map((f, idx) => {
              const Icon = f.icon;
              return (
                <tr key={idx} className="border-b border-slate-200/60 dark:border-slate-800 last:border-0">
                  <th className="py-3 px-4 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap w-1/3 sm:w-1/4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      {f.label}
                    </div>
                  </th>
                  <td className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-white">
                    {f.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


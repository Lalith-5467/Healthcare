import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, Building2, User, Edit3, Users, Stethoscope, ShieldPlus, HeartHandshake, AlertCircle } from 'lucide-react';
import type { EmergencyInfoData } from './AddEmergencyModal';
import { AddEmergencyModal } from './AddEmergencyModal';

interface EmergencyInfoCardProps {
  onToast: (msg: string) => void;
}

export const EmergencyInfoCard: React.FC<EmergencyInfoCardProps> = ({ onToast }) => {
  const [data, setData] = useState<EmergencyInfoData>({
    contactName: 'Anita L.',
    relationship: 'Mother',
    phone: '+91 98765 12345',
    preferredHospital: 'Apollo Hospital, Greams Road',
    secondaryContact: 'N/A',
    familyDoctor: 'Dr. Ramesh (9876543210)',
    healthInsurance: 'Star Health (Pol: 123456)',
    organDonor: 'Yes',
    criticalNotes: 'None'
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (newData: EmergencyInfoData) => {
    setData(newData);
    localStorage.setItem('emergency_info_data', JSON.stringify(newData));
    onToast('Emergency information updated successfully!');
  };

  return (
    <>
      <div className="p-6 h-full rounded-3xl bg-white dark:bg-[#0f172a] border border-rose-200/60 dark:border-rose-900/40 shadow-xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/30 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Emergency Information
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">SOS First Responder Contacts</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage Info</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* CONTACTS COLUMN */}
          <div className="flex-1 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1">Contacts</h4>
            
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{data.contactName} ({data.relationship})</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 block">{data.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Secondary</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{data.secondaryContact || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* MEDICAL DETAILS COLUMN */}
          <div className="flex-1 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1">Medical Details</h4>
            
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">{data.familyDoctor || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldPlus className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">{data.healthInsurance || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-3">
              <HeartHandshake className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Organ Donor: {data.organDonor || 'Not Specified'}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROWS */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60">
            <Building2 className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400 mr-1.5">Preferred:</span>
              {data.preferredHospital}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
            <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
              <span className="text-rose-400 dark:text-rose-400/80 mr-1.5">Critical Notes:</span>
              {data.criticalNotes || 'None'}
            </span>
          </div>
        </div>
      </div>

      <AddEmergencyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        onSave={handleSave}
      />
    </>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, Building2, User, Edit3 } from 'lucide-react';
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
    preferredHospital: 'Apollo Hospital, Greams Road'
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (newData: EmergencyInfoData) => {
    setData(newData);
    localStorage.setItem('emergency_info_data', JSON.stringify(newData));
    onToast('Emergency information updated successfully!');
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-rose-900/20 to-slate-900 border border-rose-500/30 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Emergency Information
              </h3>
              <span className="text-[11px] text-slate-300">SOS First Responder Contacts</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage Info</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <User className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Contact</span>
              <span className="text-xs font-extrabold text-white">{data.contactName} ({data.relationship})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
              <span className="text-xs font-extrabold text-white">{data.phone}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 sm:col-span-2">
            <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Emergency Hospital</span>
              <span className="text-xs font-extrabold text-white">{data.preferredHospital}</span>
            </div>
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

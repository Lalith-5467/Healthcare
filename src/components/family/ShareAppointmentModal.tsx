import React, { useState } from 'react';
import { X, Calendar, Check, Sparkles } from 'lucide-react';
import type { FamilyMember, SharedAppointment } from './familyData';

interface ShareAppointmentModalProps {
  members: FamilyMember[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare?: (newAppointment: SharedAppointment) => void;
  onShare?: (newAppointment: SharedAppointment) => void;
}

export const ShareAppointmentModal: React.FC<ShareAppointmentModalProps> = ({
  members,
  isOpen,
  onClose,
  onConfirmShare,
  onShare,
}) => {
  const [doctorName, setDoctorName] = useState('Dr. Rajesh Kumar');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((m) => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sharedNames = members
      .filter((m) => selectedMemberIds.includes(m.id))
      .map((m) => `${m.name} (${m.relationship})`);

    const newApt: SharedAppointment = {
      id: `APT-SH-${Date.now().toString().slice(-4)}`,
      doctorName,
      speciality: 'Cardiologist',
      type: 'Video Consultation',
      date: 'Today · 24 Aug 2026',
      time: '10:30 AM',
      sharedWith: sharedNames.length ? sharedNames : ['Priya Kumar (Mother)'],
      status: 'Upcoming'
    };

    setTimeout(() => {
      if (onConfirmShare) onConfirmShare(newApt);
      if (onShare) onShare(newApt);
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Share Appointment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select family members to share visit details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Doctor / Facility</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Select Family Members</label>
            <div className="space-y-2">
              {members.map((m) => {
                const selected = selectedMemberIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      selected
                        ? 'bg-[#00a896]/10 dark:bg-[#00a896]/20 border-[#00a896] shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className={`font-bold ${selected ? 'text-teal-700 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}`}>{m.name} ({m.relationship})</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-cyan-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Sharing Appointment...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Share Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

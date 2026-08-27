import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';
import type { FamilyMember, SharingPermissionState } from './familyData';

interface ManagePermissionsModalProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
  initialPermissions?: SharingPermissionState;
  onSavePermissions: (updated: SharingPermissionState) => void;
}

export const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({
  member,
  isOpen,
  onClose,
  initialPermissions,
  onSavePermissions,
}) => {
  const [accessLevel, setAccessLevel] = useState<'View Only' | 'Manage' | 'Full Access'>('View Only');
  const [appointments, setAppointments] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [pharmacy, setPharmacy] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState(false);
  const [healthAnalytics, setHealthAnalytics] = useState(false);
  const [consultations, setConsultations] = useState(true);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !member) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedPerm: SharingPermissionState = {
      memberId: member.id,
      memberName: `${member.name} (${member.relationship})`,
      accessLevel,
      appointments,
      reminders,
      pharmacy,
      medicalRecords,
      healthAnalytics,
      consultations
    };

    setTimeout(() => {
      onSavePermissions(updatedPerm);
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Manage Permissions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure sharing rules for {member.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* ACCESS LEVEL */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
              Access Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['View Only', 'Manage', 'Full Access'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setAccessLevel(lvl)}
                  className={`py-2 px-2.5 rounded-xl font-bold border text-center transition-colors cursor-pointer ${
                    accessLevel === lvl
                      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* MODULE TOGGLES */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Shared Modules
            </label>

            {[
              { label: 'Appointments', state: appointments, setter: setAppointments },
              { label: 'Reminders & Doses', state: reminders, setter: setReminders },
              { label: 'Pharmacy Refills', state: pharmacy, setter: setPharmacy },
              { label: 'Medical Records', state: medicalRecords, setter: setMedicalRecords },
              { label: 'Health Analytics', state: healthAnalytics, setter: setHealthAnalytics },
              { label: 'Consultations', state: consultations, setter: setConsultations }
            ].map((mod) => (
              <div key={mod.label} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{mod.label}</span>
                <button
                  type="button"
                  onClick={() => mod.setter(!mod.state)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    mod.state ? 'bg-[#00a896]' : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    mod.state ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving Permissions...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Permissions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

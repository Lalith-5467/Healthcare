import React from 'react';
import { Plus, Phone, Edit, Trash2, User } from 'lucide-react';
import type { EmergencyContactItem } from './emergencyData';

interface EmergencyContactsSectionProps {
  contacts: EmergencyContactItem[];
  onOpenAddContact: () => void;
  onOpenEditContact: (contact: EmergencyContactItem) => void;
  onOpenRemoveContact: (contact: EmergencyContactItem) => void;
  onCallContact: (contact: EmergencyContactItem) => void;
}

export const EmergencyContactsSection: React.FC<EmergencyContactsSectionProps> = ({
  contacts,
  onOpenAddContact,
  onOpenEditContact,
  onOpenRemoveContact,
  onCallContact,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency Contacts</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Trusted contacts automatically notified during emergency SOS sequence</p>
        </div>

        <button
          onClick={onOpenAddContact}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* CONTACTS GRID */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {contacts.map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-base font-sans">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">{c.name}</h4>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 block font-bold">{c.relationship}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  c.priority === 'Primary'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    : c.priority === 'Secondary'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
                }`}>
                  {c.priority}
                </span>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                <div><span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Phone: </span><strong>{c.phone}</strong></div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-sans">
                <button
                  onClick={() => onCallContact(c)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-300" />
                  <span>Call</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditContact(c)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenRemoveContact(c)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">No emergency contacts added yet.</p>
          <button
            onClick={onOpenAddContact}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold cursor-pointer"
          >
            Add First Contact Now
          </button>
        </div>
      )}
    </div>
  );
};

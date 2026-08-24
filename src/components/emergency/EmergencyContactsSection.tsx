import React from 'react';
import { Users, Plus, Phone, Edit, Trash2, User } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-white">Emergency Contacts</h3>
          <p className="text-xs text-slate-400 font-medium">Trusted contacts automatically notified during emergency SOS sequence</p>
        </div>

        <button
          onClick={onOpenAddContact}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* CONTACTS GRID */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {contacts.map((c) => (
            <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-base font-sans">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm font-sans">{c.name}</h4>
                    <span className="text-[10px] text-purple-300 block">{c.relationship}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  c.priority === 'Primary'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : c.priority === 'Secondary'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                }`}>
                  {c.priority}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold">{c.phone}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCallContact(c)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
                    title="Call Contact"
                  >
                    <Phone className="w-3.5 h-3.5 fill-emerald-400" />
                  </button>
                  <button
                    onClick={() => onOpenEditContact(c)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => onOpenRemoveContact(c)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 cursor-pointer"
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
        <div className="py-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No emergency contacts added yet.</p>
          <button
            onClick={onOpenAddContact}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
          >
            + Add First Contact
          </button>
        </div>
      )}
    </div>
  );
};

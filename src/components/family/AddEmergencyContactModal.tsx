import React, { useState } from 'react';
import { X, PhoneCall, Check, Sparkles } from 'lucide-react';
import type { EmergencyContact } from './familyData';

interface AddEmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveContact?: (newContact: EmergencyContact) => void;
  onAdd?: (newContact: EmergencyContact) => void;
}

export const AddEmergencyContactModal: React.FC<AddEmergencyContactModalProps> = ({
  isOpen,
  onClose,
  onSaveContact,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Father');
  const [phone, setPhone] = useState('+91 98765 ');
  const [priority, setPriority] = useState<'Primary Contact' | 'Secondary Contact'>('Primary Contact');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSaving(true);

    const created: EmergencyContact = {
      id: `EMG-${Date.now().toString().slice(-4)}`,
      name,
      relationship,
      phone,
      priority
    };

    setTimeout(() => {
      if (onSaveContact) onSaveContact(created);
      if (onAdd) onAdd(created);
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
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Add Emergency Contact</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure emergency phone contact info</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              Contact Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arun Kumar"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Relationship</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Father, Spouse"
                className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896]"
              >
                <option value="Primary Contact">Primary Contact</option>
                <option value="Secondary Contact">Secondary Contact</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name || !phone}
              className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving Contact...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Contact</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

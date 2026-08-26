import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Sparkles } from 'lucide-react';
import type { EmergencyContactItem } from './emergencyData';

interface AddEditContactModalProps {
  contactToEdit: EmergencyContactItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveContact: (contact: EmergencyContactItem) => void;
}

export const AddEditContactModal: React.FC<AddEditContactModalProps> = ({
  contactToEdit,
  isOpen,
  onClose,
  onSaveContact,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<'Primary' | 'Secondary' | 'Medical Contact'>('Secondary');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name);
      setRelationship(contactToEdit.relationship);
      setPhone(contactToEdit.phone);
      setPriority(contactToEdit.priority);
    } else {
      setName('');
      setRelationship('Mother');
      setPhone('+91 ');
      setPriority('Secondary');
    }
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    const newContact: EmergencyContactItem = {
      id: contactToEdit ? contactToEdit.id : `CONT-${Date.now().toString().slice(-4)}`,
      name,
      relationship,
      phone,
      priority,
      status: 'Ready'
    };

    setTimeout(() => {
      setSubmitting(false);
      onSaveContact(newContact);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {contactToEdit ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Automatic SOS notification recipient</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 font-medium">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contact Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Relationship</label>
              <input
                type="text"
                required
                placeholder="e.g. Spouse / Doctor"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none font-sans"
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Medical Contact">Medical Contact</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Phone Number</label>
            <input
              type="text"
              required
              placeholder="+91 98401 23456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            {submitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Saving Contact...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Emergency Contact</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

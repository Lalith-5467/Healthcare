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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {contactToEdit ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h3>
              <p className="text-xs text-slate-400">Specify priority and relationship</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Kumar"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Relationship</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Mother / Father / Spouse / Doctor"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98401 23456"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Contact Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="Primary">Primary (First Alert Contact)</option>
              <option value="Secondary">Secondary Contact</option>
              <option value="Medical Contact">Medical Contact / Doctor</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {submitting ? (
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

import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { EmergencyContactItem } from './emergencyData';

interface RemoveContactModalProps {
  contact: EmergencyContactItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRemove: (id: string) => void;
}

export const RemoveContactModal: React.FC<RemoveContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onConfirmRemove,
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Remove Emergency Contact?</h3>
              <p className="text-xs text-slate-400">{contact.name} ({contact.relationship})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-slate-300 leading-relaxed">
          Are you sure you want to remove <strong className="text-white">{contact.name}</strong> from your emergency contact list? They will no longer receive emergency alerts.
        </p>

        <div className="pt-2 flex justify-between gap-3 font-extrabold">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
          <button onClick={() => { onConfirmRemove(contact.id); onClose(); }} className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md">Confirm Remove</button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Share2, Check, Sparkles } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalShareFamilyModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare: (hospName: string, memberName: string) => void;
}

export const HospitalShareFamilyModal: React.FC<HospitalShareFamilyModalProps> = ({
  hospital,
  isOpen,
  onClose,
  onConfirmShare,
}) => {
  const [selectedMember, setSelectedMember] = useState<string>('Priya Kumar (Mother)');
  const [sharing, setSharing] = useState(false);

  if (!isOpen || !hospital) return null;

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    setSharing(true);

    setTimeout(() => {
      setSharing(false);
      onConfirmShare(hospital.name, selectedMember);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Share with Family</h3>
              <p className="text-xs text-slate-400">Share facility details with family members</p>
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
        <form onSubmit={handleShare} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospital Target:</span>
            <strong className="text-white text-sm">{hospital.name}</strong>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">Select Family Member</label>
            <div className="space-y-2">
              {[
                { name: 'Priya Kumar', rel: 'Mother' },
                { name: 'Arun Kumar', rel: 'Father' },
                { name: 'Ananya Kumar', rel: 'Sister' },
                { name: 'Rahul Kumar', rel: 'Brother' }
              ].map((m) => {
                const label = `${m.name} (${m.rel})`;
                const selected = selectedMember === label;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMember(label)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      selected
                        ? 'bg-cyan-500/20 text-white border-cyan-500/40'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold">{label}</span>
                    {selected && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
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
              disabled={sharing}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {sharing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Sharing Hospital...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Share Facility</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles } from 'lucide-react';
import type { FamilyMemberCoverage } from './insuranceData';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: FamilyMemberCoverage) => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [memberName, setMemberName] = useState('');
  const [relationship, setRelationship] = useState<'Self' | 'Mother' | 'Father' | 'Spouse' | 'Sister' | 'Brother' | 'Child'>('Mother');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    setSubmitting(true);
    const newMem: FamilyMemberCoverage = {
      id: `FAM-${Date.now().toString().slice(-4)}`,
      memberName,
      relationship,
      status: 'Covered',
      coverageLimit: 1000000,
      usedAmount: 0
    };

    setTimeout(() => {
      setSubmitting(false);
      onAddMember(newMem);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Add Family Member to Policy</h3>
              <p className="text-xs text-slate-400">Family Floater CarePlus Plan</p>
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
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Family Member Name</label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Meena Patel"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as any)}
              className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Spouse">Spouse</option>
              <option value="Sister">Sister</option>
              <option value="Brother">Brother</option>
              <option value="Child">Child</option>
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
                  <span>Adding Member...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add to Policy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

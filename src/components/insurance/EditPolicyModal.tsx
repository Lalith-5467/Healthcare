import React, { useState, useEffect } from 'react';
import { X, Edit, Check, Sparkles } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface EditPolicyModalProps {
  policy: InsurancePolicy | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePolicy: (updated: InsurancePolicy) => void;
}

export const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  policy,
  isOpen,
  onClose,
  onSavePolicy,
}) => {
  const [providerName, setProviderName] = useState('');
  const [planName, setPlanName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [coverageAmount, setCoverageAmount] = useState(1000000);
  const [premiumAmount, setPremiumAmount] = useState(2450);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (policy) {
      setProviderName(policy.providerName);
      setPlanName(policy.planName);
      setPolicyNumber(policy.policyNumber);
      setCoverageAmount(policy.coverageAmount);
      setPremiumAmount(policy.premiumAmount);
    }
  }, [policy, isOpen]);

  if (!isOpen || !policy) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: InsurancePolicy = {
      ...policy,
      providerName,
      planName,
      policyNumber,
      coverageAmount,
      remainingAmount: coverageAmount - policy.usedAmount,
      premiumAmount
    };

    setTimeout(() => {
      setSaving(false);
      onSavePolicy(updated);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Edit Policy Info</h3>
              <p className="text-xs text-slate-400">{policy.policyNumber}</p>
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
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Provider Name</label>
            <input
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Policy Number</label>
            <input
              type="text"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Coverage Limit (₹)</label>
              <input
                type="number"
                value={coverageAmount}
                onChange={(e) => setCoverageAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Monthly Premium (₹)</label>
              <input
                type="number"
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
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
              disabled={saving}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

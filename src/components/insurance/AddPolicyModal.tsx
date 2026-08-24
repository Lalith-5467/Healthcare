import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPolicy: (newPolicy: InsurancePolicy) => void;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  isOpen,
  onClose,
  onAddPolicy,
}) => {
  const [step, setStep] = useState(1);
  const [providerName, setProviderName] = useState('');
  const [planName, setPlanName] = useState('');
  const [policyType, setPolicyType] = useState<'Family Floater' | 'Individual' | 'Employer' | 'Government' | 'Senior Citizen'>('Individual');
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyHolder, setPolicyHolder] = useState('Arun Kumar');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [coverageAmount, setCoverageAmount] = useState<number>(500000);
  const [premiumAmount, setPremiumAmount] = useState<number>(1800);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!providerName.trim()) errs.providerName = 'Insurance Provider Name is required';
    if (!planName.trim()) errs.planName = 'Plan Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!policyNumber.trim()) errs.policyNumber = 'Policy Number is required';
    if (!policyHolder.trim()) errs.policyHolder = 'Policy Holder Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newPol: InsurancePolicy = {
      id: `POL-${Date.now().toString().slice(-4)}`,
      providerName,
      planName,
      policyNumber,
      policyHolder,
      policyType,
      startDate,
      expiryDate,
      coverageAmount,
      usedAmount: 0,
      remainingAmount: coverageAmount,
      premiumAmount,
      premiumFrequency: '/ month',
      status: 'Active',
      memberId: `MEM-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      isPrimary: false
    };

    setTimeout(() => {
      setSubmitting(false);
      onAddPolicy(newPol);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Add Insurance Policy</h3>
              <p className="text-xs text-slate-400">Step {step} of 3 • Enter policy details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PROVIDER & PLAN */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Insurance Provider Name</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. Star Health / Max Bupa / Care Health"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              />
              {errors.providerName && <p className="text-rose-400 text-[11px] mt-1 font-bold">{errors.providerName}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Plan Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Super Senior / Comprehensive Health"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              />
              {errors.planName && <p className="text-rose-400 text-[11px] mt-1 font-bold">{errors.planName}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Policy Type</label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as any)}
                className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-purple-500"
              >
                <option value="Individual">Individual</option>
                <option value="Family Floater">Family Floater</option>
                <option value="Employer">Employer Group</option>
                <option value="Government">Government Scheme (ABDM)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md cursor-pointer"
              >
                Continue to Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: POLICY DETAILS */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Policy Number</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="e.g. HLT-9821-4412"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
              />
              {errors.policyNumber && <p className="text-rose-400 text-[11px] mt-1 font-bold">{errors.policyNumber}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Policy Holder Name</label>
              <input
                type="text"
                value={policyHolder}
                onChange={(e) => setPolicyHolder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500"
              />
              {errors.policyHolder && <p className="text-rose-400 text-[11px] mt-1 font-bold">{errors.policyHolder}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Coverage Limit (₹)</label>
                <input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Monthly Premium (₹)</label>
                <input
                  type="number"
                  value={premiumAmount}
                  onChange={(e) => setPremiumAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md cursor-pointer"
              >
                Review Policy →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between"><span className="text-slate-400">Provider:</span><strong className="text-white">{providerName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Plan Name:</span><strong className="text-purple-300">{planName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Policy Number:</span><strong className="text-cyan-300">{policyNumber}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Type:</span><strong className="text-slate-200">{policyType}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Coverage Limit:</span><strong className="text-emerald-400">₹{coverageAmount.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Premium:</span><strong className="text-amber-300">₹{premiumAmount}/mo</strong></div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {submitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Adding Policy...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Add Policy</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

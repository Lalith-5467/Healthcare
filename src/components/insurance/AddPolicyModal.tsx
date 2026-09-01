import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';
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
  const [policyHolder, setPolicyHolder] = useState('Lalith Patel');
  const [startDate] = useState('2026-01-01');
  const [expiryDate] = useState('2026-12-31');
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Add Insurance Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Step {step} of 3 • Enter policy details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PROVIDER & PLAN */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Insurance Provider Name
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. Star Health / Max Bupa / Care Health"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
              />
              {errors.providerName && <p className="text-rose-500 text-[11px] mt-1 font-bold">{errors.providerName}</p>}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Super Senior / Comprehensive Health"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
              />
              {errors.planName && <p className="text-rose-500 text-[11px] mt-1 font-bold">{errors.planName}</p>}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Policy Type
              </label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="Individual">Individual</option>
                <option value="Family Floater">Family Floater</option>
                <option value="Employer">Employer Group</option>
                <option value="Government">Government Scheme (ABDM)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
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
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Policy Number
              </label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="e.g. HLT-9821-4412"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-500"
              />
              {errors.policyNumber && <p className="text-rose-500 text-[11px] mt-1 font-bold">{errors.policyNumber}</p>}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Policy Holder Name
              </label>
              <input
                type="text"
                value={policyHolder}
                onChange={(e) => setPolicyHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
              />
              {errors.policyHolder && <p className="text-rose-500 text-[11px] mt-1 font-bold">{errors.policyHolder}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Coverage Limit (₹)
                </label>
                <input
                  type="number"
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                  Monthly Premium (₹)
                </label>
                <input
                  type="number"
                  value={premiumAmount}
                  onChange={(e) => setPremiumAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
              >
                Review Policy →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Provider:</span>
                <strong className="text-slate-900 dark:text-white">{providerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Plan Name:</span>
                <strong className="text-teal-700 dark:text-cyan-300">{planName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Policy Number:</span>
                <strong className="text-slate-900 dark:text-white">{policyNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Type:</span>
                <strong className="text-slate-800 dark:text-slate-200">{policyType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Coverage Limit:</span>
                <strong className="text-emerald-700 dark:text-emerald-400">₹{coverageAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Premium:</span>
                <strong className="text-amber-700 dark:text-amber-300">₹{premiumAmount}/mo</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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

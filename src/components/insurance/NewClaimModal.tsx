import React, { useState } from 'react';
import { X, FileText, Upload, Check, Sparkles } from 'lucide-react';
import type { InsuranceClaim } from './insuranceData';

interface NewClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClaim: (newClaim: InsuranceClaim) => void;
}

export const NewClaimModal: React.FC<NewClaimModalProps> = ({
  isOpen,
  onClose,
  onAddClaim,
}) => {
  const [step, setStep] = useState(1);
  const [treatmentType, setTreatmentType] = useState<'Hospitalization' | 'Outpatient' | 'Diagnostic Tests' | 'Medicines' | 'Emergency Care'>('Hospitalization');
  const [hospitalName, setHospitalName] = useState('CityCare Multispecialty Hospital');
  const [claimedAmount, setClaimedAmount] = useState<number>(45000);
  const [description, setDescription] = useState('Emergency admission for fever & dehydration treatment');
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['Hospital_Bill_Receipt.pdf', 'Discharge_Summary.pdf']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachedFiles([...attachedFiles, fileName]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(attachedFiles.filter((f) => f !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newClaim: InsuranceClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      claimNumber: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName,
      treatmentType,
      submittedDate: '24 Aug 2026',
      claimedAmount,
      approvedAmount: 0,
      status: 'Pending',
      documentsAttached: attachedFiles,
      timeline: [
        { stage: 'Submitted', date: '24 Aug 2026', completed: true, active: false },
        { stage: 'Under Review', date: '24 Aug 2026', completed: false, active: true },
        { stage: 'Documents Verified', date: 'Pending', completed: false, active: false },
        { stage: 'Approved', date: 'Pending', completed: false, active: false },
        { stage: 'Payment Processed', date: 'Pending', completed: false, active: false }
      ]
    };

    setTimeout(() => {
      setSubmitting(false);
      onAddClaim(newClaim);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Start New Claim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Step {step} of 4 • Submit medical reimbursement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CLAIM TYPE */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-2">
              Select Claim Type
            </label>
            <div className="space-y-2">
              {(['Hospitalization', 'Outpatient', 'Diagnostic Tests', 'Medicines', 'Emergency Care'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTreatmentType(t)}
                  className={`w-full p-3.5 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                    treatmentType === t
                      ? 'bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border-teal-500/40 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
              >
                Continue to Provider →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROVIDER & AMOUNT */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Hospital / Facility Name
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Claimed Amount (₹)
              </label>
              <input
                type="number"
                value={claimedAmount}
                onChange={(e) => setClaimedAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Treatment Summary
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
              >
                Upload Documents →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOAD */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
              Attach Bills & Reports
            </label>

            <label className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-[#00a896]" />
              <span className="font-bold text-slate-900 dark:text-white">Click to Select Invoice / Discharge Summary</span>
              <span className="text-[10px] text-slate-500 font-mono">PDF, PNG, JPG supported (Demo File Picker)</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Attached Documents ({attachedFiles.length})</span>
              {attachedFiles.map((file) => (
                <div key={file} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
                  <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200 text-[11px]">{file}</span>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
              >
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Claim Type:</span>
                <strong className="text-slate-900 dark:text-white">{treatmentType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Hospital:</span>
                <strong className="text-teal-700 dark:text-cyan-300">{hospitalName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Claimed Amount:</span>
                <strong className="text-amber-700 dark:text-amber-300">₹{claimedAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Files Attached:</span>
                <strong className="text-slate-900 dark:text-white">{attachedFiles.length} files</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
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
                    <span>Submitting Claim...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit Claim Now</span>
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

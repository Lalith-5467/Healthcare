import React, { useState } from 'react';
import { X, FileText, Upload, Check, Sparkles, ShieldCheck, Lock, Smartphone, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';
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
  const [hospitalName, setHospitalName] = useState('Apollo Central Health City, Chennai');
  const [claimedAmount, setClaimedAmount] = useState<number>(120000);
  const [description, setDescription] = useState('Emergency admission for fever, dehydration & cardiac telemetry review');
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['Hospital_Bill_Receipt.pdf', 'Discharge_Summary.pdf', 'Doctor_Prescription.pdf']);
  const [submitting, setSubmitting] = useState(false);

  // OTP Authentication States
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(28);

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

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtp(['8', '4', '9', '2', '0', '1']);
    setOtpError(null);
  };

  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP sent to your registered mobile.');
      return;
    }
    setOtpVerified(true);
    setOtpError(null);
    setStep(5); // Proceed to final confirmation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const claimId = `CLM-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newClaim: InsuranceClaim = {
      id: claimId,
      claimNumber: claimId,
      hospitalName,
      treatmentType,
      submittedDate: 'Today',
      claimedAmount,
      approvedAmount: 0,
      status: 'Under Review',
      documentsAttached: attachedFiles,
      timeline: [
        { stage: '1. OTP Verified & Claim Submitted', date: 'Just now', completed: true, active: false },
        { stage: '2. ABDM Medical Vault Transmitted', date: 'Just now', completed: true, active: false },
        { stage: '3. Insurance Desk Review in Progress', date: 'Ongoing', completed: false, active: true },
        { stage: '4. Cashless Final Decision', date: 'Pending Signoff', completed: false, active: false }
      ]
    };

    setTimeout(() => {
      setSubmitting(false);
      onAddClaim(newClaim);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Cashless Claim Pre-Authorization
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Step {step} of 5 • Authenticated Policyholder Verification
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
              Select Claim Category
            </label>
            <div className="space-y-2">
              {(['Hospitalization', 'Emergency Care', 'Diagnostic Tests', 'Medicines & Pharmacy', 'Outpatient Surgery'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTreatmentType(t as any)}
                  className={`w-full p-3.5 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                    treatmentType === (t as any)
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
                Continue to Hospital Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HOSPITAL & AMOUNT */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Hospital / Network Facility Name
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
                Claimed / Estimated Billed Amount (₹)
              </label>
              <input
                type="number"
                value={claimedAmount}
                onChange={(e) => setClaimedAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                Medical Diagnosis / Treatment Summary
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
              Attach Invoices, Prescriptions & Reports
            </label>

            <label className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-[#00a896]" />
              <span className="font-bold text-slate-900 dark:text-white">Click to Select Invoice / Discharge Summary</span>
              <span className="text-[10px] text-slate-500 font-mono">PDF, PNG, JPG (Auto-verified via ABDM Gateway)</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">Attached Documents ({attachedFiles.length})</span>
              {attachedFiles.map((file) => (
                <div key={file} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
                  <span className="truncate max-w-[200px] text-slate-800 dark:text-slate-200 text-[11px] font-bold">{file}</span>
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
                Proceed to OTP Verification →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: POLICYHOLDER OTP AUTHENTICATION */}
        {step === 4 && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-cyan-950/30 border border-teal-200 dark:border-teal-900/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Policyholder Security Verification
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                A 6-digit cryptographic OTP has been sent to your registered mobile number <strong className="font-mono text-slate-900 dark:text-white">+91 98765 43210</strong> (ABHA: 91-8472-9104-5821@abdm).
              </p>
            </div>

            {/* OTP 6 BOXES */}
            <div>
              <label className="block text-center font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-center font-black text-lg text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-all"
                  />
                ))}
              </div>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold text-center">
                {otpError}
              </div>
            )}

            {/* HELPER CONTROLS */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="text-teal-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" /> 1-Click Auto-Fill (849201)
              </button>

              <span className="text-slate-400 font-medium">
                Resend OTP in 00:{resendTimer}s
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                ← Back
              </button>
              <button
                onClick={handleVerifyOtp}
                className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-white bg-teal-600 hover:bg-teal-500 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Verify OTP & Authorize →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL CONFIRMATION & SUBMIT */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity Verified via Policyholder OTP Authentication Token.</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Patient / Holder:</span>
                <strong className="text-slate-900 dark:text-white">Ragul Kumar (INS-MC-2026-10245)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Hospital / Facility:</span>
                <strong className="text-teal-700 dark:text-cyan-300">{hospitalName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Claim Category:</span>
                <strong className="text-slate-900 dark:text-white">{treatmentType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Claimed Amount:</span>
                <strong className="text-amber-700 dark:text-amber-300">₹{claimedAmount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Documents Linked:</span>
                <strong className="text-slate-900 dark:text-white">{attachedFiles.length} files attached</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {submitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Insurance Desk...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Dispatch Claim to Insurance Portal</span>
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

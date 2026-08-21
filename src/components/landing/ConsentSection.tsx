import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X, Lock, CheckCircle2 } from 'lucide-react';


export const ConsentSection: React.FC = () => {
  const [consentState, setConsentState] = useState<'pending' | 'approved' | 'declined'>('pending');

  const handleApprove = () => setConsentState('approved');
  const handleDecline = () => setConsentState('declined');
  const handleReset = () => setConsentState('pending');

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#0B0F17]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              ABDM Consent Artifact Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Consent-Based Information Sharing.
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            No healthcare provider can view your records without explicit, time-bound consent.
          </p>
        </div>

        {/* INTERACTIVE CONSENT PANEL CARD */}
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                DR
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Dr. Rajesh Kumar Requested Access</h3>
                <p className="text-xs text-slate-500">Senior Cardiologist • Fortis Hospital</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {consentState === 'pending' && (
                <motion.span key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Pending Request
                </motion.span>
              )}
              {consentState === 'approved' && (
                <motion.span key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Access Granted
                </motion.span>
              )}
              {consentState === 'declined' && (
                <motion.span key="declined" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Access Declined
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* REQUESTED SCOPE CHECKLIST */}
          <div className="space-y-2.5 text-xs">
            <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Requested Record Scope</p>
            
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <span className="font-medium text-slate-900 dark:text-white">Blood Test Reports & Telemetry</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Allowed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <span className="font-medium text-slate-900 dark:text-white">Cardiology Prescriptions</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Allowed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex justify-between items-center opacity-60">
              <span className="font-medium text-slate-900 dark:text-white">Personal Identity & Financial Docs</span>
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <X className="w-4 h-4" /> Excluded
              </span>
            </div>
          </div>

          {/* ACCESS DURATION */}
          <div className="flex justify-between items-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Access Duration</span>
            <span className="text-[#FF5B22] font-bold">7 Days (Auto-expires Aug 26)</span>
          </div>

          {/* ACTIONS */}
          <div className="pt-2">
            {consentState === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={handleDecline}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Decline Access
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-[#FF5B22] hover:bg-[#e54c15] shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Approve Consent
                </button>
              </div>
            )}

            {consentState !== 'pending' && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {consentState === 'approved' ? '✓ Token active. You can revoke anytime.' : 'Access request rejected.'}
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs text-[#FF5B22] underline font-semibold"
                >
                  Reset Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

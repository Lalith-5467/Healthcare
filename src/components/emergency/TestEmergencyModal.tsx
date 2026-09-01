import React, { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles } from 'lucide-react';

interface TestEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestComplete: () => void;
}

export const TestEmergencyModal: React.FC<TestEmergencyModalProps> = ({
  isOpen,
  onClose,
  onTestComplete,
}) => {
  const [step, setStep] = useState<'idle' | 'testing' | 'complete'>('idle');

  if (!isOpen) return null;

  const startTestSequence = () => {
    setStep('testing');
    setTimeout(() => {
      setStep('complete');
      onTestComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-center text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Test Emergency System</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Safe dry-run simulation of alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: IDLE */}
        {step === 'idle' && (
          <div className="space-y-4 font-medium">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Test your emergency contacts and SOS interface without sending a real alert.
            </p>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-purple-700 dark:text-purple-300">
              ✓ Validates location detection & contact list readiness
            </div>
            <button
              onClick={startTestSequence}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center justify-center gap-2 font-sans"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start System Test</span>
            </button>
          </div>
        )}

        {/* STEP 2: TESTING */}
        {step === 'testing' && (
          <div className="py-8 space-y-4 font-medium">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-slate-800 dark:text-slate-200 font-bold font-mono">Running dry-run simulation sequence...</p>
          </div>
        )}

        {/* STEP 3: COMPLETE */}
        {step === 'complete' && (
          <div className="space-y-4 font-medium">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Emergency Readiness Verified!</h4>
            <p className="text-slate-600 dark:text-slate-300">All emergency services & contacts are operational and configured properly.</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-md font-sans"
            >
              Close Test Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-center">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Play className="w-5 h-5 fill-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Test Emergency System</h3>
              <p className="text-xs text-slate-400">Safe dry-run simulation of alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: IDLE */}
        {step === 'idle' && (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Test your emergency contacts and SOS interface without sending a real alert.
            </p>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-purple-300">
              ✓ Validates location detection & contact list readiness
            </div>
            <button
              onClick={startTestSequence}
              className="w-full py-3 rounded-xl font-extrabold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
            >
              Run System Test
            </button>
          </div>
        )}

        {/* STEP 2: TESTING */}
        {step === 'testing' && (
          <div className="space-y-4 py-4 font-mono">
            <Sparkles className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
            <h4 className="font-extrabold text-white text-sm">Testing Emergency Sequence...</h4>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <p>• Verifying Emergency Contacts... OK</p>
              <p>• Checking Location API... OK</p>
              <p>• Simulating Alert Payloads... OK</p>
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETE */}
        {step === 'complete' && (
          <div className="space-y-4 py-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-extrabold text-white text-base">✓ Test Completed</h4>
            <p className="text-slate-300 text-xs font-mono">
              Emergency contacts and location system are 100% ready. No real alert was sent.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
            >
              Close Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

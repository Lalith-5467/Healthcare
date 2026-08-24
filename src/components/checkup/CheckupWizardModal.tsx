import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Save, Sparkles, ShieldCheck, Stethoscope } from 'lucide-react';
import type { CheckupAnswers, CheckupHistoryItem } from './checkupData';
import { DEFAULT_CHECKUP_ANSWERS } from './checkupData';

interface CheckupWizardModalProps {
  isOpen: boolean;
  isQuickMode?: boolean;
  initialStep?: number;
  onClose: () => void;
  onSaveDraft: (step: number, answers: CheckupAnswers) => void;
  onSubmitCompleted: (newRecord: CheckupHistoryItem) => void;
  onNavigateToMedicines?: () => void;
}

export const CheckupWizardModal: React.FC<CheckupWizardModalProps> = ({
  isOpen,
  isQuickMode = false,
  initialStep = 1,
  onClose,
  onSaveDraft,
  onSubmitCompleted,
  onNavigateToMedicines,
}) => {
  const totalSteps = isQuickMode ? 5 : 12;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [answers, setAnswers] = useState<CheckupAnswers>(DEFAULT_CHECKUP_ANSWERS);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = () => {
    onSaveDraft(currentStep, answers);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newRecord: CheckupHistoryItem = {
      id: `CHK-${Date.now().toString().slice(-4)}`,
      date: 'Today · 24 Aug 2026',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isQuickMode ? 'Quick Check-Up' : 'General Wellness Check-Up',
      status: 'Completed',
      completionScore: 92,
      answers
    };

    setTimeout(() => {
      setSubmitting(false);
      onSubmitCompleted(newRecord);
    }, 1200);
  };

  const toggleSymptom = (sym: string) => {
    if (sym === 'None') {
      setAnswers({ ...answers, symptoms: ['None'] });
      return;
    }

    const current = answers.symptoms.filter((s) => s !== 'None');
    if (current.includes(sym)) {
      const updated = current.filter((s) => s !== sym);
      setAnswers({ ...answers, symptoms: updated.length ? updated : ['None'] });
    } else {
      setAnswers({ ...answers, symptoms: [...current, sym] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-y-auto text-slate-900 dark:text-white">
        {/* WIZARD HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-teal-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
                  {isQuickMode ? 'Quick Check-Up' : 'Full Assessment Wizard'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Step {currentStep} of {totalSteps}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-1 font-mono">
            <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
              <span>Wizard Progress</span>
              <span className="text-[#00a896] dark:text-cyan-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="bg-[#00a896] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP QUESTION CONTENT BODY */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 py-2 overflow-y-auto">
          {/* STEP 1: OVERALL WELLNESS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">How are you feeling overall today?</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Rate your general state of health and comfort</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Great', 'Good', 'Okay', 'Poor'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, wellness: opt })}
                    className={`p-4 rounded-2xl border text-center font-extrabold transition-all cursor-pointer ${
                      answers.wellness === opt
                        ? 'bg-[#00a896] text-white border-teal-400 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ENERGY & FATIGUE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">What is your energy level right now?</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Select your current energy metric</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['High Energy', 'Moderate', 'Tired / Low'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, energy: opt })}
                    className={`p-4 rounded-2xl border text-center font-extrabold transition-all cursor-pointer ${
                      answers.energy === opt
                        ? 'bg-[#00a896] text-white border-cyan-400 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SLEEP QUALITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">How well did you sleep last night?</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Select your rest duration & quality</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Restful (7-9 hrs)', 'Interrupted Sleep', 'Less than 6 hrs', 'Insomnia / Poor'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, sleep: opt })}
                    className={`p-4 rounded-2xl border text-left font-extrabold transition-all cursor-pointer ${
                      answers.sleep === opt
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: HYDRATION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">How much water have you had today?</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Hydration check</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['8+ Glasses (Optimal)', '4–7 Glasses', '1–3 Glasses (Low)'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, hydration: opt })}
                    className={`p-4 rounded-2xl border text-center font-extrabold transition-all cursor-pointer ${
                      answers.hydration === opt
                        ? 'bg-[#00a896] text-white border-blue-400 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SYMPTOMS SELECTION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Are you experiencing any physical discomfort?</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Select all symptoms that apply or choose "None"</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['None', 'Headache', 'Fever', 'Cough / Cold', 'Body Ache', 'Chest Tightness', 'Shortness of Breath', 'Nausea / Stomach Upset', 'Skin Rash'].map((sym) => {
                  const selected = answers.symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#00a896] text-white border-teal-300 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{sym}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ADDITIONAL STEPS IF NOT QUICK MODE */}
          {!isQuickMode && currentStep > 5 && currentStep <= 12 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Step {currentStep}: Health Assessment Question
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Information recorded in this step will be added to your personal wellness log.
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#00a896] mx-auto" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Question parameter for Step {currentStep} registered.
                </p>
              </div>
            </div>
          )}

          {/* FOOTER WIZARD CONTROLS */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 font-sans">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveAndExit}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                <Save className="w-3.5 h-3.5 text-[#00a896]" />
                <span>Save Draft</span>
              </button>
            </div>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <span>{submitting ? 'Submitting...' : 'Complete & Save'}</span>
              </button>
            )}
          </div>
        </form>

        {/* SAFETY NOTICE FOOTER */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#00a896] shrink-0" />
          <span>Self-reported wellness entry for personal tracking.</span>
        </div>
      </div>
    </div>
  );
};

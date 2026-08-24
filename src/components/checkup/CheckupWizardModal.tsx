import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Save, Check, Sparkles, AlertCircle, ExternalLink, Activity, Heart, Pill, FileText, Smile, Stethoscope } from 'lucide-react';
import type { CheckupAnswers, CheckupHistoryItem } from './checkupData';
import { DEFAULT_CHECKUP_ANSWERS } from './checkupData';

interface CheckupWizardModalProps {
  isOpen: boolean;
  isQuickMode?: boolean;
  initialStep?: number;
  onClose: () => void;
  onSaveDraft: (step: number, answers: CheckupAnswers) => void;
  onSubmitCompleted: (newRecord: CheckupHistoryItem) => void;
  onNavigateToMedicines: () => void;
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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* WIZARD HEADER */}
        <div className="border-b border-slate-800 pb-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00a896]/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {isQuickMode ? 'Quick Check-Up' : 'Full Assessment Wizard'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Step {currentStep} of {totalSteps}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Exit</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-[#00a896] to-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STEP QUESTION CONTENT */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4 text-xs">
          {/* STEP 1: GENERAL WELLNESS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How are you feeling today?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Very Good', 'Good', 'Okay', 'Not Great', 'Poor'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, wellness: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.wellness === opt
                        ? 'bg-teal-500/20 text-white border-teal-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ENERGY */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How would you describe your energy today?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Very High', 'Good', 'Moderate', 'Low', 'Very Low'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, energy: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.energy === opt
                        ? 'bg-cyan-500/20 text-white border-cyan-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SLEEP */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How many hours did you sleep last night?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {['Less than 5 hours', '5–6 hours', '6–7 hours', '7–8 hours', 'More than 8 hours'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, sleep: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.sleep === opt
                        ? 'bg-purple-500/20 text-white border-purple-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PHYSICAL ACTIVITY */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How active have you been recently?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Very Active', 'Active', 'Moderately Active', 'Light Activity', 'Mostly Inactive'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, activity: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.activity === opt
                        ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: HYDRATION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How would you describe your daily water intake?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Less than 1L', '1–1.5L', '1.5–2L', '2–2.5L', 'More than 2.5L'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, hydration: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.hydration === opt
                        ? 'bg-blue-500/20 text-white border-blue-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: MOOD */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How would you describe your mood today?</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {['Great 😊', 'Good 🙂', 'Okay 😐', 'Low 😕'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, mood: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.mood === opt
                        ? 'bg-emerald-500/20 text-white border-emerald-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: STRESS */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">How would you describe your current stress level?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, stress: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.stress === opt
                        ? 'bg-rose-500/20 text-white border-rose-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: SYMPTOM CHECK-IN */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-white">Are you currently experiencing any symptoms?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Select all that apply for your personal health log</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['None', 'Headache', 'Fatigue', 'Cough', 'Fever', 'Body Pain', 'Stomach Discomfort', 'Other'].map((sym) => {
                  const selected = answers.symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#00a896] text-white border-teal-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>

              {answers.symptoms.includes('Other') && (
                <div className="pt-2">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">Briefly describe symptoms</label>
                  <input
                    type="text"
                    value={answers.otherSymptomsText || ''}
                    onChange={(e) => setAnswers({ ...answers, otherSymptomsText: e.target.value })}
                    placeholder="e.g. Slight throat irritation"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                <span>ℹ If you feel seriously unwell or experience emergency symptoms, please seek immediate medical care.</span>
              </div>
            </div>
          )}

          {/* STEP 9: OPTIONAL VITALS */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-white">Record Optional Vitals</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Enter self-measured values (optional demo values)</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Heart Rate</label>
                  <input
                    type="text"
                    value={answers.vitals.heartRate}
                    onChange={(e) => setAnswers({ ...answers, vitals: { ...answers.vitals, heartRate: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={answers.vitals.bloodPressure}
                    onChange={(e) => setAnswers({ ...answers, vitals: { ...answers.vitals, bloodPressure: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Temperature</label>
                  <input
                    type="text"
                    value={answers.vitals.temperature}
                    onChange={(e) => setAnswers({ ...answers, vitals: { ...answers.vitals, temperature: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Weight</label>
                  <input
                    type="text"
                    value={answers.vitals.weight}
                    onChange={(e) => setAnswers({ ...answers, vitals: { ...answers.vitals, weight: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">SpO₂</label>
                  <input
                    type="text"
                    value={answers.vitals.spO2}
                    onChange={(e) => setAnswers({ ...answers, vitals: { ...answers.vitals, spO2: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: MEDICATION CHECK */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-white">Have you been able to follow your medication schedule?</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Review your prescription tracking adherence</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {['Yes', 'Mostly', 'Sometimes', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers({ ...answers, medicationAdherence: opt })}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                      answers.medicationAdherence === opt
                        ? 'bg-purple-500/20 text-white border-purple-500/50 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToMedicines();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Medicines Tracker</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 11: HEALTH HISTORY */}
          {currentStep === 11 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white">Recent Health Care Activity</h4>
              <div className="space-y-2.5">
                {[
                  { key: 'doctorVisit' as const, label: 'Recent Doctor Consultation' },
                  { key: 'labTest' as const, label: 'Recent Diagnostic / Lab Test' },
                  { key: 'hospitalVisit' as const, label: 'Recent Urgent Care or Hospital Visit' },
                  { key: 'vaccination' as const, label: 'Recent Immunization or Vaccine' }
                ].map((item) => {
                  const val = answers.healthHistory[item.key];
                  return (
                    <div key={item.key} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-white">{item.label}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAnswers({ ...answers, healthHistory: { ...answers.healthHistory, [item.key]: true } })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            val ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswers({ ...answers, healthHistory: { ...answers.healthHistory, [item.key]: false } })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            !val ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 12: COMPLETE REVIEW & SUBMIT */}
          {currentStep === 12 && (
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-white border-b border-slate-800 pb-2">Review Your Check-Up Answers</h4>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>General Wellness:</span> <strong className="text-teal-400">{answers.wellness}</strong></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>Energy Level:</span> <strong className="text-cyan-400">{answers.energy}</strong></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>Sleep:</span> <strong className="text-purple-400">{answers.sleep}</strong></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>Activity:</span> <strong className="text-amber-400">{answers.activity}</strong></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>Mood:</span> <strong className="text-emerald-400">{answers.mood}</strong></div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800"><span>Symptoms:</span> <strong className="text-rose-300">{answers.symptoms.join(', ')}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* WIZARD FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Submitting Summary...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Check-Up</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

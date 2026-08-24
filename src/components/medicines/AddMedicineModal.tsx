import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Clock, Calendar, User, Building2, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles, Upload } from 'lucide-react';
import type { MedicineItem } from './medicinesData';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMedicine: (newMed: Partial<MedicineItem>) => void;
  onNavigateScan: () => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSaveMedicine,
  onNavigateScan,
}) => {
  // STEPS 1-5
  const [step, setStep] = useState<number>(1);

  // STEP 1: INFO
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('500');
  const [unit, setUnit] = useState<MedicineItem['unit']>('mg');
  const [frequency, setFrequency] = useState<MedicineItem['frequency']>('Twice daily');
  const [route, setRoute] = useState<MedicineItem['route']>('Oral');

  // STEP 2: SCHEDULE
  const [startDate, setStartDate] = useState('2026-08-23');
  const [endDate, setEndDate] = useState('2026-09-23');
  const [doseTimes, setDoseTimes] = useState<string[]>(['08:00 AM', '12:30 PM']);

  // STEP 3: PRESCRIBER
  const [doctor, setDoctor] = useState('Dr. Rajesh Kumar');
  const [hospital, setHospital] = useState('Apollo Hospital');
  const [prescriptionNo, setPrescriptionNo] = useState('RX-2026-9481');

  // STEP 4: INSTRUCTIONS
  const [instructions, setInstructions] = useState('Take after meal with warm water.');
  const [foodInstruction, setFoodInstruction] = useState<MedicineItem['foodInstruction']>('After Food');

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddTimeSlot = () => {
    setDoseTimes((prev) => [...prev, '06:00 PM']);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setDoseTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name) return;
    setSaving(true);

    const formattedStart = new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedEnd = new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newMed: Partial<MedicineItem> = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      name,
      dosage,
      unit,
      frequency,
      route,
      times: doseTimes,
      startDate: formattedStart,
      endDate: formattedEnd,
      prescribedBy: doctor || 'General Practitioner',
      hospital: hospital || 'General Healthcare',
      purpose: `${name} therapy as prescribed`,
      instructions: instructions || 'Take as instructed by doctor.',
      foodInstruction: foodInstruction,
      status: 'Active',
      stockRemaining: 30,
      totalStock: 30,
      reminderEnabled: true
    };

    setTimeout(() => {
      onSaveMedicine(newMed);
      setSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Step {step} of 5</span>
              <h3 className="text-lg font-extrabold text-white">
                {step === 1 && 'Medicine Information'}
                {step === 2 && 'Dose Schedule & Times'}
                {step === 3 && 'Prescriber & Hospital'}
                {step === 4 && 'Instructions & Guidelines'}
                {step === 5 && 'Review & Confirm'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: MEDICINE INFO */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Medicine Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Metformin, Atorvastatin, Paracetamol"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Dosage Amount
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                >
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="tablet">tablet</option>
                  <option value="capsule">capsule</option>
                  <option value="drop">drop</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Route
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                >
                  <option value="Oral">Oral (Swallow)</option>
                  <option value="Topical">Topical (Skin)</option>
                  <option value="Injection">Injection</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                disabled={!name}
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Scheduled Dose Times
                </label>
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Time</span>
                </button>
              </div>

              <div className="space-y-2">
                {doseTimes.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDoseTimes((prev) => prev.map((item, i) => (i === idx ? val : item)));
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold focus:outline-none focus:border-[#00a896]"
                    />
                    {doseTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(idx)}
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Doctor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRESCRIBER */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Prescribing Doctor Name
              </label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Hospital / Clinic
              </label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="e.g. Apollo Hospital"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Prescription Number (Optional)
              </label>
              <input
                type="text"
                value={prescriptionNo}
                onChange={(e) => setPrescriptionNo(e.target.value)}
                placeholder="e.g. RX-2026-9481"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateScan();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700/60 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Scan or Upload Prescription File</span>
            </button>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Guidelines</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INSTRUCTIONS */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Food & Intake Instructions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Before Food', 'After Food', 'With Food', 'Anytime'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFoodInstruction(opt)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      foodInstruction === opt
                        ? 'bg-[#00a896] text-white border-teal-400 shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Special Prescription Notes
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take after meal with warm water. Avoid dairy products..."
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Medicine:</span>
                <span className="font-extrabold text-white text-sm">{name}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Dosage & Unit:</span>
                <span className="font-bold text-teal-400">{dosage} {unit} ({route})</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Frequency:</span>
                <span className="font-bold text-white">{frequency}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Scheduled Times:</span>
                <span className="font-mono font-bold text-cyan-300">{doseTimes.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Prescribing Doctor:</span>
                <span className="font-semibold text-slate-200">{doctor} ({hospital})</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {saving ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Saving Medicine...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Medicine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

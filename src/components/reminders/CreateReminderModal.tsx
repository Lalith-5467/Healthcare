import React, { useState } from 'react';
import { X, Bell, Pill, Calendar, Package, Video, Check, ArrowRight, ArrowLeft, Sparkles, Clock, AlertCircle } from 'lucide-react';
import type { ReminderItem } from './remindersData';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (newReminder: Partial<ReminderItem>) => void;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  onSaveReminder,
}) => {
  // STEPS 1-5
  const [step, setStep] = useState<number>(1);

  // STEP 1: CATEGORY
  const [category, setCategory] = useState<ReminderItem['category']>('Medication');

  // STEP 2: DETAILS
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-08-24');
  const [time, setTime] = useState('12:30 PM');

  // STEP 3: REPEAT
  const [repeat, setRepeat] = useState<ReminderItem['repeat']>('Daily');

  // STEP 4: TIMING & PRIORITY
  const [timing, setTiming] = useState<ReminderItem['timing']>('15 minutes before');
  const [priority, setPriority] = useState<ReminderItem['priority']>('Normal');

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return;
    setSaving(true);

    const formattedDate = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRem: Partial<ReminderItem> = {
      id: `REM-${Date.now().toString().slice(-4)}`,
      title,
      category,
      description: description || `${category} reminder`,
      date: formattedDate,
      time,
      repeat,
      timing,
      status: 'Upcoming',
      priority,
      relatedModule: category === 'Medication' ? 'medicines' : category === 'Appointment' ? 'appointments' : category === 'Pharmacy' ? 'pharmacy' : category === 'Consultation' ? 'consultation' : undefined
    };

    setTimeout(() => {
      onSaveReminder(newRem);
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
                {step === 1 && 'Select Reminder Type'}
                {step === 2 && 'Reminder Details'}
                {step === 3 && 'Repeat Schedule'}
                {step === 4 && 'Notification Timing & Priority'}
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

        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">Choose the category for this reminder:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { cat: 'Medication', icon: Pill, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                { cat: 'Appointment', icon: Calendar, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
                { cat: 'Pharmacy', icon: Package, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                { cat: 'Consultation', icon: Video, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                { cat: 'General', icon: Bell, color: 'text-slate-300 bg-slate-800 border-slate-700' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.cat;
                return (
                  <button
                    key={item.cat}
                    type="button"
                    onClick={() => setCategory(item.cat as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#00a896]/20 border-teal-400 text-white shadow'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{item.cat}</h4>
                      <span className="text-[10px] text-slate-400">Reminder</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Reminder Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Take Metformin 500mg, Cardiology Appointment"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Description / Notes
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Take after meal with warm water"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 12:30 PM"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold focus:outline-none focus:border-[#00a896]"
                />
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
                disabled={!title}
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Repeat Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REPEAT */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">Choose repeat frequency for this reminder:</p>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Does not repeat', 'Daily', 'Weekly', 'Monthly', 'Custom'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRepeat(r)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    repeat === r
                      ? 'bg-[#00a896] text-white border-teal-400 shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

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
                <span>Notification Timing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TIMING & PRIORITY */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Notification Advance Alert
              </label>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#00a896]"
              >
                <option value="At scheduled time">At scheduled time</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="15 minutes before">15 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="1 day before">1 day before</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal', 'Important', 'High Priority'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      priority === p
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
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
                <span className="text-slate-400">Reminder Title:</span>
                <span className="font-extrabold text-white text-sm">{title}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-teal-400">{category}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-mono font-bold text-cyan-300">{date} at {time}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Repeat:</span>
                <span className="font-semibold text-white">{repeat}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                <span className="text-slate-400">Alert Timing:</span>
                <span className="font-semibold text-amber-300">{timing}</span>
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
                    <span>Creating Reminder...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Create Reminder</span>
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

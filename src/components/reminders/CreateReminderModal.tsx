import React, { useState, useEffect } from 'react';
import { X, Bell, Pill, Calendar, Package, Video, Check, ArrowRight, ArrowLeft, Sparkles, Clock, AlertCircle } from 'lucide-react';
import type { ReminderItem } from './remindersData';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReminder: (newReminder: Partial<ReminderItem>) => void;
  initialData?: ReminderItem | null;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  onSaveReminder,
  initialData,
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

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategory(initialData.category);
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        try {
          const d = new Date(initialData.date);
          if (!isNaN(d.getTime())) setDate(d.toISOString().split('T')[0]);
        } catch { /* ignore */ }
        setTime(initialData.time);
        setRepeat(initialData.repeat || 'Does not repeat');
        setTiming(initialData.timing || 'At scheduled time');
        setPriority(initialData.priority || 'Normal');
        setStep(2); // Jump to step 2 when editing
      } else {
        setCategory('Medication');
        setTitle('');
        setDescription('');
        setDate('2026-08-24');
        setTime('12:30 PM');
        setRepeat('Daily');
        setTiming('15 minutes before');
        setPriority('Normal');
        setStep(1);
      }
      setSaving(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return;
    setSaving(true);

    const formattedDate = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRem: Partial<ReminderItem> = {
      id: initialData ? initialData.id : `REM-${Date.now().toString().slice(-4)}`,
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Step {step} of 5</span>
              <h3 className="text-lg font-extrabold text-slate-900">
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Choose the category for this reminder:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { cat: 'Medication', icon: Pill, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { cat: 'Appointment', icon: Calendar, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
                { cat: 'Pharmacy', icon: Package, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { cat: 'Consultation', icon: Video, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { cat: 'General', icon: Bell, color: 'text-slate-600 bg-slate-100 border-slate-200' }
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
                        ? 'bg-teal-50 border-teal-300 text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{item.cat}</h4>
                      <span className="text-[10px] text-slate-500">Reminder</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 flex items-center gap-2 cursor-pointer"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Reminder Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Take Metformin 500mg, Cardiology Appointment"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description / Notes
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Take after meal with warm water"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Time
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={time.split(' ')[0] || ''}
                    onChange={(e) => {
                      const baseTime = e.target.value;
                      const ampm = time.includes('PM') ? 'PM' : 'AM';
                      setTime(`${baseTime} ${ampm}`);
                    }}
                    placeholder="12:30"
                    className="w-full pl-4 pr-14 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-[#00a896]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const baseTime = time.split(' ')[0] || '12:00';
                      const currentAmpm = time.includes('PM') ? 'PM' : 'AM';
                      const newAmpm = currentAmpm === 'AM' ? 'PM' : 'AM';
                      setTime(`${baseTime} ${newAmpm}`);
                    }}
                    className="absolute right-2 px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-[11px] font-bold cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    {time.includes('PM') ? 'PM' : 'AM'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!title}
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0"
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
            <p className="text-xs text-slate-500">Choose repeat frequency for this reminder:</p>
            <div className="grid grid-cols-2 gap-2.5">
              {(['Does not repeat', 'Daily', 'Weekly', 'Monthly', 'Custom'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRepeat(r)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    repeat === r
                      ? 'bg-[#00a896] text-white border-teal-400 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 flex items-center gap-2 cursor-pointer"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Notification Advance Alert
              </label>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#00a896]"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 flex items-center gap-2 cursor-pointer"
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
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reminder Title:</span>
                <span className="font-extrabold text-slate-900 text-sm">{title}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-teal-600">{category}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-mono font-bold text-cyan-700">{date} at {time}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-slate-500">Repeat:</span>
                <span className="font-semibold text-slate-900">{repeat}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-slate-500">Alert Timing:</span>
                <span className="font-semibold text-amber-600">{timing}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:hover:translate-y-0"
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

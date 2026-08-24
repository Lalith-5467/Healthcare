import React, { useState } from 'react';
import { X, Target, Check, Sparkles } from 'lucide-react';
import type { HealthGoal } from './analyticsData';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (newGoal: Partial<HealthGoal>) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthGoal['category']>('Steps');
  const [target, setTarget] = useState<number>(8000);
  const [unit, setUnit] = useState('steps');
  const [startDate, setStartDate] = useState('2026-08-24');
  const [endDate, setEndDate] = useState('2026-09-24');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    setSaving(true);

    const newG: Partial<HealthGoal> = {
      id: `GOAL-${Date.now().toString().slice(-4)}`,
      title,
      category,
      target: Number(target),
      current: 0,
      unit,
      startDate: new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      progress: 0,
      isPaused: false
    };

    setTimeout(() => {
      onSaveGoal(newG);
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Create Personal Health Goal</h3>
              <p className="text-xs text-slate-400">Set user-defined targets for your routine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">
              Goal Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Daily Walking Target, Nightly Sleep"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as HealthGoal['category'];
                  setCategory(cat);
                  if (cat === 'Steps') setUnit('steps');
                  else if (cat === 'Sleep') setUnit('hours');
                  else if (cat === 'Water') setUnit('Liters');
                  else if (cat === 'Activity') setUnit('minutes');
                }}
                className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#00a896]"
              >
                <option value="Steps">Steps</option>
                <option value="Sleep">Sleep</option>
                <option value="Water">Water</option>
                <option value="Activity">Activity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Target Value</label>
              <input
                type="number"
                required
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-[#00a896]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#00a896]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title}
              className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving Goal...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Goal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

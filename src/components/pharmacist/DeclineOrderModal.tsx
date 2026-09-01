import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ExtendedPharmacyOrder } from '../../utils/healthWorkflowStorage';

interface DeclineOrderModalProps {
  isOpen: boolean;
  order: ExtendedPharmacyOrder | null;
  onClose: () => void;
  onConfirmDecline: (orderId: string, reason: string, notes: string) => void;
}

const DECLINE_REASONS = [
  'Medicine unavailable / Out of stock',
  'Prescription unclear / Legibility issue',
  'Dosage clarification required with physician',
  'Invalid or Expired prescription',
  'Alternative formulation required',
  'Other clinical reason'
];

export const DeclineOrderModal: React.FC<DeclineOrderModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmDecline
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(DECLINE_REASONS[0]);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onConfirmDecline(order.id, selectedReason, notes);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Decline Prescription Order
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Order #{order.id} • Patient: {order.patientName || 'Ragul Kumar'}
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* REASON SELECTION */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider mb-2 text-[10px]">
              Primary Decline Reason
            </label>
            <div className="space-y-1.5">
              {DECLINE_REASONS.map((r) => (
                <label
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    selectedReason === r
                      ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="w-3.5 h-3.5 accent-rose-600 cursor-pointer"
                  />
                  <span className="text-xs">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ADDITIONAL NOTES */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider mb-1 text-[10px]">
              Pharmacist Notes / Feedback for Patient (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please consult Dr. Arun Kumar for alternative antibiotics or visit the physical dispensary."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 resize-none text-xs placeholder:text-slate-500 dark:text-slate-400"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-70"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{submitting ? 'Declining...' : 'Confirm Decline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

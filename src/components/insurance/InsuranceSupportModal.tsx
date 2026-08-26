import React, { useState } from 'react';
import { X, HelpCircle, Check, Sparkles } from 'lucide-react';

interface InsuranceSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSupport: (topic: string, msg: string) => void;
}

export const InsuranceSupportModal: React.FC<InsuranceSupportModalProps> = ({
  isOpen,
  onClose,
  onSubmitSupport,
}) => {
  const [topic, setTopic] = useState('Policy Coverage Help');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      onSubmitSupport(topic, message);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Insurance Support Desk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Submit a policy or claim assistance ticket</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
              Support Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="Policy Coverage Help">Policy Coverage Help</option>
              <option value="Claim Submission Inquiry">Claim Submission Inquiry</option>
              <option value="Document Upload Verification">Document Upload Verification</option>
              <option value="Policy Renewal & Premium">Policy Renewal & Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
              Describe your Query
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about your query..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500 resize-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Support Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HelpCircle, FileText, MessageSquare, Check, X, Sparkles } from 'lucide-react';

interface AboutSupportSectionProps {
  onResetPreferences: () => void;
  onShowToast: (msg: string) => void;
}

export const AboutSupportSection: React.FC<AboutSupportSectionProps> = ({
  onResetPreferences,
  onShowToast,
}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const [reportCategory, setReportCategory] = useState('UI Bug');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    setReportSubmitting(true);
    setTimeout(() => {
      setReportSubmitting(false);
      setReportModalOpen(false);
      setReportDesc('');
      onShowToast('✓ Demo problem report submitted');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">About & Help Center</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Application version, terms of service, report problem, and danger zone</p>
        </div>
      </div>

      {/* ABOUT METADATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Application Name</span>
          <strong className="text-slate-900 dark:text-white text-base font-extrabold font-sans">MediCare PHR</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Version</span>
          <strong className="text-purple-700 dark:text-purple-300 text-base font-extrabold font-sans">1.0.0</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Build Architecture</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-base font-extrabold font-sans">Frontend Prototype</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Last Updated</span>
          <strong className="text-teal-700 dark:text-teal-300 text-base font-extrabold font-sans">24 Aug 2026</strong>
        </div>
      </div>

      {/* HELP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setTermsModalOpen(true)}
          className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left space-y-2 cursor-pointer shadow-sm"
        >
          <FileText className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Terms & Privacy Policy</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">View patient data privacy guidelines →</p>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left space-y-2 cursor-pointer shadow-sm"
        >
          <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Report a Problem</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Submit a bug or feature feedback →</p>
        </button>

        <button
          onClick={() => onShowToast('✓ Opening Help Center Documentation')}
          className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-left space-y-2 cursor-pointer shadow-sm"
        >
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Help & FAQs</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Read setup guides & answers →</p>
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="p-4 bg-rose-500/5 dark:bg-slate-950 rounded-2xl border border-rose-300 dark:border-rose-500/30 space-y-3">
        <h4 className="font-extrabold text-rose-700 dark:text-rose-400 text-xs uppercase tracking-wider font-mono">Danger Zone</h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs">Reset All Application Preferences</h5>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Restore theme, notifications, privacy, and health settings to default</p>
          </div>
          <button
            onClick={() => setResetModalOpen(true)}
            className="px-4 py-2 rounded-xl font-bold text-xs text-rose-700 dark:text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 cursor-pointer shadow-xs"
          >
            Reset Preferences
          </button>
        </div>
      </div>

      {/* REPORT PROBLEM MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Report a Problem</h3>
              <button onClick={() => setReportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-3 font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none"
                >
                  <option value="UI Bug">UI Layout Issue</option>
                  <option value="Feature Request">Feature Feedback</option>
                  <option value="Performance">Performance Lag</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Describe Problem</label>
                <textarea
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Provide details about the issue..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 font-extrabold">
                <button type="button" onClick={() => setReportModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-300 dark:border-slate-700">Cancel</button>
                <button type="submit" disabled={reportSubmitting} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer flex items-center gap-1.5 shadow-md">
                  {reportSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Submit Demo Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TERMS MODAL */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Terms & Privacy Guidelines</h3>
              <button onClick={() => setTermsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              <p>• All health records & emergency profiles are stored 100% locally in browser memory.</p>
              <p className="mt-2">• No patient data is uploaded to external telemetry or third-party servers.</p>
            </div>
            <button onClick={() => setTermsModalOpen(false)} className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-300 dark:border-slate-700">Close</button>
          </div>
        </div>
      )}

      {/* RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Reset All Preferences?</h3>
              <button onClick={() => setResetModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This will restore all appearance, notification, privacy, and health preference settings to defaults.
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-extrabold">
              <button onClick={() => setResetModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-300 dark:border-slate-700">Cancel</button>
              <button
                onClick={() => {
                  onResetPreferences();
                  setResetModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer text-center shadow-md"
              >
                Reset Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { HelpCircle, FileText, MessageSquare, Check, X, Sparkles, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';

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
  const [faqModalOpen, setFaqModalOpen] = useState(false);

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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl text-xs font-sans">
      
      {/* DYNAMIC BRAND BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#00a896]/10 via-blue-500/5 to-transparent dark:from-[#00a896]/20 dark:via-blue-900/10 p-6 sm:p-8 shadow-inner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00a896]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
              <Activity className="w-8 h-8 text-[#00a896] drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MediCare PHR</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Personal Health Record System</p>
            </div>
          </div>
          
          <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 text-left sm:text-right font-mono">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-sans">Version</span>
              <strong className="text-slate-900 dark:text-white text-sm font-extrabold">1.0.0</strong>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 sm:hidden"></div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block font-sans">Build</span>
              <strong className="text-[#00a896] text-sm font-extrabold">Frontend Prototype</strong>
            </div>
          </div>
        </div>
      </div>

      {/* GLASSMORPHIC HELP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setTermsModalOpen(true)}
          className="group p-5 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 text-left space-y-3 cursor-pointer shadow-lg shadow-slate-200/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5 text-indigo-500 drop-shadow-sm" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Terms & Privacy Policy</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">View patient data privacy guidelines →</p>
          </div>
        </button>

        <button
          onClick={() => setReportModalOpen(true)}
          className="group p-5 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 text-left space-y-3 cursor-pointer shadow-lg shadow-slate-200/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5 text-amber-500 drop-shadow-sm" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Report a Problem</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Submit a bug or feature feedback →</p>
          </div>
        </button>

        <button
          onClick={() => setFaqModalOpen(true)}
          className="group p-5 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 text-left space-y-3 cursor-pointer shadow-lg shadow-slate-200/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00a896]/10 flex items-center justify-center border border-[#00a896]/20 shadow-inner group-hover:scale-110 transition-transform">
            <HelpCircle className="w-5 h-5 text-[#00a896] drop-shadow-sm" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Help & FAQs</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Read setup guides & answers →</p>
          </div>
        </button>
      </div>

      {/* INTIMIDATING DANGER ZONE */}
      <div className="p-6 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border-2 border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden group hover:border-rose-300 dark:hover:border-rose-800/80 transition-colors">
        {/* Animated Stripe Background Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }}></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-colors"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 shadow-inner border border-rose-200 dark:border-rose-800/50">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-rose-700 dark:text-rose-400 text-sm font-sans flex items-center gap-2">
              DANGER ZONE
            </h4>
            <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-1">Reset All Application Preferences</h5>
            <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-sans font-medium mt-0.5">Restore theme, notifications, privacy, and health settings to default</p>
          </div>
        </div>
        
        <button
          onClick={() => setResetModalOpen(true)}
          className="relative z-10 shrink-0 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Reset Preferences
        </button>
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
                <button type="submit" disabled={reportSubmitting} className="px-4 py-2 rounded-xl bg-[#00a896] opacity-90 hover:opacity-100 text-white cursor-pointer flex items-center gap-1.5 shadow-md">
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
            <button onClick={() => setTermsModalOpen(false)} className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Help & FAQs</h3>
              <button onClick={() => setFaqModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 space-y-3 max-h-64 overflow-y-auto">
              <div>
                <h4 className="font-extrabold text-[#00a896] mb-1">How do I change the theme?</h4>
                <p>Go to the Appearance section and select your desired accent color and mode.</p>
              </div>
              <div>
                <h4 className="font-extrabold text-[#00a896] mb-1">Is my data secure?</h4>
                <p>Yes, all your records are stored 100% locally in your browser.</p>
              </div>
            </div>
            <button onClick={() => setFaqModalOpen(false)} className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* RESET MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Reset All Preferences?
              </h3>
              <button onClick={() => setResetModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This will restore all appearance, notification, privacy, and health preference settings to defaults.
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between gap-3 font-extrabold">
              <button onClick={() => setResetModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button
                onClick={() => {
                  onResetPreferences();
                  setResetModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer text-center shadow-lg hover:-translate-y-0.5 transition-all"
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

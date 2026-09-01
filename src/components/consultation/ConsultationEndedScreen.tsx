import React, { useState } from 'react';
import { CheckCircle2, Star, FileText, Calendar, ArrowRight, Building2 } from 'lucide-react';
import type { ConsultationAppointment } from './consultationData';

interface ConsultationEndedScreenProps {
  appointment: ConsultationAppointment;
  durationSeconds: number;
  notesText: string;
  onNavigateRecords: () => void;
  onNavigateAppointments: () => void;
  onNavigateDashboard: () => void;
}

export const ConsultationEndedScreen: React.FC<ConsultationEndedScreenProps> = ({
  appointment,
  durationSeconds,
  notesText,
  onNavigateRecords,
  onNavigateAppointments,
  onNavigateDashboard,
}) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const formatDurationText = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins} min ${s} sec`;
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 py-6 text-center font-sans">
      {/* SUCCESS HERO BANNER */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
            {appointment.id} • Completed
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Consultation Completed</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Thank you for completing your video consultation with <strong className="text-slate-900 dark:text-white">{appointment.doctor.name}</strong>.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-sans font-bold">Duration</span>
            <span className="font-extrabold text-[#00a896] dark:text-cyan-400">{formatDurationText(durationSeconds)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-sans font-bold">Type</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-sans">HD Video</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-sans font-bold">Record</span>
            <span className="font-extrabold text-purple-700 dark:text-purple-300 font-sans">Saved ✓</span>
          </div>
        </div>

        {/* CONSULTATION SUMMARY / NOTES BOX */}
        {notesText && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-1 text-xs">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase font-mono">Consultation Notes</span>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{notesText}</p>
          </div>
        )}

        {/* RATING & FEEDBACK FORM */}
        {!feedbackSubmitted ? (
          <form onSubmit={handleFeedbackSubmit} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Rate your consultation experience</h4>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600 dark:text-slate-300 dark:text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add optional notes or feedback about your doctor consultation..."
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] font-medium"
            />

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
            ✓ Thank you for your feedback!
          </div>
        )}

        {/* CROSS MODULE CTAs */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <button
            onClick={onNavigateRecords}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-extrabold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>View Record</span>
          </button>

          <button
            onClick={onNavigateAppointments}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 font-extrabold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Follow-up</span>
          </button>

          <button
            onClick={onNavigateDashboard}
            className="p-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold border border-teal-500/30 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

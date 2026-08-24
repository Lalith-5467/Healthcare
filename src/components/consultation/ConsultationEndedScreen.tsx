import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, FileText, Calendar, ArrowRight, Sparkles, Building2 } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 py-6 text-center">
      {/* SUCCESS HERO BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 font-mono">
            {appointment.id} • Completed
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Consultation Completed</h2>
          <p className="text-xs text-slate-300 mt-1">
            Thank you for completing your video consultation with <strong className="text-white">{appointment.doctor.name}</strong>.
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Duration</span>
            <span className="font-mono font-extrabold text-cyan-400">{formatDurationText(durationSeconds)}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Date</span>
            <span className="font-bold text-white">{appointment.date}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Prescription</span>
            <span className="font-bold text-emerald-400">Available</span>
          </div>
        </div>

        {/* RATING & FEEDBACK */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs text-left">
          <h4 className="font-extrabold text-white text-center text-sm">How was your consultation?</h4>

          {feedbackSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-1">
              <Sparkles className="w-5 h-5 mx-auto text-emerald-400" />
              <p className="font-bold">Thank you for your feedback!</p>
              <p className="text-[11px] text-slate-400">Your response helps improve healthcare delivery.</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience (Optional)..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>

        {/* SUMMARY NAVIGATION BUTTONS */}
        <div className="pt-2 space-y-2">
          <button
            onClick={onNavigateRecords}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View Consultation Record & Prescription</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNavigateAppointments}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            >
              Back to Appointments
            </button>
            <button
              onClick={onNavigateDashboard}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

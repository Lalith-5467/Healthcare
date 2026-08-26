import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Copy, Bookmark } from 'lucide-react';

interface DoctorVisitPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuestionsNote: (title: string, questions: string[]) => void;
  onCopyText: (text: string) => void;
}

export const DoctorVisitPrepModal: React.FC<DoctorVisitPrepModalProps> = ({
  isOpen,
  onClose,
  onSaveQuestionsNote,
  onCopyText,
}) => {
  const [reason, setReason] = useState<'General Check-Up' | 'New Symptoms' | 'Follow-Up' | 'Medication Review'>('New Symptoms');
  const [questions, setQuestions] = useState<string[]>([
    'What could be causing these specific symptoms?',
    'Are there any diagnostic tests or lab work recommended?',
    'Should I make any immediate lifestyle or dietary adjustments?',
    'What red flag symptoms should prompt emergency care?'
  ]);

  if (!isOpen) return null;

  const handleReasonChange = (r: typeof reason) => {
    setReason(r);
    if (r === 'General Check-Up') {
      setQuestions([
        'Am I up to date on all recommended preventive health screenings?',
        'What blood tests are appropriate for my age group?',
        'How can I optimize my sleep and cardiovascular fitness?'
      ]);
    } else if (r === 'Follow-Up') {
      setQuestions([
        'Have my previous lab results improved compared to last visit?',
        'Should I continue my current treatment plan without modification?',
        'When is my next follow-up appointment needed?'
      ]);
    } else if (r === 'Medication Review') {
      setQuestions([
        'Are all 3 of my current medications working safely together?',
        'Are there any side effects I should monitor for Amlodipine?',
        'Can any of these pills be taken on an empty stomach?'
      ]);
    } else {
      setQuestions([
        'What could be causing these specific symptoms?',
        'Are there any diagnostic tests or lab work recommended?',
        'Should I make any immediate lifestyle or dietary adjustments?',
        'What red flag symptoms should prompt emergency care?'
      ]);
    }
  };

  const fullText = `Doctor Visit Preparation (${reason}):\n` + questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs font-sans text-slate-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Prepare for Doctor Visit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Customized doctor question checklist generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VISIT REASON SELECTOR */}
        <div className="space-y-2 font-mono">
          <label className="block text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wider font-sans">Select Visit Reason</label>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
            {(['New Symptoms', 'General Check-Up', 'Follow-Up', 'Medication Review'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleReasonChange(r)}
                className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                  reason === r
                    ? 'bg-[#00a896] text-white border-teal-500 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* GENERATED QUESTIONS LIST */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[11px]">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase block font-sans">Recommended Questions for Doctor</span>
          <ul className="space-y-2 text-slate-800 dark:text-slate-200 font-sans font-medium">
            {questions.map((q, i) => (
              <li key={q} className="flex gap-2">
                <span className="text-[#00a896] dark:text-cyan-300 font-extrabold font-mono">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold text-xs">
          <button
            onClick={() => onCopyText(fullText)}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Copy className="w-4 h-4" />
            <span>Copy List</span>
          </button>

          <button
            onClick={() => {
              onSaveQuestionsNote(`Doctor Prep: ${reason}`, questions);
              onClose();
            }}
            className="flex-1 py-3 px-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to Notes</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

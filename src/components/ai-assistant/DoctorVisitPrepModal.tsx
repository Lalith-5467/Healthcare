import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Prepare for Doctor Visit</h3>
              <p className="text-xs text-slate-400">Customized doctor question checklist generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VISIT REASON SELECTOR */}
        <div className="space-y-2 font-mono">
          <label className="block text-slate-300 font-bold uppercase tracking-wider font-sans">Select Visit Reason</label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {(['New Symptoms', 'General Check-Up', 'Follow-Up', 'Medication Review'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleReasonChange(r)}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                  reason === r
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* GENERATED QUESTIONS LIST */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Recommended Questions for Doctor</span>
          <ul className="space-y-2 text-slate-200 font-sans">
            {questions.map((q, i) => (
              <li key={q} className="flex gap-2">
                <span className="text-purple-400 font-bold font-mono">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-2 font-extrabold text-xs">
          <button
            onClick={() => onCopyText(fullText)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy List</span>
          </button>

          <button
            onClick={() => {
              onSaveQuestionsNote(`Doctor Prep: ${reason}`, questions);
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

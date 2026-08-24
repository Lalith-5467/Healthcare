import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface TermDetail {
  term: string;
  meaning: string;
  whyItMatters: string;
  doctorQuestion: string;
}

const DICTIONARY: Record<string, TermDetail> = {
  'Hypertension': {
    term: 'Hypertension',
    meaning: 'High blood pressure (persistently >= 130/80 mmHg) putting strain on arteries.',
    whyItMatters: 'Uncontrolled hypertension increases risk of heart attack, stroke, and kidney disease.',
    doctorQuestion: 'What lifestyle modifications or blood pressure goals are recommended for me?'
  },
  'HbA1c': {
    term: 'HbA1c (Glycated Hemoglobin)',
    meaning: 'A blood test measuring average blood sugar (glucose) levels over the past 2 to 3 months.',
    whyItMatters: 'It is the gold standard test used to diagnose diabetes and assess long-term blood sugar control.',
    doctorQuestion: 'What is my target HbA1c percentage?'
  },
  'ECG / EKG': {
    term: 'Electrocardiogram (ECG)',
    meaning: 'A quick test that records the electrical signals and rhythm of your heart.',
    whyItMatters: 'Helps detect abnormal heart rhythms (arrhythmias) or impaired heart muscle oxygen supply.',
    doctorQuestion: 'Does my ECG show a normal cardiac sinus rhythm?'
  },
  'Lipid Panel': {
    term: 'Lipid Panel (Cholesterol)',
    meaning: 'A blood test measuring Total Cholesterol, LDL (bad), HDL (good), and Triglycerides.',
    whyItMatters: 'High LDL cholesterol can lead to plaque buildup (atherosclerosis) in blood vessels.',
    doctorQuestion: 'Are my LDL and triglyceride levels within safe target ranges?'
  }
};

interface MedicalTermExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTermQuery: (termName: string) => void;
}

export const MedicalTermExplainerModal: React.FC<MedicalTermExplainerModalProps> = ({
  isOpen,
  onClose,
  onSelectTermQuery,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('Hypertension');
  const termData = DICTIONARY[selectedKey] || DICTIONARY['Hypertension'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Medical Term Explainer</h3>
              <p className="text-xs text-slate-400">Simple plain-language medical dictionary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TERM SELECTOR CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px]">
          {Object.keys(DICTIONARY).map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKey(k)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedKey === k ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* TERM DETAILS CARD */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-[11px]">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase font-bold block font-sans">Simple Meaning</span>
            <strong className="text-white text-xs font-sans leading-relaxed block">{termData.meaning}</strong>
          </div>

          <div className="border-t border-slate-800 pt-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block font-sans">Why It Matters</span>
            <p className="text-slate-300 font-sans leading-relaxed">{termData.whyItMatters}</p>
          </div>

          <div className="border-t border-slate-800 pt-2">
            <span className="text-[10px] text-purple-300 uppercase font-bold block font-sans">Question for Doctor</span>
            <p className="text-slate-200 font-sans italic">"{termData.doctorQuestion}"</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold text-xs">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Close</button>
          <button
            onClick={() => {
              onSelectTermQuery(`Explain ${termData.term} to me`);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-md text-center"
          >
            Ask AI Assistant About This Term
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Sparkles } from 'lucide-react';

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
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Medical Term Explainer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Simple plain-language medical dictionary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TERM SELECTOR CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-sans text-xs">
          {Object.keys(DICTIONARY).map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKey(k)}
              className={`px-3.5 py-2 rounded-2xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedKey === k
                  ? 'bg-[#00a896] text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* TERM DETAILS CARD */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-sans">
          <div>
            <span className="text-[10px] text-[#00a896] dark:text-cyan-300 uppercase font-mono font-extrabold block">Simple Meaning</span>
            <strong className="text-slate-900 dark:text-white text-xs leading-relaxed block font-bold mt-0.5">{termData.meaning}</strong>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-extrabold block">Why It Matters</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-0.5">{termData.whyItMatters}</p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5">
            <span className="text-[10px] text-purple-600 dark:text-purple-300 uppercase font-mono font-extrabold block">Question for Doctor</span>
            <p className="text-slate-800 dark:text-slate-200 italic font-medium mt-0.5">"{termData.doctorQuestion}"</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-extrabold text-xs">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelectTermQuery(`Explain ${termData.term} to me`);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white cursor-pointer shadow-md text-center flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI About This Term</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

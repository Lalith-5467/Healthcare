import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { INSURANCE_FAQS } from './insuranceData';

export const InsuranceFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        <div>
          <h3 className="text-lg font-extrabold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400">Everything you need to know about policy coverage and claims</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {INSURANCE_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.q} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-white flex items-center justify-between gap-4 cursor-pointer hover:text-cyan-300"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-400' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

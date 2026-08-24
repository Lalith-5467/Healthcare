import React, { useState } from 'react';
import { X, ShieldCheck, Check, Plus } from 'lucide-react';
import type { InsurancePlanOption } from './insuranceData';
import { SAMPLE_INSURANCE_PLANS } from './insuranceData';

interface PlanExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: InsurancePlanOption) => void;
}

export const PlanExplorerModal: React.FC<PlanExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  const toggleCompare = (id: string) => {
    if (comparedPlanIds.includes(id)) {
      setComparedPlanIds(comparedPlanIds.filter((i) => i !== id));
    } else {
      if (comparedPlanIds.length >= 3) return;
      setComparedPlanIds([...comparedPlanIds, id]);
    }
  };

  const comparedPlans = SAMPLE_INSURANCE_PLANS.filter((p) => comparedPlanIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-y-auto text-xs">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono">
              Demo Health Insurance Explorer
            </span>
            <h3 className="text-lg font-extrabold text-white">Compare & Explore Insurance Plans</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMPARISON VIEW VS GRID */}
        {!showComparison ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 py-2">
            {SAMPLE_INSURANCE_PLANS.map((plan) => {
              const isCompared = comparedPlanIds.includes(plan.id);
              return (
                <div key={plan.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-purple-400 font-mono uppercase">Coverage: ₹{(plan.coverageAmount / 100000).toFixed(0)} Lakhs</span>
                    <h4 className="font-extrabold text-white text-base">{plan.name}</h4>
                    <div className="font-mono text-xl font-extrabold text-amber-300">
                      ₹{plan.monthlyPremium} <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
                    </div>

                    <div className="space-y-2 font-mono text-[11px] pt-3 border-t border-slate-800">
                      <p className="text-slate-300 font-sans">✓ {plan.hospitalization}</p>
                      <p className="text-slate-300 font-sans">✓ {plan.outpatient}</p>
                      <p className="text-slate-300 font-sans">✓ {plan.emergency}</p>
                      <p className="text-slate-400 font-sans">Deductible: {plan.deductible}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => toggleCompare(plan.id)}
                      className={`w-full py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                        isCompared ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {isCompared ? '✓ Added to Compare' : '+ Select for Compare'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1 py-2 font-mono">
            <div className="grid grid-cols-3 gap-3 min-w-[600px]">
              {comparedPlans.map((p) => (
                <div key={p.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-white font-sans text-sm">{p.name}</h4>
                  <p className="text-amber-300 font-bold">₹{p.monthlyPremium}/mo</p>
                  <div className="space-y-1 text-[11px] pt-2 border-t border-slate-800 text-slate-300 font-sans">
                    <p><strong>Coverage:</strong> ₹{(p.coverageAmount / 100000)} Lakhs</p>
                    <p><strong>Deductible:</strong> {p.deductible}</p>
                    <p><strong>Co-pay:</strong> {p.coPay}</p>
                    <p><strong>Emergency:</strong> {p.emergency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center shrink-0">
          {comparedPlanIds.length > 0 && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
            >
              {showComparison ? 'Back to All Plans' : `Compare Selected (${comparedPlanIds.length})`}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer ml-auto"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface CoverageDetailsModalProps {
  policy: InsurancePolicy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CoverageDetailsModal: React.FC<CoverageDetailsModalProps> = ({
  policy,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'hospitalization' | 'outpatient' | 'diagnostics' | 'medicines' | 'emergency' | 'maternity'>('hospitalization');

  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Full Coverage Breakdown</h3>
              <p className="text-xs text-slate-400">{policy.planName} • {policy.providerName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto shrink-0">
          {[
            { id: 'hospitalization', label: 'Hospitalization' },
            { id: 'outpatient', label: 'Outpatient' },
            { id: 'diagnostics', label: 'Diagnostics' },
            { id: 'medicines', label: 'Medicines' },
            { id: 'emergency', label: 'Emergency' },
            { id: 'maternity', label: 'Maternity & Dental' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs py-2">
          {activeTab === 'hospitalization' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Inpatient Limit:</span><strong className="text-white">₹5,00,000 / year</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Coverage Percentage:</span><strong className="text-teal-400">80% Cashless</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Annual Deductible:</span><strong className="text-amber-300">₹10,000</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Network Co-payment:</span><strong className="text-cyan-300">10%</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Covers ICU room rent, nursing charges, surgeon fees, operation theater expenses, and organ donor medical costs.
              </p>
            </div>
          )}

          {activeTab === 'outpatient' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Outpatient Limit:</span><strong className="text-white">₹35,000 / year</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Coverage Percentage:</span><strong className="text-cyan-400">60% Reimbursed</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Doctor Consultation Cap:</span><strong className="text-purple-300">₹1,200 / visit</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Covers specialist doctor consultations, routine physical check-ups, and follow-up clinical visits.
              </p>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Diagnostic Limit:</span><strong className="text-white">₹25,000 / year</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Coverage Percentage:</span><strong className="text-indigo-400">70% Covered</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Covers blood tests, MRI scans, CT scans, Ultrasound, ECG, and X-ray imaging at accredited labs.
              </p>
            </div>
          )}

          {activeTab === 'medicines' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Medicine Cap:</span><strong className="text-white">₹20,000 / year</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Coverage Percentage:</span><strong className="text-purple-400">50% Reimbursed</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Covers doctor-prescribed medications purchased from registered network pharmacies.
              </p>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Emergency Ambulance:</span><strong className="text-emerald-400">100% Fully Covered</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Trauma ICU Care:</span><strong className="text-emerald-400">100% Cashless</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Full 24x7 coverage for ALS ambulance transport and priority emergency trauma bay admission.
              </p>
            </div>
          )}

          {activeTab === 'maternity' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Maternity Care Cap:</span><strong className="text-white">₹75,000 / delivery</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400">Dental OP Benefit:</span><strong className="text-cyan-300">₹8,000 / year</strong></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Covers delivery expenses, newborn care for 90 days, and routine dental cleanings.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md cursor-pointer text-center"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Users, Plus, ShieldCheck, User } from 'lucide-react';
import type { FamilyMemberCoverage } from './insuranceData';

interface FamilyCoverageSectionProps {
  members: FamilyMemberCoverage[];
  onOpenAddMember: () => void;
}

export const FamilyCoverageSection: React.FC<FamilyCoverageSectionProps> = ({
  members,
  onOpenAddMember,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-white">Covered Family Members</h3>
          <p className="text-xs text-slate-400">Family Floater policy coverage breakdown per member</p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member to Policy</span>
        </button>
      </div>

      {/* MEMBER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {members.map((fam) => (
          <div key={fam.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm font-sans">{fam.memberName}</h4>
                  <span className="text-[10px] text-purple-300 font-mono">{fam.relationship}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {fam.status}
              </span>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-400">Coverage Limit:</span><strong className="text-white">₹10 Lakhs</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Used Amount:</span><strong className="text-amber-300">₹{fam.usedAmount.toLocaleString()}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

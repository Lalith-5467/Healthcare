import React, { useState } from 'react';
import { ShieldCheck, UserX, AlertTriangle, Check, X } from 'lucide-react';
import type { AccountSettings } from './settingsData';

interface AccountSettingsSectionProps {
  account: AccountSettings;
  onDeactivateAccount: () => void;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  account,
  onDeactivateAccount,
}) => {
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Account Information</h3>
          <p className="text-xs text-slate-400">Account status, user identity, and plan tier</p>
        </div>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Account Status</span>
          <strong className="text-emerald-400 text-base font-extrabold flex items-center gap-1.5 font-sans">
            <ShieldCheck className="w-4 h-4" />
            <span>{account.accountStatus}</span>
          </strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Member Since</span>
          <strong className="text-white text-base font-extrabold">{account.memberSince}</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Patient User ID</span>
          <strong className="text-cyan-300 text-base font-extrabold">{account.userId}</strong>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Access Tier</span>
          <strong className="text-purple-300 text-base font-extrabold font-sans">{account.plan}</strong>
        </div>
      </div>

      {/* DANGER ZONE / DEACTIVATE */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-white text-sm">Deactivate Account</h4>
          <p className="text-[11px] text-slate-400">Mark account inactive locally. You can reactivate anytime.</p>
        </div>

        <button
          onClick={() => setDeactivateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer self-stretch sm:self-auto flex items-center justify-center gap-1.5"
        >
          <UserX className="w-4 h-4" />
          <span>Deactivate Account</span>
        </button>
      </div>

      {/* DEACTIVATE MODAL */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Deactivate Patient Account?</h3>
              <button onClick={() => setDeactivateModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This is a demo action. Your account status will be updated to inactive in local prototype state.
            </p>
            <div className="pt-3 border-t border-slate-800 flex justify-between gap-3 font-extrabold">
              <button onClick={() => setDeactivateModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  onDeactivateAccount();
                  setDeactivateModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer text-center"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

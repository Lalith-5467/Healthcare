import React, { useState } from 'react';
import { ShieldCheck, UserX, X } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Account Information</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Account status, user identity, and plan tier</p>
        </div>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Account Status</span>
          <strong className="text-emerald-700 dark:text-emerald-400 text-base font-extrabold flex items-center gap-1.5 font-sans">
            <ShieldCheck className="w-4 h-4" />
            <span>{account.accountStatus}</span>
          </strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Member Since</span>
          <strong className="text-slate-900 dark:text-white text-base font-extrabold font-mono">{account.memberSince}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Patient User ID</span>
          <strong className="text-[#00a896] dark:text-cyan-300 text-base font-extrabold font-mono">{account.userId}</strong>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase block font-sans">Access Tier</span>
          <strong className="text-[#00a896] text-base font-extrabold font-sans">{account.plan}</strong>
        </div>
      </div>

      {/* DANGER ZONE / DEACTIVATE */}
      <div className="p-4 bg-rose-500/5 dark:bg-slate-950 rounded-2xl border border-rose-300 dark:border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Deactivate Account</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Mark account inactive locally. You can reactivate anytime.</p>
        </div>

        <button
          onClick={() => setDeactivateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <UserX className="w-4 h-4" />
          <span>Deactivate Account</span>
        </button>
      </div>

      {/* DEACTIVATE MODAL */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Confirm Account Deactivation</h4>
              <button onClick={() => setDeactivateModalOpen(false)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Are you sure you want to deactivate your demo patient account?</p>
            <div className="pt-2 flex justify-between gap-3 font-sans">
              <button onClick={() => setDeactivateModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">Cancel</button>
              <button
                onClick={() => {
                  onDeactivateAccount();
                  setDeactivateModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md"
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ShieldCheck, 
  Sliders, 
  Save, 
  CheckCircle2, 
  Bell, 
  Building2, 
  IndianRupee, 
  FileCheck2 
} from 'lucide-react';

export const InsuranceSettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    autoAdjudicationThreshold: '50000',
    mandatoryDischargeSummary: true,
    abdmLiveClearinghouseSync: true,
    tatHours: '2',
    hospitalTier1RoomCap: '8000',
    icd10Validation: true,
    officerDeskName: 'Senior TPA Medical Adjudicator',
    officerId: 'TPA-MED-8821'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* SAVED TOAST */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>TPA Clearinghouse Desk Settings Saved!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" /> Clearinghouse Configuration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            TPA Desk & Adjudication Rules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Configure cashless auto-approval thresholds, ICD-10 medical tariffs, and ABDM clearinghouse rules.
          </p>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. AUTO-ADJUDICATION THRESHOLDS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500" /> Cashless Pre-Auth & Auto-Adjudication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                Instant Cashless Auto-Approval Cap (₹)
              </label>
              <input
                type="number"
                value={settings.autoAdjudicationThreshold}
                onChange={(e) => setSettings({ ...settings, autoAdjudicationThreshold: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                Target Turnaround Time (TAT Hours)
              </label>
              <input
                type="number"
                value={settings.tatHours}
                onChange={(e) => setSettings({ ...settings, tatHours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">ABDM Real-Time Health Vault Sync</p>
                <p className="text-[11px] text-slate-500">Automatically ingest verified hospital invoices and lab reports into claims stream.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.abdmLiveClearinghouseSync}
                onChange={(e) => setSettings({ ...settings, abdmLiveClearinghouseSync: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Mandatory Medical Discharge Summary Audit</p>
                <p className="text-[11px] text-slate-500">Require physician signature and ICD-10 diagnostic code before cashless final discharge.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.mandatoryDischargeSummary}
                onChange={(e) => setSettings({ ...settings, mandatoryDischargeSummary: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 text-xs cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Adjudication Configurations</span>
        </button>

      </form>

    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, ShieldCheck, Bell, Lock, Globe, Moon, Sun, 
  CheckCircle2, Server, Eye, Database
} from 'lucide-react';

export const AdminSystemSettingsView: React.FC = () => {
  const [orgName, setOrgName] = useState('National Digital Health Records (MediCare ABDM)');
  const [supportEmail, setSupportEmail] = useState('directorate@dhr-medicare.in');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-5xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
            <Settings className="w-3.5 h-3.5" /> Platform Configuration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            System Settings & Security Policies
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            Configure authentication timeouts, multi-factor mandates, global notification webhooks, and theme interfaces.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-400/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Gateway Healthy (100% Up)
          </span>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>System settings and security policies committed successfully.</span>
          </div>
        )}

        {/* 1. GENERAL ORG */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Organization & Directorate Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Support / Escalation Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. SECURITY & SESSIONS */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Authentication & Session Security
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Inactivity Session Timeout (Minutes)</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="15">15 Minutes (Strict Clinical)</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Mandatory Two-Factor (2FA / OTP)</p>
                <p className="text-[10px] text-slate-400">Enforce OTP on Doctor & Admin Logins</p>
              </div>
              <input
                type="checkbox"
                checked={mfaEnforced}
                onChange={(e) => setMfaEnforced(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. NOTIFICATIONS */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            3. Notification Dispatch
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">System Email Alerts</p>
                <p className="text-[10px] text-slate-400">Security breach & failed logins</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">SMS Gateway Telemetry</p>
                <p className="text-[10px] text-slate-400">Patient OTP & prescription alerts</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
        </div>
      </form>

    </div>
  );
};

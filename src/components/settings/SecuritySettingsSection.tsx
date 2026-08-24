import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Smartphone, Monitor, Check, X, Sparkles } from 'lucide-react';
import type { SecuritySettingsState } from './settingsData';

interface SecuritySettingsSectionProps {
  security: SecuritySettingsState;
  onUpdateSecurity: (updated: SecuritySettingsState) => void;
  onShowToast: (msg: string) => void;
}

export const SecuritySettingsSection: React.FC<SecuritySettingsSectionProps> = ({
  security,
  onUpdateSecurity,
  onShowToast,
}) => {
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSaving, setPassSaving] = useState(false);

  const [twoFaModalOpen, setTwoFaModalOpen] = useState(false);

  const calculatePassStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const passScore = calculatePassStrength(newPass);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      onShowToast('⚠️ Passwords do not match');
      return;
    }
    setPassSaving(true);
    setTimeout(() => {
      setPassSaving(false);
      setChangePassOpen(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      onUpdateSecurity({ ...security, passwordLastChanged: '24 Aug 2026 (Just Now)' });
      onShowToast('✓ Password updated locally');
    }, 700);
  };

  const toggle2FA = () => {
    if (!security.twoFactorEnabled) {
      setTwoFaModalOpen(true);
    } else {
      onUpdateSecurity({ ...security, twoFactorEnabled: false });
      onShowToast('✓ Two-Factor Authentication disabled');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Security & Authentication</h3>
          <p className="text-xs text-slate-400">Password management, two-factor authentication, and login activity</p>
        </div>
      </div>

      {/* PASSWORD CARD */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Account Password</h4>
            <p className="text-slate-400 text-xs font-mono">Last changed: {security.passwordLastChanged}</p>
          </div>
        </div>

        <button
          onClick={() => setChangePassOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
        >
          Change Password
        </button>
      </div>

      {/* TWO-FACTOR AUTH */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Two-Factor Authentication (2FA)</h4>
            <p className="text-slate-400 text-xs font-mono">Method: {security.twoFactorMethod}</p>
          </div>
        </div>

        <button
          onClick={toggle2FA}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
            security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
            security.twoFactorEnabled ? 'right-1' : 'left-1'
          }`} />
        </button>
      </div>

      {/* RECENT LOGIN ACTIVITY */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Recent Login Activity</h4>
        <div className="space-y-2 font-mono text-[11px]">
          {security.recentLogins.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white font-sans">{log.device} • {log.browser}</h5>
                  <span className="text-[10px] text-slate-400">{log.location} • {log.time}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {changePassOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Change Account Password</h3>
              <button onClick={() => setChangePassOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
                {newPass && (
                  <div className="mt-1.5 space-y-1">
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passScore >= 75 ? 'bg-emerald-400' : passScore >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${passScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Password Strength: {passScore}%</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 font-extrabold">
                <button type="button" onClick={() => setChangePassOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={passSaving} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer flex items-center gap-1.5 shadow">
                  {passSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA SETUP MODAL */}
      {twoFaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Enable Two-Factor Authentication</h3>
              <button onClick={() => setTwoFaModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Select your preferred 2FA authentication method for simulated security verification.
            </p>
            <div className="space-y-2">
              {(['Authenticator App', 'Email OTP', 'SMS OTP'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    onUpdateSecurity({ ...security, twoFactorEnabled: true, twoFactorMethod: method });
                    setTwoFaModalOpen(false);
                    onShowToast(`✓ 2FA Enabled via ${method}`);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-bold hover:bg-slate-800 text-left cursor-pointer"
                >
                  Enable via {method} →
                </button>
              ))}
            </div>
            <button onClick={() => setTwoFaModalOpen(false)} className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

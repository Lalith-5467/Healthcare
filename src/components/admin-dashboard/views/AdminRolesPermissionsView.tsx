import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, ShieldCheck, Check, X, Lock, Save, RefreshCw, 
  Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { DEFAULT_PERMISSION_MATRIX } from '../../../utils/adminMockStorage';

interface AdminRolesPermissionsViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminRolesPermissionsView: React.FC<AdminRolesPermissionsViewProps> = ({ currentRole }) => {
  const [matrix, setMatrix] = useState(DEFAULT_PERMISSION_MATRIX);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ROLES = ['Patient', 'Doctor', 'Nurse', 'Pharmacist', 'Caregiver', 'Insurance', 'Admin', 'Super Admin'];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggle = (permission: string, role: string) => {
    if (role === 'Super Admin' && (permission === 'Manage Administrator Roles' || permission === 'Configure Security & Firewalls')) {
      showToast('Super Admin baseline security permissions cannot be revoked.');
      return;
    }

    setMatrix(prev => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission][role]
      }
    }));
  };

  const handleSave = () => {
    showToast('Permission matrix schema committed and synced across all API gateways.');
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* TOAST ALERT */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/30 font-mono">
            <KeyRound className="w-3.5 h-3.5" /> Granular Access Control Matrix (RBAC)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Roles & Permission Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Configure system-wide read, write, and audit capabilities across all 8 user classes in compliance with ABDM Data Privacy Standards.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleSave}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>Commit Role Matrix</span>
          </button>
        </div>
      </div>

      {/* 2. PERMISSION MATRIX GRID */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Role Capability Assignment Grid
            </h3>
            <p className="text-xs text-slate-400">Click any checkbox to grant or revoke real-time feature authorization.</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">8 Roles • 11 Permissions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-[10px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5 min-w-[240px]">Permission Feature Node</th>
                {ROLES.map(role => (
                  <th key={role} className="py-3.5 px-3 text-center min-w-[100px]">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                      role === 'Super Admin' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                      role === 'Admin' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {Object.keys(matrix).map((permKey) => (
                <tr key={permKey} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {permKey}
                  </td>
                  {ROLES.map(role => {
                    const isGranted = matrix[permKey]?.[role];
                    return (
                      <td key={role} className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleToggle(permKey, role)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer ${
                            isGranted
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isGranted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, ShieldCheck, Check, X, Lock, Save, RefreshCw, 
  Sparkles, CheckCircle2, ShieldAlert, Loader2
} from 'lucide-react';
import { DEFAULT_PERMISSION_MATRIX } from '../../../utils/adminMockStorage';
import { settingsApi } from '../../../services/dhrApis';

interface AdminRolesPermissionsViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminRolesPermissionsView: React.FC<AdminRolesPermissionsViewProps> = ({ currentRole }) => {
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(DEFAULT_PERMISSION_MATRIX);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ROLES = ['Patient', 'Doctor', 'Nurse', 'Pharmacist', 'Caregiver', 'Insurance', 'Admin', 'Super Admin'];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getRbacMatrix();
      if (res && res.data) {
        setMatrix(res.data);
      }
    } catch (err: any) {
      console.warn('Could not load RBAC matrix from backend, falling back to cached baseline:', err);
      try {
        const saved = localStorage.getItem('medicare_rbac_matrix');
        if (saved) setMatrix(JSON.parse(saved));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleToggle = (permission: string, role: string) => {
    if (currentRole !== 'Super Admin') {
      showToast('Only Super Admin is authorized to modify administrative governance permissions.');
      return;
    }

    if (role === 'Super Admin' && (permission === 'Manage Administrator Roles' || permission === 'Configure Security & Firewalls')) {
      showToast('Super Admin baseline security permissions cannot be revoked.');
      return;
    }

    setMatrix((prev: any) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission][role]
      }
    }));
  };

  const handleSave = async () => {
    if (currentRole !== 'Super Admin') {
      showToast('Only Super Administrators are authorized to update the role permissions matrix.');
      return;
    }

    setIsSaving(true);
    try {
      await settingsApi.updateRbacMatrix(matrix);
      try {
        localStorage.setItem('medicare_rbac_matrix', JSON.stringify(matrix));
      } catch {}
      showToast('Role permissions matrix saved successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save permission matrix.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* TOAST ALERT */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none select-none max-w-md w-full px-4">
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              className="pointer-events-auto select-auto px-4 py-3 rounded-2xl bg-[#00a896] text-white font-bold text-xs shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00a896] text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Roles & Permission Governance
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Configure system-wide read, write, and audit capabilities across all 8 user classes in compliance with ABDM Data Privacy Standards.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving || currentRole !== 'Super Admin'}
            className={`px-5 py-3 rounded-xl font-black text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
              currentRole === 'Super Admin'
                ? 'bg-white hover:bg-teal-50/90 text-[#00796b] shadow-teal-950/15'
                : 'bg-white/30 text-white/70 cursor-not-allowed opacity-60'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#00897b]" /> : <Save className="w-4 h-4 text-[#00897b]" />}
            <span>{isSaving ? 'Saving changes...' : currentRole === 'Super Admin' ? 'Save Permissions Matrix' : 'Super Admin Required to Save'}</span>
          </button>
        </div>
      </div>

      {/* 2. PERMISSION MATRIX GRID */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00a896]" />
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
                      role === 'Super Admin' ? 'bg-[#00a896]/20 text-[#00a896] dark:text-[#2dd4bf]' :
                      role === 'Admin' ? 'bg-[#00a896]/15 text-[#00a896] dark:text-[#2dd4bf]' :
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a896]" />
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

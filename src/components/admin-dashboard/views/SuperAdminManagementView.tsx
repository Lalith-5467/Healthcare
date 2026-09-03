import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Plus, Trash2, Edit2, KeyRound, CheckCircle2, Lock, X, 
  ShieldAlert, Mail, Phone, Building2, UserCheck
} from 'lucide-react';
import { INITIAL_ADMIN_USERS, type AdminUser } from '../../../utils/adminMockStorage';

interface SuperAdminManagementViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export const SuperAdminManagementView: React.FC<SuperAdminManagementViewProps> = ({ currentRole }) => {
  const [admins, setAdmins] = useState<AdminUser[]>(
    INITIAL_ADMIN_USERS.filter(u => u.role === 'Admin' || u.role === 'Super Admin')
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Admin' | 'Super Admin'>('Admin');
  const [dept, setDept] = useState('Hospital Administration');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminUser = {
      id: `ADM-${9000 + admins.length + 1}`,
      name,
      email,
      phone: phone || '+91 98400 99999',
      role,
      department: dept,
      status: 'Active',
      lastLogin: 'Never logged in',
      createdDate: '01 Sep 2026'
    };

    setAdmins([newAdmin, ...admins]);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast(`Administrator account for ${newAdmin.name} provisioned.`);
  };

  const handleToggleSuspend = (id: string) => {
    setAdmins(admins.map(a => {
      if (a.id === id) {
        const next = a.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Admin ${a.name} is now ${next}.`);
        return { ...a, status: next };
      }
      return a;
    }));
  };

  const handleRemove = (id: string, name: string) => {
    if (admins.length <= 1) {
      showToast('Cannot remove the root primary Super Admin.');
      return;
    }
    setAdmins(admins.filter(a => a.id !== id));
    showToast(`Admin account ${name} revoked.`);
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
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider border border-rose-400/30 font-mono">
            <Shield className="w-3.5 h-3.5" /> Super Admin Directorate Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Administrator Hierarchy & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Grant, elevate, and audit executive hospital administration accounts with master system override privileges.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Administrator</span>
          </button>
        </div>
      </div>

      {/* 2. ADMIN ACCOUNTS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Active Administrator Credentials Roster
          </h3>
          <span className="text-xs font-mono font-bold text-slate-400">{admins.length} Executive Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-4 px-5">Administrator</th>
                <th className="py-4 px-4">Executive Role</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Authentication</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0 border border-rose-500/20 text-xs">
                        {adm.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-xs">{adm.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{adm.email} • {adm.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                      adm.role === 'Super Admin'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-black'
                        : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                    }`}>
                      {adm.role}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {adm.department}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                      adm.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      {adm.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                    {adm.lastLogin}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleSuspend(adm.id)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        {adm.status === 'Active' ? 'Suspend' : 'Reinstate'}
                      </button>

                      <button
                        onClick={() => handleRemove(adm.id, adm.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 cursor-pointer"
                        title="Remove Administrator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ADMIN MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Enroll Executive Administrator
                  </h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. Jayachandran"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hospital.in"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Designated Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    Grant Credentials
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

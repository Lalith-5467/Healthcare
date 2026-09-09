import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Plus, Trash2, Edit2, KeyRound, CheckCircle2, Lock, X, 
  ShieldAlert, Mail, Phone, Building2, UserCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import { adminApi, authApi } from '../../../services/dhrApis';
import { setAuthToken } from '../../../services/apiClient';

interface SuperAdminManagementViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

export interface AdminNode {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Super Admin';
  department: string;
  status: 'Active' | 'Suspended';
  lastLogin: string;
  createdDate: string;
}

export const SuperAdminManagementView: React.FC<SuperAdminManagementViewProps> = ({ currentRole }) => {
  const [admins, setAdmins] = useState<AdminNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Admin@123');
  const [role, setRole] = useState<'Admin' | 'Super Admin'>('Admin');
  const [dept, setDept] = useState('Hospital Administration');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });
      if (res && res.data) {
        const rawUsers: any[] = Array.isArray(res.data) ? res.data : (res.data as any).users || [];
        const adminUsers = rawUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
        const mapped: AdminNode[] = adminUsers.map((u: any) => {
          const profile = u.profile || u.patient || u.doctor || u.nurse || u.pharmacist || u.caregiver || u.insuranceProvider || {};
          const adminName = profile.fullName || profile.providerName || u.email.split('@')[0];
          return {
            id: u.id,
            name: adminName,
            email: u.email,
            phone: u.phone || u.phoneNumber || '+91 98400 00001',
            role: u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin',
            department: u.role === 'SUPER_ADMIN' ? 'System Directorate' : 'Hospital Administration',
            status: u.status === 'ACTIVE' || u.isActive ? 'Active' : 'Suspended',
            lastLogin: 'Active Governance Node',
            createdDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Sep 2026',
          };
        });
        setAdmins(mapped);
      }
    } catch (err: any) {
      console.error('Failed to load admin accounts:', err);
      showToast(err.message || 'Failed to fetch admin accounts from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dbRole = role === 'Super Admin' ? 'SUPER_ADMIN' : 'ADMIN';
      await adminApi.createUser({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phone.trim() || undefined,
        password: password || 'Admin@123',
        role: dbRole,
      });

      showToast(`Administrator account for ${name} saved to MySQL.`, 'success');
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error creating administrator in database.', 'error');
    }
  };

  const handleToggleRole = async (id: string, currentAdmRole: 'Admin' | 'Super Admin', admName: string) => {
    try {
      const nextRole = currentAdmRole === 'Admin' ? 'SUPER_ADMIN' : 'ADMIN';
      await adminApi.updateUserRole(id, nextRole);
      showToast(`Admin ${admName} role updated to ${nextRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} in MySQL.`, 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error updating administrator role.', 'error');
    }
  };

  const handleToggleSuspend = async (id: string, currentStatus: string, admName: string) => {
    try {
      const nextStatus = currentStatus === 'Active' ? 'INACTIVE' : 'ACTIVE';
      await adminApi.updateUserStatus(id, nextStatus);
      showToast(`Admin ${admName} is now ${nextStatus === 'ACTIVE' ? 'Active' : 'Suspended'} in MySQL.`, 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error updating status in MySQL.', 'error');
    }
  };

  const handleRemove = async (id: string, admName: string) => {
    if (!window.confirm(`Are you sure you want to revoke and delete administrator "${admName}" from MySQL?`)) {
      return;
    }
    try {
      await adminApi.deleteUser(id);
      showToast(`Admin account ${admName} revoked and deleted from MySQL.`, 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error deleting admin from database.', 'error');
    }
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
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl text-white font-bold text-xs shadow-2xl flex items-center gap-2 ${
              toastType === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            {toastType === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider border border-rose-400/30 font-mono">
            <Shield className="w-3.5 h-3.5" /> Super Admin Directorate Access (Live MySQL)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Administrator Hierarchy & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Grant, elevate, and audit executive hospital administration accounts with master system override privileges directly in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={fetchAdmins}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 shadow-md flex items-center gap-2 cursor-pointer transition-all"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
          </button>
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
                <th className="py-4 px-4">Created Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {loading ? 'Loading administrators...' : 'No admin accounts found.'}
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black shrink-0 border border-rose-500/20 text-xs">
                          {adm.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{adm.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{adm.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                        adm.role === 'Super Admin'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30 ring-1 ring-rose-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
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
                      {adm.createdDate}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Promote / Demote Role */}
                        <button
                          onClick={() => handleToggleRole(adm.id, adm.role, adm.name)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                          title="Toggle Role in MySQL"
                        >
                          {adm.role === 'Admin' ? 'Promote to Super Admin' : 'Demote to Admin'}
                        </button>

                        {/* Suspend / Reactivate */}
                        <button
                          onClick={() => handleToggleSuspend(adm.id, adm.status, adm.name)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
                          title={adm.status === 'Active' ? 'Suspend Admin in MySQL' : 'Reactivate Admin in MySQL'}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(adm.id, adm.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          title="Remove Administrator from MySQL"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                    Enroll Executive Administrator (MySQL DB)
                  </h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Administrator Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Kavita Subramanian"
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
                      placeholder="admin@health.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Access Level</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98407 89012"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Password</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin@123"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
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
                    Enroll Administrator in MySQL
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

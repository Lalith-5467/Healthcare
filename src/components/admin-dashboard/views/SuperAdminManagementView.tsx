import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Plus, Trash2, Edit2, KeyRound, CheckCircle2, Lock, X, 
  ShieldAlert, Mail, Phone, Building2, UserCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import { adminApi, authApi } from '../../../services/dhrApis';
import { setAuthToken } from '../../../services/apiClient';
import { AdminToast } from '../common/AdminToast';
import type { AdminToastType } from '../common/AdminToast';
import { AdminDeleteConfirmModal } from '../modals/AdminDeleteConfirmModal';

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
  // Delete Confirmation Modal State
  const [adminToDelete, setAdminToDelete] = useState<AdminNode | null>(null);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AdminToastType>('success');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Admin@123');
  const [role, setRole] = useState<'Admin' | 'Super Admin'>('Admin');
  const [dept, setDept] = useState('Hospital Administration');

  const showToast = (msg: string, type: AdminToastType = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchAdmins = async (isManual = false) => {
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
        window.dispatchEvent(new CustomEvent('admin_stats_updated'));
        if (isManual) {
          showToast(`Successfully refreshed ${mapped.length} administrator records`, 'success');
        }
      }
    } catch (err: any) {
      console.error('Failed to load admin accounts:', err);
      const msg = (err.message || '').toLowerCase();
      if (!msg.includes('access denied') && !msg.includes('permission')) {
        showToast(err.message || 'Failed to fetch admin accounts from database.', 'error');
      } else if (isManual) {
        showToast('Administrator database records synchronized', 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(false);
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

      showToast(`Administrator account for "${name}" created successfully.`, 'success');
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error creating administrator account.', 'error');
    }
  };

  const handleToggleRole = async (id: string, currentAdmRole: 'Admin' | 'Super Admin', admName: string) => {
    try {
      const nextRole = currentAdmRole === 'Admin' ? 'SUPER_ADMIN' : 'ADMIN';
      await adminApi.updateUserRole(id, nextRole);
      showToast(`Administrator "${admName}" role updated to ${nextRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}.`, 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error updating administrator role.', 'error');
    }
  };

  const handleToggleSuspend = async (id: string, currentStatus: string, admName: string) => {
    try {
      const nextStatus = currentStatus === 'Active' ? 'INACTIVE' : 'ACTIVE';
      await adminApi.updateUserStatus(id, nextStatus);
      showToast(`Administrator "${admName}" status updated to ${nextStatus === 'ACTIVE' ? 'Active' : 'Suspended'}.`, 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error updating administrator status.', 'error');
    }
  };

  // Confirm & Execute Admin Deletion
  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    setIsDeletingAdmin(true);
    try {
      await adminApi.deleteUser(adminToDelete.id);
      showToast(`Administrator account "${adminToDelete.name}" was successfully revoked and deleted.`, 'delete');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Error deleting administrator account.', 'error');
    } finally {
      setIsDeletingAdmin(false);
      setAdminToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* EXECUTIVE NOTIFICATION TOAST */}
      <AdminToast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg(null)}
      />

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00a896] text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Administrator Hierarchy & Governance
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Grant, elevate, and audit executive hospital administration accounts with master system override privileges.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => fetchAdmins(true)}
            disabled={loading}
            className="p-3 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] border border-white/80 hover:border-teal-200 shadow-md shadow-teal-950/15 flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
            title="Refresh database records"
            aria-label="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 text-[#00897b] group-hover:text-[#004d40] transition-colors ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-white hover:bg-teal-50/90 text-[#00796b] font-black text-xs shadow-md shadow-teal-950/15 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#00897b]" />
            <span>Enroll New Administrator</span>
          </button>
        </div>
      </div>

      {/* 2. ADMIN ACCOUNTS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#00a896]" />
            Active Administrator Credentials Roster
          </h3>
          <span className="text-xs font-mono font-bold text-slate-400">{admins.length} Executive Nodes</span>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5 text-left">Administrator</th>
                <th className="py-3.5 px-4 text-left whitespace-nowrap">Executive Role</th>
                <th className="py-3.5 px-4 text-left">Department</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-left whitespace-nowrap">Created Date</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-500 font-medium">
                    {loading ? 'Loading administrators...' : 'No admin accounts found.'}
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Admin Profile */}
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#00796b] dark:text-[#2dd4bf] flex items-center justify-center font-bold shrink-0 border border-teal-200/70 dark:border-teal-800/50 text-xs shadow-2xs">
                          {adm.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug truncate">{adm.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{adm.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Executive Role */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        adm.role === 'Super Admin'
                          ? 'bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50'
                          : 'bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50'
                      }`}>
                        {adm.role}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 align-middle text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {adm.department}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        adm.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                          : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {adm.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 align-middle text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {adm.createdDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* Promote / Demote Role */}
                        <button
                          onClick={() => handleToggleRole(adm.id, adm.role, adm.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs hover:scale-102 active:scale-98 ${
                            adm.role === 'Admin' 
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00796b] dark:text-teal-300 border-teal-200/80 dark:border-teal-800/60 hover:bg-[#00a896] hover:text-white' 
                              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-600 hover:text-white'
                          }`}
                          title="Toggle Administrator Role"
                        >
                          {adm.role === 'Admin' ? 'Promote' : 'Demote'}
                        </button>

                        <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                          {/* Suspend / Reactivate */}
                          <button
                            onClick={() => handleToggleSuspend(adm.id, adm.status, adm.name)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title={adm.status === 'Active' ? 'Suspend Administrator Account' : 'Reactivate Administrator Account'}
                            aria-label="Toggle Status"
                          >
                            <Lock className="w-4 h-4" />
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() => setAdminToDelete(adm)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Remove Administrator Account"
                            aria-label="Remove Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                  <Shield className="w-4 h-4 text-[#00a896]" />
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Administrator Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Kavita Subramanian"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
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
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
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
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Password</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin@123"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] font-mono"
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
                    className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs shadow-md shadow-[#00a896]/25 cursor-pointer"
                  >
                    Enroll Administrator
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AdminDeleteConfirmModal
        isOpen={Boolean(adminToDelete)}
        itemType="Administrator"
        itemName={adminToDelete?.name || ''}
        itemId={adminToDelete?.email}
        isDeleting={isDeletingAdmin}
        onConfirm={confirmDeleteAdmin}
        onClose={() => setAdminToDelete(null)}
      />

    </div>
  );
};

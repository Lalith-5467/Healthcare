import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, 
  XCircle, Lock, KeyRound, Shield, Eye, MoreVertical, X, Check,
  Mail, Phone, Building2, Calendar, ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import { adminApi, authApi } from '../../../services/dhrApis';
import { setAuthToken } from '../../../services/apiClient';
import { AdminAddUserModal } from '../modals/AdminAddUserModal';

export interface DbUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  rawRole: string;
  department: string;
  status: 'Active' | 'Inactive';
  abhaId?: string | null;
  lastLogin: string;
  createdDate: string;
}

const roleMapToDisplay: Record<string, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  PHARMACIST: 'Pharmacist',
  CAREGIVER: 'Caregiver',
  INSURANCE_PROVIDER: 'Insurance',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};

const displayToRoleMap: Record<string, string> = {
  'Patient': 'PATIENT',
  'Doctor': 'DOCTOR',
  'Nurse': 'NURSE',
  'Pharmacist': 'PHARMACIST',
  'Caregiver': 'CAREGIVER',
  'Insurance': 'INSURANCE_PROVIDER',
  'Insurance / TPA': 'INSURANCE_PROVIDER',
  'Admin': 'ADMIN',
  'Super Admin': 'SUPER_ADMIN',
};

export const AdminUserManagementView: React.FC = () => {
  const [users, setUsers] = useState<DbUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DbUserItem | null>(null);
  
  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Form States - Edit
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('Patient');
  const [editAbhaId, setEditAbhaId] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch real users from backend MySQL
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });

      if (res && res.data) {
        const rawUsers: any[] = Array.isArray(res.data) ? res.data : (res.data as any).users || [];
        const mapped: DbUserItem[] = rawUsers.map((u: any) => {
          const profile = u.profile || u.patient || u.doctor || u.nurse || u.pharmacist || u.caregiver || u.insuranceProvider || {};
          const name = profile.fullName || profile.providerName || u.email.split('@')[0];
          const dept = u.role === 'DOCTOR' ? (profile.speciality || 'Clinical Doctor') :
                       u.role === 'NURSE' ? (profile.department || 'Inpatient Telemetry') :
                       u.role === 'PHARMACIST' ? (profile.pharmacyName || 'Central Pharmacy') :
                       u.role === 'ADMIN' ? 'Hospital Governance' :
                       u.role === 'SUPER_ADMIN' ? 'System Directorate' :
                       u.role === 'INSURANCE_PROVIDER' ? 'Claims & TPA' :
                       u.role === 'CAREGIVER' ? 'Family Care' : 'General OPD';

          return {
            id: u.id,
            name,
            email: u.email,
            phone: u.phone || u.phoneNumber || '+91 98400 00000',
            role: roleMapToDisplay[u.role] || u.role,
            rawRole: u.role,
            department: dept,
            status: u.status === 'ACTIVE' || u.isActive ? 'Active' : 'Inactive',
            abhaId: u.abhaId || null,
            lastLogin: 'Active session',
            createdDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Sep 2026',
          };
        });
        setUsers(mapped);
      }
    } catch (err: any) {
      console.error('Failed to load users:', err);
      // Silently handle permission errors – don't show a toast for access-denied
      const msg = (err.message || '').toLowerCase();
      if (!msg.includes('access denied') && !msg.includes('permission')) {
        showToast(err.message || 'Failed to sync users with database.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Open Edit Modal
  const openEditModal = (u: DbUserItem) => {
    setEditId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone);
    setEditRole(u.role);
    setEditAbhaId(u.abhaId || '');
    setEditStatus(u.status);
    setIsEditModalOpen(true);
  };

  // 3. Save Edited User in MySQL
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dbRole = displayToRoleMap[editRole] || 'PATIENT';
      await adminApi.updateUser(editId, {
        fullName: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phoneNumber: editPhone.trim() || undefined,
        role: dbRole,
        abhaId: editAbhaId.trim() || undefined,
        status: editStatus === 'Active',
      });

      showToast(`User ${editName} updated in MySQL database & phpMyAdmin.`, 'success');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error updating user in MySQL.', 'error');
    }
  };

  // 4. Toggle Status in MySQL
  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'INACTIVE' : 'ACTIVE';
      await adminApi.updateUserStatus(id, newStatus);
      showToast(`User ${name} status updated to ${newStatus} in MySQL.`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error updating status.', 'error');
    }
  };

  // 5. Delete User in MySQL
  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}" from MySQL database?`)) {
      return;
    }
    try {
      await adminApi.deleteUser(id);
      showToast(`User ${name} permanently deleted from MySQL database.`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error deleting user from MySQL.', 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.abhaId && u.abhaId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
            <Users className="w-3.5 h-3.5" /> Identity & Access Governance (Live MySQL DB)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Universal User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Direct real-time MySQL database editor. All additions, edits, and status toggles update MySQL database & phpMyAdmin immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={fetchUsers}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 shadow-md flex items-center gap-2 cursor-pointer transition-all"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User Account</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, ABHA, or ID..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Roles (Any)</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Insurance">Insurance</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* 3. USER ACCOUNTS TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-4 px-5">User Profile</th>
                <th className="py-4 px-4">Role & ABHA</th>
                <th className="py-4 px-4">Phone Number</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Created Date</th>
                <th className="py-4 px-5 text-right">Actions (Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {loading ? 'Loading database users...' : 'No users found in database matching criteria.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* User Profile */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-black shrink-0 border border-blue-500/20 text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & ABHA */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                          u.role === 'Super Admin' || u.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : u.role === 'Doctor'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : u.role === 'Nurse'
                            ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'
                            : u.role === 'Pharmacist'
                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}>
                          {u.role}
                        </span>
                        {u.abhaId && (
                          <p className="text-[10px] font-mono text-teal-600 dark:text-teal-400">{u.abhaId}</p>
                        )}
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {u.phone}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {u.createdDate}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-cyan-400 transition-colors cursor-pointer"
                          title="Edit User in MySQL"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                          title="View User Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status, u.name)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}
                          title={u.status === 'Active' ? 'Deactivate User in MySQL' : 'Activate User in MySQL'}
                        >
                          {u.status === 'Active' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          title="Delete User from MySQL"
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

      {/* ROLE-AWARE ADD USER MODAL */}
      <AdminAddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserCreated={fetchUsers}
        showToast={showToast}
      />

      {/* EDIT USER MODAL (DIRECT MYSQL UPDATE) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Edit User Record (Direct MySQL Sync)
                  </h3>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">System Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Patient">Patient</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Caregiver">Caregiver</option>
                      <option value="Insurance">Insurance / TPA</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ABHA ID</label>
                  <input
                    type="text"
                    value={editAbhaId}
                    onChange={(e) => setEditAbhaId(e.target.value)}
                    placeholder="e.g. 91-8472-9104-5821"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                  >
                    Save Changes to MySQL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {isViewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsViewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-slate-400">Account ID: {selectedUser.id}</span>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-black text-xl border border-blue-500/20">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Role:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedUser.role}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ABHA Health ID:</span>
                  <span className="font-mono text-teal-600 font-bold">{selectedUser.abhaId || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Phone:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedUser.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Status:</span>
                  <span className={`font-bold ${selectedUser.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedUser.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered On:</span>
                  <span className="font-mono text-slate-400">{selectedUser.createdDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(selectedUser);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer text-center transition-colors"
                >
                  Edit This User
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

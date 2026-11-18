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
import { 
  getStoredHospitals, 
  type HospitalAdminRecord 
} from '../../../utils/adminMockStorage';
import { AdminToast } from '../common/AdminToast';
import type { AdminToastType } from '../common/AdminToast';
import { AdminDeleteConfirmModal } from '../modals/AdminDeleteConfirmModal';

export interface DbUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  rawRole: string;
  department: string;
  hospital?: string;
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
  const [hospitalFilter, setHospitalFilter] = useState<string>('All');
  const [availableHospitals, setAvailableHospitals] = useState<HospitalAdminRecord[]>([]);

  useEffect(() => {
    setAvailableHospitals(getStoredHospitals());
    const handleHospUpdate = () => setAvailableHospitals(getStoredHospitals());
    window.addEventListener('admin_hospitals_updated', handleHospUpdate);
    return () => window.removeEventListener('admin_hospitals_updated', handleHospUpdate);
  }, []);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DbUserItem | null>(null);
  
  // Form States - Edit
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('Patient');
  const [editAbhaId, setEditAbhaId] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editPassword, setEditPassword] = useState('');

  // Delete Confirmation Modal State
  const [userToDelete, setUserToDelete] = useState<DbUserItem | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AdminToastType>('success');

  const showToast = (msg: string, type: AdminToastType = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Fetch real users from backend
  const fetchUsers = async (isManual = false) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });

      let rawUsers: any[] = [];
      if (res && res.data) {
        rawUsers = Array.isArray(res.data) ? res.data : (res.data as any).users || [];
      }

      if (rawUsers && rawUsers.length > 0) {
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

          const hosp = profile.hospital || 'MediCare Central Hospital';

          return {
            id: u.id,
            name,
            email: u.email,
            phone: u.phone || u.phoneNumber || '+91 98400 00000',
            role: roleMapToDisplay[u.role] || u.role,
            rawRole: u.role,
            department: dept,
            hospital: hosp,
            status: u.status === 'ACTIVE' || u.isActive ? 'Active' : 'Inactive',
            abhaId: u.abhaId || null,
            lastLogin: 'Active session',
            createdDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Sep 2026',
          };
        });
        setUsers(mapped);
        window.dispatchEvent(new CustomEvent('admin_stats_updated'));
        if (isManual) {
          showToast(`Successfully refreshed ${mapped.length} user records from database`, 'success');
        }
      } else {
        setUsers([]);
        if (isManual) {
          showToast('No registered user records found', 'info');
        }
      }
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setUsers([]);
      if (isManual) {
        showToast('Failed to load users from database', 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
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
    setEditPassword('');
    setIsEditModalOpen(true);
  };

  // 3. Save Edited User
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
        password: editPassword.trim() || undefined,
      });

      showToast(`User "${editName}" updated successfully.`, 'success');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error updating user record.', 'error');
    }
  };

  // Reset Password Action
  const handleResetPassword = async (id: string, name: string) => {
    const newPass = window.prompt(`Enter new password for ${name}:`, 'Password@123');
    if (!newPass) return;
    try {
      await adminApi.resetPassword(id, newPass);
      showToast(`Password for "${name}" reset successfully.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error resetting password.', 'error');
    }
  };

  // 4. Toggle Status
  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'INACTIVE' : 'ACTIVE';
      await adminApi.updateUserStatus(id, newStatus);
      showToast(`User "${name}" status updated to ${newStatus}.`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error updating status.', 'error');
    }
  };

  // 5. Confirm & Execute User Deletion
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      await adminApi.deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(item => item.id !== userToDelete.id));
      showToast(`User "${userToDelete.name}" was successfully deleted.`, 'delete');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error deleting user record.', 'error');
    } finally {
      setIsDeletingUser(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.abhaId && u.abhaId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesHospital = hospitalFilter === 'All' || u.hospital === hospitalFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesHospital;
  });

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
            Universal User Management
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Centralized hospital directory & access governance. Manage user accounts, credential security, role elevation, and live status.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-xl bg-black/20 text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md shadow-xs">
            {users.length} Registered Users
          </span>
          <button
            onClick={() => fetchUsers(true)}
            disabled={loading}
            className="p-3 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] border border-white/80 hover:border-teal-200 shadow-md shadow-teal-950/15 flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
            title="Refresh user records"
            aria-label="Refresh user records"
          >
            <RefreshCw className={`w-4 h-4 text-[#00897b] group-hover:text-[#004d40] transition-colors ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-white hover:bg-teal-50/90 text-[#00796b] font-black text-xs shadow-md shadow-teal-950/15 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#00897b]" />
            <span>Add New User Account</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, ABHA, or ID..."
              className="w-full h-9.5 pl-9.5 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
            />
          </div>
          <span className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 whitespace-nowrap">
            {filteredUsers.length} of {users.length} Users
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Hospital Scope Filter */}
          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 cursor-pointer transition-all"
          >
            <option value="All">All Hospitals ({availableHospitals.length})</option>
            {availableHospitals.map((hosp) => (
              <option key={hosp.id} value={hosp.name}>
                {hosp.name}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 cursor-pointer transition-all"
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
            className="h-9.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 cursor-pointer transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* 3. USER ACCOUNTS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-5 text-left">User Profile</th>
                <th className="py-3.5 px-4 text-left whitespace-nowrap">Role & ABHA</th>
                <th className="py-3.5 px-4 text-left whitespace-nowrap">Phone Number</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-left whitespace-nowrap">Created Date</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-500 font-medium">
                    {loading ? 'Loading database users...' : 'No users found in database matching criteria.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* User Profile */}
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#00796b] dark:text-[#2dd4bf] flex items-center justify-center font-bold shrink-0 border border-teal-200/70 dark:border-teal-800/50 text-xs shadow-2xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & ABHA */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          u.role === 'Super Admin' || u.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50'
                            : u.role === 'Doctor'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
                            : u.role === 'Nurse'
                            ? 'bg-pink-50 text-pink-700 border-pink-200/70 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/50'
                            : u.role === 'Pharmacist'
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/50'
                            : 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50'
                        }`}>
                          {u.role}
                        </span>
                        {u.abhaId && (
                          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium tracking-tight">{u.abhaId}</p>
                        )}
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="py-3.5 px-4 align-middle text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-normal whitespace-nowrap">
                      {u.phone || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                          : 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {u.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 align-middle text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {u.createdDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#00796b] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 hover:bg-[#00a896] hover:text-white hover:border-[#00a896] hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Edit User record"
                          aria-label="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Password Reset Button */}
                        <button
                          onClick={() => handleResetPassword(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Reset User Password"
                          aria-label="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-600 hover:text-white hover:border-sky-600 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="View User Details"
                          aria-label="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status, u.name)}
                          className={`p-1.5 rounded-lg border hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                            u.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-700 hover:text-white'
                          }`}
                          title={u.status === 'Active' ? 'Deactivate User Account' : 'Activate User Account'}
                          aria-label="Toggle Status"
                        >
                          {u.status === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Delete User record"
                          aria-label="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* EDIT USER MODAL */}
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
                    Edit User Record
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

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Set New Password (Leave blank to keep existing)</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="New password (optional)"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
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
                    className="px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs shadow-md shadow-[#00a896]/25 cursor-pointer"
                  >
                    Save Changes
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
                <div className="w-14 h-14 rounded-2xl bg-[#00a896]/10 text-[#00a896] dark:text-[#2dd4bf] flex items-center justify-center font-black text-xl border border-[#00a896]/20">
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
                  className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-bold text-xs cursor-pointer text-center transition-colors"
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

      {/* DELETE CONFIRMATION MODAL */}
      <AdminDeleteConfirmModal
        isOpen={Boolean(userToDelete)}
        itemType="User"
        itemName={userToDelete?.name || ''}
        itemId={userToDelete?.email}
        isDeleting={isDeletingUser}
        onConfirm={confirmDeleteUser}
        onClose={() => setUserToDelete(null)}
      />

    </div>
  );
};

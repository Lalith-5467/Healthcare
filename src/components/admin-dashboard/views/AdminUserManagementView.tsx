import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, 
  XCircle, Lock, KeyRound, Shield, Eye, MoreVertical, X, Check,
  Mail, Phone, Building2, Calendar, ShieldCheck
} from 'lucide-react';
import { INITIAL_ADMIN_USERS, type AdminUser } from '../../../utils/adminMockStorage';

export const AdminUserManagementView: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('Patient');
  const [newDept, setNewDept] = useState('General OPD');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUser = {
      id: `USR-${1000 + users.length + 1}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+91 98400 00000',
      role: newRole,
      department: newDept,
      status: 'Active',
      lastLogin: 'Never logged in',
      createdDate: '01 Sep 2026'
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    showToast(`User ${newUser.name} created successfully.`);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`User ${u.name} is now marked ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers(users.filter(u => u.id !== id));
    showToast(`User ${name} removed from registry.`);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
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
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 font-mono">
            <Users className="w-3.5 h-3.5" /> Identity & Access Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Universal User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Directory of all registered accounts across Patients, Doctors, Nurses, Pharmacists, Caregivers, Insurance TPAs, and Administrators.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
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
            placeholder="Search by name, email, or User ID..."
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
            <option value="Suspended">Suspended</option>
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
                <th className="py-4 px-4">Role & Domain</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Activity</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  
                  {/* User Profile */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-black shrink-0 border border-blue-500/20 text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-xs">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{u.email} • {u.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4">
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
                  </td>

                  {/* Department */}
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {u.department}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                      u.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : u.status === 'Inactive'
                        ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  {/* Last Activity */}
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                    {u.lastLogin}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
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

                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          u.status === 'Active'
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        }`}
                        title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.status === 'Active' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Remove User"
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

      {/* ADD USER MODAL */}
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
                  <Plus className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Provision New User Account
                  </h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. K. Soundararajan"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="user@hospital.in"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">System Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
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
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                    <input
                      type="text"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      placeholder="e.g. Cardiology OPD"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                  >
                    Provision Account
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
                  {selectedUser.name.charAt(0)}
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
                  <span className="text-slate-500">Department:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedUser.department}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Phone:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedUser.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Status:</span>
                  <span className="text-emerald-600 font-bold">{selectedUser.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Date:</span>
                  <span className="font-mono text-slate-400">{selectedUser.createdDate}</span>
                </div>
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs cursor-pointer text-center"
              >
                Close Profile Inspection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

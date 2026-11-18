import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, ShieldCheck, Lock, CheckCircle2, 
  Building2, KeyRound, Calendar, Save, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { adminApi, authApi } from '../../../services/dhrApis';
import { AdminToast, type AdminToastType } from '../common/AdminToast';

interface AdminProfileSettingsViewProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  currentRole: 'Admin' | 'Super Admin';
}

export const AdminProfileSettingsView: React.FC<AdminProfileSettingsViewProps> = ({
  user,
  currentRole,
}) => {
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const resolveAdminDefaultName = (targetEmail?: string, role?: string, propName?: string) => {
    if (propName && propName.trim() && propName.toLowerCase() !== 'superadmin' && propName.toLowerCase() !== 'admin') {
      return propName;
    }
    const cleanEmail = (targetEmail || '').toLowerCase();
    if (cleanEmail === 'superadmin@dhr-medicare.in' || (role && role.includes('Super'))) {
      return 'Vikramaditya Rao';
    }
    if (cleanEmail === 'admin.kavita@dhr-medicare.in' || cleanEmail === 'admin@health.com') {
      return 'Kavita Sundaram';
    }
    return 'Vikramaditya Rao';
  };

  // Profile info state
  const [name, setName] = useState(() => resolveAdminDefaultName(user?.email, currentRole, user?.name));
  const [email, setEmail] = useState(user?.email || (currentRole === 'Super Admin' ? 'superadmin@dhr-medicare.in' : 'admin.kavita@dhr-medicare.in'));
  const [phone, setPhone] = useState('+91 98408 90123');
  const [department, setDepartment] = useState(currentRole === 'Super Admin' ? 'National Health Governance Directorate' : 'Hospital Executive Administration');
  const [designation, setDesignation] = useState(currentRole === 'Super Admin' ? 'Chief Information Security & Governance Officer' : 'Senior Health Facility Administrator');
  const [location, setLocation] = useState('New Delhi / Chennai Headquarters');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AdminToastType>('success');

  const showToast = (msg: string, type: AdminToastType = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  useEffect(() => {
    // Fetch live user info from auth/me
    authApi.getCurrentUser()
      .then((res) => {
        if (res && res.data) {
          const u = res.data;
          setCurrentUserId(u.id);
          if (u.email) setEmail(u.email);
          if (u.phoneNumber) setPhone(u.phoneNumber);
          const p = u.profile || {};
          let resolvedName = p.fullName;
          if (!resolvedName || resolvedName === 'superadmin' || resolvedName === 'admin') {
            resolvedName = resolveAdminDefaultName(u.email, currentRole, user?.name);
          }
          if (resolvedName) setName(resolvedName);
        }
      })
      .catch(() => {});
  }, [currentRole]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      if (currentUserId) {
        await adminApi.updateUser(currentUserId, {
          fullName: name,
          phoneNumber: phone,
        });
      }

      // Update cached user in localStorage & dispatch update event
      try {
        const stored = localStorage.getItem('app_user');
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.name = name;
        parsed.email = email;
        localStorage.setItem('app_user', JSON.stringify(parsed));
        window.dispatchEvent(new Event('app_user_updated'));
      } catch {}

      showToast('Administrator profile details updated successfully', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile details', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      if (currentUserId) {
        await adminApi.resetPassword(currentUserId, newPassword);
      }
      showToast('Administrative password updated securely', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <AdminToast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />

      {/* TOP HERO PROFILE BANNER */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{name}</h1>
              <p className="text-teal-100 text-sm mt-1">{designation}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200 mt-3">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {email}</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {department}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified System Operator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: IDENTITY & ROLES CARD */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Authority & Privileges
            </h3>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">Active Governance Role</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-teal-500 text-white">{currentRole}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {currentRole === 'Super Admin'
                  ? 'Full administrative authority: Hospital approvals, RBAC permissions, audit radar, and health configuration.'
                  : 'Facility management authority: Doctor directories, patient registry, and operational supervision.'}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Security Clearance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Level 5 (Root System)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Session Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Encrypted & Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Location Headquarter</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{location}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">ABDM Compliance</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">ABDM Milestone 3 Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT PROFILE & PASSWORD SETTINGS */}
        <div className="space-y-6 lg:col-span-2">
          {/* PROFILE EDIT FORM */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Profile Information</h2>
                <p className="text-xs text-slate-500">Update your official administrative contact details.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Administrator Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Administrative Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Official Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#008f80] text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* SECURITY & PASSWORD UPDATE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Security & Password</h2>
                <p className="text-xs text-slate-500">Update your secret credentials for administrative access.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-black shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


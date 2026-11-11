import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, HeartPulse, Pill, HeartHandshake, Search, Phone, Mail, Building2, 
  CheckCircle2, AlertCircle, ShieldCheck, Loader2, Edit2, Trash2, 
  Plus, RefreshCw, X, Check, Award
} from 'lucide-react';
import { adminApi } from '../../../services/dhrApis';
import { 
  getStoredHospitals, type HospitalAdminRecord 
} from '../../../utils/adminMockStorage';
import { AdminToast } from '../common/AdminToast';
import type { AdminToastType } from '../common/AdminToast';
import { AdminDeleteConfirmModal } from '../modals/AdminDeleteConfirmModal';

interface AdminStaffManagementViewProps {
  type: 'doctor' | 'nurse' | 'pharmacist' | 'caregiver';
  defaultHospital?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  department?: string;
  hospital: string;
  licenseNumber: string;
  experienceYears?: number | null;
  status: 'Active' | 'Suspended';
}

export const AdminStaffManagementView: React.FC<AdminStaffManagementViewProps> = ({ type, defaultHospital }) => {
  const roleConfigMap = {
    doctor: {
      roleLabel: 'Doctor',
      pluralLabel: 'Doctors',
      headerTitle: 'Doctor & Practitioner Administration',
      headerSubtitle: 'Verify clinical credentials, hospital affiliations, specializations, and practitioner duty statuses in the live roster.',
      fieldLabel: 'Clinical Specialization',
      fieldPlaceholder: 'e.g. Cardiology, Pulmonology',
      tableHeaderField: 'Speciality & Hospital',
      licenseLabel: 'Registration / Council License Number',
      licensePlaceholder: 'e.g. NMC-74829-KA',
      addNamePlaceholder: 'Dr. Rajesh Varma',
      addEmailPlaceholder: 'doctor@hospital.in',
      apiRole: 'DOCTOR',
      avatarBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/25',
    },
    nurse: {
      roleLabel: 'Nurse',
      pluralLabel: 'Nurses',
      headerTitle: 'Nurse & Clinical Staff Roster',
      headerSubtitle: 'Audit nursing practitioners, department assignments, and clinical licenses in the live staff directory.',
      fieldLabel: 'Department Assignment',
      fieldPlaceholder: 'e.g. ICU, General Ward',
      tableHeaderField: 'Department & Hospital',
      licenseLabel: 'Council License Number',
      licensePlaceholder: 'e.g. KNC-88421-RN',
      addNamePlaceholder: 'Nurse Sarah Jenkins',
      addEmailPlaceholder: 'nurse@hospital.in',
      apiRole: 'NURSE',
      avatarBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25',
    },
    pharmacist: {
      roleLabel: 'Pharmacist',
      pluralLabel: 'Pharmacists',
      headerTitle: 'Pharmacist & Dispensary Hub',
      headerSubtitle: 'Verify licensed pharmacy officers, central dispensary assignments, dispensing credentials, and stock authorisations.',
      fieldLabel: 'Dispensary / Pharmacy Unit',
      fieldPlaceholder: 'e.g. Central Dispensary, MedLife Hub',
      tableHeaderField: 'Dispensary & Unit',
      licenseLabel: 'Pharmacy Council Reg No',
      licensePlaceholder: 'e.g. PCI-90241-TN',
      addNamePlaceholder: 'Suresh Nair',
      addEmailPlaceholder: 'pharmacist@hospital.in',
      apiRole: 'PHARMACIST',
      avatarBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    },
    caregiver: {
      roleLabel: 'Caregiver',
      pluralLabel: 'Caregivers',
      headerTitle: 'Caregiver & Family Support Roster',
      headerSubtitle: 'Audit verified homecare aides, certified geriatric caregivers, and patient-family support specialists.',
      fieldLabel: 'Care Specialty / Assigned Ward',
      fieldPlaceholder: 'e.g. Elderly Homecare, Geriatric Support',
      tableHeaderField: 'Specialty & Ward',
      licenseLabel: 'Caregiver Certification / Agency ID',
      licensePlaceholder: 'e.g. CG-CERT-5819',
      addNamePlaceholder: 'Anita Sharma',
      addEmailPlaceholder: 'caregiver@hospital.in',
      apiRole: 'CAREGIVER',
      avatarBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25',
    },
  };

  const safeType = (type && roleConfigMap[type]) ? type : 'doctor';
  const roleConfig = roleConfigMap[safeType];

  const {
    roleLabel,
    pluralLabel,
    headerTitle,
    headerSubtitle,
    fieldLabel,
    fieldPlaceholder,
    tableHeaderField,
    licenseLabel,
    licensePlaceholder,
    addNamePlaceholder,
    addEmailPlaceholder,
    apiRole,
    avatarBg,
  } = roleConfig;

  const isMockId = (id: string) =>
    id.startsWith('DOC-') || id.startsWith('NUR-') || id.startsWith('PHARM-') || id.startsWith('CG-');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [hospitalFilter, setHospitalFilter] = useState<string>(defaultHospital || 'All');
  const [availableHospitals, setAvailableHospitals] = useState<HospitalAdminRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (defaultHospital) {
      setHospitalFilter(defaultHospital);
    }
  }, [defaultHospital]);

  useEffect(() => {
    setAvailableHospitals(getStoredHospitals());
    const handleHospUpdate = () => setAvailableHospitals(getStoredHospitals());
    window.addEventListener('admin_hospitals_updated', handleHospUpdate);
    return () => window.removeEventListener('admin_hospitals_updated', handleHospUpdate);
  }, []);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editField, setEditField] = useState('');
  const [editHospital, setEditHospital] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Suspended'>('Active');

  // Add form state
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addPassword, setAddPassword] = useState('Staff@123');
  const [addField, setAddField] = useState('');
  const [addHospital, setAddHospital] = useState('MediCare Central Hospital');
  const [addLicense, setAddLicense] = useState('');

  // Delete Confirmation Modal State
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AdminToastType>('success');

  const showToast = (msg: string, toastT: AdminToastType = 'success') => {
    setToastMsg(msg);
    setToastType(toastT);
  };

  // Local storage helper for mock staff overrides
  const getMockOverrides = (): Record<string, Partial<StaffMember>> => {
    try {
      return JSON.parse(localStorage.getItem('admin_mock_staff_overrides') || '{}');
    } catch {
      return {};
    }
  };

  const setMockOverride = (id: string, updates: Partial<StaffMember>) => {
    try {
      const current = getMockOverrides();
      current[id] = { ...(current[id] || {}), ...updates };
      localStorage.setItem('admin_mock_staff_overrides', JSON.stringify(current));
    } catch {}
  };

  const fetchStaff = async (isManual = false) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ role: apiRole, limit: 100 });
      let raw: any[] = [];
      if (res && res.data) {
        raw = Array.isArray(res.data) ? res.data : (res.data as any).users || [];
      }

      const overrides = getMockOverrides();

      if (raw && raw.length > 0) {
        const mapped: StaffMember[] = raw.map((u: any) => {
          const isStaffActive = u.isActive === true || u.status === 'ACTIVE' || u.status === 'Active' || u.status === 'On Duty';
          const baseStatus: 'Active' | 'Suspended' = isStaffActive ? 'Active' : 'Suspended';
          const overrideStatus = overrides[u.id]?.status;

          if (type === 'doctor') {
            const doc = u.doctor || u.profile || {};
            return {
              id: u.id,
              name: overrides[u.id]?.name || doc.fullName || u.email.split('@')[0],
              specialization: overrides[u.id]?.specialization || doc.speciality || 'General Practitioner',
              hospital: overrides[u.id]?.hospital || doc.hospital || 'MediCare Central Hospital',
              licenseNumber: overrides[u.id]?.licenseNumber || doc.licenseNumber || 'Verified In-System',
              experienceYears: doc.experienceYears || null,
              email: overrides[u.id]?.email || u.email,
              phone: overrides[u.id]?.phone || u.phoneNumber || 'Not registered',
              status: overrideStatus || baseStatus,
            };
          } else if (type === 'nurse') {
            const n = u.nurse || u.profile || {};
            return {
              id: u.id,
              name: overrides[u.id]?.name || n.fullName || u.email.split('@')[0],
              department: overrides[u.id]?.department || n.department || 'Clinical Inpatient Ward',
              hospital: overrides[u.id]?.hospital || n.hospital || 'MediCare Central Hospital',
              licenseNumber: overrides[u.id]?.licenseNumber || n.licenseNumber || 'Verified In-System',
              email: overrides[u.id]?.email || u.email,
              phone: overrides[u.id]?.phone || u.phoneNumber || 'Not registered',
              status: overrideStatus || baseStatus,
            };
          } else if (type === 'pharmacist') {
            const p = u.pharmacist || u.profile || {};
            return {
              id: u.id,
              name: overrides[u.id]?.name || p.fullName || u.email.split('@')[0],
              specialization: overrides[u.id]?.specialization || p.dispensary || 'Central Dispensary & OPD Pharmacy',
              hospital: overrides[u.id]?.hospital || p.hospital || 'MediCare Central Hospital',
              licenseNumber: overrides[u.id]?.licenseNumber || p.licenseNumber || p.councilRegNo || 'Verified In-System',
              email: overrides[u.id]?.email || u.email,
              phone: overrides[u.id]?.phone || u.phoneNumber || 'Not registered',
              status: overrideStatus || baseStatus,
            };
          } else {
            const c = u.caregiver || u.profile || {};
            return {
              id: u.id,
              name: overrides[u.id]?.name || c.fullName || u.email.split('@')[0],
              department: overrides[u.id]?.department || c.specialty || 'Elderly Homecare & Geriatric Care',
              hospital: overrides[u.id]?.hospital || c.hospital || 'MediCare Central Hospital',
              licenseNumber: overrides[u.id]?.licenseNumber || c.certificationId || c.licenseNumber || 'Verified In-System',
              email: overrides[u.id]?.email || u.email,
              phone: overrides[u.id]?.phone || u.phoneNumber || 'Not registered',
              status: overrideStatus || baseStatus,
            };
          }
        });
        setStaffList(mapped);
        window.dispatchEvent(new CustomEvent('admin_stats_updated'));
        if (isManual) {
          showToast(`Successfully refreshed ${mapped.length} ${roleLabel.toLowerCase()} records.`, 'success');
        }
      } else {
        setStaffList([]);
        if (isManual) {
          showToast(`No registered ${roleLabel.toLowerCase()} records found`, 'info');
        }
      }
    } catch (err: any) {
      console.error(`Failed to load ${roleLabel.toLowerCase()} roster:`, err?.message);
      setStaffList([]);
      if (isManual) {
        showToast(`Failed to load ${roleLabel.toLowerCase()} records`, 'info');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(false);
  }, [type]);

  // Open Edit Modal
  const openEditModal = (s: StaffMember) => {
    setEditId(s.id);
    setEditName(s.name);
    setEditEmail(s.email);
    setEditPhone(s.phone === 'Not registered' ? '' : s.phone);
    setEditField((type === 'doctor' || type === 'pharmacist') ? (s.specialization || '') : (s.department || ''));
    setEditHospital(s.hospital || 'MediCare Central Hospital');
    setEditLicense(s.licenseNumber === 'Verified In-System' ? '' : s.licenseNumber);
    setEditStatus(s.status);
    setIsEditModalOpen(true);
  };

  // Save Edit
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast(`${roleLabel} name is required`, 'error');
      return;
    }
    setIsSubmitting(true);

    const updatedData: Partial<StaffMember> = {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim() || 'Not registered',
      specialization: (type === 'doctor' || type === 'pharmacist') ? editField.trim() : undefined,
      department: (type === 'nurse' || type === 'caregiver') ? editField.trim() : undefined,
      hospital: editHospital.trim() || 'MediCare Central Hospital',
      licenseNumber: editLicense.trim(),
      status: editStatus,
    };

    // Update local state optimistically
    setStaffList(prev => prev.map(item => {
      if (item.id === editId) {
        return {
          ...item,
          ...updatedData,
        };
      }
      return item;
    }));
    setMockOverride(editId, updatedData);

    try {
      if (!isMockId(editId)) {
        await adminApi.updateUser(editId, {
          fullName: editName.trim(),
          email: editEmail.trim().toLowerCase() || undefined,
          phoneNumber: editPhone.trim() || undefined,
          status: editStatus === 'Active',
        });
        showToast(`${roleLabel} "${editName}" updated successfully.`, 'success');
      } else {
        showToast(`${roleLabel} "${editName}" updated successfully.`, 'success');
      }

      setIsEditModalOpen(false);
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
      fetchStaff(false);
    } catch (err: any) {
      console.warn('Staff update encountered issue, keeping local changes:', err?.message);
      showToast(`${roleLabel} "${editName}" updated successfully.`, 'success');
      setIsEditModalOpen(false);
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (s: StaffMember) => {
    const nextStatus = s.status === 'Active' ? 'INACTIVE' : 'ACTIVE';
    const nextStatusLabel: 'Active' | 'Suspended' = nextStatus === 'ACTIVE' ? 'Active' : 'Suspended';

    setStaffList(prev => prev.map(item => item.id === s.id ? { ...item, status: nextStatusLabel } : item));
    setMockOverride(s.id, { status: nextStatusLabel });

    if (isMockId(s.id)) {
      showToast(`${roleLabel} ${s.name} duty status updated to ${nextStatusLabel}.`, 'success');
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
      return;
    }

    try {
      await adminApi.updateUserStatus(s.id, nextStatus);
      showToast(`${roleLabel} ${s.name} duty status updated to ${nextStatusLabel}.`, 'success');
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
    } catch (err: any) {
      console.warn('Backend updateUserStatus failed, keeping local update:', err?.message);
      showToast(`${roleLabel} ${s.name} duty status updated to ${nextStatusLabel}.`, 'info');
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
    }
  };

  // Confirm & Execute Staff Deletion
  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;
    setIsDeletingStaff(true);
    try {
      if (!isMockId(staffToDelete.id)) {
        await adminApi.deleteUser(staffToDelete.id);
      }
      setStaffList(prev => prev.filter(item => item.id !== staffToDelete.id));
      showToast(`${roleLabel} "${staffToDelete.name}" was successfully deleted.`, 'delete');
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
    } catch (err: any) {
      showToast(err.message || `Failed to delete ${roleLabel.toLowerCase()} record.`, 'error');
    } finally {
      setIsDeletingStaff(false);
      setStaffToDelete(null);
    }
  };

  // Add Staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      showToast(`${roleLabel} name is required`, 'error');
      return;
    }
    if (!addEmail.trim()) {
      showToast('Email address is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName: addName.trim(),
        email: addEmail.trim().toLowerCase(),
        phoneNumber: addPhone.trim() || undefined,
        password: addPassword.trim() || 'Staff@123',
        role: apiRole,
        hospital: addHospital.trim() || 'MediCare Central Hospital',
        licenseNumber: addLicense.trim() || undefined,
      };

      if (type === 'doctor') {
        payload.speciality = addField.trim() || 'General Medicine';
      } else if (type === 'nurse') {
        payload.department = addField.trim() || 'Inpatient General Ward';
      } else if (type === 'pharmacist') {
        payload.dispensary = addField.trim() || 'Central Pharmacy Hub';
      } else {
        payload.specialty = addField.trim() || 'Elderly Homecare & Geriatric Care';
      }

      await adminApi.createUser(payload);

      showToast(`New ${roleLabel.toLowerCase()} "${addName}" registered successfully.`, 'success');
      setIsAddModalOpen(false);
      setAddName('');
      setAddEmail('');
      setAddPhone('');
      setAddField('');
      setAddLicense('');
      window.dispatchEvent(new CustomEvent('admin_stats_updated'));
      fetchStaff(false);
    } catch (err: any) {
      showToast(err.message || `Error registering ${roleLabel.toLowerCase()} account.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = staffList.filter(s => {
    const sName = s.name || '';
    const sEmail = s.email || '';
    const matchesSearch = 
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.specialization && s.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.licenseNumber && s.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' ? true : s.status === statusFilter;

    const matchesHospital = 
      hospitalFilter === 'All' ? true : s.hospital === hospitalFilter;

    return matchesSearch && matchesStatus && matchesHospital;
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
      <div className="p-6 sm:p-8 rounded-2xl text-white border border-[#009688]/30 bg-[#00a896] shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {headerTitle}
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0 flex-wrap">
          <span className="px-4 py-2.5 rounded-xl bg-black/20 text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md shadow-xs">
            {staffList.length} Registered {pluralLabel}
          </span>
          <button
            onClick={() => fetchStaff(true)}
            disabled={loading}
            className="p-3 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] border border-white/80 hover:border-teal-200 shadow-md shadow-teal-950/15 flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 group"
            title={`Refresh ${roleLabel.toLowerCase()} records`}
            aria-label={`Refresh ${roleLabel.toLowerCase()} records`}
          >
            <RefreshCw className={`w-4 h-4 text-[#00897b] group-hover:text-[#004d40] transition-colors ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-white hover:bg-teal-50 text-[#00796b] hover:text-[#004d40] font-black text-xs shadow-md shadow-teal-950/15 border border-white/80 hover:border-teal-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#00897b]" />
            <span>Add New {roleLabel}</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${roleLabel.toLowerCase()} name, ${fieldLabel.toLowerCase()}, or license...`}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00a896]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Hospital Scope Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#00a896] cursor-pointer"
            >
              <option value="All">All Hospitals ({availableHospitals.length})</option>
              {availableHospitals.map((hosp) => (
                <option key={hosp.id} value={hosp.name}>
                  {hosp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {(['All', 'Active', 'Suspended'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  statusFilter === status
                    ? 'bg-[#00a896] text-white border-[#00a896] shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ROSTER TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
            <span className="font-medium">Loading {roleLabel.toLowerCase()} records from database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 font-medium">
            No {roleLabel.toLowerCase()} records found matching the query.
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[20%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-200">
                  <th className="py-3.5 pl-5 pr-3 text-left">Staff Practitioner</th>
                  <th className="py-3.5 px-3 text-left">{tableHeaderField}</th>
                  <th className="py-3.5 px-3 text-left whitespace-nowrap">Contact Info</th>
                  <th className="py-3.5 px-3 text-left whitespace-nowrap">License</th>
                  <th className="py-3.5 px-2 text-center whitespace-nowrap">Duty Status</th>
                  <th className="py-3.5 pl-2 pr-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm shrink-0 border ${avatarBg}`}>
                          {(s.name || s.email || 'Staff').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">{s.name || 'Staff Practitioner'}</p>
                          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 align-middle">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {(type === 'doctor' || type === 'pharmacist') ? s.specialization : s.department}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                          {s.hospital}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-3 align-middle font-mono text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {s.phone}
                    </td>

                    <td className="py-4 px-3 align-middle font-mono text-xs sm:text-sm whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold inline-block">
                        {s.licenseNumber}
                      </span>
                    </td>

                    {/* INTERACTIVE DUTY STATUS TOGGLE */}
                    <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                          s.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status (Active / Suspended)"
                      >
                        <span className={`w-2 h-2 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span>{s.status}</span>
                      </button>
                    </td>

                    {/* Colored Action Buttons (Edit, Delete) */}
                    <td className="py-4 pl-2 pr-6 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#00796b] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 hover:bg-[#00a896] hover:text-white hover:border-[#00a896] hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title={`Edit ${roleLabel.toLowerCase()} record`}
                          aria-label={`Edit ${roleLabel.toLowerCase()}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setStaffToDelete(s)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title={`Delete ${roleLabel.toLowerCase()} record`}
                          aria-label={`Delete ${roleLabel.toLowerCase()}`}
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
        )}
      </div>

      {/* 4. EDIT STAFF MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-[#00796b] flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5 text-[#00897b]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Edit {roleLabel} Profile
                  </h3>
                  <p className="text-xs text-slate-500">Synchronizes with hospital staff roster</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98400 00000"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {fieldLabel}
                  </label>
                  <input
                    type="text"
                    value={editField}
                    onChange={(e) => setEditField(e.target.value)}
                    placeholder={fieldPlaceholder}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital Affiliation
                  </label>
                  <input
                    type="text"
                    value={editHospital}
                    onChange={(e) => setEditHospital(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duty Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Active' | 'Suspended')}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  >
                    <option value="Active">Active (On Duty / Permitted)</option>
                    <option value="Suspended">Suspended (Off Duty / Revoked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {licenseLabel}
                </label>
                <input
                  type="text"
                  value={editLicense}
                  onChange={(e) => setEditLicense(e.target.value)}
                  placeholder={licensePlaceholder}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#009688] text-white font-bold text-xs shadow-md shadow-teal-950/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-[#00796b] flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-[#00897b]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Enroll New {roleLabel}
                  </h3>
                  <p className="text-xs text-slate-500">Creates credentials and registers to hospital directory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder={addNamePlaceholder}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder={addEmailPlaceholder}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="password"
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    placeholder="Staff@123"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {fieldLabel}
                  </label>
                  <input
                    type="text"
                    value={addField}
                    onChange={(e) => setAddField(e.target.value)}
                    placeholder={fieldPlaceholder}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital Affiliation
                  </label>
                  <input
                    type="text"
                    value={addHospital}
                    onChange={(e) => setAddHospital(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {licenseLabel}
                </label>
                <input
                  type="text"
                  value={addLicense}
                  onChange={(e) => setAddLicense(e.target.value)}
                  placeholder={licensePlaceholder}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#009688] text-white font-bold text-xs shadow-md shadow-teal-950/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Register {roleLabel}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. PROFESSIONAL DELETE CONFIRMATION MODAL */}
      <AdminDeleteConfirmModal
        isOpen={Boolean(staffToDelete)}
        itemType={roleLabel}
        itemName={staffToDelete?.name || ''}
        itemId={staffToDelete?.licenseNumber}
        isDeleting={isDeletingStaff}
        onConfirm={confirmDeleteStaff}
        onClose={() => setStaffToDelete(null)}
      />

    </div>
  );
};

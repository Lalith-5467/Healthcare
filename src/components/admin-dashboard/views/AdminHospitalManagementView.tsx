import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Search, Plus, Edit2, Trash2, ExternalLink, MapPin, 
  Phone, Mail, Bed, Users, ShieldCheck, Stethoscope, HeartPulse, 
  Pill, HeartHandshake, Shield, Check, X, RefreshCw, AlertCircle, Award
} from 'lucide-react';
import { adminApi } from '../../../services/dhrApis';
import { 
  getStoredHospitals, 
  saveStoredHospitals, 
  type HospitalAdminRecord 
} from '../../../utils/adminMockStorage';
import { AdminToast } from '../common/AdminToast';
import type { AdminToastType } from '../common/AdminToast';
import { AdminDeleteConfirmModal } from '../modals/AdminDeleteConfirmModal';

interface AdminHospitalManagementViewProps {
  onLaunchHospitalPortal?: (hospital: HospitalAdminRecord) => void;
}

export const AdminHospitalManagementView: React.FC<AdminHospitalManagementViewProps> = ({
  onLaunchHospitalPortal,
}) => {
  const [hospitals, setHospitals] = useState<HospitalAdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Under Review' | 'Suspended'>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<HospitalAdminRecord | null>(null);

  // Edit form state
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState('');
  const [editBedCapacity, setEditBedCapacity] = useState<number>(300);
  const [editStatus, setEditStatus] = useState<'Active' | 'Under Review' | 'Suspended'>('Active');
  const [editAccreditation, setEditAccreditation] = useState('NABH Accredited');

  // Add form state
  const [addName, setAddName] = useState('');
  const [addCode, setAddCode] = useState('');
  const [addCity, setAddCity] = useState('Bengaluru');
  const [addState, setAddState] = useState('Karnataka');
  const [addAddress, setAddAddress] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addAdminName, setAddAdminName] = useState('');
  const [addAdminEmail, setAddAdminEmail] = useState('');
  const [addBedCapacity, setAddBedCapacity] = useState<number>(250);
  const [addAccreditation, setAddAccreditation] = useState('NABH & JCI Accredited');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<AdminToastType>('success');

  const showToast = (msg: string, type: AdminToastType = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchHospitals = async (isManual = false) => {
    setLoading(true);
    try {
      const res = await adminApi.getHospitals();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setHospitals(res.data);
        saveStoredHospitals(res.data);
      } else {
        const local = getStoredHospitals();
        setHospitals(local);
      }
      if (isManual) showToast('Hospital directory synchronized', 'info');
    } catch {
      const local = getStoredHospitals();
      setHospitals(local);
      if (isManual) showToast('Synchronized with local hospital cache', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();

    const handleUpdate = () => {
      const current = getStoredHospitals();
      setHospitals(current);
    };

    window.addEventListener('admin_hospitals_updated', handleUpdate);
    return () => window.removeEventListener('admin_hospitals_updated', handleUpdate);
  }, []);

  // Filtered List
  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.adminName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open Edit Modal
  const handleOpenEdit = (h: HospitalAdminRecord) => {
    setEditId(h.id);
    setEditName(h.name);
    setEditCode(h.code);
    setEditCity(h.city);
    setEditState(h.state);
    setEditAddress(h.address);
    setEditPhone(h.contactPhone);
    setEditEmail(h.email);
    setEditAdminName(h.adminName);
    setEditAdminEmail(h.adminEmail);
    setEditBedCapacity(h.bedCapacity);
    setEditStatus(h.status);
    setEditAccreditation(h.accreditation);
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Hospital name is required', 'info');
      return;
    }

    setIsSubmitting(true);
    const updates: Partial<HospitalAdminRecord> = {
      name: editName.trim(),
      code: editCode.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      address: editAddress.trim(),
      contactPhone: editPhone.trim(),
      email: editEmail.trim(),
      adminName: editAdminName.trim(),
      adminEmail: editAdminEmail.trim(),
      bedCapacity: Number(editBedCapacity) || 100,
      status: editStatus,
      accreditation: editAccreditation.trim(),
    };

    try {
      await adminApi.updateHospital(editId, updates);
    } catch {}

    const updatedList = hospitals.map((h) => (h.id === editId ? { ...h, ...updates } : h));
    setHospitals(updatedList);
    saveStoredHospitals(updatedList);

    showToast(`Updated "${editName}" successfully`, 'success');
    setIsEditModalOpen(false);
    setIsSubmitting(false);
  };

  // Submit Add Form
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      showToast('Hospital name is required', 'info');
      return;
    }

    setIsSubmitting(true);
    const newHospitalData: Partial<HospitalAdminRecord> = {
      name: addName.trim(),
      code: addCode.trim() || `HOSP-${Math.floor(100 + Math.random() * 900)}`,
      city: addCity.trim(),
      state: addState.trim(),
      address: addAddress.trim() || `${addName.trim()} Main Complex`,
      contactPhone: addPhone.trim() || '+91 80 0000 0000',
      email: addEmail.trim() || `contact@${addName.toLowerCase().replace(/[^a-z]/g, '')}.in`,
      adminName: addAdminName.trim() || 'Medical Director',
      adminEmail: addAdminEmail.trim() || 'admin@hospital.in',
      bedCapacity: Number(addBedCapacity) || 200,
      status: 'Active',
      establishedYear: new Date().getFullYear(),
      accreditation: addAccreditation.trim(),
      activeDoctors: 12,
      activeNurses: 24,
      activePatients: 85,
      activePharmacists: 4,
      activeCaregivers: 6,
      insurancePartnersCount: 8,
      departments: ['General OPD', 'Emergency Care', 'In-Patient Ward', 'Diagnostic Lab'],
    };

    let createdRecord: HospitalAdminRecord | null = null;
    try {
      const res = await adminApi.createHospital(newHospitalData);
      if (res && res.data) createdRecord = res.data;
    } catch {}

    if (!createdRecord) {
      const nextId = `HOSP-${String(hospitals.length + 1).padStart(2, '0')}`;
      createdRecord = {
        id: nextId,
        hospitalId: `HOSP-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        ...(newHospitalData as any),
      };
    }

    const updatedList = [createdRecord!, ...hospitals];
    setHospitals(updatedList);
    saveStoredHospitals(updatedList);

    showToast(`Hospital "${addName}" onboarded to network`, 'success');
    setIsAddModalOpen(false);
    setIsSubmitting(false);

    // Reset Form
    setAddName('');
    setAddCode('');
    setAddAddress('');
    setAddPhone('');
    setAddEmail('');
    setAddAdminName('');
    setAddAdminEmail('');
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!hospitalToDelete) return;
    try {
      await adminApi.deleteHospital(hospitalToDelete.id);
    } catch {}

    const updatedList = hospitals.filter((h) => h.id !== hospitalToDelete.id);
    setHospitals(updatedList);
    saveStoredHospitals(updatedList);

    showToast(`Removed "${hospitalToDelete.name}" from active directory`, 'info');
    setHospitalToDelete(null);
  };

  // Launch Portal helper
  const handleLaunch = (h: HospitalAdminRecord) => {
    try {
      localStorage.setItem('active_hospital_portal', JSON.stringify(h));
    } catch {}
    if (onLaunchHospitalPortal) {
      onLaunchHospitalPortal(h);
    } else {
      window.location.href = `/hospital-admin?hospitalId=${h.id}`;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminToast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />

      {/* TOP HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/25">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Hospital Network Directory
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  {hospitals.length} Registered Facilities
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized hospital registry. Doctors, nurses, patients, caregivers, and insurance providers are organized under each facility.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => fetchHospitals(true)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Onboard Hospital
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Total Network Beds</span>
            <Bed className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hospitals.reduce((acc, h) => acc + (h.bedCapacity || 0), 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1 inline-block">
            Across {hospitals.length} active facilities
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Doctors Assigned</span>
            <Stethoscope className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hospitals.reduce((acc, h) => acc + (h.activeDoctors || 0), 0)}
          </p>
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1 inline-block">
            Active verified practitioners
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Nursing & Clinical Staff</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hospitals.reduce((acc, h) => acc + (h.activeNurses || 0), 0)}
          </p>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1 inline-block">
            Across in-patient units
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Admitted Patients</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {hospitals.reduce((acc, h) => acc + (h.activePatients || 0), 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
            Active under care in portal
          </span>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#0b1120] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals by name, city, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-bold shrink-0">Status:</span>
          {(['All', 'Active', 'Under Review', 'Suspended'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* HOSPITAL CARDS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-xs font-semibold">Loading Hospital Registry...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Hospitals Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or onboard a new facility into the network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHospitals.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-xs"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-lg border border-teal-500/25 shrink-0">
                      {h.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {h.name}
                        </h2>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {h.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        {h.city}, {h.state}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      h.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : h.status === 'Under Review'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                {/* Accreditation & Admin */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Facility Admin
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {h.adminName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate block">
                      {h.adminEmail}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Accreditation
                    </span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 text-[11px] mt-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {h.accreditation}
                    </span>
                  </div>
                </div>

                {/* Role Counts under this hospital */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/70 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {h.activeDoctors}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Doctors</span>
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {h.activeNurses}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Nurses</span>
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {h.activePatients}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Patients</span>
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {h.bedCapacity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Beds</span>
                  </div>
                </div>

                {/* Departments Pills */}
                {h.departments && h.departments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {h.departments.slice(0, 4).map((dept) => (
                      <span
                        key={dept}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {dept}
                      </span>
                    ))}
                    {h.departments.length > 4 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                        +{h.departments.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(h)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Hospital Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setHospitalToDelete(h)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Decommission Hospital"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleLaunch(h)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Facility Portal
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT HOSPITAL MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-500" /> Edit Facility Profile
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Facility Code</label>
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Bed Capacity</label>
                    <input
                      type="number"
                      value={editBedCapacity}
                      onChange={(e) => setEditBedCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Admin In-Charge</label>
                    <input
                      type="text"
                      value={editAdminName}
                      onChange={(e) => setEditAdminName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                    <input
                      type="email"
                      value={editAdminEmail}
                      onChange={(e) => setEditAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Accreditation</label>
                    <input
                      type="text"
                      value={editAccreditation}
                      onChange={(e) => setEditAccreditation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD HOSPITAL MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-500" /> Onboard Facility to MediCare Network
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="mt-4 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Hospital / Medical Center Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Max Super Specialty Hospital"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Facility Short Code</label>
                    <input
                      type="text"
                      placeholder="e.g. MAX-DEL"
                      value={addCode}
                      onChange={(e) => setAddCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Bed Capacity</label>
                    <input
                      type="number"
                      value={addBedCapacity}
                      onChange={(e) => setAddBedCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={addCity}
                      onChange={(e) => setAddCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={addState}
                      onChange={(e) => setAddState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Campus Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Link Road, Andheri West"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Admin Officer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={addAdminName}
                      onChange={(e) => setAddAdminName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Admin Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@maxhospital.in"
                      value={addAdminEmail}
                      onChange={(e) => setAddAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Accreditation</label>
                  <input
                    type="text"
                    value={addAccreditation}
                    onChange={(e) => setAddAccreditation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Hospital'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AdminDeleteConfirmModal
        isOpen={!!hospitalToDelete}
        onClose={() => setHospitalToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemType="Hospital Facility"
        itemName={hospitalToDelete?.name || ''}
        itemId={hospitalToDelete?.code || ''}
      />
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Stethoscope, HeartPulse, Pill, HeartHandshake,
  ShieldCheck, ArrowLeft, LogOut, Search, Bed, Activity, Phone,
  Mail, MapPin, Award, CheckCircle2, ChevronDown, Filter, Calendar
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { adminApi, pharmacyApi, insuranceApi } from '../services/dhrApis';
import { 
  getStoredHospitals, 
  type HospitalAdminRecord, 
  INITIAL_DOCTORS, 
  INITIAL_NURSES, 
  INITIAL_PATIENTS, 
  INITIAL_PHARMACISTS, 
  INITIAL_CAREGIVERS, 
  INITIAL_INSURANCE_POLICIES 
} from '../utils/adminMockStorage';
import { AdminStaffManagementView } from '../components/admin-dashboard/views/AdminStaffManagementView';
import { AdminPatientManagementView } from '../components/admin-dashboard/views/AdminPatientManagementView';
import { AdminOperationsView } from '../components/admin-dashboard/views/AdminOperationsView';

interface HospitalDashboardPageProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  initialHospitalId?: string;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export const HospitalDashboardPage: React.FC<HospitalDashboardPageProps> = ({
  user,
  initialHospitalId,
  onLogout,
  onNavigate,
}) => {
  const [hospitals, setHospitals] = useState<HospitalAdminRecord[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalAdminRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'nurses' | 'patients' | 'pharmacists' | 'caregivers' | 'insurance'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  // Live real data counts from database
  const [liveDoctors, setLiveDoctors] = useState<any[]>([]);
  const [liveNurses, setLiveNurses] = useState<any[]>([]);
  const [livePatients, setLivePatients] = useState<any[]>([]);
  const [livePharmacists, setLivePharmacists] = useState<any[]>([]);
  const [liveCaregivers, setLiveCaregivers] = useState<any[]>([]);
  const [liveInsurance, setLiveInsurance] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live registered users from backend database
    adminApi.getUsers({ limit: 100 }).then((res) => {
      if (res && res.data) {
        const all: any[] = Array.isArray(res.data) ? res.data : (res.data as any).users || [];
        setLiveDoctors(all.filter((u) => u.role === 'DOCTOR'));
        setLiveNurses(all.filter((u) => u.role === 'NURSE'));
        setLivePatients(all.filter((u) => u.role === 'PATIENT'));
        setLivePharmacists(all.filter((u) => u.role === 'PHARMACIST'));
        setLiveCaregivers(all.filter((u) => u.role === 'CAREGIVER'));
        setLiveInsurance(all.filter((u) => u.role === 'INSURANCE_PROVIDER' || u.role === 'INSURANCE'));
      }
    }).catch(() => {});

    insuranceApi.getPolicies().then((res) => {
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setLiveInsurance(res.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const list = getStoredHospitals();
    setHospitals(list);

    // Try to load initial hospital
    let found: HospitalAdminRecord | undefined;
    const urlParams = new URLSearchParams(window.location.search);
    const qId = urlParams.get('hospitalId') || initialHospitalId;

    if (qId) {
      found = list.find((h) => h.id === qId || h.hospitalId === qId || h.code.toLowerCase() === qId.toLowerCase());
    }

    if (!found) {
      try {
        const stored = localStorage.getItem('active_hospital_portal');
        if (stored) {
          const parsed = JSON.parse(stored);
          found = list.find((h) => h.id === parsed.id);
        }
      } catch {}
    }

    setSelectedHospital(found || list[0] || null);
  }, [initialHospitalId]);

  const handleSelectHospital = (hosp: HospitalAdminRecord) => {
    setSelectedHospital(hosp);
    try {
      localStorage.setItem('active_hospital_portal', JSON.stringify(hosp));
    } catch {}
  };

  if (!selectedHospital) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white">
        <div className="text-center space-y-3">
          <Building2 className="w-12 h-12 text-teal-500 mx-auto animate-pulse" />
          <h2 className="text-lg font-bold">Loading Hospital Portal...</h2>
        </div>
      </div>
    );
  }

  // Real data calculations (falls back to mock if DB has no records yet)
  const realDoctors = liveDoctors.length > 0 ? liveDoctors.filter((d) => !d.doctor?.hospital || d.doctor?.hospital === selectedHospital.name) : INITIAL_DOCTORS.filter((d) => !d.hospital || d.hospital === selectedHospital.name);
  const realNurses = liveNurses.length > 0 ? liveNurses.filter((n) => !n.nurse?.hospital || n.nurse?.hospital === selectedHospital.name) : INITIAL_NURSES.filter((n) => !n.hospital || n.hospital === selectedHospital.name);
  const realPatients = livePatients.length > 0 ? livePatients.filter((p) => !p.patient?.hospital || p.patient?.hospital === selectedHospital.name) : INITIAL_PATIENTS.filter((p) => !p.hospital || p.hospital === selectedHospital.name);
  const realPharmacists = livePharmacists.length > 0 ? livePharmacists.filter((ph) => !ph.pharmacist?.hospital || ph.pharmacist?.hospital === selectedHospital.name) : INITIAL_PHARMACISTS.filter((ph) => !ph.hospital || ph.hospital === selectedHospital.name);
  const realCaregivers = liveCaregivers.length > 0 ? liveCaregivers.filter((cg) => !cg.caregiver?.hospital || cg.caregiver?.hospital === selectedHospital.name) : INITIAL_CAREGIVERS.filter((cg) => !cg.hospital || cg.hospital === selectedHospital.name);
  const realInsurance = liveInsurance.length > 0 ? liveInsurance : INITIAL_INSURANCE_POLICIES.filter((ins) => !ins.hospital || ins.hospital === selectedHospital.name);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      
      {/* 1. TOP HOSPITAL EXECUTIVE BAR */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Return to Master Admin Platform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black border border-teal-500/25">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {selectedHospital.name}
                </h1>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  {selectedHospital.code}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-500" />
                {selectedHospital.city}, {selectedHospital.state}
              </p>
            </div>
          </div>
        </div>

        {/* Hospital Switcher Dropdown & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Facility:</span>
            <select
              value={selectedHospital.id}
              onChange={(e) => {
                const found = hospitals.find((h) => h.id === e.target.value);
                if (found) handleSelectHospital(found);
              }}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id} className="dark:bg-slate-900">
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <ThemeToggle />

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. SECONDARY HOSPITAL NAVIGATION TABS */}
      <div className="bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none py-2">
        {[
          { id: 'overview', label: 'Overview & Facility Stats', icon: Activity },
          { id: 'doctors', label: `Doctors (${realDoctors.length})`, icon: Stethoscope },
          { id: 'nurses', label: `Nurses (${realNurses.length})`, icon: HeartPulse },
          { id: 'patients', label: `Patients (${realPatients.length})`, icon: Users },
          { id: 'pharmacists', label: `Pharmacy (${realPharmacists.length})`, icon: Pill },
          { id: 'caregivers', label: `Caregivers (${realCaregivers.length})`, icon: HeartHandshake },
          { id: 'insurance', label: `Insurance Desk (${realInsurance.length})`, icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN BODY SCROLL CONTAINER */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* HOSPITAL HERO CARD */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/20">
                      Hospital Management Portal
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">{selectedHospital.name}</h2>
                    <p className="text-xs text-teal-50 max-w-xl">
                      {selectedHospital.address}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Phone className="w-3.5 h-3.5" /> {selectedHospital.contactPhone}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Mail className="w-3.5 h-3.5" /> {selectedHospital.email}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold bg-white/10 px-2 py-0.5 rounded-md">
                        <Award className="w-3.5 h-3.5 text-amber-300" /> {selectedHospital.accreditation}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-center">
                    <span className="text-[10px] text-teal-100 font-bold uppercase block">
                      Licensed Bed Capacity
                    </span>
                    <span className="text-3xl font-black text-white">{selectedHospital.bedCapacity}</span>
                    <span className="text-[10px] text-teal-200 block mt-0.5">In-Patient & ICU</span>
                  </div>
                </div>
              </div>

              {/* STATS TILES */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <div 
                  onClick={() => setActiveTab('doctors')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Doctors</span>
                    <Stethoscope className="w-4 h-4 text-teal-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realDoctors.length}</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">Active Staff</span>
                </div>

                <div 
                  onClick={() => setActiveTab('nurses')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Nurses</span>
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realNurses.length}</span>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 block mt-0.5">Shift Duty</span>
                </div>

                <div 
                  onClick={() => setActiveTab('patients')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Patients</span>
                    <Users className="w-4 h-4 text-cyan-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realPatients.length}</span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block mt-0.5">Under Care</span>
                </div>

                <div 
                  onClick={() => setActiveTab('pharmacists')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Pharmacy</span>
                    <Pill className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realPharmacists.length}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">Dispensing</span>
                </div>

                <div 
                  onClick={() => setActiveTab('caregivers')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Caregivers</span>
                    <HeartHandshake className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realCaregivers.length}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block mt-0.5">Support</span>
                </div>

                <div 
                  onClick={() => setActiveTab('insurance')}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-bold">Insurance</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{realInsurance.length}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">TPA Partners</span>
                </div>
              </div>

              {/* CLINICAL DEPARTMENTS & FACILITY DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-500" /> Active Medical Departments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.departments.map((dept) => (
                      <span
                        key={dept}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0b1120] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Administration Contacts
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Medical Director / Admin</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedHospital.adminName}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{selectedHospital.adminEmail}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Accreditation Level</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{selectedHospital.accreditation}</span>
                      <span className="text-[10px] text-slate-500 block">Est. {selectedHospital.establishedYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <AdminStaffManagementView type="doctor" defaultHospital={selectedHospital.name} />
          )}

          {activeTab === 'nurses' && (
            <AdminStaffManagementView type="nurse" defaultHospital={selectedHospital.name} />
          )}

          {activeTab === 'patients' && (
            <AdminPatientManagementView defaultHospital={selectedHospital.name} />
          )}

          {activeTab === 'pharmacists' && (
            <AdminStaffManagementView type="pharmacist" defaultHospital={selectedHospital.name} />
          )}

          {activeTab === 'caregivers' && (
            <AdminStaffManagementView type="caregiver" defaultHospital={selectedHospital.name} />
          )}

          {activeTab === 'insurance' && (
            <AdminOperationsView type="insurance" />
          )}
        </div>
      </main>
    </div>
  );
};


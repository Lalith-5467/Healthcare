import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Pill,
  Clock,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Bell,
  RefreshCw,
  Truck,
  FileText,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  XCircle
} from 'lucide-react';
import type { MedicineItem, DoseRecord } from './medicinesData';
import {
  INITIAL_MEDICINES,
  INITIAL_TODAY_DOSES,
  MOCK_HISTORY_LOGS,
  MOCK_WEEKLY_ADHERENCE
} from './medicinesData';
import { AddMedicineModal } from './AddMedicineModal';
import { MedicineDetailsDrawer } from './MedicineDetailsDrawer';
import { EditMedicineModal } from './EditMedicineModal';
import { MedicineFilterDrawer } from './MedicineFilterDrawer';
import type { MedicineFilterState } from './MedicineFilterDrawer';
import { SkipDoseModal } from './SkipDoseModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface MedicinesViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const MedicinesView: React.FC<MedicinesViewProps> = ({
  user,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MEDICINES & TODAY'S DOSES STATE (Persisted in localStorage)
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [todayDoses, setTodayDoses] = useState<DoseRecord[]>(INITIAL_TODAY_DOSES);
  const [historyLogs, setHistoryLogs] = useState<DoseRecord[]>(MOCK_HISTORY_LOGS);

  // TABS & SEARCH STATES
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'paused'>('active');
  const [historyFilter, setHistoryFilter] = useState<'Today' | '7 Days' | '30 Days'>('7 Days');
  const [searchQuery, setSearchQuery] = useState('');

  // MODAL & DRAWER STATES
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailDrawerTarget, setDetailDrawerTarget] = useState<MedicineItem | null>(null);
  const [editModalTarget, setEditModalTarget] = useState<MedicineItem | null>(null);
  const [skipModalTarget, setSkipModalTarget] = useState<DoseRecord | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<MedicineFilterState>({
    status: 'All',
    frequency: 'All',
    sortBy: 'Newest'
  });

  // Load from localStorage on mount & simulate short skeleton
  useEffect(() => {
    const savedMeds = localStorage.getItem('user_medicines');
    if (savedMeds) {
      try {
        setMedicines(JSON.parse(savedMeds));
      } catch (e) {
        console.error(e);
      }
    }
    const savedDoses = localStorage.getItem('user_today_doses');
    if (savedDoses) {
      try {
        setTodayDoses(JSON.parse(savedDoses));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to persist state
  const saveMedicinesState = (newMeds: MedicineItem[]) => {
    setMedicines(newMeds);
    localStorage.setItem('user_medicines', JSON.stringify(newMeds));
  };

  const saveTodayDosesState = (newDoses: DoseRecord[]) => {
    setTodayDoses(newDoses);
    localStorage.setItem('user_today_doses', JSON.stringify(newDoses));
  };

  // DYNAMIC ADHERENCE % CALCULATOR
  const takenDosesCount = todayDoses.filter((d) => d.status === 'Taken').length;
  const totalTodayDosesCount = todayDoses.length;
  const adherencePercentage = totalTodayDosesCount > 0 ? Math.round((takenDosesCount / totalTodayDosesCount) * 100) : 100;
  const upcomingCount = todayDoses.filter((d) => d.status === 'Upcoming' || d.status === 'Due Now').length;

  // MARK DOSE AS TAKEN HANDLER
  const handleMarkDoseTaken = (doseId: string, medName: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedDoses = todayDoses.map((d) => {
      if (d.id === doseId) {
        return { ...d, status: 'Taken' as const, actualTime: nowTimeStr };
      }
      return d;
    });

    saveTodayDosesState(updatedDoses);

    // Also append to history logs
    const newLog: DoseRecord = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      medicineId: doseId,
      medicineName: medName,
      dosage: '500 mg',
      scheduledTime: nowTimeStr,
      actualTime: nowTimeStr,
      date: 'Today',
      status: 'Taken'
    };
    setHistoryLogs((prev) => [newLog, ...prev]);

    showToast(`✓ Marked ${medName} as taken at ${nowTimeStr}!`);
  };

  // MARK DOSE AS SKIPPED HANDLER
  const handleConfirmSkipDose = (doseId: string) => {
    const updatedDoses = todayDoses.map((d) => {
      if (d.id === doseId) {
        return { ...d, status: 'Skipped' as const };
      }
      return d;
    });
    saveTodayDosesState(updatedDoses);
    showToast('✓ Dose marked as skipped');
  };

  // SAVE NEW MEDICINE
  const handleSaveNewMedicine = (newMed: Partial<MedicineItem>) => {
    const created: MedicineItem = {
      id: newMed.id || `MED-${Date.now().toString().slice(-4)}`,
      name: newMed.name || 'New Medication',
      dosage: newMed.dosage || '500',
      unit: newMed.unit || 'mg',
      frequency: newMed.frequency || 'Twice daily',
      route: newMed.route || 'Oral',
      times: newMed.times || ['08:00 AM', '12:30 PM'],
      startDate: newMed.startDate || '23 Aug 2026',
      endDate: newMed.endDate || '23 Sep 2026',
      prescribedBy: newMed.prescribedBy || 'Dr. Rajesh Kumar',
      hospital: newMed.hospital || 'Apollo Hospital',
      purpose: newMed.purpose || 'Prescribed health therapy',
      instructions: newMed.instructions || 'Take after meal',
      foodInstruction: newMed.foodInstruction || 'After Food',
      status: 'Active',
      stockRemaining: 30,
      totalStock: 30,
      reminderEnabled: true
    };

    const updatedMeds = [created, ...medicines];
    saveMedicinesState(updatedMeds);

    // Add a today's dose for the new medicine
    const newDose: DoseRecord = {
      id: `DOSE-${Date.now().toString().slice(-4)}`,
      medicineId: created.id,
      medicineName: `${created.name} (${created.dosage} ${created.unit})`,
      dosage: `${created.dosage} ${created.unit}`,
      scheduledTime: created.times[0] || '06:00 PM',
      actualTime: null,
      date: '23 Aug 2026',
      status: 'Upcoming'
    };
    saveTodayDosesState([...todayDoses, newDose]);

    showToast(`✓ Added ${created.name} to medicines schedule`);
  };

  // EDIT MEDICINE
  const handleSaveEditMedicine = (medId: string, updatedFields: Partial<MedicineItem>) => {
    const updated = medicines.map((m) => {
      if (m.id === medId) {
        return { ...m, ...updatedFields };
      }
      return m;
    });
    saveMedicinesState(updated);
    showToast('✓ Medication updated successfully');
  };

  // TOGGLE PAUSE
  const handleTogglePauseMedicine = (medId: string) => {
    const updated = medicines.map((m) => {
      if (m.id === medId) {
        const newStatus = m.status === 'Paused' ? 'Active' : 'Paused';
        showToast(`Medicine status changed to ${newStatus}`);
        return { ...m, status: newStatus as MedicineItem['status'] };
      }
      return m;
    });
    saveMedicinesState(updated);
  };

  // TOGGLE REMINDER
  const handleToggleReminder = (medId: string) => {
    const updated = medicines.map((m) => {
      if (m.id === medId) {
        const newRem = !m.reminderEnabled;
        showToast(newRem ? 'Medication reminder enabled' : 'Medication reminder disabled');
        return { ...m, reminderEnabled: newRem };
      }
      return m;
    });
    saveMedicinesState(updated);
  };

  // FILTERED MEDICINES BY TAB & SEARCH & FILTER DRAWER
  const filteredMedicines = medicines.filter((m) => {
    if (activeTab === 'active' && m.status !== 'Active') return false;
    if (activeTab === 'completed' && m.status !== 'Completed') return false;
    if (activeTab === 'paused' && m.status !== 'Paused') return false;

    if (filters.status !== 'All' && m.status !== filters.status) return false;
    if (filters.frequency !== 'All' && m.frequency !== filters.frequency) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchDoc = m.prescribedBy.toLowerCase().includes(q);
      const matchHosp = m.hospital.toLowerCase().includes(q);
      if (!matchName && !matchDoc && !matchHosp) return false;
    }
    return true;
  });

  // NEXT MEDICINE (First upcoming dose)
  const nextDose = todayDoses.find((d) => d.status === 'Upcoming' || d.status === 'Due Now');
  const lowStockMeds = medicines.filter((m) => m.status === 'Active' && m.stockRemaining < 10);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Medicines & Prescription Tracker"
        subtitle="Stay on track with your medications and daily treatment schedule."
        badgeText="Pill Tracker"
        badgeIcon={<Pill className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => {
                const el = document.getElementById('history-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Clock className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Medication History</span>
            </button>

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>
        }
      />

      {/* 2. TODAY'S MEDICATION HERO & NEXT MEDICINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* TODAY'S MEDICATION HERO CARD WITH CIRCULAR ADHERENCE */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono">
                Today • Tuesday, 23 August
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Today's Medication</h2>
              <p className="text-xs text-slate-300 mt-1">
                {adherencePercentage >= 75 ? 'Great job! Keep it going.' : 'Remember to take your remaining scheduled doses.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Scheduled</span>
                <span className="text-base font-extrabold text-white font-mono">{totalTodayDosesCount}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-emerald-400 block">Taken</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">{takenDosesCount}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase font-bold text-amber-400 block">Remaining</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">{upcomingCount}</span>
              </div>
            </div>
          </div>

          {/* CIRCULAR PROGRESS INDICATOR */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="10"
                className="text-[#00a896]"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * adherencePercentage) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold font-mono text-white">{adherencePercentage}%</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">Adherence</span>
            </div>
          </div>
        </div>

        {/* NEXT MEDICINE HIGHLIGHT CARD */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-extrabold text-white">Next Medication</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {nextDose ? nextDose.status : 'All Clear'}
            </span>
          </div>

          {nextDose ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-extrabold text-white">{nextDose.medicineName}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-200">{nextDose.dosage}</span>
                  <span>•</span>
                  <span className="font-mono text-cyan-300 font-bold">Scheduled {nextDose.scheduledTime}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Next Dose In:</span>
                <span className="font-mono font-extrabold text-cyan-400 text-sm">02h 14m</span>
              </div>

              <button
                onClick={() => handleMarkDoseTaken(nextDose.id, nextDose.medicineName)}
                className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Taken</span>
              </button>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-slate-300">All scheduled doses for today have been completed!</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. TODAY'S SCHEDULE TIMELINE & ACTIVE MEDICINES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TODAY'S SCHEDULE TIMELINE (LEFT 5 COLUMNS) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Today's Schedule</h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {todayDoses.length} Doses
            </span>
          </div>

          {/* VERTICAL TIMELINE */}
          <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {todayDoses.map((dose) => (
              <div key={dose.id} className="relative pl-10 space-y-1">
                {/* TIMELINE NODE */}
                <div className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 -translate-x-1/2 ${
                  dose.status === 'Taken'
                    ? 'bg-emerald-500 border-emerald-400'
                    : dose.status === 'Skipped'
                    ? 'bg-amber-500 border-amber-400'
                    : 'bg-slate-900 border-cyan-400'
                }`} />

                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{dose.medicineName}</h4>
                      <p className="text-[11px] text-slate-400">{dose.dosage}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      {dose.scheduledTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-700/60">
                    <span className={`text-[10px] font-bold ${
                      dose.status === 'Taken'
                        ? 'text-emerald-400'
                        : dose.status === 'Skipped'
                        ? 'text-amber-400'
                        : 'text-cyan-300'
                    }`}>
                      {dose.status === 'Taken' ? `✓ Taken at ${dose.actualTime || '08:02 AM'}` : dose.status}
                    </span>

                    {dose.status !== 'Taken' && dose.status !== 'Skipped' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSkipModalTarget(dose)}
                          className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => handleMarkDoseTaken(dose.id, dose.medicineName)}
                          className="px-2.5 py-1 rounded-lg bg-[#00a896] hover:bg-teal-600 text-white text-[10px] font-extrabold transition-colors cursor-pointer shadow-sm"
                        >
                          Take
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE MEDICATIONS LIST & TABS (RIGHT 7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-3xl">
            {/* TABS */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto">
              {[
                { id: 'active', label: 'Active', count: medicines.filter((m) => m.status === 'Active').length },
                { id: 'completed', label: 'Completed', count: medicines.filter((m) => m.status === 'Completed').length },
                { id: 'paused', label: 'Paused', count: medicines.filter((m) => m.status === 'Paused').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* SEARCH & FILTER */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Filter className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* MEDICINE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                onClick={() => setDetailDrawerTarget(med)}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-5 rounded-3xl transition-all cursor-pointer group space-y-4 shadow-md hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {med.name}
                      </h4>
                      <p className="text-xs font-bold text-teal-400">{med.dosage} {med.unit}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    med.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : med.status === 'Completed'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {med.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="font-semibold text-white">{med.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next dose:</span>
                    <span className="font-mono font-bold text-cyan-300">{med.times[0] || '08:00 AM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prescribed by:</span>
                    <span className="font-medium text-slate-300 truncate max-w-[140px]">{med.prescribedBy}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Stock: <strong className={med.stockRemaining < 10 ? 'text-amber-400' : 'text-slate-200'}>{med.stockRemaining} left</strong>
                  </span>
                  <span className="text-xs font-bold text-amber-400 group-hover:underline flex items-center gap-1">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="py-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <Pill className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-bold text-slate-300">No medicines found matching this criteria.</p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#00a896] text-white text-xs font-bold cursor-pointer"
              >
                Add New Medicine
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. WEEKLY ADHERENCE CHART & HISTORY LOGS */}
      <div id="history-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* WEEKLY ADHERENCE CHART (LEFT 5 COLUMNS) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-extrabold text-white">Weekly Adherence Chart</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Avg 88%</span>
          </div>

          {/* BAR CHART */}
          <div className="flex items-end justify-between gap-2 h-40 pt-4 px-2">
            {MOCK_WEEKLY_ADHERENCE.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-slate-400">{item.percent}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.percent}%` }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-gradient-to-t from-[#00a896] to-cyan-400 rounded-t-xl min-h-[10px]"
                />
                <span className="text-xs font-extrabold text-slate-300">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MEDICATION HISTORY TABLE (RIGHT 7 COLUMNS) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-white">Medication History Logs</h3>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['Today', '7 Days', '30 Days'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setHistoryFilter(range)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    historyFilter === range ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* HISTORY LOGS LIST */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {historyLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    log.status === 'Taken'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white">{log.medicineName}</h4>
                    <p className="text-[11px] text-slate-400">{log.date} • Dose: {log.dosage}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                    log.status === 'Taken'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {log.status === 'Taken' ? `Taken at ${log.actualTime || '08:02 AM'}` : 'Skipped'}
                  </span>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">Sched: {log.scheduledTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LOW STOCK ALERT & PHARMACY & SAFETY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LOW STOCK ALERT */}
        <div className="bg-slate-900/80 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Low Supply Warning</span>
          </div>
          {lowStockMeds.length > 0 ? (
            <div className="space-y-2 text-xs">
              {lowStockMeds.map((m) => (
                <div key={m.id} className="bg-slate-800/80 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{m.name}</h4>
                    <span className="text-[10px] text-amber-400 font-bold">{m.stockRemaining} tablets left</span>
                  </div>
                  <button
                    onClick={() => onNavigate('pharmacy')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs cursor-pointer shadow"
                  >
                    Refill
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed">
              All active medicines currently have sufficient supply stocked.
            </p>
          )}
        </div>

        {/* PHARMACY REFILL PROMPT */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
              <Truck className="w-5 h-5" />
              <span>Need a Pharmacy Refill?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track your active prescription supply, request doorstep medicine delivery, and manage pharmacy orders.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pharmacy')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Track Pharmacy Orders</span>
          </button>
        </div>

        {/* SAFETY INFORMATION */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Prescription Safety</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Always follow the exact prescription guidelines and dosage schedules provided by your physician.
            </p>
          </div>
          <button
            onClick={() => onNavigate('records')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <FileText className="w-4 h-4" />
            <span>View Medical Records</span>
          </button>
        </div>
      </div>

      {/* ALL MODALS & DRAWERS */}
      <AddMedicineModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSaveMedicine={handleSaveNewMedicine}
        onNavigateScan={() => onNavigate('scan')}
      />

      <MedicineDetailsDrawer
        medicine={detailDrawerTarget}
        isOpen={!!detailDrawerTarget}
        onClose={() => setDetailDrawerTarget(null)}
        onEdit={(med) => setEditModalTarget(med)}
        onTogglePause={handleTogglePauseMedicine}
        onToggleReminder={handleToggleReminder}
        onNavigateRecords={() => onNavigate('records')}
      />

      <EditMedicineModal
        isOpen={!!editModalTarget}
        medicine={editModalTarget}
        onClose={() => setEditModalTarget(null)}
        onSaveEdit={handleSaveEditMedicine}
      />

      <MedicineFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ status: 'All', frequency: 'All', sortBy: 'Newest' })}
      />

      <SkipDoseModal
        isOpen={!!skipModalTarget}
        dose={skipModalTarget}
        onClose={() => setSkipModalTarget(null)}
        onConfirmSkip={handleConfirmSkipDose}
      />
    </div>
  );
};

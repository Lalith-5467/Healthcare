import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  User,
  HeartPulse,
  Calendar,
  ClipboardList,
  ChevronRight,
  X,
  CheckCircle2,
  AlertOctagon,
  Phone,
  ShieldCheck,
  FileText,
  Loader2,
  Trash2
} from 'lucide-react';
import { caregiverApi } from '../../../services/dhrApis';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedName, getLocalizedRelationship } from '../../../utils/caregiverDataTranslator';

interface CaregiverWardsViewProps {
  onNavigate?: (id: string) => void;
}

export const CaregiverWardsView: React.FC<CaregiverWardsViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { wards: workflowWards, activeWard, setActiveWardId } = useCaregiverWorkflow();
  const [dbWards, setDbWards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedDependent, setSelectedDependent] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Father',
    dateOfBirth: '',
    phone: '',
    emergencyContact: ''
  });

  const fetchWards = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await caregiverApi.getWards();
      if (res && res.data) {
        setDbWards(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching wards:', err);
      if (err?.response?.status === 403) {
        setErrorMessage('You are not authorized to view these dependent profiles.');
      } else {
        setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to load wards & dependents');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const handleAddDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      await caregiverApi.addDependent(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        relationship: 'Father',
        dateOfBirth: '',
        phone: '',
        emergencyContact: ''
      });
      setToastMsg('Dependent added successfully');
      setTimeout(() => setToastMsg(null), 3000);
      await fetchWards();
    } catch (err: any) {
      console.error('Error adding dependent:', err);
      alert(err?.response?.data?.message || 'Failed to add dependent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDependent = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to unlink this dependent from your care profile?')) return;
    try {
      setIsSubmitting(true);
      await caregiverApi.removeDependent(patientId);
      setSelectedDependent(null);
      setToastMsg('Dependent unlinked successfully');
      setTimeout(() => setToastMsg(null), 3000);
      await fetchWards();
    } catch (err: any) {
      console.error('Error unlinking dependent:', err);
      alert(err?.response?.data?.message || 'Failed to unlink dependent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Stable' || status === 'Active Care') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50';
    if (status === 'Needs Attention') return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50';
  };

  // Filtered Wards
  const filteredWards = dbWards.filter((ward) => {
    const nameMatch = (ward.fullName || ward.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const relMatch = (ward.relationship || '').toLowerCase().includes(searchQuery.toLowerCase());
    const abhaMatch = (ward.user?.abhaId || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!nameMatch && !relMatch && !abhaMatch) return false;

    if (filter === 'Active') {
      return true;
    }
    if (filter === 'Needs Attention') {
      const hasElevatedVitals = Array.isArray(ward.vitals) && ward.vitals.some((v: any) => (v.systolicBp > 140 || v.bloodSugar > 180));
      return hasElevatedVitals;
    }
    return true;
  });

  // Calculate Metrics from MySQL data
  const totalWardsCount = dbWards.length;
  const totalUpcomingAppts = dbWards.reduce((acc, w) => acc + (Array.isArray(w.appointments) ? w.appointments.length : 0), 0);
  const totalPendingTasks = dbWards.reduce((acc, w) => {
    const tasks = Array.isArray(w.caregiverTasks) ? w.caregiverTasks : [];
    return acc + tasks.filter((t: any) => t.status !== 'Completed').length;
  }, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs font-bold">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>{t('caregiver.wards.title', 'My Wards & Dependents')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('caregiver.wards.subtitle', 'Manage the people under your care and quickly access their care information.')}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('caregiver.wards.add_dependent', 'Add Dependent')}</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-teal-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t('caregiver.wards.total_dependents', 'Total Dependents')}</p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalWardsCount}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t('caregiver.wards.active_care', 'Active Care')}</p>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalWardsCount}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t('caregiver.wards.upcoming_appts', 'Upcoming Appts')}</p>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalUpcomingAppts}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t('caregiver.wards.pending_tasks', 'Pending Tasks')}</p>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalPendingTasks}</p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0b1120] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('caregiver.wards.search_placeholder', 'Search Dependents...')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {[
            { key: 'All', label: t('caregiver.wards.filter_all', 'All') },
            { key: 'Active', label: t('caregiver.wards.filter_active', 'Active') },
            { key: 'Needs Attention', label: t('caregiver.wards.filter_needs_attention', 'Needs Attention') }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f.key 
                  ? 'bg-slate-900 text-white dark:bg-teal-500/20 dark:text-teal-400' 
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="p-12 text-center bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500">{t('caregiver.common.loading', 'Loading...')}</p>
        </div>
      ) : (
        /* DEPENDENT CARDS GRID */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWards.map((ward, idx) => {
            const wardName = ward.fullName || ward.name || 'Patient Ward';
            const workflowMatch = workflowWards.find(w => w.name.toLowerCase().includes(wardName.toLowerCase()) || wardName.toLowerCase().includes(w.name.toLowerCase()));
            const relationship = workflowMatch?.relationship || ward.relationship || 'Father';
            const pendingTasksCount = Array.isArray(ward.caregiverTasks)
              ? ward.caregiverTasks.filter((t: any) => t.status !== 'Completed').length
              : 0;
            const upcomingApptsCount = Array.isArray(ward.appointments) ? ward.appointments.length : 0;
            const hasElevatedVitals = Array.isArray(ward.vitals) && ward.vitals.some((v: any) => (v.systolicBp > 140 || v.bloodSugar > 180));
            const careStatus = hasElevatedVitals ? 'Needs Attention' : 'Active Care';
            const careStatusLabel = hasElevatedVitals ? t('caregiver.wards.needs_attention', 'Needs Attention') : t('caregiver.wards.active_care', 'Active Care');
            const assignedCaregiver = ward.caregivers?.[0]?.fullName || 'Lakshmi Raj';
            const nextAppt = ward.appointments?.[0] 
              ? new Date(ward.appointments[0].appointmentDate || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : t('caregiver.wards.none_scheduled', 'None Scheduled');

            return (
              <div 
                key={ward.id} 
                className={`rounded-3xl bg-white dark:bg-[#0b1120] border-2 shadow-lg overflow-hidden transition-all hover:-translate-y-1 ${ward.id === activeWard?.id ? 'border-teal-500 dark:border-teal-500/50 shadow-teal-500/10' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <div className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800/60 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${idx === 0 ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {wardName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">{getLocalizedName(wardName, t)}</h3>
                      <p className="text-xs font-bold text-slate-500">
                        {relationship.toLowerCase().includes('father') ? t('caregiver.common.father', 'Father')
                          : relationship.toLowerCase().includes('mother') ? t('caregiver.common.mother', 'Mother')
                          : relationship.toLowerCase().includes('spouse') ? t('caregiver.common.spouse', 'Spouse')
                          : relationship.toLowerCase().includes('child') ? t('caregiver.common.child', 'Child')
                          : relationship}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(careStatus)}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {careStatusLabel}
                  </span>
                </div>
                
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.assigned_caregiver', 'Assigned Caregiver')}</span>
                    <span className="font-black text-slate-900 dark:text-white">{getLocalizedName(assignedCaregiver, t)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.todays_tasks', "Today's Tasks")}</span>
                    <span className="font-black text-amber-600 dark:text-amber-400">{pendingTasksCount} {t('caregiver.common.pending', 'Pending')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.next_appointment', 'Next Appointment')}</span>
                    <span className="font-black text-slate-900 dark:text-white">{nextAppt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.abha_id', 'ABHA ID')}</span>
                    <span className="font-bold text-slate-600 dark:text-slate-400">{ward.user?.abhaId || '91-4421-8890-1204'}</span>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-[#0b1120] border-t border-slate-100 dark:border-slate-800 flex gap-3">
                  <button 
                    onClick={() => setSelectedDependent({ ...ward, wardName, relationship, pendingTasksCount, upcomingApptsCount, careStatus, careStatusLabel, assignedCaregiver, nextAppt, idx })} 
                    className="flex-1 py-2.5 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4" /> {t('caregiver.wards.view_care_profile', 'View Care Profile')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredWards.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{t('caregiver.wards.no_dependents', 'No dependents added yet')}</h3>
          <p className="text-sm font-bold text-slate-500 mb-6">{t('caregiver.wards.no_dependents_sub', 'Add a dependent to start managing their care.')}</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-teal-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> {t('caregiver.wards.add_dependent', 'Add Dependent')}
          </button>
        </div>
      )}

      {/* DEPENDENT DETAILS MODAL (CENTERED) */}
      <AnimatePresence>
        {selectedDependent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setSelectedDependent(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md max-h-[90vh] bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  {t('caregiver.wards.dependent_profile_title', 'Dependent Care Profile')}
                </span>
                <button onClick={() => setSelectedDependent(null)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg">
                    {(selectedDependent.wardName || selectedDependent.fullName || 'P').charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{getLocalizedName(selectedDependent.wardName || selectedDependent.fullName, t)}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {getLocalizedRelationship(selectedDependent.relationship || 'Guardian', t)}
                    </p>
                  </div>
                </div>

                {/* Status & Care Info */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.care_status', 'Care Status')}</span>
                    <span className={`font-black flex items-center gap-1 ${selectedDependent.careStatus === 'Needs Attention' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedDependent.careStatusLabel || t('caregiver.wards.active_care', 'Active Care')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.primary_caregiver', 'Primary Caregiver')}</span>
                    <span className="font-black text-slate-900 dark:text-white">{getLocalizedName(selectedDependent.assignedCaregiver || 'Lakshmi Raj', t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.abha_address', 'ABHA Address')}</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedDependent.user?.abhaId || '91-4421-8890-1204@abdm'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.blood_group', 'Blood Group')}</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedDependent.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">{t('caregiver.wards.care_circle_members', 'Care Circle Members')}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">{t('caregiver.wards.active_members', 'Active')} ({selectedDependent.caregivers?.length || 1} {t('caregiver.wards.caregiver_unit', 'Caregiver')})</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-600/70 dark:text-amber-500/70 mb-1">{t('caregiver.wards.pending_tasks', 'Pending Tasks')}</p>
                    <p className="text-xl font-black text-amber-600 dark:text-amber-400">{selectedDependent.pendingTasksCount || 0}</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600/70 dark:text-indigo-500/70 mb-1">{t('caregiver.wards.upcoming_appts', 'Upcoming Appts')}</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{selectedDependent.upcomingApptsCount || 0}</p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> {t('caregiver.wards.emergency_contact', 'Emergency Contact')}
                  </h4>
                  <p className="font-black text-sm text-slate-900 dark:text-white">{selectedDependent.emergencyContactName || 'Family Contact'}</p>
                  <p className="text-xs font-bold text-slate-500">{selectedDependent.emergencyContactPhone || selectedDependent.user?.phoneNumber || '+91 98765 43210'}</p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] space-y-3">
                <button 
                  onClick={() => {
                    const targetId = selectedDependent?.id;
                    const match = workflowWards.find(w => w.id === targetId || w.name.toLowerCase() === (selectedDependent?.wardName || selectedDependent?.fullName || selectedDependent?.name || '').toLowerCase());
                    if (match) {
                      setActiveWardId(match.id);
                    } else if (targetId) {
                      setActiveWardId(targetId);
                    }
                    if (onNavigate) {
                      onNavigate('records');
                    } else {
                      const recordsBtn = document.querySelector('[data-nav="records"]') as HTMLButtonElement;
                      if (recordsBtn) recordsBtn.click();
                    }
                    setSelectedDependent(null);
                  }}
                  className="w-full py-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400 font-black text-xs hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> {t('caregiver.wards.view_abha_records', 'View ABHA Health Records')} <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRemoveDependent(selectedDependent.id)}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-black text-xs border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> {t('caregiver.wards.unlink_dependent', 'Unlink Dependent')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD DEPENDENT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-500" /> {t('caregiver.wards.add_modal_title', 'Add New Dependent')}
                </span>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDependent} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{t('caregiver.wards.dependent_name', 'Dependent Name')} *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('caregiver.wards.relationship', 'Relationship')}</label>
                    <select 
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Father">{t('caregiver.common.father', 'Father')}</option>
                      <option value="Mother">{t('caregiver.common.mother', 'Mother')}</option>
                      <option value="Spouse">{t('caregiver.common.spouse', 'Spouse')}</option>
                      <option value="Child">{t('caregiver.common.child', 'Child')}</option>
                      <option value="Other">{t('caregiver.common.other', 'Other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{t('caregiver.wards.date_of_birth', 'Date of Birth')}</label>
                    <input 
                      type="date" 
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{t('caregiver.wards.phone_number', 'Phone Number (Optional)')}</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{t('caregiver.wards.emergency_phone', 'Emergency Contact Phone')}</label>
                  <input 
                    type="tel" 
                    placeholder={t('caregiver.wards.phone_placeholder', 'Phone number')} 
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" 
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {t('caregiver.wards.cancel', 'Cancel')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('caregiver.wards.add_dependent', 'Add Dependent')}
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

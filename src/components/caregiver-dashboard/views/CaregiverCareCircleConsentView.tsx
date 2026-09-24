import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Plus, 
  Lock, 
  X,
  History,
  Activity,
  UserCheck,
  CheckCircle2,
  FileText,
  ToggleRight,
  ToggleLeft,
  Loader2,
  ShieldAlert,
  Calendar,
  Truck,
  CheckSquare,
  Eye,
  Key,
  Info,
  Building2,
  Sparkles
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';
import { caregiverApi } from '../../../services/dhrApis';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedName, getLocalizedRelationship } from '../../../utils/caregiverDataTranslator';

export const CaregiverCareCircleConsentView: React.FC = () => {
  const { t } = useLanguage();
  const { 
    wards: workflowWards, 
    activeWard: workflowActiveWard, 
    setActiveWardId: setWorkflowActiveWardId 
  } = useCaregiverWorkflow();

  const [dbWards, setDbWards] = useState<any[]>([]);
  const [activeWardId, setActiveWardIdState] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'privacy' | 'careCircle' | 'audit' | 'security'>('privacy');

  const [members, setMembers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [consentStatus, setConsentStatus] = useState<'Active' | 'Revoked'>('Active');
  const [patientInfo, setPatientInfo] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // Consent Management Demo Controls (Allowed / Restricted) per ward
  const [consentScopes, setConsentScopes] = useState<Record<string, {
    healthRecords: boolean;
    vitals: boolean;
    appointments: boolean;
    careCoordination: boolean;
  }>>({
    'ward-1': { healthRecords: true, vitals: true, appointments: true, careCoordination: true },
    'ward-2': { healthRecords: true, vitals: true, appointments: true, careCoordination: true },
    'ward-3': { healthRecords: true, vitals: true, appointments: true, careCoordination: true },
  });

  // New member form state
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', accessLevel: 'Limited Access' });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Fetch backend wards
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await caregiverApi.getWards();
        if (res && res.data && res.data.length > 0) {
          setDbWards(res.data);
          setActiveWardIdState(res.data[0].id);
        } else if (workflowWards && workflowWards.length > 0) {
          setActiveWardIdState(workflowWards[0].id);
        }
      } catch (err: any) {
        if (workflowWards && workflowWards.length > 0) {
          setActiveWardIdState(workflowWards[0].id);
        }
      }
    };
    fetchWards();
  }, []);

  // Fetch Care Circle data from backend for selected ward
  const fetchCareCircle = async (wardId: string) => {
    if (!wardId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await caregiverApi.getCareCircle(wardId);
      if (res && res.data) {
        setMembers(res.data.members || []);
        setHistory(res.data.history || []);
        setAccessLogs(res.data.accessLogs || []);
        setConsentStatus(res.data.consentStatus || 'Active');
        setPatientInfo(res.data.patient || null);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setErrorMsg(t('caregiver.consent.error_forbidden', 'You are not authorized to access this dependent ward.'));
      } else {
        setErrorMsg(err?.response?.data?.message || t('caregiver.consent.error_load_db', 'Unable to load Care Circle data from database.'));
      }
      setMembers([]);
      setHistory([]);
      setAccessLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeWardId) {
      fetchCareCircle(activeWardId);
    }
  }, [activeWardId]);

  const handleWardChange = (id: string) => {
    setActiveWardIdState(id);
    setWorkflowActiveWardId(id);
  };

  // Add Care Circle Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) {
      showToast('Please provide a member name.');
      return;
    }
    try {
      await caregiverApi.addCareCircleMember({
        patientId: activeWardId,
        name: newMember.name,
        relationship: newMember.role || 'Family Caregiver',
        email: newMember.email,
        accessLevel: newMember.accessLevel,
      });

      showToast(`Invitation sent to ${newMember.name}! Added to Care Circle.`);
      setIsAddMemberOpen(false);
      setNewMember({ name: '', role: '', email: '', accessLevel: 'Limited Access' });
      await fetchCareCircle(activeWardId);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Unable to add member to Care Circle.');
    }
  };

  // Remove Care Circle Member
  const handleRemoveMember = async (targetCaregiverId: string) => {
    try {
      await caregiverApi.removeCareCircleMember(activeWardId, targetCaregiverId);
      showToast('Care Circle member removed successfully.');
      setSelectedMember(null);
      await fetchCareCircle(activeWardId);
    } catch (err: any) {
      showToast('Unable to remove member.');
    }
  };

  // Toggle Patient Consent Status
  const handleToggleConsent = async () => {
    const nextStatus = consentStatus === 'Active' ? 'Revoked' : 'Active';
    try {
      await caregiverApi.toggleConsentStatus(activeWardId, nextStatus);
      setConsentStatus(nextStatus);
      showToast(`Patient consent status updated to ${nextStatus}!`);
      await fetchCareCircle(activeWardId);
    } catch (err: any) {
      showToast('Unable to update consent status on server.');
    }
  };

  // Toggle individual scope (Demo functionality)
  const toggleConsentScope = (scopeKey: 'healthRecords' | 'vitals' | 'appointments' | 'careCoordination') => {
    const currentForWard = consentScopes[activeWardId] || { healthRecords: true, vitals: true, appointments: true, careCoordination: true };
    const nextState = !currentForWard[scopeKey];
    setConsentScopes({
      ...consentScopes,
      [activeWardId]: {
        ...currentForWard,
        [scopeKey]: nextState
      }
    });
    showToast(`Consent setting for ${scopeKey} updated to ${nextState ? 'Allowed' : 'Restricted'} (Demo Session State)`);
  };

  const wardsList = dbWards.length > 0 ? dbWards.map((w, idx) => ({
    id: w.id,
    name: w.fullName || `Dependent ${idx + 1}`,
    relationship: 'Ward',
  })) : workflowWards;

  const activeWardObj = wardsList.find(w => w.id === activeWardId) || wardsList[0] || workflowWards[0];
  const rawPatientName = patientInfo?.fullName || activeWardObj?.name || 'Active Dependent';
  const currentPatientName = getLocalizedName(rawPatientName, t);

  const currentScopes = consentScopes[activeWardId] || { healthRecords: true, vitals: true, appointments: true, careCoordination: true };

  // Fictional audit events tailored per dependent
  const mockAuditLogs = [
    {
      date: 'Today, 10:15 AM',
      user: 'Anita Sharma (Primary Caregiver)',
      action: `Viewed ${currentPatientName}'s ABHA Health Records`,
      permission: 'Proxy Health Locker Sync',
      status: 'Success'
    },
    {
      date: 'Today, 09:30 AM',
      user: 'Anita Sharma (Primary Caregiver)',
      action: `Checked latest biometrics & vitals telemetry for ${currentPatientName}`,
      permission: 'Vitals Stream',
      status: 'Success'
    },
    {
      date: 'Yesterday, 04:15 PM',
      user: 'Anita Sharma (Primary Caregiver)',
      action: `Viewed appointment details with primary physician`,
      permission: 'Consultation Record',
      status: 'Success'
    },
    {
      date: 'Sept 18, 02:00 PM',
      user: 'Anita Sharma (Primary Caregiver)',
      action: `Updated daily care task schedule for ${currentPatientName}`,
      permission: 'Care Coordination',
      status: 'Success'
    },
    {
      date: 'Sept 15, 11:30 AM',
      user: 'Anita Sharma (Primary Caregiver)',
      action: `Viewed home-care booking tracking`,
      permission: 'Nurse Dispatch',
      status: 'Success'
    }
  ];

  const displayedAccessLogs = accessLogs.length > 0 ? accessLogs : mockAuditLogs;

  return (
    <div className="space-y-6 pb-12 select-none">
      
      {/* TOAST ALERT */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl text-xs font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & DEPENDENT SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>{t('caregiver.sec.title', 'Security, Privacy & Consent Center')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('caregiver.sec.subtitle', 'Explain and manage guardian access permissions, data sharing controls, and activity audit logs.')}
          </p>
        </div>

        {/* DEPENDENT SWITCHER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {wardsList.map((ward) => {
            const isSelected = ward.id === activeWardId;
            return (
              <button
                key={ward.id}
                onClick={() => handleWardChange(ward.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{getLocalizedName(ward.name, t)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {ward.relationship}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { key: 'privacy', label: t('caregiver.sec.tab_privacy', 'Privacy & Data Access'), icon: Eye },
          { key: 'careCircle', label: t('caregiver.sec.tab_care_circle', 'Care Circle & Sharing'), icon: Users },
          { key: 'audit', label: t('caregiver.sec.tab_audit', 'Audit History'), icon: History },
          { key: 'security', label: t('caregiver.sec.tab_security', 'Security & Emergency'), icon: Lock },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRIVACY & DATA ACCESS */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* GUARDIAN PRIVACY OVERVIEW */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-cyan-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
                  ABDM Guardian Proxy Verified
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                  {t('caregiver.sec.overview_title', 'Guardian Privacy Overview')}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  {t('caregiver.sec.overview_desc', 'You are accessing health records as a ABDM verified legal proxy guardian for')} <strong className="text-slate-900 dark:text-white">{currentPatientName}</strong>. Your guardian profile holds legal authorization to view clinical records, log vitals telemetry, manage medications, and coordinate home care.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">{t('caregiver.consent.status_title', 'Consent Status')}</p>
                <div className={`flex items-center gap-1.5 text-xs font-black ${consentStatus === 'Active' ? 'text-emerald-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {consentStatus === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{consentStatus === 'Active' ? t('caregiver.consent.active_consent', 'Active Consent Granted') : t('caregiver.consent.revoked_consent', 'Consent Revoked')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DEPENDENT DATA ACCESS MATRIX */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              {t('caregiver.sec.matrix_title', 'Dependent Data Access Matrix')} — {currentPatientName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Information scopes accessible under active caregiver guardian authorization.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: t('caregiver.nav.appointments', 'Appointments'), scope: 'Doctor Visits & Video Calls', allowed: currentScopes.appointments, icon: Calendar },
                { title: t('caregiver.nav.routines', 'Care Tasks'), scope: 'Daily Activity & Medication Tasks', allowed: currentScopes.careCoordination, icon: CheckSquare },
                { title: t('caregiver.nav.vitals', 'Vitals'), scope: 'Biometrics & Telemetry Logs', allowed: currentScopes.vitals, icon: Activity },
                { title: t('caregiver.nav.records', 'ABHA Records'), scope: 'ABDM Linked Prescriptions & Reports', allowed: currentScopes.healthRecords, icon: FileText },
                { title: t('caregiver.nav.home_care', 'Home-care Bookings'), scope: 'Nurse Dispatch & Arrival Tracking', allowed: true, icon: Truck },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-cyan-900/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.scope}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      item.allowed 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                    }`}>
                      {item.allowed ? t('caregiver.sec.allowed', 'Allowed') : t('caregiver.sec.restricted', 'Restricted')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONSENT MANAGEMENT CONTROLS */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              {t('caregiver.consent.status_title', 'Consent Management Controls')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Configure caregiver authorization toggles for individual health record categories.
            </p>

            <div className="space-y-4">
              {[
                { key: 'healthRecords', label: t('caregiver.sec.consent_health_records', 'ABHA Health Records'), desc: 'Access ABDM e-prescriptions, discharge summaries, and lab reports.' },
                { key: 'vitals', label: t('caregiver.sec.consent_vitals', 'Real-Time Vitals Telemetry'), desc: 'Monitor blood pressure, blood sugar, SpO2, and pulse telemetry.' },
                { key: 'appointments', label: t('caregiver.sec.consent_appts', 'Doctor Visits & Consultations'), desc: 'Schedule and view clinical consultation records.' },
                { key: 'careCoordination', label: t('caregiver.sec.consent_care_coord', 'Care Task & Nurse Coordination'), desc: 'Assign and complete daily care tasks and home nurse dispatch.' },
              ].map((scope) => {
                const isAllowed = (currentScopes as any)[scope.key];
                return (
                  <div key={scope.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{scope.label}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{scope.desc}</p>
                    </div>

                    <button
                      onClick={() => toggleConsentScope(scope.key as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                        isAllowed 
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm shadow-emerald-500/20' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {isAllowed ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{isAllowed ? t('caregiver.sec.allowed', 'Allowed') : t('caregiver.sec.restricted', 'Restricted')}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <p>{t('caregiver.sec.demo_disclaimer', 'Demo Functionality: Toggling consent controls updates active session proxy settings for demonstration without altering server auth policies.')}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CARE CIRCLE & DATA SHARING */}
      {activeTab === 'careCircle' && (
        <div className="space-y-6">
          {/* AUTHORIZED CARE CIRCLE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                {t('caregiver.consent.members', 'Care Circle Members')} — {currentPatientName}
              </h3>
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('caregiver.consent.add_member', 'Add Care Member')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {members.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-500">
                  {t('caregiver.common.no_data', 'No care circle members found.')}
                </div>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${member.bg || 'from-teal-500 to-cyan-500'} text-white font-black flex items-center justify-center shrink-0 shadow-sm text-xs`}>
                        {member.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 dark:text-white text-xs">{getLocalizedName(member.name, t)}</h4>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            {member.status === 'Active' ? t('caregiver.common.active', 'Active') : member.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{getLocalizedRelationship(member.role, t)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {member.accessLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
                    >
                      {t('caregiver.common.edit', 'Edit Access')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AUTHORIZED DATA SHARING MATRIX */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              {t('caregiver.sec.sharing_title', 'Authorized Data Sharing Matrix')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
              {t('caregiver.sec.sharing_desc', 'Entities currently authorized to view or manage care records for')} {currentPatientName}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { role: 'Primary Doctor', name: 'Dr. Rajesh Varma (Apollo Cardiology)', status: 'Authorized (Full Medical Access)' },
                { role: 'Home Care Nurse', name: 'Sister Sarah (Verified Nurse)', status: 'Authorized (Daily Care Log & Vitals)' },
                { role: 'Family Caregiver', name: 'Anita Sharma (Primary Guardian)', status: 'Authorized (Full Legal Proxy)' },
                { role: 'Healthcare Provider', name: 'Apollo Central Health City', status: 'Authorized (E-Prescription & Lab Sync)' },
              ].map((entity, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-600 dark:text-cyan-400">{entity.role}</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{getLocalizedName(entity.name, t)}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">{entity.status}</p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY & AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              {t('caregiver.consent.audit_history', 'Audit & Access History')} — {currentPatientName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Timestamped log of health information views and care updates recorded for security auditing.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5 font-bold">{t('caregiver.tasks.date_time', 'Timestamp')}</th>
                  <th className="pb-2.5 font-bold">{t('caregiver.consent.col_user', 'User')}</th>
                  <th className="pb-2.5 font-bold">{t('caregiver.consent.col_action', 'Event / Action')}</th>
                  <th className="pb-2.5 font-bold">{t('caregiver.consent.col_permission', 'Permission Scope')}</th>
                  <th className="pb-2.5 font-bold">{t('caregiver.common.status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {displayedAccessLogs.map((log: any, i: number) => (
                  <tr key={i} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3 whitespace-nowrap text-[11px] font-semibold text-slate-500">{log.date}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{getLocalizedName(log.user, t)}</td>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{log.action}</td>
                    <td className="py-3 text-[11px] font-semibold text-slate-500">{log.permission}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {log.status === 'Success' ? t('caregiver.common.success', 'Success') : log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY SPECS & EMERGENCY GUIDELINES */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* ACTIVE SECURITY SPECIFICATIONS */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              {t('caregiver.sec.security_title', 'Active Security Specifications')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Technical security controls protecting caregiver portal sessions and patient health telemetry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: t('caregiver.sec.sec_jwt', 'Secure JWT Session Authentication'), desc: t('caregiver.sec.sec_jwt_desc', 'Cryptographically signed bearer tokens with automatic session expiration.'), icon: ShieldCheck },
                { title: t('caregiver.sec.sec_rbac', 'Role-Based Access Control (RBAC)'), desc: t('caregiver.sec.sec_rbac_desc', 'Strict role isolation ensuring caregivers access only authorized ward IDs.'), icon: Lock },
                { title: t('caregiver.sec.sec_tls', 'Protected Health Info (PHI) Encryption'), desc: t('caregiver.sec.sec_tls_desc', 'End-to-end TLS 1.3 encryption in transit for all biometric and clinical data.'), icon: Activity },
                { title: t('caregiver.sec.sec_abdm', 'ABDM Digital Consent Framework'), desc: t('caregiver.sec.sec_abdm_desc', 'Proxy consent linked directly to ABDM Health ID credentials.'), icon: FileText },
              ].map((spec, idx) => {
                const IconComp = spec.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-cyan-900/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{spec.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{spec.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EMERGENCY ACCESS GUIDELINES */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              {t('caregiver.sec.emerg_title', 'Emergency Access Guidelines')}
            </h3>
            
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {t('caregiver.sec.emerg_desc', 'In critical emergency events, SOS dispatch broadcasts urgent telemetry to Apollo 108 emergency responders. Emergency viewing requires verified trauma team authorization and does not bypass account authentication.')}
            </p>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
              <span>{t('caregiver.sec.emerg_no_bypass', 'Notice: Emergency access protocols adhere strictly to authorized responder workflows.')}</span>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ACCESS MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedMember(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Edit Care Circle Access
                </h2>
                <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-bold">
                <div>
                  <label className="text-slate-500 uppercase text-[10px] block mb-1">Member Name</label>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{getLocalizedName(selectedMember.name, t)}</p>
                </div>
                <div>
                  <label className="text-slate-500 uppercase text-[10px] block mb-1">Role / Relationship</label>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{selectedMember.role}</p>
                </div>
                <div>
                  <label className="text-slate-500 uppercase text-[10px] block mb-1">Access Level</label>
                  <select 
                    defaultValue={selectedMember.accessLevel}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Full Legal Guardian">Full Legal Guardian</option>
                    <option value="Medical Proxy">Medical Proxy</option>
                    <option value="Limited Access">Limited Access</option>
                    <option value="Emergency Viewer">Emergency Viewer</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-between gap-3">
                <button
                  onClick={() => handleRemoveMember(selectedMember.id)}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 font-black text-xs"
                >
                  {t('caregiver.consent.remove_member', 'Remove Member')}
                </button>
                <button
                  onClick={() => {
                    showToast('Access permissions updated.');
                    setSelectedMember(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20"
                >
                  {t('caregiver.common.save', 'Save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MEMBER MODAL */}
      <AnimatePresence>
        {isAddMemberOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddMemberOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>{t('caregiver.consent.modal_title', 'Add Member to Care Circle')}</span>
                </h3>
                <button onClick={() => setIsAddMemberOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <form id="add-member-form" onSubmit={handleAddMember} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('caregiver.consent.full_name', 'Full Name')}</label>
                    <input
                      type="text"
                      required
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('caregiver.wards.relationship', 'Relationship / Role')}</label>
                      <input
                        type="text"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        placeholder="e.g. Family Caregiver"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('caregiver.consent.access_level', 'Access Level')}</label>
                      <select
                        value={newMember.accessLevel}
                        onChange={(e) => setNewMember({ ...newMember, accessLevel: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="Full Legal Guardian">Full Legal Guardian</option>
                        <option value="Medical Proxy">Medical Proxy</option>
                        <option value="Limited Access">Limited Access</option>
                        <option value="Emergency Viewer">Emergency Viewer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('caregiver.consent.email_address', 'Email Address')}</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="e.g. rajesh@example.com"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-3xl flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                >
                  {t('caregiver.common.cancel', 'Cancel')}
                </button>
                <button
                  form="add-member-form"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition-all"
                >
                  {t('caregiver.consent.send_invitation', 'Send Invitation')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

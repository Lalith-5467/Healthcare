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
  ShieldAlert
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
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  // New member form
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', accessLevel: 'Limited Access' });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Fetch backend wards
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

  // 2. Fetch Care Circle data from backend for selected ward
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
      console.error('Failed to load Care Circle data from server:', err);
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

  // 3. Add Care Circle Member
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
      console.error('Failed to add Care Circle member:', err);
      showToast(err?.response?.data?.message || 'Unable to add member to Care Circle.');
    }
  };

  // 4. Remove Care Circle Member
  const handleRemoveMember = async (targetCaregiverId: string) => {
    try {
      await caregiverApi.removeCareCircleMember(activeWardId, targetCaregiverId);
      showToast('Care Circle member removed successfully.');
      setSelectedMember(null);
      await fetchCareCircle(activeWardId);
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      showToast('Unable to remove member.');
    }
  };

  // 5. Toggle Patient Consent Status
  const handleToggleConsent = async () => {
    const nextStatus = consentStatus === 'Active' ? 'Revoked' : 'Active';
    try {
      await caregiverApi.toggleConsentStatus(activeWardId, nextStatus);
      setConsentStatus(nextStatus);
      showToast(`Patient consent status updated to ${nextStatus}!`);
      await fetchCareCircle(activeWardId);
    } catch (err: any) {
      console.error('Failed to update consent status:', err);
      showToast('Unable to update consent status on server.');
    }
  };

  const wardsList = dbWards.length > 0 ? dbWards.map((w, idx) => ({
    id: w.id,
    name: w.fullName || `Dependent ${idx + 1}`,
    relationship: 'Ward',
  })) : workflowWards;

  const rawPatientName = patientInfo?.fullName || wardsList.find(w => w.id === activeWardId)?.name || 'Active Patient';
  const currentPatientName = getLocalizedName(rawPatientName, t);

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

      {/* HEADER & WARD TABS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>{t('caregiver.consent.title', 'Care Circle & Consent')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('caregiver.consent.subtitle', 'Manage authorized people and control their access to patient care information.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* WARD SWITCHER PILLS */}
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

          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('caregiver.consent.add_member', 'Add Care Member')}</span>
          </button>
        </div>
      </div>

      {/* PATIENT SELECTOR & SUMMARY CARDS */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0 p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('caregiver.tasks.patient', 'Patient')}</p>
          <p className="text-xl font-black mb-3">{currentPatientName}</p>
          <div className={`flex items-center gap-2 text-xs font-bold ${consentStatus === 'Active' ? 'text-emerald-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {consentStatus === 'Active' ? <UserCheck className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{t('caregiver.consent.status_title', 'Patient Consent Status')}: {consentStatus === 'Active' ? t('caregiver.common.active', 'Active') : t('caregiver.consent.revoked_consent', 'Consent Revoked')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{t('caregiver.consent.members', 'Care Circle Members')}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{members.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-cyan-900/10 border border-teal-100 dark:border-teal-900/30 flex flex-col justify-center">
            <p className="text-[10px] font-black text-teal-700 dark:text-cyan-500 uppercase tracking-wider mb-1">{t('caregiver.wards.active_members', 'Active Members')}</p>
            <p className="text-2xl font-black text-teal-700 dark:text-cyan-400">{members.filter(m => m.status === 'Active').length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex flex-col justify-center">
            <p className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-1">{t('caregiver.tasks.pending', 'Pending')}</p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-400">0</p>
          </div>
          <div className={`p-4 rounded-2xl flex flex-col justify-center border ${
            consentStatus === 'Active' 
              ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30'
              : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30'
          }`}>
            <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${consentStatus === 'Active' ? 'text-emerald-700 dark:text-emerald-500' : 'text-rose-700 dark:text-rose-500'}`}>{t('caregiver.consent.status_title', 'Patient Consent Status')}</p>
            <p className={`text-lg font-black uppercase ${consentStatus === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>{consentStatus === 'Active' ? t('caregiver.common.active', 'Active') : t('caregiver.consent.revoked_consent', 'Consent Revoked')}</p>
          </div>
        </div>
      </div>

      {/* LOADING & ERROR STATES */}
      {loading && (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('caregiver.common.loading', 'Loading...')}</p>
        </div>
      )}

      {errorMsg && !loading && (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center flex flex-col items-center justify-center gap-2">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          <p className="text-sm font-black text-rose-600 dark:text-rose-400">{errorMsg}</p>
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* AUTHORIZED CARE CIRCLE SECTION */}
            <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                {t('caregiver.consent.members', 'Care Circle Members')}
              </h3>
              
              <div className="space-y-3">
                {members.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-500">
                    {t('caregiver.common.no_data', 'No data available')}
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${member.bg || 'from-teal-500 to-cyan-500'} text-white font-black flex items-center justify-center shrink-0 shadow-sm`}>
                          {member.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 dark:text-white">{getLocalizedName(member.name, t)}</h4>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                              {member.status === 'Active' ? t('caregiver.common.active', 'Active') : member.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{getLocalizedRelationship(member.role, t)}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {member.accessLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
                      >
                        {t('caregiver.common.edit', 'Edit')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ACCESS LOG SECTION */}
            <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                {t('caregiver.consent.audit_history', 'Audit & Access History')}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="pb-2 font-bold">{t('caregiver.tasks.date_time', 'Date')}</th>
                      <th className="pb-2 font-bold">{t('caregiver.consent.col_user', 'User')}</th>
                      <th className="pb-2 font-bold">{t('caregiver.consent.col_action', 'Action')}</th>
                      <th className="pb-2 font-bold">{t('caregiver.consent.col_permission', 'Permission')}</th>
                      <th className="pb-2 font-bold">{t('caregiver.common.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {accessLogs.map((log, i) => (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-2.5 whitespace-nowrap">{log.date}</td>
                        <td className="py-2.5 font-bold">{getLocalizedName(log.user, t)}</td>
                        <td className="py-2.5">{log.action}</td>
                        <td className="py-2.5">{log.permission}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            log.status === 'Success' 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                          }`}>
                            {log.status === 'Success' ? t('caregiver.common.success', 'Success') : log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* PATIENT CONSENT SECTION */}
            <div className="bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t('caregiver.consent.status_title', 'Patient Consent Status')}
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('caregiver.common.status', 'Status')}</p>
                    <p className={`font-black flex items-center gap-1.5 ${consentStatus === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {consentStatus === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />} 
                      {consentStatus === 'Active' ? t('caregiver.consent.active_consent', 'Active Consent Granted') : t('caregiver.consent.revoked_consent', 'Consent Revoked')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('caregiver.tasks.patient', 'Patient')}</p>
                    <p className="font-black">{currentPatientName}</p>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleToggleConsent}
                      className={`py-2 px-3 rounded-xl bg-transparent border font-bold transition-colors text-xs ${
                        consentStatus === 'Active'
                          ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {consentStatus === 'Active' ? t('caregiver.consent.revoke_consent', 'Revoke Consent') : t('caregiver.consent.restore_consent', 'Restore Consent')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ACCESS DRAWER */}
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
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Manage Access
                </h2>
                <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedMember.bg || 'from-teal-500 to-cyan-500'} text-white font-black flex items-center justify-center text-xl shadow-md`}>
                    {selectedMember.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedMember.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{selectedMember.role}</p>
                    <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      {selectedMember.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-500">Access Level</label>
                  <select 
                    defaultValue={selectedMember.accessLevel}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option>Full Access</option>
                    <option>Care Access</option>
                    <option>Limited Access</option>
                    <option>View Only</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-500">Information Permissions</label>
                  
                  <div className="space-y-3 text-xs">
                    {[
                      { key: 'updates', label: 'Care Updates' },
                      { key: 'appointments', label: 'Appointments' },
                      { key: 'notes', label: 'Care Notes' },
                      { key: 'observations', label: 'Health Observations' },
                      { key: 'meds', label: 'Medication Information' }
                    ].map(({key, label}) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{label}</span>
                        <button className={`p-0.5 rounded-full transition-colors ${selectedMember.permissions[key] ? 'text-teal-500' : 'text-slate-300 dark:text-slate-600'}`}>
                          {selectedMember.permissions[key] ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col gap-3">
                <button 
                  onClick={() => {
                    showToast('Permissions saved successfully!');
                    setSelectedMember(null);
                  }}
                  className="w-full py-3 rounded-xl text-xs font-black bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all"
                >
                  Save Permissions
                </button>
                <button 
                  onClick={() => handleRemoveMember(selectedMember.id)}
                  className="w-full py-3 rounded-xl text-xs font-black text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 dark:bg-transparent dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/10 transition-colors"
                >
                  Remove Member
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MEMBER MODAL */}
      <AnimatePresence>
        {isAddMemberOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddMemberOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Add Care Circle Member</span>
                </h3>
                <button onClick={() => setIsAddMemberOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Relationship / Role</label>
                      <input
                        type="text"
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                        placeholder="e.g. Son, Nurse"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Access Level</label>
                      <select
                        value={newMember.accessLevel}
                        onChange={(e) => setNewMember({...newMember, accessLevel: e.target.value})}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                      >
                        <option>Care Access</option>
                        <option>Limited Access</option>
                        <option>View Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Email / Phone</label>
                    <input
                      type="text"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      placeholder="Contact details for invitation..."
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-500 mb-2">They will receive an invitation link to join the Care Circle. You can manage their specific information permissions after they accept.</p>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-3xl flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t('caregiver.common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
                  >
                    {t('caregiver.consent.send_invitation', 'Send Invitation')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONSENT DOCUMENT MODAL */}
      <AnimatePresence>
        {isDocumentOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsDocumentOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Consent Document</span>
                </h3>
                <button onClick={() => setIsDocumentOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="w-full h-72 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium space-y-4">
                  <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Medical Information Release</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Signed Consent Agreement • 28 Aug 2026</p>
                  </div>
                  <p>
                    I, <strong>{currentPatientName}</strong>, hereby authorize my designated caregivers and members of my Care Circle to access, view, and manage my personal health information within the MediCare platform.
                  </p>
                  <p>
                    This consent includes, but is not limited to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-bold">
                    <li>Medical history and current treatments</li>
                    <li>Medication schedules and adherence logs</li>
                    <li>Clinical observations and daily care notes</li>
                    <li>Upcoming and past medical appointments</li>
                  </ul>
                  <p>
                    I understand that this consent will remain active until <strong>28 Aug 2027</strong> unless revoked earlier.
                  </p>
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">E-Signature</p>
                      <p className="font-black text-slate-900 dark:text-white italic">{currentPatientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Date</p>
                      <p className="font-black text-slate-900 dark:text-white">28 Aug 2026</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsDocumentOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition-colors"
                >
                  Close Viewer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


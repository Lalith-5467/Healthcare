import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  Syringe,
  Activity,
  X,
  User,
  AlertCircle,
  Pill,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  getLocalizedName, 
  getLocalizedRecordTitle, 
  getLocalizedRecordType, 
  getLocalizedRelationship 
} from '../../../utils/caregiverDataTranslator';
import { MOCK_ABHA_DEPENDENTS, type AbhaDependentProfile, type AbhaRecordItem } from '../../../mocks/caregiverAbhaRecordsMock';

export const CaregiverAbhaRecordsView: React.FC = () => {
  const { t } = useLanguage();

  // Dependents list from isolated mock data (Arun Raj default)
  const dependents = MOCK_ABHA_DEPENDENTS;
  const [selectedDepId, setSelectedDepId] = useState<string>('dep-arun-raj');

  const [activeTab, setActiveTab] = useState<string>('All Records');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AbhaRecordItem | null>(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active dependent profile object
  const activeDependent: AbhaDependentProfile = useMemo(() => {
    return dependents.find(d => d.id === selectedDepId) || dependents[0];
  }, [selectedDepId, dependents]);

  const TABS = [
    { id: 'All Records', label: t('caregiver.records.filter_all', 'All Records') },
    { id: 'Consultations', label: t('caregiver.records.tab_medical', 'Consultations') },
    { id: 'Prescriptions', label: t('caregiver.records.tab_prescriptions', 'Prescriptions') },
    { id: 'Lab Reports', label: t('caregiver.records.tab_lab', 'Lab Reports') },
    { id: 'Vaccinations', label: t('caregiver.records.tab_vaccination', 'Vaccinations') }
  ];

  // Filter records based on selected Tab & Search Query for active dependent
  const filteredRecords = useMemo(() => {
    return activeDependent.records.filter(record => {
      const matchesTab = activeTab === 'All Records' || record.category === activeTab;
      
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesTab;

      const titleMatch = record.title.toLowerCase().includes(query) || getLocalizedRecordTitle(record.title, t).toLowerCase().includes(query);
      const providerMatch = record.provider.toLowerCase().includes(query) || getLocalizedName(record.provider, t).toLowerCase().includes(query);
      const facilityMatch = record.facility.toLowerCase().includes(query);
      const typeMatch = record.type.toLowerCase().includes(query);
      const diagnosisMatch = (record.diagnosis || '').toLowerCase().includes(query);
      const summaryMatch = (record.summary || '').toLowerCase().includes(query);
      const notesMatch = (record.notes || '').toLowerCase().includes(query);
      const medsMatch = record.medications ? record.medications.some(m => m.medicineName.toLowerCase().includes(query)) : false;

      return matchesTab && (titleMatch || providerMatch || facilityMatch || typeMatch || diagnosisMatch || summaryMatch || notesMatch || medsMatch);
    });
  }, [activeDependent, activeTab, searchQuery, t]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setToastMsg('ABHA Records synchronized with ABDM Health Locker');
      setTimeout(() => setToastMsg(null), 3000);
    }, 1000);
  };

  const handleDownload = (recordToDownload?: AbhaRecordItem | null) => {
    const target = recordToDownload || selectedRecord || filteredRecords[0];
    if (!target) return;

    const fileTitle = getLocalizedRecordTitle(target.title, t);
    const reportContent = `================================================================================
                       ABHA DIGITAL HEALTH RECORD
================================================================================

PATIENT INFORMATION:
- Name: ${activeDependent.name}
- ABHA Address: ${activeDependent.abhaId}
- Age / Gender: ${activeDependent.age} yrs / ${activeDependent.gender}
- Blood Group: ${activeDependent.bloodGroup}
- Relationship: ${activeDependent.relationship}

RECORD DETAILS:
- Record Title: ${fileTitle}
- Category: ${target.category}
- Record Type: ${target.type}
- Date: ${target.date}
- Healthcare Provider: ${target.provider}
- Facility / Hospital: ${target.facility}
- Status: ${target.status}

CLINICAL SUMMARY:
--------------------------------------------------------------------------------
${target.summary}

${target.diagnosis ? `Diagnosis: ${target.diagnosis}\n` : ''}
${target.notes ? `Clinical Notes: ${target.notes}\n` : ''}

- Document Verification Code: ABHA-MOCK-${Math.floor(100000 + Math.random() * 900000)}
- Generated on: ${new Date().toLocaleString('en-GB')}
Official Digital Health Record generated via MediCare Healthcare System.
================================================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanFileName = `${activeDependent.name}_${fileTitle}_${target.date}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${cleanFileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMsg(`Downloaded ${fileTitle}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6 pb-24 select-none">
      
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

      {/* HEADER & PRIVACY BANNER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.records.title', 'ABHA Health Records')}</span>
            </h1>

            {/* PRIVACY INDICATOR BANNER */}
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
              {t('caregiver.records.mock_privacy_notice', 'Mock Health Records • For demonstration purposes only')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('caregiver.records.subtitle', 'Access and organize authorized digital health records for your dependents.')}
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? t('caregiver.records.syncing', 'Syncing...') : t('caregiver.records.sync_btn', 'Sync Records')}</span>
        </button>
      </div>

      {/* DEPENDENT SELECTOR & ABHA PROFILE SUMMARY CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DEPENDENT SELECTOR DROPDOWN */}
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
            {t('caregiver.records.select_dependent', 'Select Dependent')}
          </label>
          <select 
            value={selectedDepId}
            onChange={(e) => {
              setSelectedDepId(e.target.value);
              setSelectedRecord(null);
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-black text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            {dependents.map(dep => (
              <option key={dep.id} value={dep.id}>
                {getLocalizedName(dep.name, t)} ({getLocalizedRelationship(dep.relationship, t)})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 font-semibold">
            Showing health locker data for <strong className="text-slate-700 dark:text-slate-200">{getLocalizedName(activeDependent.name, t)}</strong>
          </p>
        </div>

        {/* ABHA PROFILE SUMMARY CARD */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black text-lg shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{getLocalizedName(activeDependent.name, t)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {getLocalizedRelationship(activeDependent.relationship, t)}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  ABHA ID: <strong className="text-slate-800 dark:text-slate-200">{activeDependent.abhaId}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {activeDependent.recordStatus}
              </span>
            </div>
          </div>

          {/* Profile Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Age / Gender</p>
              <p className="font-black text-slate-900 dark:text-white">{activeDependent.age} yrs • {activeDependent.gender}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Blood Group</p>
              <p className="font-black text-rose-600 dark:text-rose-400">{activeDependent.bloodGroup}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">{t('caregiver.records.last_synced', 'Last Updated')}</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">{activeDependent.lastUpdated}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Records</p>
              <p className="font-black text-teal-600 dark:text-cyan-400">{activeDependent.records.length} Documents</p>
            </div>
          </div>

          {/* Quick Badges: Allergies & Medications */}
          <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
            {activeDependent.allergies.length > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>{t('caregiver.records.allergies_label', 'Allergies')}: {activeDependent.allergies.join(', ')}</span>
              </span>
            )}
            {activeDependent.currentMedications.length > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-teal-900/40 font-bold flex items-center gap-1">
                <Pill className="w-3 h-3 text-teal-500" />
                <span>{t('caregiver.records.meds_label', 'Medications')}: {activeDependent.currentMedications.join(', ')}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH INPUT */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-teal-500 text-slate-950 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('caregiver.records.search_placeholder', 'Search health records...')} 
            className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-full pl-9 pr-8 py-2 text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN RECORDS DISPLAY & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECORDS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{activeTab === 'All Records' ? t('caregiver.records.recent_records', 'Recent Records') : `${activeTab}`}</span>
            </span>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredRecords.length} document{filteredRecords.length !== 1 ? 's' : ''}
            </span>
          </h3>

          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {t('caregiver.records.no_records_category', 'No records found for this category.')}
                </p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-teal-500/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {record.type === 'Consultation' && <Activity className="w-5 h-5 text-indigo-500" />}
                      {record.type === 'Prescription' && <FileText className="w-5 h-5 text-teal-500" />}
                      {record.type === 'Lab Report' && <HeartPulse className="w-5 h-5 text-rose-500" />}
                      {record.type === 'Vaccination' && <Syringe className="w-5 h-5 text-emerald-500" />}
                      {record.type === 'Diagnosis' && <Building2 className="w-5 h-5 text-amber-500" />}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                        {getLocalizedRecordTitle(record.title, t)}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {record.date} • {getLocalizedName(record.provider, t)} ({record.facility})
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1 font-medium">
                        {record.summary}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                          {getLocalizedRecordType(record.type, t)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {record.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button 
                      onClick={() => setSelectedRecord(record)} 
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 text-slate-900 dark:text-white"
                    >
                      <Eye className="w-4 h-4" /> {t('caregiver.common.view', 'View Record')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TIMELINE & HEALTH SUMMARY */}
        <div className="space-y-6">
          
          {/* ACCESS STATUS & LOCKER CARD */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.records.sec_access', 'Health Record Access')}</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('caregiver.common.status', 'Locker Status')}</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeDependent.recordStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('caregiver.records.access_granted', 'Access Granted')}</span>
                <span className="font-bold text-slate-900 dark:text-white">28 Aug 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('caregiver.records.access_expires', 'Access Expires')}</span>
                <span className="font-bold text-slate-900 dark:text-white">28 Aug 2027</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('caregiver.records.source', 'Source')}</span>
                <span className="font-bold text-slate-900 dark:text-white">{t('caregiver.records.digital_consent', 'ABDM Health Locker')}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {t('caregiver.records.manage_consent_hint', 'Manage consent permissions in Care Circle & Consent.')}
            </p>
          </div>

          {/* TIMELINE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.records.timeline_title', 'Record Timeline')}</span>
            </h3>
            
            <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800 ml-2">
              {activeDependent.records.length === 0 ? (
                <p className="pl-6 text-xs text-slate-400 font-bold py-2">No timeline events recorded yet.</p>
              ) : (
                activeDependent.records.map((record) => (
                  <div key={`tl-${record.id}`} className="relative pl-8 py-3 group cursor-pointer" onClick={() => setSelectedRecord(record)}>
                    <div className="absolute left-1 top-4 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-[#0b1120] -ml-[5px] group-hover:bg-teal-500 transition-colors" />
                    <p className="text-[10px] font-black text-slate-400 mb-0.5">{record.date}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {getLocalizedRecordType(record.type, t)} Added
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{getLocalizedName(record.provider, t)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RECORD DETAILS MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedRecord(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <span>{t('caregiver.records.details_title', 'Health Record Details')}</span>
                </span>
                <button 
                  onClick={() => setSelectedRecord(null)} 
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {getLocalizedRecordTitle(selectedRecord.title, t)}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {getLocalizedRecordType(selectedRecord.type, t)} • {selectedRecord.date}
                  </p>
                </div>

                {/* Record Metadata Card */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Patient</span>
                    <span className="font-black text-slate-900 dark:text-white">{activeDependent.name} ({activeDependent.abhaId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Healthcare Provider</span>
                    <span className="font-black text-slate-900 dark:text-white">{getLocalizedName(selectedRecord.provider, t)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Facility / Hospital</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedRecord.facility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Record Status</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedRecord.status}
                    </span>
                  </div>
                </div>

                {/* Prescription Items breakdown */}
                {selectedRecord.type === 'Prescription' && selectedRecord.medications && selectedRecord.medications.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Prescribed Medications</h4>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedRecord.medications.map((med, idx) => (
                        <div key={idx} className="p-3 text-xs flex justify-between items-start">
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">{med.medicineName} {med.dosage}{med.unit}</p>
                            <p className="text-slate-500 text-[11px]">{med.instructions || 'Take as directed'}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-cyan-300 font-bold text-[10px]">
                            {med.frequency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Results Table breakdown */}
                {selectedRecord.type === 'Lab Report' && selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Laboratory Test Results</h4>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase text-[10px] font-bold">
                          <tr>
                            <th className="p-2.5 px-3">Test</th>
                            <th className="p-2.5 px-3">Result</th>
                            <th className="p-2.5 px-3">Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {selectedRecord.labResults.map((res, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 px-3 font-bold text-slate-900 dark:text-white">{res.testName}</td>
                              <td className="p-2.5 px-3 font-black text-slate-800 dark:text-slate-200">
                                {res.result} {res.unit}
                              </td>
                              <td className="p-2.5 px-3 text-slate-500 text-[11px]">{res.referenceRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Clinical Summary & Notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Clinical Summary & Diagnosis</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                    {selectedRecord.diagnosis && (
                      <p><strong className="text-slate-900 dark:text-white">Diagnosis:</strong> {selectedRecord.diagnosis}</p>
                    )}
                    <p><strong className="text-slate-900 dark:text-white">Summary:</strong> {selectedRecord.summary}</p>
                    {selectedRecord.notes && (
                      <p><strong className="text-slate-900 dark:text-white">Doctor Notes:</strong> {selectedRecord.notes}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] flex gap-3">
                <button 
                  onClick={() => setIsFullViewOpen(true)} 
                  className="flex-1 py-3 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-colors text-slate-900 dark:text-white"
                >
                  <Eye className="w-4 h-4" /> {t('caregiver.records.full_view', 'Full View')}
                </button>
                <button 
                  onClick={() => handleDownload(selectedRecord)} 
                  className="flex-1 py-3 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                >
                  <Download className="w-4 h-4" /> {t('caregiver.records.download_pdf', 'Download Document')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL VIEW MODAL */}
      <AnimatePresence>
        {isFullViewOpen && selectedRecord && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsFullViewOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-4xl h-full sm:max-h-[90vh] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Full View Header */}
              <div className="bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <h3 className="font-black leading-tight text-sm">{selectedRecord.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{selectedRecord.type} • {selectedRecord.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownload(selectedRecord)} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsFullViewOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Document Sheet */}
              <div className="flex-1 overflow-y-auto bg-slate-900 sm:bg-slate-950 p-0 sm:p-8 custom-scrollbar relative">
                <div className="max-w-3xl mx-auto bg-white min-h-full sm:min-h-[800px] p-6 sm:p-16 shadow-2xl sm:rounded-xl text-slate-800 relative z-10">
                  
                  {/* Letterhead */}
                  <div className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">{selectedRecord.facility}</h1>
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-1">Official {selectedRecord.type} Record</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 w-full sm:w-auto">
                      <p className="font-black text-slate-900 mb-1">PATIENT & RECORD</p>
                      <p className="text-slate-600"><span className="font-bold">Patient:</span> {activeDependent.name}</p>
                      <p className="text-slate-600"><span className="font-bold">ABHA ID:</span> {activeDependent.abhaId}</p>
                      <p className="text-slate-600"><span className="font-bold">Date:</span> {selectedRecord.date}</p>
                      <p className="text-slate-600"><span className="font-bold">Provider:</span> {selectedRecord.provider}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black mb-6 text-slate-900 border-l-4 border-slate-900 pl-4">{selectedRecord.title}</h2>
                  
                  <div className="text-sm sm:text-base leading-relaxed space-y-6">
                    {selectedRecord.type === 'Prescription' && selectedRecord.medications && selectedRecord.medications.length > 0 ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-900 text-white">
                            <tr>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs">Medication</th>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs">Dosage</th>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs">Frequency & Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedRecord.medications.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-black text-slate-900">{item.medicineName}</td>
                                <td className="p-4 text-slate-700 font-medium">{item.dosage} {item.unit}</td>
                                <td className="p-4 text-slate-700">{item.frequency} <span className="text-slate-500 text-xs ml-1">({item.instructions || 'Take as directed'})</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Clinical Summary & Diagnosis</h4>
                          <p className="text-slate-700">{selectedRecord.summary}</p>
                          {selectedRecord.notes && (
                            <p className="text-slate-600 mt-2 text-xs"><strong>Doctor Notes:</strong> {selectedRecord.notes}</p>
                          )}
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">ABDM Health Locker Verification</h4>
                          <p className="text-slate-700">Record cryptographically signed and verified in ABDM Health Locker for {activeDependent.name} ({activeDependent.abhaId}).</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Digital Signature */}
                  <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-bold text-sm">Digitally Signed & Verified</span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">ABHA-HASH: 8f9a2b4c6d...e1f3a5b7c9</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-slate-400 pb-2 mb-2 px-8">
                        <span className="font-[signature] text-3xl opacity-60 italic">{selectedRecord.provider.replace('Dr. ', '')}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{selectedRecord.provider}</p>
                      <p className="text-xs text-slate-500">Authorized Signatory</p>
                    </div>
                  </div>

                  {/* Watermark inside full view */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.02] pointer-events-none z-0 text-slate-900">
                    <ShieldCheck className="w-48 h-48 sm:w-80 sm:h-80 mb-4" />
                    <p className="text-4xl sm:text-7xl font-black uppercase tracking-widest text-center rotate-[-15deg]">Verified<br/>ABHA Record</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

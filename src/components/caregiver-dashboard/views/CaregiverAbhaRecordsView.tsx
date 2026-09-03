import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  Syringe,
  Activity,
  X
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

const MOCK_RECORDS = [
  { id: 1, type: 'Consultation', title: 'Cardiology Follow-up', date: '30 Aug 2026', provider: 'Dr. Ramesh Kumar', facility: 'Apollo Hospital', category: 'Medical Records', status: 'Available' },
  { id: 2, type: 'Prescription', title: 'Hypertension Meds', date: '30 Aug 2026', provider: 'Dr. Ramesh Kumar', facility: 'Apollo Hospital', category: 'Prescriptions', status: 'Available' },
  { id: 3, type: 'Lab Report', title: 'Lipid Profile', date: '28 Aug 2026', provider: 'Sample Diagnostics', facility: 'Sample Diagnostics', category: 'Lab Reports', status: 'Available' },
  { id: 4, type: 'Discharge Summary', title: 'Post-Surgery Summary', date: '25 Aug 2026', provider: 'Sample Hospital', facility: 'Sample Hospital', category: 'Hospital Records', status: 'Available' },
  { id: 5, type: 'Vaccination', title: 'Influenza Vaccine', date: '02 Aug 2026', provider: 'Dr. Smitha', facility: 'City Clinic', category: 'Vaccination', status: 'Completed' },
];

export const CaregiverAbhaRecordsView: React.FC = () => {
  const { wards, activeWard, setActiveWardId } = useCaregiverWorkflow();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('02 Sep 2026, 09:42 AM');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const TABS = ['Overview', 'Medical Records', 'Prescriptions', 'Lab Reports', 'Hospital Records', 'Vaccination'];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }, 2000);
  };

  const handleFullView = () => {
    setIsFullViewOpen(true);
  };

  const handleDownload = () => {
    setToastMsg('Downloading health record PDF...');
    setTimeout(() => setToastMsg(null), 3000);
  };

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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>ABHA Health Records</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Access and organize authorized digital health records for your dependents.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Records'}</span>
        </button>
      </div>

      {/* DEPENDENT SELECTOR & CONNECTION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SELECTOR */}
        <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
            Select Dependent
          </label>
          <select 
            value={activeWard.id}
            onChange={(e) => setActiveWardId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-black text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          >
            {wards.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.relationship})</option>
            ))}
          </select>
        </div>

        {/* ABHA STATUS CARD */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <h3 className="font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" /> ABHA Health Account
            </h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Status</p>
                <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Connected</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Records</p>
                <p className="font-black text-slate-900 dark:text-white">24 Available</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">New</p>
                <p className="font-black text-amber-600 dark:text-amber-400">3 Unread</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Last Synced</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{lastSynced}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search health records..." 
            className="w-full bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECORDS LIST */}
        <div className="lg:col-span-2 space-y-4">
          
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Total Records</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">24</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Recent Records</p>
                <p className="text-xl font-black text-teal-600 dark:text-teal-400">3</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Last Consultation</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">30 Aug 2026</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Access Status</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Authorized</p>
              </div>
            </div>
          )}

          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            {activeTab === 'Overview' ? 'Recent Records' : `${activeTab} Records`}
          </h3>

          <div className="space-y-3">
            {MOCK_RECORDS.filter(r => activeTab === 'Overview' || r.category === activeTab).map(record => (
              <div key={record.id} className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-teal-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {record.type === 'Consultation' && <Activity className="w-5 h-5 text-indigo-500" />}
                    {record.type === 'Prescription' && <FileText className="w-5 h-5 text-teal-500" />}
                    {record.type === 'Lab Report' && <Activity className="w-5 h-5 text-rose-500" />}
                    {record.type === 'Discharge Summary' && <Building2 className="w-5 h-5 text-amber-500" />}
                    {record.type === 'Vaccination' && <Syringe className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">{record.title}</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">{record.date} • {record.provider}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                        {record.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {record.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button onClick={() => setSelectedRecord(record)} className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ))}

            {MOCK_RECORDS.filter(r => activeTab === 'Overview' || r.category === activeTab).length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="font-bold text-slate-500">No {activeTab.toLowerCase()} available.</p>
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE & ACCESS STATUS */}
        <div className="space-y-6">
          
          {/* ACCESS STATUS CARD */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              Health Record Access
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Status</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Authorized</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Access Granted</span>
                <span className="font-bold text-slate-900 dark:text-white">28 Aug 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Access Expires</span>
                <span className="font-bold text-slate-900 dark:text-white">28 Aug 2027</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Source</span>
                <span className="font-bold text-slate-900 dark:text-white">Digital Consent</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">
              Manage consent permissions in Care Circle & Consent.
            </p>
          </div>

          {/* TIMELINE */}
          <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              Record Timeline
            </h3>
            
            <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800 ml-2">
              {MOCK_RECORDS.map((record, i) => (
                <div key={record.id} className="relative pl-8 py-3 group cursor-pointer" onClick={() => setSelectedRecord(record)}>
                  <div className="absolute left-1 top-4 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-[#0b1120] -ml-[5px] group-hover:bg-teal-500 transition-colors" />
                  <p className="text-[10px] font-black text-slate-400 mb-0.5">{record.date}</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{record.type} Added</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{record.provider}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* RECORD DETAILS MODAL/DRAWER */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedRecord(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md max-h-[90vh] rounded-3xl overflow-hidden bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800"
            >
              <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  Health Record Details
                </span>
                <button onClick={() => setSelectedRecord(null)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedRecord.title}</h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">{selectedRecord.type} • {selectedRecord.date}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Provider</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedRecord.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Facility</span>
                    <span className="font-black text-slate-900 dark:text-white">{selectedRecord.facility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Record Status</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {selectedRecord.status}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 font-bold">Last Synced</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lastSynced}</span>
                  </div>
                </div>

                <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative shadow-inner">
                  {/* Mock Document Header */}
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-500">{selectedRecord.facility}</span>
                    <span className="text-[10px] font-bold text-slate-400">{selectedRecord.date}</span>
                  </div>
                  {/* Mock Document Content */}
                  <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar text-left relative z-10 flex-1 bg-white text-slate-800">
                    <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 mb-2">
                      {selectedRecord.title}
                    </h3>
                    
                    {selectedRecord.type === 'Consultation' && (
                      <div className="space-y-2 text-[10px] text-slate-700">
                        <p><strong className="text-slate-900">Chief Complaint:</strong> Patient reported mild chest discomfort and shortness of breath.</p>
                        <p><strong className="text-slate-900">Diagnosis:</strong> Stable Angina, Hypertension.</p>
                        <p><strong className="text-slate-900">Plan:</strong> Continue current medication, schedule echo in 3 months.</p>
                      </div>
                    )}
                    {selectedRecord.type === 'Prescription' && (
                      <div className="space-y-2 text-[10px] text-slate-700">
                        <p className="flex justify-between border-b border-slate-100 pb-1"><strong className="text-slate-900">Amlodipine 5mg</strong> <span>1-0-0 (Morning)</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-1"><strong className="text-slate-900">Atorvastatin 20mg</strong> <span>0-0-1 (Night)</span></p>
                      </div>
                    )}
                    {selectedRecord.type === 'Lab Report' && (
                      <div className="space-y-2 text-[10px] text-slate-700">
                        <p className="flex justify-between border-b border-slate-100 pb-1"><strong className="text-slate-900">Total Cholesterol</strong> <span className="text-rose-600 font-bold">240 mg/dL (High)</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-1"><strong className="text-slate-900">HDL</strong> <span>45 mg/dL (Normal)</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-1"><strong className="text-slate-900">LDL</strong> <span className="text-rose-600 font-bold">160 mg/dL (High)</span></p>
                      </div>
                    )}
                    {selectedRecord.type === 'Discharge Summary' && (
                      <div className="space-y-2 text-[10px] text-slate-700">
                        <p><strong className="text-slate-900">Admission Date:</strong> 22 Aug 2026</p>
                        <p><strong className="text-slate-900">Discharge Date:</strong> 25 Aug 2026</p>
                        <p><strong className="text-slate-900">Procedure:</strong> Coronary Angiography</p>
                        <p><strong className="text-slate-900">Condition on Discharge:</strong> Stable</p>
                      </div>
                    )}
                    {selectedRecord.type === 'Vaccination' && (
                      <div className="space-y-2 text-[10px] text-slate-700">
                        <p><strong className="text-slate-900">Vaccine:</strong> Quadrivalent Influenza</p>
                        <p><strong className="text-slate-900">Dose:</strong> 0.5 ml IM</p>
                        <p><strong className="text-slate-900">Batch:</strong> INF-2026-X89</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Watermark */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none z-0 text-slate-900">
                    <ShieldCheck className="w-24 h-24 mb-2" />
                    <p className="text-lg font-black uppercase tracking-widest text-center rotate-[-15deg]">Verified<br/>ABHA Record</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] flex gap-3">
                <button onClick={handleFullView} className="flex-1 py-3 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-colors">
                  <Eye className="w-4 h-4" /> Full View
                </button>
                <button onClick={handleDownload} className="flex-1 py-3 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20">
                  <Download className="w-4 h-4" /> Download PDF
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
              {/* Header */}
              <div className="bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <h3 className="font-black leading-tight text-sm">{selectedRecord.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{selectedRecord.type} • {selectedRecord.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleDownload} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsFullViewOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
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
                      <p className="font-black text-slate-900 mb-1">RECORD DETAILS</p>
                      <p className="text-slate-600"><span className="font-bold">Date:</span> {selectedRecord.date}</p>
                      <p className="text-slate-600"><span className="font-bold">Provider:</span> {selectedRecord.provider}</p>
                      <p className="text-slate-600"><span className="font-bold">ID:</span> REC-{Math.floor(Math.random() * 100000)}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black mb-10 text-slate-900 border-l-4 border-slate-900 pl-4">{selectedRecord.title}</h2>
                  
                  <div className="text-sm sm:text-base leading-relaxed space-y-8">
                    {selectedRecord.type === 'Consultation' && (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Chief Complaint</h4>
                          <p className="text-slate-700">Patient reported mild chest discomfort and shortness of breath upon exertion. Symptoms have been present for the last two weeks. No radiation of pain or diaphoresis noted.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Diagnosis</h4>
                          <ul className="list-disc list-inside text-slate-700 space-y-1">
                            <li>Stable Angina</li>
                            <li>Essential Hypertension</li>
                          </ul>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Plan & Recommendations</h4>
                          <p className="text-slate-700">Continue current medication regimen. Avoid strenuous activity. Patient advised on dietary modifications (low sodium, heart-healthy diet). Schedule a follow-up echocardiogram in 3 months.</p>
                        </div>
                      </div>
                    )}
                    {selectedRecord.type === 'Prescription' && (
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
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-black text-slate-900">Amlodipine</td>
                              <td className="p-4 text-slate-700 font-medium">5mg</td>
                              <td className="p-4 text-slate-700">1-0-0 <span className="text-slate-500 text-xs ml-1">(Morning after food)</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-black text-slate-900">Atorvastatin</td>
                              <td className="p-4 text-slate-700 font-medium">20mg</td>
                              <td className="p-4 text-slate-700">0-0-1 <span className="text-slate-500 text-xs ml-1">(Night after food)</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {selectedRecord.type === 'Lab Report' && (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-900 text-white">
                            <tr>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs">Test Parameter</th>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs">Result</th>
                              <th className="p-4 font-bold uppercase tracking-wider text-xs hidden sm:table-cell">Reference Range</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-black text-slate-900">Total Cholesterol</td>
                              <td className="p-4 font-black text-rose-600 bg-rose-50 border-l-2 border-rose-500">240 mg/dL <span className="inline-block bg-rose-200 text-rose-800 text-[10px] uppercase px-2 py-0.5 rounded-full ml-2">High</span></td>
                              <td className="p-4 text-slate-500 hidden sm:table-cell">&lt; 200 mg/dL</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-black text-slate-900">HDL</td>
                              <td className="p-4 font-bold text-emerald-600 bg-emerald-50 border-l-2 border-emerald-500">45 mg/dL</td>
                              <td className="p-4 text-slate-500 hidden sm:table-cell">&gt; 40 mg/dL</td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-black text-slate-900">LDL</td>
                              <td className="p-4 font-black text-rose-600 bg-rose-50 border-l-2 border-rose-500">160 mg/dL <span className="inline-block bg-rose-200 text-rose-800 text-[10px] uppercase px-2 py-0.5 rounded-full ml-2">High</span></td>
                              <td className="p-4 text-slate-500 hidden sm:table-cell">&lt; 100 mg/dL</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {selectedRecord.type === 'Discharge Summary' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Admission Date</h4>
                          <p className="text-slate-700 text-lg">22 Aug 2026</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Discharge Date</h4>
                          <p className="text-slate-700 text-lg">25 Aug 2026</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Procedure Performed</h4>
                          <p className="text-slate-700">Coronary Angiography via radial approach.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Condition on Discharge</h4>
                          <p className="text-slate-700 text-emerald-600 font-bold">Stable, mobilizing independently, hemodynamically sound.</p>
                        </div>
                      </div>
                    )}
                    {selectedRecord.type === 'Vaccination' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Vaccine Administered</h4>
                          <p className="text-slate-700 text-xl font-bold">Quadrivalent Influenza (Flu)</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Dose & Route</h4>
                          <p className="text-slate-700">0.5 ml, Intramuscular (IM)</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">Batch Number</h4>
                          <p className="text-slate-700 font-mono bg-slate-200 px-2 py-1 rounded inline-block">INF-2026-X89</p>
                        </div>
                        <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 sm:col-span-2">
                          <h4 className="font-black text-teal-900 uppercase tracking-widest text-xs mb-1">Next Due</h4>
                          <p className="text-teal-800 font-bold">Annual booster recommended next year (Aug 2027).</p>
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
                      <p className="text-xs text-slate-500 font-mono">HASH: 8f9a2b4c6d...e1f3a5b7c9</p>
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

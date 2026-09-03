import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverWardsView: React.FC = () => {
  const { wards, activeWard, setActiveWardId } = useCaregiverWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedDependent, setSelectedDependent] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddModalOpen(false);
    setToastMsg('Dependent added successfully');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Stable' || status === 'Active Care') return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50';
    if (status === 'Needs Attention') return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50';
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
            <Users className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>My Wards & Dependents</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage the people under your care and quickly access their care information.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dependent</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-teal-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Dependents</p>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{wards.length}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Care</p>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{wards.length}</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Upcoming Appts</p>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">4</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pending Tasks</p>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">6</p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0b1120] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-96 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Dependents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Active', 'Needs Attention'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-slate-900 text-white dark:bg-teal-500/20 dark:text-teal-400' 
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* DEPENDENT CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {wards.map((ward, idx) => (
          <div key={ward.id} className={`rounded-3xl bg-white dark:bg-[#0b1120] border-2 shadow-lg overflow-hidden transition-all hover:-translate-y-1 ${ward.id === activeWard.id ? 'border-teal-500 dark:border-teal-500/50 shadow-teal-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800/60 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${idx === 0 ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {ward.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">{ward.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{ward.relationship}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(idx === 1 ? 'Needs Attention' : 'Stable')}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {idx === 1 ? 'Needs Attention' : 'Active Care'}
              </span>
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Assigned Caregiver</span>
                <span className="font-black text-slate-900 dark:text-white">Anita Sharma</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Today's Tasks</span>
                <span className="font-black text-amber-600 dark:text-amber-400">{3 - idx} Pending</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Next Appointment</span>
                <span className="font-black text-slate-900 dark:text-white">0{5 + idx} Sep 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Last Care Update</span>
                <span className="font-bold text-slate-600 dark:text-slate-400">Today, 08:30 AM</span>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0b1120] border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setSelectedDependent({...ward, idx})} className="flex-1 py-2.5 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-colors">
                <User className="w-4 h-4" /> View Care Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {wards.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No dependents added yet</h3>
          <p className="text-sm font-bold text-slate-500 mb-6">Add a dependent to start managing their care.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-teal-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Dependent
          </button>
        </div>
      )}

      {/* DEPENDENT DETAILS DRAWER */}
      <AnimatePresence>
        {selectedDependent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center sm:justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedDependent(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md h-full sm:h-screen bg-white dark:bg-[#0b1120] shadow-2xl flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  Dependent Care Profile
                </span>
                <button onClick={() => setSelectedDependent(null)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg">
                    {selectedDependent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedDependent.name}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">{selectedDependent.relationship}</p>
                  </div>
                </div>

                {/* Status & Care Info */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-500 font-bold">Care Status</span>
                    <span className={`font-black flex items-center gap-1 ${selectedDependent.idx === 1 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedDependent.idx === 1 ? 'Needs Attention' : 'Stable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Primary Caregiver</span>
                    <span className="font-black text-slate-900 dark:text-white">Anita Sharma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Assigned Nurse</span>
                    <span className="font-black text-slate-900 dark:text-white">Priya Patel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Current Care Plan</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">Post-Op Recovery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Care Circle Status</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">Active (4 Members)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-600/70 dark:text-amber-500/70 mb-1">Pending Care Tasks</p>
                    <p className="text-xl font-black text-amber-600 dark:text-amber-400">{3 - (selectedDependent.idx || 0)}</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600/70 dark:text-indigo-500/70 mb-1">Upcoming Appts</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">2</p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Emergency Contact
                  </h4>
                  <p className="font-black text-sm text-slate-900 dark:text-white">Rajesh Kumar</p>
                  <p className="text-xs font-bold text-slate-500">Brother • +91 98765 43210</p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] space-y-3">
                <button 
                  onClick={() => {
                    setActiveWardId(selectedDependent.id);
                    // In real app, this would route to ABHA records page
                    const recordsBtn = document.querySelector('[data-nav="records"]') as HTMLButtonElement;
                    if(recordsBtn) recordsBtn.click();
                    setSelectedDependent(null);
                  }}
                  className="w-full py-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-teal-700 dark:text-teal-400 font-black text-xs hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> View ABHA Health Records <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    View Daily Tasks
                  </button>
                  <button className="flex-1 py-3 rounded-xl font-black text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    View Appointments
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
                  <Plus className="w-4 h-4 text-teal-500" /> Add New Dependent
                </span>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDependent} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Dependent Name</label>
                  <input type="text" required className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Relationship</label>
                    <select required className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Date of Birth</label>
                    <input type="date" required className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Phone Number (Optional)</label>
                  <input type="tel" className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Emergency Contact</label>
                  <input type="tel" required placeholder="Phone number" className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
                    Add Dependent
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

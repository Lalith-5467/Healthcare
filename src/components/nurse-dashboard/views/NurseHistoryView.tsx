import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle2, Star, Calendar, Download, Search, Filter, ArrowRight, X, FileText, Activity, Clock, RotateCcw } from 'lucide-react';
import { useNurseWorkflow } from '../../../utils/nurseWorkflowStorage';

export const NurseHistoryView: React.FC = () => {
  const { bookings } = useNurseWorkflow();
  
  // Enhance bookings with mock data for fields that might be missing in the schema
  const enhancedBookings = bookings.map((b, i) => ({
    ...b,
    requiresFollowUp: i % 3 === 0, // Mock follow-up requirement
    rating: b.status === 'Completed' ? "5.0" : "N/A"
  }));

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [followUpFilter, setFollowUpFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Filtering Logic
  const filteredRecords = enhancedBookings.filter(visit => {
    const matchesSearch = visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          visit.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? visit.prefDate.includes(dateFilter) : true;
    const matchesStatus = statusFilter === 'All' ? true : visit.status === statusFilter;
    const matchesFollowUp = followUpFilter === 'All' ? true : 
                            followUpFilter === 'Yes' ? visit.requiresFollowUp : !visit.requiresFollowUp;
    const matchesRating = ratingFilter === 'All' ? true : visit.rating === ratingFilter;

    return matchesSearch && matchesDate && matchesStatus && matchesFollowUp && matchesRating;
  });

  // Summary Data (Based on filtered records)
  const totalVisits = filteredRecords.length;
  const completedCount = filteredRecords.filter(b => b.status === 'Completed').length;
  const followUpsCount = filteredRecords.filter(b => b.requiresFollowUp).length; 
  const avgRating = completedCount > 0 ? "5.0" : "N/A";

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('All');
    setFollowUpFilter('All');
    setRatingFilter('All');
    setShowFilterDropdown(false);
  };

  const hasActiveFilters = searchTerm || dateFilter || statusFilter !== 'All' || followUpFilter !== 'All' || ratingFilter !== 'All';

  return (
    <div className="space-y-6 pb-16 font-sans select-none relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" /> Care Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Care History
          </h1>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Visits', value: totalVisits, icon: Activity, theme: 'bg-emerald-50/60 border-emerald-200/60 text-emerald-950 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-50', labelTheme: 'text-emerald-600 dark:text-emerald-400', iconTheme: 'text-emerald-500' },
          { label: 'Completed', value: completedCount, icon: CheckCircle2, theme: 'bg-blue-50/60 border-blue-200/60 text-blue-950 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-50', labelTheme: 'text-blue-600 dark:text-blue-400', iconTheme: 'text-blue-500' },
          { label: 'Follow-ups', value: followUpsCount, icon: Clock, theme: 'bg-amber-50/60 border-amber-200/60 text-amber-950 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-50', labelTheme: 'text-amber-600 dark:text-amber-400', iconTheme: 'text-amber-500' },
          { label: 'Avg Rating', value: avgRating, icon: Star, theme: 'bg-purple-50/60 border-purple-200/60 text-purple-950 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-50', labelTheme: 'text-purple-600 dark:text-purple-400', iconTheme: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group cursor-pointer ${stat.theme}`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${stat.labelTheme}`}>{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.iconTheme} group-hover:scale-125 transition-transform duration-300`} />
            </div>
            <span className="text-2xl font-black">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-teal-500/60 group-focus-within:text-teal-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients, ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-teal-50/40 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800/40 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 outline-none transition-all shadow-sm text-teal-950 dark:text-white placeholder:text-teal-600/40 dark:placeholder:text-teal-500/40"
          />
        </div>
        
        <div className="flex gap-2 relative">
          {/* Native Date Picker Hack */}
          <div className="relative">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Filter by Date"
            />
            <button className={`px-4 py-2.5 h-full bg-blue-50/60 dark:bg-blue-900/20 border ${dateFilter ? 'border-blue-400 text-blue-700 dark:text-blue-300' : 'border-blue-200/70 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'} rounded-xl text-sm font-bold hover:bg-blue-100/60 dark:hover:bg-blue-900/40 hover:-translate-y-0.5 shadow-sm flex items-center gap-2 group transition-all relative z-0`}>
              <Calendar className={`w-4 h-4 ${dateFilter ? 'text-blue-600' : 'text-blue-500/70 group-hover:text-blue-600'} transition-colors`} /> 
              {dateFilter || 'Date'}
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`px-4 py-2.5 h-full bg-indigo-50/60 dark:bg-indigo-900/20 border ${showFilterDropdown || statusFilter !== 'All' || followUpFilter !== 'All' || ratingFilter !== 'All' ? 'border-indigo-400 text-indigo-700 dark:text-indigo-300' : 'border-indigo-200/70 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300'} rounded-xl text-sm font-bold hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 hover:-translate-y-0.5 shadow-sm flex items-center gap-2 group transition-all`}
            >
              <Filter className={`w-4 h-4 ${(showFilterDropdown || statusFilter !== 'All' || followUpFilter !== 'All' || ratingFilter !== 'All') ? 'text-indigo-600' : 'text-indigo-500/70 group-hover:text-indigo-600'} transition-colors`} /> Filter
            </button>

            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 p-4 space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Status</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Follow-up Needed</label>
                    <select 
                      value={followUpFilter}
                      onChange={(e) => setFollowUpFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <option value="All">Any</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Rating</label>
                    <select 
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <option value="All">Any Rating</option>
                      <option value="5.0">5.0 ⭐</option>
                      <option value="N/A">Unrated (N/A)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={clearFilters}
                      className="w-full py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-black flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {hasActiveFilters && (
             <button 
                onClick={clearFilters}
                className="px-4 py-2.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 shadow-sm flex items-center gap-2 transition-colors"
                title="Clear all filters"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
          )}
        </div>
      </div>

      {/* COMPLETED LIST */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">No Records Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredRecords.map((visit, i) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group/card flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
            >
              {/* Patient Info */}
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm group-hover/card:scale-110 transition-transform duration-300 ${
                  ['bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
                   'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
                   'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
                   'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
                   'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                  ][visit.patientName.charCodeAt(0) % 5]
                }`}>
                  {visit.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${visit.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                      {visit.status}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Follow-up: {visit.requiresFollowUp ? <span className="text-amber-500">Yes</span> : 'None'}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {visit.patientName} <span className="text-slate-400 font-medium text-xs">({visit.patientAge})</span>
                  </h3>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 relative z-10">
                <div className="text-left sm:text-right font-mono text-[10px]">
                  <span className="text-slate-500 font-bold flex items-center gap-1.5 justify-start sm:justify-end"><Calendar className="w-3 h-3 text-slate-400"/> {visit.prefDate} • {visit.time}</span>
                  <span className={`font-black flex items-center gap-1 mt-1 justify-start sm:justify-end ${visit.rating === 'N/A' ? 'text-slate-400' : 'text-amber-500'}`}>
                    Rating: {visit.rating} {visit.rating !== 'N/A' && <Star className="w-3 h-3 fill-current"/>}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Downloading EHR Summary PDF for ${visit.patientName}...`)}
                    className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all group/btn"
                    title="Download EHR Summary"
                  >
                    <Download className="w-3.5 h-3.5 group-hover/btn:scale-110 group-hover/btn:text-emerald-600 transition-all duration-300" />
                  </button>
                  <button 
                    onClick={() => setSelectedRecord(visit)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 group/btn2"
                  >
                    View <ArrowRight className="w-3 h-3 group-hover/btn2:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* RECORD MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:w-[420px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">Visit Record</h3>
                    <p className="text-[10px] font-mono text-slate-500">{selectedRecord.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:rotate-90 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Profile Snapshot */}
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-3xl shadow-sm">
                    {selectedRecord.patientName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">{selectedRecord.patientName}</h2>
                    <p className="text-xs font-bold text-slate-500">{selectedRecord.patientAge} • {selectedRecord.gender || 'M'}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${selectedRecord.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>
                    <CheckCircle2 className="w-3 h-3" /> {selectedRecord.status}
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Visit Details */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Visit Essentials</h4>
                  
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group/item hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 transition-colors">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500">Date & Time</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{selectedRecord.prefDate} at {selectedRecord.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group/item hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-amber-500 transition-colors`}>
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500">Patient Rating</p>
                        <p className={`text-xs font-black flex items-center gap-1 ${selectedRecord.rating === 'N/A' ? 'text-slate-400' : 'text-amber-500'}`}>
                          {selectedRecord.rating} {selectedRecord.rating !== 'N/A' && <Star className="w-3 h-3 fill-current" />}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group/item hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 transition-colors">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500">Follow-up Status</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{selectedRecord.requiresFollowUp ? 'Follow-up Required' : 'None Required'}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <button 
                  onClick={() => alert(`Downloading EHR Summary PDF for ${selectedRecord.patientName}...`)}
                  className="w-full py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-black flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Download EHR Summary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

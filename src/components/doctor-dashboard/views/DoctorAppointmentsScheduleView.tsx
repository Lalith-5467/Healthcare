import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Stethoscope,
  Search,
  ChevronDown,
  X,
  FileText,
  Activity,
  User,
  History,
  Pill
} from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface DoctorAppointmentsScheduleViewProps {
  onStartConsultation: (patientId: string) => void;
  onViewProfile?: (patientId: string) => void;
  onViewConsultation?: (patientId: string) => void;
}

export const DoctorAppointmentsScheduleView: React.FC<DoctorAppointmentsScheduleViewProps> = ({ onStartConsultation, onViewProfile, onViewConsultation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  // Real data states
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/schedule');
        const data = await response.json();
        if (data.success) {
          setSlots(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);


  const statuses = ['All', 'Scheduled', 'In Consultation', 'Completed', 'Delayed', 'No-show', 'Cancelled'];

  const getInitials = (name: string) => {
    const parts = name.replace('Mrs. ', '').replace('Dr. ', '').split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800/50 dark:bg-emerald-950/40';
      case 'Scheduled': 
      case 'In Consultation': return 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800/50 dark:bg-blue-950/40';
      case 'Delayed': return 'text-orange-700 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800/50 dark:bg-orange-950/40';
      case 'No-show': return 'text-rose-700 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-800/50 dark:bg-rose-950/40';
      case 'Cancelled': return 'text-slate-600 border-slate-200 bg-slate-50 dark:text-slate-400 dark:border-slate-700/50 dark:bg-slate-800/60';
      default: return 'text-slate-600 border-slate-200 bg-slate-50 dark:text-slate-400 dark:border-slate-700 dark:bg-slate-800';
    }
  };
  
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500';
      case 'Scheduled': 
      case 'In Consultation': return 'bg-blue-500';
      case 'Delayed': return 'bg-orange-500';
      case 'No-show': return 'bg-rose-500';
      case 'Cancelled': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const filteredSlots = useMemo(() => {
    return slots.filter(apt => {
      // Date filter
      if (dateFilter !== 'All Dates' && apt.date !== dateFilter) return false;
      
      // Status filter
      if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(query);
        const matchesId = apt.patientId.toLowerCase().includes(query);
        const matchesAptId = apt.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesAptId) return false;
      }
      
      return true;
    });
  }, [slots, searchQuery, statusFilter, dateFilter]);

  // Summary stats
  const totalToday = slots.filter(s => s.date === 'Today').length;
  const totalCompleted = slots.filter(s => s.date === 'Today' && s.status === 'Completed').length;
  const totalWaiting = slots.filter(s => s.date === 'Today' && (s.status === 'Scheduled' || s.status === 'Delayed')).length;
  const totalDelayed = slots.filter(s => s.date === 'Today' && s.status === 'Delayed').length;
  const totalNoShow = slots.filter(s => s.date === 'Today' && s.status === 'No-show').length;
  const totalCancelled = slots.filter(s => s.date === 'Today' && s.status === 'Cancelled').length;

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" /> OPD & Tele-Health Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctor Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Confirmed clinical appointments, patient queue management, and 1-click video call start.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Today\'s Appts', value: totalToday, color: 'text-slate-900 dark:text-white', bg: 'bg-white dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-800' },
          { label: 'Completed', value: totalCompleted, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-200/50 dark:border-emerald-900/50' },
          { label: 'Waiting/Active', value: totalWaiting, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-200/50 dark:border-blue-900/50' },
          { label: 'Delayed', value: totalDelayed, color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50/50 dark:bg-orange-950/20', border: 'border-orange-200/50 dark:border-orange-900/50' },
          { label: 'No-show', value: totalNoShow, color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/20', border: 'border-rose-200/50 dark:border-rose-900/50' },
          { label: 'Cancelled', value: totalCancelled, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/30', border: 'border-slate-200 dark:border-slate-800' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} ${stat.border} rounded-2xl p-4 sm:p-5 border shadow-sm flex flex-col justify-center items-center text-center transition-all`}>
            <span className={`text-2xl sm:text-3xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search patient name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-[calc(100vw-3rem)] lg:max-w-none">
            {statuses.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab 
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APPOINTMENTS CARDS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-bold text-slate-500">Loading your schedule...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSlots.length === 0 ? (
              <div className="p-10 text-center text-slate-500 bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800">
                No appointments found matching your criteria.
              </div>
            ) : (
              filteredSlots.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-5 lg:p-6 bg-white dark:bg-[#0b1120] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-6 hover:border-blue-500/30 transition-all border-l-[6px] ${apt.status === 'Delayed' ? 'border-l-orange-500' : apt.status === 'No-show' ? 'border-l-rose-500' : apt.status === 'Cancelled' ? 'border-l-slate-400' : apt.status === 'Completed' ? 'border-l-emerald-500' : 'border-l-blue-500'}`}
                >
                  
                  {/* Column 1: Patient Info (w-3/12 -> 25%) */}
                  <div className="flex items-start gap-4 lg:w-[25%] min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 shrink-0 text-sm shadow-sm mt-0.5">
                      {getInitials(apt.patientName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{apt.patientName}</h3>
                        <span className="text-[10px] font-mono font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md">
                          {apt.patientId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-2">
                        {apt.age}y • {apt.gender}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50 inline-flex">
                        {apt.isTele ? <Video className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> : <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                        <span>{apt.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Schedule & Status (w-3/12 -> 25%) */}
                  <div className="lg:w-[25%] flex flex-col justify-center border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm flex items-center gap-1.5 ${getStatusColor(apt.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(apt.status)} ${apt.status === 'In Consultation' ? 'animate-pulse' : ''}`} />
                        {apt.status}
                      </span>
                    </div>
                    
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 space-y-1.5">
                      {apt.status === 'Delayed' && (
                        <>
                          <p className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" /> Delayed {apt.delayDuration}
                          </p>
                          <p className="flex justify-between max-w-[150px]"><span className="text-slate-500">Arrived:</span> <span className="text-slate-900 dark:text-slate-200">{apt.arrivedAt}</span></p>
                          <p className="flex justify-between max-w-[150px]"><span className="text-slate-500">Scheduled:</span> <span className="text-slate-900 dark:text-slate-200">{apt.time}</span></p>
                        </>
                      )}
                      {apt.status === 'In Consultation' && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-slate-500">Started:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{apt.startedAt}</span>
                        </p>
                      )}
                      {apt.status === 'No-show' && (
                        <>
                          <p className="flex justify-between max-w-[150px]"><span className="text-slate-500">Expected:</span> <span className="text-slate-900 dark:text-slate-200">{apt.expectedArrival}</span></p>
                          <p className="flex justify-between max-w-[150px]"><span className="text-slate-500">Updated:</span> <span className="text-slate-900 dark:text-slate-200">{apt.statusUpdated}</span></p>
                        </>
                      )}
                      {apt.status === 'Cancelled' && (
                        <p className="text-[11px] italic text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">"{apt.cancelReason}"</p>
                      )}
                      {apt.status === 'Completed' && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-slate-500">Completed:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{apt.completedAt}</span>
                        </p>
                      )}
                      {apt.status === 'Scheduled' && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-slate-500">Scheduled:</span>
                          <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{apt.time}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Reason for Visit (w-3/12 -> 25%) */}
                  <div className="lg:w-[25%] flex flex-col justify-center border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0">
                    <span className="uppercase text-[9px] font-bold text-slate-400 tracking-widest mb-1.5 block">Reason for Visit</span>
                    <span className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed pr-2">{apt.reason}</span>
                  </div>

                  {/* Column 4: Actions (w-3/12 -> 25%) */}
                  <div className="lg:w-[25%] flex flex-col justify-center items-end border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 shrink-0 space-y-2.5">
                    <button 
                      onClick={() => setSelectedPatient(apt)}
                      className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer text-center shadow-sm"
                    >
                      View Profile
                    </button>
                    
                    {apt.status === 'Completed' && (
                      <button
                        onClick={() => onViewConsultation && onViewConsultation(apt.recordId)}
                        className="w-full px-4 py-2.5 rounded-xl font-black text-xs transition-all flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 cursor-pointer shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Consultation</span>
                      </button>
                    )}

                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <button
                        onClick={() => onStartConsultation(apt.recordId)}
                        disabled={apt.status === 'No-show'}
                        className={`w-full px-4 py-2.5 rounded-xl font-black text-xs transition-all flex justify-center items-center gap-2 shadow-sm ${
                          apt.status === 'No-show'
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                            : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer hover:scale-[1.02]'
                        }`}
                      >
                        {apt.status === 'In Consultation' ? (
                          <span>Continue Consultation</span>
                        ) : apt.status === 'No-show' ? (
                          <span>Mark as No-show</span>
                        ) : (
                          <>
                            {apt.isTele ? <Video className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                            <span>Begin Consultation</span>
                          </>
                        )}
                      </button>
                    )}

                    {apt.status === 'Cancelled' && (
                      <button
                        onClick={() => setSelectedPatient(apt)}
                        className="w-full px-4 py-2.5 rounded-xl font-black text-xs transition-all flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CENTERED MODAL FOR PATIENT DETAILS */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-500" /> Patient Profile
                  </h2>
                  <button 
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-600 dark:text-cyan-400 border-2 border-teal-500/20 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                    {getInitials(selectedPatient.patientName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{selectedPatient.patientName}</h3>
                    <p className="text-sm font-semibold text-slate-500">{selectedPatient.age} years • {selectedPatient.gender}</p>
                    <p className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">ID: {selectedPatient.patientId}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Appointment Details */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Appointment Details</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Date & Time</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedPatient.date}, {selectedPatient.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Type</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {selectedPatient.isTele ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-teal-500" />}
                          {selectedPatient.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Status</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shadow-sm ${getStatusColor(selectedPatient.status)}`}>
                          {selectedPatient.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Department</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedPatient.department}</span>
                      </div>
                      <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700/50">
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Reason for Visit</span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPatient.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Quick Access</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center gap-2.5 p-3.5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group shadow-sm">
                        <History className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Medical History</span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2.5 p-3.5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group shadow-sm">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Lab Reports</span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2.5 p-3.5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group shadow-sm">
                        <Pill className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Prescriptions</span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2.5 p-3.5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group shadow-sm">
                        <Activity className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Vitals Flow</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 mb-4">
                  <button 
                    onClick={() => {
                      if (onViewProfile) onViewProfile(selectedPatient.recordId);
                      setSelectedPatient(null);
                    }}
                    className="w-full px-4 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    View Full Clinical Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

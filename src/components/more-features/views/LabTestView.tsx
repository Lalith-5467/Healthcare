import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Activity, 
  Download, 
  X, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck,
  Zap,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

// Data types for typescript safety
type TestStatus = 'Scheduled' | 'Completed' | 'Cancelled';
type ReportStatus = 'Normal' | 'Attention';

export const LabTestView: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Report Preview Modal State
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // State for upcoming tests
  const [upcomingTests, setUpcomingTests] = useState([
    {
      id: 1,
      title: 'Complete Blood Count (CBC)',
      date: 'Sep 1, 2026',
      time: '08:00 AM',
      method: 'Home Collection',
      fasting: true,
      status: 'Scheduled' as TestStatus,
      icon: 'activity'
    },
    {
      id: 2,
      title: 'Lipid Profile',
      date: 'Sep 3, 2026',
      time: '07:30 AM',
      method: 'Clinic Visit',
      fasting: true,
      status: 'Scheduled' as TestStatus,
      icon: 'microscope'
    },
    {
      id: 3,
      title: 'Thyroid Panel',
      date: 'Sep 10, 2026',
      time: '09:00 AM',
      method: 'Home Collection',
      fasting: false,
      status: 'Scheduled' as TestStatus,
      icon: 'microscope'
    }
  ]);

  // Form State
  const [testType, setTestType] = useState('Complete Blood Count (CBC)');
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('08:00 AM');

  const handleBookTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest = {
      id: Date.now(),
      title: testType,
      date: new Date(testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: testTime,
      method: 'Home Collection',
      fasting: testType.includes('Lipid') || testType.includes('Blood'),
      status: 'Scheduled' as TestStatus,
      icon: 'activity'
    };
    
    setUpcomingTests(prev => [newTest, ...prev]);
    setIsBookingModalOpen(false);
    showToast("Lab test booked successfully!");
    setTestDate('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Status Color Helpers
  const getTestStatusColor = (status: TestStatus) => {
    switch (status) {
      case 'Scheduled': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleCancelTest = (id: number) => {
    setUpcomingTests(prev => prev.filter(test => test.id !== id));
    showToast("Lab test cancelled successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 font-sans pb-16 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white ${toastMessage.includes('cancelled') ? 'bg-rose-500' : 'bg-emerald-500'}`}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 items-center justify-center">
            <Microscope className="w-8 h-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-500 dark:text-blue-400 uppercase mb-1 block">LAB & DIAGNOSTICS</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Lab Tests & Diagnostics
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Book health checkups and view your lab reports
              </p>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <p className="hidden md:block text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                3 upcoming tests • 3 reports available
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsBookingModalOpen(true)}
          className="relative group flex items-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] border border-blue-400/50 dark:border-blue-300/30 w-full sm:w-auto justify-center z-10"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Calendar className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">Book Test</span>
        </motion.button>
      </motion.div>

      {/* 2. QUICK HEALTH STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Upcoming Tests', value: upcomingTests.length.toString(), icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Reports Available', value: '3', icon: FileCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
          { label: 'Normal Results', value: '2', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Attention Needed', value: '1', icon: AlertCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: UPCOMING TESTS */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-blue-500" />
            Upcoming Tests
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {upcomingTests.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No tests scheduled.</p>
                </div>
              ) : (
                upcomingTests.map((test, idx) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }}
                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all"
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-12 h-12 shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
                        {test.icon === 'activity' ? <Activity className="w-5 h-5" /> : <Microscope className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{test.title}</h3>
                          <span className={`hidden sm:inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border ${getTestStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {test.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {test.method}</span>
                        </div>
                        {test.fasting && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                            <AlertCircle className="w-3 h-3" />
                            Fasting Required
                          </div>
                        )}
                        
                        {/* Action Buttons inside content block for proper wrapping */}
                        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors">
                            View Details
                          </button>
                          <button 
                            onClick={() => handleCancelTest(test.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* RIGHT: RECENT REPORTS */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <FileText className="w-5 h-5 text-blue-500" />
            Recent Reports
          </h2>
          
          <div className="space-y-3">
            {[
              { id: 101, title: "Thyroid Panel (T3, T4, TSH)", date: "Aug 15, 2026", status: "Normal" as ReportStatus, dr: "Dr. Smith" },
              { id: 102, title: "Vitamin D & B12", date: "Jul 22, 2026", status: "Attention" as ReportStatus, dr: "Dr. Adams" },
              { id: 103, title: "HbA1c (Diabetes)", date: "May 10, 2026", status: "Normal" as ReportStatus, dr: "Dr. Smith" }
            ].map((report, idx) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
                whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                onClick={() => setSelectedReport(report)}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 border ${
                    report.status === 'Normal' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' 
                      : 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30'
                  }`}>
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{report.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>{report.date}</span>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                      <span>{report.dr}</span>
                    </div>
                    <div className="mt-2">
                      {report.status === 'Normal' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Normal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider rounded-md animate-pulse">
                          <AlertCircle className="w-3 h-3" /> Attention
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); showToast(`Downloading ${report.title}...`); }}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-xl transition-colors">
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. HEALTH INSIGHTS EMPTY SPACE FILLER */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl p-6 border border-blue-100/50 dark:border-blue-800/30 flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800/50">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">Health Insights</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Your recent Vitamin D levels need attention. Based on your upcoming tests, fasting is required for your CBC and Lipid Profile. Ensure you fast for at least 10 hours prior to sample collection.
            </p>
          </div>
        </div>
      </motion.section>

      {/* REPORT PREVIEW MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[5%] md:top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Official Lab Report</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Apollo Diagnostics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Patient Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Patient</p>
                    <p className="font-bold text-slate-900 dark:text-white">Samson L.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Age / Sex</p>
                    <p className="font-bold text-slate-900 dark:text-white">32 / M</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedReport.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Referred By</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedReport.dr}</p>
                  </div>
                </div>

                {/* Test Summary */}
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedReport.title}</h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    {selectedReport.status === 'Normal' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedReport.status === 'Normal' 
                        ? "All tested parameters fall within the biological reference intervals. No significant abnormalities detected in this panel."
                        : "Attention is required. One or more tested parameters fall outside the standard biological reference intervals. Please consult your physician."}
                    </p>
                  </div>
                </div>

                {/* Test Results Table */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Parameter Details
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs font-bold">
                          <th className="pb-3 pr-4">Test Description</th>
                          <th className="pb-3 px-4">Value</th>
                          <th className="pb-3 px-4">Unit</th>
                          <th className="pb-3 pl-4">Ref. Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Mock Rows based on status */}
                        {selectedReport.status === 'Normal' ? (
                          <>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">TSH (Thyroid Stimulating Hormone)</td>
                              <td className="py-4 px-4 font-black text-slate-900 dark:text-white">2.45</td>
                              <td className="py-4 px-4 text-slate-500 dark:text-slate-400">uIU/mL</td>
                              <td className="py-4 pl-4 text-slate-500 dark:text-slate-400">0.55 - 4.78</td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Free T4</td>
                              <td className="py-4 px-4 font-black text-slate-900 dark:text-white">1.12</td>
                              <td className="py-4 px-4 text-slate-500 dark:text-slate-400">ng/dL</td>
                              <td className="py-4 pl-4 text-slate-500 dark:text-slate-400">0.89 - 1.76</td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Vitamin D (25-OH)</td>
                              <td className="py-4 px-4 font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 rounded-md">18.2 ↓</td>
                              <td className="py-4 px-4 text-slate-500 dark:text-slate-400">ng/mL</td>
                              <td className="py-4 pl-4 text-slate-500 dark:text-slate-400">30.0 - 100.0</td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Vitamin B12</td>
                              <td className="py-4 px-4 font-black text-slate-900 dark:text-white">450</td>
                              <td className="py-4 px-4 text-slate-500 dark:text-slate-400">pg/mL</td>
                              <td className="py-4 pl-4 text-slate-500 dark:text-slate-400">211 - 911</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div className="sticky bottom-0 z-20 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-md flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    showToast("Downloading PDF...");
                    setSelectedReport(null);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Book Lab Test
                </h2>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleBookTest} className="p-6 space-y-5">
                <div className="space-y-2 relative group">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Test Type</label>
                  <div className="relative">
                    <select 
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white font-bold appearance-none cursor-pointer"
                    >
                      <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                      <option value="Lipid Profile">Lipid Profile</option>
                      <option value="Thyroid Panel">Thyroid Panel</option>
                      <option value="Vitamin D & B12">Vitamin D & B12</option>
                      <option value="Full Body Checkup">Full Body Checkup</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none group-focus-within:text-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white font-bold" 
                      required 
                    />
                  </div>
                  <div className="space-y-2 relative group">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</label>
                    <div className="relative">
                      <select 
                        value={testTime}
                        onChange={(e) => setTestTime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white font-bold appearance-none cursor-pointer"
                      >
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none group-focus-within:text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address</label>
                  <textarea 
                    rows={2} 
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all dark:text-white font-medium resize-none"
                    placeholder="Enter home collection address..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-slate-900 dark:text-white font-black py-4 rounded-xl transition-all mt-2 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] border border-blue-400/50"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

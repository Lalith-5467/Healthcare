import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, FileText, Download, 
  Eye, FileCheck, Stethoscope, Activity, FileSpreadsheet, 
  HelpCircle, MessageCircle, XCircle
} from 'lucide-react';

export const CashlessPreAuthView: React.FC = () => {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const displayToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cashless Pre-Authorization</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Review and authorize hospital treatment requests before claim processing.
        </p>
      </div>

      {/* 1. PATIENT & POLICY SUMMARY CARD */}
      <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center font-black text-xl text-blue-600 dark:text-cyan-400">
              R
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Rahul Kumar
                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-extrabold border border-emerald-200 dark:border-emerald-800/50">
                  Active
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Patient ID: PID-8472-9104 • ABHA: 91-8472-9104-5821@abdm</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">Policy ID</p>
            <p className="text-sm font-black text-blue-600 dark:text-cyan-400 font-mono">INS-MC-2026-10245</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Insurance Company</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Star Health & Apollo Cashless Hub</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Hospital</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Apollo Central Health City, Chennai</p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">Network Status</p>
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Verified Network Hospital</p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN LAYOUT: DETAILS & TRACKER / DOCUMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Details & Financials) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 2. PRE-AUTH REQUEST CARD */}
          <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Pre-Authorization Request
              </h3>
              <span className="text-xs font-mono font-black text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                PA-2026-00231
              </span>
            </div>
            
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Request Type</p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-black">
                  <Activity className="w-3.5 h-3.5" /> Emergency
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Treatment Type</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Inpatient</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Department</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Cardiology</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Admission Date</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Aug 27, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Expected Discharge</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sep 02, 2026</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Attending Doctor</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Dr. Vivek Sharma</p>
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Acute Myocardial Infarction (Heart Attack) - requiring immediate intervention.</p>
              </div>
              
              <div className="sm:col-span-2 md:col-span-3">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Proposed Procedure</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Coronary Angiogram followed by PTCA (Percutaneous Transluminal Coronary Angioplasty) with stent placement.</p>
              </div>
            </div>
          </section>

          {/* 3. FINANCIAL SUMMARY */}
          <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 mb-6">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Financial Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Estimated Cost</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">₹1,50,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-1.5">Requested Amount</p>
                <p className="text-lg font-black text-blue-700 dark:text-cyan-300">₹1,20,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Eligible Coverage</p>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">₹1,20,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1.5">Patient Contribution</p>
                <p className="text-lg font-black text-amber-700 dark:text-amber-400">₹30,000</p>
              </div>
            </div>
          </section>

          {/* 4. PRE-AUTH STATUS TRACKER */}
          <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 overflow-x-auto">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-6">
              Pre-Authorization Status
            </h3>
            <div className="min-w-[500px]">
              <div className="flex items-start justify-between relative z-0">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-5 h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded-full" />
                <div className="absolute left-6 right-[35%] top-5 h-1 bg-emerald-500 z-0 rounded-full" />
                
                {/* Steps */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-white dark:ring-[#0b1120]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Request Submitted</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-white dark:ring-[#0b1120]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Medical Verification</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-blue-50 dark:ring-cyan-900/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">Under Insurance Review</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#0b1120] ${
                    decision === 'pending'
                      ? 'bg-white dark:bg-[#0b1120] border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                      : decision === 'approved'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  }`}>
                    {decision === 'pending' ? <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> : decision === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    decision === 'pending' ? 'text-slate-500 dark:text-slate-400' : decision === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {decision === 'pending' ? 'Decision' : decision === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Documents & Assessment) */}
        <div className="space-y-6">
          
          {/* 5. MEDICAL DOCUMENTS */}
          <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[450px]">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-500" /> Medical Documents
              </h3>
            </div>
            
            <div className="p-4 space-y-3 overflow-y-auto">
              {[
                { name: 'Doctor Prescription', date: 'Aug 27, 2026', icon: Stethoscope },
                { name: 'Diagnosis Report', date: 'Aug 27, 2026', icon: FileText },
                { name: 'Lab Reports', date: 'Aug 27, 2026', icon: Activity },
                { name: 'Scan / X-Ray Report', date: 'Aug 27, 2026', icon: FileSpreadsheet },
                { name: 'Admission Request', date: 'Aug 27, 2026', icon: FileText },
                { name: 'Medical Certificate', date: 'Aug 27, 2026', icon: FileCheck },
              ].map((doc, i) => (
                <div key={i} className="group p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-800/50 bg-white dark:bg-slate-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      <doc.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => displayToast(`Opening ${doc.name} viewer...`)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer rounded-lg hover:bg-white dark:hover:bg-slate-800" 
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => displayToast(`Downloading ${doc.name}...`)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer rounded-lg hover:bg-white dark:hover:bg-slate-800" 
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. MEDICAL & COVERAGE ASSESSMENT */}
          <section className="bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-4">
              Coverage Assessment
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Diagnosis verification</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Treatment eligibility</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Policy coverage limit</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <span className="text-xs font-bold text-blue-700 dark:text-cyan-300">Pre-existing condition</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Pending
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Room eligibility</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Estimated cost validation</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Clarification Req.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 7. HOSPITAL QUERY / ADDITIONAL INFO */}
      <section className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider text-sm flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4" /> Hospital Query / Missing Information
        </h3>
        <div className="bg-white dark:bg-[#070c18]/50 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/30">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Requested detailed breakdown of stent pricing and angiography consumables. Awaiting response from Apollo Central billing department.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Sent: Aug 27, 2026 • 10:45 AM</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
              <Clock className="w-3.5 h-3.5" /> Awaiting Hospital Reply
            </span>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM ACTION AREA */}
      <section className="sticky bottom-6 z-40 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl p-2 flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto mt-8">
        {decision === 'pending' ? (
          <>
            <button 
              onClick={() => {
                displayToast('Pre-Authorization Approved successfully.');
                setDecision('approved');
              }}
              className="w-full sm:flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Approve Pre-Auth
            </button>
            
            <button 
              onClick={() => {
                const query = window.prompt('Enter your request to the hospital:');
                if (query) displayToast('Information Request dispatched to hospital.');
              }}
              className="w-full sm:flex-1 py-3 px-6 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Request Info
            </button>
            
            <button 
              onClick={() => {
                displayToast('Pre-Authorization Rejected.');
                setDecision('rejected');
              }}
              className="w-full sm:flex-[0.5] py-3 px-6 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-full font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </>
        ) : (
          <div className={`w-full py-3 px-6 rounded-full font-black text-sm flex items-center justify-center gap-2 ${
            decision === 'approved' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
              : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
          }`}>
            {decision === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {decision === 'approved' ? 'Pre-Auth Approved' : 'Pre-Auth Rejected'}
            <button 
              onClick={() => setDecision('pending')} 
              className="ml-4 text-[10px] uppercase font-bold underline opacity-70 hover:opacity-100 cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

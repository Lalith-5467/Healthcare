import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, Activity, Pill, HeartPulse, History, TestTube, ChevronRight, Stethoscope, Clock, Scan
} from 'lucide-react';
import { useDoctorWorkflow, type DoctorPatientRecord } from '../../../utils/doctorWorkflowStorage';

interface Patient360ViewProps {
  patientId: string | null;
  onNavigate: (id: string) => void;
}

export const Patient360View: React.FC<Patient360ViewProps> = ({ patientId, onNavigate }) => {
  const { records } = useDoctorWorkflow();
  const [activeTab, setActiveTab] = useState<'summary' | 'medications' | 'vitals' | 'timeline'>('summary');
  
  // AI Simulation State
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingStep, setProcessingStep] = useState(0);

  const patient = records.find(p => p.id === patientId) || records[0];

  useEffect(() => {
    if (patient) {
      const steps = [
        "Reading medical reports...",
        "Extracting medications...",
        "Identifying diagnoses...",
        "Reviewing lab values...",
        "Comparing previous records...",
        "Generating clinical summary..."
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setProcessingStep(currentStep);
        if (currentStep >= steps.length) {
          clearInterval(interval);
          setTimeout(() => setIsProcessing(false), 400);
        }
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [patient]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Scan className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Patient Selected</h2>
        <p className="text-slate-500">Please scan a patient QR code to access their records.</p>
      </div>
    );
  }

  if (isProcessing) {
    const processingLabels = [
      "Connecting to secure health exchange...",
      "Reading medical reports...",
      "Extracting medications...",
      "Identifying diagnoses...",
      "Reviewing lab values...",
      "Comparing previous records...",
      "Generating clinical summary..."
    ];
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border-4 border-teal-100 dark:border-teal-900 rounded-full"></div>
          <motion.div 
            className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          ></motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 text-teal-500" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">AI Analysis in Progress</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={processingStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-slate-500 dark:text-slate-400 font-bold"
          >
            {processingLabels[Math.min(processingStep, processingLabels.length - 1)]}
          </motion.p>
        </AnimatePresence>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-8 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(processingStep / processingLabels.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 select-none font-sans max-w-7xl mx-auto">
      {/* 1. Enhanced Clinical Patient Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-teal-500/30 border border-white/20 shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ABHA Verified Chart 360
              </span>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                ID: {patient.patientId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {patient.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="text-rose-400 font-mono">Blood: {patient.bloodGroup}</span>
              <span>•</span>
              <span className="text-cyan-300 font-mono">ABHA: 91-8842-5921-1029</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 w-full md:w-auto shrink-0">
          <button 
            onClick={() => onNavigate('consultations')}
            className="flex-1 md:flex-initial px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <Stethoscope className="w-4 h-4" /> 
            <span>Start Active Consultation</span>
          </button>
        </div>
      </div>

      {/* 2. Patient Live Vitals Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Blood Pressure', value: '124 / 82 mmHg', status: 'Optimal', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Heart Rate', value: '74 BPM', status: 'Normal Sinus', icon: HeartPulse, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { label: 'Oxygen Saturation', value: '99% SpO2', status: 'Room Air', icon: HeartPulse, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Vitamin D3 Level', value: '18.4 ng/mL', status: 'Deficient (Flagged)', icon: TestTube, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((v, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{v.label}</p>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">{v.value}</p>
              <p className={`text-[10px] font-bold mt-0.5 ${v.color}`}>{v.status}</p>
            </div>
            <div className={`w-9 h-9 rounded-xl ${v.bg} ${v.color} flex items-center justify-center shrink-0`}>
              <v.icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl w-full sm:w-fit border border-slate-300/40 dark:border-slate-700/40">
        {[
          { id: 'summary', label: 'AI Clinical Summary', icon: Brain },
          { id: 'medications', label: 'Active Medications', icon: Pill },
          { id: 'vitals', label: 'Telemetry & Lab Reports', icon: Activity },
          { id: 'timeline', label: 'EHR Longitudinal Timeline', icon: History },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-black rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'summary' && <SummaryTab patient={patient} />}
          {activeTab === 'medications' && <MedicationsTab patient={patient} />}
          {activeTab === 'vitals' && <VitalsTab patient={patient} />}
          {activeTab === 'timeline' && <TimelineTab patient={patient} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// TABS COMPONENTS
// ==========================================

const SummaryTab = ({ patient }: { patient: DoctorPatientRecord }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT 8 COLUMNS: AI SUMMARY & CLINICAL KEYWORDS */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* AI Summary Card */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center border border-teal-500/20 text-teal-600 dark:text-cyan-300">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">AI Clinical Synthesis & Differential Diagnostic Copilot</h2>
                <p className="text-[10px] uppercase font-mono font-bold text-teal-600 dark:text-cyan-400">ABDM FHIR R4 Connected • Decision Support</p>
              </div>
            </div>

            <button className="text-xs font-bold text-teal-600 dark:text-cyan-400 bg-teal-500/10 hover:bg-teal-500/20 px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-teal-500/20 self-start sm:self-center cursor-pointer">
              <FileText className="w-3.5 h-3.5" /> 
              <span>View Source Records</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed space-y-2">
            <p>
              Patient has a recent history of <strong className="text-slate-900 dark:text-white">acute respiratory tract infection</strong> with mild exertional dyspnea. 
              Latest available CBC test indicates normal leukocyte count (7,400/µL).
            </p>
            <p>
              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-md inline-block">
                ⚠️ Biochemical Flag: Serum 25-OH Vitamin D3 is 18.4 ng/mL (Deficient range &lt; 20 ng/mL).
              </span>
            </p>
            <p>
              One prescription record shows <strong className="text-rose-600 dark:text-rose-400">1 missed evening dose</strong> of Azithromycin 500mg. Currently prescribed supportive mucolytics and oral hydration therapy.
            </p>
          </div>

          <p className="text-[11px] font-mono text-slate-400 italic">
            * AI-generated clinical briefing for registered medical practitioners. Correlate with physical bedside examination before formulating final diagnostic order.
          </p>
        </div>

        {/* Clinical Keywords Visualizer */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              EHR Extracted Diagnostic Tokens
            </h2>
            <span className="text-[10px] font-mono text-slate-400">NLP Indexed</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { text: "Respiratory Infection", color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
              { text: "Antibiotic Therapy", color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
              { text: "Vitamin D Deficiency", color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
              { text: "Normal CBC Matrix", color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
              { text: "Afebrile (98.4°F)", color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
              { text: "Mild Productive Cough", color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20' }
            ].map((kw, i) => (
              <div 
                key={i} 
                className={`rounded-xl border px-3.5 py-2 text-xs font-black flex items-center gap-2 ${kw.color}`}
              >
                <span>{kw.text}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT 4 COLUMNS: CLINICAL INSIGHTS & NURSE LOGS */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Health Insights */}
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Priority Clinical Flags
            </h2>
            <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
              2 Action Items
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="text-xs font-black text-slate-900 dark:text-white">Vitamin D3 Below Reference</p>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Current: 18.4 ng/mL (Ref: 30-100 ng/mL)</p>
              <button className="text-[10px] uppercase font-black text-teal-600 dark:text-cyan-400 hover:underline pt-1 block cursor-pointer">
                Order 60K Cholecalciferol →
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-xs font-black text-slate-900 dark:text-white">1 Medication Missed Dose</p>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Azithromycin 500mg missed on 31 Aug evening</p>
              <button className="text-[10px] uppercase font-black text-rose-600 dark:text-rose-400 hover:underline pt-1 block cursor-pointer">
                View Adherence Log →
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-black text-slate-900 dark:text-white">CBC & Hematology Normal</p>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Hb: 14.2 g/dL • TLC: 7,400 • Platelets: 2.4L</p>
            </div>
          </div>
        </div>
        
        {/* Nurse Updates */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-cyan-300" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">Ward & Nurse Logs</h2>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-white/10 rounded-md">Live Stream</span>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">Vitals & SpO2 Checked</p>
                <span className="text-[9px] font-mono text-slate-400">10:30 AM</span>
              </div>
              <p className="text-[10px] text-cyan-300">Nurse Sarah • OPD Station 4</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">Oral Hydration Administered</p>
                <span className="text-[9px] font-mono text-slate-400">10:35 AM</span>
              </div>
              <p className="text-[10px] text-cyan-300">Nurse Sarah • OPD Station 4</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const MedicationsTab = ({ patient }: { patient: DoctorPatientRecord }) => {
  const antibiotics = patient.medications.filter(m => m.isAntibiotic);
  const others = patient.medications.filter(m => !m.isAntibiotic);

  const AdherenceBar = ({ percent }: { percent: number }) => (
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden flex">
      <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500" style={{ width: `${percent}%` }}></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Antibiotic Section */}
      {antibiotics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/50 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center border border-rose-100 dark:border-rose-800/50">
              <Pill className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Antibiotic Therapy</h2>
              <p className="text-[10px] uppercase font-bold text-rose-500">Active Course</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {antibiotics.map(med => (
              <div key={med.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white">{med.medicine}</h3>
                    <p className="text-xs font-bold text-slate-500">{med.dose} • {med.frequency}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${med.status === 'Taken as scheduled' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {med.status}
                  </span>
                </div>
                <div className="mt-4 mb-2 flex justify-between text-xs font-bold text-slate-500">
                  <span>Adherence</span>
                  <span>{med.adherencePercent}%</span>
                </div>
                <AdherenceBar percent={med.adherencePercent} />
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Started: {med.startDate}</span>
                  <span>Ends: {med.endDate}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-rose-500 mt-4 italic bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
            Verify prescribed duration and patient adherence using the original prescription.
          </p>
        </div>
      )}

      {/* General Medications */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">General Medications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {others.map(med => (
            <div key={med.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">{med.medicine}</h3>
                  <p className="text-xs font-bold text-slate-500">{med.dose} • {med.frequency}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${med.status === 'Taken as scheduled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {med.status}
                </span>
              </div>
              <div className="mt-4 mb-2 flex justify-between text-xs font-bold text-slate-500">
                <span>Adherence</span>
                <span>{med.adherencePercent}%</span>
              </div>
              <AdherenceBar percent={med.adherencePercent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VitalsTab = ({ patient }: { patient: DoctorPatientRecord }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vitals Trends */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-500" /> Vitals Trends
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">BP</th>
                <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">HR</th>
                <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Temp</th>
                <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">SpO2</th>
              </tr>
            </thead>
            <tbody>
              {patient.vitalsHistory.map((v, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 text-sm font-bold text-slate-900 dark:text-white">{v.date}</td>
                  <td className="py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{v.bp}</td>
                  <td className="py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{v.hr} bpm</td>
                  <td className="py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{v.temp}°F</td>
                  <td className="py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{v.spo2}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Reports */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <TestTube className="w-4 h-4 text-teal-500" /> Lab Reports
        </h2>
        
        <div className="space-y-3">
          {[
            { name: 'CBC (Complete Blood Count)', date: 'Aug 20, 2026', status: 'Normal', color: 'bg-emerald-50 text-emerald-600' },
            { name: 'Vitamin D & B12', date: 'Aug 18, 2026', status: 'Attention', color: 'bg-amber-50 text-amber-600' },
            { name: 'HbA1c', date: 'Aug 10, 2026', status: 'Normal', color: 'bg-emerald-50 text-emerald-600' }
          ].map((lab, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-black text-slate-900 dark:text-white">{lab.name}</p>
                <p className="text-xs font-bold text-slate-500">{lab.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${lab.color}`}>
                  {lab.status}
                </span>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-teal-600 transition-colors">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TimelineTab = ({ patient }: { patient: DoctorPatientRecord }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
      <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-8 text-center">Patient Clinical Timeline</h2>
      
      <div className="relative pl-6 sm:pl-8">
        <div className="absolute left-[31px] sm:left-[39px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
        
        <div className="space-y-8">
          {patient.timeline.map((event, i) => {
            let Icon = History;
            let iconColor = 'text-slate-500 dark:text-slate-400';
            
            if (event.type === 'consultation') { Icon = Stethoscope; iconColor = 'text-teal-500'; }
            if (event.type === 'prescription') { Icon = Pill; iconColor = 'text-rose-500'; }
            if (event.type === 'lab') { Icon = TestTube; iconColor = 'text-blue-500'; }
            if (event.type === 'nurse' || event.type === 'vitals') { Icon = HeartPulse; iconColor = 'text-indigo-500'; }

            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex gap-4 sm:gap-6"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-slate-900 dark:text-white">{event.title}</h3>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm border border-slate-100 dark:border-slate-800">{event.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-2">{event.actor} • {event.time}</p>
                  {event.details && (
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.details}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

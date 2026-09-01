import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Activity, 
  Pill, 
  Calendar, 
  ShieldCheck, 
  Link2, 
  CheckCircle2, 
  Lock, 
  Zap
} from 'lucide-react';


export const FeatureShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState('records');

  const features = [
    {
      id: 'records',
      label: 'Health Records',
      icon: FileText,
      tag: 'ABDM Health Locker',
      headline: 'Unified Digital Health Vault',
      description: 'Store lab test reports, prescriptions, MRI/CT scans, and clinical notes with military-grade encryption.',
      highlights: ['Instant Full-Text Search', 'Automatic Document Categorization', 'PDF & DICOM Viewer'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm">Medical_Report_Aug2026.pdf</span>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">2.4 MB</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Lab Provider</span>
              <span className="font-semibold text-slate-900 dark:text-white">Apollo Diagnostics, Mumbai</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Test Result</span>
              <span className="font-semibold text-emerald-400">Hemoglobin 14.2 g/dL (Normal)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Prescription Attached</span>
              <span className="font-semibold text-amber-400">Metformin 500mg BID</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'vitals',
      label: 'Vitals Analytics',
      icon: Activity,
      tag: 'Real-time Telemetry',
      headline: 'Interactive Health Vitals Monitor',
      description: 'Track daily changes in heart rate, blood pressure, oxygen saturation, and body composition.',
      highlights: ['Animated SVG Path Drawing', 'Normal Range Benchmarks', 'Trend Forecast'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <span className="font-bold text-sm">Blood Pressure Telemetry</span>
            </div>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">Optimal</span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">120/80 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mmHg</span></p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Measured today at 08:30 AM</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              -4% vs Last Week
            </div>
          </div>

          <div className="h-16 w-full flex items-end gap-2 pt-2">
            {[60, 75, 70, 85, 90, 80, 78].map((h, i) => (
              <div key={i} className="flex-1 bg-rose-500/30 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                <div className="absolute inset-x-0 top-0 h-1 bg-rose-500 rounded-t-sm" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'medications',
      label: 'Medication Suite',
      icon: Pill,
      tag: 'Adherence System',
      headline: 'Smart Medication Reminders',
      description: 'Intelligent daily dose schedules, automatic drug interaction warnings, and adherence scoring.',
      highlights: ['Custom Push Reminders', 'Weekly 92%+ Adherence Badge', 'Refill Notifications'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">Today's Schedule</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">92% Adherence</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-800 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Metformin 500mg</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">1 Tablet • Morning After Breakfast</p>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Taken 8:15 AM
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 border border-amber-500/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Atorvastatin 10mg</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">1 Tablet • Evening 08:00 PM</p>
              </div>
              <span className="text-xs text-amber-400 font-semibold">Upcoming</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      tag: 'Care Team Sync',
      headline: 'Doctor & Tele-Consultation',
      description: 'Book online tele-consultations or clinic visits with automatic pre-consultation health summary sharing.',
      highlights: ['Pre-Consult Snapshot', 'Instant Prescriptions', 'Calendar Sync'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-sm">Upcoming Tele-Consultation</span>
            </div>
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">Today</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dr. Rajesh Kumar</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Senior Cardiologist • Fortis Hospital</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FF5B22] text-slate-900 dark:text-white text-[10px] font-bold">5:30 PM</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
              ✓ ABHA Vitals & Recent ECG Report pre-shared via consent.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'consent',
      label: 'Consent Manager',
      icon: ShieldCheck,
      tag: 'ABDM Security',
      headline: 'Granular Privacy & Sharing',
      description: 'You maintain absolute control over who accesses your medical records, what they can see, and for how long.',
      highlights: ['Instant Revocation', 'Time-Bound Access (1-30 Days)', 'Full Audit Trail'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Active Consent Token</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Granted</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Provider</span>
              <span className="font-bold text-slate-900 dark:text-white">Dr. Kumar (Cardiology)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Granted Data</span>
              <span className="text-emerald-400 font-semibold">Labs, Vitals & Scans</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Expires</span>
              <span className="text-amber-400">In 7 Days</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'abha',
      label: 'ABHA Link',
      icon: Link2,
      tag: 'National Digital Identity',
      headline: 'India ABDM Ecosystem Integration',
      description: 'Link your 14-digit ABHA ID to aggregate records from hospitals, clinics, and diagnostic labs nationwide.',
      highlights: ['Seamless Provider Discovery', 'Government ABDM Sandbox Ready', 'Masked Identifiers'],
      renderVisual: () => (
        <div className="w-full h-full p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-white space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm">ABHA Digital Identity</span>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Linked</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/90 border border-cyan-500/30 space-y-2">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">ABHA Number</p>
            <p className="font-mono text-base font-bold text-cyan-300">14-9842-7712-8921</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Address: <span className="font-semibold text-slate-900 dark:text-white">patient.health@abdm</span></p>
          </div>
        </div>
      ),
    },
  ];

  const current = features.find((f) => f.id === selectedFeature) || features[0];

  return (
    <section id="features" className="py-24 bg-white dark:bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Zap className="w-4 h-4 text-[#FF5B22]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5B22]">
              Interactive Feature Ecosystem
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Complete Health Control.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
            Select a core capability below to see how our unified health architecture functions in real time.
          </p>
        </div>

        {/* FEATURE SELECTOR TABS */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSelected = selectedFeature === feat.id;

            return (
              <button
                key={feat.id}
                onClick={() => setSelectedFeature(feat.id)}
                className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                  isSelected
                    ? 'text-white bg-[#FF5B22] shadow-lg shadow-orange-500/25 scale-105'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{feat.label}</span>
              </button>
            );
          })}
        </div>

        {/* CENTRAL FEATURE SHOWCASE DISPLAY PANEL */}
        <div className="relative rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* LEFT TEXT DESCRIPTION */}
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#FF5B22] bg-orange-500/10 border border-orange-500/20">
                  {current.tag}
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {current.headline}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {current.description}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {current.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT INTERACTIVE VISUAL DISPLAY */}
              <div className="lg:col-span-6 h-72 sm:h-80">
                {current.renderVisual()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

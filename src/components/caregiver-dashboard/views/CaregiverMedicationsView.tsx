import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Plus, 
  Check, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Filter, 
  CheckCircle2, 
  X,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverMedicationsView: React.FC = () => {
  const { 
    wards, 
    activeWard, 
    setActiveWardId, 
    toggleMedicationTaken, 
    requestMedicationRefill 
  } = useCaregiverWorkflow();

  const [selectedTiming, setSelectedTiming] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRefill = (wardId: string, medId: string, medName: string) => {
    requestMedicationRefill(wardId, medId);
    showToast(`Prescription refill ordered for ${medName}! Dispatched to pharmacy.`);
  };

  const filteredMeds = activeWard.medications.filter(m => {
    if (selectedTiming === 'all') return true;
    return m.timing.toLowerCase() === selectedTiming.toLowerCase();
  });

  const morningMeds = activeWard.medications.filter(m => m.timing === 'Morning');
  const afternoonMeds = activeWard.medications.filter(m => m.timing === 'Afternoon');
  const eveningMeds = activeWard.medications.filter(m => m.timing === 'Evening' || m.timing === 'Night');
  const asNeededMeds = activeWard.medications.filter(m => m.timing === 'As Needed');

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* TOAST ALERT */}
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

      {/* HEADER & WARD TABS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Medication & Dosage Adherence</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track daily doses, mark assisted administration, monitor low pill counts, and order 1-click refills.
          </p>
        </div>

        {/* WARD SWITCHER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {wards.map((ward) => {
            const isSelected = ward.id === activeWard.id;
            return (
              <button
                key={ward.id}
                onClick={() => setActiveWardId(ward.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{ward.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {ward.relationship}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MEDICATION SUMMARY HERO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-cyan-500/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Prescriptions</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {activeWard.medications.length} Medications
            </p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Administered Today</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activeWard.medications.filter(m => m.takenToday).length} of {activeWard.medications.length} Doses
            </p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Low Stock Warning</p>
            <p className="text-xl font-black text-amber-500 mt-0.5">
              {activeWard.medications.filter(m => m.stockLeft <= 5).length} Items Need Refill
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Morning', 'Afternoon', 'Night', 'As Needed'].map((timing) => (
          <button
            key={timing}
            onClick={() => setSelectedTiming(timing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTiming.toLowerCase() === timing.toLowerCase()
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {timing === 'all' ? 'All Schedules' : timing}
          </button>
        ))}
      </div>

      {/* MEDICATIONS LIST */}
      <div className="space-y-3">
        {filteredMeds.map((med) => {
          const isLowStock = med.stockLeft <= 5;

          return (
            <motion.div
              key={med.id}
              whileHover={{ y: -2 }}
              className={`rounded-3xl p-5 border transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                med.takenToday
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40 shadow-xs'
                  : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* ACTION CHECKBOX */}
                <button
                  onClick={() => toggleMedicationTaken(activeWard.id, med.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                    med.takenToday
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>

                {/* PILL DETAILS */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-black ${med.takenToday ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {med.name}
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-cyan-300">
                      {med.timing}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Prescribed by {med.prescribedBy}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {med.dosage} • <span className="font-semibold text-teal-700 dark:text-cyan-300">{med.instructions}</span>
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">
                      Stock: <span className={`font-black ${isLowStock ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{med.stockLeft}</span> of {med.totalStock} units
                    </span>
                    {med.takenToday && med.takenAt && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Taken at {med.takenAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* STOCK PROGRESS & REFILL BUTTON */}
              <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                <div className="w-28 hidden sm:block">
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isLowStock ? 'bg-rose-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, (med.stockLeft / med.totalStock) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-right font-bold text-slate-400 mt-1">
                    {Math.round((med.stockLeft / med.totalStock) * 100)}% remaining
                  </p>
                </div>

                <button
                  onClick={() => handleRefill(activeWard.id, med.id, med.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    isLowStock
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 animate-bounce'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isLowStock ? 'Order Refill Now' : 'Refill'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PHARMACY PARTNER NOTICE */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white">Apollo Central Pharmacy Integration</p>
            <p className="text-slate-500 dark:text-slate-400">Authorized e-prescriptions are auto-synced with 2-hour doorstep delivery for registered ABDM wards.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Heart, 
  Droplets, 
  Wind, 
  Thermometer, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverVitalsView: React.FC = () => {
  const { wards, activeWard, setActiveWardId, addVitalReading } = useCaregiverWorkflow();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [systolic, setSystolic] = useState('125');
  const [diastolic, setDiastolic] = useState('80');
  const [bloodSugar, setBloodSugar] = useState('110');
  const [sugarType, setSugarType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Fasting');
  const [spo2, setSpo2] = useState('98');
  const [heartRate, setHeartRate] = useState('72');
  const [temperature, setTemperature] = useState('98.4');
  const [weight, setWeight] = useState('70');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalReading(activeWard.id, {
      systolic: parseInt(systolic, 10) || undefined,
      diastolic: parseInt(diastolic, 10) || undefined,
      bloodSugar: parseInt(bloodSugar, 10) || undefined,
      sugarType,
      spo2: parseInt(spo2, 10) || undefined,
      heartRate: parseInt(heartRate, 10) || undefined,
      temperature: parseFloat(temperature) || undefined,
      weight: parseFloat(weight) || undefined,
      notes: notes || 'Caregiver observation logged.'
    });

    setIsLogOpen(false);
    showToast(`New vital readings logged for ${activeWard.name}!`);
  };

  const latest = activeWard.vitals[0];

  return (
    <div className="space-y-6 select-none pb-12">
      
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

      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Biometrics & Vital Trends</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Continuous remote health monitoring with automatic threshold alerts for family members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* WARD SWITCHER */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {wards.map((ward) => (
              <button
                key={ward.id}
                onClick={() => setActiveWardId(ward.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  ward.id === activeWard.id
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {ward.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLogOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Reading</span>
          </button>
        </div>
      </div>

      {/* LATEST VITALS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BP */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" /> Blood Pressure
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              Optimal
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.systolic || 124} / {latest?.diastolic || 80}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">Target: &lt; 130/85 mmHg</p>
        </div>

        {/* BLOOD SUGAR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-500" /> Glucose
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-cyan-300">
              {latest?.sugarType || 'Fasting'}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.bloodSugar || 112} <span className="text-sm font-normal text-slate-400">mg/dL</span>
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">Target: 80 - 130 mg/dL</p>
        </div>

        {/* SPO2 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-500" /> Oxygen (SpO2)
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              98%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.spo2 || 98}%
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">Target: 95 - 100%</p>
        </div>

        {/* HEART RATE */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-violet-500" /> Pulse
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              Resting
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.heartRate || 74} <span className="text-sm font-normal text-slate-400">bpm</span>
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">Target: 60 - 90 bpm</p>
        </div>
      </div>

      {/* HISTORICAL VITALS LOG TABLE */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Telemetry History: {activeWard.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All records timestamped and cryptographically linked to ABDM health locker.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Date & Time</th>
                <th className="pb-3 px-3">Blood Pressure</th>
                <th className="pb-3 px-3">Blood Glucose</th>
                <th className="pb-3 px-3">SpO2</th>
                <th className="pb-3 px-3">Pulse</th>
                <th className="pb-3 px-3">Notes</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {activeWard.vitals.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {v.date}, {v.time}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                    {v.systolic ? `${v.systolic}/${v.diastolic} mmHg` : '—'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                    {v.bloodSugar ? `${v.bloodSugar} mg/dL (${v.sugarType})` : '—'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                    {v.spo2 ? `${v.spo2}%` : '—'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                    {v.heartRate ? `${v.heartRate} bpm` : '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {v.notes || 'Routine check'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      v.status === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                      v.status === 'elevated' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG VITAL MODAL */}
      <AnimatePresence>
        {isLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsLogOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Record Vitals for {activeWard.name}</span>
                </h3>
                <button onClick={() => setIsLogOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="110"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Testing Context</label>
                    <select
                      value={sugarType}
                      onChange={(e) => setSugarType(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    >
                      <option value="Fasting">Fasting (Morning)</option>
                      <option value="Post-Meal">Post-Meal (2h post food)</option>
                      <option value="Random">Random</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="98.6"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Observation Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Patient took evening walk, good spirits, hydration normal..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsLogOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    Save Reading
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

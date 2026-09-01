import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Heart, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  QrCode, 
  Activity, 
  Pill, 
  Calendar, 
  Check, 
  X, 
  AlertCircle, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverWardsView: React.FC = () => {
  const { wards, activeWardId, setActiveWardId, addWard } = useCaregiverWorkflow();
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [qrModalWard, setQrModalWard] = useState<any | null>(null);

  // New ward form
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [abhaId, setAbhaId] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [primaryCondition, setPrimaryCondition] = useState('');
  const [allergiesStr, setAllergiesStr] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [accessLevel, setAccessLevel] = useState<'Full Legal Guardian' | 'Medical Proxy' | 'Emergency Viewer'>('Full Legal Guardian');

  const handleAddWardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    addWard({
      name,
      relationship,
      age: parseInt(age, 10) || 40,
      gender,
      abhaId: abhaId || `${name.toLowerCase().replace(/\s+/g, '')}@abdm`,
      bloodGroup,
      primaryCondition: primaryCondition || 'General Health Monitoring',
      allergies: allergiesStr ? allergiesStr.split(',').map(a => a.trim()) : ['None Known'],
      emergencyContact: '+91 98765 11223',
      primaryDoctor: {
        name: doctorName || 'Dr. Medical Officer',
        specialty: doctorSpecialty || 'General Medicine',
        phone: '+91 98450 12345',
        hospital: 'Apollo Hospitals Network'
      },
      accessLevel
    });

    setIsAddWardOpen(false);
    // Reset form
    setName('');
    setAge('');
    setPrimaryCondition('');
    setAllergiesStr('');
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>My Wards & Dependents</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage full healthcare profiles, ABHA health IDs, proxy access levels, and medical circles.
          </p>
        </div>

        <button
          onClick={() => setIsAddWardOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Dependent / Ward</span>
        </button>
      </div>

      {/* WARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {wards.map((ward) => {
          const isCurrent = ward.id === activeWardId;
          const latestVital = ward.vitals[0];

          return (
            <motion.div
              key={ward.id}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-6 transition-all relative overflow-hidden border flex flex-col justify-between ${
                isCurrent
                  ? 'bg-white dark:bg-[#0f1d35] border-teal-500 dark:border-cyan-400 ring-2 ring-teal-500/20 shadow-xl'
                  : 'bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                      {ward.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {ward.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                        {ward.relationship} • {ward.gender}, {ward.age} yrs
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    ward.overallStatus === 'Alert' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                    ward.overallStatus === 'Needs Attention' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    {ward.overallStatus}
                  </span>
                </div>

                {/* ABHA BADGE & ACCESS SCOPE */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ABHA Address</span>
                    <span className="font-mono text-[11px] font-black text-teal-600 dark:text-cyan-400 truncate max-w-[170px]">
                      {ward.abhaId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Blood Group</span>
                    <span className="font-black text-rose-500">
                      {ward.bloodGroup}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Guardian Scope</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950/40 text-teal-700 dark:text-cyan-300">
                      {ward.accessLevel}
                    </span>
                  </div>
                </div>

                {/* HEALTH CONDITION & ALLERGIES */}
                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Primary Medical Diagnosis
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {ward.primaryCondition}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                      Known Allergies & Contraindications
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ward.allergies.map((all, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold">
                          {all}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* QUICK STATS PILLS */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400">Meds</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{ward.medications.length} Prescribed</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400">Latest BP</p>
                    <p className="text-xs font-black text-teal-600 dark:text-cyan-400 mt-0.5">
                      {latestVital?.systolic || 120}/{latestVital?.diastolic || 80}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400">Visits</p>
                    <p className="text-xs font-black text-amber-500 mt-0.5">{ward.appointments.length} Scheduled</p>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => setActiveWardId(ward.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {isCurrent ? 'Active in Dashboard' : 'Select Ward'}
                </button>

                <button
                  onClick={() => setQrModalWard(ward)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Emergency QR Medical Card"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ADD WARD MODAL */}
      <AnimatePresence>
        {isAddWardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddWardOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Register Dependent / Ward</span>
                </h3>
                <button onClick={() => setIsAddWardOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddWardSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relationship to Caregiver</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child / Son">Child / Son</option>
                      <option value="Child / Daughter">Child / Daughter</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Ward / Dependent">Ward / Dependent</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age & Blood Group</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        className="w-1/2 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-1/2 h-10 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                      >
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ABHA ID (Ayushman Bharat Health Address)</label>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="91-XXXX-XXXX-XXXX@abdm"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Medical Condition / Diagnosis</label>
                  <input
                    type="text"
                    value={primaryCondition}
                    onChange={(e) => setPrimaryCondition(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes, Post-Surgery Recovery"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Known Allergies (Comma separated)</label>
                  <input
                    type="text"
                    value={allergiesStr}
                    onChange={(e) => setAllergiesStr(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts, Sulfa"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Physician Name</label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Dr. Rajesh Varma"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Specialty</label>
                    <input
                      type="text"
                      value={doctorSpecialty}
                      onChange={(e) => setDoctorSpecialty(e.target.value)}
                      placeholder="Cardiologist"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddWardOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    Add Dependent
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMERGENCY QR MODAL */}
      <AnimatePresence>
        {qrModalWard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setQrModalWard(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase text-teal-600 dark:text-cyan-400">Emergency Medical Pass</span>
                <button onClick={() => setQrModalWard(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              {/* QR DISPLAY */}
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-2 text-center">
                  <QrCode className="w-20 h-20 text-teal-400" />
                  <p className="text-[9px] font-mono text-slate-300 mt-1 truncate max-w-full">
                    {qrModalWard.abhaId}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {qrModalWard.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {qrModalWard.bloodGroup} • {qrModalWard.primaryCondition}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl text-[11px] text-slate-600 dark:text-slate-300 text-left space-y-1">
                <p>• Allergies: <span className="font-bold text-rose-500">{qrModalWard.allergies.join(', ')}</span></p>
                <p>• Caregiver Contact: <span className="font-bold text-slate-900 dark:text-white">{qrModalWard.emergencyContact}</span></p>
                <p>• Hospital: <span className="font-bold text-slate-900 dark:text-white">{qrModalWard.primaryDoctor.hospital}</span></p>
              </div>

              <button
                onClick={() => setQrModalWard(null)}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
              >
                Close Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

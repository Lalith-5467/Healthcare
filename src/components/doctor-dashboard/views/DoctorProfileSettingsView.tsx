import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Stethoscope, 
  Clock, 
  Video, 
  Bell, 
  Save, 
  CheckCircle2, 
  Building2,
  Calendar,
  Phone,
  ShieldAlert,
  FileText
} from 'lucide-react';

// Custom Toggle Component
const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors ${
      checked ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
    }`}
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

export const DoctorProfileSettingsView: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. Rajesh Varma',
    regNumber: 'MCI-TN-2015-84920',
    specialty: 'Internal Medicine & Preventive Cardiology',
    department: 'Cardiology',
    hospital: 'Apollo Central Health City',
    yearsExperience: '12',
    
    // Consultation Preferences
    videoConsultationEnabled: true,
    audioConsultationEnabled: false,
    consultDuration: '15',
    followUpDuration: '10',
    onlineFee: '800',
    inPersonFee: '1000',
    
    // Availability
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    opdStartTime: '09:00',
    opdEndTime: '17:00',
    lunchTime: '13:00 - 14:00',
    telemedicineHours: '18:00 - 20:00',
    emergencyAvail: true,
    
    // Alerts
    autoAcceptEmergency: true,
    appointmentNotifs: true,
    newPatientNotifs: true,
    labReportNotifs: true,
    prescriptionAlerts: false
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleDay = (day: string) => {
    setProfile(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* TOAST */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & Settings Saved Successfully!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Profile & Clinical Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your professional information, consultation preferences, availability, and clinical settings.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 text-sm cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* PROFESSIONAL PROFILE */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <User className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Professional Profile</h2>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                DR
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-transparent text-xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-lg px-2 py-1 -ml-2"
                  placeholder="Full Name"
                />
                <div className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-cyan-900/30 dark:text-cyan-300 font-mono inline-block mt-1">
                  MCI Verified
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registration Number</label>
                <input
                  type="text"
                  value={profile.regNumber}
                  onChange={(e) => setProfile({ ...profile, regNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Years of Experience</label>
                <input
                  type="number"
                  value={profile.yearsExperience}
                  onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specialty</label>
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hospital / Clinic</label>
                <input
                  type="text"
                  value={profile.hospital}
                  onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* CONSULTATION PREFERENCES */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Stethoscope className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Consultation Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-cyan-900/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Video Tele-Consultations</p>
                      <p className="text-xs text-slate-500">Allow patients to book online video sessions</p>
                    </div>
                  </div>
                  <Toggle checked={profile.videoConsultationEnabled} onChange={(v) => setProfile({...profile, videoConsultationEnabled: v})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-cyan-900/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Audio Consultations</p>
                      <p className="text-xs text-slate-500">Allow patients to book voice-only sessions</p>
                    </div>
                  </div>
                  <Toggle checked={profile.audioConsultationEnabled} onChange={(v) => setProfile({...profile, audioConsultationEnabled: v})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Consultation Duration</label>
                  <select 
                    value={profile.consultDuration}
                    onChange={(e) => setProfile({...profile, consultDuration: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Follow-up Duration</label>
                  <select 
                    value={profile.followUpDuration}
                    onChange={(e) => setProfile({...profile, followUpDuration: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="5">5 Minutes</option>
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Online Fee (₹)</label>
                  <input
                    type="number"
                    value={profile.onlineFee}
                    onChange={(e) => setProfile({ ...profile, onlineFee: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In-Person Fee (₹)</label>
                  <input
                    type="number"
                    value={profile.inPersonFee}
                    onChange={(e) => setProfile({ ...profile, inPersonFee: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* WORKING HOURS & AVAILABILITY */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Working Hours & Availability</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        profile.workingDays.includes(day) 
                          ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OPD Start Time</label>
                  <input
                    type="time"
                    value={profile.opdStartTime}
                    onChange={(e) => setProfile({ ...profile, opdStartTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OPD End Time</label>
                  <input
                    type="time"
                    value={profile.opdEndTime}
                    onChange={(e) => setProfile({ ...profile, opdEndTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lunch / Break Time</label>
                  <input
                    type="text"
                    value={profile.lunchTime}
                    onChange={(e) => setProfile({ ...profile, lunchTime: e.target.value })}
                    placeholder="e.g. 13:00 - 14:00"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telemedicine Hours</label>
                  <input
                    type="text"
                    value={profile.telemedicineHours}
                    onChange={(e) => setProfile({ ...profile, telemedicineHours: e.target.value })}
                    placeholder="e.g. 18:00 - 20:00"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-900 dark:text-orange-300">Emergency Availability</p>
                      <p className="text-xs text-orange-700/70 dark:text-orange-400/70">Available for on-call emergencies</p>
                    </div>
                  </div>
                  <Toggle checked={profile.emergencyAvail} onChange={(v) => setProfile({...profile, emergencyAvail: v})} />
                </div>
              </div>
            </div>
          </section>

          {/* ALERTS & NOTIFICATIONS */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Bell className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Alerts & Notifications</h2>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Auto-Accept Critical Emergency Alerts</p>
                  <p className="text-[11px] text-slate-500">Instantly notify clinician for critical low SpO2 or hypertensive crisis.</p>
                </div>
                <Toggle checked={profile.autoAcceptEmergency} onChange={(v) => setProfile({...profile, autoAcceptEmergency: v})} />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Appointment Notifications</p>
                  <p className="text-[11px] text-slate-500">Get alerts for new, rescheduled, or cancelled appointments.</p>
                </div>
                <Toggle checked={profile.appointmentNotifs} onChange={(v) => setProfile({...profile, appointmentNotifs: v})} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">New Patient Notifications</p>
                  <p className="text-[11px] text-slate-500">Receive alerts when new patients join your directory.</p>
                </div>
                <Toggle checked={profile.newPatientNotifs} onChange={(v) => setProfile({...profile, newPatientNotifs: v})} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Lab Report Notifications</p>
                  <p className="text-[11px] text-slate-500">Alerts when patient lab results are uploaded and ready.</p>
                </div>
                <Toggle checked={profile.labReportNotifs} onChange={(v) => setProfile({...profile, labReportNotifs: v})} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Prescription Alerts</p>
                  <p className="text-[11px] text-slate-500">Notifications about prescription refill requests from patients.</p>
                </div>
                <Toggle checked={profile.prescriptionAlerts} onChange={(v) => setProfile({...profile, prescriptionAlerts: v})} />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Bell, 
  Lock, 
  Save, 
  CheckCircle2, 
  Key, 
  HeartHandshake,
  QrCode,
  Sparkles
} from 'lucide-react';

interface CaregiverProfileViewProps {
  user?: { name: string; email: string; phone?: string; role?: string };
}

export const CaregiverProfileView: React.FC<CaregiverProfileViewProps> = ({ user }) => {
  const [name, setName] = useState(user?.name || 'Anita Sharma');
  const [email, setEmail] = useState(user?.email || 'anita.caregiver@abdm.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 11223');
  const [govtId, setGovtId] = useState('AADHAAR: **** **** 8421');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [sosAutoCall, setSosAutoCall] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('Caregiver profile & notification preferences updated successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

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

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
          <span>Caregiver Identity & Authorization Portal</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Verified ABDM Digital Healthcare Guardian ID, credentials, and real-time emergency dispatch channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 5 COLS: VERIFIED ID BADGE & CREDENTIALS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#0b172a] via-[#0b223c] to-[#041224] p-6 text-white border border-slate-700/60 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                  {name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight text-white">{name}</h3>
                  <p className="text-xs text-teal-300 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> ABDM Verified Guardian
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-black px-2 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ABHA Caregiver ID</span>
                <span className="font-mono font-black text-cyan-300">CG-8421-9902@abdm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classification</span>
                <span className="font-bold text-white">Family Guardian / Daughter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Wards</span>
                <span className="font-bold text-teal-400">3 Dependents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Govt ID Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aadhaar KYC Verified
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Consent Expiry: 2029</span>
              <span className="text-teal-400 font-bold">256-Bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* RIGHT 7 COLS: SETTINGS & NOTIFICATION CHANNELS */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Contact & Notification Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number (Emergency Broadcast)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Government ID (Aadhaar / Passport)</label>
                <input
                  type="text"
                  value={govtId}
                  onChange={(e) => setGovtId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            {/* TOGGLES */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Emergency Alert Dispatch Channels
              </h4>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Instant SMS Broadcast</p>
                  <p className="text-[11px] text-slate-500">Receive SMS for vitals abnormalities and low medication stocks</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-black text-slate-900 dark:text-white">WhatsApp Emergency Alerts</p>
                  <p className="text-[11px] text-slate-500">Receive live GPS live links during geofence breaches or fall detections</p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-black text-slate-900 dark:text-white">Automated Emergency Voice Call</p>
                  <p className="text-[11px] text-slate-500">High-priority automated IVR call when SOS Panic Button is pressed</p>
                </div>
                <input
                  type="checkbox"
                  checked={sosAutoCall}
                  onChange={(e) => setSosAutoCall(e.target.checked)}
                  className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Preferences</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

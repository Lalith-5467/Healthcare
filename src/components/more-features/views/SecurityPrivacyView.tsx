import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  ShieldAlert, 
  Key, 
  UserCheck, 
  Eye, 
  DownloadCloud,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  ChevronRight,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const SecurityPrivacyView: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [consents, setConsents] = useState([
    { id: 1, name: 'Apollo Hospitals', type: 'Full Medical Records', expiry: '30 days', active: true },
    { id: 2, name: 'Dr. Sarah Jenkins', type: 'Prescriptions Only', expiry: 'Expired', active: false },
    { id: 3, name: 'Medica Pharmacy', type: 'Medication History', expiry: '12 days', active: true }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleConsent = (id: number) => {
    setConsents(prev => prev.map(c => {
      if (c.id === id) {
        const newActive = !c.active;
        if (!newActive) showToast(`Revoked access for ${c.name}`);
        else showToast(`Granted access to ${c.name}`);
        return { ...c, active: newActive };
      }
      return c;
    }));
  };

  const handleExport = () => {
    showToast("Preparing your data archive. We'll email you a secure link shortly.");
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
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white ${toastMessage.includes('Revoked') ? 'bg-amber-500' : 'bg-slate-800 dark:bg-slate-700'}`}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-600/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 items-center justify-center">
            <Lock className="w-8 h-8 text-slate-600 dark:text-slate-300 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1 block">ACCOUNT SECURITY</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Security & Privacy
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Manage your data access, active sessions, and logs
              </p>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <p className="hidden md:block text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> System Secure
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="relative group flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center z-10 shadow-sm"
        >
          <DownloadCloud className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">Export Data</span>
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
          { label: 'Active Consents', value: consents.filter(c=>c.active).length.toString(), icon: UserCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Security Score', value: '95', icon: ShieldAlert, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Active Sessions', value: '2', icon: Smartphone, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Data Logs', value: '14', icon: Eye, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: CONSENT MANAGEMENT */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <UserCheck className="w-5 h-5 text-slate-500" />
            Consent Management
          </h2>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <AnimatePresence>
              {consents.map((consent, idx) => (
                <motion.div
                  key={consent.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    consent.active 
                      ? 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' 
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">{consent.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span>{consent.type}</span>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                      <span className={consent.active ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}>
                        {consent.active ? `Expires in ${consent.expiry}` : consent.expiry}
                      </span>
                    </div>
                  </div>
                  
                  {/* Premium Toggle Switch */}
                  <div 
                    onClick={() => toggleConsent(consent.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                      consent.active ? 'bg-slate-900 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${
                        consent.active ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* RIGHT: ACCESS LOGS */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <Eye className="w-5 h-5 text-slate-500" />
            Recent Activity Logs
          </h2>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-8 py-2">
              
              {/* Log Item 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Apollo Hospitals accessed Lab Reports</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Today, 10:42 AM</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">IP: 192.168.1.1</span>
                  </div>
                </div>
              </div>

              {/* Log Item 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">New device login (Windows / Chrome)</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Yesterday, 08:15 PM</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px]">IP: 45.33.22.1</span>
                  </div>
                </div>
              </div>
              
              {/* Log Item 3 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Password changed successfully</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Aug 12, 11:30 AM</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM: ACCOUNT ACTIONS */}
        <section className="lg:col-span-2 space-y-4 pt-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <ShieldAlert className="w-5 h-5 text-slate-500" />
            Account Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <motion.div 
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Change Password</h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Last updated 15 days ago</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Two-Factor Auth</h3>
                <p className="text-[11px] font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enabled via App
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.1)' }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 shadow-sm flex items-center gap-4 cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Sign Out Everywhere</h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">End all active sessions</p>
              </div>
            </motion.div>

          </div>
        </section>

      </div>
    </motion.div>
  );
};

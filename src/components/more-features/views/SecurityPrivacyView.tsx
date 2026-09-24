import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, ShieldAlert, Key, UserCheck, Eye, Smartphone, CheckCircle2, 
  AlertCircle, Clock, LogOut, X, ShieldCheck, Laptop, Server, Database, Shield, FileText, Stethoscope, Hospital, Activity
} from 'lucide-react';

export const SecurityPrivacyView: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [confirmAction, setConfirmAction] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);

  // Dummy State mimicking Backend Integration
  const [sessions, setSessions] = useState([
    { id: 1, type: 'Desktop', os: 'Windows / Chrome', location: 'Local Network', time: 'Active now', current: true, icon: Laptop },
    { id: 2, type: 'Mobile', os: 'iOS / Safari', location: 'Remote Access', time: 'Yesterday, 08:15 PM', current: false, icon: Smartphone }
  ]);

  const [healthAccess] = useState([
    { id: 1, category: 'Doctors', icon: Stethoscope, status: '2 Authorized', updated: 'Today, 10:42 AM' },
    { id: 2, category: 'Hospitals', icon: Hospital, status: 'Apollo Hospitals', updated: 'Aug 12, 11:30 AM' },
    { id: 3, category: 'Insurance Providers', icon: Shield, status: 'Pending Review', updated: '3 days ago' },
  ]);

  const [consents, setConsents] = useState([
    { id: 'c1', name: 'Medical Records Sharing', desc: 'Allow authorized doctors to view your complete medical history.', active: true },
    { id: 'c2', name: 'Lab Reports Sharing', desc: 'Automatically share lab results with connected hospitals.', active: true },
    { id: 'c3', name: 'Prescription Sharing', desc: 'Share medication history with your registered pharmacy.', active: false },
    { id: 'c4', name: 'Insurance Claim Data Sharing', desc: 'Allow insurance providers to verify claim data.', active: true },
    { id: 'c5', name: 'Emergency Access', desc: 'Allow ER staff to bypass standard access protocols in life-threatening scenarios.', active: true }
  ]);

  const [privacyPrefs, setPrivacyPrefs] = useState({
    profileVisibility: true,
    contactSharing: false,
    analytics: true
  });

  const [logs] = useState([
    { id: 1, event: 'Healthcare data access permission changed', date: 'Today, 10:42 AM', type: 'info' },
    { id: 2, event: 'New device login (Windows / Chrome)', date: 'Yesterday, 08:15 PM', type: 'warning' },
    { id: 3, event: 'Password changed successfully', date: 'Aug 12, 11:30 AM', type: 'success' },
    { id: 4, event: 'Successful login', date: 'Aug 12, 11:25 AM', type: 'info' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignOutDevice = (id: number) => {
    setConfirmAction({
      isOpen: true,
      title: 'Sign Out Device',
      message: 'Are you sure you want to end the session on this device? You will need to log in again.',
      onConfirm: () => {
        setSessions(prev => prev.filter(s => s.id !== id));
        showToast('Session ended successfully.');
        setConfirmAction(null);
      }
    });
  };

  const handleSignOutAll = () => {
    setConfirmAction({
      isOpen: true,
      title: 'Sign Out Other Devices',
      message: 'This will end all active sessions except your current one. Proceed?',
      onConfirm: () => {
        setSessions(prev => prev.filter(s => s.current));
        showToast('All other sessions ended.');
        setConfirmAction(null);
      }
    });
  };

  const toggleConsent = (id: string) => {
    const consent = consents.find(c => c.id === id);
    if (!consent) return;
    
    if (consent.active) {
      setConfirmAction({
        isOpen: true,
        title: 'Revoke Consent',
        message: `Are you sure you want to revoke consent for ${consent.name}? This may impact your healthcare services and data flow.`,
        onConfirm: () => {
          setConsents(prev => prev.map(c => c.id === id ? { ...c, active: false } : c));
          showToast('Consent revoked successfully.');
          setConfirmAction(null);
        }
      });
    } else {
      setConsents(prev => prev.map(c => c.id === id ? { ...c, active: true } : c));
      showToast('Consent granted.');
    }
  };

  const savePrivacyPrefs = () => {
    showToast('Privacy preferences saved successfully (Backend API pending).');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl w-full mx-auto space-y-8 font-sans pb-24 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white ${toastMessage.includes('Revoked') ? 'bg-amber-500' : 'bg-slate-800 dark:bg-slate-700'}`}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70]"
              onClick={() => setConfirmAction(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-[80] overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{confirmAction.title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {confirmAction.message}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmAction(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={confirmAction.onConfirm} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-500/30">
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PAGE HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden ring-1 ring-inset ring-white/5"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-600/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 items-center justify-center">
            <Lock className="w-8 h-8 text-slate-300 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 block">ACCOUNT SECURITY</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Security & Privacy
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Manage your account security, privacy preferences, healthcare data access, and consent.
            </p>
          </div>
        </div>
      </motion.div>

      {/* TOP SECURITY OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Account Security', status: 'Protected', icon: Lock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { title: 'Two-Factor Auth', status: 'Enabled', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { title: 'Active Sessions', status: `${sessions.length} Devices`, icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { title: 'Privacy Status', status: 'Preferences Protected', icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{card.title}</h3>
              <p className="text-sm font-black text-slate-900 dark:text-white">{card.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* SECTION 1: PASSWORD & AUTHENTICATION */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <Key className="w-4 h-4 text-slate-500" />
              Password & Authentication
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Password strength: Strong
                  </p>
                </div>
                <button onClick={() => showToast('Redirecting to password reset...')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-lg transition-colors">
                  Update
                </button>
              </div>
              <div className="p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Login verification settings are enabled.
                  </p>
                </div>
                <button onClick={() => showToast('Managing 2FA settings...')} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-sm font-bold rounded-lg transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: ACTIVE DEVICES & SESSIONS */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <Server className="w-4 h-4 text-slate-500" />
              Active Devices & Sessions
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <session.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        {session.os}
                        {session.current && <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Current Device</span>}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {session.type} • {session.location} • {session.time}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button onClick={() => handleSignOutDevice(session.id)} className="text-sm font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
              {sessions.length > 1 && (
                <div className="mt-2 p-2 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={handleSignOutAll} className="w-full py-3 flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out Other Devices
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 4: CONSENT MANAGEMENT */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <FileText className="w-4 h-4 text-slate-500" />
              Consent Management
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
              {consents.map((consent) => (
                <div key={consent.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{consent.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-sm">
                      {consent.desc}
                    </p>
                  </div>
                  <div 
                    onClick={() => toggleConsent(consent.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                      consent.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${
                        consent.active ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* SECTION 7: DATA PROTECTION INFORMATION */}
          <section>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" />
                Your Healthcare Data
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Healthcare data access is strictly controlled through robust authentication, authorization, and your explicit user consent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Secure Account Access',
                  'Role-Based Permissions',
                  'Consent-Based Data Sharing',
                  'Security Activity Monitoring'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: HEALTHCARE DATA ACCESS */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <Database className="w-4 h-4 text-slate-500" />
              Healthcare Data Access
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-2">
              {healthAccess.map((access) => (
                <div key={access.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <access.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{access.category}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {access.status} • Last updated: {access.updated}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => showToast(`Managing access for ${access.category}`)} className="text-sm font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: PRIVACY CONTROLS */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              Privacy Controls
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Profile Visibility</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Make profile searchable by connected hospitals.</p>
                </div>
                <div onClick={() => setPrivacyPrefs(p => ({...p, profileVisibility: !p.profileVisibility}))} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${privacyPrefs.profileVisibility ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm ${privacyPrefs.profileVisibility ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contact Information Sharing</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Share email and phone with third-party partners.</p>
                </div>
                <div onClick={() => setPrivacyPrefs(p => ({...p, contactSharing: !p.contactSharing}))} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${privacyPrefs.contactSharing ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm ${privacyPrefs.contactSharing ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Analytics & Data Improvement</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allow anonymous data usage to improve services.</p>
                </div>
                <div onClick={() => setPrivacyPrefs(p => ({...p, analytics: !p.analytics}))} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${privacyPrefs.analytics ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm ${privacyPrefs.analytics ? 'translate-x-4.5' : 'translate-x-1'}`} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={savePrivacyPrefs} className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black rounded-xl transition-colors shadow-md">
                  Save Privacy Preferences
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 6: SECURITY ACTIVITY */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
              <Activity className="w-4 h-4 text-slate-500" />
              Security Activity
            </h2>
            <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-6 py-2">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white dark:bg-slate-900/60 rounded-full flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        log.type === 'success' ? 'bg-emerald-500' : 
                        log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{log.event}</h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" /> {log.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
};

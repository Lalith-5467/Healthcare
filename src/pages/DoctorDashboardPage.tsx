import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { LogOut, Stethoscope, Menu, X, Bell, ShieldCheck } from 'lucide-react';
import { DoctorSidebar } from '../components/doctor-dashboard/DoctorSidebar';

// Views
import { DoctorOverviewView } from '../components/doctor-dashboard/views/DoctorOverviewView';
import { QRScannerView } from '../components/doctor-dashboard/views/QRScannerView';
import { Patient360View } from '../components/doctor-dashboard/views/Patient360View';
import { ConsultationView } from '../components/doctor-dashboard/views/ConsultationView';
import { MyPatientsDirectoryView } from '../components/doctor-dashboard/views/MyPatientsDirectoryView';
import { DoctorAppointmentsScheduleView } from '../components/doctor-dashboard/views/DoctorAppointmentsScheduleView';
import { ClinicalNotesPrescriptionsView } from '../components/doctor-dashboard/views/ClinicalNotesPrescriptionsView';
import { DoctorProfileSettingsView } from '../components/doctor-dashboard/views/DoctorProfileSettingsView';

interface DoctorDashboardPageProps {
  user?: { name: string; email: string };
  onLogout: () => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState<string | null>('1');

  const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Rajesh Varma';

  const handleScanSuccess = (patientId: string) => {
    setScannedPatientId(patientId);
    setActiveNav('patient-360');
  };

  const handleSelectPatient = (patientId: string) => {
    setScannedPatientId(patientId);
    setActiveNav('patient-360');
  };

  const handleStartConsultation = (patientId: string) => {
    setScannedPatientId(patientId);
    setActiveNav('consultations');
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DoctorOverviewView onNavigate={setActiveNav} user={user} />;
      case 'scan':
        return <QRScannerView onScanSuccess={handleScanSuccess} />;
      case 'patients':
      case 'patient-directory':
        return <MyPatientsDirectoryView onSelectPatient={handleSelectPatient} />;
      case 'appointments':
      case 'schedule':
        return <DoctorAppointmentsScheduleView onStartConsultation={handleStartConsultation} />;
      case 'patient-360':
      case 'ai-summary':
      case 'medications':
      case 'vitals':
      case 'labs':
      case 'documents':
      case 'nurse-updates':
        return <Patient360View patientId={scannedPatientId || '1'} onNavigate={setActiveNav} />;
      case 'consultations':
        return <ConsultationView patientId={scannedPatientId || '1'} />;
      case 'prescriptions':
      case 'clinical-notes':
        return <ClinicalNotesPrescriptionsView />;
      case 'settings':
      case 'profile':
        return <DoctorProfileSettingsView />;
      default:
        return <DoctorOverviewView onNavigate={setActiveNav} user={user} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-sans flex flex-col select-none">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-cyan-300 bg-teal-500/10 dark:bg-cyan-900/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-teal-500/20">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-cyan-400" /> Doctor Portal
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> ABDM Practitioner Console
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quick QR Scanner Shortcut */}
          <button
            onClick={() => setActiveNav('scan')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-teal-200 dark:border-teal-800/60"
          >
            <span>Scan QR</span>
          </button>

          {/* User Display Pill */}
          <div className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {doctorName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{doctorName}</span>
          </div>

          {/* Notifications */}
          <button 
            onClick={() => setActiveNav('appointments')}
            className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Appointments"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0b1120] animate-pulse"></span>
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block shrink-0">
          <DoctorSidebar activeNav={activeNav} onNavigate={setActiveNav} user={user} />
        </div>

        {/* MOBILE SIDEBAR MODAL */}
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-[#0b1120] shadow-2xl"
              >
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-black text-teal-600 dark:text-cyan-400 uppercase text-xs">CLINICAL MENU</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <DoctorSidebar 
                  activeNav={activeNav} 
                  onNavigate={(id) => { setActiveNav(id); setIsSidebarOpen(false); }} 
                  user={user}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#070c18] p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

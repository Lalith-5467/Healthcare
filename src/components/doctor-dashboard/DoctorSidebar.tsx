import React from 'react';
import { 
  Home, 
  Scan, 
  Users, 
  Calendar, 
  Stethoscope, 
  UserCircle, 
  Brain, 
  Pill, 
  Activity, 
  TestTube, 
  FileText, 
  HeartPulse, 
  RefreshCw, 
  ClipboardEdit, 
  MessageSquare, 
  AlertTriangle, 
  Bell, 
  Settings
} from 'lucide-react';

interface DoctorSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeNav, onNavigate }) => {

  const NAV_ITEMS = [
    { category: 'Primary' },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'scan', 
      label: 'Scan Patient QR', 
      icon: Scan,
      special: true
    },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    
    { category: 'Patient Care' },
    { id: 'patient-360', label: 'Patient 360°', icon: UserCircle },
    { id: 'ai-summary', label: 'AI Clinical Summary', icon: Brain },
    { id: 'medications', label: 'Prescriptions', icon: Pill },
    { id: 'vitals', label: 'Vitals & Trends', icon: Activity },
    { id: 'labs', label: 'Lab Reports', icon: TestTube },
    { id: 'documents', label: 'Medical Documents', icon: FileText },
    { id: 'nurse-updates', label: 'Nurse Care Updates', icon: HeartPulse },
    
    { category: 'Clinical Management' },
    { id: 'follow-ups', label: 'Follow-ups', icon: RefreshCw },
    { id: 'clinical-notes', label: 'Clinical Notes', icon: ClipboardEdit },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, danger: true },
    
    { category: 'System' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item, index) => {
          if (item.category) {
            return (
              <div key={`cat-${index}`} className="pt-6 pb-2 px-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeNav === item.id || (activeNav === 'patient-360' && ['ai-summary', 'medications', 'vitals', 'labs', 'documents', 'nurse-updates'].includes(item.id!));
          
          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id!)}
                className={`w-full mt-2 mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition-all shadow-lg hover:shadow-xl ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-teal-500/30' 
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-teal-500/20 hover:-translate-y-0.5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                isActive
                  ? item.danger 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                    : 'bg-teal-50 text-teal-600 dark:bg-cyan-900/20 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-600 dark:text-slate-300'} ${item.danger && !isActive ? 'text-rose-400 group-hover:text-rose-500' : ''}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Profile Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-cyan-900/30 border border-teal-200 dark:border-cyan-800 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
          </div>
          <div className="truncate">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">Dr. Rajesh</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Senior Physician</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

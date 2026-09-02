import React from 'react';
import { 
  Home, 
  Users, 
  Pill, 
  CheckSquare, 
  Activity, 
  Calendar, 
  AlertOctagon, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Settings,
  HeartHandshake
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../utils/caregiverWorkflowStorage';

interface CaregiverSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
  user?: { name: string; email: string };
}

export const CaregiverSidebar: React.FC<CaregiverSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const { wards, activeWardId, setActiveWardId, alerts, tasks, notifications } = useCaregiverWorkflow();
  const unreadAlerts = alerts.filter(a => a.status === 'Active').length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { id: 'wards', label: 'My Wards / Dependents', icon: Users, badge: wards.length },
    
    { category: 'Daily Care & Health' },
    { id: 'medications', label: 'Medication Tracker', icon: Pill },
    { id: 'routines', label: 'Daily Care Tasks', icon: CheckSquare, badge: pendingTasks > 0 ? pendingTasks : undefined },
    { id: 'vitals', label: 'Vitals & Biometrics', icon: Activity },
    { id: 'appointments', label: 'Doctor Visits & Calls', icon: Calendar },
    
    { category: 'Emergency & Safety' },
    { id: 'emergency', label: 'SOS & Geofence Safety', icon: AlertOctagon, danger: true, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'records', label: 'ABHA Health Records', icon: FileText },
    { id: 'care-circle', label: 'Care Circle & Consent', icon: ShieldCheck },
    
    { category: 'Account' },
    { id: 'profile', label: 'Caregiver Profile', icon: UserCheck },
    { id: 'settings', label: 'Preferences & Alerts', icon: Settings, badge: unreadNotifs > 0 ? unreadNotifs : undefined }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto select-none">
      
      {/* ACTIVE WARD QUICK SELECTOR */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
          Active Dependent
        </label>
        <div className="space-y-1.5">
          {wards.map(ward => {
            const isCurrent = ward.id === activeWardId;
            return (
              <button
                key={ward.id}
                onClick={() => setActiveWardId(ward.id)}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isCurrent 
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-extrabold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${
                    ward.overallStatus === 'Alert' ? 'bg-rose-500 animate-ping' :
                    ward.overallStatus === 'Needs Attention' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="truncate">{ward.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                  {ward.relationship}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item, index) => {
          if (item.category) {
            return (
              <div key={`cat-${index}`} className="pt-4 pb-1.5 px-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group ${
                isActive
                  ? item.danger 
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold shadow-xs' 
                    : 'bg-teal-500/10 text-teal-700 dark:text-cyan-300 font-extrabold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive 
                    ? item.danger ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-cyan-400' 
                    : item.danger ? 'text-rose-400 group-hover:text-rose-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center ${
                  item.danger 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-teal-600/15 dark:bg-cyan-500/20 text-teal-700 dark:text-cyan-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* CAREGIVER IDENTIFIER FOOTER */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate">
              {user?.name || 'Anita Sharma'}
            </p>
            <p className="text-[10px] font-semibold text-teal-600 dark:text-cyan-400 truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" /> Verified Caregiver
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

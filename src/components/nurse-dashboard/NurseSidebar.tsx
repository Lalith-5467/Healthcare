import React from 'react';
import { 
  Home, 
  Bell, 
  Calendar, 
  Users, 
  Activity, 
  HeartPulse, 
  Pill, 
  ClipboardList, 
  FileText, 
  MapPin, 
  MessageSquare, 
  AlertTriangle,
  History,
  Settings
} from 'lucide-react';
import { useNurseWorkflow } from '../../utils/nurseWorkflowStorage';

interface NurseSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
}

export const NurseSidebar: React.FC<NurseSidebarProps> = ({ activeNav, onNavigate }) => {
  const { bookings } = useNurseWorkflow();
  const pendingRequestsCount = bookings.filter(b => b.status === 'Pending').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'requests', 
      label: 'Care Requests', 
      icon: Bell,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    },
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'patients', label: 'My Patients', icon: Users },
    
    { category: 'Patient Care' },
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'care-plans', label: 'Care Plans', icon: ClipboardList },
    { id: 'nursing-notes', label: 'Nursing Notes', icon: FileText },
    
    { category: 'Tracking & Comm' },
    { id: 'tracking', label: 'Visit Tracking', icon: MapPin },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, danger: true },
    
    { category: 'System' },
    { id: 'history', label: 'Care History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-transparent flex flex-col h-full overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item, index) => {
          if (item.category) {
            return (
              <div key={`cat-${index}`} className="pt-6 pb-2 px-3">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group border ${
                isActive
                  ? item.danger 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50' 
                    : 'bg-gradient-to-r from-teal-500/10 to-transparent text-teal-600 border-teal-200 dark:from-teal-500/20 dark:to-transparent dark:text-teal-400 dark:border-teal-900/50 shadow-sm'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-600 dark:text-slate-300'} ${item.danger && !isActive ? 'text-rose-400 group-hover:text-rose-500' : ''}`} />
                <span>{item.label}</span>
              </div>
              
              {item.badge !== undefined && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Premium Care Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors pointer-events-none"></div>
          <h4 className="text-[13px] font-black text-indigo-900 dark:text-indigo-300 relative z-10 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5" /> Premium Care
          </h4>
          <p className="text-[10px] font-medium text-indigo-700 dark:text-indigo-200/70 leading-relaxed relative z-10">
            Unlock advanced features and priority support.
          </p>
          <button className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg w-fit transition-colors relative z-10 shadow-sm">
            Upgrade Now →
          </button>
        </div>
      </div>

      {/* Profile Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070c18] flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400 font-bold text-sm shadow-sm">
            S
          </div>
          <div className="truncate">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight">Nurse Sarah</p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">Senior RN</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

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
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                isActive
                  ? item.danger 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
                    : 'bg-[#00a896]/10 text-[#00a896] dark:bg-cyan-900/20 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} ${item.danger && !isActive ? 'text-rose-400 group-hover:text-rose-500' : ''}`} />
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
      
      {/* Profile Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
            <HeartPulse className="w-5 h-5 text-rose-500" />
          </div>
          <div className="truncate">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">Nurse Sarah</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Senior RN</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

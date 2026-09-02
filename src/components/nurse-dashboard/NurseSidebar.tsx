import React from 'react';
import { 
  Home, 
  Bell, 
  Calendar, 
  Stethoscope, 
  AlertTriangle,
  ShieldCheck,
  User,
  Settings,
  Package,
  History
} from 'lucide-react';
import { useNurseWorkflow } from '../../utils/nurseWorkflowStorage';

interface NurseSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
  user?: { name: string; email: string };
}

export const NurseSidebar: React.FC<NurseSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const { bookings } = useNurseWorkflow();
  const pendingRequestsCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCareCount = bookings.filter(b => b.status === 'Accepted' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress').length;

  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Sarah Jenkins';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { 
      id: 'requests', 
      label: 'Care Requests', 
      icon: Bell,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      badgeColor: 'bg-rose-500'
    },
    { 
      id: 'patients', 
      label: 'Active Patient Care', 
      icon: Stethoscope,
      badge: activeCareCount > 0 ? `${activeCareCount} Active` : undefined,
      badgeColor: 'bg-emerald-600'
    },
    { id: 'schedule', label: 'Today’s Visits', icon: Calendar },
    { id: 'inventory', label: 'Medical Kit & Supplies', icon: Package },
    { id: 'history', label: 'Care History & Records', icon: History },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, danger: true },
    
    { category: 'Nurse Station' },
    { id: 'profile', label: 'Nurse Profile & KYC', icon: User },
    { id: 'settings', label: 'Station Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] select-none font-sans overflow-y-auto">
      
      {/* NURSE SHIFT STATUS CARD */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-rose-50/80 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10 border border-rose-200/60 dark:border-rose-800/40 space-y-1.5 hover:border-rose-400 dark:hover:border-rose-700 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty Shift
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">RN-7701</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {nurseName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Senior RN • Home Healthcare
          </p>
        </button>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Clinical Workflow
          </span>
        </div>

        {NAV_ITEMS.map((item, idx) => {
          if (item.category) {
            return (
              <div key={`cat-${idx}`} className="pt-4 pb-1 px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeNav === item.id;

          let btnClass = 'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none ';

          if (isActive) {
            if (item.danger) {
              btnClass += 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 font-bold border border-rose-200/80 dark:border-rose-800/80 shadow-2xs ';
            } else {
              btnClass += 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 font-bold border border-rose-200/60 dark:border-rose-800/40 shadow-2xs ';
            }
          } else {
            if (item.danger) {
              btnClass += 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 font-semibold ';
            } else {
              btnClass += 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium ';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={btnClass}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? 'text-rose-600 dark:text-rose-400' 
                    : item.danger 
                    ? 'text-rose-500' 
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive 
                    ? 'bg-rose-500 text-white shadow-2xs' 
                    : item.badgeColor ? `${item.badgeColor} text-white` : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* FOOTER BADGE */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">ABDM Verified Nurse Portal</span>
        </div>
      </div>
    </aside>
  );
};

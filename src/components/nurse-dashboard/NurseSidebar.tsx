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

type ColorTheme = 'blue' | 'amber' | 'emerald' | 'purple' | 'indigo' | 'rose' | 'slate';

export const NurseSidebar: React.FC<NurseSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const { bookings } = useNurseWorkflow();
  const pendingRequestsCount = bookings.filter(b => b.status === 'Pending').length;
  const activeCareCount = bookings.filter(b => b.status === 'Accepted' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Care in Progress').length;

  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Sarah Jenkins';

  const NAV_ITEMS: Array<{
    id?: string;
    label?: string;
    icon?: any;
    category?: string;
    color?: ColorTheme;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Command Center', icon: Home, color: 'blue' },
    { 
      id: 'requests', 
      label: 'Care Requests', 
      icon: Bell,
      color: 'amber',
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      badgeColor: 'bg-amber-500'
    },
    { 
      id: 'patients', 
      label: 'Active Patient Care', 
      icon: Stethoscope,
      color: 'emerald',
      badge: activeCareCount > 0 ? `${activeCareCount} Active` : undefined,
      badgeColor: 'bg-emerald-500'
    },
    { id: 'schedule', label: 'Today’s Visits', icon: Calendar, color: 'purple' },
    { id: 'inventory', label: 'Medical Kit & Supplies', icon: Package, color: 'slate' },
    { id: 'history', label: 'Care History & Records', icon: History, color: 'indigo' },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, color: 'rose' },
    
    { category: 'Nurse Station' },
    { id: 'profile', label: 'Nurse Profile & KYC', icon: User, color: 'slate' },
    { id: 'settings', label: 'Station Settings', icon: Settings, color: 'slate' }
  ];

  const getColorClasses = (color: ColorTheme, isActive: boolean) => {
    const themes = {
      blue: {
        active: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50 shadow-sm shadow-blue-500/10',
        hover: 'hover:bg-blue-50/60 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200/40 dark:hover:border-blue-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-blue-600 dark:text-blue-400 scale-110',
        iconInactive: 'text-blue-500/80 dark:text-blue-400/80',
        iconHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110'
      },
      amber: {
        active: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50 shadow-sm shadow-amber-500/10',
        hover: 'hover:bg-amber-50/60 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-200/40 dark:hover:border-amber-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-amber-600 dark:text-amber-400 scale-110',
        iconInactive: 'text-amber-500/80 dark:text-amber-400/80',
        iconHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110'
      },
      emerald: {
        active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/10',
        hover: 'hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-200/40 dark:hover:border-emerald-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-emerald-600 dark:text-emerald-400 scale-110',
        iconInactive: 'text-emerald-500/80 dark:text-emerald-400/80',
        iconHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-110'
      },
      purple: {
        active: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/50 shadow-sm shadow-purple-500/10',
        hover: 'hover:bg-purple-50/60 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-200/40 dark:hover:border-purple-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-purple-600 dark:text-purple-400 scale-110',
        iconInactive: 'text-purple-500/80 dark:text-purple-400/80',
        iconHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:scale-110'
      },
      indigo: {
        active: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50 shadow-sm shadow-indigo-500/10',
        hover: 'hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200/40 dark:hover:border-indigo-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-indigo-600 dark:text-indigo-400 scale-110',
        iconInactive: 'text-indigo-500/80 dark:text-indigo-400/80',
        iconHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110'
      },
      rose: {
        active: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50 shadow-sm shadow-rose-500/10',
        hover: 'hover:bg-rose-50/60 dark:hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-200/40 dark:hover:border-rose-800/40 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-rose-600 dark:text-rose-400',
        iconActive: 'text-rose-600 dark:text-rose-400 scale-110',
        iconInactive: 'text-rose-500/80 dark:text-rose-400/80',
        iconHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:scale-110'
      },
      slate: {
        active: 'bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm shadow-slate-500/5',
        hover: 'hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm hover:-translate-y-0.5',
        text: 'text-slate-600 dark:text-slate-400',
        iconActive: 'text-slate-800 dark:text-slate-200 scale-110',
        iconInactive: 'text-slate-500/80 dark:text-slate-400/80',
        iconHover: 'group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:scale-110'
      }
    };
    
    const t = themes[color];
    
    if (isActive) {
      return {
        wrapper: `${t.active} font-black border`,
        icon: t.iconActive
      };
    } else {
      return {
        wrapper: `${t.text} ${t.hover} font-semibold border border-transparent`,
        icon: `${t.iconInactive} ${t.iconHover}`
      };
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] select-none font-sans overflow-y-auto">
      
      {/* NURSE SHIFT STATUS CARD */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1.5 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty Shift
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-600/70 dark:text-emerald-400/70">RN-7701</span>
          </div>
          <p className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {nurseName}
          </p>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold truncate">
            Senior RN • Home Healthcare
          </p>
        </button>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-3 py-3 space-y-1.5">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Clinical Workflow
          </span>
        </div>

        {NAV_ITEMS.map((item, idx) => {
          if (item.category) {
            return (
              <div key={`cat-${idx}`} className="pt-4 pb-1 px-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeNav === item.id;
          const theme = getColorClasses(item.color || 'slate', isActive);

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-300 group cursor-pointer outline-none ${theme.wrapper}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-all duration-300 ${theme.icon}`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isActive 
                    ? `${item.badgeColor || 'bg-slate-500'} text-white shadow-sm` 
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
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="truncate">ABDM Verified</span>
        </div>
      </div>
    </aside>
  );
};

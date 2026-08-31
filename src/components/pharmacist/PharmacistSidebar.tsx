import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Pill,
  Users,
  Bell,
  Settings,
  RefreshCw,
  ChevronRight,
  ArrowLeftRight,
  Building2
} from 'lucide-react';
import { getPharmacyOrders } from '../../utils/healthWorkflowStorage';

interface PharmacistSidebarProps {
  activeId: string;
  onSelectNav: (id: string, filterSubtab?: string) => void;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export const PharmacistSidebar: React.FC<PharmacistSidebarProps> = ({
  activeId,
  onSelectNav,
  user = {
    name: 'Suresh Nair',
    email: 'suresh.nair@apollopharmacy.in',
    role: 'Pharmacist'
  },
  onLogout,
}) => {
  // Live pending orders counter
  const orders = getPharmacyOrders();
  const pendingCount = orders.filter((o) => o.status === 'Pending Pharmacist Verification').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pharmacy Orders', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'medicines', label: 'Medicines & Stock', icon: Pill },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 select-none font-sans z-40 overflow-y-auto">
      {/* TOP: PHARMACY BADGE */}
      <div className="space-y-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-1.5 font-extrabold text-[#00a896] dark:text-cyan-400 relative z-10">
            <Building2 className="w-3.5 h-3.5" />
            <span>Apollo Central Store</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono relative z-10">
            LSC ID: LSC-2024-AP-0015
          </p>
        </div>



        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                className={`w-full px-3 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500/10 to-transparent text-[#00a896] dark:text-cyan-400 border-teal-200 dark:border-teal-900/50 shadow-sm'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${item.badgeColor || 'bg-teal-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM: USER PROFILE */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* PHARMACIST PROFILE CARD */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
              {(user.name || 'Pharmacist')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="truncate min-w-0 flex-1">
              <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                Registered Pharmacist
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block truncate">
                Pharmacist
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

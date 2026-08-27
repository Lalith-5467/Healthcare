import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Pill,
  Users,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  RefreshCw,
  ChevronRight,
  ArrowLeftRight
} from 'lucide-react';
import { Logo } from '../ui/Logo';
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
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 select-none font-sans z-40">
      {/* TOP: LOGO & PHARMACY BADGE */}
      <div className="space-y-4">
        <div className="px-2 pt-2">
          <Logo />
        </div>

        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-[#00a896] dark:text-cyan-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Apollo Central Store</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Lic: DL-TN-2024-PH-8941
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
                className={`w-full px-3 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00a896] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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

      {/* BOTTOM: USER PROFILE & LOGOUT */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* PHARMACIST PROFILE CARD */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs flex items-center justify-center font-mono">
              {(user.name || 'Pharmacist')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[100px]">
                {user.name}
              </div>
              <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-bold block">
                Registered Pharmacist
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

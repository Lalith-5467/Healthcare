import React from 'react';
<<<<<<< HEAD
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  Pill, 
  Users, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Truck,
  FileCheck2,
  Receipt,
  Settings,
  ShieldAlert,
  Building2,
  CheckCircle2,
  ChevronRight
=======
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
>>>>>>> origin/main
} from 'lucide-react';
import { getPharmacyOrders } from '../../utils/healthWorkflowStorage';

interface PharmacistSidebarProps {
  activeId: string;
  onSelectNav: (id: string, filterTab?: string) => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    hospitalAffiliation?: string;
  };
  onLogout?: () => void;
}

export const PharmacistSidebar: React.FC<PharmacistSidebarProps> = ({
  activeId,
  onSelectNav,
  user
}) => {
  const orders = getPharmacyOrders();
  const pendingCount = orders.filter((o) => (o.status as string) === 'Pending Pharmacist Verification' || (o.status as string) === 'PENDING' || (o.status as string) === 'Order Received').length;
  const pharmacistName = React.useMemo(() => {
    if (user?.name && user.name !== 'Suresh Nair' && user.name !== 'Registered Pharmacist') {
      return user.name;
    }
    try {
      const stored = localStorage.getItem('pharmacist_user_name');
      if (stored) return stored;
      const appUser = localStorage.getItem('app_user');
      if (appUser) {
        const parsed = JSON.parse(appUser);
        if (parsed?.name) return parsed.name;
      }
    } catch {}
    return user?.name || 'Registered Pharmacist';
  }, [user?.name]);

  // PROFESSIONAL PHARMACY WORKSTATION NAV GROUPS
  const SECTIONS = [
    {
      title: 'Pharmacy Operations',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { 
          id: 'orders', 
          label: 'Dispensary Orders', 
          icon: ShoppingBag, 
          badge: pendingCount > 0 ? `${pendingCount} New` : '4 New', 
          badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' 
        },
        { 
          id: 'prescriptions', 
          label: 'Prescriptions Queue', 
          icon: FileText, 
          badge: '2 Urgent', 
          badgeStyle: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' 
        },
        { 
          id: 'medicines', 
          label: 'Stock & Inventory', 
          icon: Pill, 
          badge: '3 Low', 
          badgeStyle: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' 
        },
        { id: 'patients', label: 'Patient Directory', icon: Users }
      ]
    },
    {
      title: 'Clinical & Compliance',
      items: [
        { 
          id: 'drug-interaction', 
          label: 'Drug Safety Radar', 
          icon: ShieldAlert, 
          badge: 'AI Radar', 
          badgeStyle: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' 
        },
        { id: 'supplier-orders', label: 'Wholesale Restock POs', icon: Truck },
        { id: 'schedule-audit', label: 'Schedule Drug Logs (H/X)', icon: FileCheck2 }
      ]
    },
    {
      title: 'Store & Financials',
      items: [
        { id: 'billing', label: 'GST Invoices & Billing', icon: Receipt },
        { id: 'settings', label: 'Store Profile & Licenses', icon: Settings }
      ]
    }
  ];

  return (
<<<<<<< HEAD
    <aside className="w-72 h-[calc(100vh-4rem)] bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between p-4 select-none font-sans overflow-y-auto shrink-0 shadow-xs">
      
      {/* TOP DISPENSARY PROFILE CARD */}
      <div className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 border border-teal-500/20 dark:border-teal-500/30 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00a896] dark:text-cyan-300 flex items-center gap-1.5 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Online Dispensary
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              AP-8941
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a896] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
              {pharmacistName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                {pharmacistName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#00a896] shrink-0" />
                <span>Apollo Central Pharmacy Hub</span>
              </p>
            </div>
          </div>
        </div>

        {/* STRUCTURED NAVIGATION LIST */}
        <nav className="space-y-4">
          {SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                  {section.title}
                </span>
              </div>
=======
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
>>>>>>> origin/main

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all group cursor-pointer outline-none relative ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/15 to-teal-500/5 text-[#00a896] dark:text-cyan-300 font-black border border-teal-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive 
                          ? 'text-[#00a896] dark:text-cyan-400' 
                          : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`} />
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full shrink-0 border ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

<<<<<<< HEAD
      {/* FOOTER BADGE */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
            <span className="truncate">ABDM Verified Hub</span>
          </div>
          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            PCI Licensed
          </span>
=======
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
>>>>>>> origin/main
        </div>
      </div>
    </aside>
  );
};



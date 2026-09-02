import React from 'react';
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
  ShieldAlert
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
  const pendingCount = orders.filter((o) => o.status === 'Pending Pharmacist Verification').length;

  const pharmacistName = user?.name || 'Registered Pharmacist';

  // 3-TIER PROFESSIONAL PHARMACY WORKSTATION NAV GROUPS
  const SECTIONS = [
    {
      title: 'Pharmacy Operations',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'orders', label: 'Dispensary Orders', icon: ShoppingBag, badge: pendingCount > 0 ? `${pendingCount} New` : undefined, badgeColor: 'bg-amber-500' },
        { id: 'prescriptions', label: 'E-Prescriptions Queue', icon: FileText, badge: '2 Urgent', badgeColor: 'bg-rose-500' },
        { id: 'medicines', label: 'Stock & Inventory', icon: Pill, badge: '3 Low', badgeColor: 'bg-cyan-500' },
        { id: 'patients', label: 'Patient Directory', icon: Users }
      ]
    },
    {
      title: 'Clinical & Compliance',
      items: [
        { id: 'drug-interaction', label: 'Drug Safety & Interaction', icon: ShieldAlert, badge: 'AI Radar', badgeColor: 'bg-indigo-500' },
        { id: 'supplier-orders', label: 'Wholesaler POs & Restock', icon: Truck },
        { id: 'schedule-audit', label: 'Schedule Drug Logs (H/X)', icon: FileCheck2 }
      ]
    },
    {
      title: 'Store & Financials',
      items: [
        { id: 'billing', label: 'Billing & GST Invoices', icon: Receipt },
        { id: 'settings', label: 'Store Profile & Licenses', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between p-3.5 select-none font-sans overflow-y-auto">
      
      {/* TOP STORE STATUS */}
      <div className="space-y-4">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50/80 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/10 border border-teal-200/60 dark:border-cyan-800/40 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-cyan-300 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online Dispensary
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">AP-8941</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {pharmacistName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Apollo Central Pharmacy Hub
          </p>
        </div>

        {/* STRUCTURED NAVIGATION LIST */}
        <nav className="space-y-4">
          {SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </span>
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-cyan-300 font-bold border border-teal-200/60 dark:border-cyan-800/40 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive 
                          ? 'text-teal-600 dark:text-cyan-400' 
                          : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 text-white shadow-2xs ${item.badgeColor || 'bg-amber-500'}`}>
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

      {/* FOOTER BADGE */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">ABDM Verified</span>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            PCI Licensed
          </span>
        </div>
      </div>
    </aside>
  );
};


import React from 'react';
import { 
  Home, 
  Search, 
  FileText, 
  ShieldCheck, 
  CheckSquare, 
  Building2, 
  CreditCard,
  Settings
} from 'lucide-react';
import { useInsuranceWorkflow } from '../../utils/insuranceWorkflowStorage';

interface InsuranceSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
  user?: { name: string; email: string };
}

export const InsuranceSidebar: React.FC<InsuranceSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const { records } = useInsuranceWorkflow();
  const pendingReviewCount = records.filter(r => r.currentClaim !== null && r.currentClaim.status === 'Under Review').length;

  const officerName = user?.name || 'Insurance Officer';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { 
      id: 'search', 
      label: 'Search Policy ID', 
      icon: Search,
      special: true
    },
    { 
      id: 'claims', 
      label: 'Claims & Approvals', 
      icon: FileText,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Active` : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'preauth', label: 'Cashless Pre-Auth', icon: CheckSquare },
    { id: 'policies', label: 'Policies Directory', icon: ShieldCheck },
    { id: 'hospitals', label: 'Network Hospitals', icon: Building2 },
    { id: 'settlements', label: 'Settlements & Payouts', icon: CreditCard },
    
    { category: 'TPA Clearinghouse' },
    { id: 'settings', label: 'TPA Desk Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] select-none font-sans overflow-y-auto">
      
      {/* CLEARINGHOUSE OPERATOR CARD */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              TPA Clearinghouse
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">TPA-8821</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {officerName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Star Health & Apollo Cashless Hub
          </p>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Claims Operations
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
          const isActive = activeNav === item.id || (activeNav === 'profile' && item.id === 'search');

          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id!)}
                className={`w-full my-2 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-blue-500/25' 
                    : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none ${
                isActive
                  ? 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-cyan-300 font-bold border border-blue-200/60 dark:border-blue-800/40 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-cyan-400' 
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-2xs' 
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
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
          <span className="truncate">ABDM Insurance Clearinghouse</span>
        </div>
      </div>
    </aside>
  );
};

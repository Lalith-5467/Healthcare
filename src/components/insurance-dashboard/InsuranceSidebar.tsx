import React from 'react';
import { 
  Home, 
  Search, 
  Users, 
  ShieldCheck, 
  FileText, 
  CheckSquare, 
  CreditCard, 
  Building2, 
  BarChart3, 
  Bell, 
  Settings
} from 'lucide-react';

interface InsuranceSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
}

export const InsuranceSidebar: React.FC<InsuranceSidebarProps> = ({ activeNav, onNavigate }) => {

  const NAV_ITEMS = [
    { category: 'Primary' },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'search', 
      label: 'Search Insurance ID', 
      icon: Search,
      special: true
    },
    { id: 'policy-holders', label: 'Policy Holders', icon: Users },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    
    { category: 'Claims & Approvals' },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'pre-auth', label: 'Pre-Authorization', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'hospitalizations', label: 'Hospitalizations', icon: Building2 },
    
    { category: 'System' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
          const isActive = activeNav === item.id || (activeNav === 'profile' && ['search'].includes(item.id!));
          
          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id!)}
                className={`w-full mt-2 mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition-all shadow-lg hover:shadow-xl ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/20 hover:-translate-y-0.5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* Profile Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="truncate">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">Insurance Team</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Claims Dept.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

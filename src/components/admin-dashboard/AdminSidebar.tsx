import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, HeartPulse, Pill, 
  HeartHandshake, ShieldCheck, ShieldAlert, KeyRound, FileText, 
  ShoppingBag, Calendar, Activity, Bell, FileSpreadsheet, 
  BarChart3, Settings, Shield, Server, Database, ChevronRight, Lock
} from 'lucide-react';
import { Logo } from '../ui/Logo';

interface AdminSidebarProps {
  activeId: string;
  onSelectNav: (id: string) => void;
  currentRole: 'Admin' | 'Super Admin';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  superAdminOnly?: boolean;
}

interface NavSection {
  title: string;
  isSuperAdminOnly?: boolean;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeId,
  onSelectNav,
  currentRole,
  isCollapsed
}) => {
  const isSuperAdmin = currentRole === 'Super Admin';

  const SECTIONS: NavSection[] = [
    {
      title: 'Core Administration',
      items: [
        { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users, badge: '12.4k' },
        { id: 'patients', label: 'Patient Registry', icon: UserCheck, badge: '8.4k' },
        { id: 'doctors', label: 'Doctor Directory', icon: Stethoscope, badge: '1.2k' },
        { id: 'nurses', label: 'Nurse Directory', icon: HeartPulse, badge: '1.8k' },
        { id: 'pharmacists', label: 'Pharmacist Hub', icon: Pill },
        { id: 'caregivers', label: 'Caregiver Roster', icon: HeartHandshake },
        { id: 'insurance', label: 'Insurance & TPA', icon: ShieldCheck }
      ]
    },
    {
      title: 'Clinical Operations',
      items: [
        { id: 'medical-records', label: 'Medical Records', icon: FileText },
        { id: 'prescriptions', label: 'Prescription Control', icon: Pill },
        { id: 'pharmacy-orders', label: 'Pharmacy Orders', icon: ShoppingBag, badge: '4 New', badgeColor: 'bg-amber-500' },
        { id: 'appointments', label: 'Appointments Matrix', icon: Calendar },
        { id: 'vitals-monitoring', label: 'Vitals Telemetry', icon: Activity },
        { id: 'notifications-dispatch', label: 'Notifications', icon: Bell }
      ]
    },
    {
      title: 'Intelligence & Audit',
      items: [
        { id: 'activity-logs', label: 'Activity & Audit Logs', icon: FileSpreadsheet },
        { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'Governance & Security (Super Admin)',
      isSuperAdminOnly: true,
      items: [
        { id: 'admin-management', label: 'Admin Management', icon: Shield, superAdminOnly: true },
        { id: 'roles-permissions', label: 'Roles & Permissions', icon: KeyRound, superAdminOnly: true },
        { id: 'system-config', label: 'System Configuration', icon: Server, superAdminOnly: true },
        { id: 'security-audit', label: 'Security & Audit Radar', icon: ShieldAlert, superAdminOnly: true, badge: 'Alerts', badgeColor: 'bg-rose-500' },
        { id: 'backup-recovery', label: 'Backup & Recovery', icon: Database, superAdminOnly: true }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-[calc(100vh-4rem)] bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 select-none font-sans overflow-y-auto transition-all duration-300`}
    >
      <div className="space-y-4">
        
        {/* ROLE BADGE BANNER */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900 text-white border border-blue-800/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {!isCollapsed && 'Authority Node'}
            </span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
              isSuperAdmin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
            }`}>
              {isSuperAdmin ? 'SUPER' : 'ADMIN'}
            </span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-xs font-black text-white truncate">
                {isSuperAdmin ? 'Super Admin Directorate' : 'Hospital Executive Admin'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">ABDM Tier-1 Node</p>
            </div>
          )}
        </div>

        {/* STRUCTURED NAV SECTIONS */}
        <nav className="space-y-4">
          {SECTIONS.map((section, sIdx) => {
            if (section.isSuperAdminOnly && !isSuperAdmin) {
              return (
                <div key={sIdx} className="space-y-1">
                  {!isCollapsed && (
                    <div className="px-3 pb-1 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {section.title}
                      </span>
                      <Lock className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectNav(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-600 hover:bg-rose-500/5 cursor-pointer group"
                      title={isCollapsed ? `${item.label} (Super Admin Restricted)` : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <div key={sIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 pb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {section.title}
                    </span>
                  </div>
                )}

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNav(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-300 font-bold border border-blue-500/20 dark:border-cyan-500/30 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive 
                            ? 'text-blue-600 dark:text-cyan-400' 
                            : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      
                      {!isCollapsed && item.badge && (
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 text-white shadow-2xs ${item.badgeColor || 'bg-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACCREDITATION */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-4">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">ABDM Admin Vault</span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              v4.9.2
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          </div>
        )}
      </div>
    </aside>
  );
};

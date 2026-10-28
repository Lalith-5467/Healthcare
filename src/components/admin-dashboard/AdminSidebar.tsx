import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, HeartPulse, Pill, 
  HeartHandshake, ShieldCheck, ShieldAlert, KeyRound, FileText, 
  ShoppingBag, Calendar, Activity, Bell, FileSpreadsheet, 
  BarChart3, Settings, Shield, Server, Database, ChevronRight, Lock, Video, Sliders
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { dashboardApi } from '../../services/dhrApis';

interface AdminSidebarProps {
  activeId: string;
  onSelectNav: (id: string) => void;
  currentRole: 'Admin' | 'Super Admin';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  stats?: any;
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
  isCollapsed,
  stats: propStats
}) => {
  const isSuperAdmin = currentRole === 'Super Admin';
  const [liveStats, setLiveStats] = useState<any>(propStats || null);

  useEffect(() => {
    if (propStats) {
      setLiveStats(propStats);
    }
  }, [propStats]);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = () => {
      dashboardApi.getStats()
        .then((res) => {
          if (isMounted && res && res.data) {
            setLiveStats(res.data);
          }
        })
        .catch(() => {});
    };

    fetchLiveStats();

    const handleUpdate = () => fetchLiveStats();
    window.addEventListener('admin_stats_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('admin_stats_updated', handleUpdate);
    };
  }, []);

  const totalUsersCount = liveStats?.totalUsers;
  const roles = liveStats?.roleDistribution || {};
  const patientCount = roles.PATIENT ?? liveStats?.totalPatients;
  const doctorCount = roles.DOCTOR ?? liveStats?.totalDoctors;
  const nurseCount = roles.NURSE ?? liveStats?.totalNurses;
  const pharmacistCount = roles.PHARMACIST ?? liveStats?.totalPharmacists;
  const caregiverCount = roles.CAREGIVER ?? liveStats?.totalCaregivers;
  const insuranceCount = (roles.INSURANCE_PROVIDER || roles.INSURANCE) ?? liveStats?.totalInsurance;
  const adminCount = ((roles.ADMIN || 0) + (roles.SUPER_ADMIN || 0)) || undefined;
  const ordersCount = liveStats?.totalOrders;

  const SECTIONS: NavSection[] = [
    {
      title: 'Core Administration',
      items: [
        { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
        { 
          id: 'users', 
          label: 'User Management', 
          icon: Users, 
          badge: totalUsersCount !== undefined ? String(totalUsersCount) : undefined 
        },
        { 
          id: 'patients', 
          label: 'Patient Registry', 
          icon: UserCheck, 
          badge: patientCount !== undefined ? String(patientCount) : undefined 
        },
        { 
          id: 'doctors', 
          label: 'Doctor Directory', 
          icon: Stethoscope, 
          badge: doctorCount !== undefined ? String(doctorCount) : undefined 
        },
        { 
          id: 'nurses', 
          label: 'Nurse Directory', 
          icon: HeartPulse, 
          badge: nurseCount !== undefined ? String(nurseCount) : undefined 
        },
        { 
          id: 'pharmacists', 
          label: 'Pharmacist Hub', 
          icon: Pill,
          badge: (pharmacistCount !== undefined && pharmacistCount > 0) ? String(pharmacistCount) : undefined
        },
        { 
          id: 'caregivers', 
          label: 'Caregiver Roster', 
          icon: HeartHandshake,
          badge: (caregiverCount !== undefined && caregiverCount > 0) ? String(caregiverCount) : undefined
        },
        { 
          id: 'insurance', 
          label: 'Insurance & TPA', 
          icon: ShieldCheck,
          badge: (insuranceCount !== undefined && insuranceCount > 0) ? String(insuranceCount) : undefined
        }
      ]
    },
    {
      title: 'Clinical Operations',
      items: [
        { id: 'medical-records', label: 'Medical Records', icon: FileText },
        { id: 'prescriptions', label: 'Prescription Control', icon: Pill },
        { 
          id: 'pharmacy-orders', 
          label: 'Pharmacy Orders', 
          icon: ShoppingBag, 
          badge: (ordersCount !== undefined && ordersCount > 0) ? String(ordersCount) : undefined 
        },
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
        { 
          id: 'admin-management', 
          label: 'Admin Management', 
          icon: Shield, 
          superAdminOnly: true,
          badge: (adminCount !== undefined && adminCount > 0) ? String(adminCount) : undefined
        },
        { id: 'roles-permissions', label: 'Roles & Permissions', icon: KeyRound, superAdminOnly: true },
        { id: 'health-videos', label: 'Health Videos Admin', icon: Video, superAdminOnly: true },
        { id: 'security-audit', label: 'Security & Audit Radar', icon: ShieldAlert, superAdminOnly: true },
        { id: 'backup-recovery', label: 'Backup & Recovery', icon: Database, superAdminOnly: true }
      ]
    },
    {
      title: 'System & Configuration',
      items: [
        { id: 'system-config', label: 'Landing Page & System Config', icon: Sliders },
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
        
        {/* ROLE IDENTITY CARD */}
        <div className="px-3.5 py-3 rounded-xl bg-[#00a896] text-white shadow-xs">
          {!isCollapsed ? (
            <div>
              <p className="text-sm font-black text-white tracking-tight truncate">
                {isSuperAdmin ? 'Super Admin Directorate' : 'Hospital Executive Admin'}
              </p>
              <p className="text-xs text-teal-100/95 font-semibold truncate mt-0.5">
                {isSuperAdmin ? 'Master System Governance' : 'Clinical Operations'}
              </p>
            </div>
          ) : (
            <div className="text-center font-black text-xs text-white tracking-wider">
              {isSuperAdmin ? 'SA' : 'ADM'}
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
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {section.title}
                      </span>
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectNav(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-slate-400 dark:text-slate-600 hover:bg-rose-500/5 cursor-pointer group"
                      title={isCollapsed ? `${item.label} (Super Admin Restricted)` : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon className="w-[18px] h-[18px] shrink-0 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer outline-none ${
                        isActive
                          ? 'bg-[#00a896]/15 text-[#00a896] dark:text-[#2dd4bf] font-bold border border-[#00a896]/30 shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                          isActive 
                            ? 'text-[#00a896] dark:text-[#2dd4bf]' 
                            : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      
                      {!isCollapsed && item.badge && (
                        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 transition-colors ${
                          item.badgeColor 
                            ? `${item.badgeColor} text-white` 
                            : isActive
                            ? 'bg-[#00a896] text-white shadow-2xs'
                            : 'bg-[#00a896]/10 text-[#00796b] dark:bg-[#00a896]/20 dark:text-[#2dd4bf] border border-[#00a896]/20'
                        }`}>
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
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00a896] shrink-0" />
              <span className="truncate">ABDM Admin Vault</span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              v4.9.2
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <ShieldCheck className="w-4 h-4 text-[#00a896]" />
          </div>
        )}
      </div>
    </aside>
  );
};

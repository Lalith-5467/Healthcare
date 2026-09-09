import React from 'react';
import {
  IconDashboard,
  IconBell,
  IconStethoscope,
  IconCalendarEvent,
  IconFirstAidKit,
  IconHistory,
  IconAlertTriangle,
  IconUserCircle,
  IconSettings,
  IconShieldCheck,
} from '@tabler/icons-react';
import { Activity } from 'lucide-react';

const CLINICAL_NAV = [
  { id: 'dashboard', label: 'Command Center', icon: IconDashboard, iconColor: 'text-blue-500' },
  { id: 'requests', label: 'Care Requests', icon: IconBell, badge: '1', badgeType: 'circle', badgeColor: 'bg-amber-500', iconColor: 'text-amber-500' },
  { id: 'patients', label: 'Active Patient Care', icon: IconStethoscope, badge: '2 Active', badgeType: 'pill', badgeColor: 'bg-[#10b981]', iconColor: 'text-emerald-500' },
  { id: 'schedule', label: 'Today\'s Visits', icon: IconCalendarEvent, iconColor: 'text-purple-500' },
  { id: 'inventory', label: 'Medical Kit & Supplies', icon: IconFirstAidKit, iconColor: 'text-slate-500' },
  { id: 'history', label: 'Care History & Records', icon: IconHistory, iconColor: 'text-indigo-500' },
  { id: 'alerts', label: 'Emergency Alerts', icon: IconAlertTriangle, isAlert: true },
];

const STATION_NAV = [
  { id: 'profile', label: 'Nurse Profile & KYC', icon: IconUserCircle, iconColor: 'text-slate-500' },
  { id: 'settings', label: 'Station Settings', icon: IconSettings, iconColor: 'text-slate-500' },
];

interface NurseSidebarProps {
  activeNav: string;
  onNavigate: (id: string) => void;
  user?: { name: string; email: string };
}

export const NurseSidebar: React.FC<NurseSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const nurseName = user?.name ? (user.name.startsWith('Nurse') ? user.name : `Nurse ${user.name}`) : 'Nurse Shiv';
  return (
    <div className="w-[250px] h-full flex flex-col bg-white dark:bg-[#1b1e27] border-r border-[#eceef1] dark:border-slate-800 transition-colors duration-300">
      
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-[#eceef1] dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#00a896] flex items-center justify-center shadow-md">
            <Activity className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black leading-none tracking-tight">
              <span className="text-slate-900 dark:text-white">Medi</span>
              <span className="text-[#00a896]">Care</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Healthcare & Medical
            </span>
          </div>
        </div>
      </div>

      {/* On Duty Card */}
      <div className="p-4">
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-3 border border-emerald-100 dark:border-emerald-900/30 relative">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">On Duty Shift</span>
          </div>
          <span className="absolute top-3 right-3 text-[10px] font-bold text-slate-400">RN-7701</span>
          
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{nurseName}</p>
            <p className="text-[10.5px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-0.5">Senior RN • Home Healthcare</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
        {/* Clinical Workflow */}
        <div className="mb-6 px-3">
          <h3 className="text-[10.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Clinical Workflow</h3>
          <nav className="space-y-1">
            {CLINICAL_NAV.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[12px] transition-all duration-200 border border-transparent ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-600 font-bold'
                      : item.isAlert
                      ? 'text-[#e04848] hover:bg-rose-50 dark:hover:bg-rose-900/10 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-600' : item.isAlert ? 'text-[#e04848]' : item.iconColor || 'text-slate-400'}`} stroke={isActive ? 2 : 1.5} />
                    <span className="text-[13px] truncate text-left">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`shrink-0 text-white font-bold flex items-center justify-center ${item.badgeColor} ${
                        item.badgeType === 'circle' 
                          ? 'w-5 h-5 rounded-full text-[10px]' 
                          : 'px-2 py-0.5 rounded-full text-[10px]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Nurse Station */}
        <div className="px-3">
          <h3 className="text-[10.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-2">Nurse Station</h3>
          <nav className="space-y-1">
            {STATION_NAV.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[12px] transition-all duration-200 border border-transparent ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-600 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-600' : item.iconColor || 'text-slate-400'}`} stroke={isActive ? 2 : 1.5} />
                    <span className="text-[13px] truncate text-left">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ABDM Verified Badge */}
      <div className="p-4 border-t border-[#eceef1] dark:border-slate-800">
        <div className="flex items-center gap-2 justify-start px-1">
          <IconShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" stroke={2} />
          <span className="text-[11.5px] font-medium text-slate-500">ABDM Verified Nurse Portal</span>
        </div>
      </div>
    </div>
  );
};

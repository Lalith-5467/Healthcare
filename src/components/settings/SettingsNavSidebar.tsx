import React from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Bell,
  Eye,
  Palette,
  Heart,
  AlertTriangle,
  Users,
  Grid,
  Database,
  Accessibility,
  Info
} from 'lucide-react';

export type SettingsSectionKey =
  | 'account'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'privacy'
  | 'appearance'
  | 'health'
  | 'emergency'
  | 'family'
  | 'services'
  | 'data'
  | 'accessibility'
  | 'about';

interface SettingsNavSidebarProps {
  activeSection: SettingsSectionKey;
  onSelectSection: (section: SettingsSectionKey) => void;
}

export const SETTINGS_NAV_ITEMS: { key: SettingsSectionKey; label: string; icon: any }[] = [
  { key: 'account', label: 'Account', icon: ShieldCheck },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: Eye },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'health', label: 'Health Preferences', icon: Heart },
  { key: 'emergency', label: 'Emergency', icon: AlertTriangle },
  { key: 'family', label: 'Family', icon: Users },
  { key: 'services', label: 'Connected Services', icon: Grid },
  { key: 'data', label: 'Data & Storage', icon: Database },
  { key: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { key: 'about', label: 'About & Support', icon: Info }
];

export const SettingsNavSidebar: React.FC<SettingsNavSidebarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <div className="font-sans">
      {/* DESKTOP VERTICAL NAVIGATION */}
      <div className="hidden md:flex flex-col space-y-1 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-xl text-xs">
        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2 block font-mono">
          Settings Menu
        </span>

        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectSection(item.key)}
              className={`w-full px-3.5 py-2.5 rounded-2xl font-extrabold flex items-center gap-3 transition-all duration-300 cursor-pointer text-left ${
                isActive
                  ? 'bg-[#00a896] text-white shadow-lg scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:-translate-y-0.5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00a896] opacity-80'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MOBILE HORIZONTAL PILL TABS */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar font-sans">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectSection(item.key)}
              className={`px-4 py-2.5 rounded-full font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#00a896] text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#00a896]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

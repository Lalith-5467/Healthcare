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
    <div>
      {/* DESKTOP VERTICAL NAVIGATION */}
      <div className="hidden md:flex flex-col space-y-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block font-mono">
          Settings Menu
        </span>

        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectSection(item.key)}
              className={`w-full px-3.5 py-2.5 rounded-2xl font-bold flex items-center gap-3 transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MOBILE HORIZONTAL PILL TABS */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectSection(item.key)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

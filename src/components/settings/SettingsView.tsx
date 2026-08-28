import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import { Settings } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import type {
  UserProfileSettings,
  AccountSettings,
  SecuritySettingsState,
  NotificationSettingsState,
  PrivacySettingsState,
  AppearanceSettingsState,
  HealthPreferencesSettingsState,
  ConnectedServiceItem
} from './settingsData';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ACCOUNT_SETTINGS,
  INITIAL_SECURITY_SETTINGS,
  INITIAL_NOTIFICATION_SETTINGS,
  INITIAL_PRIVACY_SETTINGS,
  INITIAL_APPEARANCE_SETTINGS,
  INITIAL_HEALTH_PREFERENCES,
  CONNECTED_SERVICES_LIST
} from './settingsData';
import { SettingsNavSidebar } from './SettingsNavSidebar';
import type { SettingsSectionKey } from './SettingsNavSidebar';
import { SettingsSearchBar } from './SettingsSearchBar';
import { ProfileSettingsSection } from './ProfileSettingsSection';
import { AccountSettingsSection } from './AccountSettingsSection';
import { SecuritySettingsSection } from './SecuritySettingsSection';
import { NotificationsSettingsSection } from './NotificationsSettingsSection';
import { PrivacySettingsSection } from './PrivacySettingsSection';
import { AppearanceSettingsSection } from './AppearanceSettingsSection';
import { HealthPreferencesSection } from './HealthPreferencesSection';
import { EmergencySettingsSection } from './EmergencySettingsSection';
import { FamilySettingsSection } from './FamilySettingsSection';
import { ConnectedServicesSection } from './ConnectedServicesSection';
import { DataStorageSection } from './DataStorageSection';
import { AccessibilitySection } from './AccessibilitySection';
import { AboutSupportSection } from './AboutSupportSection';
import { UnsavedChangesBar } from './UnsavedChangesBar';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface SettingsViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // SETTINGS STATE
  const [profile, setProfile] = useState<UserProfileSettings>(INITIAL_USER_PROFILE);
  const [account, setAccount] = useState<AccountSettings>(INITIAL_ACCOUNT_SETTINGS);
  const [security, setSecurity] = useState<SecuritySettingsState>(INITIAL_SECURITY_SETTINGS);
  const [notificationSetts, setNotificationSetts] = useState<NotificationSettingsState>(INITIAL_NOTIFICATION_SETTINGS);
  const [privacySetts, setPrivacySetts] = useState<PrivacySettingsState>(INITIAL_PRIVACY_SETTINGS);
  const [appearanceSetts, setAppearanceSetts] = useState<AppearanceSettingsState>(INITIAL_APPEARANCE_SETTINGS);
  const [healthPrefSetts, setHealthPrefSetts] = useState<HealthPreferencesSettingsState>(INITIAL_HEALTH_PREFERENCES);
  const [connectedServices, setConnectedServices] = useState<ConnectedServiceItem[]>(CONNECTED_SERVICES_LIST);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_settings_profile');
    if (savedProfile) { 
      try { 
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile.fullName === 'Arun Kumar') {
          // Clear the old cached mock data so Devi's profile loads
          localStorage.removeItem('user_settings_profile');
        } else {
          setProfile(parsedProfile); 
        }
      } catch (e) { console.error(e); } 
    }
    const savedNotifs = localStorage.getItem('user_settings_notifications');
    if (savedNotifs) { try { setNotificationSetts(JSON.parse(savedNotifs)); } catch (e) { console.error(e); } }
    const savedPrivacy = localStorage.getItem('user_settings_privacy');
    if (savedPrivacy) { try { setPrivacySetts(JSON.parse(savedPrivacy)); } catch (e) { console.error(e); } }
    const savedAppear = localStorage.getItem('user_settings_appearance');
    if (savedAppear) { try { setAppearanceSetts(JSON.parse(savedAppear)); } catch (e) { console.error(e); } }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (updated: UserProfileSettings) => {
    setProfile(updated);
    localStorage.setItem('user_settings_profile', JSON.stringify(updated));
    setHasUnsaved(false);
    showToast('✓ Profile updated successfully');
  };

  const handleDeactivateAccount = () => {
    setAccount({ ...account, accountStatus: 'Inactive' });
    showToast('✓ Account status set to Inactive (Demo)');
  };

  const handleUpdateSecurity = (updated: SecuritySettingsState) => {
    setSecurity(updated);
    showToast('✓ Security settings updated');
  };

  const handleUpdateNotifications = (updated: NotificationSettingsState) => {
    setNotificationSetts(updated);
    localStorage.setItem('user_settings_notifications', JSON.stringify(updated));
    showToast('✓ Notification preferences updated');
  };

  const handleUpdatePrivacy = (updated: PrivacySettingsState) => {
    setPrivacySetts(updated);
    localStorage.setItem('user_settings_privacy', JSON.stringify(updated));
  };

  const handleUpdateAppearance = (updated: AppearanceSettingsState) => {
    setAppearanceSetts(updated);
    localStorage.setItem('user_settings_appearance', JSON.stringify(updated));
  };

  const handleUpdateHealthPref = (updated: HealthPreferencesSettingsState) => {
    setHealthPrefSetts(updated);
    localStorage.setItem('user_settings_health_pref', JSON.stringify(updated));
  };

  const handleToggleService = (id: string) => {
    const updated = connectedServices.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setConnectedServices(updated);
    showToast('✓ Connected services updated');
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const dataObj = {
      profile,
      account,
      notificationSetts,
      privacySetts,
      appearanceSetts,
      healthPrefSetts,
      exportedAt: new Date().toISOString()
    };

    const content = format === 'json' ? JSON.stringify(dataObj, null, 2) : `Key,Value\nProfile,${profile.fullName}\nEmail,${profile.email}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MediCare_Patient_Settings_Backup.${format}`;
    link.click();
    showToast(`✓ Exported settings backup (${format.toUpperCase()})`);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const parsed = JSON.parse(e.target.result as string);
          if (parsed.profile) setProfile(parsed.profile);
          showToast('✓ Demo data backup imported successfully');
        }
      } catch (err) {
        showToast('⚠️ Invalid JSON data backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetPreferences = () => {
    setProfile(INITIAL_USER_PROFILE);
    setNotificationSetts(INITIAL_NOTIFICATION_SETTINGS);
    setPrivacySetts(INITIAL_PRIVACY_SETTINGS);
    setAppearanceSetts(INITIAL_APPEARANCE_SETTINGS);
    setHealthPrefSetts(INITIAL_HEALTH_PREFERENCES);
    localStorage.removeItem('user_settings_profile');
    localStorage.removeItem('user_settings_notifications');
    localStorage.removeItem('user_settings_privacy');
    localStorage.removeItem('user_settings_appearance');
    showToast('✓ All preferences restored to defaults');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your account, preferences, privacy and healthcare experience."
        badgeText="Preference Center"
        badgeIcon={<Settings className="w-3.5 h-3.5" />}
      />

      {/* 2. SEARCH BAR */}
      <SettingsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 3. TWO-COLUMN DESKTOP / TABBED MOBILE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* LEFT COLUMN: NAVIGATION SIDEBAR */}
        <div className="md:col-span-1 sticky top-6 z-10">
          <SettingsNavSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        </div>

        {/* RIGHT COLUMN: SELECTED SECTION CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {activeSection === 'account' && (
            <AccountSettingsSection account={account} onDeactivateAccount={handleDeactivateAccount} />
          )}

          {activeSection === 'profile' && (
            <ProfileSettingsSection profile={profile} onSaveProfile={handleSaveProfile} onMarkUnsaved={() => setHasUnsaved(true)} />
          )}

          {activeSection === 'security' && (
            <SecuritySettingsSection security={security} onUpdateSecurity={handleUpdateSecurity} onShowToast={showToast} />
          )}

          {activeSection === 'notifications' && (
            <NotificationsSettingsSection settings={notificationSetts} onUpdateSettings={handleUpdateNotifications} />
          )}

          {activeSection === 'privacy' && (
            <PrivacySettingsSection privacy={privacySetts} onUpdatePrivacy={handleUpdatePrivacy} onShowToast={showToast} />
          )}

          {activeSection === 'appearance' && (
            <AppearanceSettingsSection appearance={appearanceSetts} onUpdateAppearance={handleUpdateAppearance} onShowToast={showToast} />
          )}

          {activeSection === 'health' && (
            <HealthPreferencesSection preferences={healthPrefSetts} onUpdatePreferences={handleUpdateHealthPref} onShowToast={showToast} />
          )}

          {activeSection === 'emergency' && (
            <EmergencySettingsSection onNavigateEmergency={() => onNavigate('emergency')} />
          )}

          {activeSection === 'family' && (
            <FamilySettingsSection onNavigateFamily={() => onNavigate('family')} />
          )}

          {activeSection === 'services' && (
            <ConnectedServicesSection services={connectedServices} onToggleService={handleToggleService} />
          )}

          {activeSection === 'data' && (
            <DataStorageSection onClearData={() => showToast('✓ Temporary data cache cleared')} onExportData={handleExportData} onImportData={handleImportData} />
          )}

          {activeSection === 'accessibility' && (
            <AccessibilitySection onShowToast={showToast} />
          )}

          {activeSection === 'about' && (
            <AboutSupportSection onResetPreferences={handleResetPreferences} onShowToast={showToast} />
          )}
        </div>
      </div>

      {/* UNSAVED CHANGES BAR */}
      <UnsavedChangesBar
        hasUnsaved={hasUnsaved}
        onSave={() => handleSaveProfile(profile)}
        onDiscard={() => {
          setProfile(INITIAL_USER_PROFILE);
          setHasUnsaved(false);
          showToast('✓ Unsaved changes discarded');
        }}
      />
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  settingsApi,
  type SystemSettingsEntity,
  type BrandingConfig,
  type LandingConfig,
  type HeaderConfig,
  type FooterConfig,
  type DashboardsConfig,
  type RoleDashboardConfig
} from '../services/dhrApis';

// Baseline fallback defaults in case API is loading or network disconnect occurs
const DEFAULT_BRANDING: BrandingConfig = {
  appName: 'MediCare Digital Health Record',
  tagline: 'Your Health, Always With You.',
  brandText: 'MediCare DHR',
  primaryColor: '#00a896',
  accentColor: '#00d2be',
  themeMode: 'auto',
  logoUrl: null,
  alternateLogoUrl: null,
  faviconUrl: null,
  loginTitle: 'MediCare Access',
  loginSubtitle: 'National ABDM Gateway & Clinical Health Records',
};

const DEFAULT_LANDING: LandingConfig = {
  sectionsVisibility: {
    hero: true,
    about: true,
    features: true,
    doctors: true,
    abha: true,
    partnerLoop: true,
    cta: true,
  },
  sectionsOrder: ['hero', 'about', 'features', 'doctors', 'abha', 'partnerLoop', 'cta'],
  hero: {
    badge: 'ABDM COMPLIANT PERSONAL HEALTH RECORD',
    title: 'Your Health,',
    highlightTitle: 'Always With You.',
    subtitle: 'Secure your medical records, manage your medicines, share health information with doctors, and stay prepared for emergencies — all in one place.',
    primaryCtaText: 'Get Started',
    primaryCtaAction: 'dashboard',
    secondaryCtaText: 'Connect ABHA',
    secondaryCtaAction: 'about',
    backgroundVideoUrl: '/Digital_Health_Record_For_Project.mp4',
    backgroundImageUrl: '/about-us-phr.jpg',
    mediaType: 'video',
    overlayStyle: 'gradient',
    showSosCard: true,
    sosCardTitle: 'Emergency SOS',
    sosCardSubtitle: 'SOS Pass Ready',
    showSoundControl: true,
    showIndicators: true,
    enabled: true,
  },
  about: {
    badge: 'Patient-Centered PHR Platform',
    title: 'About Us',
    description: 'MediCare is an advanced digital personal health record (PHR) and caregiver companion platform committed to delivering secure medical record management, emergency SOS accessibility, and seamless doctor sharing with advanced privacy standards and patient-centered technology.',
    highlights: [
      'Modern Infrastructure',
      'Advanced Medical Equipment',
      'Experienced Medical Professionals',
      '24/7 Emergency Services',
    ],
    learnMoreText: 'Learn More About Us',
    imageUrl: '/about-us-phr.jpg',
  },
  features: {
    badge: 'COMPREHENSIVE DIGITAL HEALTHCARE',
    title: 'Features Designed for',
    subtitle: 'Everything you need to manage your personal health records, consult specialists, and coordinate clinical care in real time.',
  },
  cta: {
    title: 'Take Control of Your Health Today',
    subtitle: 'Join thousands of patients, doctors, and healthcare institutions across India using MediCare for seamless digital health management.',
    primaryButtonText: 'Create Your Account',
    secondaryButtonText: 'Explore Features',
  },
};

const DEFAULT_HEADER: HeaderConfig = {
  navItems: [
    { id: 'home', label: 'Home', visible: true, order: 1 },
    { id: 'about', label: 'About Us', visible: true, order: 2 },
    { id: 'services', label: 'Services', visible: true, order: 3, isMega: true },
    { id: 'features', label: 'Features', visible: true, order: 4 },
    { id: 'doctors', label: 'Doctors', visible: true, order: 5 },
    { id: 'abha', label: 'ABHA', visible: true, order: 6 },
  ],
  showProgressBar: true,
  showSearch: false,
};

const DEFAULT_FOOTER: FooterConfig = {
  footerText: '© 2026 MediCare Digital Health Record (DHR). All rights reserved.',
  aboutText: 'Personal Health Record & Caregiver Companion platform. Empowering patients to securely store medical records, manage medications, and connect with trusted family members and healthcare providers.',
  complianceNotice: 'Patient Privacy & ABDM Certified Platform',
  socialLinks: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  sectionVisibility: {
    brand: true,
    product: true,
    care: true,
    account: true,
  },
};

const DEFAULT_ROLE_CONFIG: RoleDashboardConfig = {
  announcement: {
    enabled: false,
    title: '',
    message: '',
    type: 'info',
  },
  widgets: {},
};

const DEFAULT_DASHBOARDS: DashboardsConfig = {
  patient: {
    announcement: { enabled: false, title: 'Portal Notice', message: 'ABDM Health Locker integration is active.', type: 'info' },
    widgets: { healthScore: true, quickActions: true, upcomingAppointments: true, medicationList: true, recentRecords: true, emergencyCard: true, aiAssistant: true, healthShorts: true, healthProgress: true }
  },
  doctor: {
    announcement: { enabled: false, title: 'Clinical Notice', message: 'OPD and teleconsultation channels are synchronized.', type: 'info' },
    widgets: { overviewStats: true, todaySchedule: true, quickConsultation: true, clinicalNotes: true, qrScanner: true }
  },
  nurse: {
    announcement: { enabled: false, title: 'Duty Notice', message: 'Clinical shift handovers and patient vitals telemetry operational.', type: 'info' },
    widgets: { overviewStats: true, careRequests: true, dutySchedule: true, bedsideTelemetry: true, emergencyAlerts: true }
  },
  caregiver: {
    announcement: { enabled: false, title: 'Caregiver Update', message: 'Patient monitoring links and emergency SOS alerts active.', type: 'info' },
    widgets: { dependentList: true, taskTracker: true, vitalAlerts: true, medicationLogs: true }
  },
  pharmacist: {
    announcement: { enabled: false, title: 'Dispensary Dispatch', message: 'Electronic prescription queue verified.', type: 'info' },
    widgets: { pendingOrders: true, prescriptionQueue: true, dispensaryMatrix: true, inventoryStock: true }
  },
  insurance: {
    announcement: { enabled: false, title: 'TPA Clearinghouse', message: 'Cashless pre-authorization gateway synchronized.', type: 'info' },
    widgets: { claimsQueue: true, preAuthRequests: true, policyRegistry: true, settlementsMatrix: true }
  },
  admin: {
    announcement: { enabled: false, title: 'Executive Briefing', message: 'Hospital information management node operational.', type: 'info' },
    widgets: { kpiStats: true, userRegistrations: true, clinicalDirectory: true, operationsMatrix: true, reportsAnalytics: true }
  },
  superAdmin: {
    announcement: { enabled: false, title: 'Directorate Radar', message: 'Tier-1 ABDM Security Governance radar active.', type: 'info' },
    widgets: { authorityNode: true, adminManagement: true, rolesPermissions: true, securityAudit: true, videoControl: true }
  },
};

interface ConfigContextType {
  config: SystemSettingsEntity;
  branding: BrandingConfig;
  landing: LandingConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  dashboards: DashboardsConfig;
  isLoading: boolean;
  isDraftPreview: boolean;
  setIsDraftPreview: (enabled: boolean) => void;
  refreshConfig: () => Promise<void>;
  updateLiveBrandingStyles: (branding: BrandingConfig) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SystemSettingsEntity>({
    id: 'default',
    hospitalName: DEFAULT_BRANDING.appName,
    tagline: DEFAULT_BRANDING.tagline,
    supportEmail: 'support@dhr-medicare.in',
    sessionTimeout: 30,
    mfaEnforced: true,
    emailAlerts: true,
    smsAlerts: false,
    maintenanceMode: false,
    footerText: DEFAULT_FOOTER.footerText,
    branding: DEFAULT_BRANDING,
    landing: DEFAULT_LANDING,
    header: DEFAULT_HEADER,
    footer: DEFAULT_FOOTER,
    dashboards: DEFAULT_DASHBOARDS,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isDraftPreview, setIsDraftPreview] = useState(false);
  const [draftConfigData, setDraftConfigData] = useState<any>(null);

  const updateLiveBrandingStyles = useCallback((branding: BrandingConfig) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (branding.primaryColor) {
      root.style.setProperty('--color-brand-primary', branding.primaryColor);
    }
    if (branding.accentColor) {
      root.style.setProperty('--color-brand-accent', branding.accentColor);
    }
    if (branding.appName) {
      document.title = `${branding.appName} — Digital Health Record`;
    }
    if (branding.themeMode) {
      // Respect user's explicit theme preference if stored in localStorage
      let userTheme: string | null = null;
      try {
        userTheme = localStorage.getItem('medicare-theme') || localStorage.getItem('theme-landing');
      } catch {}

      if (userTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (userTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        // Fall back to system branding themeMode
        if (branding.themeMode === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else if (branding.themeMode === 'light') {
          root.classList.remove('dark');
          root.classList.add('light');
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
            root.classList.remove('light');
          } else {
            root.classList.remove('dark');
            root.classList.add('light');
          }
        }
      }
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await settingsApi.getSettings();
      if (res && res.data) {
        const d = res.data;
        const resolvedBranding: BrandingConfig = {
          ...DEFAULT_BRANDING,
          ...(d.branding || {}),
          appName: d.hospitalName || d.branding?.appName || DEFAULT_BRANDING.appName,
          tagline: d.tagline || d.branding?.tagline || DEFAULT_BRANDING.tagline,
          logoUrl: d.logoUrl || d.branding?.logoUrl || null,
        };

        const resolvedLanding: LandingConfig = {
          ...DEFAULT_LANDING,
          ...(d.landing || {}),
          sectionsVisibility: {
            ...DEFAULT_LANDING.sectionsVisibility,
            ...(d.landing?.sectionsVisibility || {}),
          },
          hero: { ...DEFAULT_LANDING.hero, ...(d.landing?.hero || {}) },
          about: { ...DEFAULT_LANDING.about, ...(d.landing?.about || {}) },
          features: { ...DEFAULT_LANDING.features, ...(d.landing?.features || {}) },
          cta: { ...DEFAULT_LANDING.cta, ...(d.landing?.cta || {}) },
        };

        const resolvedHeader: HeaderConfig = {
          ...DEFAULT_HEADER,
          ...(d.header || {}),
          navItems: d.header?.navItems && d.header.navItems.length > 0 ? d.header.navItems : DEFAULT_HEADER.navItems,
        };

        const resolvedFooter: FooterConfig = {
          ...DEFAULT_FOOTER,
          ...(d.footer || {}),
          footerText: d.footerText || d.footer?.footerText || DEFAULT_FOOTER.footerText,
          socialLinks: { ...DEFAULT_FOOTER.socialLinks, ...(d.footer?.socialLinks || {}) },
          sectionVisibility: { ...DEFAULT_FOOTER.sectionVisibility, ...(d.footer?.sectionVisibility || {}) },
        };

        const resolvedDashboards: DashboardsConfig = {
          ...DEFAULT_DASHBOARDS,
          ...(d.dashboards || {}),
        };

        const merged: SystemSettingsEntity = {
          ...d,
          branding: resolvedBranding,
          landing: resolvedLanding,
          header: resolvedHeader,
          footer: resolvedFooter,
          dashboards: resolvedDashboards,
        };

        setConfig(merged);
        updateLiveBrandingStyles(resolvedBranding);
      }
    } catch (err) {
      console.warn('Could not load dynamic configuration from backend, running with defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, [updateLiveBrandingStyles]);

  useEffect(() => {
    fetchConfig();

    const handleConfigUpdated = () => {
      fetchConfig();
    };

    window.addEventListener('medicare_config_updated', handleConfigUpdated);
    return () => window.removeEventListener('medicare_config_updated', handleConfigUpdated);
  }, [fetchConfig]);

  // Handle active draft preview if activated in Admin/Super Admin
  const effectiveBranding: BrandingConfig = isDraftPreview && draftConfigData?.branding
    ? { ...config.branding!, ...draftConfigData.branding }
    : config.branding || DEFAULT_BRANDING;

  const effectiveLanding: LandingConfig = isDraftPreview && draftConfigData?.landing
    ? { ...config.landing!, ...draftConfigData.landing }
    : config.landing || DEFAULT_LANDING;

  const effectiveHeader: HeaderConfig = isDraftPreview && draftConfigData?.header
    ? { ...config.header!, ...draftConfigData.header }
    : config.header || DEFAULT_HEADER;

  const effectiveFooter: FooterConfig = isDraftPreview && draftConfigData?.footer
    ? { ...config.footer!, ...draftConfigData.footer }
    : config.footer || DEFAULT_FOOTER;

  const effectiveDashboards: DashboardsConfig = isDraftPreview && draftConfigData?.dashboards
    ? { ...config.dashboards!, ...draftConfigData.dashboards }
    : config.dashboards || DEFAULT_DASHBOARDS;

  return (
    <ConfigContext.Provider
      value={{
        config,
        branding: effectiveBranding,
        landing: effectiveLanding,
        header: effectiveHeader,
        footer: effectiveFooter,
        dashboards: effectiveDashboards,
        isLoading,
        isDraftPreview,
        setIsDraftPreview: (enabled) => {
          setIsDraftPreview(enabled);
          if (enabled) {
            // Load draft from local cache or last fetched draft
            try {
              const cachedDraft = localStorage.getItem('medicare_active_draft');
              if (cachedDraft) setDraftConfigData(JSON.parse(cachedDraft));
            } catch {}
          }
        },
        refreshConfig: fetchConfig,
        updateLiveBrandingStyles,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a ConfigProvider');
  }
  return context;
};

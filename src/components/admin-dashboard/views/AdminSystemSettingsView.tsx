import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Save, ShieldCheck, Bell, Lock, Globe, Moon, Sun, 
  CheckCircle2, Server, Eye, Database, Upload, Image, AlertCircle, 
  Loader2, Sparkles, RefreshCw, Layout, Layers, ShieldAlert, 
  Check, X, ArrowRight, Share2, HelpCircle, ChevronRight, Sliders, 
  ExternalLink, Palette, FileText, Monitor, CheckSquare, Square, Play,
  Plus, Trash2, Edit3, ArrowUp, ArrowDown, CheckCheck, RotateCcw,
  AlertTriangle, Calendar, Clock, Globe2, Link as LinkIcon
} from 'lucide-react';
import { 
  settingsApi, 
  uploadApi, 
  type SystemSettingsEntity,
  type BrandingConfig,
  type LandingConfig,
  type HeaderConfig,
  type FooterConfig,
  type DashboardsConfig,
  type RoleDashboardConfig,
  type HeaderNavItem,
  type AnnouncementItem,
  type WidgetConfigItem
} from '../../../services/dhrApis';
import { useSiteConfig } from '../../../context/ConfigContext';

interface AdminSystemSettingsViewProps {
  currentRole?: 'Admin' | 'Super Admin';
}

type TabType = 'branding' | 'landing' | 'header' | 'footer' | 'dashboards' | 'security';

export const ROLE_WIDGET_CATALOGS: Record<string, Array<{ key: string; label: string; description: string; colSpan: 'full' | 'half' | 'third'; removable: boolean }>> = {
  patient: [
    { key: 'healthScore', label: 'Health Score & ABDM Status', description: 'ABDM score & clinical profile hero badge', colSpan: 'half', removable: false },
    { key: 'quickActions', label: 'Quick Medical Actions', description: 'Direct shortcut actions to core health workflows', colSpan: 'full', removable: false },
    { key: 'upcomingAppointments', label: 'Upcoming Appointments', description: 'Consultation schedule with doctors and clinics', colSpan: 'half', removable: true },
    { key: 'medicationList', label: 'Medication Schedule & Refills', description: 'Active prescriptions, dosages, and refill tracker', colSpan: 'half', removable: true },
    { key: 'recentRecords', label: 'Recent Health Records', description: 'Diagnostic tests, lab results, and discharge reports', colSpan: 'half', removable: true },
    { key: 'emergencyCard', label: 'Emergency SOS & QR Card', description: 'One-tap emergency SOS broadcast and vital alert card', colSpan: 'half', removable: false },
    { key: 'aiAssistant', label: 'AI Health Assistant', description: 'Smart clinical triage and symptom guidance companion', colSpan: 'full', removable: true },
    { key: 'healthShorts', label: 'Health Shorts & Video Tips', description: 'Curated wellness reels and healthcare guidance', colSpan: 'full', removable: true },
    { key: 'healthProgress', label: 'Health Trends & Biometrics', description: 'Vitals timeline and clinical biometric progress charts', colSpan: 'half', removable: true },
  ],
  doctor: [
    { key: 'overviewStats', label: 'Consultation & Patient Stats', description: "Today's consultations, queue metrics, and follow-ups", colSpan: 'full', removable: false },
    { key: 'todaySchedule', label: "Today's Clinical Schedule", description: 'Appointments timeline, calendar, and patient check-ins', colSpan: 'half', removable: true },
    { key: 'quickConsultation', label: 'Rapid Consultation Workspace', description: 'Instant teleconsultation and prescription authoring', colSpan: 'half', removable: true },
    { key: 'clinicalNotes', label: 'Clinical Notes & Prescriptions', description: 'Recent clinical encounters and pharmacological orders', colSpan: 'half', removable: true },
    { key: 'qrScanner', label: 'Patient ABHA QR Scanner', description: 'Scan patient QR code for instant health record access', colSpan: 'half', removable: false },
  ],
  nurse: [
    { key: 'overviewStats', label: 'Shift & Ward Overview', description: 'Assigned beds, pending vitals, and shift telemetry', colSpan: 'full', removable: false },
    { key: 'careRequests', label: 'Patient Care Requests', description: 'Bedside assistance, triage, and medication logs', colSpan: 'half', removable: true },
    { key: 'dutySchedule', label: 'Nurse Duty Schedule', description: 'Roster hours, ward rotations, and handover briefings', colSpan: 'half', removable: true },
    { key: 'bedsideTelemetry', label: 'Bedside Vitals Telemetry', description: 'Real-time SpO2, heart rate, and BP streaming', colSpan: 'half', removable: true },
    { key: 'emergencyAlerts', label: 'Emergency Code Alerts', description: 'Crash cart and rapid response notifications', colSpan: 'full', removable: false },
  ],
  caregiver: [
    { key: 'dependentList', label: 'Assigned Wards & Family Members', description: 'Profiles and medical statuses under care', colSpan: 'full', removable: false },
    { key: 'taskTracker', label: 'Daily Caregiving Tasks', description: 'Hydration, mobility, meal, and routine tracking', colSpan: 'half', removable: true },
    { key: 'vitalAlerts', label: 'Vitals Anomaly Alerts', description: 'Abnormal temperature, pulse, or glucose warnings', colSpan: 'half', removable: false },
    { key: 'medicationLogs', label: 'Medication Adherence Logs', description: 'Dosage compliance and confirmation logbook', colSpan: 'half', removable: true },
  ],
  pharmacist: [
    { key: 'pendingOrders', label: 'Pending Prescription Orders', description: 'Inbound e-prescriptions awaiting verification', colSpan: 'half', removable: true },
    { key: 'prescriptionQueue', label: 'Verified Dispensary Queue', description: 'Dispensed and ready-for-pickup order queue', colSpan: 'half', removable: true },
    { key: 'dispensaryMatrix', label: 'Stock & Batch Matrix', description: 'Batch numbers, expiry audits, and drug inventory', colSpan: 'half', removable: true },
    { key: 'inventoryStock', label: 'Low Stock Drug Alerts', description: 'Threshold reorder reminders and critical inventory', colSpan: 'half', removable: false },
  ],
  insurance: [
    { key: 'claimsQueue', label: 'Claims Adjudication Queue', description: 'Inpatient and outpatient reimbursement review', colSpan: 'half', removable: true },
    { key: 'preAuthRequests', label: 'Cashless Pre-Auth Requests', description: 'Hospital admission pre-authorization gateway', colSpan: 'half', removable: true },
    { key: 'policyRegistry', label: 'Policyholder Coverage Registry', description: 'Active benefit sums and deductible validation', colSpan: 'half', removable: true },
    { key: 'settlementsMatrix', label: 'Disbursement & Settlements Matrix', description: 'Electronic bank transfer and settlement records', colSpan: 'half', removable: true },
  ],
  admin: [
    { key: 'kpiStats', label: 'Hospital KPI & Bed Occupancy Stats', description: 'Hospital performance and bed capacity utilization', colSpan: 'full', removable: false },
    { key: 'userRegistrations', label: 'Staff & Practitioner Directory', description: 'Clinician credentials and personnel directory', colSpan: 'half', removable: true },
    { key: 'clinicalDirectory', label: 'Departmental Directory', description: 'Departmental rosters and consultation chambers', colSpan: 'half', removable: true },
    { key: 'operationsMatrix', label: 'Clinical Operations Matrix', description: 'Operation theaters, imaging units, and facility uptime', colSpan: 'half', removable: true },
    { key: 'reportsAnalytics', label: 'Administrative Analytics Reports', description: 'NABH, ABDM, and statutory audit compliance exports', colSpan: 'full', removable: true },
  ],
  superAdmin: [
    { key: 'authorityNode', label: 'Directorate Governance Node', description: 'National healthcare gateway governance hub', colSpan: 'full', removable: false },
    { key: 'adminManagement', label: 'Hospital Administrator Console', description: 'Branch administrators and administrative rights', colSpan: 'half', removable: true },
    { key: 'rolesPermissions', label: 'Global RBAC Permission Matrix', description: 'Cross-system role capability and access matrix', colSpan: 'half', removable: true },
    { key: 'securityAudit', label: 'Institutional Audit & Access Logs', description: 'HIPAA and ABDM immutable security log records', colSpan: 'half', removable: false },
    { key: 'videoControl', label: 'Public Media & Video Governance', description: 'Front-facing streaming media and broadcast control', colSpan: 'half', removable: true },
  ],
};

const buildInitialRoleConfig = (role: string, defaultTitle: string, defaultMsg: string) => {
  const catalog = ROLE_WIDGET_CATALOGS[role] || [];
  const widgetsRecord: Record<string, boolean> = {};
  const widgetList = catalog.map((item, idx) => {
    widgetsRecord[item.key] = true;
    return {
      key: item.key,
      label: item.label,
      description: item.description,
      enabled: true,
      colSpan: item.colSpan,
      order: idx + 1,
      removable: item.removable,
    };
  });
  const defaultAnn = {
    id: `ann-${role}-default`,
    title: defaultTitle,
    message: defaultMsg,
    type: 'info' as const,
    priority: 'normal' as const,
    enabled: false,
    startDate: null,
    endDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return {
    announcement: defaultAnn,
    announcements: [defaultAnn],
    widgets: widgetsRecord,
    widgetList,
  };
};

export const validateNavUrl = (url: string): string | null => {
  if (!url || !url.trim()) return 'URL or path is required';
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return 'Dangerous protocol not allowed (javascript/data/vbscript)';
  }
  if (!trimmed.startsWith('/') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('#')) {
    return 'URL must start with /, #, http://, or https://';
  }
  return null;
};

export const AdminSystemSettingsView: React.FC<AdminSystemSettingsViewProps> = ({ currentRole = 'Admin' }) => {
  const isSuperAdmin = currentRole === 'Super Admin';
  const { refreshConfig } = useSiteConfig();

  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab') as TabType;
      if (tabParam && ['branding', 'landing', 'header', 'footer', 'dashboards', 'security'].includes(tabParam)) {
        return tabParam;
      }
      const hash = window.location.hash.replace('#', '') as TabType;
      if (hash && ['branding', 'landing', 'header', 'footer', 'dashboards', 'security'].includes(hash)) {
        return hash;
      }
      const saved = localStorage.getItem('admin_config_active_tab') as TabType;
      if (saved && ['branding', 'landing', 'header', 'footer', 'dashboards', 'security'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'branding';
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('admin_config_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    } catch {}
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // 1. BRANDING STATE
  const [appName, setAppName] = useState('MediCare Digital Health Record');
  const [tagline, setTagline] = useState('Your Health, Always With You.');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [alternateLogoUrl, setAlternateLogoUrl] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState('#00a896');
  const [accentColor, setAccentColor] = useState('#00d2be');
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto');
  const [loginTitle, setLoginTitle] = useState('MediCare Access');
  const [loginSubtitle, setLoginSubtitle] = useState('National ABDM Gateway & Clinical Health Records');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 2. LANDING PAGE STATE
  const [landingSectionsVisibility, setLandingSectionsVisibility] = useState({
    hero: true,
    about: true,
    features: true,
    doctors: true,
    abha: true,
    partnerLoop: true,
    cta: true,
  });
  const [landingSectionsOrder, setLandingSectionsOrder] = useState<string[]>([
    'hero', 'about', 'features', 'doctors', 'abha', 'partnerLoop', 'cta'
  ]);
  const [heroEnabled, setHeroEnabled] = useState(true);
  const [heroBadge, setHeroBadge] = useState('ABDM COMPLIANT PERSONAL HEALTH RECORD');
  const [heroTitle, setHeroTitle] = useState('Your Health,');
  const [heroHighlightTitle, setHeroHighlightTitle] = useState('Always With You.');
  const [heroSubtitle, setHeroSubtitle] = useState('Secure your medical records, manage your medicines, share health information with doctors, and stay prepared for emergencies — all in one place.');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('Get Started');
  const [heroPrimaryCtaAction, setHeroPrimaryCtaAction] = useState('dashboard');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('Connect ABHA');
  const [heroSecondaryCtaAction, setHeroSecondaryCtaAction] = useState('about');
  const [heroMediaType, setHeroMediaType] = useState<'video' | 'image'>('video');
  const [heroVideoUrl, setHeroVideoUrl] = useState('/Digital_Health_Record_For_Project.mp4');
  const [heroImageUrl, setHeroImageUrl] = useState('/about-us-phr.jpg');
  const [heroOverlayStyle, setHeroOverlayStyle] = useState<'light' | 'medium' | 'dark' | 'gradient'>('gradient');
  const [heroShowSosCard, setHeroShowSosCard] = useState(true);
  const [heroSosCardTitle, setHeroSosCardTitle] = useState('Emergency SOS');
  const [heroSosCardSubtitle, setHeroSosCardSubtitle] = useState('SOS Pass Ready');
  const [heroShowSoundControl, setHeroShowSoundControl] = useState(true);
  const [heroShowIndicators, setHeroShowIndicators] = useState(true);
  const [isUploadingHeroMedia, setIsUploadingHeroMedia] = useState(false);

  const [aboutBadge, setAboutBadge] = useState('Patient-Centered PHR Platform');
  const [aboutTitle, setAboutTitle] = useState('About Us');
  const [aboutDescription, setAboutDescription] = useState('MediCare is an advanced digital personal health record (PHR) and caregiver companion platform committed to delivering secure medical record management, emergency SOS accessibility, and seamless doctor sharing with advanced privacy standards and patient-centered technology.');
  const [aboutHighlights, setAboutHighlights] = useState<string[]>([
    'Modern Infrastructure',
    'Advanced Medical Equipment',
    'Experienced Medical Professionals',
    '24/7 Emergency Services',
  ]);
  const [aboutLearnMoreText, setAboutLearnMoreText] = useState('Learn More About Us');
  const [aboutImageUrl, setAboutImageUrl] = useState('/about-us-phr.jpg');
  const [aboutSecondaryImageUrl, setAboutSecondaryImageUrl] = useState('/about_us_healthcare.jpg');
  const [aboutMissionImageUrl, setAboutMissionImageUrl] = useState('/mission_3d_target.jpg');
  const [aboutVisionImageUrl, setAboutVisionImageUrl] = useState('/vision_3d_ecosystem.jpg');
  const [aboutVideoUrl, setAboutVideoUrl] = useState('/about_us_.mp4');
  const [aboutVideoPosterUrl, setAboutVideoPosterUrl] = useState('/about-us-phr.jpg');
  const [aboutVideoTitle, setAboutVideoTitle] = useState('See How MediCare Connects Healthcare');
  const [aboutVideoDescription, setAboutVideoDescription] = useState('Discover how MediCare brings people, healthcare professionals, and essential healthcare services together in one connected ecosystem.');
  const [showAboutVideo, setShowAboutVideo] = useState(true);
  const [isUploadingAboutMedia, setIsUploadingAboutMedia] = useState(false);

  const [featuresBadge, setFeaturesBadge] = useState('COMPREHENSIVE DIGITAL HEALTHCARE');
  const [featuresTitle, setFeaturesTitle] = useState('Features Designed for');
  const [featuresSubtitle, setFeaturesSubtitle] = useState('Everything you need to manage your personal health records, consult specialists, and coordinate clinical care in real time.');

  const [ctaTitle, setCtaTitle] = useState('Take Control of Your Health Today');
  const [ctaSubtitle, setCtaSubtitle] = useState('Join thousands of patients, doctors, and healthcare institutions across India using MediCare for seamless digital health management.');
  const [ctaPrimaryBtnText, setCtaPrimaryBtnText] = useState('Create Your Account');
  const [ctaSecondaryBtnText, setCtaSecondaryBtnText] = useState('Explore Features');

  // 3. HEADER STATE
  const [headerNavItems, setHeaderNavItems] = useState<HeaderNavItem[]>([
    { id: 'home', label: 'Home', visible: true, order: 1, url: '/' },
    { id: 'about', label: 'About Us', visible: true, order: 2, url: '/about' },
    { id: 'services', label: 'Services', visible: true, order: 3, isMega: true, url: '/services' },
    { id: 'features', label: 'Features', visible: true, order: 4, url: '/#features' },
    { id: 'doctors', label: 'Doctors', visible: true, order: 5, url: '/doctors' },
    { id: 'abha', label: 'ABHA', visible: true, order: 6, url: '/abha' },
  ]);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);

  // 4. FOOTER STATE
  const [footerText, setFooterText] = useState('© 2026 MediCare Digital Health Record (DHR). All rights reserved.');
  const [footerAboutText, setFooterAboutText] = useState('Personal Health Record & Caregiver Companion platform. Empowering patients to securely store medical records, manage medications, and connect with trusted family members and healthcare providers.');
  const [footerFacebook, setFooterFacebook] = useState('https://facebook.com');
  const [footerTwitter, setFooterTwitter] = useState('https://twitter.com');
  const [footerLinkedin, setFooterLinkedin] = useState('https://linkedin.com');
  const [footerInstagram, setFooterInstagram] = useState('https://instagram.com');
  const [footerSocialLinks, setFooterSocialLinks] = useState<Record<string, string>>({
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  });
  const [footerColsVisibility, setFooterColsVisibility] = useState({
    brand: true,
    product: true,
    care: true,
    account: true,
  });

  // 5. ALL 8 ROLE DASHBOARDS STATE
  const [selectedDashboardRole, setSelectedDashboardRole] = useState<string>('patient');
  const [dashboardsConfig, setDashboardsConfig] = useState<DashboardsConfig>({
    patient: buildInitialRoleConfig('patient', 'Portal Notice', 'ABDM Health Locker integration is active and operating normally.'),
    doctor: buildInitialRoleConfig('doctor', 'Clinical Notice', 'OPD and teleconsultation channels are synchronized.'),
    nurse: buildInitialRoleConfig('nurse', 'Duty Notice', 'Clinical shift handovers and patient vitals telemetry operational.'),
    caregiver: buildInitialRoleConfig('caregiver', 'Caregiver Update', 'Patient monitoring links and emergency SOS alerts active.'),
    pharmacist: buildInitialRoleConfig('pharmacist', 'Dispensary Dispatch', 'Electronic prescription queue verified and processing orders.'),
    insurance: buildInitialRoleConfig('insurance', 'TPA Clearinghouse', 'Cashless pre-authorization gateway synchronized with IRDAI rules.'),
    admin: buildInitialRoleConfig('admin', 'Executive Briefing', 'Hospital information management node status: 100% operational.'),
    superAdmin: buildInitialRoleConfig('superAdmin', 'Directorate Radar', 'Tier-1 ABDM Security Governance radar active with zero breaches.'),
  });

  // MODAL MANAGEMENT STATES
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    onConfirm: () => {},
  });

  const [annModal, setAnnModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    enabled: boolean;
    startDate: string;
    endDate: string;
  }>({
    isOpen: false,
    mode: 'create',
    id: '',
    title: '',
    message: '',
    type: 'info',
    priority: 'normal',
    enabled: true,
    startDate: '',
    endDate: '',
  });

  const [widgetModal, setWidgetModal] = useState<{
    isOpen: boolean;
    key: string;
    label: string;
    colSpan: 'full' | 'half' | 'third';
    order: number;
    enabled: boolean;
  }>({
    isOpen: false,
    key: '',
    label: '',
    colSpan: 'half',
    order: 1,
    enabled: true,
  });

  const [addWidgetModalOpen, setAddWidgetModalOpen] = useState(false);

  const [navModal, setNavModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    id: string;
    label: string;
    url: string;
    isMega: boolean;
    visible: boolean;
    urlError: string | null;
  }>({
    isOpen: false,
    mode: 'create',
    id: '',
    label: '',
    url: '/',
    isMega: false,
    visible: true,
    urlError: null,
  });

  const [highlightModal, setHighlightModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    index: number | null;
    text: string;
  }>({
    isOpen: false,
    mode: 'create',
    index: null,
    text: '',
  });

  const [socialModal, setSocialModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    key: string;
    platform: string;
    url: string;
  }>({
    isOpen: false,
    mode: 'create',
    key: '',
    platform: '',
    url: '',
  });

  // 6. SECURITY & SYSTEM STATE
  const [supportEmail, setSupportEmail] = useState('support@medicare-dhr.in');
  const [supportPhone, setSupportPhone] = useState('+91 1800 200 4567');
  const [emergencyPhone, setEmergencyPhone] = useState('112 / 108');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // METADATA STATE
  const [isPublished, setIsPublished] = useState(true);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [hasDraftPending, setHasDraftPending] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // LOAD SYNCHRONIZED SETTINGS FROM BACKEND
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getAdminSettings();
      if (res && res.data) {
        const d = res.data;
        if (d.hospitalName) setAppName(d.hospitalName);
        if (d.tagline) setTagline(d.tagline);
        if (d.logoUrl) setLogoUrl(d.logoUrl);
        if (d.supportEmail) setSupportEmail(d.supportEmail);
        if (d.supportPhone) setSupportPhone(d.supportPhone);
        if (d.emergencyPhone) setEmergencyPhone(d.emergencyPhone);
        if (d.sessionTimeout) setSessionTimeout(String(d.sessionTimeout));
        if (d.mfaEnforced !== undefined) setMfaEnforced(d.mfaEnforced);
        if (d.emailAlerts !== undefined) setEmailAlerts(d.emailAlerts);
        if (d.smsAlerts !== undefined) setSmsAlerts(d.smsAlerts);
        if (d.maintenanceMode !== undefined) setMaintenanceMode(d.maintenanceMode);
        if (d.footerText) setFooterText(d.footerText);

        setIsPublished(d.isPublished ?? true);
        setPublishedAt(d.publishedAt ?? null);
        setHasDraftPending(Boolean(d.draft));

        if (d.branding) {
          if (d.branding.primaryColor) setPrimaryColor(d.branding.primaryColor);
          if (d.branding.accentColor) setAccentColor(d.branding.accentColor);
          if (d.branding.themeMode) setThemeMode(d.branding.themeMode);
          if (d.branding.loginTitle) setLoginTitle(d.branding.loginTitle);
          if (d.branding.loginSubtitle) setLoginSubtitle(d.branding.loginSubtitle);
          if (d.branding.alternateLogoUrl) setAlternateLogoUrl(d.branding.alternateLogoUrl);
        }

        if (d.landing) {
          if (d.landing.sectionsVisibility) setLandingSectionsVisibility(d.landing.sectionsVisibility);
          if (d.landing.sectionsOrder && Array.isArray(d.landing.sectionsOrder) && d.landing.sectionsOrder.length > 0) {
            setLandingSectionsOrder(d.landing.sectionsOrder);
          }
          if (d.landing.hero) {
            if (d.landing.hero.enabled !== undefined) setHeroEnabled(Boolean(d.landing.hero.enabled));
            setHeroBadge(d.landing.hero.badge || heroBadge);
            setHeroTitle(d.landing.hero.title || heroTitle);
            setHeroHighlightTitle(d.landing.hero.highlightTitle || heroHighlightTitle);
            setHeroSubtitle(d.landing.hero.subtitle || heroSubtitle);
            setHeroPrimaryCtaText(d.landing.hero.primaryCtaText || heroPrimaryCtaText);
            if (d.landing.hero.primaryCtaAction) setHeroPrimaryCtaAction(d.landing.hero.primaryCtaAction);
            setHeroSecondaryCtaText(d.landing.hero.secondaryCtaText || heroSecondaryCtaText);
            if (d.landing.hero.secondaryCtaAction) setHeroSecondaryCtaAction(d.landing.hero.secondaryCtaAction);
            if (d.landing.hero.backgroundVideoUrl) setHeroVideoUrl(d.landing.hero.backgroundVideoUrl);
            if (d.landing.hero.backgroundImageUrl) setHeroImageUrl(d.landing.hero.backgroundImageUrl);
            if (d.landing.hero.mediaType) setHeroMediaType(d.landing.hero.mediaType);
            if (d.landing.hero.overlayStyle) setHeroOverlayStyle(d.landing.hero.overlayStyle);
            if (d.landing.hero.showSosCard !== undefined) setHeroShowSosCard(Boolean(d.landing.hero.showSosCard));
            if (d.landing.hero.sosCardTitle) setHeroSosCardTitle(d.landing.hero.sosCardTitle);
            if (d.landing.hero.sosCardSubtitle) setHeroSosCardSubtitle(d.landing.hero.sosCardSubtitle);
            if (d.landing.hero.showSoundControl !== undefined) setHeroShowSoundControl(Boolean(d.landing.hero.showSoundControl));
            if (d.landing.hero.showIndicators !== undefined) setHeroShowIndicators(Boolean(d.landing.hero.showIndicators));
          }
          if (d.landing.about) {
            setAboutBadge(d.landing.about.badge || aboutBadge);
            setAboutTitle(d.landing.about.title || aboutTitle);
            setAboutDescription(d.landing.about.description || aboutDescription);
            if (d.landing.about.highlights && Array.isArray(d.landing.about.highlights)) {
              setAboutHighlights(d.landing.about.highlights);
            }
            setAboutLearnMoreText(d.landing.about.learnMoreText || aboutLearnMoreText);
            if (d.landing.about.imageUrl) setAboutImageUrl(d.landing.about.imageUrl);
            if (d.landing.about.secondaryImageUrl) setAboutSecondaryImageUrl(d.landing.about.secondaryImageUrl);
            if (d.landing.about.missionImageUrl) setAboutMissionImageUrl(d.landing.about.missionImageUrl);
            if (d.landing.about.visionImageUrl) setAboutVisionImageUrl(d.landing.about.visionImageUrl);
            if (d.landing.about.videoUrl) setAboutVideoUrl(d.landing.about.videoUrl);
            if (d.landing.about.videoPosterUrl) setAboutVideoPosterUrl(d.landing.about.videoPosterUrl);
            if (d.landing.about.videoTitle) setAboutVideoTitle(d.landing.about.videoTitle);
            if (d.landing.about.videoDescription) setAboutVideoDescription(d.landing.about.videoDescription);
            if (d.landing.about.showVideo !== undefined) setShowAboutVideo(d.landing.about.showVideo);
          }
          if (d.landing.features) {
            setFeaturesBadge(d.landing.features.badge || featuresBadge);
            setFeaturesTitle(d.landing.features.title || featuresTitle);
            setFeaturesSubtitle(d.landing.features.subtitle || featuresSubtitle);
          }
          if (d.landing.cta) {
            setCtaTitle(d.landing.cta.title || ctaTitle);
            setCtaSubtitle(d.landing.cta.subtitle || ctaSubtitle);
            setCtaPrimaryBtnText(d.landing.cta.primaryButtonText || ctaPrimaryBtnText);
            setCtaSecondaryBtnText(d.landing.cta.secondaryButtonText || ctaSecondaryBtnText);
          }
        }

        if (d.header) {
          if (d.header.navItems && d.header.navItems.length > 0) setHeaderNavItems(d.header.navItems);
          if (d.header.showProgressBar !== undefined) setShowProgressBar(d.header.showProgressBar);
          if (d.header.showSearch !== undefined) setShowHeaderSearch(d.header.showSearch);
        }

        if (d.footer) {
          if (d.footer.aboutText) setFooterAboutText(d.footer.aboutText);
          if (d.footer.socialLinks && typeof d.footer.socialLinks === 'object') {
            setFooterSocialLinks(d.footer.socialLinks as Record<string, string>);
            if (d.footer.socialLinks.facebook) setFooterFacebook(d.footer.socialLinks.facebook);
            if (d.footer.socialLinks.twitter) setFooterTwitter(d.footer.socialLinks.twitter);
            if (d.footer.socialLinks.linkedin) setFooterLinkedin(d.footer.socialLinks.linkedin);
            if (d.footer.socialLinks.instagram) setFooterInstagram(d.footer.socialLinks.instagram);
          }
          if (d.footer.sectionVisibility) setFooterColsVisibility(d.footer.sectionVisibility);
        }

        if (d.dashboards) {
          setDashboardsConfig(d.dashboards);
        }
      }
    } catch (err: any) {
      console.warn('Error loading admin settings:', err);
      showToast('Loaded local fallback settings.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploadingLogo(true);
    try {
      const res = await uploadApi.uploadImage(file, 'LOGO');
      if (res.data?.url) {
        setLogoUrl(res.data.url);
        showToast('Logo uploaded and linked successfully.', 'success');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload logo.');
      showToast(err.message || 'Failed to upload logo image.', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'aboutImage' | 'aboutSecondaryImage' | 'aboutMission' | 'aboutVision' | 'aboutVideo' | 'aboutVideoPoster'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAboutMedia(true);
    try {
      const res = await uploadApi.uploadImage(file, 'ABOUT_MEDIA');
      if (res.data?.url) {
        const uploadedUrl = res.data.url;
        if (target === 'aboutImage') setAboutImageUrl(uploadedUrl);
        else if (target === 'aboutSecondaryImage') setAboutSecondaryImageUrl(uploadedUrl);
        else if (target === 'aboutMission') setAboutMissionImageUrl(uploadedUrl);
        else if (target === 'aboutVision') setAboutVisionImageUrl(uploadedUrl);
        else if (target === 'aboutVideo') setAboutVideoUrl(uploadedUrl);
        else if (target === 'aboutVideoPoster') setAboutVideoPosterUrl(uploadedUrl);
        showToast('Media asset uploaded and linked successfully.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload media asset.', 'error');
    } finally {
      setIsUploadingAboutMedia(false);
      e.target.value = '';
    }
  };

  const buildPayload = () => {
    return {
      hospitalName: appName,
      tagline,
      logoUrl: logoUrl || null,
      supportEmail,
      supportPhone,
      emergencyPhone,
      sessionTimeout: Number(sessionTimeout),
      mfaEnforced,
      emailAlerts,
      smsAlerts,
      maintenanceMode,
      footerText,
      branding: {
        appName,
        tagline,
        logoUrl: logoUrl || null,
        alternateLogoUrl: alternateLogoUrl || null,
        primaryColor,
        accentColor,
        themeMode,
        loginTitle,
        loginSubtitle,
      },
      landing: {
        sectionsVisibility: {
          ...landingSectionsVisibility,
          hero: heroEnabled,
        },
        sectionsOrder: landingSectionsOrder,
        hero: {
          enabled: heroEnabled,
          badge: heroBadge,
          title: heroTitle,
          highlightTitle: heroHighlightTitle,
          subtitle: heroSubtitle,
          primaryCtaText: heroPrimaryCtaText,
          primaryCtaAction: heroPrimaryCtaAction,
          secondaryCtaText: heroSecondaryCtaText,
          secondaryCtaAction: heroSecondaryCtaAction,
          mediaType: heroMediaType,
          backgroundVideoUrl: heroVideoUrl,
          backgroundImageUrl: heroImageUrl,
          overlayStyle: heroOverlayStyle,
          showSosCard: heroShowSosCard,
          sosCardTitle: heroSosCardTitle,
          sosCardSubtitle: heroSosCardSubtitle,
          showSoundControl: heroShowSoundControl,
          showIndicators: heroShowIndicators,
        },
        about: {
          badge: aboutBadge,
          title: aboutTitle,
          description: aboutDescription,
          highlights: aboutHighlights,
          learnMoreText: aboutLearnMoreText,
          imageUrl: aboutImageUrl,
          secondaryImageUrl: aboutSecondaryImageUrl,
          missionImageUrl: aboutMissionImageUrl,
          visionImageUrl: aboutVisionImageUrl,
          videoUrl: aboutVideoUrl,
          videoPosterUrl: aboutVideoPosterUrl,
          videoTitle: aboutVideoTitle,
          videoDescription: aboutVideoDescription,
          showVideo: showAboutVideo,
          galleryImages: [aboutImageUrl, aboutSecondaryImageUrl, aboutMissionImageUrl, aboutVisionImageUrl].filter(Boolean),
        },
        features: {
          badge: featuresBadge,
          title: featuresTitle,
          subtitle: featuresSubtitle,
        },
        cta: {
          title: ctaTitle,
          subtitle: ctaSubtitle,
          primaryButtonText: ctaPrimaryBtnText,
          secondaryButtonText: ctaSecondaryBtnText,
        },
      },
      header: {
        navItems: headerNavItems,
        showProgressBar,
        showSearch: showHeaderSearch,
      },
      footer: {
        footerText,
        aboutText: footerAboutText,
        complianceNotice: 'Patient Privacy & ABDM Certified Platform',
        socialLinks: {
          ...footerSocialLinks,
          facebook: footerFacebook,
          twitter: footerTwitter,
          linkedin: footerLinkedin,
          instagram: footerInstagram,
        },
        sectionVisibility: footerColsVisibility,
      },
      dashboards: dashboardsConfig,
    };
  };

  // SAVE AS DRAFT
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...buildPayload(),
        asDraft: true,
      };

      await settingsApi.updateSettings(payload);
      setHasDraftPending(true);
      showToast('Configuration draft saved. You can preview changes before publication.', 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to save configuration draft.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PUBLISH TO LIVE FRONTEND (Super Admin Only)
  const handlePublishLive = async () => {
    if (!isSuperAdmin) {
      showToast('Only Super Administrators are authorized to publish live system configurations.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        ...buildPayload(),
        publish: true,
      };

      await settingsApi.updateSettings(payload);
      setIsPublished(true);
      setPublishedAt(new Date().toISOString());
      setHasDraftPending(false);
      showToast('Configuration successfully published live!', 'success');
      await refreshConfig();
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to publish configuration.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // RESET TO DEFAULT
  const handleResetDefaults = async () => {
    if (!isSuperAdmin) {
      showToast('Only Super Administrators are authorized to reset platform configurations.', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to restore pristine platform defaults? All customizations will be reset.')) {
      return;
    }

    setIsResetting(true);
    try {
      await settingsApi.resetSettings();
      showToast('Platform restored to system defaults.', 'success');
      await loadSettings();
      await refreshConfig();
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to restore default configuration.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // --- ROLE ANNOUNCEMENTS CRUD HANDLERS ---
  const handleOpenCreateAnnouncement = () => {
    setAnnModal({
      isOpen: true,
      mode: 'create',
      id: '',
      title: '',
      message: '',
      type: 'info',
      priority: 'normal',
      enabled: true,
      startDate: '',
      endDate: '',
    });
  };

  const handleOpenEditAnnouncement = (ann: AnnouncementItem) => {
    setAnnModal({
      isOpen: true,
      mode: 'edit',
      id: ann.id,
      title: ann.title,
      message: ann.message,
      type: ann.type || 'info',
      priority: ann.priority || 'normal',
      enabled: ann.enabled !== false,
      startDate: ann.startDate || '',
      endDate: ann.endDate || '',
    });
  };

  const handleOpenViewAnnouncement = (ann: AnnouncementItem) => {
    setAnnModal({
      isOpen: true,
      mode: 'view',
      id: ann.id,
      title: ann.title,
      message: ann.message,
      type: ann.type || 'info',
      priority: ann.priority || 'normal',
      enabled: ann.enabled !== false,
      startDate: ann.startDate || '',
      endDate: ann.endDate || '',
    });
  };

  const handleSaveAnnouncement = async () => {
    if (!annModal.title.trim() || !annModal.message.trim()) {
      showToast('Please provide both an announcement title and message.', 'error');
      return;
    }

    const role = selectedDashboardRole;
    try {
      if (annModal.mode === 'create') {
        const res = await settingsApi.createAnnouncement(role, {
          title: annModal.title.trim(),
          message: annModal.message.trim(),
          type: annModal.type,
          priority: annModal.priority,
          enabled: annModal.enabled,
          startDate: annModal.startDate || undefined,
          endDate: annModal.endDate || undefined,
        });

        const newAnn: AnnouncementItem = res.data?.announcement || {
          id: `ann_${Date.now()}`,
          title: annModal.title.trim(),
          message: annModal.message.trim(),
          type: annModal.type,
          priority: annModal.priority,
          enabled: annModal.enabled,
          startDate: annModal.startDate || undefined,
          endDate: annModal.endDate || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setDashboardsConfig((prev) => {
          const curRole = prev[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
          const currentList = curRole.announcements || [];
          return {
            ...prev,
            [role]: {
              ...curRole,
              announcement: {
                enabled: newAnn.enabled,
                title: newAnn.title,
                message: newAnn.message,
                type: newAnn.type,
              },
              announcements: [newAnn, ...currentList],
            },
          };
        });
        showToast(`Announcement created for ${role.toUpperCase()} dashboard.`, 'success');
      } else if (annModal.mode === 'edit') {
        await settingsApi.updateAnnouncement(role, annModal.id, {
          title: annModal.title.trim(),
          message: annModal.message.trim(),
          type: annModal.type,
          priority: annModal.priority,
          enabled: annModal.enabled,
          startDate: annModal.startDate || undefined,
          endDate: annModal.endDate || undefined,
        });

        setDashboardsConfig((prev) => {
          const curRole = prev[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
          const updatedList = (curRole.announcements || []).map((a) =>
            a.id === annModal.id
              ? {
                  ...a,
                  title: annModal.title.trim(),
                  message: annModal.message.trim(),
                  type: annModal.type,
                  priority: annModal.priority,
                  enabled: annModal.enabled,
                  startDate: annModal.startDate || undefined,
                  endDate: annModal.endDate || undefined,
                  updatedAt: new Date().toISOString(),
                }
              : a
          );

          return {
            ...prev,
            [role]: {
              ...curRole,
              announcement: {
                enabled: annModal.enabled,
                title: annModal.title.trim(),
                message: annModal.message.trim(),
                type: annModal.type,
              },
              announcements: updatedList,
            },
          };
        });
        showToast(`Announcement updated for ${role.toUpperCase()} dashboard.`, 'success');
      }
      setAnnModal((prev) => ({ ...prev, isOpen: false }));
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to save announcement.', 'error');
    }
  };

  const handleToggleAnnouncementActive = async (ann: AnnouncementItem) => {
    const role = selectedDashboardRole;
    const newActive = !ann.enabled;
    try {
      await settingsApi.toggleAnnouncement(role, ann.id);
      setDashboardsConfig((prev) => {
        const curRole = prev[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
        const updatedList = (curRole.announcements || []).map((a) =>
          a.id === ann.id ? { ...a, enabled: newActive } : a
        );
        return {
          ...prev,
          [role]: {
            ...curRole,
            announcement: {
              ...curRole.announcement,
              enabled: newActive,
            },
            announcements: updatedList,
          },
        };
      });
      showToast(`Announcement ${newActive ? 'activated' : 'deactivated'}.`, 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle announcement.', 'error');
    }
  };

  const handleDeleteAnnouncement = (ann: AnnouncementItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Role Announcement',
      message: `Are you sure you want to permanently delete the announcement "${ann.title}" for the ${selectedDashboardRole.toUpperCase()} dashboard? This action will immediately remove it.`,
      confirmText: 'Delete Announcement',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        const role = selectedDashboardRole;
        try {
          await settingsApi.deleteAnnouncement(role, ann.id);
          setDashboardsConfig((prev) => {
            const curRole = prev[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
            const filtered = (curRole.announcements || []).filter((a) => a.id !== ann.id);
            return {
              ...prev,
              [role]: {
                ...curRole,
                announcement: {
                  ...curRole.announcement,
                  enabled: filtered.length > 0 ? filtered[0].enabled : false,
                  title: filtered.length > 0 ? filtered[0].title : '',
                  message: filtered.length > 0 ? filtered[0].message : '',
                },
                announcements: filtered,
              },
            };
          });
          showToast('Announcement deleted successfully.', 'success');
          window.dispatchEvent(new CustomEvent('medicare_config_updated'));
        } catch (err: any) {
          showToast(err.message || 'Failed to delete announcement.', 'error');
        }
      },
    });
  };

  // --- ROLE WIDGETS MANAGEMENT HANDLERS ---
  const handleOpenEditWidget = (widget: WidgetConfigItem) => {
    setWidgetModal({
      isOpen: true,
      key: widget.key,
      label: widget.label,
      colSpan: widget.colSpan || 'half',
      order: widget.order,
      enabled: widget.enabled !== false,
    });
  };

  const handleSaveWidget = async () => {
    const role = selectedDashboardRole;
    const curRole = dashboardsConfig[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
    const updatedList = (curRole.widgetList || []).map((w) =>
      w.key === widgetModal.key
        ? {
            ...w,
            label: widgetModal.label.trim() || w.label,
            colSpan: widgetModal.colSpan,
            enabled: widgetModal.enabled,
          }
        : w
    );
    const updatedWidgetsMap = { ...curRole.widgets, [widgetModal.key]: widgetModal.enabled };

    try {
      await settingsApi.updateRoleWidgets(role, { widgetList: updatedList });
      setDashboardsConfig((prev) => ({
        ...prev,
        [role]: {
          ...prev[role as keyof DashboardsConfig],
          widgets: updatedWidgetsMap,
          widgetList: updatedList,
        },
      }));
      setWidgetModal((prev) => ({ ...prev, isOpen: false }));
      showToast(`Widget configuration updated for ${role.toUpperCase()}.`, 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to update widget settings.', 'error');
    }
  };

  const handleToggleWidget = async (key: string, currentEnabled: boolean) => {
    const role = selectedDashboardRole;
    const curRole = dashboardsConfig[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
    const newEnabled = !currentEnabled;
    const updatedList = (curRole.widgetList || []).map((w) =>
      w.key === key ? { ...w, enabled: newEnabled } : w
    );
    const updatedWidgetsMap = { ...curRole.widgets, [key]: newEnabled };

    try {
      await settingsApi.updateRoleWidgets(role, { widgetList: updatedList });
      setDashboardsConfig((prev) => ({
        ...prev,
        [role]: {
          ...prev[role as keyof DashboardsConfig],
          widgets: updatedWidgetsMap,
          widgetList: updatedList,
        },
      }));
      showToast(`Widget ${newEnabled ? 'enabled' : 'disabled'}.`, 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle widget.', 'error');
    }
  };

  const handleMoveWidget = async (index: number, direction: 'up' | 'down') => {
    const role = selectedDashboardRole;
    const curRole = dashboardsConfig[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
    const list = [...(curRole.widgetList || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const reordered = list.map((w, idx) => ({ ...w, order: idx + 1 }));

    try {
      await settingsApi.updateRoleWidgets(role, { widgetList: reordered });
      setDashboardsConfig((prev) => ({
        ...prev,
        [role]: {
          ...prev[role as keyof DashboardsConfig],
          widgetList: reordered,
        },
      }));
      showToast('Widget layout order updated.', 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder widgets.', 'error');
    }
  };

  const handleRemoveWidget = (widget: WidgetConfigItem) => {
    if (widget.removable === false) {
      showToast('This core widget is protected and essential for clinical operations.', 'info');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Remove Widget from Layout',
      message: `Remove "${widget.label}" from the ${selectedDashboardRole.toUpperCase()} dashboard layout? Note: This does NOT delete any underlying application functionality or clinical records; it only hides it from this role's screen. You can add it back anytime from the widget catalog.`,
      confirmText: 'Remove Widget',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        const role = selectedDashboardRole;
        const curRole = dashboardsConfig[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
        const filtered = (curRole.widgetList || []).filter((w) => w.key !== widget.key);
        const updatedWidgetsMap = { ...curRole.widgets, [widget.key]: false };

        try {
          await settingsApi.updateRoleWidgets(role, { widgetList: filtered });
          setDashboardsConfig((prev) => ({
            ...prev,
            [role]: {
              ...prev[role as keyof DashboardsConfig],
              widgets: updatedWidgetsMap,
              widgetList: filtered,
            },
          }));
          showToast(`Widget removed from ${role.toUpperCase()} layout.`, 'success');
          window.dispatchEvent(new CustomEvent('medicare_config_updated'));
        } catch (err: any) {
          showToast(err.message || 'Failed to remove widget.', 'error');
        }
      },
    });
  };

  const handleAddWidgetFromCatalog = async (catItem: any) => {
    const role = selectedDashboardRole;
    const curRole = dashboardsConfig[role as keyof DashboardsConfig] || buildInitialRoleConfig(role, '', '');
    const existingList = curRole.widgetList || [];
    if (existingList.some((w) => w.key === catItem.key)) {
      showToast('This widget is already in the layout.', 'info');
      return;
    }

    const newWidget: WidgetConfigItem = {
      key: catItem.key,
      label: catItem.label,
      description: catItem.description,
      enabled: true,
      order: existingList.length + 1,
      colSpan: catItem.colSpan,
      removable: catItem.removable !== false,
    };

    const updatedList = [...existingList, newWidget];
    const updatedWidgetsMap = { ...curRole.widgets, [catItem.key]: true };

    try {
      await settingsApi.updateRoleWidgets(role, { widgetList: updatedList });
      setDashboardsConfig((prev) => ({
        ...prev,
        [role]: {
          ...prev[role as keyof DashboardsConfig],
          widgets: updatedWidgetsMap,
          widgetList: updatedList,
        },
      }));
      setAddWidgetModalOpen(false);
      showToast(`Widget "${catItem.label}" added to ${role.toUpperCase()} dashboard.`, 'success');
      window.dispatchEvent(new CustomEvent('medicare_config_updated'));
    } catch (err: any) {
      showToast(err.message || 'Failed to add widget.', 'error');
    }
  };

  const handleRestoreRoleDefaultWidgets = () => {
    const role = selectedDashboardRole;
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default Widgets Layout',
      message: `Restore the default widget layout for the ${role.toUpperCase()} dashboard? Any custom ordering or hidden widgets will be reset to platform baseline.`,
      confirmText: 'Restore Defaults',
      confirmVariant: 'warning',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          const res = await settingsApi.resetRoleWidgets(role);
          const restoredList = res.data?.widgets || [];
          const widgetsMap: Record<string, boolean> = {};
          restoredList.forEach((w: any) => {
            widgetsMap[w.key] = w.enabled !== false;
          });

          setDashboardsConfig((prev) => ({
            ...prev,
            [role]: {
              ...prev[role as keyof DashboardsConfig],
              widgets: widgetsMap,
              widgetList: restoredList,
            },
          }));
          showToast(`Default widget layout restored for ${role.toUpperCase()}.`, 'success');
          window.dispatchEvent(new CustomEvent('medicare_config_updated'));
        } catch (err: any) {
          showToast(err.message || 'Failed to restore default widgets.', 'error');
        }
      },
    });
  };

  // --- NAVIGATION ITEMS CRUD HANDLERS (TAB 3) ---
  const handleOpenCreateNavItem = () => {
    setNavModal({
      isOpen: true,
      mode: 'create',
      id: `nav_${Date.now()}`,
      label: '',
      url: '/',
      isMega: false,
      visible: true,
      urlError: null,
    });
  };

  const handleOpenEditNavItem = (item: HeaderNavItem) => {
    setNavModal({
      isOpen: true,
      mode: 'edit',
      id: item.id,
      label: item.label,
      url: item.url || '/',
      isMega: Boolean(item.isMega),
      visible: item.visible,
      urlError: null,
    });
  };

  const handleSaveNavItem = () => {
    if (!navModal.label.trim()) {
      showToast('Navigation label is required.', 'error');
      return;
    }
    const urlError = validateNavUrl(navModal.url);
    if (urlError) {
      setNavModal((prev) => ({ ...prev, urlError }));
      return;
    }

    if (navModal.mode === 'create') {
      const newItem: HeaderNavItem = {
        id: navModal.id || `nav_${Date.now()}`,
        label: navModal.label.trim(),
        url: navModal.url.trim(),
        visible: navModal.visible,
        order: headerNavItems.length + 1,
        isMega: navModal.isMega,
        removable: true,
      };
      setHeaderNavItems((prev) => [...prev, newItem]);
      showToast(`Navigation item "${newItem.label}" added. Remember to Save Draft or Publish.`, 'success');
    } else {
      setHeaderNavItems((prev) =>
        prev.map((item) =>
          item.id === navModal.id
            ? {
                ...item,
                label: navModal.label.trim(),
                url: navModal.url.trim(),
                visible: navModal.visible,
                isMega: navModal.isMega,
              }
            : item
        )
      );
      showToast(`Navigation item updated.`, 'success');
    }
    setNavModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= headerNavItems.length) return;
    const copy = [...headerNavItems];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setHeaderNavItems(copy.map((it, idx) => ({ ...it, order: idx + 1 })));
  };

  const handleDeleteNavItem = (item: HeaderNavItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Navigation Item',
      message: `Remove "${item.label}" (${item.url}) from header navigation?`,
      confirmText: 'Delete Item',
      confirmVariant: 'danger',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setHeaderNavItems((prev) => prev.filter((it) => it.id !== item.id));
        showToast(`Navigation item "${item.label}" deleted.`, 'success');
      },
    });
  };

  const handleRestoreDefaultNavItems = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default Navigation Items',
      message: 'Reset navigation menu items to default system configuration (Home, About Us, Services, Features, Doctors, ABHA)?',
      confirmText: 'Restore Defaults',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setHeaderNavItems([
          { id: 'home', label: 'Home', visible: true, order: 1, url: '/' },
          { id: 'about', label: 'About Us', visible: true, order: 2, url: '/about' },
          { id: 'services', label: 'Services', visible: true, order: 3, isMega: true, url: '/services' },
          { id: 'features', label: 'Features', visible: true, order: 4, url: '/#features' },
          { id: 'doctors', label: 'Doctors', visible: true, order: 5, url: '/doctors' },
          { id: 'abha', label: 'ABHA', visible: true, order: 6, url: '/abha' },
        ]);
        showToast('Default navigation items restored.', 'success');
      },
    });
  };

  // --- LANDING SECTIONS & ABOUT HIGHLIGHTS HANDLERS (TAB 2) ---
  const handleMoveLandingSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= landingSectionsOrder.length) return;
    const copy = [...landingSectionsOrder];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setLandingSectionsOrder(copy);
  };

  const handleRestoreDefaultSectionsOrder = () => {
    setLandingSectionsOrder(['hero', 'about', 'features', 'doctors', 'abha', 'partnerLoop', 'cta']);
    showToast('Default landing sections order restored.', 'success');
  };

  const handleOpenAddHighlight = () => {
    setHighlightModal({ isOpen: true, mode: 'create', index: null, text: '' });
  };

  const handleOpenEditHighlight = (index: number, text: string) => {
    setHighlightModal({ isOpen: true, mode: 'edit', index, text });
  };

  const handleSaveHighlight = () => {
    if (!highlightModal.text.trim()) {
      showToast('Highlight text cannot be empty.', 'error');
      return;
    }
    if (highlightModal.mode === 'create') {
      setAboutHighlights((prev) => [...prev, highlightModal.text.trim()]);
      showToast('Highlight added.', 'success');
    } else if (highlightModal.index !== null) {
      setAboutHighlights((prev) => {
        const copy = [...prev];
        copy[highlightModal.index!] = highlightModal.text.trim();
        return copy;
      });
      showToast('Highlight updated.', 'success');
    }
    setHighlightModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteHighlight = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete About Highlight',
      message: `Remove "${aboutHighlights[index]}" from the About Us highlights list?`,
      confirmText: 'Delete',
      confirmVariant: 'danger',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setAboutHighlights((prev) => prev.filter((_, idx) => idx !== index));
        showToast('Highlight deleted.', 'success');
      },
    });
  };

  const handleMoveHighlight = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= aboutHighlights.length) return;
    const copy = [...aboutHighlights];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setAboutHighlights(copy);
  };

  const handleRestoreDefaultHighlights = () => {
    setAboutHighlights([
      'Modern Infrastructure',
      'Advanced Medical Equipment',
      'Experienced Medical Professionals',
      '24/7 Emergency Services',
    ]);
    showToast('Default About highlights restored.', 'success');
  };

  const handleRestoreDefaultAboutMedia = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default About Media Assets',
      message: 'Reset all About Us images and video sources to default verified project assets?',
      confirmText: 'Restore Default Media',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setAboutImageUrl('/about-us-phr.jpg');
        setAboutSecondaryImageUrl('/about_us_healthcare.jpg');
        setAboutMissionImageUrl('/mission_3d_target.jpg');
        setAboutVisionImageUrl('/vision_3d_ecosystem.jpg');
        setAboutVideoUrl('/about_us_.mp4');
        setAboutVideoPosterUrl('/about-us-phr.jpg');
        setShowAboutVideo(true);
        showToast('Default About Us media restored.', 'success');
      },
    });
  };

  // --- HERO SECTION HANDLERS (TAB 2) ---
  const handleHeroMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroMedia(true);
    try {
      const res = await uploadApi.uploadImage(file, 'HERO_MEDIA');
      if (res.data?.url) {
        if (target === 'video') {
          setHeroVideoUrl(res.data.url);
          setHeroMediaType('video');
        } else {
          setHeroImageUrl(res.data.url);
          setHeroMediaType('image');
        }
        showToast(`Hero ${target} uploaded successfully.`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || `Failed to upload hero ${target}.`, 'error');
    } finally {
      setIsUploadingHeroMedia(false);
    }
  };

  const handleRestoreDefaultHero = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default Hero Section',
      message: 'Reset Hero Section content, typography, media, CTAs, and feature card styling to default system settings?',
      confirmText: 'Restore Default Hero',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setHeroEnabled(true);
        setHeroBadge('ABDM COMPLIANT PERSONAL HEALTH RECORD');
        setHeroTitle('Your Health,');
        setHeroHighlightTitle('Always With You.');
        setHeroSubtitle('Secure your medical records, manage your medicines, share health information with doctors, and stay prepared for emergencies — all in one place.');
        setHeroPrimaryCtaText('Get Started');
        setHeroPrimaryCtaAction('dashboard');
        setHeroSecondaryCtaText('Connect ABHA');
        setHeroSecondaryCtaAction('about');
        setHeroMediaType('video');
        setHeroVideoUrl('/Digital_Health_Record_For_Project.mp4');
        setHeroImageUrl('/about-us-phr.jpg');
        setHeroOverlayStyle('gradient');
        setHeroShowSosCard(true);
        setHeroSosCardTitle('Emergency SOS');
        setHeroSosCardSubtitle('SOS Pass Ready');
        setHeroShowSoundControl(true);
        setHeroShowIndicators(true);
        showToast('Default Hero Section settings restored.', 'success');
      },
    });
  };

  // --- BRAND & LOGO HANDLERS (TAB 1) ---
  const handleRemoveLogo = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Brand Logo',
      message: 'Remove custom institution logo? The platform will revert to displaying the default vector brand icon.',
      confirmText: 'Remove Logo',
      confirmVariant: 'danger',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setLogoUrl('');
        showToast('Brand logo removed.', 'success');
      },
    });
  };

  const handleRemoveAlternateLogo = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Alternate Logo',
      message: 'Remove alternate logo asset?',
      confirmText: 'Remove',
      confirmVariant: 'danger',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setAlternateLogoUrl('');
        showToast('Alternate logo removed.', 'success');
      },
    });
  };

  const handleResetBrandColors = () => {
    setPrimaryColor('#00a896');
    setAccentColor('#00d2be');
    showToast('Brand colors reset to default teal palette.', 'success');
  };

  const handleRestoreDefaultBranding = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default Branding',
      message: 'Reset application name, taglines, logos, and colors to default MediCare DHR settings?',
      confirmText: 'Restore Defaults',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setAppName('MediCare Digital Health Record');
        setTagline('Your Health, Always With You.');
        setLogoUrl('');
        setAlternateLogoUrl('');
        setPrimaryColor('#00a896');
        setAccentColor('#00d2be');
        setLoginTitle('MediCare Access');
        setLoginSubtitle('National ABDM Gateway & Clinical Health Records');
        showToast('Default branding restored.', 'success');
      },
    });
  };

  // --- FOOTER & SOCIAL LINKS HANDLERS (TAB 4) ---
  const handleOpenAddSocial = () => {
    setSocialModal({ isOpen: true, mode: 'create', key: '', platform: '', url: 'https://' });
  };

  const handleOpenEditSocial = (key: string, url: string) => {
    setSocialModal({ isOpen: true, mode: 'edit', key, platform: key, url });
  };

  const handleSaveSocial = () => {
    if (!socialModal.platform.trim()) {
      showToast('Platform name is required.', 'error');
      return;
    }
    const key = (socialModal.key || socialModal.platform).toLowerCase().replace(/[^a-z0-9]/g, '');
    const urlVal = validateNavUrl(socialModal.url);
    if (urlVal) {
      showToast(urlVal, 'error');
      return;
    }

    setFooterSocialLinks((prev) => ({
      ...prev,
      [key]: socialModal.url.trim(),
    }));
    if (key === 'facebook') setFooterFacebook(socialModal.url.trim());
    if (key === 'twitter') setFooterTwitter(socialModal.url.trim());
    if (key === 'linkedin') setFooterLinkedin(socialModal.url.trim());
    if (key === 'instagram') setFooterInstagram(socialModal.url.trim());

    setSocialModal((prev) => ({ ...prev, isOpen: false }));
    showToast(`Social link for "${socialModal.platform}" saved.`, 'success');
  };

  const handleDeleteSocial = (key: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Social Link',
      message: `Remove ${key.toUpperCase()} link from public footer?`,
      confirmText: 'Delete Link',
      confirmVariant: 'danger',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setFooterSocialLinks((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        if (key === 'facebook') setFooterFacebook('');
        if (key === 'twitter') setFooterTwitter('');
        if (key === 'linkedin') setFooterLinkedin('');
        if (key === 'instagram') setFooterInstagram('');
        showToast(`Social link removed.`, 'success');
      },
    });
  };

  const handleRestoreDefaultSocial = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Default Social Links',
      message: 'Reset social links to default channels (Facebook, Twitter, LinkedIn, Instagram)?',
      confirmText: 'Restore Defaults',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setFooterFacebook('https://facebook.com');
        setFooterTwitter('https://twitter.com');
        setFooterLinkedin('https://linkedin.com');
        setFooterInstagram('https://instagram.com');
        setFooterSocialLinks({
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
        });
        showToast('Default social links restored.', 'success');
      },
    });
  };

  // --- SECURITY BASELINE RESTORE HANDLER (TAB 6) ---
  const handleRestoreDefaultSecurity = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restore Security Baseline Defaults',
      message: 'Restore institutional security baseline settings (30 min timeout, MFA enforced for clinical staff, active emergency hotline)? Mandatory backend security policies remain protected.',
      confirmText: 'Restore Baseline',
      confirmVariant: 'warning',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setSessionTimeout('30');
        setMfaEnforced(true);
        setEmailAlerts(true);
        setSmsAlerts(true);
        setMaintenanceMode(false);
        showToast('Security baseline defaults restored.', 'success');
      },
    });
  };

  const fullLogoSrc = logoUrl 
    ? (logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`) 
    : '';

  const ROLE_NAMES = [
    { key: 'patient', label: 'Patient Dashboard' },
    { key: 'doctor', label: 'Doctor Portal' },
    { key: 'nurse', label: 'Nurse Duty Roster' },
    { key: 'caregiver', label: 'Caregiver Roster' },
    { key: 'pharmacist', label: 'Pharmacist Dispensary' },
    { key: 'insurance', label: 'Insurance & TPA' },
    { key: 'admin', label: 'Hospital Admin' },
    { key: 'superAdmin', label: 'Super Admin Directorate' },
  ];

  return (
    <div className="space-y-6 pb-20 font-sans select-none max-w-7xl mx-auto">
      
      {/* TOAST MESSAGE */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none select-none max-w-md w-full px-4">
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              className={`pointer-events-auto select-auto px-5 py-3.5 rounded-2xl text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 ${
                toastType === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {toastType === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HEADER COMMAND HERO */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00a896] text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Frontend UI & System Configuration
            </h2>
            {hasDraftPending ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[10px] font-black uppercase tracking-wider border border-amber-300/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" /> Draft Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-black uppercase tracking-wider border border-white/20 font-mono">
                <Check className="w-3 h-3 text-emerald-300" /> Live
              </span>
            )}
          </div>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            Configure branding, landing page sections, navigation, footer links, and role-based dashboard widgets synchronized across the portal.
          </p>
        </div>

        {/* ACTION BUTTONS CONSOLE */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 flex items-center gap-2 transition-all cursor-pointer"
            title="Inspect Live Configuration Preview"
          >
            <Eye className="w-4 h-4 text-white" />
            <span>Preview Mode</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>{isSubmitting ? 'Saving Draft...' : 'Save Draft'}</span>
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handlePublishLive}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-teal-50/90 text-[#00796b] font-black text-xs shadow-md shadow-teal-950/15 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Publish all configuration changes live to active visitors"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin text-[#00897b]" /> : <Sparkles className="w-4 h-4 text-[#00897b]" />}
              <span>{isPublishing ? 'Publishing Live...' : 'Publish to Live Frontend'}</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={isResetting}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer"
              title="Reset Platform to Defaults"
            >
              {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* HORIZONTAL MANAGEMENT TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'branding'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>1. Brand & Logo</span>
        </button>

        <button
          id="tab-landing"
          onClick={() => setActiveTab('landing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'landing'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>2. Landing Page</span>
        </button>

        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'header'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>3. Header & Nav</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'footer'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>4. Footer & Social</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboards'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5. All 8 Role Dashboards</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>6. Security Policies</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-[#00a896]" />
          <p className="text-xs font-bold text-slate-500">Loading synchronized configuration...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: BRANDING & IDENTITY */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#00a896]" /> Organization Branding & Color Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure brand name, logos, interface theme mode, primary brand colors, and authentication gateway styling across all portals.
                </p>
              </div>

              {/* 1. INTERFACE THEME MODE SELECTOR */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block">
                      Interface Theme Mode
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Control system-wide light/dark appearance for patients, clinicians, and administrative staff.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-[#00796b] dark:text-[#2dd4bf] border border-teal-200/70 dark:border-teal-800/50">
                    Active: {themeMode.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('light');
                      document.documentElement.classList.remove('dark');
                      showToast('Interface set to Light Mode. Remember to Save or Publish.', 'info');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white dark:bg-slate-800 border-[#00a896] text-[#00796b] dark:text-[#2dd4bf] shadow-sm ring-2 ring-[#00a896]/20'
                        : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">Light Mode</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Crisp healthcare white</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('dark');
                      document.documentElement.classList.add('dark');
                      showToast('Interface set to Dark Mode. Remember to Save or Publish.', 'info');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      themeMode === 'dark'
                        ? 'bg-white dark:bg-slate-800 border-[#00a896] text-[#00796b] dark:text-[#2dd4bf] shadow-sm ring-2 ring-[#00a896]/20'
                        : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">Dark Mode</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sleek midnight slate</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('auto');
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      if (prefersDark) document.documentElement.classList.add('dark');
                      else document.documentElement.classList.remove('dark');
                      showToast('Interface set to System Auto. Remember to Save or Publish.', 'info');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      themeMode === 'auto'
                        ? 'bg-white dark:bg-slate-800 border-[#00a896] text-[#00796b] dark:text-[#2dd4bf] shadow-sm ring-2 ring-[#00a896]/20'
                        : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-[#00a896] flex items-center justify-center shrink-0">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">System Auto</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Follows user device</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. CURATED INSTITUTIONAL COLOR PRESETS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block">
                      Curated Institutional Color Palettes
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Select a tested, professional medical color theme with harmonious primary and accent values.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                  {[
                    { name: 'Clinical Teal', primary: '#00a896', accent: '#00d2be', desc: 'Active Brand' },
                    { name: 'Hospital Blue', primary: '#0284c7', accent: '#38bdf8', desc: 'Medical Sky' },
                    { name: 'Emerald Health', primary: '#059669', accent: '#34d399', desc: 'Wellness' },
                    { name: 'Executive Indigo', primary: '#4f46e5', accent: '#818cf8', desc: 'Academic' },
                    { name: 'Modern Violet', primary: '#7c3aed', accent: '#a78bfa', desc: 'Clinical Hub' },
                    { name: 'Slate Minimal', primary: '#334155', accent: '#64748b', desc: 'Minimalist' }
                  ].map((palette) => {
                    const isSelected = primaryColor.toLowerCase() === palette.primary.toLowerCase();
                    return (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(palette.primary);
                          setAccentColor(palette.accent);
                          document.documentElement.style.setProperty('--color-brand-primary', palette.primary);
                          document.documentElement.style.setProperty('--color-brand-accent', palette.accent);
                          showToast(`Applied ${palette.name} color palette.`, 'info');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-50/50 dark:bg-teal-950/30 border-[#00a896] shadow-xs ring-2 ring-[#00a896]/20'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0" style={{ backgroundColor: palette.primary }} />
                          <span className="w-3 h-3 rounded-full border border-black/10 shadow-xs shrink-0" style={{ backgroundColor: palette.accent }} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{palette.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{palette.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. CORE BRAND IDENTITY FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Application / Hospital Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Brand Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Theme Color (Brand Teal / Accent)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        document.documentElement.style.setProperty('--color-brand-primary', e.target.value);
                      }}
                      className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        document.documentElement.style.setProperty('--color-brand-primary', e.target.value);
                      }}
                      className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        document.documentElement.style.setProperty('--color-brand-accent', e.target.value);
                      }}
                      className="w-11 h-11 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        document.documentElement.style.setProperty('--color-brand-accent', e.target.value);
                      }}
                      className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Login Portal Header Title
                  </label>
                  <input
                    type="text"
                    value={loginTitle}
                    onChange={(e) => setLoginTitle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Login Portal Subtitle
                  </label>
                  <input
                    type="text"
                    value={loginSubtitle}
                    onChange={(e) => setLoginSubtitle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]/20 focus:border-[#00a896] transition-all"
                  />
                </div>
              </div>

              {/* LOGO UPLOAD & PREVIEW */}
              <div className="pt-2 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Primary Institutional Brand Logo Asset
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 shadow-sm">
                      {fullLogoSrc ? (
                        <img src={fullLogoSrc} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {fullLogoSrc ? 'Custom Institution Logo Active' : 'Default MediCare Vector Symbol Active'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Upload primary logo (PNG, JPG, WEBP, SVG max 5MB). Processed securely on the server and synchronized across all pages.
                      </p>
                      {uploadError && <p className="text-[11px] text-rose-500 font-semibold">{uploadError}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {fullLogoSrc && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
                        {isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={isUploadingLogo}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* ALTERNATE / MONOCHROME LOGO */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Alternate / Dark Mode Brand Logo (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700 shadow-sm">
                      {alternateLogoUrl ? (
                        <img 
                          src={alternateLogoUrl.startsWith('http') ? alternateLogoUrl : `http://localhost:5000${alternateLogoUrl}`} 
                          alt="Alternate Logo" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Image className="w-8 h-8 text-slate-500" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {alternateLogoUrl ? 'Alternate High-Contrast Logo Active' : 'No alternate logo specified (uses primary)'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Optional inverse / white vector logo for dark backdrops and executive print receipts.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {alternateLogoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAlternateLogo}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                      <input
                        type="text"
                        value={alternateLogoUrl}
                        onChange={(e) => setAlternateLogoUrl(e.target.value)}
                        placeholder="/logo-white.svg or https://..."
                        className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono w-48"
                      />
                    </div>
                  </div>
                </div>

                {/* BRAND MANAGEMENT ACTIONS */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500">
                    All branding modifications persist when committed as draft or published live.
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetBrandColors}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Colors</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultBranding}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Default Branding</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LANDING PAGE MANAGEMENT */}
          {activeTab === 'landing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-500" /> Landing Page Sections & Content
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage section visibility, hero headings, media, about highlights, and call-to-action text displayed to visitors.
                </p>
              </div>

              {/* SECTION VISIBILITY & ORDERING */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Landing Page Section Display Toggles & Ordering
                  </label>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultSectionsOrder}
                    className="text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Default Section Order</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {landingSectionsOrder.map((secKey, idx) => {
                    const isVisible = (landingSectionsVisibility as any)[secKey] ?? true;
                    const sectionLabels: Record<string, string> = {
                      hero: 'Hero Showcase',
                      about: 'About Us / PHR',
                      features: 'Features Grid',
                      doctors: 'Doctor Directory',
                      abha: 'ABHA ID Locker',
                      partnerLoop: 'Partner Logo Loop',
                      cta: 'Final Action CTA',
                    };
                    const label = sectionLabels[secKey] || secKey;

                    return (
                      <div
                        key={secKey}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                          isVisible
                            ? 'bg-blue-500/5 border-blue-500/30 text-slate-800 dark:text-slate-200'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold truncate">{label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* MOVE UP / DOWN */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveLandingSection(idx, 'up')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move section up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === landingSectionsOrder.length - 1}
                            onClick={() => handleMoveLandingSection(idx, 'down')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move section down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* VISIBILITY TOGGLE */}
                          <button
                            type="button"
                            onClick={() => {
                              setLandingSectionsVisibility((prev) => ({
                                ...prev,
                                [secKey]: !isVisible,
                              }));
                            }}
                            className="p-1 rounded-lg cursor-pointer"
                            title={isVisible ? 'Hide section' : 'Show section'}
                          >
                            {isVisible ? (
                              <CheckSquare className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HERO SECTION CONFIGURATION & SHOWCASE */}
              <div id="hero-section-content" className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
                {/* HERO HEADER BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-500" /> HERO SECTION CONTENT
                      </h4>
                      {heroEnabled ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active on Live Page
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          Section Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Configure the prominent headline, video/image media, CTA buttons, sound control, and emergency SOS card on the public landing page.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !heroEnabled;
                        setHeroEnabled(next);
                        setLandingSectionsVisibility((prev) => ({ ...prev, hero: next }));
                        showToast(`Hero section ${next ? 'enabled' : 'disabled'}.`, 'info');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        heroEnabled
                          ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {heroEnabled ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      <span>{heroEnabled ? 'Hero Enabled' : 'Hero Disabled'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRestoreDefaultHero}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore Default Hero</span>
                    </button>
                  </div>
                </div>

                {/* 1. TYPOGRAPHY & HEADLINE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Hero Badge / Pill Tagline
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="e.g. ABDM COMPLIANT PERSONAL HEALTH RECORD"
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Hero Main Heading (First Line)
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="Your Health,"
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Hero Highlight Heading (Cyan Accent Line)
                    </label>
                    <input
                      type="text"
                      value={heroHighlightTitle}
                      onChange={(e) => setHeroHighlightTitle(e.target.value)}
                      placeholder="Always With You."
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Hero Subtitle / Description Text
                    </label>
                    <textarea
                      rows={2}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="Secure your medical records, manage your medicines, share health information with doctors..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 2. CALL-TO-ACTION (CTA) BUTTONS & DESTINATIONS */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Call-To-Action (CTA) Buttons & Navigation
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PRIMARY CTA */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                        Primary CTA (Filled Button)
                      </span>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Button Label</label>
                        <input
                          type="text"
                          value={heroPrimaryCtaText}
                          onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                          placeholder="Get Started"
                          className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Click Action / Destination</label>
                        <select
                          value={heroPrimaryCtaAction}
                          onChange={(e) => setHeroPrimaryCtaAction(e.target.value)}
                          className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="dashboard">Patient Dashboard (/dashboard)</option>
                          <option value="register">Create Account / Register (/register)</option>
                          <option value="about">About Us Section (/about)</option>
                          <option value="abha">ABHA Health Locker (/abha)</option>
                          <option value="doctors">Doctor Directory (/doctors)</option>
                        </select>
                      </div>
                    </div>

                    {/* SECONDARY CTA */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                      <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                        Secondary CTA (Outlined Button)
                      </span>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Button Label</label>
                        <input
                          type="text"
                          value={heroSecondaryCtaText}
                          onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                          placeholder="Connect ABHA"
                          className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Click Action / Destination</label>
                        <select
                          value={heroSecondaryCtaAction}
                          onChange={(e) => setHeroSecondaryCtaAction(e.target.value)}
                          className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="about">See How It Works / About Us (/about)</option>
                          <option value="abha">Connect ABHA Card (/abha)</option>
                          <option value="dashboard">Direct To Dashboard (/dashboard)</option>
                          <option value="services">Clinical Services (/services)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. HERO BACKGROUND MEDIA & STYLING */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-blue-500" /> Background Media Asset & Styling
                    </h5>
                    {/* MEDIA TYPE SWITCH */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setHeroMediaType('video')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                          heroMediaType === 'video'
                            ? 'bg-blue-500 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Background Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroMediaType('image')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                          heroMediaType === 'image'
                            ? 'bg-blue-500 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Static Image
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* LEFT CONTROLS */}
                    <div className="lg:col-span-7 space-y-4">
                      {heroMediaType === 'video' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            Hero Background Video URL / Asset Path
                          </label>
                          <input
                            type="text"
                            value={heroVideoUrl}
                            onChange={(e) => setHeroVideoUrl(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] font-bold text-slate-500">Presets:</span>
                            <button
                              type="button"
                              onClick={() => setHeroVideoUrl('/Digital_Health_Record_For_Project.mp4')}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 cursor-pointer"
                            >
                              Digital_Health_Record_For_Project.mp4
                            </button>
                            <button
                              type="button"
                              onClick={() => setHeroVideoUrl('/about_us_.mp4')}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 cursor-pointer"
                            >
                              about_us_.mp4
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            Hero Background Image URL / Asset Path
                          </label>
                          <input
                            type="text"
                            value={heroImageUrl}
                            onChange={(e) => setHeroImageUrl(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] font-bold text-slate-500">Presets:</span>
                            <button
                              type="button"
                              onClick={() => setHeroImageUrl('/about-us-phr.jpg')}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 cursor-pointer"
                            >
                              about-us-phr.jpg
                            </button>
                            <button
                              type="button"
                              onClick={() => setHeroImageUrl('/about_us_healthcare.jpg')}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 cursor-pointer"
                            >
                              about_us_healthcare.jpg
                            </button>
                          </div>
                        </div>
                      )}

                      {/* UPLOAD BUTTON */}
                      <div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
                          {isUploadingHeroMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>{isUploadingHeroMedia ? 'Uploading Asset...' : `Upload New Hero ${heroMediaType === 'video' ? 'Video' : 'Image'}`}</span>
                          <input
                            type="file"
                            accept={heroMediaType === 'video' ? 'video/mp4,video/webm' : 'image/png,image/jpeg,image/webp'}
                            className="hidden"
                            onChange={(e) => handleHeroMediaUpload(e, heroMediaType)}
                            disabled={isUploadingHeroMedia}
                          />
                        </label>
                      </div>

                      {/* OVERLAY SELECTION */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Background Overlay & Contrast Filter
                        </label>
                        <select
                          value={heroOverlayStyle}
                          onChange={(e) => setHeroOverlayStyle(e.target.value as any)}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="gradient">Deep Cyan/Slate Gradient (Recommended for optimal text legibility)</option>
                          <option value="dark">High Contrast Dark Filter (75% opacity)</option>
                          <option value="medium">Medium Balanced Filter (45% opacity)</option>
                          <option value="light">Light Tint (25% opacity)</option>
                        </select>
                      </div>
                    </div>

                    {/* RIGHT PREVIEW */}
                    <div className="lg:col-span-5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Hero Media Preview
                      </label>
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
                        {heroMediaType === 'video' ? (
                          <video
                            src={heroVideoUrl.startsWith('http') ? heroVideoUrl : heroVideoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={heroImageUrl.startsWith('http') ? heroImageUrl : heroImageUrl}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className={`absolute inset-0 ${
                          heroOverlayStyle === 'dark'
                            ? 'bg-slate-950/75'
                            : heroOverlayStyle === 'light'
                            ? 'bg-slate-950/25'
                            : heroOverlayStyle === 'medium'
                            ? 'bg-slate-950/45'
                            : 'bg-slate-950/45 bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent'
                        }`} />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white z-10 pointer-events-none">
                          <p className="text-[10px] font-black uppercase text-cyan-400 truncate">{heroBadge}</p>
                          <p className="text-xs font-black truncate">{heroTitle} <span className="text-cyan-300">{heroHighlightTitle}</span></p>
                          <div className="flex gap-1.5 mt-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#00a896] text-white">{heroPrimaryCtaText}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-white/40 text-white">{heroSecondaryCtaText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. INTERACTIVE CONTROLS & EMERGENCY SOS CARD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SOUND & INDICATORS TOGGLES */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Interactive Controls & Sound
                    </h5>
                    <div className="space-y-2.5">
                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Show Audio / Sound Toggle Button
                        </span>
                        <input
                          type="checkbox"
                          checked={heroShowSoundControl}
                          onChange={(e) => setHeroShowSoundControl(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        />
                      </label>
                      <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 cursor-pointer">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Show Spotlight Cards Indicator Dots
                        </span>
                        <input
                          type="checkbox"
                          checked={heroShowIndicators}
                          onChange={(e) => setHeroShowIndicators(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* EMERGENCY SOS FEATURE CARD */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Emergency SOS Feature Card
                      </h5>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroShowSosCard}
                          onChange={(e) => setHeroShowSosCard(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-rose-600 cursor-pointer"
                        />
                        <span>Card Enabled</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Card Title</label>
                        <input
                          type="text"
                          value={heroSosCardTitle}
                          onChange={(e) => setHeroSosCardTitle(e.target.value)}
                          placeholder="Emergency SOS"
                          className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Card Subtitle / Ready State</label>
                        <input
                          type="text"
                          value={heroSosCardSubtitle}
                          onChange={(e) => setHeroSosCardSubtitle(e.target.value)}
                          placeholder="SOS Pass Ready"
                          className="w-full h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ABOUT US SECTION CONFIGURATION & MEDIA MANAGEMENT */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/80 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-500" /> About Us Section Content & Media
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Configure text, primary facility images, introduction video, posters, and 3D mission/vision media displayed on the landing page and About page.
                    </p>
                  </div>
                </div>

                {/* TEXT FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      placeholder="About Us"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={aboutBadge}
                      onChange={(e) => setAboutBadge(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      placeholder="Patient-Centered PHR Platform"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">About Us Body Text</label>
                    <textarea
                      rows={3}
                      value={aboutDescription}
                      onChange={(e) => setAboutDescription(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                      placeholder="Comprehensive overview of your healthcare mission..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Learn More Button Label</label>
                    <input
                      type="text"
                      value={aboutLearnMoreText}
                      onChange={(e) => setAboutLearnMoreText(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      placeholder="Learn More About Us"
                    />
                  </div>
                </div>

                {/* 1. PRIMARY SHOWCASE IMAGE */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-teal-500" /> Primary Facility Showcase Image
                    </span>
                    <span className="text-[10px] text-slate-400">Renders on Landing Page & About overview</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-24 h-20 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 overflow-hidden shrink-0 relative flex items-center justify-center">
                      {aboutImageUrl ? (
                        <img 
                          src={aboutImageUrl} 
                          alt="Showcase Preview" 
                          className="w-full h-full object-cover"
                          onError={(e: any) => { e.currentTarget.src = '/about-us-phr.jpg'; }}
                        />
                      ) : (
                        <Image className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aboutImageUrl}
                          onChange={(e) => setAboutImageUrl(e.target.value)}
                          placeholder="/about-us-phr.jpg or https://..."
                          className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer hover:opacity-90 shrink-0">
                          {isUploadingAboutMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={(e) => handleMediaUpload(e, 'aboutImage')}
                            disabled={isUploadingAboutMedia}
                          />
                        </label>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Preloaded Assets:</span>
                        {[
                          { label: 'Hospital Vault (/about-us-phr.jpg)', url: '/about-us-phr.jpg' },
                          { label: 'Clinical Campus (/about_us_healthcare.jpg)', url: '/about_us_healthcare.jpg' },
                        ].map((pr) => (
                          <button
                            key={pr.url}
                            type="button"
                            onClick={() => setAboutImageUrl(pr.url)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                              aboutImageUrl === pr.url
                                ? 'bg-teal-500/20 text-teal-600 dark:text-cyan-300 border border-teal-500/40'
                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. INTRODUCTION VIDEO MANAGEMENT */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-cyan-500" /> Introduction Walkthrough Video
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Display Video Section:</span>
                      <input
                        type="checkbox"
                        checked={showAboutVideo}
                        onChange={(e) => setShowAboutVideo(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Video Headline</label>
                      <input
                        type="text"
                        value={aboutVideoTitle}
                        onChange={(e) => setAboutVideoTitle(e.target.value)}
                        placeholder="See How MediCare Connects Healthcare"
                        className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Video Subtitle</label>
                      <input
                        type="text"
                        value={aboutVideoDescription}
                        onChange={(e) => setAboutVideoDescription(e.target.value)}
                        placeholder="Discover how MediCare brings people and doctors together..."
                        className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Video URL & Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                      Video File Source (MP4, WebM or Project Asset URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aboutVideoUrl}
                        onChange={(e) => setAboutVideoUrl(e.target.value)}
                        placeholder="/about_us_.mp4 or /uploads/video.mp4"
                        className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold cursor-pointer transition-colors shrink-0">
                        {isUploadingAboutMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, 'aboutVideo')}
                          disabled={isUploadingAboutMedia}
                        />
                      </label>
                    </div>

                    {/* Preloaded video presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Preloaded Project Videos:</span>
                      {[
                        { label: 'Walkthrough Video (/about_us_.mp4)', url: '/about_us_.mp4' },
                        { label: 'DHR Project High-Res (/Digital_Health_Record_For_Project.mp4)', url: '/Digital_Health_Record_For_Project.mp4' },
                      ].map((pr) => (
                        <button
                          key={pr.url}
                          type="button"
                          onClick={() => setAboutVideoUrl(pr.url)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                            aboutVideoUrl === pr.url
                              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {pr.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Poster Image */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                      Video Thumbnail / Poster Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aboutVideoPosterUrl}
                        onChange={(e) => setAboutVideoPosterUrl(e.target.value)}
                        placeholder="/about-us-phr.jpg"
                        className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer hover:opacity-90 shrink-0">
                        {isUploadingAboutMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload Poster</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, 'aboutVideoPoster')}
                          disabled={isUploadingAboutMedia}
                        />
                      </label>
                    </div>
                  </div>

                  {/* LIVE ADMIN VIDEO PLAYER PREVIEW */}
                  {aboutVideoUrl && (
                    <div className="pt-2">
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1.5">
                        Interactive Player Preview in Admin Panel:
                      </span>
                      <div className="w-full max-w-md h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 dark:border-slate-700 shadow-md relative">
                        <video
                          src={aboutVideoUrl}
                          poster={aboutVideoPosterUrl || undefined}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. 3D MISSION & VISION CARD MEDIA */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-500" /> Mission & Vision 3D Card Media
                    </span>
                    <span className="text-[10px] text-slate-400">Renders inside About Us 3D story tabs</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mission Image */}
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Mission Card Visual</span>
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                          {aboutMissionImageUrl ? (
                            <img src={aboutMissionImageUrl} alt="Mission" className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.src = '/mission_3d_target.jpg'; }} />
                          ) : (
                            <Image className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={aboutMissionImageUrl}
                            onChange={(e) => setAboutMissionImageUrl(e.target.value)}
                            placeholder="/mission_3d_target.jpg"
                            className="w-full h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                          />
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold cursor-pointer hover:bg-slate-300">
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'aboutMission')} />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Vision Image */}
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Vision Card Visual</span>
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                          {aboutVisionImageUrl ? (
                            <img src={aboutVisionImageUrl} alt="Vision" className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.src = '/vision_3d_ecosystem.jpg'; }} />
                          ) : (
                            <Image className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={aboutVisionImageUrl}
                            onChange={(e) => setAboutVisionImageUrl(e.target.value)}
                            placeholder="/vision_3d_ecosystem.jpg"
                            className="w-full h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                          />
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold cursor-pointer hover:bg-slate-300">
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'aboutVision')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. ABOUT HIGHLIGHTS CRUD MANAGEMENT */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <div>
                      <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> About Us Key Highlights & Strengths
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Feature highlights bulleted across the landing page About overview and About story.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRestoreDefaultHighlights}
                        className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Highlights</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddHighlight}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Highlight</span>
                      </button>
                    </div>
                  </div>

                  {aboutHighlights.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No highlights configured. Click &quot;Add Highlight&quot; to create a new item.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      {aboutHighlights.map((hl, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-2.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              {hIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {hl}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={hIdx === 0}
                              onClick={() => handleMoveHighlight(hIdx, 'up')}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={hIdx === aboutHighlights.length - 1}
                              onClick={() => handleMoveHighlight(hIdx, 'down')}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditHighlight(hIdx, hl)}
                              className="p-1 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                              title="Edit highlight"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHighlight(hIdx)}
                              className="p-1 rounded-md text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer"
                              title="Delete highlight"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RESTORE MEDIA ASSETS ACTION */}
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultAboutMedia}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Default Media Assets</span>
                  </button>
                </div>
              </div>

              {/* FINAL CTA SECTION */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Final Call-To-Action Banner
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">CTA Headline</label>
                    <input
                      type="text"
                      value={ctaTitle}
                      onChange={(e) => setCtaTitle(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">CTA Subtitle</label>
                    <input
                      type="text"
                      value={ctaSubtitle}
                      onChange={(e) => setCtaSubtitle(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEADER & NAVIGATION */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" /> Header & Navigation Bar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage navigation labels, menu ordering, and visibility across the shared header without altering clinical routing.
                </p>
              </div>

              {/* NAVIGATION MENU CRUD TABLE */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Public Navigation Menu Items
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Add, reorder, edit links, or remove public navbar items with URL safety validation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRestoreDefaultNavItems}
                      className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenCreateNavItem}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Navigation Item</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                  {headerNavItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {item.label}
                            </span>
                            {item.isMega && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                Mega Menu
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{item.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                            <LinkIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.url || '/'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                        {/* VISIBLE TOGGLE */}
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.visible}
                            onChange={(e) => {
                              const updated = [...headerNavItems];
                              updated[idx].visible = e.target.checked;
                              setHeaderNavItems(updated);
                            }}
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                          <span className="text-[11px]">{item.visible ? 'Visible' : 'Hidden'}</span>
                        </label>

                        {/* REORDER BUTTONS */}
                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveNavItem(idx, 'up')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move item up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === headerNavItems.length - 1}
                            onClick={() => handleMoveNavItem(idx, 'down')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move item down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* ACTIONS: EDIT & DELETE */}
                        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditNavItem(item)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                            title="Edit menu item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNavItem(item)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer transition-colors"
                            title="Delete menu item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROGRESS BAR & SEARCH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Scroll Progress Indicator</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Display teal progress bar at the top of the header</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Header Quick Search Bar</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Enable search trigger inside navigation bar</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showHeaderSearch}
                    onChange={(e) => setShowHeaderSearch(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOOTER & SOCIAL LINKS */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-500" /> Footer Content & Social Media
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage copyright statements, institutional about blurbs, and social media links appearing across all public pages.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Copyright & Legal Statement
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Footer About Us Description
                  </label>
                  <textarea
                    rows={2}
                    value={footerAboutText}
                    onChange={(e) => setFooterAboutText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SOCIAL MEDIA CRUD MANAGEMENT */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Official Social Network Links
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Manage official social profiles, public channels, and verified community handles.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRestoreDefaultSocial}
                      className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddSocial}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Social Platform</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                  {Object.entries(footerSocialLinks).map(([platKey, platUrl]) => (
                    <div
                      key={platKey}
                      className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase flex items-center justify-center shrink-0">
                          {platKey.slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-black capitalize text-slate-900 dark:text-white">
                            {platKey}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                            <LinkIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{platUrl || 'Not configured'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {platUrl && (
                          <a
                            href={platUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                            title="Test external link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditSocial(platKey, platUrl)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                          title="Edit social link"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSocial(platKey)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer transition-colors"
                          title="Delete social link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ALL 8 ROLE DASHBOARDS */}
          {activeTab === 'dashboards' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" /> All 8 Role Dashboard Configurations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure role-specific announcement banners, informational alerts, and dashboard card/widget visibilities without compromising clinical integrity or security rules.
                </p>
              </div>

              {/* ROLE SELECTION PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {ROLE_NAMES.map((r) => (
                  <button
                    type="button"
                    key={r.key}
                    onClick={() => setSelectedDashboardRole(r.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedDashboardRole === r.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* CURRENT SELECTED ROLE CONFIG */}
              {(() => {
                const currentDash = (dashboardsConfig as any)[selectedDashboardRole] || {
                  announcement: { enabled: false, title: '', message: '', type: 'info' },
                  announcements: [],
                  widgets: {},
                  widgetList: [],
                };
                const announcementsList: AnnouncementItem[] = currentDash.announcements || [];
                const widgetList: WidgetConfigItem[] = currentDash.widgetList || [];

                return (
                  <div className="space-y-8 pt-2">
                    
                    {/* SECTION A: ROLE ANNOUNCEMENTS CRUD MANAGEMENT */}
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-blue-500" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                              Role Announcements ({selectedDashboardRole.toUpperCase()})
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Create, edit, toggle, or delete announcement alerts and administrative banners for this role.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleOpenCreateAnnouncement}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Announcement</span>
                        </button>
                      </div>

                      {/* ANNOUNCEMENTS LIST */}
                      {announcementsList.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40">
                          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            No announcements configured for {selectedDashboardRole.toUpperCase()}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Click &quot;Add Announcement&quot; to publish a briefing banner visible to users with this role.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-xs">
                          {announcementsList.map((ann) => {
                            const isAlert = ann.type === 'alert';
                            const isWarning = ann.type === 'warning';
                            const isSuccess = ann.type === 'success';

                            const typeColor = isAlert
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : isWarning
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : isSuccess
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

                            return (
                              <div
                                key={ann.id}
                                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                  !ann.enabled ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/30' : ''
                                }`}
                              >
                                <div className="space-y-1.5 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${typeColor}`}>
                                      {ann.type}
                                    </span>
                                    {ann.priority && ann.priority !== 'normal' && (
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                                        ann.priority === 'urgent'
                                          ? 'bg-red-500 text-white animate-pulse'
                                          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                                      }`}>
                                        {ann.priority} priority
                                      </span>
                                    )}
                                    <h5 className="text-xs font-black text-slate-900 dark:text-white">
                                      {ann.title}
                                    </h5>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                                    {ann.message}
                                  </p>

                                  {(ann.startDate || ann.endDate) && (
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-0.5">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        Schedule: {ann.startDate ? new Date(ann.startDate).toLocaleDateString() : 'Immediate'} → {ann.endDate ? new Date(ann.endDate).toLocaleDateString() : 'Indefinite'}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                  {/* ACTIVE TOGGLE */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAnnouncementActive(ann)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                      ann.enabled
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${ann.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    <span>{ann.enabled ? 'Active' : 'Disabled'}</span>
                                  </button>

                                  {/* VIEW / EDIT / DELETE */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenViewAnnouncement(ann)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                      title="View announcement details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditAnnouncement(ann)}
                                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                      title="Edit announcement"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAnnouncement(ann)}
                                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer transition-colors"
                                      title="Delete announcement"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* SECTION B: CONFIGURABLE DASHBOARD WIDGETS MANAGEMENT */}
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                              Configurable Dashboard Widgets & Layout ({selectedDashboardRole.toUpperCase()})
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Configure card widths, order, labels, enable/disable views, or remove non-critical widgets without deleting clinical systems.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={handleRestoreRoleDefaultWidgets}
                            className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Defaults</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddWidgetModalOpen(true)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add From Catalog</span>
                          </button>
                        </div>
                      </div>

                      {/* WIDGETS LIST */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {widgetList.map((w, idx) => {
                          const isEnabled = w.enabled !== false;

                          return (
                            <div
                              key={w.key}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                isEnabled
                                  ? 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-xs'
                                  : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-mono font-bold flex items-center justify-center text-slate-500 shrink-0">
                                      #{idx + 1}
                                    </span>
                                    <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                                      {w.label}
                                    </h5>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1">
                                    {w.description || 'Configurable view card'}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {w.colSpan === 'full' ? 'Full Width' : w.colSpan === 'third' ? '1/3 Width' : '1/2 Width'}
                                  </span>
                                  {!w.removable && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                      Protected
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                {/* ENABLED SWITCH */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleWidget(w.key, isEnabled)}
                                  className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                    isEnabled
                                      ? 'bg-blue-500/10 text-blue-700 dark:text-cyan-300 border border-blue-500/30'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                  }`}
                                >
                                  {isEnabled ? <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> : <Square className="w-3.5 h-3.5" />}
                                  <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                                </button>

                                <div className="flex items-center gap-1">
                                  {/* MOVE UP / DOWN */}
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveWidget(idx, 'up')}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                                    title="Move widget up in role layout"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === widgetList.length - 1}
                                    onClick={() => handleMoveWidget(idx, 'down')}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                                    title="Move widget down in role layout"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* EDIT SETTINGS */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditWidget(w)}
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                    title="Edit widget label & span"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* REMOVE FROM ROLE LAYOUT */}
                                  <button
                                    type="button"
                                    disabled={w.removable === false}
                                    onClick={() => handleRemoveWidget(w)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title={w.removable === false ? 'Core clinical widget cannot be removed' : 'Remove from role layout'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          <strong>Role Isolation & Clinical Integrity:</strong> Modifying or removing widgets from this {selectedDashboardRole.toUpperCase()} layout only changes what this specific role sees. Underlying medical records, pharmacy inventory, doctor appointments, emergency QR triggers, and other roles&apos; dashboards remain fully protected.
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 6: SECURITY & POLICIES */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-500" /> Authentication & Institutional Security Policies
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage timeouts, 2FA requirements, emergency hotlines, and maintenance mode while protecting core RBAC rules.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRestoreDefaultSecurity}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Security Baseline</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Support / Escalation Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Support Hotline Telephone
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency SOS Hotlines
                  </label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Inactivity Session Timeout
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="15">15 Minutes (Strict Clinical)</option>
                    <option value="30">30 Minutes (Recommended)</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              {/* SECURITY MANDATES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Mandatory Two-Factor (2FA / OTP)</p>
                    <p className="text-[11px] text-slate-500">Mandate OTP verification on Doctor & Admin Logins</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Automated Email Notifications</p>
                    <p className="text-[11px] text-slate-500">Dispatch email notices for prescriptions & security alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                {isSuperAdmin && (
                  <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                    <div>
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-300">Global Platform Maintenance Mode (Super Admin Only)</p>
                      <p className="text-[11px] text-rose-600/80 dark:text-rose-400">Suspend non-administrative logins for emergency database migrations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Live UI Branding & Landing Configuration Preview
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* 1. BRANDING SIMULATION */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 font-mono">Header & Brand Simulation</h4>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                        {fullLogoSrc ? (
                          <img src={fullLogoSrc} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{appName}</p>
                        <p className="text-[10px] text-slate-400">{tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                        Primary Color
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. HERO SIMULATION */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 space-y-3 text-left border border-slate-700">
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {heroMediaType === 'image' ? (
                      <img src={heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <video src={heroVideoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    )}
                    <div className={`absolute inset-0 ${
                      heroOverlayStyle === 'dark'
                        ? 'bg-slate-950/75'
                        : heroOverlayStyle === 'light'
                        ? 'bg-slate-950/25'
                        : heroOverlayStyle === 'medium'
                        ? 'bg-slate-950/45'
                        : 'bg-slate-950/45 bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-transparent'
                    }`} />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-300">{heroBadge}</span>
                      {heroShowSosCard && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {heroSosCardTitle} • {heroSosCardSubtitle}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black">
                      {heroTitle} <span style={{ color: accentColor }}>{heroHighlightTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed">{heroSubtitle}</p>
                    <div className="flex items-center gap-3 pt-2">
                      <button type="button" className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                        {heroPrimaryCtaText}
                      </button>
                      <button type="button" className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20">
                        {heroSecondaryCtaText}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. FOOTER SIMULATION */}
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-300 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold">{appName}</span>
                    <span className="text-[11px] text-slate-400">{footerText}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{footerAboutText}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Close Preview
                </button>
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewModalOpen(false);
                      handlePublishLive();
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md cursor-pointer hover:bg-emerald-500"
                  >
                    Looks Good, Publish Live Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. CONFIRM DIALOG MODAL */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmModal.confirmVariant === 'danger'
                    ? 'bg-rose-500/10 text-rose-600'
                    : confirmModal.confirmVariant === 'warning'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-blue-500/10 text-blue-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer shadow-md transition-opacity ${
                    confirmModal.confirmVariant === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : confirmModal.confirmVariant === 'warning'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {confirmModal.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ANNOUNCEMENT CRUD MODAL */}
      <AnimatePresence>
        {annModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white capitalize">
                    {annModal.mode === 'create' ? 'Create Role Announcement' : annModal.mode === 'edit' ? 'Edit Announcement' : 'View Announcement'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAnnModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-left">
                {/* PREVIEW BANNER */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Live Role Preview Banner:</span>
                  <div className={`p-3.5 rounded-2xl border text-xs font-medium space-y-1 ${
                    annModal.type === 'alert'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                      : annModal.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                      : annModal.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-200'
                  }`}>
                    <div className="flex items-center gap-2 font-black">
                      <span className="capitalize">[{annModal.type.toUpperCase()}]</span>
                      <span>{annModal.title || 'Announcement Title'}</span>
                      {annModal.priority === 'urgent' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-mono uppercase">Urgent</span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90">{annModal.message || 'Announcement description message will appear here...'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Announcement Title</label>
                  <input
                    type="text"
                    disabled={annModal.mode === 'view'}
                    value={annModal.title}
                    onChange={(e) => setAnnModal((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. System Maintenance Notice"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Content</label>
                  <textarea
                    rows={3}
                    disabled={annModal.mode === 'view'}
                    value={annModal.message}
                    onChange={(e) => setAnnModal((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter full notice or briefing text..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Type</label>
                    <select
                      disabled={annModal.mode === 'view'}
                      value={annModal.type}
                      onChange={(e) => setAnnModal((prev) => ({ ...prev, type: e.target.value as any }))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white disabled:opacity-60"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="warning">Warning (Amber)</option>
                      <option value="success">Success (Emerald)</option>
                      <option value="alert">Critical Alert (Rose)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                    <select
                      disabled={annModal.mode === 'view'}
                      value={annModal.priority}
                      onChange={(e) => setAnnModal((prev) => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white disabled:opacity-60"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent (Flashing)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Display Start (Optional)</label>
                    <input
                      type="date"
                      disabled={annModal.mode === 'view'}
                      value={annModal.startDate ? annModal.startDate.slice(0, 10) : ''}
                      onChange={(e) => setAnnModal((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Display End (Optional)</label>
                    <input
                      type="date"
                      disabled={annModal.mode === 'view'}
                      value={annModal.endDate ? annModal.endDate.slice(0, 10) : ''}
                      onChange={(e) => setAnnModal((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Active Status</span>
                    <span className="text-[11px] text-slate-400">Enable or suppress immediately</span>
                  </div>
                  <input
                    type="checkbox"
                    disabled={annModal.mode === 'view'}
                    checked={annModal.enabled}
                    onChange={(e) => setAnnModal((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setAnnModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {annModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {annModal.mode !== 'view' && (
                  <button
                    type="button"
                    onClick={handleSaveAnnouncement}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    Save Announcement
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. WIDGET SETTINGS MODAL */}
      <AnimatePresence>
        {widgetModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  <span>Configure Widget View</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setWidgetModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Card Display Label
                </label>
                <input
                  type="text"
                  value={widgetModal.label}
                  onChange={(e) => setWidgetModal((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Column Span Layout
                </label>
                <select
                  value={widgetModal.colSpan}
                  onChange={(e) => setWidgetModal((prev) => ({ ...prev, colSpan: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="half">Half Width (50% Grid)</option>
                  <option value="full">Full Width (100% Span)</option>
                  <option value="third">One Third (33% Grid)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold">Enabled in this role&apos;s layout</span>
                <input
                  type="checkbox"
                  checked={widgetModal.enabled}
                  onChange={(e) => setWidgetModal((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setWidgetModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWidget}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. ADD WIDGET FROM CATALOG MODAL */}
      <AnimatePresence>
        {addWidgetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-left"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Add Widget from Catalog ({selectedDashboardRole.toUpperCase()})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAddWidgetModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-3">
                {(() => {
                  const roleCat = ROLE_WIDGET_CATALOGS[selectedDashboardRole] || [];
                  const curRoleWidgets = (dashboardsConfig as any)[selectedDashboardRole]?.widgetList || [];
                  const existingKeys = new Set(curRoleWidgets.map((w: any) => w.key));
                  const unadded = roleCat.filter((cat) => !existingKeys.has(cat.key));

                  if (unadded.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs font-bold text-slate-400">
                        All supported catalog widgets for {selectedDashboardRole.toUpperCase()} are already in the layout!
                      </div>
                    );
                  }

                  return unadded.map((catItem) => (
                    <div
                      key={catItem.key}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-black text-slate-900 dark:text-white">{catItem.label}</h5>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {catItem.colSpan}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{catItem.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddWidgetFromCatalog(catItem)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Layout</span>
                      </button>
                    </div>
                  ));
                })()}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setAddWidgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Close Catalog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. NAV ITEM CRUD MODAL */}
      <AnimatePresence>
        {navModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span>{navModal.mode === 'create' ? 'Add Navigation Link' : 'Edit Navigation Link'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setNavModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Menu Label
                </label>
                <input
                  type="text"
                  value={navModal.label}
                  onChange={(e) => setNavModal((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Teleconsultations"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target URL (Internal Path or https://...)
                </label>
                <input
                  type="text"
                  value={navModal.url}
                  onChange={(e) => {
                    const val = e.target.value;
                    const valErr = validateNavUrl(val);
                    setNavModal((prev) => ({
                      ...prev,
                      url: val,
                      urlError: valErr,
                    }));
                  }}
                  placeholder="/services or https://..."
                  className={`w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono ${
                    navModal.urlError
                      ? 'border-rose-500 text-rose-600'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {navModal.urlError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{navModal.urlError}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold block">Render as Mega Menu</span>
                  <span className="text-[11px] text-slate-400">Expands multi-column category dropdown</span>
                </div>
                <input
                  type="checkbox"
                  checked={navModal.isMega}
                  onChange={(e) => setNavModal((prev) => ({ ...prev, isMega: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold">Visible on Header</span>
                <input
                  type="checkbox"
                  checked={navModal.visible}
                  onChange={(e) => setNavModal((prev) => ({ ...prev, visible: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setNavModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNavItem}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ABOUT HIGHLIGHT MODAL */}
      <AnimatePresence>
        {highlightModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                  <span>{highlightModal.mode === 'create' ? 'Add Highlight Bullet' : 'Edit Highlight Bullet'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setHighlightModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Highlight Text
                </label>
                <input
                  type="text"
                  value={highlightModal.text}
                  onChange={(e) => setHighlightModal((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="e.g. 24/7 Digital Health Locker"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setHighlightModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveHighlight}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Highlight
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. SOCIAL LINK MODAL */}
      <AnimatePresence>
        {socialModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-500" />
                  <span>{socialModal.mode === 'create' ? 'Add Social Platform' : 'Edit Social Link'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setSocialModal((prev) => ({ ...prev, isOpen: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  disabled={socialModal.mode === 'edit'}
                  value={socialModal.platform}
                  onChange={(e) => setSocialModal((prev) => ({ ...prev, platform: e.target.value }))}
                  placeholder="e.g. YouTube, GitHub, Telegram"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Profile URL
                </label>
                <input
                  type="url"
                  value={socialModal.url}
                  onChange={(e) => setSocialModal((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSocialModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSocial}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Save Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

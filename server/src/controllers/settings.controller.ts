import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export const DEFAULT_BRANDING = {
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

export const DEFAULT_LANDING = {
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
    description: 'MediCare is an advanced digital personal health record (PHR) and caregiver companion platform committed to delivering secure medical record management, emergency SOS accessibility, and seamless doctor sharing with cutting-edge privacy and patient-centered technology.',
    highlights: [
      'Modern Infrastructure',
      'Advanced Medical Equipment',
      'Experienced Medical Professionals',
      '24/7 Emergency Services',
    ],
    learnMoreText: 'Learn More About Us',
    imageUrl: '/about-us-phr.jpg',
    secondaryImageUrl: '/about_us_healthcare.jpg',
    missionImageUrl: '/mission_3d_target.jpg',
    visionImageUrl: '/vision_3d_ecosystem.jpg',
    videoUrl: '/about_us_.mp4',
    videoPosterUrl: '/about-us-phr.jpg',
    videoTitle: 'See How MediCare Connects Healthcare',
    videoDescription: 'Discover how MediCare brings people, healthcare professionals, and essential healthcare services together in one connected ecosystem.',
    showVideo: true,
    galleryImages: [
      '/about-us-phr.jpg',
      '/about_us_healthcare.jpg',
      '/mission_3d_target.jpg',
      '/vision_3d_ecosystem.jpg'
    ],
  },
  features: {
    badge: 'COMPREHENSIVE DIGITAL HEALTHCARE',
    title: 'Cutting-Edge Features',
    subtitle: 'Everything you need to manage your personal health records, consult specialists, and coordinate clinical care in real time.',
  },
  cta: {
    title: 'Take Control of Your Health Today',
    subtitle: 'Join thousands of patients, doctors, and healthcare institutions across India using MediCare for seamless digital health management.',
    primaryButtonText: 'Create Your Account',
    secondaryButtonText: 'Explore Features',
  },
};

export const DEFAULT_HEADER = {
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

export const DEFAULT_FOOTER = {
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

export const DEFAULT_WIDGET_CATALOGS: Record<string, Array<{ key: string; label: string; description: string; colSpan: 'full' | 'half' | 'third'; removable: boolean }>> = {
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

function buildDefaultRoleConfig(
  role: string,
  defaultTitle: string,
  defaultMsg: string,
  defaultType: 'info' | 'warning' | 'success' | 'alert' = 'info'
) {
  const catalog = DEFAULT_WIDGET_CATALOGS[role] || [];
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
    type: defaultType,
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
}

export const DEFAULT_DASHBOARDS: Record<string, any> = {
  patient: buildDefaultRoleConfig('patient', 'Portal Notice', 'ABDM Health Locker integration is active and operating normally.'),
  doctor: buildDefaultRoleConfig('doctor', 'Clinical Notice', 'OPD and teleconsultation channels are synchronized.'),
  nurse: buildDefaultRoleConfig('nurse', 'Duty Notice', 'Clinical shift handovers and patient vitals telemetry operational.'),
  caregiver: buildDefaultRoleConfig('caregiver', 'Caregiver Update', 'Patient monitoring links and emergency SOS alerts active.'),
  pharmacist: buildDefaultRoleConfig('pharmacist', 'Dispensary Dispatch', 'Electronic prescription queue verified and processing orders.'),
  insurance: buildDefaultRoleConfig('insurance', 'TPA Clearinghouse', 'Cashless pre-authorization gateway synchronized with IRDAI rules.'),
  admin: buildDefaultRoleConfig('admin', 'Executive Briefing', 'Hospital information management node status: 100% operational.'),
  superAdmin: buildDefaultRoleConfig('superAdmin', 'Directorate Radar', 'Tier-1 ABDM Security Governance radar active with zero breaches.'),
};

export function normalizeDashboardsConfig(parsed: any): Record<string, any> {
  const normalized: Record<string, any> = {};
  const roleKeys = ['patient', 'doctor', 'nurse', 'caregiver', 'pharmacist', 'insurance', 'admin', 'superAdmin'];

  for (const role of roleKeys) {
    const defaultRole = DEFAULT_DASHBOARDS[role];
    const incomingRole = (parsed && typeof parsed === 'object') ? parsed[role] : null;

    if (!incomingRole) {
      normalized[role] = JSON.parse(JSON.stringify(defaultRole));
      continue;
    }

    // 1. Announcements normalization
    let announcements: any[] = Array.isArray(incomingRole.announcements) ? [...incomingRole.announcements] : [];
    if (announcements.length === 0 && incomingRole.announcement && incomingRole.announcement.message) {
      announcements = [{
        id: incomingRole.announcement.id || `ann-${role}-${Date.now()}`,
        title: incomingRole.announcement.title || defaultRole.announcement.title,
        message: incomingRole.announcement.message,
        type: incomingRole.announcement.type || 'info',
        priority: incomingRole.announcement.priority || 'normal',
        enabled: Boolean(incomingRole.announcement.enabled),
        startDate: incomingRole.announcement.startDate || null,
        endDate: incomingRole.announcement.endDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
    } else if (announcements.length === 0) {
      announcements = JSON.parse(JSON.stringify(defaultRole.announcements));
    }

    // Active announcement synchronization
    const activeAnn = announcements.find((a: any) => Boolean(a.enabled)) || announcements[0] || defaultRole.announcement;
    const announcement = {
      id: activeAnn?.id || `ann-${role}-default`,
      title: activeAnn?.title || '',
      message: activeAnn?.message || '',
      type: activeAnn?.type || 'info',
      priority: activeAnn?.priority || 'normal',
      enabled: Boolean(activeAnn?.enabled),
      startDate: activeAnn?.startDate || null,
      endDate: activeAnn?.endDate || null,
    };

    // 2. Widgets normalization
    const incomingWidgets = incomingRole.widgets || {};
    const catalog = DEFAULT_WIDGET_CATALOGS[role] || [];
    let widgetList: any[] = Array.isArray(incomingRole.widgetList) ? [...incomingRole.widgetList] : [];

    if (widgetList.length === 0) {
      widgetList = catalog.map((catItem, idx) => ({
        key: catItem.key,
        label: catItem.label,
        description: catItem.description,
        enabled: incomingWidgets[catItem.key] !== undefined ? Boolean(incomingWidgets[catItem.key]) : true,
        colSpan: catItem.colSpan,
        order: idx + 1,
        removable: catItem.removable,
      }));
    }

    // Build synchronized widgets boolean map
    const widgetsRecord: Record<string, boolean> = { ...incomingWidgets };
    widgetList.forEach(w => {
      widgetsRecord[w.key] = Boolean(w.enabled);
    });

    normalized[role] = {
      ...incomingRole,
      announcement,
      announcements,
      widgets: widgetsRecord,
      widgetList,
    };
  }

  return normalized;
}

export const DEFAULT_RBAC_MATRIX: Record<string, Record<string, boolean>> = {
  'View Patient Records': { Patient: true, Doctor: true, Nurse: true, Pharmacist: false, Caregiver: true, Insurance: false, Admin: true, 'Super Admin': true },
  'Edit Medical Records': { Patient: false, Doctor: true, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
  'Create Prescription': { Patient: false, Doctor: true, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
  'Dispense Medicines': { Patient: false, Doctor: false, Nurse: false, Pharmacist: true, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
  'Record Patient Vitals': { Patient: true, Doctor: true, Nurse: true, Pharmacist: false, Caregiver: true, Insurance: false, Admin: false, 'Super Admin': true },
  'Approve Insurance Claims': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: true, Admin: false, 'Super Admin': true },
  'Manage User Accounts': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: true, 'Super Admin': true },
  'Manage Administrator Roles': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
  'Configure Security & Firewalls': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
  'View Audit & Activity Logs': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: true, 'Super Admin': true },
  'Trigger System Backup': { Patient: false, Doctor: false, Nurse: false, Pharmacist: false, Caregiver: false, Insurance: false, Admin: false, 'Super Admin': true },
};

function safeJsonParse<T = any>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

/**
 * Helper to ensure a baseline system setting record exists
 */
async function getOrCreateSystemSetting() {
  let settings = await prisma.systemSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.systemSetting.create({
      data: {
        id: 'default',
        hospitalName: DEFAULT_BRANDING.appName,
        tagline: DEFAULT_BRANDING.tagline,
        logoUrl: null,
        supportEmail: 'support@dhr-medicare.in',
        supportPhone: '+91 98400 12345',
        emergencyPhone: '108 / 112',
        sessionTimeout: 30,
        mfaEnforced: true,
        emailAlerts: true,
        smsAlerts: false,
        maintenanceMode: false,
        footerText: DEFAULT_FOOTER.footerText,
        brandColors: JSON.stringify({ primary: DEFAULT_BRANDING.primaryColor, accent: DEFAULT_BRANDING.accentColor, themeMode: DEFAULT_BRANDING.themeMode }),
        loginBranding: JSON.stringify({ title: DEFAULT_BRANDING.loginTitle, subtitle: DEFAULT_BRANDING.loginSubtitle }),
        landingConfig: JSON.stringify(DEFAULT_LANDING),
        headerConfig: JSON.stringify(DEFAULT_HEADER),
        footerConfig: JSON.stringify(DEFAULT_FOOTER),
        dashboardsConfig: JSON.stringify(DEFAULT_DASHBOARDS),
        rbacMatrix: JSON.stringify(DEFAULT_RBAC_MATRIX),
        draftConfig: null,
        isPublished: true,
      },
    });
  }

  return settings;
}

/**
 * Public API: Get active/published system settings & frontend configuration
 */
export const getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = await getOrCreateSystemSetting();

    const brandColors = safeJsonParse(raw.brandColors, { primary: DEFAULT_BRANDING.primaryColor, accent: DEFAULT_BRANDING.accentColor, themeMode: DEFAULT_BRANDING.themeMode });
    const loginBranding = safeJsonParse(raw.loginBranding, { title: DEFAULT_BRANDING.loginTitle, subtitle: DEFAULT_BRANDING.loginSubtitle });
    const landing = safeJsonParse(raw.landingConfig, DEFAULT_LANDING);
    const header = safeJsonParse(raw.headerConfig, DEFAULT_HEADER);
    const footer = safeJsonParse(raw.footerConfig, DEFAULT_FOOTER);
    const dashboards = normalizeDashboardsConfig(safeJsonParse(raw.dashboardsConfig, DEFAULT_DASHBOARDS));

    res.status(200).json({
      success: true,
      data: {
        id: raw.id,
        hospitalName: raw.hospitalName,
        logoUrl: raw.logoUrl,
        tagline: raw.tagline || DEFAULT_BRANDING.tagline,
        supportEmail: raw.supportEmail,
        supportPhone: raw.supportPhone,
        emergencyPhone: raw.emergencyPhone,
        sessionTimeout: raw.sessionTimeout,
        maintenanceMode: raw.maintenanceMode,
        footerText: raw.footerText || DEFAULT_FOOTER.footerText,
        isPublished: raw.isPublished,
        publishedAt: raw.publishedAt,
        branding: {
          appName: raw.hospitalName,
          tagline: raw.tagline || DEFAULT_BRANDING.tagline,
          logoUrl: raw.logoUrl,
          primaryColor: brandColors.primary || DEFAULT_BRANDING.primaryColor,
          accentColor: brandColors.accent || DEFAULT_BRANDING.accentColor,
          themeMode: brandColors.themeMode || DEFAULT_BRANDING.themeMode,
          loginTitle: loginBranding.title || DEFAULT_BRANDING.loginTitle,
          loginSubtitle: loginBranding.subtitle || DEFAULT_BRANDING.loginSubtitle,
        },
        landing,
        header,
        footer,
        dashboards,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Administrative API: Get full configuration including draft state
 */
export const getAdminSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = await getOrCreateSystemSetting();

    const brandColors = safeJsonParse(raw.brandColors, { primary: DEFAULT_BRANDING.primaryColor, accent: DEFAULT_BRANDING.accentColor, themeMode: DEFAULT_BRANDING.themeMode });
    const loginBranding = safeJsonParse(raw.loginBranding, { title: DEFAULT_BRANDING.loginTitle, subtitle: DEFAULT_BRANDING.loginSubtitle });
    const landing = safeJsonParse(raw.landingConfig, DEFAULT_LANDING);
    const header = safeJsonParse(raw.headerConfig, DEFAULT_HEADER);
    const footer = safeJsonParse(raw.footerConfig, DEFAULT_FOOTER);
    const dashboards = normalizeDashboardsConfig(safeJsonParse(raw.dashboardsConfig, DEFAULT_DASHBOARDS));
    const draft = safeJsonParse(raw.draftConfig, null);
    const rbacMatrix = safeJsonParse(raw.rbacMatrix, DEFAULT_RBAC_MATRIX);

    res.status(200).json({
      success: true,
      data: {
        id: raw.id,
        hospitalName: raw.hospitalName,
        logoUrl: raw.logoUrl,
        tagline: raw.tagline || DEFAULT_BRANDING.tagline,
        supportEmail: raw.supportEmail,
        supportPhone: raw.supportPhone,
        emergencyPhone: raw.emergencyPhone,
        sessionTimeout: raw.sessionTimeout,
        mfaEnforced: raw.mfaEnforced,
        emailAlerts: raw.emailAlerts,
        smsAlerts: raw.smsAlerts,
        maintenanceMode: raw.maintenanceMode,
        footerText: raw.footerText || DEFAULT_FOOTER.footerText,
        isPublished: raw.isPublished,
        publishedAt: raw.publishedAt,
        publishedBy: raw.publishedBy,
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy,
        branding: {
          appName: raw.hospitalName,
          tagline: raw.tagline || DEFAULT_BRANDING.tagline,
          logoUrl: raw.logoUrl,
          primaryColor: brandColors.primary || DEFAULT_BRANDING.primaryColor,
          accentColor: brandColors.accent || DEFAULT_BRANDING.accentColor,
          themeMode: brandColors.themeMode || DEFAULT_BRANDING.themeMode,
          loginTitle: loginBranding.title || DEFAULT_BRANDING.loginTitle,
          loginSubtitle: loginBranding.subtitle || DEFAULT_BRANDING.loginSubtitle,
        },
        landing,
        header,
        footer,
        dashboards,
        draft,
        rbacMatrix,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update system settings (Admin & Super Admin)
 * Super Admin can publish directly; Admin updates save as Draft.
 */
export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const {
      hospitalName,
      tagline,
      logoUrl,
      supportEmail,
      supportPhone,
      emergencyPhone,
      sessionTimeout,
      mfaEnforced,
      emailAlerts,
      smsAlerts,
      maintenanceMode,
      footerText,
      branding,
      landing,
      header,
      footer,
      dashboards,
      publish = false,
      asDraft = false,
    } = req.body;

    if (publish && !isSuperAdmin) {
      res.status(403).json({
        success: false,
        message: 'Only Super Administrators are authorized to publish global live frontend configurations.',
      });
      return;
    }

    if (maintenanceMode !== undefined && !isSuperAdmin) {
      res.status(403).json({
        success: false,
        message: 'Only Super Administrators are authorized to modify global maintenance mode.',
      });
      return;
    }

    const currentSetting = await getOrCreateSystemSetting();
    const updaterIdentifier = req.user?.id || req.user?.email || 'ADMIN';

    // Merge dashboards per role to ensure saving one role never touches other roles
    const existingDashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    let mergedDashboards = { ...existingDashboards };
    if (dashboards && typeof dashboards === 'object') {
      for (const roleKey of Object.keys(dashboards)) {
        mergedDashboards[roleKey] = {
          ...(existingDashboards[roleKey] || {}),
          ...(dashboards[roleKey] || {}),
        };
      }
    }

    // If saving as Draft or if user is ordinary Admin not publishing
    if (asDraft || (!publish && !isSuperAdmin)) {
      const existingDraft = safeJsonParse<any>(currentSetting.draftConfig, {});
      let draftDashboards = existingDraft.dashboards ? { ...existingDraft.dashboards } : { ...existingDashboards };
      if (dashboards && typeof dashboards === 'object') {
        for (const roleKey of Object.keys(dashboards)) {
          draftDashboards[roleKey] = {
            ...(draftDashboards[roleKey] || {}),
            ...(dashboards[roleKey] || {}),
          };
        }
      }

      const newDraft = {
        ...existingDraft,
        hospitalName: hospitalName !== undefined ? String(hospitalName).trim() : (existingDraft.hospitalName ?? currentSetting.hospitalName),
        tagline: tagline !== undefined ? String(tagline).trim() : (existingDraft.tagline ?? currentSetting.tagline),
        logoUrl: logoUrl !== undefined ? (logoUrl ? String(logoUrl).trim() : null) : (existingDraft.logoUrl ?? currentSetting.logoUrl),
        supportEmail: supportEmail !== undefined ? String(supportEmail).trim() : (existingDraft.supportEmail ?? currentSetting.supportEmail),
        supportPhone: supportPhone !== undefined ? (supportPhone ? String(supportPhone).trim() : null) : (existingDraft.supportPhone ?? currentSetting.supportPhone),
        emergencyPhone: emergencyPhone !== undefined ? (emergencyPhone ? String(emergencyPhone).trim() : null) : (existingDraft.emergencyPhone ?? currentSetting.emergencyPhone),
        footerText: footerText !== undefined ? (footerText ? String(footerText).trim() : null) : (existingDraft.footerText ?? currentSetting.footerText),
        branding: branding ? { ...(existingDraft.branding || {}), ...branding } : existingDraft.branding,
        landing: landing ? {
          ...(existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)),
          ...landing,
          sectionsVisibility: {
            ...((existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)).sectionsVisibility || {}),
            ...(landing.sectionsVisibility || {}),
          },
          hero: {
            ...((existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)).hero || DEFAULT_LANDING.hero),
            ...(landing.hero || {}),
          },
          about: {
            ...((existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)).about || DEFAULT_LANDING.about),
            ...(landing.about || {}),
          },
          features: {
            ...((existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)).features || DEFAULT_LANDING.features),
            ...(landing.features || {}),
          },
          cta: {
            ...((existingDraft.landing || safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING)).cta || DEFAULT_LANDING.cta),
            ...(landing.cta || {}),
          },
        } : existingDraft.landing,
        header: header ? { ...(existingDraft.header || {}), ...header } : existingDraft.header,
        footer: footer ? { ...(existingDraft.footer || {}), ...footer } : existingDraft.footer,
        dashboards: dashboards ? draftDashboards : existingDraft.dashboards,
        savedAt: new Date().toISOString(),
        savedBy: updaterIdentifier,
      };

      const updated = await prisma.systemSetting.update({
        where: { id: 'default' },
        data: {
          draftConfig: JSON.stringify(newDraft),
          updatedBy: updaterIdentifier,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Configuration draft saved successfully. Ready for Super Admin preview & publication.',
        data: updated,
      });
      return;
    }

    // Direct publish / Super Admin update
    const updatePayload: Record<string, any> = {
      updatedBy: updaterIdentifier,
    };

    if (hospitalName !== undefined) updatePayload.hospitalName = String(hospitalName).trim();
    if (tagline !== undefined) updatePayload.tagline = String(tagline).trim();
    if (logoUrl !== undefined) updatePayload.logoUrl = logoUrl ? String(logoUrl).trim() : null;
    if (supportEmail !== undefined) updatePayload.supportEmail = String(supportEmail).trim();
    if (supportPhone !== undefined) updatePayload.supportPhone = supportPhone ? String(supportPhone).trim() : null;
    if (emergencyPhone !== undefined) updatePayload.emergencyPhone = emergencyPhone ? String(emergencyPhone).trim() : null;
    if (sessionTimeout !== undefined) updatePayload.sessionTimeout = Math.max(5, Math.min(1440, Number(sessionTimeout) || 30));
    if (mfaEnforced !== undefined) updatePayload.mfaEnforced = Boolean(mfaEnforced);
    if (emailAlerts !== undefined) updatePayload.emailAlerts = Boolean(emailAlerts);
    if (smsAlerts !== undefined) updatePayload.smsAlerts = Boolean(smsAlerts);
    if (maintenanceMode !== undefined && isSuperAdmin) updatePayload.maintenanceMode = Boolean(maintenanceMode);
    if (footerText !== undefined) updatePayload.footerText = footerText ? String(footerText).trim() : null;

    if (branding !== undefined) {
      const currentBrand = safeJsonParse(currentSetting.brandColors, { primary: DEFAULT_BRANDING.primaryColor, accent: DEFAULT_BRANDING.accentColor, themeMode: DEFAULT_BRANDING.themeMode });
      const currentLogin = safeJsonParse(currentSetting.loginBranding, { title: DEFAULT_BRANDING.loginTitle, subtitle: DEFAULT_BRANDING.loginSubtitle });

      updatePayload.brandColors = JSON.stringify({
        primary: branding.primaryColor || currentBrand.primary,
        accent: branding.accentColor || currentBrand.accent,
        themeMode: branding.themeMode || currentBrand.themeMode,
      });

      updatePayload.loginBranding = JSON.stringify({
        title: branding.loginTitle || currentLogin.title,
        subtitle: branding.loginSubtitle || currentLogin.subtitle,
      });

      if (branding.appName) updatePayload.hospitalName = branding.appName;
      if (branding.tagline) updatePayload.tagline = branding.tagline;
      if (branding.logoUrl !== undefined) updatePayload.logoUrl = branding.logoUrl;
    }

    if (landing !== undefined) {
      const currentLanding = safeJsonParse(currentSetting.landingConfig, DEFAULT_LANDING);
      const mergedLanding = {
        ...currentLanding,
        ...landing,
        sectionsVisibility: {
          ...(currentLanding.sectionsVisibility || {}),
          ...(landing.sectionsVisibility || {}),
        },
        hero: {
          ...(currentLanding.hero || DEFAULT_LANDING.hero),
          ...(landing.hero || {}),
        },
        about: {
          ...(currentLanding.about || DEFAULT_LANDING.about),
          ...(landing.about || {}),
        },
        features: {
          ...(currentLanding.features || DEFAULT_LANDING.features),
          ...(landing.features || {}),
        },
        cta: {
          ...(currentLanding.cta || DEFAULT_LANDING.cta),
          ...(landing.cta || {}),
        },
      };
      updatePayload.landingConfig = JSON.stringify(mergedLanding);
    }

    if (header !== undefined) {
      updatePayload.headerConfig = JSON.stringify(header);
    }

    if (footer !== undefined) {
      updatePayload.footerConfig = JSON.stringify(footer);
    }

    if (dashboards !== undefined) {
      updatePayload.dashboardsConfig = JSON.stringify(mergedDashboards);
    }

    if (publish) {
      updatePayload.isPublished = true;
      updatePayload.publishedAt = new Date();
      updatePayload.publishedBy = updaterIdentifier;
      updatePayload.draftConfig = null; // Clear published draft
    }

    const settings = await prisma.systemSetting.update({
      where: { id: 'default' },
      data: updatePayload,
    });

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || 'SYSTEM',
          action: publish ? 'PUBLISH_SYSTEM_CONFIGURATION' : 'UPDATE_SYSTEM_SETTINGS',
          entityType: 'SYSTEM_SETTINGS',
          entityId: 'default',
          details: JSON.stringify({
            published: Boolean(publish),
            updatedFields: Object.keys(updatePayload).filter(k => k !== 'updatedBy'),
            role: req.user?.role,
          }),
          ipAddress: req.ip || '127.0.0.1',
        },
      });
    } catch (auditErr) {
      console.warn('Failed to record settings audit log:', auditErr);
    }

    res.status(200).json({
      success: true,
      message: publish ? 'Platform configuration published successfully to live frontend!' : 'System settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish current Draft configuration to Live Frontend (Super Admin Only)
 */
export const publishDraftSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = await getOrCreateSystemSetting();
    const draft = safeJsonParse<any>(raw.draftConfig, null);

    if (!draft) {
      res.status(400).json({
        success: false,
        message: 'No unpublished draft configuration found to publish.',
      });
      return;
    }

    const updaterIdentifier = req.user?.id || req.user?.email || 'SUPER_ADMIN';
    const updatePayload: Record<string, any> = {
      isPublished: true,
      publishedAt: new Date(),
      publishedBy: updaterIdentifier,
      updatedBy: updaterIdentifier,
      draftConfig: null,
    };

    if (draft.hospitalName) updatePayload.hospitalName = draft.hospitalName;
    if (draft.tagline) updatePayload.tagline = draft.tagline;
    if (draft.logoUrl !== undefined) updatePayload.logoUrl = draft.logoUrl;
    if (draft.supportEmail) updatePayload.supportEmail = draft.supportEmail;
    if (draft.supportPhone !== undefined) updatePayload.supportPhone = draft.supportPhone;
    if (draft.emergencyPhone !== undefined) updatePayload.emergencyPhone = draft.emergencyPhone;
    if (draft.footerText !== undefined) updatePayload.footerText = draft.footerText;

    if (draft.branding) {
      updatePayload.brandColors = JSON.stringify({
        primary: draft.branding.primaryColor || DEFAULT_BRANDING.primaryColor,
        accent: draft.branding.accentColor || DEFAULT_BRANDING.accentColor,
        themeMode: draft.branding.themeMode || DEFAULT_BRANDING.themeMode,
      });
      updatePayload.loginBranding = JSON.stringify({
        title: draft.branding.loginTitle || DEFAULT_BRANDING.loginTitle,
        subtitle: draft.branding.loginSubtitle || DEFAULT_BRANDING.loginSubtitle,
      });
      if (draft.branding.appName) updatePayload.hospitalName = draft.branding.appName;
      if (draft.branding.tagline) updatePayload.tagline = draft.branding.tagline;
      if (draft.branding.logoUrl !== undefined) updatePayload.logoUrl = draft.branding.logoUrl;
    }

    if (draft.landing) updatePayload.landingConfig = JSON.stringify(draft.landing);
    if (draft.header) updatePayload.headerConfig = JSON.stringify(draft.header);
    if (draft.footer) updatePayload.footerConfig = JSON.stringify(draft.footer);
    if (draft.dashboards) updatePayload.dashboardsConfig = JSON.stringify(draft.dashboards);

    const updated = await prisma.systemSetting.update({
      where: { id: 'default' },
      data: updatePayload,
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || 'SYSTEM',
          action: 'PUBLISH_DRAFT_CONFIGURATION',
          entityType: 'SYSTEM_SETTINGS',
          entityId: 'default',
          details: JSON.stringify({
            publishedBy: updaterIdentifier,
            publishedAt: new Date().toISOString(),
          }),
          ipAddress: req.ip || '127.0.0.1',
        },
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: 'Draft configuration successfully published to live frontend.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset platform configuration to pristine defaults (Super Admin Only)
 */
export const resetSettingsToDefault = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updaterIdentifier = req.user?.id || req.user?.email || 'SUPER_ADMIN';

    const updated = await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        hospitalName: DEFAULT_BRANDING.appName,
        tagline: DEFAULT_BRANDING.tagline,
        logoUrl: null,
        supportEmail: 'support@dhr-medicare.in',
        supportPhone: '+91 98400 12345',
        emergencyPhone: '108 / 112',
        sessionTimeout: 30,
        mfaEnforced: true,
        emailAlerts: true,
        smsAlerts: false,
        maintenanceMode: false,
        footerText: DEFAULT_FOOTER.footerText,
        brandColors: JSON.stringify({ primary: DEFAULT_BRANDING.primaryColor, accent: DEFAULT_BRANDING.accentColor, themeMode: DEFAULT_BRANDING.themeMode }),
        loginBranding: JSON.stringify({ title: DEFAULT_BRANDING.loginTitle, subtitle: DEFAULT_BRANDING.loginSubtitle }),
        landingConfig: JSON.stringify(DEFAULT_LANDING),
        headerConfig: JSON.stringify(DEFAULT_HEADER),
        footerConfig: JSON.stringify(DEFAULT_FOOTER),
        dashboardsConfig: JSON.stringify(DEFAULT_DASHBOARDS),
        rbacMatrix: JSON.stringify(DEFAULT_RBAC_MATRIX),
        draftConfig: null,
        isPublished: true,
        publishedAt: new Date(),
        publishedBy: updaterIdentifier,
        updatedBy: updaterIdentifier,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Platform configuration restored to pristine system defaults.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get RBAC Matrix persisted in MySQL
 */
export const getRbacMatrix = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = await getOrCreateSystemSetting();
    const matrix = safeJsonParse(raw.rbacMatrix, DEFAULT_RBAC_MATRIX);

    res.status(200).json({
      success: true,
      data: matrix,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update RBAC Matrix in MySQL (Super Admin Only)
 */
export const updateRbacMatrix = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { matrix } = req.body;
    if (!matrix || typeof matrix !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Valid matrix object is required.',
      });
      return;
    }

    const updaterIdentifier = req.user?.id || req.user?.email || 'SUPER_ADMIN';

    const updated = await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        rbacMatrix: JSON.stringify(matrix),
        updatedBy: updaterIdentifier,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user?.id || 'SYSTEM',
          action: 'UPDATE_RBAC_MATRIX',
          entityType: 'RBAC_MATRIX',
          entityId: 'default',
          details: JSON.stringify({
            updatedBy: updaterIdentifier,
            matrixKeys: Object.keys(matrix),
          }),
          ipAddress: req.ip || '127.0.0.1',
        },
      });
    } catch {}

    res.status(200).json({
      success: true,
      message: 'RBAC Access Matrix persisted successfully in MySQL database.',
      data: safeJsonParse(updated.rbacMatrix, DEFAULT_RBAC_MATRIX),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new announcement for a role dashboard
 */
export const createRoleAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');
    const { title, message, type = 'info', priority = 'normal', enabled = false, startDate, endDate } = req.body;

    if (!role || !message) {
      res.status(400).json({ success: false, message: 'Role and announcement message are required.' });
      return;
    }

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const roleConfig = dashboards[role] || buildDefaultRoleConfig(role, 'Notice', '');

    const newId = `ann-${role}-${Date.now()}`;
    const newAnn = {
      id: newId,
      title: title ? String(title).trim() : 'System Notice',
      message: String(message).trim(),
      type: ['info', 'warning', 'success', 'alert'].includes(type) ? type : 'info',
      priority: ['low', 'normal', 'high', 'urgent'].includes(priority) ? priority : 'normal',
      enabled: Boolean(enabled),
      startDate: startDate || null,
      endDate: endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newAnn.enabled) {
      // Deactivate other announcements for this role to maintain single active banner
      roleConfig.announcements = (roleConfig.announcements || []).map((a: any) => ({ ...a, enabled: false }));
      roleConfig.announcements.unshift(newAnn);
      roleConfig.announcement = { ...newAnn };
    } else {
      roleConfig.announcements = [newAnn, ...(roleConfig.announcements || [])];
    }

    dashboards[role] = roleConfig;

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully.',
      data: roleConfig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing announcement
 */
export const updateRoleAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');
    const id = String(req.params.id || '');
    const { title, message, type, priority, enabled, startDate, endDate } = req.body;

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const roleConfig = dashboards[role];

    if (!roleConfig) {
      res.status(404).json({ success: false, message: `Role ${role} not found.` });
      return;
    }

    const annIndex = (roleConfig.announcements || []).findIndex((a: any) => a.id === id);
    if (annIndex === -1) {
      res.status(404).json({ success: false, message: 'Announcement not found.' });
      return;
    }

    const existing = roleConfig.announcements[annIndex];
    const isNowEnabled = enabled !== undefined ? Boolean(enabled) : existing.enabled;

    if (isNowEnabled) {
      roleConfig.announcements = roleConfig.announcements.map((a: any) => ({ ...a, enabled: false }));
    }

    const updatedAnn = {
      ...existing,
      title: title !== undefined ? String(title).trim() : existing.title,
      message: message !== undefined ? String(message).trim() : existing.message,
      type: type !== undefined ? type : existing.type,
      priority: priority !== undefined ? priority : existing.priority,
      enabled: isNowEnabled,
      startDate: startDate !== undefined ? startDate : existing.startDate,
      endDate: endDate !== undefined ? endDate : existing.endDate,
      updatedAt: new Date().toISOString(),
    };

    roleConfig.announcements[annIndex] = updatedAnn;

    // Synchronize active announcement
    const active = roleConfig.announcements.find((a: any) => Boolean(a.enabled));
    roleConfig.announcement = active || {
      id: `ann-${role}-default`,
      title: '',
      message: '',
      type: 'info',
      priority: 'normal',
      enabled: false,
    };

    dashboards[role] = roleConfig;

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully.',
      data: roleConfig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an announcement
 */
export const deleteRoleAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');
    const id = String(req.params.id || '');

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const roleConfig = dashboards[role];

    if (!roleConfig) {
      res.status(404).json({ success: false, message: `Role ${role} not found.` });
      return;
    }

    roleConfig.announcements = (roleConfig.announcements || []).filter((a: any) => a.id !== id);

    // If remaining announcements have none active, set banner to inactive
    const active = roleConfig.announcements.find((a: any) => Boolean(a.enabled));
    roleConfig.announcement = active || {
      id: `ann-${role}-default`,
      title: '',
      message: '',
      type: 'info',
      priority: 'normal',
      enabled: false,
    };

    dashboards[role] = roleConfig;

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.',
      data: roleConfig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle activation state of an announcement
 */
export const toggleRoleAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');
    const id = String(req.params.id || '');

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const roleConfig = dashboards[role];

    if (!roleConfig) {
      res.status(404).json({ success: false, message: `Role ${role} not found.` });
      return;
    }

    const ann = (roleConfig.announcements || []).find((a: any) => a.id === id);
    if (!ann) {
      res.status(404).json({ success: false, message: 'Announcement not found.' });
      return;
    }

    const willBeEnabled = !ann.enabled;
    if (willBeEnabled) {
      roleConfig.announcements = (roleConfig.announcements || []).map((a: any) => ({
        ...a,
        enabled: a.id === id,
      }));
      roleConfig.announcement = { ...ann, enabled: true };
    } else {
      ann.enabled = false;
      roleConfig.announcement = {
        id: `ann-${role}-default`,
        title: '',
        message: '',
        type: 'info',
        priority: 'normal',
        enabled: false,
      };
    }

    dashboards[role] = roleConfig;

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(200).json({
      success: true,
      message: `Announcement ${willBeEnabled ? 'activated' : 'deactivated'} successfully.`,
      data: roleConfig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update widgets layout and visibility for a specific role
 */
export const updateRoleWidgets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');
    const { widgets, widgetList } = req.body;

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const roleConfig = dashboards[role];

    if (!roleConfig) {
      res.status(404).json({ success: false, message: `Role ${role} not found.` });
      return;
    }

    const catalog = (DEFAULT_WIDGET_CATALOGS as Record<string, any[]>)[role] || [];
    const allowedKeys = new Set(catalog.map((c: any) => c.key));

    if (Array.isArray(widgetList)) {
      // Validate that widget keys are part of the catalog
      const validatedList = widgetList.filter((w: any) => allowedKeys.has(w.key));
      roleConfig.widgetList = validatedList;

      // Synchronize widgets boolean map
      const widgetsRecord: Record<string, boolean> = {};
      validatedList.forEach((w: any) => {
        widgetsRecord[w.key] = Boolean(w.enabled);
      });
      roleConfig.widgets = widgetsRecord;
    } else if (widgets && typeof widgets === 'object') {
      const widgetsRecord: Record<string, boolean> = {};
      for (const key of Object.keys(widgets)) {
        if (allowedKeys.has(key)) {
          widgetsRecord[key] = Boolean(widgets[key]);
        }
      }
      roleConfig.widgets = widgetsRecord;
      if (Array.isArray(roleConfig.widgetList)) {
        roleConfig.widgetList = roleConfig.widgetList.map((w: any) => ({
          ...w,
          enabled: widgetsRecord[w.key] !== undefined ? widgetsRecord[w.key] : w.enabled,
        }));
      }
    }

    dashboards[role] = roleConfig;

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(200).json({
      success: true,
      message: `Widgets for ${role} updated successfully.`,
      data: roleConfig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset widgets layout to pristine defaults for a specific role
 */
export const resetRoleWidgets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const role = String(req.params.role || '');

    const currentSetting = await getOrCreateSystemSetting();
    const dashboards = normalizeDashboardsConfig(safeJsonParse(currentSetting.dashboardsConfig, DEFAULT_DASHBOARDS));
    const defaultRole = (DEFAULT_DASHBOARDS as Record<string, any>)[role];

    if (!defaultRole) {
      res.status(404).json({ success: false, message: `Role ${role} not found.` });
      return;
    }

    dashboards[role] = {
      ...(dashboards[role] || {}),
      widgets: JSON.parse(JSON.stringify(defaultRole.widgets)),
      widgetList: JSON.parse(JSON.stringify(defaultRole.widgetList)),
    };

    await prisma.systemSetting.update({
      where: { id: 'default' },
      data: {
        dashboardsConfig: JSON.stringify(dashboards),
        updatedBy: req.user?.id || req.user?.email || 'ADMIN',
      },
    });

    res.status(200).json({
      success: true,
      message: `Widgets for ${role} restored to pristine defaults.`,
      data: dashboards[role],
    });
  } catch (error) {
    next(error);
  }
};

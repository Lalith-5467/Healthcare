import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { LanguageProvider } from './context/LanguageContext';
import { GlobalToastManager } from './components/common/GlobalToastManager';
import { Header } from './components/landing/Header';
import { Hero } from './components/landing/Hero';
import { AboutHospital } from './components/landing/AboutHospital';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { DoctorSection } from './components/landing/DoctorSection';
import { ABHASection } from './components/landing/ABHASection';
import { PartnerLoopSection } from './components/landing/PartnerLoopSection';
import { FinalCTA } from './components/landing/FinalCTA';
import { Footer } from './components/landing/Footer';
import { AboutUsPage } from './pages/AboutUsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PharmacistDashboardPage } from './pages/PharmacistDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { NurseDashboardPage } from './pages/NurseDashboardPage';
import { InsuranceDashboardPage } from './pages/InsuranceDashboardPage';
import { CaregiverDashboardPage } from './pages/CaregiverDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

import { ABHAModal } from './components/modals/ABHAModal';
import { ConsentModal } from './components/modals/ConsentModal';
import { EmergencyQRModal } from './components/modals/EmergencyQRModal';
import { AuthModal } from './components/modals/AuthModal';
import { authApi } from './services/dhrApis';
import { clearAuthToken } from './services/apiClient';
import { socketService } from './services/socketService';
import { showGlobalToast } from './components/common/GlobalToastManager';
import { GlobalNotificationListener } from './components/common/GlobalNotificationListener';
import { useSiteConfig } from './context/ConfigContext';

const NAV_MAP: Record<string, string> = {
  'family-connect': 'family',
  'family': 'family',
  'video-consultation': 'consultation',
  'consultation': 'consultation',
  'health-analytics': 'analytics',
  'analytics': 'analytics',
  'health-checkup': 'checkup',
  'checkup': 'checkup',
  'nearby-hospitals': 'hospitals',
  'hospitals': 'hospitals',
  'insurance': 'insurance',
  'more-features': 'more-features',
  'emergency-sos': 'emergency',
  'emergency': 'emergency',
  'sos': 'emergency',
  'abha': 'abha',
  'doctors': 'appointments',
  'services': 'dashboard',
  'features': 'dashboard',
  'about': 'about',
  'settings': 'settings',
  'system-config': 'system-config',
  'ai-assistant': 'ai-assistant',
  'assistant': 'ai-assistant',
  'notifications': 'notifications',
  'notification': 'notifications',
  'reminder': 'reminders',
  'reminders': 'reminders',
  'appointment': 'appointments',
  'appointments': 'appointments',
  'medicine': 'medicines',
  'medicines': 'medicines',
  'pharmacy': 'pharmacy',
  'profile': 'profile',
  'records': 'records',
  'scan': 'scan',
  'dashboard': 'dashboard',
  'orders': 'orders',
  'prescriptions': 'prescriptions',
  'patients': 'patients',
  'lab-tests': 'lab-test',
  'lab-test': 'lab-test',
  'diet-plans': 'diet-plan',
  'diet-plan': 'diet-plan',
  'insights': 'report-insights',
  'report-insights': 'report-insights',
  'nurse-booking': 'nurse-booking',
  'caregiver-booking': 'caregiver-booking',
  'janitor-booking': 'janitor-booking',
  'security': 'security-privacy',
  'security-privacy': 'security-privacy',
  'medical-records': 'records',
  'caregiver': 'caregiver-booking',
  'caregiver-portal': 'caregiver-booking',
  'caregiver-features': 'caregiver-booking',
  'pharmacists': 'pharmacists',
  'caregivers': 'caregivers'
};

export const normalizeRole = (role?: string): string => {
  if (!role) return 'Patient';
  const r = role.toUpperCase().replace(/[\s-]+/g, '_');
  switch (r) {
    case 'DOCTOR':
      return 'Doctor';
    case 'PATIENT':
      return 'Patient';
    case 'NURSE':
      return 'Nurse';
    case 'PHARMACIST':
      return 'Pharmacist';
    case 'CAREGIVER':
      return 'Caregiver';
    case 'INSURANCE_PROVIDER':
    case 'INSURANCE':
      return 'Insurance';
    case 'ADMIN':
      return 'Admin';
    case 'SUPER_ADMIN':
      return 'Super Admin';
    default:
      if (role.toLowerCase() === 'doctor') return 'Doctor';
      if (role.toLowerCase() === 'patient') return 'Patient';
      if (role.toLowerCase() === 'nurse') return 'Nurse';
      if (role.toLowerCase() === 'pharmacist') return 'Pharmacist';
      if (role.toLowerCase() === 'caregiver') return 'Caregiver';
      if (role.toLowerCase() === 'insurance') return 'Insurance';
      if (role.toLowerCase() === 'admin') return 'Admin';
      if (role.toLowerCase() === 'super admin' || role.toLowerCase() === 'super_admin') return 'Super Admin';
      return role;
  }
};

export const getPortalFromPathOrRole = (path: string, userRole: string = 'Patient'): 'admin' | 'pharmacist' | 'doctor' | 'nurse' | 'insurance' | 'caregiver' | 'user' => {
  const p = path.toLowerCase();
  if (p.startsWith('/admin')) return 'admin';
  if (p.startsWith('/doctor')) return 'doctor';
  if (p.startsWith('/pharmacist')) return 'pharmacist';
  if (p.startsWith('/nurse')) return 'nurse';
  if (p.startsWith('/insurance')) return 'insurance';
  if (p.startsWith('/caregiver')) return 'caregiver';
  if (p.startsWith('/user')) return 'user';
  
  const role = normalizeRole(userRole);
  if (role === 'Admin' || role === 'Super Admin') return 'admin';
  if (role === 'Doctor') return 'doctor';
  if (role === 'Pharmacist') return 'pharmacist';
  if (role === 'Nurse') return 'nurse';
  if (role === 'Insurance') return 'insurance';
  if (role === 'Caregiver') return 'caregiver';
  return 'user';
};

const getURLPathForRoute = (page: string, navId?: string, userRole: string = 'Patient', currentPath: string = '') => {
  if (page === 'about') return '/about';
  const pathLower = (currentPath || window.location.pathname).toLowerCase();

  if (page === 'login') {
    if (pathLower.startsWith('/admin')) return '/admin/login';
    if (pathLower.startsWith('/doctor')) return '/doctor/login';
    if (pathLower.startsWith('/pharmacist')) return '/pharmacist/login';
    if (pathLower.startsWith('/nurse')) return '/nurse/login';
    if (pathLower.startsWith('/insurance')) return '/insurance/login';
    if (pathLower.startsWith('/caregiver')) return '/caregiver/login';
    if (pathLower.startsWith('/user')) return '/user/login';
    return '/login';
  }
  if (page === 'register') {
    if (pathLower.startsWith('/doctor')) return '/doctor/register';
    if (pathLower.startsWith('/pharmacist')) return '/pharmacist/register';
    if (pathLower.startsWith('/nurse')) return '/nurse/register';
    if (pathLower.startsWith('/insurance')) return '/insurance/register';
    if (pathLower.startsWith('/caregiver')) return '/caregiver/register';
    if (pathLower.startsWith('/user')) return '/user/register';
    return '/register';
  }
  if (page === 'dashboard') {
    const nav = navId || 'dashboard';
    const portal = getPortalFromPathOrRole(pathLower, userRole);

    if (portal === 'admin') return `/admin/${nav}`;
    if (portal === 'doctor') return `/doctor/${nav}`;
    if (portal === 'pharmacist') return `/pharmacist/${nav}`;
    if (portal === 'nurse') return `/nurse/${nav}`;
    if (portal === 'insurance') return `/insurance/${nav}`;
    if (portal === 'caregiver') return `/caregiver/${nav}`;
    
    // Patient/User routes
    if (nav === 'family' || nav === 'family-connect') return '/user/family-connect';
    if (nav === 'consultation' || nav === 'video-consultation') return '/user/video-consultation';
    if (nav === 'analytics' || nav === 'health-analytics') return '/user/health-analytics';
    if (nav === 'checkup' || nav === 'health-checkup') return '/user/health-checkup';
    if (nav === 'notifications' || nav === 'notification') return '/user/notifications';
    if (nav === 'reminders' || nav === 'reminder') return '/user/reminders';
    if (nav === 'appointments' || nav === 'appointment') return '/user/appointments';
    if (nav === 'medicines' || nav === 'medicine') return '/user/medicines';
    if (nav === 'lab-test') return '/user/lab-tests';
    if (nav === 'diet-plan') return '/user/diet-plans';
    if (nav === 'report-insights') return '/user/insights';
    if (nav === 'nurse-booking') return '/user/nurse-booking';
    if (nav === 'caregiver-booking') return '/user/caregiver-booking';
    if (nav === 'janitor-booking') return '/user/janitor-booking';
    if (nav === 'security-privacy') return '/user/security';
    return `/user/${nav}`;
  }
  return '/';
};

const getInitialAppState = () => {
  const path = window.location.pathname.toLowerCase();
  const rawHash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();

  const isAdminPath = path.startsWith('/admin');
  const isUserPath = path.startsWith('/user');
  const isPharmacistPath = path.startsWith('/pharmacist');
  const isDoctorPath = path.startsWith('/doctor');
  const isNursePath = path.startsWith('/nurse');
  const isInsurancePath = path.startsWith('/insurance');
  const isCaregiverPath = path.startsWith('/caregiver');

  const target = isAdminPath ? path.replace('/admin/', '').replace('/admin', '')
    : isUserPath ? path.replace('/user/', '').replace('/user', '')
    : isPharmacistPath ? path.replace('/pharmacist/', '').replace('/pharmacist', '')
    : isDoctorPath ? path.replace('/doctor/', '').replace('/doctor', '')
    : isNursePath ? path.replace('/nurse/', '').replace('/nurse', '')
    : isInsurancePath ? path.replace('/insurance/', '').replace('/insurance', '')
    : isCaregiverPath ? path.replace('/caregiver/', '').replace('/caregiver', '')
    : (rawHash.startsWith('user/') ? rawHash.replace('user/', '') : rawHash.startsWith('pharmacist/') ? rawHash.replace('pharmacist/', '') : rawHash);

  const savedNav = localStorage.getItem('app_active_nav_id');
  const savedUser = localStorage.getItem('app_user');
  const savedLoggedIn = localStorage.getItem('app_is_logged_in');
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || (isUserPath ? localStorage.getItem('patient_token') : null);

  let loggedIn = false;
  let userData: any = null;

  try {
    if (savedUser && token) {
      userData = JSON.parse(savedUser);
      if (userData && userData.role) {
        userData.role = normalizeRole(userData.role);
      }
      if (savedLoggedIn !== null) {
        loggedIn = (savedLoggedIn === 'true' || JSON.parse(savedLoggedIn) === true) && !!token;
      } else {
        loggedIn = !!token && !!userData;
      }
    }
  } catch {
    userData = null;
    loggedIn = false;
  }

  if (!token || !userData) {
    loggedIn = false;
    userData = null;
  }

  // Enforce portal-role isolation so sessions from one portal do not leak into another portal
  if (isPharmacistPath && userData && userData.role !== 'Pharmacist') {
    userData = {
      name: 'Suresh Nair, R.Ph',
      email: 'pharmacist@health.com',
      role: 'Pharmacist',
      abhaId: 'RPH-TN-2018-994',
    };
  } else if (isDoctorPath && userData && userData.role !== 'Doctor') {
    userData = {
      name: 'Dr. Arjun Kumar',
      email: 'dr.arjun.kumar@apollocentral.in',
      role: 'Doctor',
    };
  } else if (isNursePath && userData && userData.role !== 'Nurse') {
    userData = {
      name: 'Sister Priya Nair',
      email: 'nurse@health.com',
      role: 'Nurse',
    };
  } else if (isUserPath && userData && userData.role !== 'Patient') {
    const savedPatientUser = localStorage.getItem('patient_user');
    if (savedPatientUser) {
      try {
        userData = JSON.parse(savedPatientUser);
        if (userData && userData.role) {
          userData.role = normalizeRole(userData.role);
        }
      } catch {}
    }
  }

  let page: 'home' | 'about' | 'login' | 'register' | 'dashboard' = 'home';
  let nav = (isAdminPath && target) ? target : (target && NAV_MAP[target] ? NAV_MAP[target] : savedNav || 'dashboard');

  // Role detection for authentication forms
  let targetRole: 'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance' = 'patient';
  if (isDoctorPath) targetRole = 'doctor';
  else if (isNursePath) targetRole = 'nurse';
  else if (isInsurancePath) targetRole = 'insurance';
  else if (isCaregiverPath) targetRole = 'caregiver';
  else if (isPharmacistPath) targetRole = 'pharmacist';

  // ROUTE DETERMINATION DERIVED FROM URL PATH
  if (path === '/' || path === '' || path === '/home' || path === '/index.html') {
    page = 'home';
  } else if (path === '/about') {
    page = 'about';
  } else if (path === '/login' || path === '/doctor/login' || path === '/nurse/login' || path === '/pharmacist/login' || path === '/insurance/login' || path === '/caregiver/login' || path === '/user/login' || path === '/admin/login') {
    page = 'login';
  } else if (path === '/register' || path === '/doctor/register' || path === '/nurse/register' || path === '/pharmacist/register' || path === '/insurance/register' || path === '/caregiver/register' || path === '/user/register') {
    page = 'register';
  } else if (isAdminPath || isDoctorPath || isNursePath || isInsurancePath || isCaregiverPath || isPharmacistPath || isUserPath || (target && NAV_MAP[target]) || path === '/emergency' || path === '/sos' || path === '/abha' || path === '/features' || path === '/doctors' || path === '/services') {
    if (loggedIn && userData) {
      // For admin paths, verify the logged-in user actually has admin role
      if (isAdminPath) {
        const userRole = (userData.role || '').toLowerCase();
        if (userRole !== 'admin' && userRole !== 'super admin' && userRole !== 'super_admin') {
          // Non-admin user trying to access admin panel — force admin login
          page = 'login';
        } else {
          page = 'dashboard';
          if (target) {
            nav = target;
          }
        }
      } else {
        page = 'dashboard';
        if (target && NAV_MAP[target]) {
          nav = NAV_MAP[target];
        }
      }
    } else {
      page = 'login';
    }
  } else {
    page = loggedIn ? 'home' : 'login';
  }

  return { page, nav, loggedIn, userData, targetRole };
};


export const App: React.FC = () => {
  const { landing } = useSiteConfig();
  const initialState = getInitialAppState();

  // Page & User States
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'login' | 'register' | 'dashboard'>(initialState.page);
  const [selectedAuthRole, setSelectedAuthRole] = useState<'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance'>(initialState.targetRole);
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.loggedIn);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    abhaId?: string;
    bloodGroup?: string;
    age?: number;
  } | null>(initialState.userData);
  const [initialNavId, setInitialNavId] = useState<string>(initialState.nav);

  // Initialize Global Appearance Settings on Mount
  React.useEffect(() => {
    const savedAppear = localStorage.getItem('user_settings_appearance');
    if (savedAppear) {
      try {
        const appearance = JSON.parse(savedAppear);
        const sizes: Record<string, string> = { 'Small': '14px', 'Medium': '16px', 'Large': '18px', 'Extra Large': '20px' };
        document.documentElement.style.fontSize = sizes[appearance.fontSize] || '16px';

        const colors: Record<string, string> = { Teal: '#00a896', Blue: '#4f46e5', Cyan: '#06b6d4', Violet: '#7c3aed', Rose: '#e11d48' };
        const hex = colors[appearance.accentColor] || '#00a896';
        
        let styleEl = document.getElementById('dynamic-accent-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'dynamic-accent-style';
          document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = `
          .bg-\\[\\#00a896\\] { background-color: ${hex} !important; }
          .text-\\[\\#00a896\\] { color: ${hex} !important; }
          .border-\\[\\#00a896\\] { border-color: ${hex} !important; }
          .fill-\\[\\#00a896\\] { fill: ${hex} !important; }
          .ring-\\[\\#00a896\\] { --tw-ring-color: ${hex} !important; }
        `;
      } catch (e) {
        console.error('Failed to parse appearance settings', e);
      }
    }
  }, []);

  // Session Restoration & Backend User Validation on Mount
  React.useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token') || localStorage.getItem('patient_token');
    if (token) {
      authApi.getCurrentUser()
        .then((res) => {
          if (res && res.data) {
            const u = res.data;
            const profile: any = u.profile || {};
            const normalizedRole = normalizeRole(u.role);
            const pathLower = window.location.pathname.toLowerCase();
            if (pathLower.startsWith('/pharmacist') && normalizedRole !== 'Pharmacist') return;
            if (pathLower.startsWith('/doctor') && normalizedRole !== 'Doctor') return;
            if (pathLower.startsWith('/nurse') && normalizedRole !== 'Nurse') return;
            if (pathLower.startsWith('/caregiver') && normalizedRole !== 'Caregiver') return;
            if (pathLower.startsWith('/insurance') && normalizedRole !== 'Insurance') return;
            if (pathLower.startsWith('/user') && normalizedRole !== 'Patient') return;

            const refreshedUser = {
              id: u.id,
              profileId: profile.id,
              name: profile.fullName || profile.providerName || u.email.split('@')[0],
              email: u.email,
              role: normalizedRole,
              abhaId: u.abhaId || profile.abhaId,
              bloodGroup: profile.bloodGroup || 'O+',
              age: profile.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()) : 30,
              phone: u.phoneNumber || profile.phone,
              emergencyContact: profile.emergencyContactPhone,
              emergencyContactName: profile.emergencyContactName,
              emergencyContactPhone: profile.emergencyContactPhone,
              address: profile.address,
              gender: profile.gender,
              dateOfBirth: profile.dateOfBirth,
              familyPhone: profile.familyPhone,
              heightCm: profile.heightCm,
              specialization: profile.speciality,
              hospitalAffiliation: profile.hospital,
            };
            setUser(refreshedUser);
            localStorage.setItem('app_user', JSON.stringify(refreshedUser));
            if (normalizedRole === 'Patient') {
              localStorage.setItem('patient_user', JSON.stringify(refreshedUser));
              localStorage.setItem('patient_user_name', refreshedUser.name);
            }
            localStorage.setItem('app_is_logged_in', 'true');
          }
        })
        .catch((err) => {
          console.warn('Session verification failed, resetting session:', err?.message);
          handleLogout();
        });

      // Connect Socket.IO for global authenticated features (like real-time notifications)
      socketService.connect(token);
    } else if (isLoggedIn) {
      handleLogout();
    }
  }, []);

  // Subscribe to Global Real-Time Notifications (ONLY when authenticated and inside Dashboard)
  React.useEffect(() => {
    if (!isLoggedIn || currentPage !== 'dashboard') return;

    const currentRole = normalizeRole(user?.role);
    const isPatient = currentRole === 'Patient';
    const isDoctor = currentRole === 'Doctor';

    const unsubscribeNotif = socketService.subscribeToNotifications((notification: any) => {
      if (notification.title && notification.message) {
        const isAccessReq =
          notification.type === 'ACCESS_REQUEST' ||
          notification.category === 'Clinical Access' ||
          notification.relatedModule === 'health-share' ||
          (/access request/i.test(notification.title) && !/approved|rejected|declined/i.test(notification.title)) ||
          /requested access to your health records/i.test(notification.message);

        const isAccessApproved =
          notification.type === 'ACCESS_APPROVED' ||
          /approved your (health record|medical record|access)/i.test(notification.message) ||
          /access request approved/i.test(notification.title);

        const isAccessRejected =
          notification.type === 'ACCESS_REJECTED' ||
          /declined your (request|access)/i.test(notification.message) ||
          /access request (rejected|declined)/i.test(notification.title);

        if (isPatient && isAccessReq) {
          // Handled exclusively by subscribeToHealthShareEvents below to avoid duplicate toasts
        } else if (isDoctor && isAccessApproved) {
          showGlobalToast(notification.message, 'success', 'Access Request Approved');
        } else if (isDoctor && isAccessRejected) {
          showGlobalToast(notification.message, 'warning', 'Access Request Declined');
        } else if (!isDoctor && !isAccessReq) {
          showGlobalToast(`${notification.title}\n${notification.message}`, 'info');
        }
      }
      
      // Dispatch event to update the NotificationPopover badge immediately
      window.dispatchEvent(new Event('notifications_updated'));
    });

    const handleHealthShareEvent = (payload: any) => {
      const eventType = payload.event || payload.type || '';
      const isApproved = eventType.includes('approved') || payload.status === 'APPROVED';
      const isRejected = eventType.includes('rejected') || payload.status === 'REJECTED';
      const isCreated =
        payload.status === 'PENDING' ||
        eventType.includes('request-created') ||
        eventType.includes('request_created');

      if (isPatient && isCreated) {
        const docData = payload.data || payload;
        const reqId = payload.requestId || docData.requestId || docData.id;
        const rawDocName = docData.doctorName || docData.doctor?.fullName || 'Doctor';
        const formattedDoctorName = /^dr\.?\s+/i.test(rawDocName.trim()) ? rawDocName.trim() : `Dr. ${rawDocName.trim()}`;
        showGlobalToast(
          `${formattedDoctorName} has requested access to your health records for ${docData.purpose || 'Consultation'}.`,
          'info',
          'Medical Record Access Request',
          `access-req-${reqId}`,
          'Review Request',
          () => {
            window.dispatchEvent(new CustomEvent('open_access_requests_modal'));
          },
          {
            isAccessRequest: true,
            duration: 15000,
            doctorName: formattedDoctorName,
            doctorSpeciality: docData.doctorSpeciality || docData.doctor?.speciality,
            doctorHospital: docData.doctorHospital || docData.doctor?.hospital,
            purpose: docData.purpose || 'Patient Consultation',
            permissionScope: docData.permissionScope || ['Vitals', 'Medical Records', 'Prescriptions', 'Lab Reports'],
            requestedAt: docData.requestedAt || new Date().toISOString(),
            requestId: reqId,
            onReview: () => {
              window.dispatchEvent(new CustomEvent('open_access_requests_modal'));
            },
          }
        );
        window.dispatchEvent(new Event('notifications_updated'));
      } else if (isDoctor && isApproved) {
        const patientName = payload.data?.patientName || 'Patient';
        showGlobalToast(
          `✓ ${patientName} approved your medical record access request. Clinical records are now unlocked.`,
          'success',
          'Access Request Approved'
        );
      } else if (isDoctor && isRejected) {
        showGlobalToast(
          'The patient declined your medical record access request.',
          'warning',
          'Access Request Declined'
        );
      }
    };

    const unsubscribeHealth = socketService.subscribeToHealthShareEvents(handleHealthShareEvent);

    // Cross-tab BroadcastChannel listener
    let crossBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        crossBc = new BroadcastChannel('health_share_channel');
        crossBc.onmessage = (event) => {
          if (event.data) {
            handleHealthShareEvent(event.data);
          }
        };
      } catch {}
    }

    // Window event listener for local dispatches
    const handleLocalHealthEvent = (e: any) => {
      if (e.detail) {
        handleHealthShareEvent({
          event: 'health-share:request-created',
          status: 'PENDING',
          data: e.detail,
          requestId: e.detail.id,
        });
      }
    };
    window.addEventListener('health-share:request-created', handleLocalHealthEvent);

    return () => {
      unsubscribeNotif();
      unsubscribeHealth();
      crossBc?.close();
      window.removeEventListener('health-share:request-created', handleLocalHealthEvent);
    };
  }, [isLoggedIn, user?.role, currentPage]);

  // Listen for local profile/user updates
  React.useEffect(() => {
    const handleUserUpdated = () => {
      const savedUser = localStorage.getItem('app_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.name) {
            setUser((prev: any) => ({
              ...(prev || {}),
              ...parsed
            }));
          }
        } catch {}
      }
    };
    window.addEventListener('app_user_updated', handleUserUpdated);
    return () => window.removeEventListener('app_user_updated', handleUserUpdated);
  }, []);

  // Sync state to localStorage & URL path on change
  React.useEffect(() => {
    localStorage.setItem('app_current_page', currentPage);
    localStorage.setItem('app_active_nav_id', initialNavId);
    localStorage.setItem('app_is_logged_in', JSON.stringify(isLoggedIn));
    if (user) {
      localStorage.setItem('app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('app_user');
    }

    const targetUrl = getURLPathForRoute(currentPage, initialNavId, user?.role || 'Patient', window.location.pathname);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  }, [currentPage, initialNavId, isLoggedIn, user]);

  // Handle Browser Back / Forward buttons (popstate)
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();

      const isAdminPath = path.startsWith('/admin');
      const isUserPath = path.startsWith('/user');
      const isPharmacistPath = path.startsWith('/pharmacist');
      const isDoctorPath = path.startsWith('/doctor');
      const isNursePath = path.startsWith('/nurse');
      const isInsurancePath = path.startsWith('/insurance');
      const isCaregiverPath = path.startsWith('/caregiver');

      const target = isAdminPath
        ? path.replace('/admin/', '').replace('/admin', '')
        : isPharmacistPath
        ? path.replace('/pharmacist/', '').replace('/pharmacist', '')
        : isUserPath
        ? path.replace('/user/', '').replace('/user', '')
        : isDoctorPath
        ? path.replace('/doctor/', '').replace('/doctor', '')
        : isNursePath
        ? path.replace('/nurse/', '').replace('/nurse', '')
        : isInsurancePath
        ? path.replace('/insurance/', '').replace('/insurance', '')
        : isCaregiverPath
        ? path.replace('/caregiver/', '').replace('/caregiver', '')
        : (rawHash.startsWith('user/') ? rawHash.replace('user/', '') : rawHash.startsWith('pharmacist/') ? rawHash.replace('pharmacist/', '') : rawHash);

      const savedLoggedIn = localStorage.getItem('app_is_logged_in');
      let loggedIn = false;
      try {
        if (savedLoggedIn !== null) {
          loggedIn = savedLoggedIn === 'true' || JSON.parse(savedLoggedIn) === true;
        }
      } catch {
        loggedIn = savedLoggedIn === 'true';
      }

      let popRole: 'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance' = 'patient';
      if (isDoctorPath) popRole = 'doctor';
      else if (isNursePath) popRole = 'nurse';
      else if (isInsurancePath) popRole = 'insurance';
      else if (isCaregiverPath) popRole = 'caregiver';
      else if (isPharmacistPath) popRole = 'pharmacist';
      setSelectedAuthRole(popRole);

      if (path === '/' || path === '' || path === '/home' || path === '/index.html') {
        setCurrentPage('home');
      } else if (path === '/about') {
        setCurrentPage('about');
      } else if (path === '/login' || path === '/doctor/login' || path === '/nurse/login' || path === '/pharmacist/login' || path === '/insurance/login' || path === '/caregiver/login' || path === '/user/login' || path === '/admin/login') {
        setCurrentPage('login');
      } else if (path === '/register' || path === '/doctor/register' || path === '/nurse/register' || path === '/pharmacist/register' || path === '/insurance/register' || path === '/caregiver/register' || path === '/user/register') {
        setCurrentPage('register');
      } else if (isAdminPath) {
        if (loggedIn) {
          setCurrentPage('dashboard');
          if (target) {
            setInitialNavId(target);
          }
        } else {
          setCurrentPage('login');
        }
      } else if (isDoctorPath || isNursePath || isInsurancePath || isCaregiverPath || isPharmacistPath || isUserPath || (target && NAV_MAP[target]) || path === '/emergency' || path === '/sos' || path === '/abha' || path === '/features' || path === '/doctors' || path === '/services') {
        if (loggedIn) {
          setCurrentPage('dashboard');
          if (target && NAV_MAP[target]) {
            setInitialNavId(NAV_MAP[target]);
          }
        } else {
          setCurrentPage('login');
        }
      } else {
        setCurrentPage(loggedIn ? 'home' : 'login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [abhaModalOpen, setAbhaModalOpen] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const handleSuccessLogin = (userData: { 
    name: string; 
    email: string; 
    role?: string;
    abhaId?: string;
    bloodGroup?: string;
    age?: number;
    phone?: string;
    emergencyContact?: string;
    specialization?: string;
    hospitalAffiliation?: string;
  }) => {
    const userRole = normalizeRole(userData.role);

    const newUser = {
      name: userData.name || 'User',
      email: userData.email || 'user@abdm.in',
      role: userRole,
      abhaId: userData.abhaId || `91-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}@abdm`,
      bloodGroup: userData.bloodGroup || 'O+',
      age: userData.age || 30,
      phone: userData.phone || '+91 98765 43210',
      emergencyContact: userData.emergencyContact || '+91 98765 11223',
      specialization: userData.specialization,
      hospitalAffiliation: userData.hospitalAffiliation
    };

    const pendingNav = localStorage.getItem('pending_nav_target');
    const targetNav = pendingNav ? (NAV_MAP[pendingNav] || pendingNav) : 'dashboard';
    if (pendingNav) {
      localStorage.removeItem('pending_nav_target');
    }

    setIsLoggedIn(true);
    setUser(newUser);
    setCurrentPage('dashboard');
    setInitialNavId(targetNav);
    localStorage.setItem('app_current_page', 'dashboard');
    localStorage.setItem('app_active_nav_id', targetNav);
    localStorage.setItem('app_is_logged_in', 'true');
    localStorage.setItem('app_user', JSON.stringify(newUser));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
    setInitialNavId('dashboard');
    localStorage.removeItem('app_user');
    localStorage.setItem('app_is_logged_in', 'false');
    localStorage.setItem('app_current_page', 'home');
    localStorage.setItem('app_active_nav_id', 'dashboard');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId) || document.getElementById(`${sectionId}-section`);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigate = (id: string) => {
    // 1. Explicit public page destinations
    if (id === 'login') {
      try {
        window.dispatchEvent(new Event('clear_all_toasts'));
      } catch {}
      setCurrentPage('login');
      window.history.pushState(null, '', '/login');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (id === 'register') {
      try {
        window.dispatchEvent(new Event('clear_all_toasts'));
      } catch {}
      setCurrentPage('register');
      window.history.pushState(null, '', '/register');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (id === 'about-page' || id === 'about-us-page') {
      try {
        window.dispatchEvent(new Event('clear_all_toasts'));
      } catch {}
      setCurrentPage('about');
      localStorage.setItem('app_current_page', 'about');
      window.history.pushState(null, '', '/about');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // 2. Landing page sections: Smoothly scroll to the corresponding section under the header
    const landingSectionIds = ['home', 'about', 'features', 'doctors', 'abha', 'partners', 'partnerLoop', 'cta'];
    if (landingSectionIds.includes(id) || (typeof document !== 'undefined' && (document.getElementById(id) || document.getElementById(`${id}-section`)))) {
      if (currentPage !== 'home') {
        setCurrentPage('home');
        window.history.pushState(null, '', '/');
        setTimeout(() => {
          scrollToSection(id);
        }, 60);
      } else {
        scrollToSection(id);
      }
      return;
    }

    // 3. Feature showcase shortcuts from the Services dropdown (scroll to interactive features)
    const featureShortcuts = [
      'medical-records', 
      'timeline', 
      'medication', 
      'doctor-sharing', 
      'emergency-sos', 
      'vitals', 
      'caregiver', 
      'ai-assistance', 
      'home-care', 
      'wearables', 
      'health-analytics', 
      'video-consultation', 
      'insurance',
      'services'
    ];
    if (featureShortcuts.includes(id)) {
      if (currentPage !== 'home') {
        setCurrentPage('home');
        window.history.pushState(null, '', '/');
        setTimeout(() => {
          scrollToSection('features');
        }, 60);
      } else {
        scrollToSection('features');
      }
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const isActuallyLoggedIn = Boolean(isLoggedIn && token);

    // 4. Admin user priority! If user is admin/super-admin or on /admin, ALWAYS route within admin dashboard!
    const isCurrentAdmin = (user?.role === 'Admin' || user?.role === 'Super Admin') || window.location.pathname.toLowerCase().startsWith('/admin');
    if (isCurrentAdmin) {
      if (id === 'home') {
        setCurrentPage('home');
        window.history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setInitialNavId(id);
      setCurrentPage('dashboard');
      localStorage.setItem('admin_active_nav_id', id);
      const targetUrl = `/admin/${id}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      return;
    }

    // 5. Authenticated user already on dashboard: route within their portal!
    if (currentPage === 'dashboard') {
      if (id === 'home') {
        setCurrentPage('home');
        window.history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetNav = NAV_MAP[id] || (id === 'doctors' ? 'appointments' : id);
      setInitialNavId(targetNav);
      return;
    }

    // 6. Unauthenticated protected action guard (only for dashboard actions, not public sections)
    if (!isActuallyLoggedIn) {
      const targetNav = NAV_MAP[id] || id;
      try {
        localStorage.setItem('pending_nav_target', targetNav);
      } catch {}
      setSelectedAuthRole('patient');
      try {
        window.dispatchEvent(new Event('clear_all_toasts'));
      } catch {}
      setCurrentPage('login');
      window.history.pushState(null, '', '/login');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // 7. Authenticated user navigation to dashboard portal tab
    const activeNav = NAV_MAP[id] || id;
    setInitialNavId(activeNav);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;

    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        scrollToSection(id);
      }, 50);
      return;
    }

    scrollToSection(id);
  };

  const handleOpenAuth = () => {
    handleNavigate('register');
  };

  const activeRole = normalizeRole(user?.role);
  const isPharmacist = activeRole === 'Pharmacist';
  const showHeaderAndFooter = currentPage !== 'dashboard' && currentPage !== 'login' && currentPage !== 'register';

  return (
    <LanguageProvider>
      <ThemeProvider storageKey="medicare-theme">
        <GlobalToastManager currentPage={currentPage} />
        <GlobalNotificationListener activeRole={activeRole} isDashboard={currentPage === 'dashboard'} />
        <div className={`min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 selection:bg-[#0f3980] selection:text-white ${showHeaderAndFooter ? 'pt-20' : ''}`}>
          
          {/* HEADER & TOP BAR (HIDE ON DASHBOARD, LOGIN & REGISTER) */}
          {showHeaderAndFooter && (
            <Header 
              onNavigate={handleNavigate} 
              isLoggedIn={isLoggedIn}
              userName={user?.name}
              onLogout={handleLogout}
              currentPage={currentPage}
              showProgressBar={currentPage === 'home'}
            />
          )}

          {/* DEDICATED PAGES OR LANDING PAGE */}
          {currentPage === 'about' ? (
            <AboutUsPage 
              onNavigateHome={() => handleNavigate('home')}
              onStartJourney={handleOpenAuth}
              onExploreFeatures={() => handleNavigate('features')}
            />
          ) : currentPage === 'login' ? (
            window.location.pathname.toLowerCase().startsWith('/admin') ? (
              <AdminLoginPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigate={handleNavigate}
                onSuccessLogin={(userData) => handleSuccessLogin(userData as any)}
              />
            ) : (
              <LoginPage 
                initialRole={selectedAuthRole}
                onNavigateHome={() => handleNavigate('home')}
                onNavigate={handleNavigate}
                onSuccessLogin={handleSuccessLogin}
              />
            )
          ) : currentPage === 'register' ? (
            <RegisterPage 
              initialRole={selectedAuthRole}
              onNavigateHome={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onSuccessLogin={handleSuccessLogin}
            />
          ) : currentPage === 'dashboard' ? (
            (() => {
              const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
              const isActuallyLoggedIn = Boolean(isLoggedIn && token);

              if (!isActuallyLoggedIn) {
                return (
                  <LoginPage 
                    initialRole={selectedAuthRole}
                    onNavigateHome={() => handleNavigate('home')}
                    onNavigate={handleNavigate}
                    onSuccessLogin={handleSuccessLogin}
                  />
                );
              }

              const currentPortal = getPortalFromPathOrRole(window.location.pathname, user?.role || 'Patient');
              if (currentPortal === 'admin') {
                return (
                  <AdminDashboardPage 
                    user={user as any || undefined} 
                    initialNavId={initialNavId}
                    onLogout={handleLogout} 
                    onNavigate={handleNavigate}
                  />
                );
              }
              if (currentPortal === 'pharmacist') {
                return (
                  <PharmacistDashboardPage
                    user={user || undefined}
                    initialNavId={initialNavId}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                  />
                );
              }
              if (currentPortal === 'doctor') {
                return (
                  <DoctorDashboardPage 
                    user={user as any || undefined} 
                    initialNavId={initialNavId}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                  />
                );
              }
              if (currentPortal === 'nurse') {
                return (
                  <NurseDashboardPage 
                    user={user as any || undefined} 
                    initialNavId={initialNavId}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                  />
                );
              }
              if (currentPortal === 'insurance') {
                return (
                  <InsuranceDashboardPage 
                    user={user as any || undefined} 
                    initialNavId={initialNavId}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                  />
                );
              }
              if (currentPortal === 'caregiver') {
                return (
                  <CaregiverDashboardPage 
                    user={user as any || undefined} 
                    initialNavId={initialNavId}
                    onLogout={handleLogout} 
                    onNavigate={handleNavigate}
                  />
                );
              }
              return (
                <DashboardPage
                  user={user as any || undefined}
                  initialNavId={initialNavId}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                  onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
                  onOpenAbhaModal={() => setAbhaModalOpen(true)}
                />
              );
            })()
          ) : (
            <main>
              {(() => {
                const visibility = landing.sectionsVisibility || {
                  hero: true,
                  about: true,
                  features: true,
                  doctors: true,
                  abha: true,
                  partnerLoop: true,
                  cta: true,
                };
                const order = (landing.sectionsOrder && landing.sectionsOrder.length > 0)
                  ? landing.sectionsOrder
                  : ['hero', 'about', 'features', 'doctors', 'abha', 'partners', 'cta'];

                return order.map((secId) => {
                  switch (secId) {
                    case 'hero':
                      return (visibility.hero !== false && landing.hero?.enabled !== false) ? (
                        <Hero 
                          key="hero"
                          onStartJourney={() => {
                            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
                            const isActuallyLoggedIn = Boolean(isLoggedIn && token);
                            if (isActuallyLoggedIn) {
                              handleNavigate('dashboard');
                            } else {
                              handleNavigate('register');
                            }
                          }} 
                          onSeeHowItWorks={() => {
                            handleNavigate('abha');
                          }} 
                        />
                      ) : null;
                    case 'about':
                      return visibility.about !== false ? (
                        <AboutHospital 
                          key="about"
                          onLearnMore={() => handleNavigate('about-page')} 
                        />
                      ) : null;
                    case 'features':
                      return visibility.features !== false ? (
                        <FeaturesSection 
                          key="features"
                          onExploreFeature={(featId) => {
                            handleNavigate(featId);
                          }} 
                        />
                      ) : null;
                    case 'doctors':
                      return visibility.doctors !== false ? (
                        <DoctorSection 
                          key="doctors"
                          onOpenDoctorPortal={(doctor) => {
                            if (doctor) {
                              try {
                                localStorage.setItem('pending_booking_doctor', JSON.stringify({
                                  id: doctor.id,
                                  name: doctor.name,
                                  speciality: doctor.specialty || doctor.department || 'General Physician',
                                  photoUrl: doctor.image || '',
                                  hospital: doctor.location || 'Medicare Hospital',
                                  fee: parseInt(doctor.consultFee?.replace(/[^0-9]/g, '') || '800', 10),
                                }));
                              } catch {}
                            }
                            localStorage.setItem('pending_nav_target', 'appointments');
                            setSelectedAuthRole('patient');
                            handleNavigate('login');
                          }} 
                          onViewAllDoctors={() => {
                            localStorage.setItem('pending_nav_target', 'appointments');
                            setSelectedAuthRole('patient');
                            handleNavigate('login');
                          }}
                        />
                      ) : null;
                    case 'abha':
                      return visibility.abha !== false ? (
                        <ABHASection 
                          key="abha" 
                          onManageConnection={() => handleNavigate('abha')} 
                        />
                      ) : null;
                    case 'partners':
                    case 'partnerLoop':
                      return (visibility.partnerLoop !== false && (visibility as any).partners !== false) ? (
                        <PartnerLoopSection key="partners" />
                      ) : null;
                    case 'cta':
                      return visibility.cta !== false ? (
                        <FinalCTA 
                          key="cta"
                          onStartJourney={() => {
                            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
                            const isActuallyLoggedIn = Boolean(isLoggedIn && token);
                            if (isActuallyLoggedIn) {
                              handleNavigate('dashboard');
                            } else {
                              handleNavigate('register');
                            }
                          }} 
                          onExploreFeatures={() => handleNavigate('features')} 
                        />
                      ) : null;
                    default:
                      return null;
                  }
                });
              })()}
            </main>
          )}

          {/* FOOTER (HIDE ON DASHBOARD, LOGIN & REGISTER) */}
          {showHeaderAndFooter && (
            <Footer 
              onNavigate={handleNavigate} 
              isLoggedIn={Boolean(isLoggedIn && (localStorage.getItem('token') || localStorage.getItem('auth_token')))} 
            />
          )}

          {/* MODALS */}
          <ABHAModal 
            isOpen={abhaModalOpen} 
            onClose={() => setAbhaModalOpen(false)} 
          />
          <ConsentModal 
            isOpen={consentModalOpen} 
            onClose={() => setConsentModalOpen(false)} 
          />
          <EmergencyQRModal 
            isOpen={emergencyModalOpen} 
            onClose={() => setEmergencyModalOpen(false)} 
            user={user || undefined}
          />
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
          />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;

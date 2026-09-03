import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
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

// MODALS
import { ABHAModal } from './components/modals/ABHAModal';
import { ConsentModal } from './components/modals/ConsentModal';
import { EmergencyQRModal } from './components/modals/EmergencyQRModal';
import { AuthModal } from './components/modals/AuthModal';

const DEFAULT_PATIENT_USER = {
  name: 'Ragul Kumar',
  email: 'ragul.kumar@abdm.in',
  role: 'Patient',
  abhaId: '91-8472-9104-5821@abdm',
  bloodGroup: 'O+',
  age: 34
};

const DEFAULT_CAREGIVER_USER = {
  name: 'Anita Sharma',
  email: 'anita.caregiver@abdm.in',
  role: 'Caregiver',
  abhaId: 'CG-8421-9902@abdm',
  bloodGroup: 'A+',
  age: 32
};

const DEFAULT_PHARMACIST_USER = {
  name: 'Registered Pharmacist',
  email: 'pharmacist@apollocentral.in',
  role: 'Pharmacist',
  bloodGroup: 'B+',
  age: 38
};

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
  'emergency': 'emergency',
  'sos': 'emergency',
  'settings': 'settings',
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
  'janitor-booking': 'janitor-booking',
  'security': 'security-privacy',
  'security-privacy': 'security-privacy'
};

const getURLPathForRoute = (page: string, navId?: string, userRole: string = 'Patient') => {
  if (page === 'about') return '/about';
  if (page === 'login') return '/login';
  if (page === 'register') return '/register';
  if (page === 'dashboard') {
    const nav = navId || 'dashboard';
    if (userRole === 'Admin' || userRole === 'Super Admin') return `/admin/${nav}`;
    if (userRole === 'Pharmacist') return `/pharmacist/${nav}`;
    if (userRole === 'Doctor') return `/doctor/${nav}`;
    if (userRole === 'Nurse') return `/nurse/${nav}`;
    if (userRole === 'Insurance') return `/insurance/${nav}`;
    if (userRole === 'Caregiver') return `/caregiver/${nav}`;
    
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

  let loggedIn = false;
  try {
    if (savedLoggedIn !== null) {
      loggedIn = savedLoggedIn === 'true' || JSON.parse(savedLoggedIn) === true;
    }
  } catch {
    loggedIn = savedLoggedIn === 'true';
  }

  let userData = null;
  try {
    if (savedUser) {
      userData = JSON.parse(savedUser);
    }
  } catch {
    userData = null;
  }

  if (isAdminPath) {
    if (!userData || (userData.role !== 'Admin' && userData.role !== 'Super Admin')) {
      userData = { name: 'Vikramaditya Rao', email: 'superadmin@dhr-medicare.in', role: 'Super Admin' };
    }
    loggedIn = true;
  } else if (isUserPath) {
    if (!userData || userData.role !== 'Patient') userData = DEFAULT_PATIENT_USER;
    loggedIn = true;
  } else if (isPharmacistPath) {
    if (!userData || userData.role !== 'Pharmacist') userData = DEFAULT_PHARMACIST_USER;
    loggedIn = true;
  } else if (isDoctorPath) {
    if (!userData || userData.role !== 'Doctor') userData = { name: 'Dr. Rajesh', email: 'doctor@hospital.com', role: 'Doctor' };
    loggedIn = true;
  } else if (isNursePath) {
    if (!userData || userData.role !== 'Nurse') userData = { name: 'Nurse Sarah', email: 'nurse@hospital.com', role: 'Nurse' };
    loggedIn = true;
  } else if (isInsurancePath) {
    if (!userData || userData.role !== 'Insurance') userData = { name: 'Insurance Agent', email: 'agent@insurance.com', role: 'Insurance' };
    loggedIn = true;
  } else if (isCaregiverPath) {
    if (!userData || userData.role !== 'Caregiver') userData = DEFAULT_CAREGIVER_USER;
    loggedIn = true;
  } else if (!userData && loggedIn) {
    userData = DEFAULT_PATIENT_USER;
  }

  let page: 'home' | 'about' | 'login' | 'register' | 'dashboard' = 'home';
  let nav = target && NAV_MAP[target] ? NAV_MAP[target] : savedNav || 'dashboard';

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
  } else if (isAdminPath || isDoctorPath || isNursePath || isInsurancePath || isCaregiverPath || isPharmacistPath || isUserPath || (target && NAV_MAP[target])) {
    if (loggedIn) {
      page = 'dashboard';
      if (target && NAV_MAP[target]) {
        nav = NAV_MAP[target];
      }
    } else {
      page = 'login';
    }
  } else {
    page = 'home';
  }

  return { page, nav, loggedIn, userData, targetRole };
};


export const App: React.FC = () => {
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

    const targetUrl = getURLPathForRoute(currentPage, initialNavId, user?.role || 'Patient');
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  }, [currentPage, initialNavId, isLoggedIn, user]);

  // Handle Browser Back / Forward buttons (popstate)
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();

      const isUserPath = path.startsWith('/user');
      const isPharmacistPath = path.startsWith('/pharmacist');
      const isDoctorPath = path.startsWith('/doctor');
      const isNursePath = path.startsWith('/nurse');
      const isInsurancePath = path.startsWith('/insurance');
      const isCaregiverPath = path.startsWith('/caregiver');

      const target = isPharmacistPath
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
      } else if (path === '/login' || path === '/doctor/login' || path === '/nurse/login' || path === '/pharmacist/login' || path === '/insurance/login' || path === '/caregiver/login' || path === '/user/login') {
        setCurrentPage('login');
      } else if (path === '/register' || path === '/doctor/register' || path === '/nurse/register' || path === '/pharmacist/register' || path === '/insurance/register' || path === '/caregiver/register' || path === '/user/register') {
        setCurrentPage('register');
      } else if (isDoctorPath || isNursePath || isInsurancePath || isCaregiverPath || isPharmacistPath || isUserPath || (target && NAV_MAP[target])) {
        if (loggedIn) {
          setCurrentPage('dashboard');
          if (target && NAV_MAP[target]) {
            setInitialNavId(NAV_MAP[target]);
          }
        } else {
          setCurrentPage('login');
        }
      } else {
        setCurrentPage('home');
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
  }) => {
    const userRole = userData.role || 'Patient';
    const isPharm = userRole === 'Pharmacist';
    const isCare = userRole === 'Caregiver';

    const newUser = {
      name: userData.name || (isPharm ? 'Suresh Nair' : isCare ? 'Anita Sharma' : 'Ragul Kumar'),
      email: userData.email || (isPharm ? 'suresh.nair@apollopharmacy.in' : isCare ? 'anita.caregiver@abdm.in' : 'ragul.kumar@abdm.in'),
      role: userRole,
      abhaId: userData.abhaId || (isPharm ? 'pharm.apollo.central@abdm' : isCare ? 'CG-8421-9902@abdm' : '91-8472-9104-5821@abdm'),
      bloodGroup: userData.bloodGroup || 'O+',
      age: userData.age || (isPharm ? 38 : isCare ? 32 : 34),
      phone: userData.phone || '+91 98765 43210',
      emergencyContact: userData.emergencyContact || '+91 98765 11223'
    };

    setIsLoggedIn(true);
    setUser(newUser);
    setCurrentPage('dashboard');
    setInitialNavId('dashboard');
    localStorage.setItem('app_current_page', 'dashboard');
    localStorage.setItem('app_is_logged_in', 'true');
    localStorage.setItem('app_user', JSON.stringify(newUser));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
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

  // ROLE SWITCHING HELPERS (FOR EFFORTLESS TESTING BETWEEN PATIENT & PHARMACIST)
  const handleSwitchToPharmacist = () => {
    setIsLoggedIn(true);
    setUser(DEFAULT_PHARMACIST_USER);
    setCurrentPage('dashboard');
    setInitialNavId('dashboard');
    localStorage.setItem('app_user', JSON.stringify(DEFAULT_PHARMACIST_USER));
    localStorage.setItem('app_is_logged_in', 'true');
    window.history.pushState(null, '', '/pharmacist/dashboard');
  };

  const handleNavigate = (id: string) => {
    if (id === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (id === 'login') {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (id === 'register') {
      setCurrentPage('register');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const protectedModules = [
      'dashboard', 'profile', 'records', 'appointments', 'appointment',
      'medicines', 'medicine', 'insurance', 'scan', 'hospitals',
      'nearby-hospitals', 'pharmacy', 'consultation', 'video-consultation',
      'reminders', 'reminder', 'notifications', 'notification',
      'analytics', 'health-analytics', 'family', 'family-connect',
      'checkup', 'health-checkup', 'settings', 'ai-assistant', 'assistant',
      'more-features', 'orders', 'prescriptions', 'patients'
    ];

    if (protectedModules.includes(id)) {
      if (!isLoggedIn) {
        setCurrentPage('register');
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      const normalizedId = (id === 'appointment') ? 'appointments' : (id === 'medicine') ? 'medicines' : (id === 'video-consultation') ? 'consultation' : (id === 'reminder') ? 'reminders' : (id === 'notification') ? 'notifications' : (id === 'health-analytics') ? 'analytics' : (id === 'family-connect') ? 'family' : (id === 'health-checkup') ? 'checkup' : (id === 'nearby-hospitals') ? 'hospitals' : id;
      setInitialNavId(normalizedId);
      if (currentPage !== 'dashboard') {
        setCurrentPage('dashboard');
      }
      return;
    }

    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        if (id === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToSection(id);
        }
      }, 50);
      return;
    }

    scrollToSection(id);
  };

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
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

  const handleOpenAuth = () => {
    handleNavigate('register');
  };

  const isUserPath = window.location.pathname.toLowerCase().startsWith('/user');
  const isPharmacist = !isUserPath && ((user?.role === 'Pharmacist') || window.location.pathname.toLowerCase().startsWith('/pharmacist'));
  const showHeaderAndFooter = currentPage !== 'dashboard' && currentPage !== 'login' && currentPage !== 'register';

  return (
    <ThemeProvider>
      <div className={`min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 selection:bg-[#0f3980] selection:text-white ${showHeaderAndFooter ? 'pt-20' : ''}`}>
        
        {/* HEADER & TOP BAR (HIDE ON DASHBOARD, LOGIN & REGISTER) */}
        {showHeaderAndFooter && (
          <Header 
            onNavigate={handleNavigate} 
            isLoggedIn={isLoggedIn}
            userName={user?.name}
            onLogout={handleLogout}
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
          user?.role === 'Admin' || user?.role === 'Super Admin' || window.location.pathname.toLowerCase().startsWith('/admin') ? (
            <AdminDashboardPage 
              user={user as any || undefined} 
              initialNavId={initialNavId}
              onLogout={handleLogout} 
              onNavigate={handleNavigate}
            />
          ) : user?.role === 'Pharmacist' || isPharmacist ? (
            <PharmacistDashboardPage
              user={user || undefined}
              initialNavId={initialNavId}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          ) : user?.role === 'Doctor' ? (
            <DoctorDashboardPage user={user as any || undefined} onLogout={handleLogout} />
          ) : user?.role === 'Nurse' ? (
            <NurseDashboardPage user={user as any || undefined} onLogout={handleLogout} />
          ) : user?.role === 'Insurance' ? (
            <InsuranceDashboardPage user={user as any || undefined} onLogout={handleLogout} />
          ) : user?.role === 'Caregiver' ? (
            <CaregiverDashboardPage 
              user={user as any || undefined} 
              initialNavId={initialNavId}
              onLogout={handleLogout} 
              onNavigate={handleNavigate}
            />
          ) : (
            <DashboardPage
              user={user as any || undefined}
              initialNavId={initialNavId}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
              onOpenAbhaModal={() => setAbhaModalOpen(true)}
            />
          )
        ) : (
          <main>
            {/* HERO SECTION */}
            <Hero 
              onStartJourney={() => handleNavigate('dashboard')} 
              onSeeHowItWorks={() => handleNavigate('about')} 
            />

            {/* ABOUT US PREVIEW */}
            <AboutHospital 
              onLearnMore={() => handleNavigate('about')} 
            />

            {/* FEATURES SECTION */}
            <FeaturesSection 
              onExploreFeature={() => handleNavigate('abha')} 
            />

            {/* MEET OUR DOCTORS */}
            <DoctorSection 
              onOpenDoctorPortal={() => handleNavigate('register')} 
            />

            {/* ABHA DIGITAL HEALTH CONNECTION */}
            <ABHASection onManageConnection={() => setAbhaModalOpen(true)} />

            {/* HEALTHCARE PARTNER NETWORKS LOGOLOOP */}
            <PartnerLoopSection />

            {/* FINAL HIGH-CONVERSION CTA */}
            <FinalCTA 
              onStartJourney={() => handleNavigate('register')} 
              onExploreFeatures={() => handleNavigate('features')} 
            />
          </main>
        )}

        {/* FOOTER (HIDE ON DASHBOARD, LOGIN & REGISTER) */}
        {showHeaderAndFooter && <Footer onNavigate={handleNavigate} />}

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
        />
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </div>
    </ThemeProvider>
  );
};

export default App;

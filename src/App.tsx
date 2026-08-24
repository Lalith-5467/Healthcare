import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Header } from './components/landing/Header';
import { Hero } from './components/landing/Hero';
import { AboutHospital } from './components/landing/AboutHospital';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { DoctorSection } from './components/landing/DoctorSection';
import { ABHASection } from './components/landing/ABHASection';
import { FinalCTA } from './components/landing/FinalCTA';
import { Footer } from './components/landing/Footer';
import { AboutUsPage } from './pages/AboutUsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

// MODALS
import { ABHAModal } from './components/modals/ABHAModal';
import { ConsentModal } from './components/modals/ConsentModal';
import { EmergencyQRModal } from './components/modals/EmergencyQRModal';
import { AuthModal } from './components/modals/AuthModal';

const DEFAULT_PATIENT_USER = {
  name: 'Lalith Patel',
  email: 'lalith.patel@abdm.in',
  role: 'Patient',
  abhaId: '91-8472-9104-5821@abdm',
  bloodGroup: 'O+',
  age: 34
};

const getURLPathForRoute = (page: string, navId?: string) => {
  if (page === 'about') return '/about';
  if (page === 'login') return '/login';
  if (page === 'register') return '/register';
  if (page === 'dashboard') {
    const nav = navId || 'dashboard';
    if (nav === 'family' || nav === 'family-connect') return '/user/family-connect';
    if (nav === 'consultation' || nav === 'video-consultation') return '/user/video-consultation';
    if (nav === 'analytics' || nav === 'health-analytics') return '/user/health-analytics';
    if (nav === 'checkup' || nav === 'health-checkup') return '/user/health-checkup';
    if (nav === 'reminders' || nav === 'notifications') return '/user/reminders';
    if (nav === 'appointments' || nav === 'appointment') return '/user/appointments';
    if (nav === 'medicines' || nav === 'medicine') return '/user/medicines';
    return `/user/${nav}`;
  }
  return '/';
};

const getInitialAppState = () => {
  const path = window.location.pathname.toLowerCase();
  const rawHash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
  const target = path.startsWith('/user/') ? path.replace('/user/', '') : rawHash;

  const savedPage = localStorage.getItem('app_current_page') as any;
  const savedNav = localStorage.getItem('app_active_nav_id');
  const savedUser = localStorage.getItem('app_user');
  const savedLoggedIn = localStorage.getItem('app_is_logged_in');

  const navMap: Record<string, string> = {
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
    'emergency': 'emergency',
    'sos': 'emergency',
    'settings': 'settings',
    'ai-assistant': 'ai-assistant',
    'assistant': 'ai-assistant',
    'notifications': 'reminders',
    'notification': 'reminders',
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
    'dashboard': 'dashboard'
  };

  let page: 'home' | 'about' | 'login' | 'register' | 'dashboard' = 'home';
  let nav = savedNav || 'dashboard';

  if (target && navMap[target]) {
    page = 'dashboard';
    nav = navMap[target];
  } else if (path === '/about') {
    page = 'about';
  } else if (path === '/login') {
    page = 'login';
  } else if (path === '/register') {
    page = 'register';
  } else if (savedPage === 'dashboard') {
    page = 'dashboard';
  } else if (savedPage && ['home', 'about', 'login', 'register'].includes(savedPage)) {
    page = savedPage;
  }

  let loggedIn = true;
  if (savedLoggedIn !== null) {
    try {
      loggedIn = JSON.parse(savedLoggedIn);
    } catch (e) {
      console.error(e);
    }
  }

  let userData = DEFAULT_PATIENT_USER;
  if (savedUser) {
    try {
      userData = JSON.parse(savedUser) || DEFAULT_PATIENT_USER;
    } catch (e) {
      console.error(e);
    }
  }

  return { page, nav, loggedIn, userData };
};

export const App: React.FC = () => {
  const initialState = getInitialAppState();

  // Page & User States
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'login' | 'register' | 'dashboard'>(initialState.page);
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.loggedIn);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    abhaId: string;
    bloodGroup: string;
    age: number;
  } | null>(initialState.userData);
  const [initialNavId, setInitialNavId] = useState<string>(initialState.nav);

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

    const targetUrl = getURLPathForRoute(currentPage, initialNavId);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  }, [currentPage, initialNavId, isLoggedIn, user]);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [abhaModalOpen, setAbhaModalOpen] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const handleSuccessLogin = (userData: { name: string; email: string; abhaId?: string }) => {
    const newUser = {
      name: userData.name || 'Lalith Patel',
      email: userData.email || 'lalith.patel@abdm.in',
      role: 'Patient',
      abhaId: userData.abhaId || '91-8472-9104-5821@abdm',
      bloodGroup: 'O+',
      age: 34
    };
    setIsLoggedIn(true);
    setUser(newUser);
    setCurrentPage('dashboard');
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
    history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (id === 'dashboard' || id === 'profile' || id === 'records' || id === 'appointments' || id === 'appointment' || id === 'medicines' || id === 'medicine' || id === 'insurance' || id === 'scan' || id === 'hospitals' || id === 'nearby-hospitals' || id === 'pharmacy' || id === 'consultation' || id === 'video-consultation' || id === 'reminders' || id === 'reminder' || id === 'notifications' || id === 'notification' || id === 'analytics' || id === 'health-analytics' || id === 'family' || id === 'family-connect' || id === 'checkup' || id === 'health-checkup') {
      const normalizedId = (id === 'appointment') ? 'appointments' : (id === 'medicine') ? 'medicines' : (id === 'video-consultation') ? 'consultation' : (id === 'reminder' || id === 'notification' || id === 'notifications') ? 'reminders' : (id === 'health-analytics') ? 'analytics' : (id === 'family-connect') ? 'family' : (id === 'health-checkup') ? 'checkup' : (id === 'nearby-hospitals') ? 'hospitals' : id;
      setInitialNavId(normalizedId);
      setCurrentPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'instant' });
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
    if (id === 'abha') {
      const element = document.getElementById('abha');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (id === 'contact' || id === 'appointment') {
      const element = document.getElementById('appointment');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = () => {
    handleNavigate('register');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 selection:bg-[#0f3980] selection:text-white">
        
        {/* HEADER & TOP BAR (HIDE ON DASHBOARD) */}
        {currentPage !== 'dashboard' && (
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
          <LoginPage 
            onNavigateHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            onSuccessLogin={handleSuccessLogin}
          />
        ) : currentPage === 'register' ? (
          <RegisterPage 
            onNavigateHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            onSuccessLogin={handleSuccessLogin}
          />
        ) : currentPage === 'dashboard' ? (
          <DashboardPage
            user={user || undefined}
            initialNavId={initialNavId}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
            onOpenAbhaModal={() => setAbhaModalOpen(true)}
          />
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

            {/* FINAL HIGH-CONVERSION CTA */}
            <FinalCTA 
              onStartJourney={() => handleNavigate('register')} 
              onExploreFeatures={() => handleNavigate('features')} 
            />
          </main>
        )}

        {/* FOOTER (HIDE ON DASHBOARD) */}
        {currentPage !== 'dashboard' && <Footer onNavigate={handleNavigate} />}

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



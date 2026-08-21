import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Header } from './components/landing/Header';
import { Hero } from './components/landing/Hero';
import { TrustBar } from './components/landing/TrustBar';
import { AboutHospital } from './components/landing/AboutHospital';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { DoctorSection } from './components/landing/DoctorSection';
import { AppointmentSection } from './components/landing/AppointmentSection';
import { ABHASection } from './components/landing/ABHASection';
import { FinalCTA } from './components/landing/FinalCTA';
import { Footer } from './components/landing/Footer';

// MODALS
import { ABHAModal } from './components/modals/ABHAModal';
import { ConsentModal } from './components/modals/ConsentModal';
import { EmergencyQRModal } from './components/modals/EmergencyQRModal';
import { AuthModal } from './components/modals/AuthModal';

export const App: React.FC = () => {
  // Modal States
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'signup',
  });
  const [abhaModalOpen, setAbhaModalOpen] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

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

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModal({ open: true, mode });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 selection:bg-[#0f3980] selection:text-white">
        
        {/* HEADER & TOP BAR */}
        <Header 
          onOpenAuth={handleOpenAuth} 
          onNavigate={scrollToSection} 
        />

        {/* MAIN LANDING CONTENT */}
        <main>
          {/* HERO SECTION */}
          <Hero 
            onStartJourney={() => scrollToSection('services')} 
            onSeeHowItWorks={() => scrollToSection('about')} 
          />

          {/* TRUST BENEFIT BAR */}
          <TrustBar />

          {/* ABOUT US */}
          <AboutHospital 
            onLearnMore={() => scrollToSection('services')} 
          />

          {/* FEATURES SECTION */}
          <FeaturesSection 
            onExploreFeature={() => scrollToSection('abha')} 
          />

          {/* MEET OUR DOCTORS */}
          <DoctorSection 
            onOpenDoctorPortal={() => handleOpenAuth('login')} 
          />

          {/* ABHA DIGITAL HEALTH CONNECTION */}
          <ABHASection onManageConnection={() => setAbhaModalOpen(true)} />

          {/* APPOINTMENT FORM & HEALTH PACKAGES */}
          <AppointmentSection />

          {/* FINAL HIGH-CONVERSION CTA */}
          <FinalCTA 
            onStartJourney={() => handleOpenAuth('signup')} 
            onExploreFeatures={() => scrollToSection('services')} 
          />
        </main>

        {/* FOOTER */}
        <Footer onNavigate={scrollToSection} />

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
          isOpen={authModal.open} 
          mode={authModal.mode} 
          onClose={() => setAuthModal({ open: false, mode: 'signup' })} 
        />
      </div>
    </ThemeProvider>
  );
};

export default App;



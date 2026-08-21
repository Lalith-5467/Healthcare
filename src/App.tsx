import React, { useState } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Header } from './components/landing/Header';
import { Hero } from './components/landing/Hero';
import { TrustBar } from './components/landing/TrustBar';
import { MedicalServices } from './components/landing/MedicalServices';
import { EmergencyCard } from './components/landing/EmergencyCard';
import { CareCircle } from './components/landing/CareCircle';
import { AccessibilitySection } from './components/landing/AccessibilitySection';
import { FutureRoadmap } from './components/landing/FutureRoadmap';
import { AboutHospital } from './components/landing/AboutHospital';
import { DoctorSection } from './components/landing/DoctorSection';
import { QuickActionCards } from './components/landing/QuickActionCards';
import { AppointmentSection } from './components/landing/AppointmentSection';
import { TestimonialsArticlesFAQ } from './components/landing/TestimonialsArticlesFAQ';
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
    if (id === 'abha') {
      setAbhaModalOpen(true);
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

          {/* MEDICAL SERVICES & CAPABILITIES GRID */}
          <MedicalServices 
            onSelectService={(serviceId) => scrollToSection(serviceId || 'services')} 
          />

          {/* CAREGIVER & FAMILY COMPANION */}
          <CareCircle 
            onManageConsent={() => setConsentModalOpen(true)} 
          />

          {/* EMERGENCY SOS CARD */}
          <EmergencyCard 
            onScanQR={() => setEmergencyModalOpen(true)} 
          />

          {/* ACCESSIBILITY & ELDER CARE */}
          <AccessibilitySection />

          {/* FUTURE PRODUCT INNOVATION ROADMAP */}
          <FutureRoadmap />

          {/* ABOUT OUR PLATFORM */}
          <AboutHospital 
            onLearnMore={() => scrollToSection('services')} 
          />

          {/* MEET OUR DOCTORS */}
          <DoctorSection 
            onOpenDoctorPortal={() => handleOpenAuth('login')} 
          />

          {/* 3-CARD QUICK ACTIONS */}
          <QuickActionCards 
            onNavigate={scrollToSection} 
          />

          {/* APPOINTMENT FORM & HEALTH PACKAGES */}
          <AppointmentSection />

          {/* TESTIMONIALS, ARTICLES & FAQ */}
          <TestimonialsArticlesFAQ />

          {/* ABHA DIGITAL HEALTH CONNECTION */}
          <ABHASection onManageConnection={() => setAbhaModalOpen(true)} />

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



import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from '../ui/SocialIcons';
import { useSiteConfig } from '../../context/ConfigContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  isLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isLoggedIn = false }) => {
  let footerConfig: any = null;
  try {
    const siteConfig = useSiteConfig();
    footerConfig = siteConfig.footer;
  } catch {}

  const footerText = footerConfig?.footerText || '© 2026 MediCare Digital Health Record (DHR). All rights reserved.';
  const aboutText = footerConfig?.aboutText || 'Personal Health Record & Caregiver Companion platform. Empowering patients to securely store medical records, manage medications, and connect with trusted family members and healthcare providers.';
  const socialLinks = footerConfig?.socialLinks || {};
  const sectionVisibility = footerConfig?.sectionVisibility || { brand: true, product: true, care: true, account: true };

  const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('auth_token')) : null;
  const isUserAuthenticated = Boolean(isLoggedIn && token);

  const handleFooterClick = (e: React.MouseEvent, targetNav: string = 'login') => {
    e.preventDefault();
    if (!isUserAuthenticated) {
      // Unauthenticated visitor: ALWAYS redirect to the existing Login/Register page!
      const authRoute = targetNav === 'register' ? 'register' : 'login';
      onNavigate(authRoute);
      return;
    }
    // Authenticated user: navigate to the intended destination
    onNavigate(targetNav);
  };

  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.preventDefault();
    if (!isUserAuthenticated) {
      onNavigate('login');
      return;
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#091322] via-[#07111e] to-[#040a12] text-slate-300 border-t border-slate-800/80 relative z-10 select-none font-sans">
      
      {/* MAIN FOOTER LINKS */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* BRAND & ABOUT */}
        {sectionVisibility.brand !== false && (
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => handleFooterClick(e, 'home')}>
              <Logo variant="dark" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              {aboutText}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="#facebook" 
                onClick={(e) => handleSocialClick(e, socialLinks.facebook || 'https://facebook.com')} 
                className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm cursor-pointer" 
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="#twitter" 
                onClick={(e) => handleSocialClick(e, socialLinks.twitter || 'https://twitter.com')} 
                className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm cursor-pointer" 
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a 
                href="#linkedin" 
                onClick={(e) => handleSocialClick(e, socialLinks.linkedin || 'https://linkedin.com')} 
                className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm cursor-pointer" 
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a 
                href="#instagram" 
                onClick={(e) => handleSocialClick(e, socialLinks.instagram || 'https://instagram.com')} 
                className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm cursor-pointer" 
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* PRODUCT */}
        {sectionVisibility.product !== false && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#records" onClick={(e) => handleFooterClick(e, 'records')} className="hover:text-cyan-300 transition-colors">Medical Records</a></li>
              <li><a href="#timeline" onClick={(e) => handleFooterClick(e, 'timeline')} className="hover:text-cyan-300 transition-colors">Health Timeline</a></li>
              <li><a href="#medication" onClick={(e) => handleFooterClick(e, 'medication')} className="hover:text-cyan-300 transition-colors">Medicine Reminder</a></li>
              <li><a href="#doctor-sharing" onClick={(e) => handleFooterClick(e, 'records')} className="hover:text-cyan-300 transition-colors">Doctor Sharing</a></li>
              <li><a href="#emergency-sos" onClick={(e) => handleFooterClick(e, 'emergency-sos')} className="hover:text-cyan-300 transition-colors">Emergency SOS</a></li>
            </ul>
          </div>
        )}

        {/* CARE */}
        {sectionVisibility.care !== false && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#caregiver" onClick={(e) => handleFooterClick(e, 'caregiver')} className="hover:text-cyan-300 transition-colors">Caregiver Support</a></li>
              <li><a href="#doctors" onClick={(e) => handleFooterClick(e, 'doctors')} className="hover:text-cyan-300 transition-colors">Doctors</a></li>
              <li><a href="#features" onClick={(e) => handleFooterClick(e, 'features')} className="hover:text-cyan-300 transition-colors">Nurse Booking</a></li>
              <li><a href="#features" onClick={(e) => handleFooterClick(e, 'features')} className="hover:text-cyan-300 transition-colors">Home Care</a></li>
            </ul>
          </div>
        )}

        {/* ACCOUNT */}
        {sectionVisibility.account !== false && (
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Account & Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#login" onClick={(e) => handleFooterClick(e, 'login')} className="hover:text-white transition-colors">Sign In</a></li>
              <li><a href="#register" onClick={(e) => handleFooterClick(e, 'register')} className="hover:text-white transition-colors">Create Account</a></li>
              <li><a href="#about" onClick={(e) => handleFooterClick(e, 'about')} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#features" onClick={(e) => handleFooterClick(e, 'features')} className="hover:text-white transition-colors">Health Features</a></li>
              <li><a href="#privacy" onClick={(e) => handleFooterClick(e, 'privacy')} className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        )}

      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{footerText}</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">Patient Privacy & ABDM Certified Platform</span>
            <button
              onClick={scrollToTop}
              aria-label="Back to Top"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-slate-700/80 hover:border-teal-500/40"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};

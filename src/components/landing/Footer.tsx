import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from '../ui/SocialIcons';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#091322] via-[#07111e] to-[#040a12] text-slate-300 border-t border-slate-800/80 relative z-10 select-none font-sans">
      
      {/* MAIN FOOTER LINKS */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* BRAND & ABOUT */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo variant="dark" showBadge />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
            Personal Health Record & Caregiver Companion platform. Empowering patients to securely store medical records, manage medications, and connect with trusted family members and healthcare providers.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm" aria-label="Facebook"><FacebookIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm" aria-label="Twitter"><TwitterIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm" aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60 shadow-sm" aria-label="Instagram"><InstagramIcon className="w-4 h-4" /></a>
          </div>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li><a href="#records" onClick={(e) => { e.preventDefault(); onNavigate('records'); }} className="hover:text-cyan-300 transition-colors">Medical Records</a></li>
            <li><a href="#timeline" onClick={(e) => { e.preventDefault(); onNavigate('timeline'); }} className="hover:text-cyan-300 transition-colors">Health Timeline</a></li>
            <li><a href="#medication" onClick={(e) => { e.preventDefault(); onNavigate('medication'); }} className="hover:text-cyan-300 transition-colors">Medicine Reminder</a></li>
            <li><a href="#doctor-sharing" onClick={(e) => { e.preventDefault(); onNavigate('records'); }} className="hover:text-cyan-300 transition-colors">Doctor Sharing</a></li>
            <li><a href="#emergency-sos" onClick={(e) => { e.preventDefault(); onNavigate('emergency-sos'); }} className="hover:text-cyan-300 transition-colors">Emergency SOS</a></li>
          </ul>
        </div>

        {/* CARE */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Care</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li><a href="#caregiver" onClick={(e) => { e.preventDefault(); onNavigate('caregiver'); }} className="hover:text-cyan-300 transition-colors">Caregiver Support</a></li>
            <li><a href="#doctors" onClick={(e) => { e.preventDefault(); onNavigate('doctors'); }} className="hover:text-cyan-300 transition-colors">Doctors</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-cyan-300 transition-colors">Nurse Booking</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-cyan-300 transition-colors">Home Care</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Account & Links</h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li><a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="hover:text-white transition-colors">Sign In</a></li>
            <li><a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} className="hover:text-white transition-colors">Create Account</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-white transition-colors">Health Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediCare Health Technology. All Rights Reserved.</p>
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

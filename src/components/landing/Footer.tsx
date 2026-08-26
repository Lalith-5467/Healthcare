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
    <footer className="bg-[#0b1120] text-slate-300 border-t border-slate-800 relative z-10">
      
      {/* HEADER STRIP IN FOOTER */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* HEADER LOGO IN FOOTER */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo variant="dark" showBadge />
          </div>

          {/* QUICK NAV BAR IN FOOTER */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-[#00a896] transition-colors">Home</button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#00a896] transition-colors">About Us</button>
            <button onClick={() => onNavigate('features')} className="hover:text-[#00a896] transition-colors">Features</button>
            <button onClick={() => onNavigate('doctors')} className="hover:text-[#00a896] transition-colors">Doctors</button>
            <button onClick={() => onNavigate('abha')} className="hover:text-[#00a896] transition-colors">ABHA</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => onNavigate('login')} className="text-[#00a896] font-bold hover:underline">Sign In</button>
            <button onClick={() => onNavigate('register')} className="text-white font-bold hover:underline">Register</button>
          </div>

          {/* BACK TO TOP BUTTON */}
          <button
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-[#00a896] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-teal-500/20"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN FOOTER LINKS */}
      <div className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* BRAND & ABOUT */}
        <div className="md:col-span-2 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Personal Health Record & Caregiver Companion platform. Empowering patients to securely store medical records, manage medications, and connect with trusted family members and healthcare providers.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Facebook"><FacebookIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Twitter"><TwitterIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#00a896] text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram"><InstagramIcon className="w-4 h-4" /></a>
          </div>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#records" onClick={(e) => { e.preventDefault(); onNavigate('records'); }} className="hover:text-cyan-400 transition-colors">Medical Records</a></li>
            <li><a href="#timeline" onClick={(e) => { e.preventDefault(); onNavigate('timeline'); }} className="hover:text-cyan-400 transition-colors">Health Timeline</a></li>
            <li><a href="#medication" onClick={(e) => { e.preventDefault(); onNavigate('medication'); }} className="hover:text-cyan-400 transition-colors">Medicine Reminder</a></li>
            <li><a href="#doctor-sharing" onClick={(e) => { e.preventDefault(); onNavigate('records'); }} className="hover:text-cyan-400 transition-colors">Doctor Sharing</a></li>
            <li><a href="#emergency-sos" onClick={(e) => { e.preventDefault(); onNavigate('emergency-sos'); }} className="hover:text-cyan-400 transition-colors">Emergency SOS</a></li>
          </ul>
        </div>

        {/* CARE */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Care</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#caregiver" onClick={(e) => { e.preventDefault(); onNavigate('caregiver'); }} className="hover:text-cyan-400 transition-colors">Caregiver Support</a></li>
            <li><a href="#doctors" onClick={(e) => { e.preventDefault(); onNavigate('doctors'); }} className="hover:text-cyan-400 transition-colors">Doctors</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-cyan-400 transition-colors">Nurse Booking</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-cyan-400 transition-colors">Home Care</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Account & Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="hover:text-white transition-colors">Sign In</a></li>
            <li><a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} className="hover:text-white transition-colors">Create Account</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigate('features'); }} className="hover:text-white transition-colors">Health Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediCare Health Technology. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Patient Privacy & ABDM Certified Platform</span>
          </p>
        </div>
      </div>

    </footer>
  );
};

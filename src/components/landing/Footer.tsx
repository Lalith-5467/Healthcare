import React from 'react';
import { Activity } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from '../ui/SocialIcons';


interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b1120] text-slate-300 border-t border-slate-800">
      
      {/* MAIN FOOTER LINKS */}
      <div className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* BRAND & ABOUT */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f3980] dark:bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Medi<span className="text-blue-400">Care</span>
            </span>
          </div>
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
            <li><a href="#roadmap" onClick={(e) => { e.preventDefault(); onNavigate('roadmap'); }} className="hover:text-cyan-400 transition-colors">Nurse Booking</a></li>
            <li><a href="#roadmap" onClick={(e) => { e.preventDefault(); onNavigate('roadmap'); }} className="hover:text-cyan-400 transition-colors">Home Care</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#appointment" onClick={(e) => { e.preventDefault(); onNavigate('appointment'); }} className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); onNavigate('faq'); }} className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediCare Health Technology. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Patient Privacy & ABDM ABDM Certified</span>
          </p>
        </div>
      </div>

    </footer>
  );
};


import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Calendar, 
  ChevronDown, 
  Activity, 
  Search,
  FileText,
  Clock,
  Pill,
  Share2,
  AlertTriangle,
  HeartPulse,
  Users,
  Bot,
  UserCheck,
  Watch,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const megaMenuServices = [
    {
      id: 'medical-records',
      title: 'Medical Records',
      desc: 'Securely store medical reports and documents.',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      id: 'timeline',
      title: 'Health Timeline',
      desc: 'View medical history and health events chronologically.',
      icon: Clock,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/40 dark:text-teal-300',
    },
    {
      id: 'medication',
      title: 'Medicine Reminders',
      desc: 'Manage medicines and receive reminders.',
      icon: Pill,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/40 dark:text-purple-300',
    },
    {
      id: 'doctor-sharing',
      title: 'Doctor Sharing',
      desc: 'Securely share medical records using QR, Link or OTP.',
      icon: Share2,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300',
    },
    {
      id: 'emergency-sos',
      title: 'Emergency SOS',
      desc: 'Quickly access emergency health information.',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50 dark:bg-red-900/40 dark:text-red-300',
    },
    {
      id: 'vitals',
      title: 'Health Vitals',
      desc: 'Track and manage important health measurements.',
      icon: HeartPulse,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/40 dark:text-cyan-300',
    },
    {
      id: 'caregiver',
      title: 'Caregiver Support',
      desc: 'Allow trusted family members to monitor health activities.',
      icon: Users,
      color: 'text-[#00a896] bg-teal-50 dark:bg-teal-900/40 dark:text-teal-300',
    },
    {
      id: 'ai-assistance',
      title: 'AI Health Assistance',
      desc: 'Future AI-powered assistance and prescription scanning.',
      icon: Bot,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/40 dark:text-amber-300',
    },
    {
      id: 'home-care',
      title: 'Nurse & Home Care',
      desc: 'Future nurse, caretaker and home doctor booking.',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    {
      id: 'wearables',
      title: 'Wearable Integration',
      desc: 'Future smartwatch and medical device integration.',
      icon: Watch,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/40 dark:text-sky-300',
    },
  ];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services', isMega: true },
    { id: 'records', label: 'Health Records' },
    { id: 'caregiver', label: 'Caregiver' },
    { id: 'appointment', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-[1000] w-full transition-all duration-300">
      {/* MAIN NAVBAR */}
      <div
        className={`bg-white dark:bg-[#0b1120] transition-all duration-300 border-b ${
          scrolled ? 'shadow-md border-slate-200 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800/80'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* BRAND LOGO */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
            aria-label="MediCare Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00a896] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Medi<span className="text-[#00a896]">Care</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Healthcare & Medical
              </span>
            </div>
          </button>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-7 relative">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.isMega) {
                return (
                  <div 
                    key={item.id}
                    className="relative group py-2"
                    onMouseEnter={() => setServicesMenuOpen(true)}
                    onMouseLeave={() => setServicesMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick('services')}
                      className={`text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer py-1 ${
                        isActive || servicesMenuOpen
                          ? 'text-[#00a896] font-bold'
                          : 'text-slate-600 dark:text-slate-300 font-semibold hover:text-[#00a896] dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180 text-[#00a896]' : 'opacity-60'}`} />
                    </button>

                    {/* SERVICES MEGA MENU */}
                    {servicesMenuOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-[840px] p-6 bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-3.5 z-50">
                        <div className="col-span-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-1 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00a896]">Personal Health Platform Services</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive tools for patient record management & caregiver monitoring</p>
                          </div>
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#00a896]">PHR Ecosystem</span>
                        </div>

                        {megaMenuServices.map((service) => {
                          const IconComp = service.icon;
                          return (
                            <button
                              key={service.id}
                              onClick={() => handleNavClick(service.id)}
                              className="group/item flex items-start gap-3 p-3 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60"
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${service.color} transition-transform group-hover/item:scale-110`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-[#00a896] transition-colors">
                                    {service.title}
                                  </h5>
                                  <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
                                  {service.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm transition-colors duration-200 relative py-1 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'text-[#00a896] font-bold'
                      : 'text-slate-600 dark:text-slate-300 font-semibold hover:text-[#00a896] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00a896] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {/* SEARCH ICON BUTTON */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                title="Search health records and features"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search records, SOS, medicine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* LOGIN / AUTH */}
            <button
              onClick={() => onOpenAuth('login')}
              className="h-10 px-4 text-sm font-bold text-[#00a896] hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            >
              Sign In
            </button>

            {/* BOOK APPOINTMENT CTA */}
            <button
              onClick={() => onNavigate('appointment')}
              className="h-10 px-5 text-sm font-bold text-white bg-[#00a896] hover:bg-[#00897b] rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 p-6 shadow-xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                  activeTab === item.id
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00a896]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="w-full py-2.5 text-center text-sm font-bold text-[#00a896] bg-teal-50 dark:bg-teal-950/50 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('appointment'); }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-[#00a896] hover:bg-[#00897b] rounded-lg shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};



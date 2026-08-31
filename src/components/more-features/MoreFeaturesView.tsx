import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import { 
  Grid, 
  Sparkles, 
  Sparkle,
  TestTube2, 
  Utensils, 
  Bot, 
  FileSearch, 
  UserPlus2, 
  ShieldCheck, 
  Sparkles as JanitorIcon, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Search, 
  Filter, 
  Shield, 
  Lock, 
  PhoneCall, 
  X,
  ChevronRight,
  Activity,
  Heart,
  BadgeCheck,
  HelpCircle
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface MoreFeaturesViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const MoreFeaturesView: React.FC<MoreFeaturesViewProps> = ({
  user: _user,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Clinical Services' | 'AI & Diagnostics' | 'Security'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States for Modals
  const [bookingDate, setBookingDate] = useState('2026-08-26');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [selectedPackage, setSelectedPackage] = useState('Full Body Health Checkup');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const featureCards = [
    {
      id: 'janitor',
      title: 'Janitor & Sterilization Booking',
      category: 'Clinical Services',
      description: 'Professional medical-grade home cleaning, room sterilization & post-op hospital hygiene care.',
      icon: JanitorIcon,
      badge: 'Sanitised Clean',
      color: 'from-[#00a896] to-cyan-600',
      badgeBg: 'bg-[#00a896]/15 text-[#00a896] dark:text-cyan-300 border-teal-500/30',
      rating: '4.9 ★ (1,240+ Bookings)',
      actionText: 'Book Janitor Service',
      highlights: ['Hospital-Grade UV Disinfection', 'Chemical-Free Sterilization', 'Trained Medical Janitors']
    },
    {
      id: 'lab-tests',
      title: 'Lab Tests & Diagnostics',
      category: 'Clinical Services',
      description: 'Book diagnostic blood tests, pathology packages & home sample collection with certified labs.',
      icon: TestTube2,
      badge: 'Home Collection',
      color: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      rating: '4.9 ★ (8,500+ Samples)',
      actionText: 'Schedule Lab Test',
      highlights: ['NABL Certified Labs', 'E-Report in 6 Hours', 'Free Home Sample Pickup']
    },
    {
      id: 'diet-plans',
      title: 'Diet & Nutrition Plans',
      category: 'AI & Diagnostics',
      description: 'Personalized clinical meal charts, macro tracker & nutritionist consultation for diabetes & wellness.',
      icon: Utensils,
      badge: 'Clinical Diet',
      color: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      rating: '4.8 ★ (3,100+ Diets Active)',
      actionText: 'View My Diet Chart',
      highlights: ['AI Calorie Counter', 'Diabetes Friendly Meals', 'Weekly Nutritionist Call']
    },
    {
      id: 'ai-chat',
      title: 'AI Health Chat Assistant',
      category: 'AI & Diagnostics',
      description: '24/7 instant AI symptom checker, prescription explanation, and triage health guidance.',
      icon: Bot,
      badge: '24/7 Instant AI',
      color: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      rating: '4.9 ★ (Instant Triage)',
      actionText: 'Start AI Chat',
      highlights: ['Medication Triage Advice', 'Multi-lingual Support', 'ABDM Verified Knowledge']
    },
    {
      id: 'reports-insights',
      title: 'Reports Insights & AI Analysis',
      category: 'AI & Diagnostics',
      description: 'Upload any medical report to receive a simplified AI translation, trend graph & doctor summary.',
      icon: FileSearch,
      badge: 'Smart Translator',
      color: 'from-amber-600 to-orange-600',
      badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      rating: '4.9 ★ (Instant Analysis)',
      actionText: 'Analyze Medical Report',
      highlights: ['Jargon-Free Explanations', 'Biometric Trend Graphs', 'ABDM Record Integration']
    },
    {
      id: 'nurse-booking',
      title: 'In-Home Nurse Booking',
      category: 'Clinical Services',
      description: 'Certified home nursing care for post-operative care, IV therapy, wound dressing & elderly care.',
      icon: UserPlus2,
      badge: 'Certified Nurses',
      color: 'from-rose-600 to-pink-600',
      badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      rating: '4.9 ★ (980+ Nurses Active)',
      actionText: 'Book In-Home Nurse',
      highlights: ['Background Verified Staff', '24/7 & Shift Based Care', 'Vital Monitoring Included']
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy Vault',
      category: 'Security',
      description: 'Manage 256-bit ABDM encryption, consent authorizations, data sharing controls & security logs.',
      icon: ShieldCheck,
      badge: '256-bit ABDM Vault',
      color: 'from-cyan-600 to-blue-700',
      badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
      rating: '100% Encrypted & ISO Certified',
      actionText: 'Manage Vault Settings',
      highlights: ['Instant Permission Revoke', 'HIPAA & ABDM Compliant', 'Granular Consent Log']
    }
  ];

  const filteredCards = featureCards.filter((card) => {
    if (activeCategory !== 'All' && card.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!card.title.toLowerCase().includes(q) && !card.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleCardClick = (cardId: string) => {
    if (cardId === 'ai-chat') {
      onNavigate('ai-assistant');
      return;
    }
    if (cardId === 'reports-insights') {
      onNavigate('records');
      return;
    }
    if (cardId === 'security-privacy') {
      onNavigate('settings');
      return;
    }
    setSelectedFeature(cardId);
  };

  const handleConfirmBooking = (serviceName: string) => {
    setSelectedFeature(null);
    showToast(`✓ Booking Confirmed for ${serviceName} on ${bookingDate} at ${bookingTime}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
      
      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#e0f7fa]/60 dark:from-slate-800 via-white dark:via-slate-900 to-[#e3f2fd]/60 dark:to-slate-800 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 pb-24 shadow-sm mb-[-60px]">
        {/* Background Decorative Mesh Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/40 dark:bg-cyan-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          {/* Left Text Content */}
          <div className="max-w-xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">More Healthcare Features</h1>
              <span className="px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Grid className="w-3.5 h-3.5" />
                Healthcare Marketplace
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed max-w-lg">
              Explore specialized clinical services, AI diagnostics, in-home care, and security controls — all in one place.
            </p>
          </div>

          {/* Right Abstract Graphic & Action Button */}
          <div className="flex flex-col items-end gap-8 w-full md:w-auto relative">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-full font-bold text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm dark:shadow-none cursor-pointer z-20"
            >
              <span>Back to Dashboard</span>
            </button>
            
            {/* Abstract Graphic representing the Doctor/Services */}
            <div className="relative w-48 h-32 hidden md:block">
              {/* Floating Orbs */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center animate-bounce duration-1000 -translate-x-6 -translate-y-4 z-10">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div className="absolute top-8 right-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center animate-bounce duration-1000 delay-150 translate-x-4 -translate-y-6 z-10">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <div className="absolute bottom-0 left-8 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center animate-bounce duration-1000 delay-300 -translate-y-2 z-10">
                <ShieldCheck className="w-7 h-7 text-emerald-500" />
              </div>
              {/* Abstract Avatar Placeholder */}
              <div className="absolute bottom-0 right-8 w-32 h-32 bg-gradient-to-t from-cyan-200 dark:from-cyan-900/50 to-cyan-50 dark:to-transparent rounded-full shadow-inner border-4 border-white dark:border-slate-800 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR (Floating) */}
      <div className="relative z-20 mx-4 sm:mx-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 sm:p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] font-sans">
        
        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto font-mono text-xs pl-2">
          {['All', 'Clinical Services', 'AI & Diagnostics', 'Security'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer font-sans whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#00a896] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SEARCH & FILTER BUTTON */}
        <div className="flex items-center gap-2 w-full md:w-auto pr-2">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search features (e.g. Lab, Janitor, Nurse)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm dark:shadow-none cursor-pointer shrink-0">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. FEATURE CARDS GRID (7 HIGHLIGHTED CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden flex flex-col justify-between group font-sans"
            >
              {/* GRADIENT DECORATION */}
              <div className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${card.color} opacity-[0.03] dark:opacity-[0.05] rounded-full blur-2xl pointer-events-none group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity`} />

              <div className="space-y-4 relative z-10">
                {/* TOP HEADER */}
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-full bg-gradient-to-br ${card.color} text-white shadow-lg shadow-current/20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                </div>

                {/* TITLE & DESCRIPTION */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-600 dark:text-slate-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>

                {/* HIGHLIGHT LIST */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {card.highlights.map((h, i) => {
                    const textCol = card.badgeBg.split(' ').find(c => c.startsWith('text-')) || 'text-[#00a896]';
                    return (
                      <div key={i} className="flex items-center gap-2.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <CheckCircle2 className={`w-4 h-4 ${textCol} shrink-0`} />
                        <span>{h}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTION & RATING */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{card.rating.replace('★', '')}</span>
                </div>

                <button
                  onClick={() => handleCardClick(card.id)}
                  className={`px-5 py-2 rounded-full bg-gradient-to-r ${card.color} hover:brightness-110 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer`}
                >
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
        {/* EMPTY SPACE GRAPHIC (Only on "All" view) */}
        {activeCategory === 'All' && (
          <div className="hidden md:flex lg:col-span-2 md:col-span-1 items-center justify-center rounded-3xl p-8 relative overflow-hidden group border border-transparent dark:border-slate-800 dark:bg-slate-900/30">
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/50 dark:from-cyan-900/10 to-transparent pointer-events-none" />
            
            <div className="relative w-64 h-48 flex items-center justify-center">
              {/* Base Pedestal */}
              <div className="absolute bottom-4 w-48 h-12 bg-white dark:bg-slate-800 rounded-[100%] shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-700" />
              <div className="absolute bottom-6 w-32 h-8 bg-slate-50 rounded-[100%] shadow-inner border border-slate-100" />
              
              {/* Central Shield */}
              <div className="relative z-10 w-24 h-28 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-2xl shadow-xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)' }}>
                <Lock className="w-10 h-10 text-slate-900 dark:text-white drop-shadow-md" />
              </div>
              
              {/* Floating Icons */}
              <div className="absolute top-4 left-4 p-2 bg-white rounded-xl shadow-lg animate-bounce duration-1000 z-0">
                <FileSearch className="w-5 h-5 text-teal-600" />
              </div>
              <div className="absolute top-10 right-2 p-2 bg-white rounded-xl shadow-lg animate-bounce duration-1000 delay-150 z-0">
                <Shield className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="absolute bottom-12 left-0 p-1.5 bg-white rounded-xl shadow-lg animate-bounce duration-1000 delay-300 z-20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. TRUST BADGES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 pb-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">Secure & Private</h4>
          <p className="text-[11px] font-medium text-slate-500 max-w-[160px]">Your privacy and data security are our priority.</p>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shadow-sm">
            <BadgeCheck className="w-6 h-6 text-orange-500" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">Trusted & Verified</h4>
          <p className="text-[11px] font-medium text-slate-500 max-w-[160px]">All services are verified and quality checked.</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shadow-sm">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">Expert Support</h4>
          <p className="text-[11px] font-medium text-slate-500 max-w-[160px]">24/7 support from our care specialists.</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">Safe & Reliable</h4>
          <p className="text-[11px] font-medium text-slate-500 max-w-[160px]">Advanced protocols for your complete safety.</p>
        </div>
      </div>

      {/* 4. MODALS & DRAWERS FOR ACTIONS */}

      {/* A. JANITOR BOOKING MODAL */}
      <AnimatePresence>
        {selectedFeature === 'janitor' && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-[#00a896]/15 text-[#00a896] dark:text-cyan-300">
                    <JanitorIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Medical Janitor Booking</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Book certified healthcare room sanitization & deep sterilization</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">Select Cleaning Service Type</label>
                  <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-white">
                    <option>Medical Grade Home Disinfection (Whole House)</option>
                    <option>Post-Hospitalization Patient Room Sanitization</option>
                    <option>UV-C Sterilization & Air Purification Treatment</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Time Slot</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold">
                      <option>09:00 AM</option>
                      <option>11:00 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-slate-700 dark:text-slate-200">
                <span className="font-extrabold text-[#00a896] dark:text-cyan-300 block">✓ Included in Package:</span>
                <span className="text-[11px] font-medium">Trained staff in PPE gear, non-toxic hospital chemicals, HEPA air scrubbers.</span>
              </div>

              <button
                onClick={() => handleConfirmBooking('Janitor Service')}
                className="w-full py-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Confirm Janitor Booking (₹1,499)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. LAB TESTS MODAL */}
      <AnimatePresence>
        {selectedFeature === 'lab-tests' && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    <TestTube2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Diagnostic Lab Test Booking</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Free home sample collection by phlebotomist</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">Select Lab Test Package</label>
                  <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-white">
                    <option>Full Body Master Health Checkup (84 Parameters)</option>
                    <option>Complete Blood Count (CBC) & HbA1c Diabetes Profile</option>
                    <option>Lipid Profile & Cardiac Risk Assessment</option>
                    <option>Vitamin D3 & B12 Deficiency Screening</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Sample Pickup Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Pickup Time</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold">
                      <option>07:00 AM (Fasting Required)</option>
                      <option>08:30 AM (Fasting Required)</option>
                      <option>10:00 AM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleConfirmBooking(selectedPackage)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Schedule Free Home Sample Collection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. DIET PLANS MODAL */}
      <AnimatePresence>
        {selectedFeature === 'diet-plans' && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Active Diet & Clinical Plan</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Curated by certified clinical nutritionists & AI macro engine</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono">
                {[
                  { meal: 'Breakfast (08:30 AM)', item: 'Oatmeal with Almonds & Low-GI Berries', cals: '340 kcal' },
                  { meal: 'Lunch (01:15 PM)', item: 'Quinoa Bowl, Grilled Chicken/Tofu & Spinach', cals: '520 kcal' },
                  { meal: 'Evening Snack (05:00 PM)', item: 'Green Tea & Roasted Makhana/Nuts', cals: '120 kcal' },
                  { meal: 'Dinner (08:00 PM)', item: 'Steamed Fish/Lentil Soup with Multigrain Roti', cals: '410 kcal' }
                ].map((m, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center font-sans">
                    <div>
                      <span className="font-extrabold text-[#00a896] dark:text-cyan-300 block text-xs">{m.meal}</span>
                      <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">{m.item}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">{m.cals}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedFeature(null);
                  showToast('✓ Diet Plan updated & sent to WhatsApp!');
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Download Weekly Meal Chart (PDF)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. NURSE BOOKING MODAL */}
      <AnimatePresence>
        {selectedFeature === 'nurse-booking' && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                    <UserPlus2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">In-Home Certified Nurse Booking</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Qualified nursing staff for post-op care, IV therapy & dressing</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFeature(null)} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-900 dark:text-white mb-1">Select Nursing Requirement</label>
                  <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-white">
                    <option>IV Drip Administration & Injection Procedure</option>
                    <option>Surgical Wound Dressing & Catheter Management</option>
                    <option>12-Hour Day Shift Elderly Nursing Care</option>
                    <option>24/7 Full Time In-Home Critical Nurse</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Start Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1">Time Slot</label>
                    <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold">
                      <option>Morning (08:00 AM)</option>
                      <option>Afternoon (01:00 PM)</option>
                      <option>Evening (06:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleConfirmBooking('In-Home Nurse')}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Confirm Nurse Booking (₹899 / Visit)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

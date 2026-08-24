import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Search,
  Filter,
  Navigation,
  Star,
  Clock,
  Heart,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Calendar,
  Share2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Activity,
  Pill,
  Users
} from 'lucide-react';
import type {
  HospitalItem,
  HospitalFilterState
} from './hospitalsData';
import {
  INITIAL_HOSPITALS,
  HOSPITAL_CATEGORIES
} from './hospitalsData';
import { HospitalMapSection } from './HospitalMapSection';
import { HospitalCard } from './HospitalCard';
import { HospitalDetailsDrawer } from './HospitalDetailsDrawer';
import { HospitalDirectionsModal } from './HospitalDirectionsModal';
import { HospitalCallModal } from './HospitalCallModal';
import { HospitalAppointmentModal } from './HospitalAppointmentModal';
import { HospitalShareFamilyModal } from './HospitalShareFamilyModal';
import { HospitalCompareModal } from './HospitalCompareModal';
import { HospitalFilterDrawer } from './HospitalFilterDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface HospitalsViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const HospitalsView: React.FC<HospitalsViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GEOLOCATION STATE
  const [locationStatus, setLocationStatus] = useState<'detected' | 'disabled' | 'default'>('detected');
  const [locationName, setLocationName] = useState<string>('Selaiyur, Chennai (12.9104, 80.1234)');

  // MAIN HOSPITALS STATE
  const [hospitals, setHospitals] = useState<HospitalItem[]>(INITIAL_HOSPITALS);
  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>([]);
  const [comparedHospitalIds, setComparedHospitalIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // SEARCH & CATEGORIES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<HospitalFilterState>({
    category: 'All',
    distanceRange: 'Any Distance',
    minRating: 'Any Rating',
    openNowOnly: false,
    emergencyOnly: false,
    sortBy: 'Nearest'
  });

  // MODAL TARGETS
  const [selectedHospital, setSelectedHospital] = useState<HospitalItem | null>(INITIAL_HOSPITALS[0]);
  const [detailsTarget, setDetailsTarget] = useState<HospitalItem | null>(null);
  const [directionsTarget, setDirectionsTarget] = useState<HospitalItem | null>(null);
  const [callTarget, setCallTarget] = useState<HospitalItem | null>(null);
  const [appointmentTarget, setAppointmentTarget] = useState<HospitalItem | null>(null);
  const [shareFamilyTarget, setShareFamilyTarget] = useState<HospitalItem | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedIdsStr = localStorage.getItem('user_saved_hospitals');
    if (savedIdsStr) {
      try {
        setSavedHospitalIds(JSON.parse(savedIdsStr));
      } catch (e) {
        console.error(e);
      }
    }
    const viewedIdsStr = localStorage.getItem('user_recently_viewed_hospitals');
    if (viewedIdsStr) {
      try {
        setRecentlyViewedIds(JSON.parse(viewedIdsStr));
      } catch (e) {
        console.error(e);
      }
    }

    // Attempt browser geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationStatus('detected');
          setLocationName(`Current Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        },
        () => {
          setLocationStatus('default');
          setLocationName('Selaiyur, Chennai (Default Location)');
        }
      );
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSave = (hosp: HospitalItem) => {
    let updated: string[];
    if (savedHospitalIds.includes(hosp.id)) {
      updated = savedHospitalIds.filter((id) => id !== hosp.id);
      showToast(`Removed ${hosp.name} from saved facilities`);
    } else {
      updated = [...savedHospitalIds, hosp.id];
      showToast(`✓ Saved ${hosp.name} to favorites`);
    }
    setSavedHospitalIds(updated);
    localStorage.setItem('user_saved_hospitals', JSON.stringify(updated));
  };

  const handleToggleCompare = (hosp: HospitalItem) => {
    if (comparedHospitalIds.includes(hosp.id)) {
      setComparedHospitalIds(comparedHospitalIds.filter((id) => id !== hosp.id));
    } else {
      if (comparedHospitalIds.length >= 3) {
        showToast('You can compare a maximum of 3 hospitals at once');
        return;
      }
      setComparedHospitalIds([...comparedHospitalIds, hosp.id]);
      showToast(`Added ${hosp.name} to comparison`);
    }
  };

  const handleOpenDetails = (hosp: HospitalItem) => {
    setDetailsTarget(hosp);
    // Log to recently viewed
    if (!recentlyViewedIds.includes(hosp.id)) {
      const updated = [hosp.id, ...recentlyViewedIds].slice(0, 4);
      setRecentlyViewedIds(updated);
      localStorage.setItem('user_recently_viewed_hospitals', JSON.stringify(updated));
    }
  };

  // FILTERED & SORTED HOSPITALS
  const filteredHospitals = hospitals.filter((hosp) => {
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Emergency' && !hosp.emergencyCare) return false;
      if (selectedCategory === 'Hospitals' && !hosp.type.includes('Hospital')) return false;
      if (selectedCategory === 'Clinics' && !hosp.type.includes('Clinic')) return false;
      if (selectedCategory === 'Diagnostics' && hosp.type !== 'Diagnostic Centre') return false;
      if (selectedCategory === 'Dental' && hosp.type !== 'Dental Clinic') return false;
    }

    if (filters.openNowOnly && hosp.status === 'Closed') return false;
    if (filters.emergencyOnly && !hosp.emergencyCare) return false;

    if (filters.distanceRange === 'Within 1 km' && hosp.distanceKm > 1.0) return false;
    if (filters.distanceRange === 'Within 3 km' && hosp.distanceKm > 3.0) return false;
    if (filters.distanceRange === 'Within 5 km' && hosp.distanceKm > 5.0) return false;

    if (filters.minRating === '4.5+' && hosp.rating < 4.5) return false;
    if (filters.minRating === '4.0+' && hosp.rating < 4.0) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = hosp.name.toLowerCase().includes(q);
      const matchType = hosp.type.toLowerCase().includes(q);
      const matchAddr = hosp.address.toLowerCase().includes(q);
      const matchSpec = hosp.specialties.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchType && !matchAddr && !matchSpec) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'Nearest') return a.distanceKm - b.distanceKm;
    if (filters.sortBy === 'Top Rated') return b.rating - a.rating;
    if (filters.sortBy === 'Most Reviewed') return b.reviewsCount - a.reviewsCount;
    if (filters.sortBy === 'Alphabetical') return a.name.localeCompare(b.name);
    return 0;
  });

  const comparedHospitals = hospitals.filter((h) => comparedHospitalIds.includes(h.id));
  const savedHospitals = hospitals.filter((h) => savedHospitalIds.includes(h.id));
  const recentlyViewedHospitals = hospitals.filter((h) => recentlyViewedIds.includes(h.id));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      {/* TOAST NOTIFICATION */}
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

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Nearby Hospitals</h1>
            <span className="px-3 py-1 text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full font-mono">
              📍 {locationStatus === 'detected' ? 'Location Detected' : 'Default Location'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover hospitals, clinics and healthcare facilities near your location.
          </p>
        </div>

        {/* LOCATION BUTTON */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setLocationStatus('detected');
                    setLocationName(`Current Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
                    showToast('📍 Updated to live GPS location');
                  },
                  () => showToast('Location permission unavailable. Using default mock location.')
                );
              }
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* 2. HERO SEARCH AREA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Find Healthcare Near You</h2>
          <p className="text-xs text-slate-400 font-mono">📍 {locationName}</p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, clinics, specialties (e.g. Cardiology)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
          </button>
        </div>

        {/* CATEGORY CHIPS (HORIZONTAL SCROLLABLE CONTAINER) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {HOSPITAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#00a896] to-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. FOUR SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Nearby Facilities</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">{filteredHospitals.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Listed</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Open Now</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {hospitals.filter((h) => h.status !== 'Closed').length}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Active</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Emergency Care</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              {hospitals.filter((h) => h.emergencyCare).length}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">24x7 Active</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Top Rated (4.5+)</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {hospitals.filter((h) => h.rating >= 4.5).length}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">High Care</span>
          </div>
        </div>
      </div>

      {/* 4. EMERGENCY ALERT SECTION */}
      <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-lg animate-pulse">
            🚨
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">Need Emergency Care?</h4>
            <p className="text-slate-300 text-xs mt-0.5">Filter facilities marked with 24x7 active emergency trauma bays.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('Emergency');
            setFilters({ ...filters, emergencyOnly: true });
            showToast('Showing 24x7 Emergency Trauma Hospitals');
          }}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md cursor-pointer self-stretch sm:self-auto text-center"
        >
          Show Emergency Hospitals
        </button>
      </div>

      {/* 5. MAP & HOSPITAL LIST CONTAINER */}
      <div className="space-y-4">
        {/* SORT BAR & VIEW MODE CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white">Hospitals Near You</h3>

          <div className="flex items-center gap-3 self-stretch sm:self-auto text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="Nearest">Nearest</option>
                <option value="Top Rated">Top Rated</option>
                <option value="Most Reviewed">Most Reviewed</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                List Only
              </button>
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <HospitalMapSection
          hospitals={filteredHospitals}
          selectedHospital={selectedHospital}
          onSelectHospital={(h) => setSelectedHospital(h)}
          onOpenDetails={handleOpenDetails}
          viewMode={viewMode}
          onChangeViewMode={(m) => setViewMode(m)}
        />

        {/* HOSPITAL CARDS GRID */}
        {filteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHospitals.map((hosp) => (
              <HospitalCard
                key={hosp.id}
                hospital={hosp}
                isSelected={selectedHospital?.id === hosp.id}
                isSaved={savedHospitalIds.includes(hosp.id)}
                isCompared={comparedHospitalIds.includes(hosp.id)}
                onSelect={(h) => setSelectedHospital(h)}
                onOpenDetails={handleOpenDetails}
                onOpenDirections={(h) => setDirectionsTarget(h)}
                onOpenCall={(h) => setCallTarget(h)}
                onToggleSave={handleToggleSave}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="font-extrabold text-white text-base">No hospitals match your search criteria</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your category chips, distance range, or clear search text to see available facilities.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFilters({ category: 'All', distanceRange: 'Any Distance', minRating: 'Any Rating', openNowOnly: false, emergencyOnly: false, sortBy: 'Nearest' });
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. COMPARISON STICKY BAR */}
      {comparedHospitalIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-purple-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-6 text-xs max-w-lg w-[92%] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-400 animate-ping" />
            <span className="font-bold text-white">{comparedHospitalIds.length} Hospitals Selected for Comparison</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedHospitalIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold cursor-pointer shadow-md"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* 7. SAVED HOSPITALS & RECENTLY VIEWED */}
      {savedHospitals.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Saved Favorite Facilities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {savedHospitals.map((sh) => (
              <div key={sh.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white">{sh.name}</h4>
                  <span className="text-[10px] text-teal-400 font-mono">★ {sh.rating} • {sh.distance}</span>
                </div>
                <button
                  onClick={() => handleOpenDetails(sh)}
                  className="px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 font-bold cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CROSS-MODULE CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('appointments')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Calendar className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">Book Doctor Appointment</h4>
          <p className="text-[11px] text-slate-400">Schedule clinic or video consultation →</p>
        </button>

        <button
          onClick={() => onNavigate('family')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Users className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">Share with Family Connect</h4>
          <p className="text-[11px] text-slate-400">Coordinate facility locations →</p>
        </button>

        <button
          onClick={() => onNavigate('checkup')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Activity className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">Health Check-Up Facilities</h4>
          <p className="text-[11px] text-slate-400">Complete wellness assessments →</p>
        </button>

        <button
          onClick={() => onNavigate('pharmacy')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Pill className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">Nearby Pharmacies</h4>
          <p className="text-[11px] text-slate-400">Track medication refill orders →</p>
        </button>
      </div>

      {/* MODALS & DRAWERS */}
      <HospitalDetailsDrawer
        hospital={detailsTarget}
        isOpen={!!detailsTarget}
        isSaved={detailsTarget ? savedHospitalIds.includes(detailsTarget.id) : false}
        onClose={() => setDetailsTarget(null)}
        onOpenDirections={(h) => setDirectionsTarget(h)}
        onOpenCall={(h) => setCallTarget(h)}
        onOpenAppointment={(h) => setAppointmentTarget(h)}
        onOpenShareFamily={(h) => setShareFamilyTarget(h)}
        onToggleSave={handleToggleSave}
      />

      <HospitalDirectionsModal
        hospital={directionsTarget}
        isOpen={!!directionsTarget}
        onClose={() => setDirectionsTarget(null)}
      />

      <HospitalCallModal
        hospital={callTarget}
        isOpen={!!callTarget}
        onClose={() => setCallTarget(null)}
      />

      <HospitalAppointmentModal
        hospital={appointmentTarget}
        isOpen={!!appointmentTarget}
        onClose={() => setAppointmentTarget(null)}
        onConfirmBooking={(hospName, dept, doc, date) => {
          showToast(`✓ Demo appointment request created at ${hospName} (${dept})`);
          setTimeout(() => onNavigate('appointments'), 1200);
        }}
      />

      <HospitalShareFamilyModal
        hospital={shareFamilyTarget}
        isOpen={!!shareFamilyTarget}
        onClose={() => setShareFamilyTarget(null)}
        onConfirmShare={(hospName, memberName) => {
          showToast(`✓ Shared ${hospName} with ${memberName}`);
        }}
      />

      <HospitalCompareModal
        hospitals={comparedHospitals}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onRemoveFromCompare={(id) => setComparedHospitalIds(comparedHospitalIds.filter((i) => i !== id))}
      />

      <HospitalFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ category: 'All', distanceRange: 'Any Distance', minRating: 'Any Rating', openNowOnly: false, emergencyOnly: false, sortBy: 'Nearest' })}
      />
    </div>
  );
};

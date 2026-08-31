import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Building2,
  MapPin,
  Search,
  Navigation,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  SlidersHorizontal,
  Activity,
  Pill,
  Users,
  Heart
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
  const [isLocating, setIsLocating] = useState(false);

  // MAIN HOSPITALS STATE
  const [hospitals] = useState<HospitalItem[]>(INITIAL_HOSPITALS);
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
          setLocationName(`Selaiyur, Chennai (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
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

  const handleDetectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLocationStatus('detected');
          setLocationName(`Selaiyur, Chennai (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
          showToast('✓ Detected your current location');
        },
        (_err) => {
          setIsLocating(false);
          setLocationStatus('default');
          setLocationName('Selaiyur, Chennai (Default Location)');
          showToast('Could not fetch GPS location. Using default location.');
        }
      );
    } else {
      setIsLocating(false);
      showToast('Geolocation is not supported by your browser.');
    }
  };

  const handleToggleSave = (hosp: HospitalItem, suppressToast: boolean = false) => {
    let updated: string[];
    if (savedHospitalIds.includes(hosp.id)) {
      updated = savedHospitalIds.filter((id) => id !== hosp.id);
      if (!suppressToast) showToast(`Removed ${hosp.name} from saved facilities`);
    } else {
      updated = [...savedHospitalIds, hosp.id];
      if (!suppressToast) showToast(`✓ Saved ${hosp.name} to favorites`);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20 font-sans">
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
      <PageHeader
        title="Nearby Hospitals & Clinics"
        subtitle="Find empanelled cashless hospitals, emergency centers and specialist clinics near you."
        badgeText={locationStatus === 'detected' ? 'Location Detected' : 'Default Location'}
        badgeIcon={<MapPin className="w-3.5 h-3.5" />}
        rightElement={
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Navigation className={`w-4 h-4 text-[#00a896] dark:text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
        }
      />

      {/* 2. HERO SEARCH AREA */}
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50/60 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-teal-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Find Healthcare Near You</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">📍 {locationName}</p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, clinics, specialties (e.g. Cardiology)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:border-[#00a896] shadow-inner"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
            <span>Filters</span>
          </button>
        </div>

        {/* CATEGORY CHIPS (HORIZONTAL SCROLLABLE CONTAINER) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-mono">
          {HOSPITAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer font-sans ${
                selectedCategory === cat
                  ? 'bg-[#00a896] text-white shadow-md'
                  : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. FOUR SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-[#00a896]/10 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-800/50 p-5 rounded-3xl space-y-2 shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 font-sans">Nearby Facilities</span>
            <Building2 className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400">{filteredHospitals.length}</span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold font-sans">Listed</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 p-5 rounded-3xl space-y-2 shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-sans">Open Now</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {hospitals.filter((h) => h.status !== 'Closed').length}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-sans">Active</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-rose-500/10 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-800/50 p-5 rounded-3xl space-y-2 shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 font-sans">Emergency Care</span>
            <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-400">
              {hospitals.filter((h) => h.emergencyCare).length}
            </span>
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold font-sans">24x7 Active</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-amber-500/10 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 p-5 rounded-3xl space-y-2 shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-sans">Top Rated (4.5+)</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-300">
              {hospitals.filter((h) => h.rating >= 4.5).length}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold font-sans">High Care</span>
          </div>
        </motion.div>
      </div>

      {/* 4. EMERGENCY ALERT SECTION */}
      <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-lg animate-pulse">
            🚨
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Need Emergency Care?</h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-medium">Filter facilities marked with 24x7 active emergency trauma bays.</p>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Hospitals Near You</h3>

          <div className="flex items-center gap-3 self-stretch sm:self-auto text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="Nearest">Nearest</option>
                <option value="Top Rated">Top Rated</option>
                <option value="Most Reviewed">Most Reviewed</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer font-sans ${
                  viewMode === 'split' ? 'bg-[#00a896] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer font-sans ${
                  viewMode === 'list' ? 'bg-[#00a896] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
          <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <Building2 className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No hospitals match your search criteria</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
              Try adjusting your category chips, distance range, or clear search text to see available facilities.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFilters({ category: 'All', distanceRange: 'Any Distance', minRating: 'Any Rating', openNowOnly: false, emergencyOnly: false, sortBy: 'Nearest' });
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[#00a896] dark:text-teal-300 font-bold text-xs cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. COMPARISON STICKY BAR */}
      {comparedHospitalIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-6 text-xs max-w-lg w-[92%] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
            <span className="font-bold text-slate-900 dark:text-white font-sans">{comparedHospitalIds.length} Hospitals Selected for Comparison</span>
          </div>

          <div className="flex items-center gap-2 font-sans">
            <button
              onClick={() => setComparedHospitalIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white font-extrabold cursor-pointer shadow-md"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* 7. SAVED HOSPITALS */}
      {savedHospitals.length > 0 && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Saved Favorite Facilities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {savedHospitals.map((sh) => (
              <div key={sh.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{sh.name}</h4>
                  <span className="text-[10px] text-[#00a896] dark:text-teal-400 font-mono font-bold">★ {sh.rating} • {sh.distance}</span>
                </div>
                <button
                  onClick={() => handleOpenDetails(sh)}
                  className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-[#00a896] dark:text-cyan-300 font-bold cursor-pointer"
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
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-[#00a896]/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Calendar className="w-5 h-5 text-[#00a896] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Book Doctor Appointment</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Schedule clinic or video consultation →</p>
        </button>

        <button
          onClick={() => onNavigate('family')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Users className="w-5 h-5 text-[#00a896] dark:text-teal-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Share with Family Connect</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Coordinate facility locations →</p>
        </button>

        <button
          onClick={() => onNavigate('checkup')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Health Check-Up Facilities</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Complete wellness assessments →</p>
        </button>

        <button
          onClick={() => onNavigate('pharmacy')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Nearby Pharmacies</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Track medication refill orders →</p>
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
        onConfirmBooking={(hospName, dept, _doc, _date) => {
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

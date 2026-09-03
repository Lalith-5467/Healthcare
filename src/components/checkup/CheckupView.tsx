import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Stethoscope,
  Clock,
  Calendar,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Heart,
  Activity,
  Smile,
  Pill,
  FileText,
  Sparkles
} from 'lucide-react';
import type {
  CheckupCategory,
  CheckupHistoryItem,
  CheckupAnswers
} from './checkupData';
import {
  INITIAL_CATEGORIES,
  INITIAL_CHECKUP_HISTORY
} from './checkupData';
import { CheckupWizardModal } from './CheckupWizardModal';
import { CheckupSummaryModal } from './CheckupSummaryModal';
import { CheckupHistoryDrawer } from './CheckupHistoryDrawer';
import { CheckupFilterDrawer } from './CheckupFilterDrawer';
import type { CheckupFilterState } from './CheckupFilterDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface CheckupViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const CheckupView: React.FC<CheckupViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MAIN STATE
  const [categories] = useState<CheckupCategory[]>(INITIAL_CATEGORIES);
  const [history, setHistory] = useState<CheckupHistoryItem[]>(INITIAL_CHECKUP_HISTORY);
  const [savedDraftStep, setSavedDraftStep] = useState<number | null>(null);
  const [_savedDraftAnswers, setSavedDraftAnswers] = useState<CheckupAnswers | null>(null);

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<CheckupFilterState>({
    checkupType: 'All',
    status: 'All',
    dateRange: 'All Time'
  });

  // MODAL TARGETS
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [summaryTarget, setSummaryTarget] = useState<CheckupHistoryItem | null>(null);
  const [historyDrawerTarget, setHistoryDrawerTarget] = useState<CheckupHistoryItem | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistoryStr = localStorage.getItem('user_checkup_history');
    if (savedHistoryStr) {
      try {
        setHistory(JSON.parse(savedHistoryStr));
      } catch (e) {
        console.error(e);
      }
    }

    const savedDraftStr = localStorage.getItem('user_checkup_draft');
    if (savedDraftStr) {
      try {
        const parsed = JSON.parse(savedDraftStr);
        setSavedDraftStep(parsed.step);
        setSavedDraftAnswers(parsed.answers);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveHistoryState = (updated: CheckupHistoryItem[]) => {
    setHistory(updated);
    localStorage.setItem('user_checkup_history', JSON.stringify(updated));
  };

  const handleSaveDraft = (step: number, answers: CheckupAnswers) => {
    setSavedDraftStep(step);
    setSavedDraftAnswers(answers);
    localStorage.setItem('user_checkup_draft', JSON.stringify({ step, answers }));
    showToast(`Draft saved at Step ${step}`);
  };

  const handleDiscardDraft = () => {
    setSavedDraftStep(null);
    setSavedDraftAnswers(null);
    localStorage.removeItem('user_checkup_draft');
    showToast('Check-up draft discarded');
  };

  const handleSubmitCompleted = (newRecord: CheckupHistoryItem) => {
    const updatedHistory = [newRecord, ...history];
    saveHistoryState(updatedHistory);
    // Clear draft if any
    setSavedDraftStep(null);
    setSavedDraftAnswers(null);
    localStorage.removeItem('user_checkup_draft');

    setWizardOpen(false);
    setSummaryTarget(newRecord);
    showToast('✓ Health Check-Up completed successfully!');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistoryState(updated);
    showToast('Check-up record deleted');
  };

  // FILTERED HISTORY
  const filteredHistory = history.filter((item) => {
    if (filters.checkupType !== 'All' && !item.type.includes(filters.checkupType)) return false;
    if (filters.status !== 'All' && item.status !== filters.status) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.type.toLowerCase().includes(q) && !item.date.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
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
        title="Health Check-Up Packages"
        subtitle="Complete a quick assessment to understand your current health status and vitals."
        badgeText="Guided Assessment"
        badgeIcon={<Stethoscope className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto font-sans">
            <button
              onClick={() => {
                const el = document.getElementById('history-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-200/40 dark:shadow-none"
            >
              <Clock className="w-4 h-4 text-teal-500" />
              <span>View History</span>
            </button>

            <button
              onClick={() => {
                setIsQuickMode(false);
                setWizardOpen(true);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Start Assessment</span>
            </button>
          </div>
        }
      />

      {/* 2. HERO CARD SECTION */}
      <div className="bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border border-transparent dark:border-slate-800 rounded-[2rem] p-6 sm:p-10 space-y-6 shadow-2xl shadow-teal-900/5 dark:shadow-none relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-400/10 dark:bg-teal-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/50 dark:bg-teal-500/10 border border-teal-200/50 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 font-mono text-[11px] font-extrabold shadow-sm">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Interactive Digital Health Check</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Start Your Health Check-Up</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Answer a few simple questions about your current health, wellness, sleep, hydration, and daily routine.
            </p>

            <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono pt-2">
              <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold bg-white/60 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg shadow-sm border border-white dark:border-slate-700">
                <Clock className="w-4 h-4" />
                <span>Est. Time: 5–7 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-bold bg-white/60 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg shadow-sm border border-white dark:border-slate-700">
                <FileText className="w-4 h-4" />
                <span>12 Questions</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold bg-white/60 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg shadow-sm border border-white dark:border-slate-700">
                <Calendar className="w-4 h-4" />
                <span>Last Check: 18 Aug 2026</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 self-stretch sm:self-auto font-sans w-full lg:w-auto">
            <button
              onClick={() => {
                setIsQuickMode(false);
                setWizardOpen(true);
              }}
              className="w-full lg:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm text-slate-900 dark:text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Check-Up (12 Steps)</span>
            </button>

            <button
              onClick={() => {
                setIsQuickMode(true);
                setWizardOpen(true);
              }}
              className="w-full lg:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Quick Check-Up (2 min)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. IN-PROGRESS DRAFT RESUME CARD */}
      {savedDraftStep && (
        <div className="bg-white/60 backdrop-blur-md border border-teal-100 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg shadow-teal-900/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <RotateCcw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Check-Up In Progress</h4>
              <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px] mt-0.5 font-bold">
                Saved at Step {savedDraftStep} of 12 ({Math.round((savedDraftStep / 12) * 100)}% completed)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto font-sans">
            <button
              onClick={handleDiscardDraft}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              Discard
            </button>
            <button
              onClick={() => {
                setIsQuickMode(false);
                setWizardOpen(true);
              }}
              className="px-4 py-2 rounded-xl font-extrabold text-slate-900 dark:text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-md shadow-teal-500/20 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Check-Up</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. CHECK-UP CATEGORY ANALYTICS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Health Assessment Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Overview of your current check-up completion status</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-500/10 px-4 py-2.5 rounded-xl border border-teal-100 dark:border-teal-500/20 shadow-sm">
               <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
               <span className="text-xs font-bold text-teal-800 dark:text-teal-300">Overall Progress:</span>
               <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                 {Math.round(categories.reduce((acc, cat) => acc + cat.progressPercentage, 0) / (categories.length || 1))}%
               </span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl flex flex-col items-center text-center space-y-4 shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="40" cy="40" r="34" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={213.6} 
                    strokeDashoffset={213.6 - (cat.progressPercentage / 100) * 213.6} 
                    strokeLinecap="round" 
                    className={`transition-all duration-1000 ease-out ${cat.status === 'Completed' ? 'text-emerald-400' : cat.status === 'In Progress' ? 'text-teal-400' : 'text-slate-200'}`} 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-teal-500 transition-colors drop-shadow-sm">
                  {cat.iconName === 'Stethoscope' && <Stethoscope className="w-7 h-7" />}
                  {cat.iconName === 'Heart' && <Heart className="w-7 h-7" />}
                  {cat.iconName === 'Activity' && <Activity className="w-7 h-7" />}
                  {cat.iconName === 'Smile' && <Smile className="w-7 h-7" />}
                  {cat.iconName === 'Pill' && <Pill className="w-7 h-7" />}
                  {cat.iconName === 'FileText' && <FileText className="w-7 h-7" />}
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono tracking-tighter">
                  {cat.progressPercentage}<span className="text-xs text-slate-500 dark:text-slate-400 ml-0.5">%</span>
                </div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs mt-1 leading-tight">{cat.title}</h4>
              </div>

              <span className={`text-[10px] font-extrabold font-mono px-3 py-1 rounded-full border shadow-sm w-full mt-auto ${
                cat.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : cat.status === 'In Progress'
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}>
                {cat.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SAFETY NOTICE BANNER */}
      <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs flex items-start gap-3 shadow-md shadow-amber-900/5">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
        <div className="space-y-0.5">
          <p className="font-extrabold text-sm">Important Notice & Medical Safety</p>
          <p className="text-[11px] opacity-90 leading-relaxed font-medium">
            This digital check-up is intended strictly for personal health tracking and wellness organization. It does not replace clinical evaluation, medical advice, diagnosis, or treatment from qualified healthcare professionals.
          </p>
        </div>
      </div>

      {/* 6. PREVIOUS CHECK-UPS HISTORY LOG */}
      <div id="history-section" className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Previous Check-Ups</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Review your past completed health assessments</p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-medium shadow-sm transition-all"
              />
            </div>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
            >
              <Filter className="w-4 h-4 text-teal-600" />
            </button>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {filteredHistory.map((item) => (
            <div key={item.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-teal-600 uppercase tracking-wider">{item.date} • {item.time}</span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">{item.type}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 font-bold">
                    Score: <strong className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded ml-1">{item.completionScore}%</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={() => setHistoryDrawerTarget(item)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteRecord(item.id)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 text-slate-500 dark:text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-100 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredHistory.length === 0 && (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium">
              No check-ups found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* 7. CROSS MODULE NAVIGATION CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('appointments')}
          className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 hover:border-teal-200 dark:hover:border-teal-500/50 rounded-3xl text-left space-y-3 transition-all cursor-pointer shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Appointments</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Schedule consultation →</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('medicines')}
          className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 hover:border-purple-200 dark:hover:border-purple-500/50 rounded-3xl text-left space-y-3 transition-all cursor-pointer shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Medicines</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Review prescriptions →</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('records')}
          className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 hover:border-amber-200 dark:hover:border-amber-500/50 rounded-3xl text-left space-y-3 transition-all cursor-pointer shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Medical Records</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Inspect lab reports →</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/60 dark:border-slate-800/60 hover:border-cyan-200 dark:hover:border-cyan-500/50 rounded-3xl text-left space-y-3 transition-all cursor-pointer shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:-translate-y-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Analytics</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Track vital trends →</p>
          </div>
        </button>
      </div>

      {/* MODALS & DRAWERS */}
      <CheckupWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        isQuickMode={isQuickMode}
        onSaveDraft={handleSaveDraft}
        onSubmitCompleted={handleSubmitCompleted}
      />

      <CheckupSummaryModal
        record={summaryTarget}
        isOpen={!!summaryTarget}
        onClose={() => setSummaryTarget(null)}
        onNavigate={onNavigate}
      />

      <CheckupHistoryDrawer
        record={historyDrawerTarget}
        isOpen={!!historyDrawerTarget}
        onClose={() => setHistoryDrawerTarget(null)}
        onDelete={handleDeleteRecord}
      />

      <CheckupFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => setFilters(updated)}
      />
    </div>
  );
};

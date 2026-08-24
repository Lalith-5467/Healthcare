import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    showToast('✓ Check-up progress saved locally');
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Health Check-Up</h1>
            <span className="px-3 py-1 text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full font-mono">
              Guided Assessment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete a quick assessment to understand your current health activity.
          </p>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => {
              const el = document.getElementById('history-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>View History</span>
          </button>

          <button
            onClick={() => {
              setIsQuickMode(false);
              setWizardOpen(true);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start New Check-Up</span>
          </button>
        </div>
      </div>

      {/* 2. HERO CARD SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs font-bold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Interactive Digital Health Check</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Start Your Health Check-Up</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Answer a few simple questions about your current health, wellness, sleep, hydration, and daily routine.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Clock className="w-4 h-4" />
                <span>Est. Time: 5–7 min</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <FileText className="w-4 h-4" />
                <span>12 Questions</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Calendar className="w-4 h-4" />
                <span>Last Check: 18 Aug 2026</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => {
                setIsQuickMode(false);
                setWizardOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Check-Up (12 Steps)</span>
            </button>

            <button
              onClick={() => {
                setIsQuickMode(true);
                setWizardOpen(true);
              }}
              className="px-6 py-3 rounded-2xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Quick Check-Up (2 min)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. IN-PROGRESS DRAFT RESUME CARD */}
      {savedDraftStep && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <RotateCcw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Check-Up In Progress</h4>
              <p className="text-slate-300 font-mono text-[11px] mt-0.5">
                Saved at Step {savedDraftStep} of 12 ({Math.round((savedDraftStep / 12) * 100)}% completed)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleDiscardDraft}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={() => {
                setIsQuickMode(false);
                setWizardOpen(true);
              }}
              className="px-4 py-2 rounded-xl font-extrabold text-white bg-[#00a896] hover:bg-teal-600 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Check-Up</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. CHECK-UP CATEGORY CARDS */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">Check-Up Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-lg hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                  {cat.iconName === 'Stethoscope' && <Stethoscope className="w-5 h-5" />}
                  {cat.iconName === 'Heart' && <Heart className="w-5 h-5 text-rose-400" />}
                  {cat.iconName === 'Activity' && <Activity className="w-5 h-5 text-teal-400" />}
                  {cat.iconName === 'Smile' && <Smile className="w-5 h-5 text-emerald-400" />}
                  {cat.iconName === 'Pill' && <Pill className="w-5 h-5 text-purple-400" />}
                  {cat.iconName === 'FileText' && <FileText className="w-5 h-5 text-amber-400" />}
                </div>

                <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                  cat.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : cat.status === 'In Progress'
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {cat.status}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-white text-sm">{cat.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Category Progress</span>
                  <span className="font-bold text-teal-400">{cat.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-[#00a896] h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SAFETY NOTICE BANNER */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 shadow-md">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
        <div className="space-y-0.5">
          <p className="font-bold">Important Notice & Medical Safety</p>
          <p className="text-[11px] opacity-90 leading-relaxed">
            This digital check-up is intended strictly for personal health tracking and wellness organization. It does not replace clinical evaluation, medical advice, diagnosis, or treatment from qualified healthcare professionals.
          </p>
        </div>
      </div>

      {/* 6. PREVIOUS CHECK-UPS HISTORY LOG */}
      <div id="history-section" className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white">Previous Check-Ups</h3>
            <p className="text-xs text-slate-400">Review your past completed health assessments</p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {filteredHistory.map((item) => (
            <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">{item.date} • {item.time}</span>
                <h4 className="font-extrabold text-white text-sm">{item.type}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Form Completion Score: <strong className="text-teal-400">{item.completionScore}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHistoryDrawerTarget(item)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteRecord(item.id)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CROSS MODULE NAVIGATION CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('appointments')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Calendar className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">Discuss in Appointments</h4>
          <p className="text-[11px] text-slate-400">Schedule consultation with doctor →</p>
        </button>

        <button
          onClick={() => onNavigate('medicines')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Pill className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">View Medicines Tracker</h4>
          <p className="text-[11px] text-slate-400">Review prescriptions & doses →</p>
        </button>

        <button
          onClick={() => onNavigate('records')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <FileText className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">View Medical Records</h4>
          <p className="text-[11px] text-slate-400">Inspect lab reports & scans →</p>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-5 bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Activity className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-white text-xs">View Health Analytics</h4>
          <p className="text-[11px] text-slate-400">Track vital signs trends →</p>
        </button>
      </div>

      {/* MODALS & DRAWERS */}
      <CheckupWizardModal
        isOpen={wizardOpen}
        isQuickMode={isQuickMode}
        initialStep={savedDraftStep || 1}
        onClose={() => setWizardOpen(false)}
        onSaveDraft={handleSaveDraft}
        onSubmitCompleted={handleSubmitCompleted}
        onNavigateToMedicines={() => onNavigate('medicines')}
      />

      <CheckupSummaryModal
        record={summaryTarget}
        isOpen={!!summaryTarget}
        onClose={() => setSummaryTarget(null)}
        onNavigateToAnalytics={() => onNavigate('analytics')}
        onNavigateToAppointments={() => onNavigate('appointments')}
        onNavigateToReminders={() => onNavigate('reminders')}
      />

      <CheckupHistoryDrawer
        record={historyDrawerTarget}
        isOpen={!!historyDrawerTarget}
        onClose={() => setHistoryDrawerTarget(null)}
        onDeleteRecord={handleDeleteRecord}
      />

      <CheckupFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ checkupType: 'All', status: 'All', dateRange: 'All Time' })}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  BarChart3,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Scale,
  Pill,
  Calendar as CalendarIcon,
  FileText,
  Video,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Target,
  Download
} from 'lucide-react';
import type { VitalDataPoint, HealthGoal, ActivityItem } from './analyticsData';
import {
  MOCK_VITALS_TIMELINE,
  MOCK_WEEKLY_ADHERENCE,
  INITIAL_HEALTH_GOALS,
  MOCK_ACTIVITY_TIMELINE,
  MOCK_MONTHLY_COMPARISONS
} from './analyticsData';
import { CreateGoalModal } from './CreateGoalModal';
import { ReportPreviewModal } from './ReportPreviewModal';
import { AnalyticsFilterDrawer } from './AnalyticsFilterDrawer';
import type { AnalyticsFilterState } from './AnalyticsFilterDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface AnalyticsViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GLOBAL DATE RANGE ('7 Days' | '30 Days' | '3 Months' | '6 Months' | '1 Year')
  const [globalDateRange, setGlobalDateRange] = useState('30 Days');

  // VITALS CHART METRIC SELECTOR ('Heart Rate' | 'Blood Pressure' | 'Temperature' | 'SpO2' | 'Weight')
  const [selectedVitalMetric, setSelectedVitalMetric] = useState<'Heart Rate' | 'Blood Pressure' | 'Temperature' | 'SpO2' | 'Weight'>('Heart Rate');
  const [vitalsTimeframe, setVitalsTimeframe] = useState<'7D' | '30D' | '3M'>('7D');
  const [hoveredVital, setHoveredVital] = useState<VitalDataPoint | null>(null);

  // GOALS & LOCALSTORAGE
  const [goals, setGoals] = useState<HealthGoal[]>(INITIAL_HEALTH_GOALS);
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITY_TIMELINE);

  // CALENDAR DATE FILTER
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('24 Aug 2026');

  // MODALS & DRAWERS
  const [createGoalModalOpen, setCreateGoalModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    activityType: 'All',
    status: 'All',
    dateRange: '30 Days'
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('user_health_goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveGoal = (newGoal: Partial<HealthGoal>) => {
    const fullGoal: HealthGoal = {
      id: newGoal.id || `GOAL-${Date.now().toString().slice(-4)}`,
      title: newGoal.title || 'Health Target',
      category: (newGoal.category as any) || 'Activity',
      current: newGoal.current || 0,
      target: newGoal.target || 100,
      unit: newGoal.unit || 'pts',
      startDate: newGoal.startDate || '27 Aug 2026',
      endDate: newGoal.endDate || '30 Sep 2026',
      progress: newGoal.progress || 0,
      isPaused: newGoal.isPaused || false
    };
    const updated = [fullGoal, ...goals];
    setGoals(updated);
    localStorage.setItem('user_health_goals', JSON.stringify(updated));
    showToast(`✓ Goal "${fullGoal.title}" added successfully`);
  };

  // FILTERED ACTIVITY LIST
  const filteredActivities = activities.filter((act) => {
    if (filters.activityType !== 'All' && act.type !== filters.activityType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!act.title.toLowerCase().includes(q) && !act.subtitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

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
        title="Health Analytics & Biometric Insights"
        subtitle="Understand your health activity, trend analytics and biometrics in one place."
        badgeText="Analytics Workspace"
        badgeIcon={<BarChart3 className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto font-sans">
            <select
              value={globalDateRange}
              onChange={(e) => {
                setGlobalDateRange(e.target.value);
                showToast(`Updated timeframe to ${e.target.value}`);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm"
            >
              <option value="7 Days">7 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
            </select>

            <button
              onClick={() => setReportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        }
      />

      {/* 2. HEALTH OVERVIEW HERO SECTION */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden font-sans">
        <div className="space-y-3 text-center md:text-left flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
            Personal Health Dashboard Summary
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Your health activity at a glance</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
            Consolidated personal metrics, medication routine adherence, appointment history & document activity.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 text-[11px] font-bold border border-slate-300 dark:border-slate-800">
              Period: {globalDateRange}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/30">
              Demo Data Mode
            </span>
          </div>
        </div>

        {/* CIRCULAR DEMO HEALTH SCORE VISUALIZATION */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shrink-0 min-w-[220px] shadow-sm">
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00a896] dark:text-teal-400"
                strokeDasharray="86, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">86</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 block font-mono">
              Demo Health Score
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +4% vs previous period
            </span>
          </div>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Medication Adherence</span>
            <Pill className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">91%</span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">+5.2%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">vs previous period</span>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Appointments</span>
            <CalendarIcon className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-cyan-400 font-mono">8</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">visits</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">3 upcoming • 5 done</span>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Medical Records</span>
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300 font-mono">24</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">records</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Lab reports & prescriptions</span>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Consultations</span>
            <Video className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400 font-mono">12</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">sessions</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">18 min average call</span>
        </div>
      </div>

      {/* 4. VITALS OVERVIEW & INTERACTIVE TREND CHARTS */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vitals Overview</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Demo / manually entered values
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Track heart rate, blood pressure & vital metrics</p>
          </div>

          {/* TIMEFRAME SELECTOR */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {(['7D', '30D', '3M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setVitalsTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer font-sans ${
                  vitalsTimeframe === tf ? 'bg-[#00a896] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* METRIC TOGGLES */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {[
            { id: 'Heart Rate', label: 'Heart Rate', val: '72 BPM', icon: Heart, color: 'text-rose-600 dark:text-rose-400' },
            { id: 'Blood Pressure', label: 'Blood Pressure', val: '120/80', icon: Activity, color: 'text-[#00a896] dark:text-cyan-400' },
            { id: 'Temperature', label: 'Temperature', val: '98.4°F', icon: Thermometer, color: 'text-amber-600 dark:text-amber-400' },
            { id: 'SpO2', label: 'SpO₂ Oxygen', val: '98%', icon: Wind, color: 'text-teal-600 dark:text-teal-400' },
            { id: 'Weight', label: 'Body Weight', val: '68 kg (-1.2)', icon: Scale, color: 'text-purple-600 dark:text-purple-400' }
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = selectedVitalMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedVitalMetric(m.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 border-[#00a896] dark:border-teal-400 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase font-mono">{m.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white block">{m.val}</span>
              </button>
            );
          })}
        </div>

        {/* CHART VISUALIZER */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="font-extrabold text-slate-900 dark:text-white">{selectedVitalMetric} Trend Line</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">Interactive Preview</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-3 pt-6 px-2 relative border-b border-slate-200 dark:border-slate-800">
            {MOCK_VITALS_TIMELINE.map((v, i) => {
              const val = selectedVitalMetric === 'Heart Rate' ? v.heartRate : selectedVitalMetric === 'Blood Pressure' ? v.systolic : selectedVitalMetric === 'SpO2' ? v.spo2 : v.weight;
              const heightPct = Math.min(100, Math.max(30, (val / 130) * 100));

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredVital(v)}
                  onMouseLeave={() => setHoveredVital(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full max-w-[28px] rounded-t-xl bg-[#00a896] dark:bg-gradient-to-t dark:from-[#00a896] dark:to-cyan-400 group-hover:bg-[#00897b] transition-all shadow-md"
                  />
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">{v.date}</span>
                </div>
              );
            })}
          </div>

          {hoveredVital && (
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono flex items-center justify-between text-[#00a896] dark:text-cyan-300 shadow-sm">
              <span className="font-bold">{hoveredVital.date} Data Point:</span>
              <span>HR: {hoveredVital.heartRate} BPM | BP: {hoveredVital.systolic}/{hoveredVital.diastolic} | SpO2: {hoveredVital.spo2}% | Wt: {hoveredVital.weight} kg</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. MEDICATION ADHERENCE & APPOINTMENT ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        {/* MEDICATION ADHERENCE (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Medication Adherence</h3>
            </div>
            <button
              onClick={() => onNavigate('medicines')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>View Medicines</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs font-sans">
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Today</span>
              <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-lg">75%</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">This Week</span>
              <span className="font-mono font-extrabold text-[#00a896] dark:text-cyan-400 text-lg">88%</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">This Month</span>
              <span className="font-mono font-extrabold text-teal-700 dark:text-teal-400 text-lg">91%</span>
            </div>
          </div>

          {/* WEEKLY ADHERENCE BARS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Weekly Adherence Log</span>
            <div className="grid grid-cols-7 gap-2 items-end h-28 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              {MOCK_WEEKLY_ADHERENCE.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: `${day.percentage}%` }}
                    className="w-full max-w-[20px] rounded-t-lg bg-[#00a896] dark:bg-teal-400/80"
                  />
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* APPOINTMENT & CONSULTATION ANALYTICS (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Appointments & Consultations</h3>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>View Appointments</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Completed</span>
              <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-lg">12</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Upcoming</span>
              <span className="font-mono font-extrabold text-[#00a896] dark:text-cyan-400 text-lg">3</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Cancelled</span>
              <span className="font-mono font-extrabold text-rose-700 dark:text-rose-400 text-lg">3</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">Consultation Summary</h4>
            <div className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex justify-between"><span>Total Tele-Consultations:</span><span className="font-bold text-slate-900 dark:text-white">12 sessions</span></div>
              <div className="flex justify-between"><span>Video Calls:</span><span className="font-bold text-[#00a896] dark:text-teal-400">8 calls</span></div>
              <div className="flex justify-between"><span>In-Person Visits:</span><span className="font-bold text-cyan-700 dark:text-cyan-400">4 visits</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. HEALTH ACTIVITY TIMELINE & INTERACTIVE CALENDAR */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Health Activity Timeline & Calendar</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search activity events or filter by date on the monthly calendar</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ACTIVITY STREAM TIMELINE (LEFT 7 COLS) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredActivities.map((act) => (
              <div key={act.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#00a896] dark:text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{act.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{act.subtitle}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{act.date}</span>
                  <span className="text-[10px] font-bold text-[#00a896] dark:text-teal-400">{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* COMPACT INTERACTIVE MONTHLY CALENDAR (RIGHT 5 COLS) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white">August 2026</span>
              <span className="font-mono text-[10px] text-[#00a896] dark:text-cyan-400 font-bold">{selectedCalendarDate}</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <span key={idx} className="font-bold text-slate-500 dark:text-slate-400 py-0.5 font-sans">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const dateStr = `${d.toString().padStart(2, '0')} Aug 2026`;
                const isSelected = selectedCalendarDate.startsWith(d.toString());
                const hasDot = d === 20 || d === 22 || d === 24;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedCalendarDate(dateStr)}
                    className={`py-1.5 rounded-lg font-bold border transition-colors cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#00a896] text-white border-teal-300 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{d}</span>
                    {hasDot && <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7. HEALTH GOALS & WELLNESS METRICS */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00a896] dark:text-teal-400" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Personal Health Goals</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">User-configured routine target goals</p>
            </div>
          </div>

          <button
            onClick={() => setCreateGoalModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g) => (
            <div key={g.id} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">{g.title}</span>
                <span className="text-[10px] font-mono font-bold text-[#00a896] dark:text-teal-400">{g.progress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div style={{ width: `${g.progress}%` }} className="h-full bg-[#00a896] dark:bg-gradient-to-r dark:from-[#00a896] dark:to-cyan-400" />
              </div>

              <div className="flex justify-between items-baseline text-[11px] font-mono">
                <span className="text-slate-600 dark:text-slate-400 font-sans font-medium">Target: <strong className="text-slate-900 dark:text-white">{g.target} {g.unit}</strong></span>
                <span className="text-slate-600 dark:text-slate-400 font-sans font-medium">Current: <strong className="text-[#00a896] dark:text-cyan-300">{g.current}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. NEUTRAL INSIGHTS & MONTHLY COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        {/* INSIGHTS (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Health Activity Insights</h3>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <h4 className="font-bold text-cyan-700 dark:text-cyan-300">Medication Routine Tracking</h4>
              <p className="text-slate-700 dark:text-slate-300">Medication tracking was completed on 6 of the last 7 days.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <h4 className="font-bold text-teal-700 dark:text-teal-300">Appointment Activity</h4>
              <p className="text-slate-700 dark:text-slate-300">Your appointment activity increased compared with the previous period.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
              <h4 className="font-bold text-purple-700 dark:text-purple-300">Medical Records Synced</h4>
              <p className="text-slate-700 dark:text-slate-300">You added 4 medical records to your health journal this month.</p>
            </div>
          </div>
        </div>

        {/* MONTHLY COMPARISON TABLE (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">This Month vs Previous Month</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {MOCK_MONTHLY_COMPARISONS.map((comp, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{comp.label}</h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Current: {comp.currentValue} vs {comp.previousValue}</span>
                </div>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-xs bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/30">
                  {comp.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <CreateGoalModal
        isOpen={createGoalModalOpen}
        onClose={() => setCreateGoalModalOpen(false)}
        onSaveGoal={handleSaveGoal}
      />

      <ReportPreviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        dateRange={globalDateRange}
      />

      <AnalyticsFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ activityType: 'All', status: 'All', dateRange: '30 Days' })}
      />
    </div>
  );
};

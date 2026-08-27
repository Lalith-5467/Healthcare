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
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden font-sans">
        {/* Decorative SVG Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #00a896 0%, transparent 50%), radial-gradient(circle at 20% 20%, #475569 0%, transparent 30%)' }}></div>
        <svg className="absolute right-0 top-0 h-full w-2/3 opacity-10 pointer-events-none text-[#00a896] dark:text-teal-500" viewBox="0 0 400 200" preserveAspectRatio="none">
           <path fill="none" stroke="currentColor" strokeWidth="1" d="M10,10 Q150,200 390,10" />
           <path fill="none" stroke="currentColor" strokeWidth="1" d="M10,190 Q150,0 390,190" />
           <circle cx="200" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
           <circle cx="200" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
        </svg>

        <div className="space-y-4 text-center md:text-left flex-1 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00a896] dark:text-cyan-400 font-mono">
            Personal Health Accuracy Report
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Your health activity at a glance</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
            Consolidated personal health metric score: Excellent, <strong className="text-[#00a896] dark:text-teal-400">1.2% higher</strong> than previous period
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button onClick={() => onNavigate('dashboard')} className="px-5 py-2 rounded-full font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer">
              Actual ratings
            </button>
            <button onClick={() => onNavigate('records')} className="px-5 py-2 rounded-full font-extrabold text-xs text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-md cursor-pointer">
              More details
            </button>
          </div>
        </div>

        {/* CIRCULAR DEMO HEALTH SCORE VISUALIZATION */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 text-center space-y-2 shrink-0 min-w-[220px] shadow-lg relative z-10">
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* Inner background blob to mimic the soft glowing effect */}
            <div className="absolute inset-2 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/50 dark:to-slate-800 rounded-full opacity-70"></div>
            
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 36 36">
              <path
                className="text-slate-200/50 dark:text-slate-800/50"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00a896] dark:text-teal-400"
                strokeDasharray="86, 100"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center z-10">
              <span className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white leading-none">86</span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">score</span>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block font-sans">
              Total Health Score
            </span>
            <span className="text-[11px] font-bold text-[#00a896] dark:text-teal-400 inline-flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              1.2% on previous period
            </span>
          </div>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Medication Adherence</span>
            <Pill className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">91%</span>
            <span className="text-[10px] font-bold text-[#00a896] dark:text-teal-400 flex items-center"><ArrowUpRight className="w-3 h-3"/> 51%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium relative z-10">vs previous period</span>
          
          {/* Decorative Sparkline */}
          <svg className="absolute bottom-0 right-0 w-24 h-12 text-[#00a896] dark:text-teal-400 opacity-20" viewBox="0 0 100 50">
            <path fill="none" stroke="currentColor" strokeWidth="3" d="M0,40 Q25,10 50,30 T100,5" />
          </svg>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Appointments</span>
            <CalendarIcon className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-cyan-400 font-sans">8</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">visits</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">registered, 1 time</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Medical Records</span>
            <FileText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-sans">24</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">records</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">somecapio a prescription</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Consultations</span>
            <Video className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400 font-sans">12</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">sessions</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">more average apx</span>
        </div>
      </div>

      {/* 4. VITALS OVERVIEW & INTERACTIVE TREND CHARTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Vitals Overview</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Nors heale data, Atloe, pickrond & oltro meafits
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Track heart rate, blood pressure & vital metrics</p>
          </div>

          {/* TIMEFRAME SELECTOR */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-sans">
            {(['7D', '30D', '3M'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setVitalsTimeframe(tf)}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  vitalsTimeframe === tf ? 'bg-[#00a896] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* METRIC TOGGLES */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { id: 'Heart Rate', label: 'Heart Rate', val: '72 BPM', img: '/vitals/heart.jpg', color: 'text-rose-500', isNormal: true },
            { id: 'Blood Pressure', label: 'Blood Pressure', val: '120/80', img: '/vitals/bp.jpg', color: 'text-[#00a896]', isNormal: true },
            { id: 'Temperature', label: 'Temperature', val: '98.4°F', img: '/vitals/thermo.jpg', color: 'text-amber-500', isNormal: true },
            { id: 'SpO2', label: 'SpO₂ Oxygen', val: '98%', img: '/vitals/lungs.jpg', color: 'text-teal-500', isNormal: true },
            { id: 'Weight', label: 'Body Weight', val: '68 kg (-1.2)', img: '/vitals/scale.jpg', color: 'text-purple-500', isNormal: true }
          ].map((m) => {
            const isSelected = selectedVitalMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedVitalMetric(m.id as any)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-50 dark:bg-slate-800 border-[#00a896] dark:border-teal-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full z-10">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{m.label}</span>
                  <img src={m.img} alt={m.label} className="w-8 h-8 rounded-lg object-contain mix-blend-multiply dark:mix-blend-screen drop-shadow-sm" />
                </div>
                <div className="flex items-center justify-between w-full z-10">
                  <span className="font-sans font-extrabold text-lg text-slate-900 dark:text-white">{m.val.split(' ')[0]} <span className="text-sm font-medium">{m.val.split(' ').slice(1).join(' ')}</span></span>
                  {m.isNormal && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#00a896] bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a896]"></span> normal
                    </span>
                  )}
                </div>
                {isSelected && (
                   <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-xl -mr-4 -mt-4 pointer-events-none"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* CHART VISUALIZER */}
        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="font-bold text-slate-900 dark:text-white">{selectedVitalMetric} Trend Line</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3"/> Interactive preview
            </span>
          </div>

          <div className="h-48 pt-6 relative border-b border-slate-200 dark:border-slate-800 flex items-end w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00a896" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00a896" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 L0,70 Q10,60 20,65 T40,80 T60,50 T80,30 T100,40 L100,100 Z"
                fill="url(#chartGradient)"
                className="transition-all duration-700 ease-in-out"
              />
              <path
                d="M0,70 Q10,60 20,65 T40,80 T60,50 T80,30 T100,40"
                fill="none"
                stroke="#00a896"
                strokeWidth="2"
                className="transition-all duration-700 ease-in-out drop-shadow-md"
              />
              <circle cx="60" cy="50" r="2.5" fill="white" stroke="#00a896" strokeWidth="1.5" className="animate-pulse" />
            </svg>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-between transform translate-y-6 px-1">
               {['01 Aug', '11 Aug', '17 Aug', '23 Aug', '27 Aug'].map((d, i) => (
                  <span key={i} className="text-[10px] font-medium text-slate-500">{d}</span>
               ))}
            </div>
          </div>
          <div className="h-4"></div>
        </div>
      </div>

      {/* 5. MEDICATION ADHERENCE & APPOINTMENT ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        {/* MEDICATION ADHERENCE (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Medication Adherence</h3>
            </div>
            <button
              onClick={() => onNavigate('medicines')}
              className="px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-[#00a896] dark:text-teal-400 text-xs font-bold border border-teal-100 dark:border-teal-800 flex items-center gap-1 cursor-pointer transition-all"
            >
              <span>View medicines</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs font-sans shadow-sm">
            <div className="border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Today</span>
              <span className="font-sans font-extrabold text-slate-800 dark:text-slate-200 text-lg">71%</span>
            </div>
            <div className="border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">This Week</span>
              <span className="font-sans font-extrabold text-[#00a896] dark:text-teal-400 text-lg">XXX</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">This Month</span>
              <span className="font-sans font-extrabold text-[#00a896] dark:text-teal-400 text-lg">92%</span>
            </div>
          </div>

          {/* WEEKLY ADHERENCE BARS */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-900 dark:text-white">Weekly adherence (In)</span>
            <div className="grid grid-cols-7 gap-2 items-end h-24 bg-white dark:bg-slate-950 p-2 text-center">
              {MOCK_WEEKLY_ADHERENCE.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: `${day.percentage}%` }}
                    className="w-4 rounded-t-sm bg-[#00a896] dark:bg-teal-400"
                  />
                  <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase">{day.day.substring(0,3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* APPOINTMENT & CONSULTATION ANALYTICS (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Appointments & Consultations</h3>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-[#00a896] dark:text-teal-400 text-xs font-bold border border-teal-100 dark:border-teal-800 flex items-center gap-1 cursor-pointer transition-all"
            >
              <span>View appointment</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs shadow-sm">
            <div className="border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Completed</span>
              <span className="font-sans font-extrabold text-[#00a896] dark:text-teal-400 text-lg">12</span>
            </div>
            <div className="border-r border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Pending</span>
              <div className="flex justify-center mt-1">
                <div className="w-5 h-5 rounded-full border border-amber-500 flex items-center justify-center text-amber-500">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] block font-medium">Cancelled</span>
              <div className="flex justify-center mt-1">
                <div className="w-5 h-5 rounded-full border border-rose-500 flex items-center justify-center text-rose-500 font-bold text-xs">
                  ×
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3 text-xs shadow-inner">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Appointment summary</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex justify-between items-center"><span className="text-[11px]">Total Tele-Consultations</span><span className="font-extrabold text-rose-500 text-[10px]">121 sessions</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px]">Video calls</span><span className="font-extrabold text-[#00a896] dark:text-teal-400 text-[10px]">8 calls</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px]">In-person visits</span><span className="font-extrabold text-teal-600 dark:text-teal-500 text-[10px]">4 visits</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. HEALTH ACTIVITY TIMELINE & INTERACTIVE CALENDAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Health Activity Timeline & Calendar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Health activity records on filled by date or view monthly calendar</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm transition-all"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ACTIVITY STREAM TIMELINE (LEFT 7 COLS) */}
          <div className="lg:col-span-7 space-y-0 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800 z-0"></div>
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative z-10 flex items-start gap-4 py-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#00a896] dark:text-teal-400 flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{act.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{act.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Today</span>
                    <span className="text-[10px] font-bold text-[#00a896] dark:text-teal-400">{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COMPACT INTERACTIVE MONTHLY CALENDAR (RIGHT 5 COLS) */}
          <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white">August 2023</span>
              <span className="font-sans text-[10px] text-slate-500 font-medium">27 Aug 2023</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-sans">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <span key={idx} className="font-bold text-slate-500 dark:text-slate-400 py-1">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const dateStr = `${d.toString().padStart(2, '0')} Aug 2026`;
                const isSelected = selectedCalendarDate.startsWith(d.toString());
                const hasDot = d === 20 || d === 22 || d === 24;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedCalendarDate(dateStr)}
                    className={`h-8 w-full rounded-md font-bold transition-colors cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#00a896] text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{d}</span>
                    {hasDot && !isSelected && <span className="w-1 h-1 rounded-full bg-[#00a896] mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7. HEALTH GOALS & WELLNESS METRICS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm font-sans">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#00a896] dark:text-teal-400" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Personal Health Goals</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">wait continuous health target goals</p>
            </div>
          </div>

          <button
            onClick={() => setCreateGoalModalOpen(true)}
            className="px-5 py-2 rounded-full font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g) => (
            <div key={g.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{g.title}</span>
                <span className="text-[10px] font-sans font-bold text-[#00a896] dark:text-teal-400">{g.progress}%</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div style={{ width: `${g.progress}%` }} className="h-full bg-[#00a896] dark:bg-teal-400" />
              </div>

              <div className="flex justify-between items-baseline text-[10px] font-sans">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Target: <strong className="text-slate-700 dark:text-slate-300">{g.target} {g.unit}</strong></span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Current: <strong className="text-slate-700 dark:text-slate-300">{g.current}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. NEUTRAL INSIGHTS & MONTHLY COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
        {/* INSIGHTS (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Health Activity Insights</h3>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1 shadow-sm">
              <h4 className="font-bold text-[#00a896] dark:text-teal-400">Medication Health Tracking</h4>
              <p className="text-slate-500 dark:text-slate-400">Medication tracking was completed on 6 of the last 7 days.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1 shadow-sm">
              <h4 className="font-bold text-[#00a896] dark:text-teal-400">Appointment History</h4>
              <p className="text-slate-500 dark:text-slate-400">Your appointment activity increased compared with the previous period.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1 shadow-sm">
              <h4 className="font-bold text-[#00a896] dark:text-teal-400">Medical Records Synced</h4>
              <p className="text-slate-500 dark:text-slate-400">You added 4 medical records to your health journal this month.</p>
            </div>
          </div>
        </div>

        {/* MONTHLY COMPARISON TABLE (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">This Month vs Previous Month</h3>
          </div>

          <div className="space-y-3 text-xs">
            {MOCK_MONTHLY_COMPARISONS.map((comp, i) => (
              <div key={i} className="py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{comp.label}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Current: {comp.currentValue} vs {comp.previousValue}</span>
                </div>
                <span className="font-sans font-bold text-[#00a896] dark:text-teal-400 text-[10px] bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-800">
                  {comp.change.replace('+', '+ ')}
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

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

const vitalPreviewData: Record<string, {
  color: string;
  chartPath: string;
  cx: string;
  cy: string;
  title: string;
}> = {
  'Heart Rate': {
    color: '#f43f5e', // rose-500
    chartPath: 'M0,65 S8,60 16.6,60 S25,62 33.3,62 S41.6,68 50,68 S58.3,62 66.6,62 S75,50 83.3,50 S91.6,65 100,65',
    cx: '50',
    cy: '68',
    title: 'Heart Rate'
  },
  'Blood Pressure': {
    color: '#818cf8', // indigo-400
    chartPath: 'M0,50 C 7,50 7,45 15,45 S 22,55 30,55 S 37,50 45,50 S 52,45 60,45 S 67,30 75,30 S 82,40 90,40 S 95,45 100,45',
    cx: '75',
    cy: '30',
    title: 'Blood Pressure'
  },
  'Temperature': {
    color: '#f59e0b', // amber-500
    chartPath: 'M0,70 C 10,70 10,65 20,65 S 30,50 40,50 S 50,55 60,55 S 70,45 80,45 S 90,60 100,60',
    cx: '40',
    cy: '50',
    title: 'Temperature'
  },
  'SpO2': {
    color: '#3b82f6', // blue-500
    chartPath: 'M0,30 C 12,30 12,25 25,25 S 37,20 50,20 S 62,10 75,10 S 87,15 100,15',
    cx: '50',
    cy: '20',
    title: 'SpO2'
  },
  'Weight': {
    color: '#10b981', // emerald-500
    chartPath: 'M0,45 C 10,45 10,40 20,40 S 30,35 40,35 S 50,32 60,32 S 70,30 80,30 S 90,32 100,32',
    cx: '80',
    cy: '30',
    title: 'Body Weight'
  }
};

const generateSmoothPath = (points: {x: number, y: number}[]) => {
  if (points.length === 0) return '';
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const mx = (p1.x + p2.x) / 2;
    path += ` C${mx},${p1.y} ${mx},${p2.y} ${p2.x},${p2.y}`;
  }
  return path;
};

const getDynamicPoints = (metric: string, timeframe: string, targetCx: number, targetCy: number) => {
  let numPoints = 7;
  if (timeframe === '30D') numPoints = 6;
  if (timeframe === '3M') numPoints = 4;
  if (timeframe === '1Y') numPoints = 6;

  // Find which index is closest to the target cx
  let closestIdx = 0;
  let minDiff = 100;
  
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * 100;
    const diff = Math.abs(x - targetCx);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
    
    // Deterministic pseudo-random y
    const seed = metric.charCodeAt(0) + i * 13 + timeframe.charCodeAt(0);
    const y = 50 + (Math.sin(seed) * 15);
    points.push({ x, y });
  }
  
  // Force the closest point to match the tooltip target
  points[closestIdx].y = targetCy;
  return { points, activeIndex: closestIdx };
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GLOBAL DATE RANGE ('7 Days' | '30 Days' | '3 Months' | '6 Months' | '1 Year')
  const [globalDateRange, setGlobalDateRange] = useState('30 Days');

  // VITALS CHART METRIC SELECTOR ('Heart Rate' | 'Blood Pressure' | 'Temperature' | 'SpO2' | 'Weight')
  const [selectedVitalMetric, setSelectedVitalMetric] = useState<'Heart Rate' | 'Blood Pressure' | 'Temperature' | 'SpO2' | 'Weight'>('Heart Rate');
  const [vitalsTimeframe, setVitalsTimeframe] = useState<'7D' | '30D' | '3M' | '1Y'>('7D');
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

      {/* 4. VITALS OVERVIEW & INTERACTIVE TREND CHARTS (REDESIGNED) */}
      <div className="bg-slate-50 dark:bg-[#121626] border border-slate-200 dark:border-slate-800/60 rounded-[1.5rem] p-3.5 sm:p-4 space-y-3 shadow-xl font-sans text-slate-900 dark:text-white">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 shadow-inner">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold tracking-wide">Vitals Overview</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#00a896]/10 text-[#00a896] border border-[#00a896]/30 flex items-center gap-1.5 shadow-sm uppercase tracking-wider backdrop-blur-sm">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a896] opacity-75"></span>
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#00a896] shadow-[0_0_8px_#00a896]"></span>
                </span>
                All systems normal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Track heart rate, blood pressure & vital metrics</p>
          </div>

          {/* TIMEFRAME SELECTOR */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-[10px] font-sans shadow-inner">
            {(['7D', '30D', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setVitalsTimeframe(tf as any)}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  vitalsTimeframe === tf ? 'bg-blue-600/90 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* METRIC TOGGLES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'Heart Rate', label: 'Heart Rate', val: '72', unit: 'BPM', icon: Heart, iconBg: 'bg-rose-500/20', iconColor: 'text-rose-500', isNormal: true, sparkline: 'M0,10 L5,8 L10,12 L15,4 L20,10', activeBorder: 'border-rose-500', glow: 'bg-rose-500/10' },
            { id: 'Blood Pressure', label: 'Blood Pressure', val: '120/80', unit: 'mmHg', icon: Activity, iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-400', isNormal: true, sparkline: 'M0,10 L5,5 L10,12 L15,8 L20,10', activeBorder: 'border-indigo-500', glow: 'bg-indigo-500/10' },
            { id: 'Temperature', label: 'Temperature', val: '98.4', unit: '°F', icon: Thermometer, iconBg: 'bg-amber-500/20', iconColor: 'text-amber-500', isNormal: true, sparkline: 'M0,10 L5,10 L10,8 L15,11 L20,10', activeBorder: 'border-amber-500', glow: 'bg-amber-500/10' },
            { id: 'SpO2', label: 'SpO₂ • Oxygen', val: '98', unit: '%', icon: Wind, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500', isNormal: true, sparkline: 'M0,10 L5,9 L10,10 L15,7 L20,10', activeBorder: 'border-blue-500', glow: 'bg-blue-500/10' },
            { id: 'Weight', label: 'Body Weight', val: '68', unit: 'kg (-1.2)', icon: Scale, iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-500', isNormal: true, sparkline: 'M0,10 L5,12 L10,10 L15,14 L20,10', activeBorder: 'border-emerald-500', glow: 'bg-emerald-500/10' }
          ].map((m) => {
            const isSelected = selectedVitalMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedVitalMetric(m.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                  isSelected
                    ? `bg-slate-100 dark:bg-[#1a1f33] ${m.activeBorder} shadow-[0_0_12px_rgba(0,0,0,0.5)]`
                    : 'bg-white dark:bg-[#15192b] border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:bg-[#1a1f33]'
                }`}
              >
                <div className={`absolute -top-4 -left-4 w-32 h-32 ${m.glow} blur-2xl pointer-events-none rounded-full transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-50'}`}></div>
                <div className={`absolute bottom-0 right-0 w-24 h-24 ${m.glow} blur-xl pointer-events-none rounded-full transition-opacity duration-500 opacity-20`}></div>
                <div className="flex items-center gap-2.5 z-10">
                  <div className={`p-2 rounded-lg ${m.iconBg} ${m.iconColor} shadow-inner`}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block leading-tight">{m.label}</span>
                    <div className="flex items-baseline gap-1 mt-0">
                      <span className="font-sans font-bold text-xl text-slate-900 dark:text-white leading-tight">{m.val}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{m.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-700/50 z-10 my-0"></div>
                <div className="flex items-center justify-between w-full z-10">
                  {m.isNormal && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 leading-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]"></span> Normal
                    </span>
                  )}
                  <svg className={`w-6 h-3 ${m.iconColor}`} viewBox="0 0 20 20" preserveAspectRatio="none">
                     <path d={m.sparkline} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* MIDDLE SECTION: MAIN CHART & TODAY'S SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          
          {/* Main Chart (Left 8 cols) */}
          <div className={`lg:col-span-8 bg-[#0b1120] border rounded-2xl p-5 relative overflow-hidden flex flex-col shadow-inner ${selectedVitalMetric === 'Heart Rate' ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-slate-800'}`}>
            {/* Glowing edge effect like image 1 */}
            {selectedVitalMetric === 'Heart Rate' && (
              <>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500/80 to-transparent"></div>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-rose-500/80 to-transparent"></div>
                <div className="absolute top-0 left-0 w-48 h-48 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              </>
            )}

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${selectedVitalMetric === 'Heart Rate' ? 'text-rose-500' : 'text-slate-400'}`} fill={selectedVitalMetric === 'Heart Rate' ? 'currentColor' : 'none'} />
                  <span className="text-lg font-bold text-white uppercase tracking-wider">{selectedVitalMetric} TREND</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {vitalsTimeframe === '7D' && 'Week View: Aug 21 - Aug 27'}
                  {vitalsTimeframe === '30D' && 'Month View: Aug 01 - Aug 30'}
                  {vitalsTimeframe === '3M' && 'Quarter View: Jun 01 - Aug 31'}
                  {vitalsTimeframe === '1Y' && 'Year View: 2026'}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                <span className="text-xs text-slate-300 font-medium">Active</span>
              </div>
            </div>

            <div className="w-full relative pb-6 pl-8 flex items-end h-[220px] mt-2 border-l border-b border-slate-700/50">
              {/* Y-axis labels */}
              <div className="absolute left-[-26px] top-0 bottom-6 flex flex-col justify-between text-[11px] text-slate-400 font-medium">
                <span>100</span>
                <span>90</span>
                <span>80</span>
                <span>70</span>
                <span>60</span>
                <span>50</span>
                <span>40</span>
              </div>
              <div className="absolute inset-0 z-0 flex flex-col justify-between pb-6">
                {[...Array(7)].map((_, i) => (
                  <div key={`h-${i}`} className="w-full h-px border-t border-dashed border-slate-700/60"></div>
                ))}
              </div>
              <div className="absolute inset-0 z-0 flex justify-between pl-8 pr-2">
                {[...Array(
                  vitalsTimeframe === '7D' ? 7 :
                  vitalsTimeframe === '30D' ? 6 :
                  vitalsTimeframe === '3M' ? 4 : 6
                )].map((_, i) => (
                  <div key={`v-${i}`} className="h-full w-px border-l border-dashed border-slate-700/60"></div>
                ))}
              </div>

              {/* Chart SVG */}
              {(() => {
                const cx = parseInt(vitalPreviewData[selectedVitalMetric]?.cx || '50');
                const cy = parseInt(vitalPreviewData[selectedVitalMetric]?.cy || '40');
                const { points, activeIndex } = getDynamicPoints(selectedVitalMetric, vitalsTimeframe, cx, cy);
                const pathStr = generateSmoothPath(points);
                const activePoint = points[activeIndex];
                
                return (
                  <>
                    <svg key={vitalsTimeframe + selectedVitalMetric} className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="chartGradientBeautiful" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={selectedVitalMetric === 'Heart Rate' ? '#f43f5e' : vitalPreviewData[selectedVitalMetric]?.color || '#f43f5e'} stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`${pathStr} L100,100 L0,100 Z`}
                        fill="url(#chartGradientBeautiful)"
                        className="transition-all duration-700 ease-in-out"
                      />
                      <path
                        d={pathStr}
                        fill="none"
                        stroke={vitalPreviewData[selectedVitalMetric]?.color || '#f43f5e'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-700 ease-in-out drop-shadow-lg"
                      />

                      {/* Highlight Glow behind Active Point */}
                      <circle cx={activePoint.x} cy={activePoint.y} r="12" fill={`${vitalPreviewData[selectedVitalMetric]?.color || '#f43f5e'}40`} className="animate-pulse blur-md" />

                      {/* Data Points */}
                      {points.map((point, i) => (
                        <circle
                          key={`pt-${i}`}
                          cx={point.x}
                          cy={point.y}
                          r={i === activeIndex ? "4" : "2"}
                          fill="white"
                          stroke={vitalPreviewData[selectedVitalMetric]?.color || '#f43f5e'}
                          strokeWidth="2"
                          className="transition-all duration-700 ease-in-out shadow-sm"
                        />
                      ))}
                      
                      {/* Vertical dash line for tooltip */}
                      <line 
                        x1={activePoint.x} 
                        y1={activePoint.y} 
                        x2={activePoint.x} 
                        y2="100" 
                        stroke="currentColor" 
                        strokeDasharray="3,3" 
                        strokeWidth="1.5" 
                        className="text-slate-500/70 transition-all duration-700 ease-in-out" 
                      />
                    </svg>

                    {/* Tooltip */}
                    <div 
                      className="absolute z-20 transition-all duration-700 ease-in-out"
                      style={{
                        left: `calc(1rem + ${activePoint.x}%)`,
                        top: `calc(${activePoint.y}% - 60px)`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="bg-[#1e293b]/95 backdrop-blur-md border border-slate-600/60 text-white rounded-xl px-4 py-2.5 shadow-2xl relative min-w-[130px] flex flex-col items-center">
                        <div className="text-xl font-black tracking-wide leading-none mb-1.5">{vitalPreviewData[selectedVitalMetric]?.title === 'Heart Rate' ? '72 BPM' : vitalPreviewData[selectedVitalMetric]?.title === 'SpO2' ? '98%' : vitalPreviewData[selectedVitalMetric]?.title === 'Temperature' ? '98.4 °F' : vitalPreviewData[selectedVitalMetric]?.title === 'Body Weight' ? '68 kg' : '120/80 mmHg'}</div>
                        <div className="text-[10px] text-slate-300 font-medium whitespace-nowrap leading-none">22 Aug, 10:30 AM</div>
                        <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-1.5 leading-none flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-slate-400" /> Active Reading
                        </div>
                        {/* Tooltip caret pointing down */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e293b] border-r border-b border-slate-600/60 transform rotate-45"></div>
                      </div>
                    </div>
                  </>
                );
              })()}
              
              {/* X-axis labels */}
              <div className="absolute bottom-[-24px] left-8 right-2 flex justify-between text-[11px] font-medium text-slate-400">
                 {vitalsTimeframe === '7D' && <><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></>}
                 {vitalsTimeframe === '30D' && <><span>01 Aug</span><span>08 Aug</span><span>15 Aug</span><span>22 Aug</span><span>29 Aug</span><span>05 Sep</span></>}
                 {vitalsTimeframe === '3M' && <><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></>}
                 {vitalsTimeframe === '1Y' && <><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></>}
              </div>
              
              {/* Average text */}
              <div className="absolute right-2 bottom-8 text-[11px] text-slate-300/80 font-medium">
                Avg. Week: 70 BPM
              </div>

              {/* Sparkle icon at bottom right */}
              <Sparkles className="absolute right-[-12px] bottom-[-16px] w-10 h-10 text-slate-400/20 rotate-12" />
            </div>
          </div>

          {/* Today's Summary (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-3.5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-wide">Today's Summary</span>
            </div>
            
            {/* Donut Chart visual */}
            <div className="flex justify-center my-1.5">
              <div className="relative w-28 h-28 flex items-center justify-center">
                 {/* SVG donut */}
                 {/* Enhanced Circular Gauge */}
                 <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-xl pointer-events-none"></div>
                 <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="8" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#donutGradient)" strokeWidth="8" strokeDasharray="276.46" strokeDashoffset="5.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }} className="animate-fade-in" />
                    <defs>
                       <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#fbbf24" />
                       </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute text-center flex flex-col items-center justify-center pt-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter shadow-sm leading-none">98<span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold ml-0.5">%</span></span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1 leading-none">Vitals Score</span>
                 </div>
              </div>
            </div>

            <div className="space-y-0.5 text-xs">
              {[
                { label: 'Heart Rate', icon: Heart, color: 'text-rose-500' },
                { label: 'Blood Pressure', icon: Activity, color: 'text-indigo-400' },
                { label: 'Temperature', icon: Thermometer, color: 'text-amber-500' },
                { label: 'SpO₂ • Oxygen', icon: Wind, color: 'text-blue-500' },
                { label: 'Body Weight', icon: Scale, color: 'text-emerald-500' }
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-0.5 border-b border-slate-200 dark:border-slate-800/40 last:border-0">
                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                     <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                     <span className="font-medium text-[11px] tracking-wide">{v.label}</span>
                   </div>
                   <span className="text-[10px] font-bold text-emerald-400 tracking-wide">Normal</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setReportModalOpen(true)}
              className="mt-2 w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
               View Full Report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: 3 PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Health Insights */}
          <div className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-wide">Health Insights</span>
             </div>
             <div className="bg-slate-50 dark:bg-[#121626] border border-slate-200 dark:border-rose-900/20 rounded-lg p-2.5 flex gap-2 items-center shadow-sm dark:shadow-lg relative overflow-hidden">
                {/* Subtle glow behind the text */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 blur-xl rounded-full"></div>
                
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium relative z-10 w-2/3">
                  Your heart rate is slightly elevated after 6 PM. Consider light activities or meditation.
                </p>
                <div className="shrink-0 relative z-10 flex-1 flex justify-end">
                   <Heart className="w-8 h-8 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" strokeWidth={1.5} />
                </div>
             </div>
          </div>

          {/* Weekly Averages */}
          <div className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-2 mb-2.5">
                <BarChart3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-wide">Weekly Averages</span>
             </div>
             <div className="space-y-1.5">
               {[
                 { label: 'Heart Rate', val: '68 BPM', icon: Heart, color: 'text-rose-500', valColor: 'text-rose-500' },
                 { label: 'Blood Pressure', val: '118/76 mmHg', icon: Activity, color: 'text-indigo-400', valColor: 'text-indigo-400' },
                 { label: 'Temperature', val: '98.2 °F', icon: Thermometer, color: 'text-amber-500', valColor: 'text-amber-500' },
                 { label: 'SpO₂', val: '97%', icon: Wind, color: 'text-blue-500', valColor: 'text-blue-500' },
                 { label: 'Body Weight', val: '68.6 kg', icon: Scale, color: 'text-emerald-500', valColor: 'text-emerald-500' }
               ].map((v, i) => (
                 <div key={i} className="flex items-center justify-between text-[11px] px-0.5">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                      <span className="font-medium tracking-wide text-xs">{v.label}</span>
                    </div>
                    <span className={`font-bold tracking-wide text-xs ${v.valColor}`}>{v.val}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 dark:bg-[#15192b]/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-3.5 relative shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                   <Activity className="w-4 h-4 text-blue-500" />
                   <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-wide">Recent Activity</span>
                </div>
                <span className="text-[9px] font-bold text-blue-400 cursor-pointer hover:text-blue-300 tracking-wide uppercase">View All</span>
             </div>
             <div className="space-y-0 relative mt-1">
               {/* Timeline line */}
               <div className="absolute left-[4.5px] top-1.5 bottom-2.5 w-px bg-slate-700/50 z-0"></div>
               
               {[
                 { label: 'Heart Rate recorded', val: '72 BPM', time: '10:30 AM', color: 'bg-rose-500', valColor: 'text-rose-500' },
                 { label: 'Blood Pressure recorded', val: '120/80 mmHg', time: '10:25 AM', color: 'bg-indigo-500', valColor: 'text-indigo-400' },
                 { label: 'Temperature recorded', val: '98.4 °F', time: '10:20 AM', color: 'bg-amber-500', valColor: 'text-amber-500' }
               ].map((a, i) => (
                 <div key={i} className="flex items-start gap-2.5 py-1.5 relative z-10 border-b border-slate-200 dark:border-slate-800/40 last:border-0 px-0.5">
                    <div className={`w-2.5 h-2.5 shrink-0 rounded-full bg-slate-900 border-[1.5px] border-[#0b1120] flex items-center justify-center mt-[3px] shadow-sm`}>
                       <span className={`w-1 h-1 rounded-full ${a.color}`}></span>
                    </div>
                    <div className="flex-1 flex justify-between items-center text-[11px]">
                       <span className="text-slate-600 dark:text-slate-300 font-medium tracking-wide">{a.label}</span>
                       <div className="flex gap-2.5 text-right items-center">
                          <span className={`font-bold tracking-wide ${a.valColor}`}>{a.val}</span>
                          <span className="text-[10px] text-slate-500 font-medium w-10 tracking-wide">{a.time}</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
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
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 block font-medium">Today</span>
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

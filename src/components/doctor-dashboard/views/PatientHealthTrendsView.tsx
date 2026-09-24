import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  Pill, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Info
} from 'lucide-react';
import { vitalApi, medicineApi, type VitalEntity } from '../../../services/dhrApis';

interface PatientHealthTrendsViewProps {
  patientId: string | null;
  patientName?: string;
}

type VitalMetricType = 'bp' | 'heartRate' | 'spo2' | 'bloodSugar' | 'temperature' | 'weight';

export const PatientHealthTrendsView: React.FC<PatientHealthTrendsViewProps> = ({ patientId, patientName }) => {
  const [selectedMetric, setSelectedMetric] = useState<VitalMetricType>('bp');
  
  // Vitals State
  const [vitalsList, setVitalsList] = useState<VitalEntity[]>([]);
  const [isVitalsLoading, setIsVitalsLoading] = useState<boolean>(true);
  const [vitalsError, setVitalsError] = useState<string | null>(null);

  // Medication Adherence State
  const [adherenceData, setAdherenceData] = useState<{
    summary: {
      adherencePercentage: number;
      totalScheduledDoses: number;
      totalTakenDoses: number;
      totalMissedDoses: number;
      totalIncompleteDoses: number;
      lastRecordedVitalDate: string | null;
    };
    timeSeries: Array<{
      date: string;
      label: string;
      scheduled: number;
      taken: number;
      missed: number;
      incomplete: number;
      adherencePct: number;
      status: string;
    }>;
    hasData: boolean;
  } | null>(null);
  const [isAdherenceLoading, setIsAdherenceLoading] = useState<boolean>(true);
  const [adherenceError, setAdherenceError] = useState<string | null>(null);

  // Active hover point state for graph tooltips
  const [hoveredVitalIdx, setHoveredVitalIdx] = useState<number | null>(null);

  // Load backend data for patientId
  useEffect(() => {
    let isMounted = true;

    const loadTrendsData = async () => {
      if (!patientId) {
        setIsVitalsLoading(false);
        setIsAdherenceLoading(false);
        return;
      }

      setIsVitalsLoading(true);
      setIsAdherenceLoading(true);
      setVitalsError(null);
      setAdherenceError(null);

      // 1. Fetch real vitals
      try {
        const res = await vitalApi.getVitals(patientId);
        if (isMounted) {
          const data = res?.data ?? res ?? [];
          setVitalsList(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (isMounted) {
          setVitalsError(err?.message || 'Failed to load patient vitals.');
        }
      } finally {
        if (isMounted) setIsVitalsLoading(false);
      }

      // 2. Fetch real medication adherence
      try {
        const res = await medicineApi.getAdherenceTrends(patientId);
        if (isMounted) {
          const data = res?.data ?? res;
          if (data && data.summary) {
            setAdherenceData(data);
          } else {
            setAdherenceData(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setAdherenceError(err?.message || 'Failed to load medication adherence.');
        }
      } finally {
        if (isMounted) setIsAdherenceLoading(false);
      }
    };

    loadTrendsData();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  // Feature 1: Filter vitals to latest 6 months and sort chronologically
  const sixMonthsVitals = useMemo(() => {
    if (!vitalsList || vitalsList.length === 0) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);

    return vitalsList
      .filter((v) => new Date(v.recordedAt) >= cutoffDate)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  }, [vitalsList]);

  // Last recorded vital date string
  const lastRecordedVitalDate = useMemo(() => {
    if (adherenceData?.summary?.lastRecordedVitalDate) {
      return new Date(adherenceData.summary.lastRecordedVitalDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (vitalsList.length > 0) {
      const latest = [...vitalsList].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
      return new Date(latest.recordedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return null;
  }, [vitalsList, adherenceData]);

  // Helper function to render vital trend SVG line chart
  const renderVitalsChart = () => {
    if (sixMonthsVitals.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
          <HeartPulse className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No vitals recorded for the selected period.
          </p>
          <p className="text-xs text-slate-400">
            No vital telemetry entries were found for this patient in the last 6 months.
          </p>
        </div>
      );
    }

    const svgWidth = 800;
    const svgHeight = 240;
    const paddingX = 40;
    const paddingY = 30;
    const chartW = svgWidth - paddingX * 2;
    const chartH = svgHeight - paddingY * 2;

    // Extract numerical values based on selected metric
    const points = sixMonthsVitals.map((v, i) => {
      let val1 = 0;
      let val2: number | null = null;
      let label = '';

      if (selectedMetric === 'bp') {
        val1 = v.systolicBp || 120;
        val2 = v.diastolicBp || 80;
        label = `${val1}/${val2} mmHg`;
      } else if (selectedMetric === 'heartRate') {
        val1 = v.heartRate || 72;
        label = `${val1} bpm`;
      } else if (selectedMetric === 'spo2') {
        val1 = v.oxygenSaturation || 98;
        label = `${val1}%`;
      } else if (selectedMetric === 'bloodSugar') {
        val1 = v.bloodSugar || 100;
        label = `${val1} mg/dL`;
      } else if (selectedMetric === 'temperature') {
        val1 = v.temperature || 98.6;
        label = `${val1}°F`;
      } else if (selectedMetric === 'weight') {
        val1 = v.weightKg || 70;
        label = `${val1} kg`;
      }

      const dateStr = new Date(v.recordedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      return { idx: i, val1, val2, label, dateStr, rawDate: v.recordedAt };
    });

    // Min and Max calculation for scaling
    let allVals = points.map(p => p.val1);
    if (selectedMetric === 'bp') {
      allVals = allVals.concat(points.map(p => p.val2!).filter(Boolean));
    }
    const minVal = Math.floor(Math.min(...allVals) * 0.9);
    const maxVal = Math.ceil(Math.max(...allVals) * 1.1) || minVal + 20;
    const range = Math.max(1, maxVal - minVal);

    const getX = (index: number) => {
      if (points.length <= 1) return paddingX + chartW / 2;
      return paddingX + (index / (points.length - 1)) * chartW;
    };

    const getY = (val: number) => {
      return paddingY + chartH - ((val - minVal) / range) * chartH;
    };

    // Polyline coordinate path generator
    const linePath1 = points.map((p, idx) => `${getX(idx)},${getY(p.val1)}`).join(' L ');
    const linePath2 = selectedMetric === 'bp'
      ? points.map((p, idx) => `${getX(idx)},${getY(p.val2!)}`).join(' L ')
      : '';

    // Gradient fill area path
    const fillAreaPath1 = `M ${getX(0)},${paddingY + chartH} L ${linePath1} L ${getX(points.length - 1)},${paddingY + chartH} Z`;

    const accentColor = 
      selectedMetric === 'bp' ? '#06b6d4' :
      selectedMetric === 'heartRate' ? '#f43f5e' :
      selectedMetric === 'spo2' ? '#10b981' :
      selectedMetric === 'bloodSugar' ? '#f59e0b' :
      selectedMetric === 'temperature' ? '#8b5cf6' : '#3b82f6';

    return (
      <div className="space-y-3">
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[280px]">
            <defs>
              <linearGradient id={`vitalGradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingY + chartH * (1 - pct);
              const val = Math.round(minVal + range * pct);
              return (
                <g key={idx}>
                  <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                  <text x={paddingX - 8} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-slate-400 font-bold">{val}</text>
                </g>
              );
            })}

            {/* Gradient Fill */}
            <path d={fillAreaPath1} fill={`url(#vitalGradient-${selectedMetric})`} />

            {/* Primary Line */}
            <path d={`M ${linePath1}`} fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Secondary Line (Diastolic BP) */}
            {selectedMetric === 'bp' && (
              <path d={`M ${linePath2}`} fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Data Points */}
            {points.map((p, idx) => {
              const x = getX(idx);
              const y1 = getY(p.val1);
              const y2 = p.val2 !== null ? getY(p.val2) : null;
              const isHovered = hoveredVitalIdx === idx;

              return (
                <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredVitalIdx(idx)} onMouseLeave={() => setHoveredVitalIdx(null)}>
                  {/* Vertical hover guide line */}
                  {isHovered && (
                    <line x1={x} y1={paddingY} x2={x} y2={paddingY + chartH} stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" />
                  )}

                  {/* Primary Point */}
                  <circle cx={x} cy={y1} r={isHovered ? '6' : '4'} fill={accentColor} stroke="#ffffff" strokeWidth="2" />

                  {/* Secondary Point (BP Diastolic) */}
                  {y2 !== null && (
                    <circle cx={x} cy={y2} r={isHovered ? '5' : '3.5'} fill="#64748b" stroke="#ffffff" strokeWidth="2" />
                  )}

                  {/* X-axis Date Labels */}
                  <text x={x} y={svgHeight - 8} textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-bold">
                    {p.dateStr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected / Hovered Value Callout */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700/60">
          <span className="text-slate-500">
            {hoveredVitalIdx !== null ? `Reading on ${points[hoveredVitalIdx]?.dateStr}:` : 'Latest 6 Months Summary:'}
          </span>
          <span className="font-mono text-slate-900 dark:text-white text-sm" style={{ color: accentColor }}>
            {hoveredVitalIdx !== null ? points[hoveredVitalIdx]?.label : `${points.length} telemetry readings recorded`}
          </span>
        </div>
      </div>
    );
  };

  // Helper function to render Medication Adherence Graph
  const renderAdherenceChart = () => {
    if (!adherenceData || !adherenceData.hasData || adherenceData.timeSeries.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
          <Pill className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No medication adherence data available for the selected period.
          </p>
          <p className="text-xs text-slate-400">
            No active medication logs or dose entries have been submitted yet.
          </p>
        </div>
      );
    }

    const items = adherenceData.timeSeries;

    return (
      <div className="space-y-4">
        {/* Adherence Time-Series Stacked Progress Bars */}
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="text-slate-900 dark:text-white">{item.label} ({item.date})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'TAKEN' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    item.status === 'MISSED' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                    item.status === 'INCOMPLETE' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.status}
                  </span>
                  <span className="font-mono text-teal-600 dark:text-cyan-400 font-extrabold">{item.adherencePct}% Adherence</span>
                </div>
              </div>

              {/* Progress Stack Bar */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                {item.taken > 0 && (
                  <div style={{ width: `${(item.taken / Math.max(item.scheduled, 1)) * 100}%` }} className="bg-emerald-500 h-full" title={`Taken: ${item.taken}`} />
                )}
                {item.missed > 0 && (
                  <div style={{ width: `${(item.missed / Math.max(item.scheduled, 1)) * 100}%` }} className="bg-rose-500 h-full" title={`Missed: ${item.missed}`} />
                )}
                {item.incomplete > 0 && (
                  <div style={{ width: `${(item.incomplete / Math.max(item.scheduled, 1)) * 100}%` }} className="bg-amber-400 h-full" title={`Incomplete: ${item.incomplete}`} />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-0.5">
                <span>Total Scheduled: {item.scheduled}</span>
                <div className="flex gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400">Taken: {item.taken}</span>
                  <span className="text-rose-500">Missed: {item.missed}</span>
                  <span className="text-amber-500">Incomplete: {item.incomplete}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const summary = adherenceData?.summary;

  return (
    <div className="space-y-6 select-none font-sans max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            Patient Health Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Real 6-month telemetry vitals timeline & medication adherence analytics
            {patientName ? ` for ${patientName}` : ''}
          </p>
        </div>
      </div>

      {/* FEATURE 4 — DOCTOR-FRIENDLY SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Adherence % */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> Adherence
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {isAdherenceLoading ? '...' : `${summary?.adherencePercentage ?? 0}%`}
          </p>
        </div>

        {/* 2. Total Scheduled */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-500" /> Scheduled
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {isAdherenceLoading ? '...' : (summary?.totalScheduledDoses ?? 0)}
          </p>
        </div>

        {/* 3. Total Taken */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Taken Doses
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {isAdherenceLoading ? '...' : (summary?.totalTakenDoses ?? 0)}
          </p>
        </div>

        {/* 4. Total Missed */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" /> Missed Doses
          </span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {isAdherenceLoading ? '...' : (summary?.totalMissedDoses ?? 0)}
          </p>
        </div>

        {/* 5. Total Incomplete */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" /> Incomplete
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {isAdherenceLoading ? '...' : (summary?.totalIncompleteDoses ?? 0)}
          </p>
        </div>

        {/* 6. Last Vital Date */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-500" /> Last Vital Date
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pt-1">
            {isVitalsLoading ? 'Loading...' : (lastRecordedVitalDate || 'No records')}
          </p>
        </div>
      </div>

      {/* FEATURE 1 — LAST 6 MONTHS VITALS TREND */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              6-Month Vitals Telemetry Trend
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Chronological time-series graph of real patient vitals from the past 6 months
            </p>
          </div>

          {/* VITAL TYPE SELECTOR BUTTONS */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'bp', label: 'Blood Pressure' },
              { id: 'heartRate', label: 'Heart Rate' },
              { id: 'spo2', label: 'SpO2' },
              { id: 'bloodSugar', label: 'Blood Sugar' },
              { id: 'temperature', label: 'Temp' },
              { id: 'weight', label: 'Weight' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMetric(m.id as VitalMetricType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMetric === m.id
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHART DISPLAY AREA */}
        {isVitalsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading 6-month telemetry vitals data...</p>
          </div>
        ) : vitalsError ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
            {vitalsError}
          </div>
        ) : (
          renderVitalsChart()
        )}
      </div>

      {/* FEATURE 2 & 3 — MEDICATION ADHERENCE GRAPH & STATUS BREAKDOWN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-500" />
            Medication Adherence Over Time
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real scheduled vs taken dose tracking with status categories (Taken, Missed, Incomplete, Pending)
          </p>
        </div>

        {/* ADHERENCE CHART DISPLAY AREA */}
        {isAdherenceLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Calculating medication adherence records...</p>
          </div>
        ) : adherenceError ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
            {adherenceError}
          </div>
        ) : (
          renderAdherenceChart()
        )}
      </div>
    </div>
  );
};

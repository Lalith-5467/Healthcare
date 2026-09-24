import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Plus, 
  Heart, 
  Droplets, 
  Wind, 
  Calendar, 
  CheckCircle2, 
  X,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedName } from '../../../utils/caregiverDataTranslator';
import { DEMO_VITALS_BY_WARD, type DemoVitalReading } from '../../../mocks/caregiverVitalsMock';

/* Custom Responsive SVG Trend Chart Component */
interface ChartSeries {
  key: 'systolic' | 'diastolic' | 'bloodSugar' | 'spo2' | 'heartRate';
  label: string;
  color: string;
}

interface BiometricTrendChartProps {
  title: string;
  icon: React.ElementType;
  unit: string;
  data: DemoVitalReading[];
  series: ChartSeries[];
  accentColor: string;
  emptyText: string;
}

const BiometricTrendChart: React.FC<BiometricTrendChartProps> = ({
  title,
  icon: Icon,
  unit,
  data,
  series,
  accentColor,
  emptyText
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter out items that have valid values for any of the series keys
  const validData = useMemo(() => {
    return data.filter(d => series.some(s => typeof d[s.key] === 'number' && !isNaN(d[s.key] as number)));
  }, [data, series]);

  // Compute overall min and max Y for scaling
  const { minY, maxY } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    validData.forEach(d => {
      series.forEach(s => {
        const val = d[s.key];
        if (typeof val === 'number') {
          if (val < min) min = val;
          if (val > max) max = val;
        }
      });
    });

    if (min === Infinity || max === -Infinity) {
      return { minY: 0, maxY: 100 };
    }

    const padding = (max - min) * 0.25 || 10;
    return {
      minY: Math.max(0, Math.floor(min - padding)),
      maxY: Math.ceil(max + padding)
    };
  }, [validData, series]);

  // Dimensions
  const svgWidth = 400;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const getX = (index: number) => {
    if (validData.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (validData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const range = maxY - minY || 1;
    return paddingY + chartHeight - ((val - minY) / range) * chartHeight;
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h4>
            <p className="text-[10px] text-slate-400 font-semibold">{unit}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          {series.map(s => (
            <div key={s.key} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      {validData.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs font-bold text-slate-400">{emptyText}</p>
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            {/* Grid Horizontal Lines */}
            {[0, 0.5, 1].map((pct, idx) => {
              const y = paddingY + chartHeight * pct;
              const val = Math.round(maxY - pct * (maxY - minY));
              return (
                <g key={`grid-${idx}`}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-slate-400"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Lines & Data Points for each series */}
            {series.map(s => {
              const points = validData.map((d, i) => {
                const val = d[s.key] as number;
                return { x: getX(i), y: getY(val), val, raw: d };
              });

              if (points.length === 0) return null;

              const pathD = points.length === 1 
                ? '' 
                : points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

              return (
                <g key={s.key}>
                  {/* Path */}
                  {pathD && (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      d={pathD}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Circles */}
                  {points.map((p, idx) => (
                    <g key={`pt-${s.key}-${idx}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredIdx === idx ? 6 : 4}
                        fill={s.color}
                        stroke="#0b1120"
                        strokeWidth="2"
                        className="transition-all cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    </g>
                  ))}
                </g>
              );
            })}

            {/* X-Axis Date Labels */}
            {validData.map((d, idx) => (
              <text
                key={`xlabel-${idx}`}
                x={getX(idx)}
                y={svgHeight - 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="currentColor"
                className="text-slate-400"
              >
                {d.date}
              </text>
            ))}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredIdx !== null && validData[hoveredIdx] && (
            <div className="absolute top-2 right-2 bg-slate-900 text-white text-[10px] font-bold p-2.5 rounded-xl shadow-xl border border-slate-700 backdrop-blur-md pointer-events-none z-20 space-y-1">
              <p className="text-teal-400 font-black">{validData[hoveredIdx].date}, {validData[hoveredIdx].time}</p>
              {series.map(s => (
                <div key={`tt-${s.key}`} className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">{s.label}:</span>
                  <span style={{ color: s.color }} className="font-extrabold">
                    {validData[hoveredIdx][s.key]} {unit}
                  </span>
                </div>
              ))}
              {validData[hoveredIdx].notes && (
                <p className="text-[9px] text-slate-300 italic pt-1 border-t border-slate-800 max-w-[160px] truncate">
                  "{validData[hoveredIdx].notes}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CaregiverVitalsView: React.FC = () => {
  const { t } = useLanguage();
  const { wards, activeWard, setActiveWardId } = useCaregiverWorkflow();
  
  // Local state for mock vitals per ward
  const [vitalsMap, setVitalsMap] = useState<Record<string, DemoVitalReading[]>>(DEMO_VITALS_BY_WARD);

  // Date range filter state: '7d' | '30d' | 'all'
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('all');

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [systolic, setSystolic] = useState('125');
  const [diastolic, setDiastolic] = useState('80');
  const [bloodSugar, setBloodSugar] = useState('110');
  const [sugarType, setSugarType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Fasting');
  const [spo2, setSpo2] = useState('98');
  const [heartRate, setHeartRate] = useState('72');
  const [temperature, setTemperature] = useState('98.4');
  const [weight, setWeight] = useState('70');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Current active dependent's total vitals (newest to oldest)
  const currentVitals = useMemo(() => {
    return vitalsMap[activeWard.id] || [];
  }, [vitalsMap, activeWard.id]);

  const latest = currentVitals[0];

  // Filtered vitals for trend charts based on selected date range (chronologically oldest to newest for charts)
  const filteredTrendVitals = useMemo(() => {
    if (currentVitals.length === 0) return [];
    if (dateRange === 'all') return [...currentVitals].reverse();

    const now = Date.now();
    const daysLimit = dateRange === '7d' ? 7 : 30;
    const cutoff = now - (daysLimit * 24 * 60 * 60 * 1000);

    const filtered = currentVitals.filter(v => {
      if (v.rawTimestamp) {
        return v.rawTimestamp >= cutoff;
      }
      return true;
    });

    return [...filtered].reverse();
  }, [currentVitals, dateRange]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newReading: DemoVitalReading = {
      id: `demo-vital-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTimestamp: Date.now(),
      systolic: systolic ? parseInt(systolic, 10) : undefined,
      diastolic: diastolic ? parseInt(diastolic, 10) : undefined,
      bloodSugar: bloodSugar ? parseInt(bloodSugar, 10) : undefined,
      sugarType,
      spo2: spo2 ? parseInt(spo2, 10) : undefined,
      heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
      temperature: temperature ? parseFloat(temperature) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes || 'Caregiver observation logged.',
      status: 'normal'
    };

    // Prepend new reading to currently selected dependent's mock array ONLY
    setVitalsMap((prev) => ({
      ...prev,
      [activeWard.id]: [newReading, ...(prev[activeWard.id] || [])]
    }));

    setIsLogOpen(false);
    showToast(`New vital readings logged for ${activeWard.name}!`);
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.vitals.title', 'Biometrics & Vital Trends')}</span>
            </h1>

            {/* DEMO DATA INDICATOR */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 tracking-wider shrink-0">
              {t('caregiver.vitals.demo_data_badge', 'Demo Data')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('caregiver.vitals.subtitle', 'Continuous remote health monitoring with automatic threshold alerts for family members.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* WARD SWITCHER */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {wards.map((ward) => (
              <button
                key={ward.id}
                onClick={() => setActiveWardId(ward.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  ward.id === activeWard.id
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {getLocalizedName(ward.name, t)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLogOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('caregiver.vitals.record_new', 'Record New Reading')}</span>
          </button>
        </div>
      </div>

      {/* LATEST VITALS SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BP */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" /> {t('caregiver.vitals.col_bp', 'Blood Pressure')}
            </span>
            {latest?.systolic ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                {t('caregiver.vitals.optimal', 'Optimal')}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">—</span>
            )}
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.systolic && latest?.diastolic ? `${latest.systolic} / ${latest.diastolic}` : '-- / --'}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">{t('caregiver.vitals.target', 'Target:')} &lt; 130/85 mmHg</p>
        </div>

        {/* BLOOD SUGAR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-500" /> {t('caregiver.vitals.col_glucose', 'Glucose')}
            </span>
            {latest?.sugarType ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-cyan-300">
                {latest.sugarType === 'Fasting' ? t('caregiver.vitals.fasting', 'Fasting') :
                 latest.sugarType === 'Post-Meal' ? t('caregiver.vitals.post_meal', 'Post-Meal') :
                 latest.sugarType}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">—</span>
            )}
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.bloodSugar ? (
              <>{latest.bloodSugar} <span className="text-sm font-normal text-slate-400">mg/dL</span></>
            ) : (
              '--'
            )}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">{t('caregiver.vitals.target', 'Target:')} 80 - 130 mg/dL</p>
        </div>

        {/* SPO2 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-500" /> {t('caregiver.vitals.col_spo2', 'Oxygen (SpO2)')}
            </span>
            {latest?.spo2 ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                {latest.spo2}%
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">—</span>
            )}
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.spo2 ? `${latest.spo2}%` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">{t('caregiver.vitals.target', 'Target:')} 95 - 100%</p>
        </div>

        {/* HEART RATE */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-violet-500" /> {t('caregiver.vitals.col_pulse', 'Pulse')}
            </span>
            {latest?.heartRate ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                {t('caregiver.vitals.resting', 'Resting')}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">—</span>
            )}
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latest?.heartRate ? (
              <>{latest.heartRate} <span className="text-sm font-normal text-slate-400">bpm</span></>
            ) : (
              '--'
            )}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">{t('caregiver.vitals.target', 'Target:')} 60 - 90 bpm</p>
        </div>
      </div>

      {/* PHASE 2: VITAL TRENDS & CHARTS SECTION */}
      <div className="space-y-4">
        {/* SECTION HEADER & DATE RANGE FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0b1120] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.vitals.trends_title', 'Biometric Trends & Analytics')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('caregiver.vitals.trends_sub', 'Historical data visualization for selected time period.')}
            </p>
          </div>

          {/* DATE RANGE FILTER BUTTONS */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <button
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                dateRange === '7d'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('caregiver.vitals.filter_7d', '7 Days')}
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                dateRange === '30d'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('caregiver.vitals.filter_30d', '30 Days')}
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                dateRange === 'all'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('caregiver.vitals.filter_all', 'All')}
            </button>
          </div>
        </div>

        {/* TREND CHARTS GRID OR EMPTY TREND STATE */}
        {filteredTrendVitals.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#0b1120] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t('caregiver.vitals.no_trend_data', 'No trend data available for this dependent.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. BLOOD PRESSURE TREND */}
            <BiometricTrendChart
              title={t('caregiver.vitals.col_bp', 'Blood Pressure')}
              icon={Heart}
              unit="mmHg"
              data={filteredTrendVitals}
              accentColor="#f43f5e"
              emptyText={t('caregiver.vitals.no_trend_data', 'No trend data available for this dependent.')}
              series={[
                { key: 'systolic', label: 'Systolic', color: '#f43f5e' },
                { key: 'diastolic', label: 'Diastolic', color: '#38bdf8' }
              ]}
            />

            {/* 2. BLOOD GLUCOSE TREND */}
            <BiometricTrendChart
              title={t('caregiver.vitals.col_glucose', 'Blood Glucose')}
              icon={Droplets}
              unit="mg/dL"
              data={filteredTrendVitals}
              accentColor="#06b6d4"
              emptyText={t('caregiver.vitals.no_trend_data', 'No trend data available for this dependent.')}
              series={[
                { key: 'bloodSugar', label: 'Glucose', color: '#06b6d4' }
              ]}
            />

            {/* 3. SPO2 OXYGEN TREND */}
            <BiometricTrendChart
              title={t('caregiver.vitals.col_spo2', 'Oxygen (SpO2)')}
              icon={Wind}
              unit="%"
              data={filteredTrendVitals}
              accentColor="#0ea5e9"
              emptyText={t('caregiver.vitals.no_trend_data', 'No trend data available for this dependent.')}
              series={[
                { key: 'spo2', label: 'SpO2', color: '#0ea5e9' }
              ]}
            />

            {/* 4. HEART RATE TREND */}
            <BiometricTrendChart
              title={t('caregiver.vitals.col_pulse', 'Pulse')}
              icon={Activity}
              unit="bpm"
              data={filteredTrendVitals}
              accentColor="#8b5cf6"
              emptyText={t('caregiver.vitals.no_trend_data', 'No trend data available for this dependent.')}
              series={[
                { key: 'heartRate', label: 'Heart Rate', color: '#8b5cf6' }
              ]}
            />
          </div>
        )}
      </div>

      {/* HISTORICAL VITALS LOG TABLE */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>{t('caregiver.vitals.telemetry_history', 'Telemetry History:')} {getLocalizedName(activeWard.name, t)}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('caregiver.vitals.telemetry_sub', 'All records timestamped and cryptographically linked to ABDM health locker.')}
            </p>
          </div>
        </div>

        {currentVitals.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t('caregiver.vitals.no_vitals_found', 'No vitals recorded for this dependent yet.')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_datetime', 'Date & Time')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_bp', 'Blood Pressure')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_glucose', 'Blood Glucose')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_spo2', 'SpO2')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_pulse', 'Pulse')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_notes', 'Notes')}</th>
                  <th className="pb-3 px-3">{t('caregiver.vitals.col_status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {currentVitals.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {v.date}, {v.time}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                      {v.systolic ? `${v.systolic}/${v.diastolic} mmHg` : '—'}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                      {v.bloodSugar ? `${v.bloodSugar} mg/dL (${v.sugarType})` : '—'}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                      {v.spo2 ? `${v.spo2}%` : '—'}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">
                      {v.heartRate ? `${v.heartRate} bpm` : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {v.notes || 'Routine check'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        v.status === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                        v.status === 'elevated' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOG VITAL MODAL */}
      <AnimatePresence>
        {isLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsLogOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>{t('caregiver.vitals.record_vitals_for', 'Record Vitals for')} {getLocalizedName(activeWard.name, t)}</span>
                </h3>
                <button onClick={() => setIsLogOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="110"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Testing Context</label>
                    <select
                      value={sugarType}
                      onChange={(e) => setSugarType(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Fasting">Fasting (Morning)</option>
                      <option value="Post-Meal">Post-Meal (2h post food)</option>
                      <option value="Random">Random</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="98.6"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Observation Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Patient took evening walk, good spirits, hydration normal..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsLogOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    {t('caregiver.common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    {t('caregiver.vitals.save_reading', 'Save Reading')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

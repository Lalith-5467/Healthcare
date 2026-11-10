import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Moon, Scale, Gauge, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { vitalApi, type VitalEntity } from '../../services/dhrApis';
import { useLanguage } from '../../context/LanguageContext';

/* Mini sparkline SVG — 5 data points, accent-colored */
const Sparkline: React.FC<{ color: string; up: boolean }> = ({ color, up }) => {
  const points = up
    ? '0,16 12,12 24,13 36,8 48,4'
    : '0,4 12,8 24,6 36,11 48,14';
  return (
    <svg width="48" height="18" viewBox="0 0 48 18" fill="none" className="shrink-0 opacity-70">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export const HealthSnapshotGrid: React.FC = () => {
  const { t } = useLanguage();
  const [vitalsList, setVitalsList] = useState<VitalEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVitals = async () => {
      try {
        setIsLoading(true);
        const res = await vitalApi.getVitals();
        if (isMounted) {
          const data = res?.data ?? res ?? [];
          setVitalsList(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load vitals');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchVitals();
    return () => { isMounted = false; };
  }, []);

  const latestVital = vitalsList.length > 0 ? vitalsList[0] : null;

  const metrics = useMemo(() => [
    {
      id: 'heart',
      label: t('snapshot.heart_rate', 'Heart Rate'),
      value: latestVital?.heartRate ? `${latestVital.heartRate} BPM` : '-- / --',
      status: latestVital?.heartRate ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: false,
      icon: Heart,
      accent: '#f43f5e',
      accentBg: 'rgba(244,63,94,.1)',
      accentBorder: 'rgba(244,63,94,.2)',
      badgeClr: '#be123c',
      badgeBg: 'rgba(244,63,94,.08)',
    },
    {
      id: 'bp',
      label: t('snapshot.blood_pressure', 'Blood Pressure'),
      value: (latestVital?.systolicBp && latestVital?.diastolicBp) ? `${latestVital.systolicBp}/${latestVital.diastolicBp}` : '-- / --',
      status: (latestVital?.systolicBp && latestVital?.diastolicBp) ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: true,
      icon: Activity,
      accent: '#06b6d4',
      accentBg: 'rgba(6,182,212,.1)',
      accentBorder: 'rgba(6,182,212,.2)',
      badgeClr: '#0e7490',
      badgeBg: 'rgba(6,182,212,.08)',
    },
    {
      id: 'spo2',
      label: t('snapshot.spo2', 'SpO2'),
      value: latestVital?.oxygenSaturation ? `${latestVital.oxygenSaturation}%` : '-- / --',
      status: latestVital?.oxygenSaturation ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: true,
      icon: Moon,
      accent: '#818cf8',
      accentBg: 'rgba(129,140,248,.1)',
      accentBorder: 'rgba(129,140,248,.2)',
      badgeClr: '#4338ca',
      badgeBg: 'rgba(129,140,248,.08)',
    },
    {
      id: 'temp',
      label: t('snapshot.temperature', 'Temperature'),
      value: latestVital?.temperature ? `${latestVital.temperature}°` : '-- / --',
      status: latestVital?.temperature ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: true,
      icon: Gauge,
      accent: '#10b981',
      accentBg: 'rgba(16,185,129,.1)',
      accentBorder: 'rgba(16,185,129,.2)',
      badgeClr: '#065f46',
      badgeBg: 'rgba(16,185,129,.08)',
    },
    {
      id: 'weight',
      label: t('snapshot.body_weight', 'Body Weight'),
      value: latestVital?.weightKg ? `${latestVital.weightKg} kg` : '-- / --',
      status: latestVital?.weightKg ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: true,
      icon: Scale,
      accent: '#14b8a6',
      accentBg: 'rgba(20,184,166,.1)',
      accentBorder: 'rgba(20,184,166,.2)',
      badgeClr: '#0f766e',
      badgeBg: 'rgba(20,184,166,.08)',
    },
    {
      id: 'sugar',
      label: t('snapshot.blood_sugar', 'Blood Sugar'),
      value: latestVital?.bloodSugar ? `${latestVital.bloodSugar} mg/dL` : '-- / --',
      status: latestVital?.bloodSugar ? t('snapshot.status_recorded', 'Recorded') : t('snapshot.status_no_data', 'No Data'),
      trend: t('snapshot.latest_reading', 'Latest reading'),
      isUp: true,
      icon: Gauge,
      accent: '#a855f7',
      accentBg: 'rgba(168,85,247,.1)',
      accentBorder: 'rgba(168,85,247,.2)',
      badgeClr: '#7e22ce',
      badgeBg: 'rgba(168,85,247,.08)',
    },
  ], [latestVital, t]);

  return (
    <div
      className="p-6 rounded-3xl space-y-4 font-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border-[1.5px] border-teal-500/10 dark:border-teal-500/10 shadow-[0_4px_24px_rgba(20,184,166,0.06),_0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      {/* Decorative corner blob */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(20,184,166,.1) 0%,transparent 70%)' }} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('snapshot.title', "Today's Health Biometrics")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {t('snapshot.subtitle', 'Real-time vitals snapshot.')}
          </p>
        </div>
        {isLoading && (
          <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>
      
      {error && (
        <div className="relative z-10 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5 group min-w-0 transition-all duration-200 bg-white/90 dark:bg-slate-800/80"
              style={{
                border: `1px solid ${m.accentBorder}`,
                boxShadow: `0 2px 10px rgba(0,0,0,.04), 0 0 0 0 ${m.accent}`
              }}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: m.accentBg, border: `1px solid ${m.accentBorder}` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: m.accent }} />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 whitespace-nowrap"
                  style={{ background: m.badgeBg, color: m.badgeClr, border: `1px solid ${m.accentBorder}` }}>
                  {m.status}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 block truncate">{m.label}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight block mt-0.5 truncate"
                  style={{ letterSpacing: '-0.02em' }}>
                  {m.value}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1.5 min-w-0"
                style={{ borderTop: `1px solid ${m.accentBorder}` }}>
                <div className="flex items-center gap-1 text-[10px] font-bold min-w-0 truncate"
                  style={{ color: m.isUp ? '#10b981' : '#f43f5e' }}>
                  {m.isUp
                    ? <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                    : <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
                  <span className="truncate">{m.trend}</span>
                </div>
                <Sparkline color={m.accent} up={m.isUp} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

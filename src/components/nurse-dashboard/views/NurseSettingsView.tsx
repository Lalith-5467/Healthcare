import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  Volume2, 
  Smartphone, 
  Moon, 
  Save, 
  CheckCircle2,
  Sliders,
  Database
} from 'lucide-react';

export const NurseSettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    autoAcceptEmergency: true,
    soundAlerts: true,
    liveGpsBroadcast: true,
    maxTravelRadiusKm: '10',
    preferredShift: 'Day Shift (08:00 AM - 06:00 PM)',
    criticalSpO2Threshold: '92',
    criticalBPThreshold: '150/95',
    offlineEhrSync: true,
    preferredLocations: 'Anna Nagar, T. Nagar, Adyar, Velachery'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* SAVED TOAST */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Station Preferences & Alert Thresholds Saved!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" /> Clinical Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Nurse Station Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Configure triage telemetry thresholds, dispatch zones, and alert notifications.
          </p>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. DISPATCH & TRAVEL PREFERENCES */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" /> Dispatch & Travel Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Max Travel Radius (km)</label>
              <input
                type="number"
                value={settings.maxTravelRadiusKm}
                onChange={(e) => setSettings({ ...settings, maxTravelRadiusKm: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Preferred Coverage Zones</label>
              <input
                type="text"
                value={settings.preferredLocations}
                onChange={(e) => setSettings({ ...settings, preferredLocations: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Live GPS Location Sharing</p>
                <p className="text-[11px] text-slate-500">Allows patients to track en-route nurse ETA during active visits.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.liveGpsBroadcast}
                onChange={(e) => setSettings({ ...settings, liveGpsBroadcast: e.target.checked })}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 2. CRITICAL TRIAGE THRESHOLDS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> Telemetry Alarms & Sound Alerts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">Critical Low SpO2 Alarm Threshold (%)</label>
              <input
                type="number"
                value={settings.criticalSpO2Threshold}
                onChange={(e) => setSettings({ ...settings, criticalSpO2Threshold: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-rose-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">High Blood Pressure Alarm Threshold</label>
              <input
                type="text"
                value={settings.criticalBPThreshold}
                onChange={(e) => setSettings({ ...settings, criticalBPThreshold: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-amber-600"
              />
            </div>
          </div>

          <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">Audible Triage Sound Alarms</p>
              <p className="text-[11px] text-slate-500">Play distinct ringtones for emergency SOS patient alerts.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={(e) => setSettings({ ...settings, soundAlerts: e.target.checked })}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </label>
        </div>

        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-500/20 text-xs cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Nurse Settings & Preferences</span>
        </button>

      </form>

    </div>
  );
};

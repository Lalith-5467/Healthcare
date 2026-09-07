import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconAmbulance, 
  IconHeartRateMonitor, 
  IconLungs, 
  IconActivityHeartbeat,
  IconMapPin,
  IconStethoscope
} from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';

export const NursePriorityDispatch: React.FC = () => {
  const { activeDispatch } = NURSING_MOCK_DATA;
  const { vitals } = activeDispatch;

  return (
    <div className="bg-white dark:bg-[#1b1e27] rounded-2xl border border-[#eceef1] dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
      {/* Pink Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ec4899] to-[#db2777]"></div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4 mt-1">
          <div className="flex items-center gap-2 text-[#db2777] font-black uppercase text-[10px] tracking-wider">
            <IconAmbulance className="w-4 h-4" stroke={2.5} /> Active Priority Dispatch
          </div>
          <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Urgent
          </span>
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-[#ec4899] font-bold text-lg border border-pink-100 dark:border-pink-800/50">
            {activeDispatch.patientName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {activeDispatch.patientName}, {activeDispatch.age}
            </h2>
            <p className="text-sm font-semibold text-[#0d9488] mb-1">
              {activeDispatch.visitType}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <IconMapPin className="w-3.5 h-3.5" /> {activeDispatch.address}
            </p>
          </div>
        </div>

        {/* Live Vitals Strip */}
        <div className="bg-[#f6f7f9] dark:bg-[#12141a] rounded-xl p-3 mb-5 border border-[#eceef1] dark:border-slate-800 grid grid-cols-3 gap-2">
          {/* SpO2 */}
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-lg bg-white dark:bg-[#1b1e27] border border-[#eceef1] dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
              <IconLungs className="w-3.5 h-3.5 text-blue-500" /> SpO2
            </div>
            <div className={`text-lg font-black ${vitals.spO2.status === 'normal' ? 'text-[#10b981]' : 'text-rose-500'}`}>
              {vitals.spO2.value}%
            </div>
          </div>
          {/* Heart Rate */}
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-lg bg-white dark:bg-[#1b1e27] border border-[#eceef1] dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
              <IconHeartRateMonitor className="w-3.5 h-3.5 text-rose-400" /> BPM
            </div>
            <div className={`text-lg font-black ${vitals.heartRate.status === 'normal' ? 'text-[#10b981]' : 'text-rose-500'}`}>
              {vitals.heartRate.value}
            </div>
          </div>
          {/* BP */}
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-lg bg-white dark:bg-[#1b1e27] border border-[#eceef1] dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
              <IconActivityHeartbeat className="w-3.5 h-3.5 text-indigo-400" /> BP
            </div>
            <div className={`text-lg font-black ${vitals.bp.status === 'normal' ? 'text-[#10b981]' : vitals.bp.status === 'warning' ? 'text-[#f59e0b]' : 'text-rose-500'}`}>
              {vitals.bp.value}
            </div>
          </div>
        </div>

        <button className="mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#db2777] hover:from-[#db2777] hover:to-[#be185d] text-white text-sm font-bold shadow-md shadow-pink-900/20 transition-all flex items-center justify-center gap-2">
          <IconStethoscope className="w-4 h-4" /> Open Bedside Console
        </button>
      </div>
    </div>
  );
};

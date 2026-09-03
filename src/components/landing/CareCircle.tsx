import React from 'react';
import { 
  Users, 
  Bell, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Pill, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CareCircleProps {
  onManageConsent: () => void;
}

export const CareCircle: React.FC<CareCircleProps> = ({ onManageConsent }) => {


  const notifications = [
    {
      type: 'Medicine Missed',
      desc: 'Morning Vitamin D3 dose unconfirmed at 08:30 AM.',
      time: '10 mins ago',
      icon: Pill,
      badge: 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
    },
    {
      type: 'Appointment Tomorrow',
      desc: 'Annual Cardiology Checkup scheduled with Dr. Rajesh Kumar at 10:00 AM.',
      time: '2 hours ago',
      icon: Calendar,
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    },
    {
      type: 'New Health Record Added',
      desc: 'Comprehensive Diagnostic Report uploaded by Apollo Diagnostic Center.',
      time: 'Yesterday',
      icon: FileText,
      badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    },
    {
      type: 'Emergency Alert',
      desc: 'Emergency SOS Card accessed via QR scan at City Hospital Emergency Room.',
      time: '3 days ago',
      icon: AlertTriangle,
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    },
  ];

  return (
    <section id="caregiver" className="py-24 bg-slate-50 dark:bg-[#0b1120] transition-colors border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[#00a896] dark:text-teal-300 text-xs font-bold mb-4">
            <Users className="w-4 h-4 text-[#00a896]" />
            <span>Caregiver & Family Companion</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Better Care For The People You Love
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
            Grant trusted family members or caregivers secure permission to monitor medicine adherence, view upcoming appointments, receive emergency alerts, and assist with health management.
          </p>
        </div>

        {/* CAREGIVER DASHBOARD & NOTIFICATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT: PATIENT -> CAREGIVER LINK CARD */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f3980] dark:text-cyan-400">Care Connection</span>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Linked & Verified
                </span>
              </div>

              {/* VISUAL DIAGRAM: PATIENT -> CAREGIVER */}
              <div className="py-6 flex items-center justify-around relative">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#0f3980] text-slate-900 dark:text-white flex items-center justify-center font-bold text-lg shadow-md">
                    LP
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Lalith Patel</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Patient</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-0.5 bg-gradient-to-r from-[#0f3980] to-[#00a896]" />
                  <span className="text-[10px] font-bold text-[#00a896] dark:text-teal-400 mt-1">Live Sync</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#00a896] text-white flex items-center justify-center font-bold text-lg shadow-md">
                    MP
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Meera Patel</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Caregiver (Daughter)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Caregiver Access Scope</span>
                  <ShieldCheck className="w-4 h-4 text-[#00a896]" />
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">✓ Real-time medication dose tracking</li>
                  <li className="flex items-center gap-2">✓ Automated emergency SOS push alerts</li>
                  <li className="flex items-center gap-2">✓ Appointment schedule synchronization</li>
                </ul>
              </div>
            </div>

            <button
              onClick={onManageConsent}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-[#0f3980] dark:bg-blue-600 hover:bg-[#0a2558] dark:hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Manage Caregiver Permissions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT: REAL-TIME CAREGIVER NOTIFICATION FEED */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-[#0f3980] dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Caregiver Notification Feed</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Updates in real time</span>
            </div>

            <div className="space-y-4">
              {notifications.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border ${item.badge}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.type}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


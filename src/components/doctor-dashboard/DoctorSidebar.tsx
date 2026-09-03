import React from 'react';
import { 
  Home, 
  Scan, 
  Users, 
  Calendar, 
  Stethoscope, 
  Pill, 
  Brain, 
  Settings
} from 'lucide-react';

interface DoctorSidebarProps {
  activeNav: string;
  onNavigate: (navId: string) => void;
  user?: { name: string; email: string };
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeNav, onNavigate, user }) => {
  const doctorName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Rajesh Varma, MD';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: Home },
    { 
      id: 'scan', 
      label: 'Scan Patient QR', 
      icon: Scan,
      special: true
    },
    { id: 'patients', label: 'Clinical Patients', icon: Users },
    { id: 'appointments', label: 'OPD & Schedule', icon: Calendar },
    { id: 'consultations', label: 'Active Consultation', icon: Stethoscope },
    { id: 'patient-360', label: 'Patient 360° & AI', icon: Brain },
    { id: 'prescriptions', label: 'Prescriptions & Notes', icon: Pill },
    
    { category: 'Practitioner Console' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col h-full select-none font-sans overflow-y-auto">
      
      {/* PRACTITIONER HEADER CARD */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50/80 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/10 border border-teal-200/60 dark:border-cyan-800/40 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty • Clinic
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">MCI-84920</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {doctorName}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Apollo Central • OPD Suite 402
          </p>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Clinical Workflows
          </span>
        </div>

        {NAV_ITEMS.map((item, idx) => {
          if (item.category) {
            return (
              <div key={`cat-${idx}`} className="pt-4 pb-1 px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeNav === item.id || (activeNav === 'patient-360' && ['ai-summary', 'medications', 'vitals', 'labs', 'documents', 'nurse-updates'].includes(item.id!));

          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id!)}
                className={`w-full my-2 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-teal-500/25' 
                    : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-cyan-300 border border-teal-200/80 dark:border-teal-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none ${
                isActive
                  ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-cyan-300 font-bold border border-teal-200/60 dark:border-cyan-800/40 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? 'text-teal-600 dark:text-cyan-400' 
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
      
      {/* FOOTER BADGE */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-cyan-400 shrink-0" />
          <span className="truncate">ABDM Verified Clinician</span>
        </div>
      </div>
    </aside>
  );
};

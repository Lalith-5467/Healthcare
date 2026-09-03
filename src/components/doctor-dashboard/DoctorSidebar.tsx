import React from 'react';
import { 
  Home, 
  Scan, 
  Users, 
  Calendar, 
  Stethoscope, 
  Pill, 
  Brain, 
  Settings,
  ShieldCheck,
  Video
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
    { id: 'consultations', label: 'Active Consultation', icon: Video, urgent: true },
    { id: 'patient-360', label: 'Patient 360° & AI', icon: Brain },
    { id: 'prescriptions', label: 'Prescriptions & Notes', icon: Pill },
    
    { category: 'Practitioner Console' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] select-none font-sans overflow-y-auto">
      
      {/* PRACTITIONER HEADER CARD */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              ON DUTY · CLINIC
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">MCI-84920</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">
              {doctorName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
              Apollo Central · OPD Suite 402
            </p>
          </div>
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
              <div key={item.id} className="px-1 py-1.5">
                <button
                  onClick={() => onNavigate(item.id!)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/20' 
                      : 'bg-teal-50 dark:bg-teal-500/10 hover:bg-teal-100 dark:hover:bg-teal-500/20 text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-teal-500/30 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer outline-none relative overflow-hidden ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full" />
              )}
              
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : item.urgent ? 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                <span className={`truncate ${item.urgent && !isActive ? 'text-blue-700 dark:text-blue-300 font-bold' : ''}`}>
                  {item.label}
                </span>
              </div>
              
              {item.urgent && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* FOOTER BADGE */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0b1120]">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-wider truncate">ABDM Verified Clinician</span>
        </div>
      </div>
    </aside>
  );
};

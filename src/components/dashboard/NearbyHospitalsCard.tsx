import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, MapPin } from 'lucide-react';

interface NearbyHospitalsCardProps {
  onNavigate: (id: string) => void;
}

export const NearbyHospitalsCard: React.FC<NearbyHospitalsCardProps> = ({ onNavigate }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 group font-sans"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Nearby Hospitals
            </h3>
            <span className="text-xs text-slate-300 font-mono">12 Empanelled Facilities</span>
          </div>
        </div>

        <span className="px-3 py-1 text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 font-mono flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Live Location</span>
        </span>
      </div>

      <p className="text-xs text-slate-200 font-medium">
        Find empanelled cashless hospitals, emergency trauma bays, and specialist clinics in your area.
      </p>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <button
          onClick={() => onNavigate('hospitals')}
          className="inline-flex items-center gap-1.5 font-extrabold text-cyan-300 hover:text-white transition-colors cursor-pointer font-sans"
        >
          <span>Find Nearby Hospitals</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-slate-300 font-bold">24x7 Bays Open</span>
      </div>
    </motion.div>
  );
};

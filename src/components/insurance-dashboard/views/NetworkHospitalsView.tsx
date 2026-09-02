import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  BedDouble, 
  Search, 
  ExternalLink,
  Award,
  Clock
} from 'lucide-react';

export const NetworkHospitalsView: React.FC = () => {
  const hospitals = [
    {
      id: 'HOSP-APOLLO',
      name: 'Apollo Central Health City',
      location: 'Greams Road, Thousand Lights, Chennai',
      type: 'Super Specialty • Tier 1 Apex Hospital',
      mouType: '100% Cashless Pre-Auth & Direct Clearinghouse',
      cashlessBedCount: 450,
      nodalOfficer: 'Dr. Srinivasan R. (Ext: 1042)',
      phone: '+91 44 2829 0200',
      status: 'Active Empanelled',
      discountRate: '15% on Tariff Schedule',
      rating: '4.9 ⭐'
    },
    {
      id: 'HOSP-FORTIS',
      name: 'Fortis Malar Hospital',
      location: 'Gandhi Nagar, Adyar, Chennai',
      type: 'Multi Specialty • Cardiology & Oncology Hub',
      mouType: 'Instant ABDM Fast-Track Pre-Auth',
      cashlessBedCount: 220,
      nodalOfficer: 'Ms. Keerthi V. (Ext: 8812)',
      phone: '+91 44 4289 2222',
      status: 'Active Empanelled',
      discountRate: '12% on Tariff Schedule',
      rating: '4.8 ⭐'
    },
    {
      id: 'HOSP-MIOT',
      name: 'MIOT International Hospital',
      location: 'Manapakkam, Chennai',
      type: 'Orthopaedics & Trauma Center',
      mouType: 'Cashless Discharge Clearinghouse Enabled',
      cashlessBedCount: 300,
      nodalOfficer: 'Mr. Arvind Nathan (Ext: 4401)',
      phone: '+91 44 4200 2288',
      status: 'Active Empanelled',
      discountRate: '10% on Tariff Schedule',
      rating: '4.7 ⭐'
    },
    {
      id: 'HOSP-KAUVERY',
      name: 'Kauvery Hospital',
      location: 'Alwarpet, Chennai',
      type: 'Comprehensive Tertiary Care Center',
      mouType: '100% Cashless Pre-Auth & Direct Clearinghouse',
      cashlessBedCount: 180,
      nodalOfficer: 'Dr. Ramya K. (Ext: 9021)',
      phone: '+91 44 4000 6000',
      status: 'Active Empanelled',
      discountRate: '14% on Tariff Schedule',
      rating: '4.8 ⭐'
    }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" /> Network Providers
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Empanelled Network Hospitals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Verified network hospitals with 100% cashless pre-authorization and instant discharge settlement.
          </p>
        </div>

        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{hospitals.length} Tier-1 Hospital MoU Active</span>
        </div>
      </div>

      {/* HOSPITAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-500/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
                  {h.status}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">{h.name}</h3>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{h.location}</span>
                </p>
              </div>
              <span className="text-xs font-black text-amber-500 font-mono">{h.rating}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Facility Type:</span>
                <strong className="text-slate-900 dark:text-white">{h.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">MoU Scheme:</span>
                <strong className="text-blue-600 dark:text-cyan-300 font-bold">{h.mouType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Cashless Bed Capacity:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{h.cashlessBedCount} Beds</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Contracted Discount:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">{h.discountRate}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>{h.phone}</span>
              </div>
              <span className="text-slate-400 text-[11px] font-sans">Nodal: {h.nodalOfficer}</span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

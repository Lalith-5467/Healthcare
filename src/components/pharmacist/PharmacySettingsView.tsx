import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Save, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface PharmacySettingsViewProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    hospitalAffiliation?: string;
  };
}

export const PharmacySettingsView: React.FC<PharmacySettingsViewProps> = ({ user }) => {
  const [storeName, setStoreName] = useState(user?.hospitalAffiliation || 'Apollo Central Pharmacy Hub');
  const [dlNumber, setDlNumber] = useState('DL-KA-BNG-2026-89412');
  const [pciNumber, setPciNumber] = useState('PCI-REG-77419');
  const [gstin, setGstin] = useState('29AABCU9603R1ZM');
  const [phone, setPhone] = useState('+91 80 2234 5678');
  const [email, setEmail] = useState(user?.email || 'dispensary@apollocentral.in');
  const [address, setAddress] = useState('Ground Floor, OPD Block A, Apollo Hospitals, Bannerghatta Rd, Bangalore');
  const [operatingHours, setOperatingHours] = useState('24 Hours / 7 Days Emergency Dispensary');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-5xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
            <Building2 className="w-3.5 h-3.5" /> State Drug Controller & PCI Verified
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Dispensary Profile & Statutory Licenses
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
            Maintain your Drug License (DL Form 20/21), Pharmacy Council accreditation, GST compliance, and ABDM facility credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-400/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Licenses Valid Till Dec 2029
          </span>
        </div>
      </div>

      {/* FORM CARD */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Dispensary credentials and licenses updated successfully.</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Pharmacy Facility Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pharmacy Hub / Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Operating Schedule</label>
              <input
                type="text"
                required
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Store Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Statutory Regulatory Licenses (Government of India)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Drug License (DL Form 20/21)</label>
              <input
                type="text"
                required
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">PCI Pharmacist Registration</label>
              <input
                type="text"
                required
                value={pciNumber}
                onChange={(e) => setPciNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">GSTIN Number</label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>Save & Authorize Licenses</span>
          </button>
        </div>
      </form>

    </div>
  );
};

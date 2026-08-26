import React from 'react';
import { X, Building2, Star, MapPin, Clock, Phone, Truck, CheckCircle2 } from 'lucide-react';
import type { Pharmacy } from './pharmacyData';

interface PharmacyDetailsDrawerProps {
  pharmacy: Pharmacy | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
}

export const PharmacyDetailsDrawer: React.FC<PharmacyDetailsDrawerProps> = ({
  pharmacy,
  isOpen,
  onClose,
  onSelectPharmacy,
}) => {
  if (!isOpen || !pharmacy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto text-slate-900 dark:text-white font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] dark:text-teal-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{pharmacy.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pharmacy.rating}
                </span>
                <span>•</span>
                <span>{pharmacy.distanceKm} km away</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs font-medium">
          {/* LOCATION & PHONE */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>{pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
              <span className="font-mono">{pharmacy.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
              <span>Operating Hours: <strong className="text-emerald-700 dark:text-emerald-400">{pharmacy.openHours}</strong></span>
            </div>
          </div>

          {/* SERVICES AVAILABLE */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">Fulfilment Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pharmacy.deliveryAvailable ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                <Truck className="w-4 h-4" />
                <span className="font-extrabold">{pharmacy.deliveryAvailable ? 'Home Delivery' : 'No Delivery'}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pharmacy.pickupAvailable ? 'bg-teal-500/10 border-teal-500/30 text-teal-700 dark:text-cyan-300' : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                <Building2 className="w-4 h-4" />
                <span className="font-extrabold">{pharmacy.pickupAvailable ? 'Store Pickup' : 'No Pickup'}</span>
              </div>
            </div>
          </div>

          {/* LICENCE & ABDM VERIFICATION */}
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#00a896] dark:text-cyan-400 shrink-0" />
            <div>
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">ABDM Verified Partner Pharmacy</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Licence: <strong className="font-mono">DL-2026-AP-9418</strong></p>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <button
            onClick={() => {
              onSelectPharmacy(pharmacy);
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Select as Fulfilling Pharmacy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Building2, Star, MapPin, Phone, Truck, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col justify-between shadow-2xl p-6 sm:p-7 overflow-y-auto text-slate-900 dark:text-white relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] dark:text-teal-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{pharmacy.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs font-medium">
          {/* LOCATION & PHONE */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>{pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
              <span className="font-mono">{pharmacy.phone}</span>
            </div>
          </div>

          {/* DELIVERY & TIMING */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Delivery Time</span>
                <strong className="text-slate-800 dark:text-slate-200">{pharmacy.deliveryTime}</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00a896]" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Home Delivery</span>
                <strong className="text-slate-800 dark:text-slate-200">{pharmacy.deliveryAvailable ? 'Available' : 'Unavailable'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelectPharmacy(pharmacy);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
          >
            Set as Preferred Pharmacy
          </button>
        </div>
      </div>
    </div>
  );
};

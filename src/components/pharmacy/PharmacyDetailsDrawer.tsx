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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{pharmacy.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {pharmacy.rating}
                </span>
                <span>•</span>
                <span>{pharmacy.distanceKm} km away</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          {/* BADGES */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              {pharmacy.hours}
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              Delivery: {pharmacy.deliveryTime}
            </span>
          </div>

          {/* DETAILS LIST */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-400 block">Address</span>
                <p className="text-slate-200 mt-0.5">{pharmacy.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-t border-slate-800 pt-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-400 block">Contact Phone</span>
                <span className="font-mono text-white">{pharmacy.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-t border-slate-800 pt-2.5">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-400 block">Delivery Services</span>
                <span className="text-slate-200">
                  {pharmacy.deliveryAvailable ? 'Home Delivery & Store Pickup Available' : 'Store Pickup Only'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] leading-relaxed">
            <strong>Verified Partner Pharmacy:</strong> Orders placed with this pharmacy receive priority dispatch and automated prescription validation.
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onSelectPharmacy(pharmacy);
              onClose();
            }}
            className="w-full py-3 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Select Pharmacy for Refill</span>
          </button>
        </div>
      </div>
    </div>
  );
};

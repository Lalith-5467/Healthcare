import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';
import type { EmergencyServiceItem } from './emergencyData';

interface EmergencyServicesSectionProps {
  services: EmergencyServiceItem[];
  onOpenCallModal: (service: EmergencyServiceItem) => void;
  onNavigateHospitals: () => void;
}

export const EmergencyServicesSection: React.FC<EmergencyServicesSectionProps> = ({
  services,
  onOpenCallModal,
  onNavigateHospitals,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">Emergency Services</h3>
          <p className="text-xs text-slate-400">Direct contact options for first responders & trauma care</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {services.map((serv) => {
          const isHospital = serv.iconType === 'hospital';
          return (
            <div key={serv.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-lg">
                  {serv.iconType === 'ambulance' ? '🚑' : serv.iconType === 'police' ? '👮‍♂️' : serv.iconType === 'fire' ? '🚒' : '🏥'}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{serv.serviceName}</h4>
                  <p className="text-slate-400 text-xs mt-0.5">{serv.description}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 font-mono">
                {isHospital ? (
                  <button
                    onClick={onNavigateHospitals}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Find Emergency Hospitals</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenCallModal(serv)}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Call ({serv.phone})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { PharmacyOrder } from './pharmacyData';

interface CancelOrderModalProps {
  isOpen: boolean;
  order: PharmacyOrder | null;
  onClose: () => void;
  onConfirmCancel: (orderId: string) => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmCancel,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Cancel this refill request?</h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Order <strong className="font-mono text-white">{order.id}</strong> from {order.pharmacyName} will be cancelled.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onConfirmCancel(order.id);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors text-xs cursor-pointer"
          >
            Cancel Order
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors text-xs cursor-pointer"
          >
            Keep Order
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { X, Truck, Building2, MapPin, CheckCircle2, Clock, Ban } from 'lucide-react';
import type { PharmacyOrder } from './pharmacyData';

interface OrderTrackingModalProps {
  order: PharmacyOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCancelModal: (order: PharmacyOrder) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenCancelModal,
}) => {
  if (!isOpen || !order) return null;

  const trackingSteps = [
    { label: 'Order Received', time: '10:02 AM', done: true },
    { label: 'Pharmacy Confirmed', time: '10:08 AM', done: true },
    { label: 'Preparing Medicines', time: '10:15 AM', done: true },
    { label: 'Ready for Dispatch', time: '10:25 AM', done: true },
    { label: 'Out for Delivery', time: '10:30 AM', active: order.status === 'Out for Delivery', done: order.status === 'Delivered' },
    { label: 'Delivered to Home', time: 'Pending', done: order.status === 'Delivered' }
  ];

  const canCancel = ['Order Received', 'Confirmed', 'Preparing'].includes(order.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold font-mono text-cyan-400 uppercase tracking-wider">
                {order.id}
              </span>
              <h3 className="text-lg font-extrabold text-white">Live Order Tracking</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ESTIMATED DELIVERY BANNER */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Delivery</span>
            <h4 className="text-base font-extrabold text-white mt-0.5">{order.estimatedDelivery}</h4>
            <span className="text-xs font-bold text-teal-400">{order.pharmacyName}</span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{order.status}</span>
          </div>
        </div>

        {/* ANIMATED ROUTE VISUALIZER */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Delivery Route Simulation
          </span>

          <div className="relative flex items-center justify-between py-4 px-2">
            {/* ROUTE LINE */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800" />
            <motion.div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-teal-500 to-cyan-400"
              initial={{ width: '0%' }}
              animate={{ width: `${order.progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            {/* PHARMACY NODE */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-teal-500 text-teal-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Pharmacy</span>
            </div>

            {/* TRUCK INDICATOR */}
            <motion.div
              className="absolute z-20 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-lg"
              initial={{ left: '10%' }}
              animate={{ left: `${Math.max(10, Math.min(90, order.progressPercent))}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <Truck className="w-4 h-4" />
            </motion.div>

            {/* HOME NODE */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 text-slate-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Home</span>
            </div>
          </div>
        </div>

        {/* VERTICAL TRACKING TIMELINE */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Progress Timeline</h4>
          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="relative pl-8 flex items-center justify-between text-xs">
                <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                  step.done
                    ? 'bg-emerald-500 border-emerald-400'
                    : step.active
                    ? 'bg-cyan-500 border-cyan-300 animate-pulse'
                    : 'bg-slate-900 border-slate-700'
                }`} />
                <span className={`font-bold ${step.done || step.active ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{step.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS IN ORDER */}
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <span className="font-bold text-slate-400 block">Items in this order:</span>
          <div className="space-y-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>{it.name} ({it.dosage}) × {it.quantity}</span>
                <span className="font-mono font-bold text-white">₹{it.quantity * it.unitPrice}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          {canCancel ? (
            <button
              onClick={() => {
                onClose();
                onOpenCancelModal(order);
              }}
              className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">Order in final delivery stage</span>
          )}

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

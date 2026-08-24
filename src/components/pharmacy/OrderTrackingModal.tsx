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
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto text-slate-900 dark:text-white font-sans">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold font-mono text-[#00a896] dark:text-cyan-400 uppercase tracking-wider">
                {order.id}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Live Order Tracking</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ESTIMATED DELIVERY BANNER */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estimated Delivery</span>
            <h4 className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">{order.estimatedDelivery}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Status: <strong className="text-slate-900 dark:text-white">{order.status}</strong></p>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Total Amount</span>
            <span className="text-lg font-extrabold text-amber-700 dark:text-amber-400">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2 font-mono">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Order Progress</span>
            <span className="text-[#00a896] dark:text-cyan-400">{order.progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${order.progressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-[#00a896] to-cyan-500 rounded-full"
            />
          </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">Tracking History</h4>
          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {trackingSteps.map((st, idx) => (
              <div key={idx} className="relative pl-9 flex items-center justify-between text-xs">
                <div className={`absolute left-2 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-1/2 ${
                  st.done
                    ? 'bg-emerald-500 border-emerald-400'
                    : st.active
                    ? 'bg-[#00a896] dark:bg-cyan-400 border-teal-300 animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                }`} />

                <div>
                  <h5 className={`font-bold ${st.done || st.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                    {st.label}
                  </h5>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">{st.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PHARMACY & ADDRESS DETAILS */}
        <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Building2 className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
            <span>Fulfilling Pharmacy: <strong className="text-slate-900 dark:text-white font-extrabold">{order.pharmacyName}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
            <span>Delivery Address: <strong className="text-slate-900 dark:text-white font-semibold">12, Green Park Avenue, New Delhi</strong></span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between gap-3">
          {canCancel && (
            <button
              onClick={() => onOpenCancelModal(order)}
              className="py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              <span>Cancel Order</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-colors flex items-center justify-center cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

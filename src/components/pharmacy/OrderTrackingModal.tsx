import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Building2, MapPin, Ban, Package } from 'lucide-react';
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

  const isDeclined = order.status === 'Declined by Pharmacist' || order.status === 'Cancelled';
  const isPending = order.status === 'Pending Pharmacist Verification';
  const isProcessing = order.status === 'Processing' || order.status === 'Preparing' || order.status === 'Confirmed';
  const isReady = order.status === 'Ready for Pickup' || order.status === 'Out for Delivery';
  const isDelivered = order.status === 'Delivered';

  const trackingSteps = isDeclined
    ? [
        { label: 'Prescription Order Placed', time: '10:02 AM', done: true, active: false },
        { label: 'Pharmacist Clinical Review', time: '10:08 AM', done: true, active: false },
        { label: 'Order Declined by Pharmacist', time: '10:10 AM', done: false, active: true, isError: true },
      ]
    : [
        { label: 'Prescription Order Placed', time: '10:02 AM', done: true, active: false },
        { label: 'Pharmacist Verified & Accepted', time: (order as any).verifiedAt || '10:08 AM', done: !isPending, active: isPending },
        { label: 'Dispensing & Packaging', time: isProcessing ? 'In Progress' : isReady || isDelivered ? 'Completed' : 'Pending', done: isReady || isDelivered, active: isProcessing },
        { label: 'Out for Delivery / Ready', time: isReady ? 'In Transit' : isDelivered ? '10:30 AM' : 'Pending', done: isDelivered, active: isReady },
        { label: 'Delivered to Home', time: isDelivered ? 'Delivered' : 'Pending', done: isDelivered, active: false },
      ];

  const canCancel = isPending || order.status === 'Order Received';

  /* Dot colours */
  const getDotStyle = (step: any) => {
    if (step.isError) return { bg: '#e11d48', border: '#f43f5e', glow: 'rgba(225,29,72,.35)' };
    if (step.done)   return { bg: '#10b981', border: '#34d399', glow: 'rgba(16,185,129,.35)' };
    if (step.active) return { bg: '#00a896', border: '#5eead4', glow: 'rgba(0,168,150,.35)' };
    return            { bg: '#ffffff',    border: '#d1d5db', glow: 'transparent' };
  };

  /* Connector gradient between two steps */
  const getConnectorGradient = (idx: number) => {
    const cur  = trackingSteps[idx];
    const next = trackingSteps[idx + 1];
    const from = cur.done ? '#10b981' : cur.active ? '#00a896' : '#e2e8f0';
    const to   = next?.done ? '#10b981' : next?.active ? '#00a896' : '#e2e8f0';
    return `linear-gradient(to bottom, ${from}, ${to})`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-start sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="w-full max-w-lg my-auto font-sans relative bg-gradient-to-br from-slate-50 via-teal-50/40 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-[1.5px] border-teal-500/20 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_4px_16px_rgba(20,184,166,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_4px_16px_rgba(20,184,166,0.1)]"
        >
          {/* Decorative ambient glows */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(20,184,166,.10) 0%,transparent 70%)' }} />

          <div className="relative z-10 p-5 sm:p-6 space-y-3.5">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(20,184,166,.12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-md shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2dd4bf,#059669)', boxShadow: '0 4px 12px rgba(20,184,166,.3)' }}>
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider block"
                    style={{ color: '#00a896' }}>{order.id}</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                    Live Order Tracking
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-900 dark:text-white transition-colors cursor-pointer bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
                aria-label="Close Tracking Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── DELIVERY BANNER ── */}
            <div className="p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 bg-white/85 dark:bg-slate-900/80 border border-teal-500/15 backdrop-blur-sm shadow-[0_2px_8px_rgba(20,184,166,0.04)]">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Estimated Delivery</span>
                <h4 className="text-sm sm:text-base font-extrabold mt-0.5" style={{ color: '#059669' }}>
                  {order.estimatedDelivery}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Status: <strong className="text-slate-800 dark:text-white">{order.status}</strong>
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block">Total Amount</span>
                <span className="text-lg font-extrabold" style={{ color: '#d97706' }}>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* ── PROGRESS BAR ── */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span className="font-mono uppercase tracking-wider text-[9px]">Order Progress</span>
                <span className="font-mono font-extrabold" style={{ color: '#00a896' }}>{order.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(20,184,166,.1)', border: '1px solid rgba(20,184,166,.15)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${order.progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#00a896,#06b6d4,#34d399)' }}
                />
              </div>
            </div>

            {/* ── TRACKING TIMELINE ── */}
            <div>
              <h4 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" style={{ color: '#00a896' }} />
                Tracking History
              </h4>

              <div className="space-y-0.5">
                {trackingSteps.map((step, idx) => {
                  const dot = getDotStyle(step);
                  const isLast = idx === trackingSteps.length - 1;
                  const isPending = !step.done && !step.active;

                  return (
                    <div key={idx} className="flex gap-3 items-stretch">
                      {/* LEFT — dot + connector */}
                      <div className="flex flex-col items-center" style={{ width: '20px', flexShrink: 0 }}>
                        {/* Dot */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-center justify-center my-0.5"
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: dot.bg,
                            border: `2px solid ${dot.border}`,
                            boxShadow: step.done || step.active ? `0 0 0 3px ${dot.glow}` : 'none',
                            flexShrink: 0,
                          }}
                        >
                          {step.done && (
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5.5 L4.2 7.5 L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {step.active && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}
                            />
                          )}
                        </motion.div>

                        {/* Vertical connector */}
                        {!isLast && (
                          <div style={{
                            width: '2px',
                            flex: 1,
                            minHeight: '16px',
                            background: getConnectorGradient(idx),
                            borderRadius: '2px',
                            opacity: isPending ? 0.3 : 1,
                          }} />
                        )}
                      </div>

                      {/* RIGHT — content */}
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`flex-1 flex items-center justify-between gap-2 ${isLast ? 'pb-0' : 'pb-1.5'}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold leading-tight ${
                            step.done || step.active
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-500 dark:text-slate-400 dark:text-slate-500'
                          }`}>
                            {step.label}
                          </span>
                          {step.active && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold"
                              style={{ background: 'rgba(0,168,150,.12)', color: '#00897b', border: '1px solid rgba(0,168,150,.25)' }}>
                              Live
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-mono font-bold shrink-0 ${
                          step.done
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : step.active
                            ? 'text-[#00a896] dark:text-cyan-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {step.time}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── DECLINED OR VERIFIED ALERTS ── */}
            {isDeclined && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Order Declined by Pharmacist</span>
                </div>
                <p className="text-[11px] font-medium">
                  <strong>Reason:</strong> {(order as any).declineReason || 'Medicines currently unavailable or prescription details unclear'}
                </p>
                {(order as any).pharmacistNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    <strong>Pharmacist Notes:</strong> {(order as any).pharmacistNotes}
                  </p>
                )}
              </div>
            )}

            {!isDeclined && !isPending && (
              <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-800 dark:text-cyan-300 flex items-center justify-between">
                <span>✓ Verified by <strong>{(order as any).pharmacistName || 'Registered Pharmacist'}</strong></span>
                <span className="font-mono text-[10px] text-slate-500">{(order as any).verifiedAt || 'Verified Today'}</span>
              </div>
            )}

            {/* ── PHARMACY & ADDRESS ── */}
            <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid rgba(20,184,166,.12)' }}>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(20,184,166,.1)' }}>
                  <Building2 className="w-3 h-3" style={{ color: '#00a896' }} />
                </div>
                <span>Fulfilling Pharmacy: <strong className="text-slate-900 dark:text-white font-extrabold">{order.pharmacyName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(20,184,166,.1)' }}>
                  <MapPin className="w-3 h-3" style={{ color: '#00a896' }} />
                </div>
                <span>Delivery Address: <strong className="text-slate-900 dark:text-white font-semibold">{(order as any).deliveryAddress || 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai'}</strong></span>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="pt-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(20,184,166,.12)' }}>
              {canCancel && (
                <button
                  onClick={() => onOpenCancelModal(order)}
                  className="py-2 px-3.5 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer hover:opacity-80 shrink-0 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Order</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center cursor-pointer bg-white/90 dark:bg-slate-800/90 border-[1.5px] border-teal-500/25 text-teal-700 dark:text-teal-400 shadow-[0_1px_4px_rgba(20,184,166,0.08)]"
              >
                Close
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

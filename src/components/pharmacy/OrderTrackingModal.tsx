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

  const trackingSteps = [
    { label: 'Order Received',     time: '10:02 AM', done: true,  active: false },
    { label: 'Pharmacy Confirmed', time: '10:08 AM', done: true,  active: false },
    { label: 'Preparing Medicines',time: '10:15 AM', done: true,  active: false },
    { label: 'Ready for Dispatch', time: '10:25 AM', done: true,  active: false },
    { label: 'Out for Delivery',   time: '10:30 AM', done: order.status === 'Delivered', active: order.status === 'Out for Delivery' },
    { label: 'Delivered to Home',  time: 'Pending',  done: order.status === 'Delivered', active: false },
  ];

  const canCancel = ['Order Received', 'Confirmed', 'Preparing'].includes(order.status);

  /* Dot colours */
  const getDotStyle = (step: typeof trackingSteps[0]) => {
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
          className="w-full max-w-lg my-auto font-sans relative"
          style={{
            background: 'linear-gradient(160deg,#f8fafc 0%,#f0fdfa 40%,#ffffff 100%)',
            border: '1.5px solid rgba(20,184,166,.18)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,.15), 0 4px 16px rgba(20,184,166,.08)',
          }}
        >
          {/* Decorative ambient glows */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(20,184,166,.10) 0%,transparent 70%)' }} />

          <div className="relative z-10 p-5 sm:p-6 space-y-3.5">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(20,184,166,.12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shrink-0"
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                style={{ background: 'rgba(0,0,0,.04)', border: '1px solid rgba(0,0,0,.06)' }}
                aria-label="Close Tracking Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── DELIVERY BANNER ── */}
            <div className="p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3"
              style={{ background: 'rgba(255,255,255,.85)', border: '1px solid rgba(20,184,166,.15)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(20,184,166,.04)' }}>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Estimated Delivery</span>
                <h4 className="text-sm sm:text-base font-extrabold mt-0.5" style={{ color: '#059669' }}>
                  {order.estimatedDelivery}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Status: <strong className="text-slate-800 dark:text-white">{order.status}</strong>
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[9px] text-slate-400 font-bold block">Total Amount</span>
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
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1.5">
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
                              : 'text-slate-400 dark:text-slate-500'
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
                            : 'text-slate-400'
                        }`}>
                          {step.time}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PHARMACY & ADDRESS ── */}
            <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid rgba(20,184,166,.12)' }}>
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
                <span>Delivery Address: <strong className="text-slate-900 dark:text-white font-semibold">12, Green Park Avenue, New Delhi</strong></span>
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="pt-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(20,184,166,.12)' }}>
              {canCancel && (
                <button
                  onClick={() => onOpenCancelModal(order)}
                  className="py-2 px-3.5 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer hover:opacity-80 shrink-0"
                  style={{ background: 'rgba(239,68,68,.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,.2)' }}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Order</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255,255,255,.9)', border: '1.5px solid rgba(20,184,166,.25)', color: '#0f766e', boxShadow: '0 1px 4px rgba(20,184,166,.08)' }}
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

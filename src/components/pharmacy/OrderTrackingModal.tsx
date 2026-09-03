import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Building2, MapPin, Package, AlertCircle, Radio, Bell, RefreshCw } from 'lucide-react';
import type { PharmacyOrder } from './pharmacyData';
import {
  fetchPatientPharmacyOrderById,
  DHR_STATUS_DISPLAY,
  DHR_STATUS_PERCENT,
  type BackendPharmacyOrder,
} from '../../services/pharmacyOrderApi';
import { socketService, type OrderStatusUpdatePayload } from '../../services/socketService';

interface OrderTrackingModalProps {
  order: PharmacyOrder | BackendPharmacyOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCancelModal?: (order: any) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order: initialOrder,
  isOpen,
  onClose,
  onOpenCancelModal: _onOpenCancelModal,
}) => {
  // Rule 3: Single authoritative order state
  const [currentOrder, setCurrentOrder] = useState<any>(initialOrder);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const pollingRef = useRef<any>(null);
  const lastProcessedUpdateRef = useRef<string>('');
  const wasDisconnectedRef = useRef<boolean>(false);
  const trackedOrderIdRef = useRef<string>(initialOrder?.id || '');

  // Keep trackedOrderIdRef in sync
  useEffect(() => {
    if (initialOrder?.id) {
      trackedOrderIdRef.current = initialOrder.id;
      setCurrentOrder(initialOrder);
    }
  }, [initialOrder]);

  // Realtime Socket.IO Connection + Resilient Fallback Polling
  useEffect(() => {
    if (!isOpen || !initialOrder?.id) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const orderId = initialOrder.id;
    trackedOrderIdRef.current = orderId;

    // Helper: Authoritative REST fetch (Rule 4 & 5)
    const fetchAuthoritativeOrder = async () => {
      try {
        setFetchError(null);
        let liveOrder = await fetchPatientPharmacyOrderById(orderId);
        if (!liveOrder) {
          // If orderId is a legacy local string (e.g. RX-ORD-...), resolve the real active order from MySQL
          const { fetchPatientPharmacyOrders } = await import('../../services/pharmacyOrderApi');
          const allOrders = await fetchPatientPharmacyOrders();
          if (allOrders && allOrders.length > 0) {
            liveOrder = allOrders[0];
          }
        }

        if (liveOrder) {
          setCurrentOrder(liveOrder);
          trackedOrderIdRef.current = liveOrder.id;
          setFetchError(null);

          // Rule 15: Terminal states stop polling
          if (
            liveOrder.status === 'COMPLETED' ||
            liveOrder.status === 'DELIVERED' ||
            liveOrder.status === 'DECLINED' ||
            liveOrder.status === 'CANCELLED'
          ) {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
          }
        } else {
          setFetchError('Access denied or order not found (404)');
        }
      } catch (err: any) {
        setFetchError(err.message || 'Unable to sync order details.');
      } finally {
        setLoading(false);
      }
    };

    // 1. Initial authoritative fetch
    setLoading(true);
    fetchAuthoritativeOrder();

    // 2. Connect Socket.IO
    socketService.connect();

    // 3. Connection state monitor & fallback management (Rule 14 & 19)
    const unsubConn = socketService.onConnectionChange((connected) => {
      setIsRealtimeActive(connected);

      if (connected) {
        // Socket is healthy: Stop fallback polling
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }

        // Rule 14: If reconnecting, re-fetch authoritative database state once
        if (wasDisconnectedRef.current) {
          wasDisconnectedRef.current = false;
          fetchAuthoritativeOrder();
        }
      } else {
        // Socket disconnected: Start 5-second polling fallback
        wasDisconnectedRef.current = true;
        if (!pollingRef.current) {
          pollingRef.current = setInterval(fetchAuthoritativeOrder, 5000);
        }
      }
    });

    // 4. Realtime Order Update Listener (Rule 11, 12, 13)
    const unsubOrder = socketService.subscribeToOrderUpdates((payload: OrderStatusUpdatePayload) => {
      // Rule 12: An event for Order A MUST NOT update Order B
      if (payload.orderId !== trackedOrderIdRef.current) {
        return;
      }

      // Rule 13: Duplicate event protection (status + updatedAt)
      const updateKey = `${payload.status}-${payload.updatedAt}`;
      if (lastProcessedUpdateRef.current === updateKey) return;
      lastProcessedUpdateRef.current = updateKey;

      // Rule 11: Immediate UI synchronization
      setCurrentOrder((prev: any) => ({
        ...prev,
        status: payload.status,
        updatedAt: payload.updatedAt,
      }));

      // In-app live notification
      const label = DHR_STATUS_DISPLAY[payload.status] || payload.status;
      setLiveNotification(payload.message || `Status updated to ${label}`);
      setTimeout(() => setLiveNotification(null), 4500);

      // Rule 15: Terminal state cleanup
      if (
        payload.status === 'COMPLETED' ||
        payload.status === 'DELIVERED' ||
        payload.status === 'DECLINED' ||
        payload.status === 'CANCELLED'
      ) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    });

    return () => {
      unsubConn();
      unsubOrder();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isOpen, initialOrder?.id]);

  if (!isOpen) return null;

  if (!currentOrder && !loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-base font-extrabold text-slate-800 dark:text-white">No active pharmacy order</h4>
          <p className="text-xs text-slate-500">No active pharmacy order found for this record.</p>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Normalize raw status
  const rawStatus = (currentOrder?.status || 'PENDING').toString().toUpperCase();
  const isDeclined = rawStatus === 'DECLINED';
  const isCancelled = rawStatus === 'CANCELLED';
  const isPending = rawStatus === 'PENDING';
  const isAccepted = rawStatus === 'ACCEPTED';
  const isPreparing = rawStatus === 'PREPARING';
  const isReady = rawStatus === 'READY';
  const isReadyPickup = rawStatus === 'READY_FOR_PICKUP';
  const isOutForDelivery = rawStatus === 'OUT_FOR_DELIVERY';
  const isCompleted = rawStatus === 'COMPLETED' || rawStatus === 'DELIVERED';

  // Rule 6 & 7: Final patient status mapping without conflict
  const displayStatus = DHR_STATUS_DISPLAY[rawStatus] || 'Waiting for Pharmacy';

  // Rule 9: Status-driven progress
  const progressPercent = DHR_STATUS_PERCENT[rawStatus] ?? (isPending ? 20 : 0);

  // Rule 8 & 10: Status-driven timeline with separated READY and OUT_FOR_DELIVERY
  const trackingSteps = isDeclined || isCancelled
    ? [
        { label: 'Prescription Order Placed', time: 'Confirmed', done: true, active: false },
        { label: 'Pharmacist Clinical Review', time: 'Completed', done: true, active: false },
        {
          label: isCancelled ? 'Order Cancelled' : 'Order Declined',
          time: 'Terminal',
          done: false,
          active: true,
          isError: true,
        },
      ]
    : [
        {
          label: 'Prescription Order Placed',
          time: 'Confirmed',
          done: true,
          active: false,
        },
        {
          label: 'Waiting for Pharmacy',
          time: isPending ? 'In Review' : 'Completed',
          done: isAccepted || isPreparing || isReady || isReadyPickup || isOutForDelivery || isCompleted,
          active: isPending,
        },
        {
          label: 'Order Accepted',
          time: isAccepted ? 'Accepted' : isPreparing || isReady || isReadyPickup || isOutForDelivery || isCompleted ? 'Completed' : 'Pending',
          done: isPreparing || isReady || isReadyPickup || isOutForDelivery || isCompleted,
          active: isAccepted,
        },
        {
          label: 'Preparing Your Medicines',
          time: isPreparing ? 'In Progress' : isReady || isReadyPickup || isOutForDelivery || isCompleted ? 'Completed' : 'Pending',
          done: isReady || isReadyPickup || isOutForDelivery || isCompleted,
          active: isPreparing,
        },
        {
          label: isReadyPickup ? 'Ready for Pickup' : 'Ready',
          time: isReady || isReadyPickup ? 'Ready' : isOutForDelivery || isCompleted ? 'Completed' : 'Pending',
          done: isOutForDelivery || isCompleted,
          active: isReady || isReadyPickup,
        },
        {
          label: 'Out for Delivery',
          time: isOutForDelivery ? 'In Transit' : isCompleted ? 'Delivered' : 'Pending',
          done: isCompleted,
          active: isOutForDelivery,
        },
        {
          label: 'Completed',
          time: isCompleted ? 'Delivered' : 'Pending',
          done: isCompleted,
          active: false,
        },
      ];

  const getDotStyle = (step: any) => {
    if (step.isError) return { bg: '#e11d48', border: '#f43f5e', glow: 'rgba(225,29,72,.35)' };
    if (step.done) return { bg: '#10b981', border: '#34d399', glow: 'rgba(16,185,129,.35)' };
    if (step.active) return { bg: '#00a896', border: '#5eead4', glow: 'rgba(0,168,150,.35)' };
    return { bg: '#ffffff', border: '#d1d5db', glow: 'transparent' };
  };

  const pharmacyName = currentOrder?.pharmacy?.name || currentOrder?.pharmacyName || '—';
  const deliveryAddress = currentOrder?.deliveryAddress || '—';
  const totalAmount = currentOrder?.totalAmount != null ? `₹${currentOrder.totalAmount}` : '—';
  const orderItems = currentOrder?.items || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-start sm:items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
<<<<<<< HEAD
          className="w-full max-w-lg my-auto relative"
          style={{
            background: 'linear-gradient(160deg,#f8fafc 0%,#f0fdfa 40%,#ffffff 100%)',
            border: '1.5px solid rgba(20,184,166,.18)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,.15), 0 4px 16px rgba(20,184,166,.08)',
          }}
=======
          className="w-full max-w-lg my-auto font-sans relative bg-gradient-to-br from-slate-50 via-teal-50/40 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-[1.5px] border-teal-500/20 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_4px_16px_rgba(20,184,166,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_4px_16px_rgba(20,184,166,0.1)]"
>>>>>>> origin/main
        >
          <div className="relative z-10 p-5 sm:p-6 space-y-4">
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(20,184,166,.12)' }}>
              <div className="flex items-center gap-3">
<<<<<<< HEAD
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2dd4bf,#059669)' }}
                >
=======
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-white shadow-md shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2dd4bf,#059669)', boxShadow: '0 4px 12px rgba(20,184,166,.3)' }}>
>>>>>>> origin/main
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider block" style={{ color: '#00a896' }}>
                    #{currentOrder?.id || '—'}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                    Realtime Pharmacy Tracking
                  </h3>
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center gap-2">
                {/* Realtime Status Indicator Badge */}
                {!isCompleted && !isDeclined && !isCancelled && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isRealtimeActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {isRealtimeActive ? (
                      <>
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        <span>Realtime Live</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>Polling Active</span>
                      </>
                    )}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  style={{ background: 'rgba(0,0,0,.04)', border: '1px solid rgba(0,0,0,.06)' }}
                  aria-label="Close Tracking Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── IN-APP LIVE NOTIFICATION TOAST ── */}
            <AnimatePresence>
              {liveNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-3 rounded-2xl bg-teal-600 text-white shadow-lg flex items-center gap-2.5 text-xs font-bold"
                >
                  <Bell className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
                  <span className="flex-1">{liveNotification}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── LOADING BANNER (Rule 23) ── */}
            {loading && (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-2 text-xs text-teal-800">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synchronizing latest order status...</span>
              </div>
            )}

            {fetchError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* ── LIVE STATUS BANNER (Rule 6 & 7) ── */}
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border ${
                isDeclined
                  ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                  : isCompleted
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-white/90 border-teal-500/20 text-slate-900'
              }`}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
                <h4
                  className={`text-sm sm:text-base font-extrabold mt-0.5 ${
                    isDeclined ? 'text-rose-600' : isCompleted ? 'text-emerald-700' : 'text-teal-700'
                  }`}
                >
                  {displayStatus}
=======
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
>>>>>>> origin/main
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Fulfilling Partner: <strong className="text-slate-800">{pharmacyName}</strong>
                </p>
              </div>
              <div className="text-right font-mono">
<<<<<<< HEAD
                <span className="text-[9px] text-slate-400 font-bold block">Total Amount</span>
                <span className="text-lg font-extrabold text-amber-700">{totalAmount}</span>
=======
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block">Total Amount</span>
                <span className="text-lg font-extrabold" style={{ color: '#d97706' }}>₹{order.totalAmount}</span>
>>>>>>> origin/main
              </div>
            </div>

            {/* ── DECLINED ALERT BANNER ── */}
            {isDeclined && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Pharmacy Did Not Accept Order</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  The selected pharmacy could not fulfill this prescription at this time.
                </p>
              </div>
            )}

            {/* ── PROGRESS BAR (Rule 9) ── */}
            {!isDeclined && !isCancelled && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 font-mono">
                  <span className="uppercase tracking-wider text-[9px]">Fulfillment Progress</span>
                  <span style={{ color: '#00a896' }}>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-teal-500/10 border border-teal-500/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* ── TRACKING TIMELINE (READ-ONLY, Rule 8 & 10) ── */}
            <div>
              <h4 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-2.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" style={{ color: '#00a896' }} />
                <span>Realtime Fulfillment Journey</span>
              </h4>

              <div className="space-y-1">
                {trackingSteps.map((step, idx) => {
                  const dot = getDotStyle(step);
                  return (
                    <div key={idx} className="flex gap-3 items-center">
                      <div
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: dot.bg,
                          border: `2px solid ${dot.border}`,
                          boxShadow: step.done || step.active ? `0 0 0 3px ${dot.glow}` : 'none',
                        }}
                      >
                        {step.done && (
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5.5 L4.2 7.5 L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
<<<<<<< HEAD
                      <div className="flex-1 flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className={`font-semibold ${step.active ? 'text-teal-900 font-extrabold' : step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
=======

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
>>>>>>> origin/main
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PHARMACY & DELIVERY DETAILS (Rule 5 & 24) ── */}
            <div className="space-y-1.5 pt-2 border-t border-teal-500/15 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-teal-500/10">
                  <Building2 className="w-3 h-3 text-[#00a896]" />
                </div>
                <span>
                  Fulfilling Pharmacy: <strong className="text-slate-900 font-extrabold">{pharmacyName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-teal-500/10">
                  <MapPin className="w-3 h-3 text-[#00a896]" />
                </div>
                <span>
                  Delivery Address: <strong className="text-slate-900 font-semibold">{deliveryAddress}</strong>
                </span>
              </div>
            </div>

<<<<<<< HEAD
            {/* ── PRESCRIBED ITEMS LIST (Rule 5 & 24) ── */}
            {orderItems.length > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Prescribed Formulations</span>
                <div className="text-[11px] text-slate-700 space-y-0.5">
                  {orderItems.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-semibold">{item.medicineName || item.name} {item.dosage && `(${item.dosage})`}</span>
                      <span className="font-mono text-slate-500">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
=======
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
>>>>>>> origin/main

            {/* ── FOOTER (READ-ONLY PATIENT, Rule 16) ── */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-teal-500/15">
              <span className="text-[10px] text-slate-400 font-medium">
                Observer Mode • Read-only realtime sync
              </span>
              <button
                onClick={onClose}
<<<<<<< HEAD
                className="py-2 px-6 rounded-xl text-xs font-extrabold bg-white border border-teal-500/30 text-teal-800 hover:bg-teal-50 transition-colors cursor-pointer shadow-sm"
=======
                className="flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center cursor-pointer bg-white/90 dark:bg-slate-800/90 border-[1.5px] border-teal-500/25 text-teal-700 dark:text-teal-400 shadow-[0_1px_4px_rgba(20,184,166,0.08)]"
>>>>>>> origin/main
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

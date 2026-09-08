import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Building2, MapPin, Package, AlertCircle, Radio, Bell, RefreshCw, CheckCircle2, Clock, Check, ShieldCheck } from 'lucide-react';
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
  const [currentOrder, setCurrentOrder] = useState<any>(initialOrder);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const pollingRef = useRef<any>(null);
  const lastProcessedUpdateRef = useRef<string>('');
  const trackedOrderIdRef = useRef<string>(initialOrder?.id || '');

  // Keep trackedOrderIdRef in sync
  useEffect(() => {
    if (initialOrder?.id) {
      trackedOrderIdRef.current = initialOrder.id;
      setCurrentOrder(initialOrder);
    }
  }, [initialOrder]);

  // Realtime Socket.IO Connection + High-frequency resilient polling
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

    const fetchAuthoritativeOrder = async () => {
      try {
        let liveOrder = await fetchPatientPharmacyOrderById(orderId);
        
        // If not found by direct ID (e.g. prescription scan order), find active patient order from MySQL
        if (!liveOrder) {
          const { fetchPatientPharmacyOrders } = await import('../../services/pharmacyOrderApi');
          const allOrders = await fetchPatientPharmacyOrders();
          if (allOrders && allOrders.length > 0) {
            const found = allOrders.find(o => o.id === orderId || o.prescriptionId === (initialOrder as any).sourcePrescriptionId);
            if (found) liveOrder = found;
          }
        }

        if (liveOrder) {
          setCurrentOrder(liveOrder);
          trackedOrderIdRef.current = liveOrder.id;
          setFetchError(null);

          const status = (liveOrder.status || '').toUpperCase();
          if (status === 'COMPLETED' || status === 'DELIVERED' || status === 'DECLINED' || status === 'CANCELLED') {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
          }
        }
      } catch (err: any) {
        console.warn('Sync warning:', err);
      } finally {
        setLoading(false);
      }
    };

    // 1. Initial authoritative fetch
    fetchAuthoritativeOrder();

    // 2. Poll every 2.5 seconds for instant pharmacist action reflections
    if (!pollingRef.current) {
      pollingRef.current = setInterval(fetchAuthoritativeOrder, 2500);
    }

    // 3. Connect Socket.IO
    socketService.connect();

    const unsubConn = socketService.onConnectionChange((connected) => {
      setIsRealtimeActive(connected);
      if (connected) {
        fetchAuthoritativeOrder();
      }
    });

    // 4. Realtime Order Update Listener
    const unsubOrder = socketService.subscribeToOrderUpdates((payload: OrderStatusUpdatePayload) => {
      if (payload.orderId !== trackedOrderIdRef.current) {
        return;
      }

      const updateKey = `${payload.status}-${payload.updatedAt}`;
      if (lastProcessedUpdateRef.current === updateKey) return;
      lastProcessedUpdateRef.current = updateKey;

      setCurrentOrder((prev: any) => ({
        ...prev,
        status: payload.status,
        updatedAt: payload.updatedAt,
      }));

      const label = DHR_STATUS_DISPLAY[payload.status] || payload.status;
      setLiveNotification(payload.message || `Status updated: ${label}`);
      setTimeout(() => setLiveNotification(null), 4500);

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
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Normalize raw status
  const rawStatus = (currentOrder?.status || 'PENDING').toString().toUpperCase();
  const isDeclined = rawStatus === 'DECLINED' || rawStatus === 'DECLINED BY PHARMACIST';
  const isCancelled = rawStatus === 'CANCELLED';
  const isPending = rawStatus === 'PENDING' || rawStatus === 'PENDING PHARMACIST VERIFICATION' || rawStatus === 'WAITING FOR PHARMACY';
  const isAccepted = rawStatus === 'ACCEPTED' || rawStatus === 'ACCEPTED BY PHARMACIST';
  const isPreparing = rawStatus === 'PREPARING' || rawStatus === 'PROCESSING';
  const isReadyPickup = rawStatus === 'READY_FOR_PICKUP' || rawStatus === 'READY FOR PICKUP' || rawStatus === 'READY';
  const isOutForDelivery = rawStatus === 'OUT_FOR_DELIVERY' || rawStatus === 'OUT FOR DELIVERY';
  const isCompleted = rawStatus === 'COMPLETED' || rawStatus === 'DELIVERED';

  // Real progression percentages
  let progressPercent = 15;
  if (isAccepted) progressPercent = 35;
  else if (isPreparing) progressPercent = 60;
  else if (isReadyPickup) progressPercent = 80;
  else if (isOutForDelivery) progressPercent = 92;
  else if (isCompleted) progressPercent = 100;
  else if (isDeclined || isCancelled) progressPercent = 0;

  // Real-time timeline steps
  const trackingSteps = isDeclined || isCancelled
    ? [
        { label: 'Prescription Order Transmitted', time: 'Confirmed', done: true, active: false, desc: 'Digital prescription sent to pharmacy network.' },
        { label: 'Pharmacist Clinical Review', time: 'Completed', done: true, active: false, desc: 'Prescription verified by licensed pharmacist.' },
        {
          label: isCancelled ? 'Order Cancelled' : 'Order Declined by Pharmacy',
          time: 'Terminal',
          done: false,
          active: true,
          isError: true,
          desc: currentOrder?.declineReason || 'Pharmacist was unable to fulfill this order.',
        },
      ]
    : [
        {
          label: 'Prescription Order Transmitted',
          time: 'Confirmed',
          done: true,
          active: false,
          desc: 'Prescription sent securely to pharmacy network.',
        },
        {
          label: 'Waiting for Pharmacy Acceptance',
          time: isPending ? 'In Review' : 'Completed',
          done: isAccepted || isPreparing || isReadyPickup || isOutForDelivery || isCompleted,
          active: isPending,
          desc: isPending ? 'Pharmacist is reviewing medications & stock...' : 'Pharmacist has reviewed and accepted the order.',
        },
        {
          label: 'Order Accepted by Pharmacist',
          time: isAccepted ? 'Accepted' : (isPreparing || isReadyPickup || isOutForDelivery || isCompleted) ? 'Completed' : 'Pending',
          done: isPreparing || isReadyPickup || isOutForDelivery || isCompleted,
          active: isAccepted,
          desc: 'Clinical verification approved. Placed in dispensing queue.',
        },
        {
          label: 'Preparing & Packaging Medicines',
          time: isPreparing ? 'Dispensing' : (isReadyPickup || isOutForDelivery || isCompleted) ? 'Completed' : 'Pending',
          done: isReadyPickup || isOutForDelivery || isCompleted,
          active: isPreparing,
          desc: 'Pharmacist is assembling, packaging & labeling medications.',
        },
        {
          label: 'Quality Checked & Ready for Pickup',
          time: isReadyPickup ? 'Ready' : (isOutForDelivery || isCompleted) ? 'Completed' : 'Pending',
          done: isOutForDelivery || isCompleted,
          active: isReadyPickup,
          desc: 'Medications sealed with tamper-proof security stamp.',
        },
        {
          label: 'Out for Delivery / En Route',
          time: isOutForDelivery ? 'In Transit' : isCompleted ? 'Completed' : 'Pending',
          done: isCompleted,
          active: isOutForDelivery,
          desc: 'Delivery rider has picked up package and is en route.',
        },
        {
          label: 'Order Delivered & Completed',
          time: isCompleted ? 'Delivered' : 'Pending',
          done: isCompleted,
          active: isCompleted,
          desc: 'Medicines handed over safely to patient.',
        },
      ];

  const getDotStyle = (step: any) => {
    if (step.isError) return { bg: '#e11d48', border: '#f43f5e', glow: 'rgba(225,29,72,.35)' };
    if (step.done) return { bg: '#10b981', border: '#34d399', glow: 'rgba(16,185,129,.35)' };
    if (step.active) return { bg: '#00a896', border: '#5eead4', glow: 'rgba(0,168,150,.35)' };
    return { bg: '#ffffff', border: '#d1d5db', glow: 'transparent' };
  };

  const pharmacyName = currentOrder?.pharmacy?.name || currentOrder?.pharmacyName || 'Apollo Central Pharmacy';
  const deliveryAddress = currentOrder?.deliveryAddress || 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai';
  const totalAmount = currentOrder?.totalAmount != null ? `₹${currentOrder.totalAmount}` : '₹420';
  const orderItems = currentOrder?.items || currentOrder?.prescription?.items || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="w-full max-w-lg my-auto font-sans relative bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ── HEADER ── */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-white dark:bg-[#0b1120]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 bg-gradient-to-tr from-[#00a896] to-teal-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black font-mono uppercase tracking-wider text-[#00a896] dark:text-cyan-400 block">
                  #{currentOrder?.id ? currentOrder.id.slice(-8).toUpperCase() : 'RX-LIVE'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Realtime Pharmacy Tracking
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border-teal-500/30">
                <span className="w-2 h-2 rounded-full bg-[#00a896] animate-pulse" />
                <span>Realtime Live</span>
              </span>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── LIVE NOTIFICATION TOAST ── */}
          <AnimatePresence>
            {liveNotification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 shrink-0"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span>{liveNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── BODY ── */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
            
            {/* ETA & SUMMARY CARD */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                  Estimated Delivery Time
                </span>
                <span className="text-lg sm:text-xl font-black text-[#00a896] dark:text-cyan-400">
                  {isCompleted ? 'Delivered' : isOutForDelivery ? '10 - 15 mins' : isReadyPickup ? '20 - 25 mins' : '35 - 45 mins'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Fulfilling Partner: <strong className="text-slate-800 dark:text-slate-200">{pharmacyName}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                  Total Amount
                </span>
                <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                  {totalAmount}
                </span>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                <span className="text-[10px] uppercase tracking-wider font-black">Fulfillment Progress</span>
                <span className="text-[#00a896] dark:text-cyan-400 font-extrabold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`h-full rounded-full ${
                    isDeclined || isCancelled
                      ? 'bg-rose-500'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-[#00a896] via-teal-400 to-cyan-400'
                  }`}
                />
              </div>
            </div>

            {/* REALTIME TIMELINE */}
            <div className="space-y-3 pt-1">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a896]" />
                <span>Realtime Fulfillment Journey</span>
              </h4>

              <div className="space-y-2">
                {trackingSteps.map((step, idx) => {
                  const style = getDotStyle(step);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all ${
                        step.active
                          ? 'bg-teal-500/10 border-teal-500/30 ring-1 ring-teal-500/20 shadow-xs'
                          : step.done
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-slate-50/50 dark:bg-slate-850/40 border-slate-100 dark:border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all text-xs font-bold"
                            style={{
                              backgroundColor: style.bg,
                              borderColor: style.border,
                              color: step.done || step.active ? '#ffffff' : '#94a3b8',
                              boxShadow: step.active ? `0 0 10px ${style.glow}` : 'none',
                            }}
                          >
                            {step.done ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : step.active ? (
                              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className={`text-xs font-black ${
                                step.active
                                  ? 'text-[#00a896] dark:text-cyan-300'
                                  : step.done
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-500'
                              }`}>
                                {step.label}
                              </h5>
                              {step.active && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#00a896] text-white animate-pulse">
                                  Live Step
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold shrink-0 px-2 py-0.5 rounded-md ${
                          step.done
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : step.active
                            ? 'bg-teal-500/15 text-[#00a896] dark:text-cyan-300 font-extrabold'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {step.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHARMACY & ADDRESS DETAILS */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00a896] shrink-0" />
                <span className="text-slate-500">Fulfilling Pharmacy:</span>
                <strong className="text-slate-900 dark:text-white truncate">{pharmacyName}</strong>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00a896] shrink-0" />
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-700 dark:text-slate-300 truncate">{deliveryAddress}</span>
              </div>
            </div>

            {/* PRESCRIBED FORMULATIONS LIST */}
            {orderItems && orderItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-400 block">
                  Prescribed Formulations ({orderItems.length})
                </span>
                <div className="space-y-1.5">
                  {orderItems.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold">{item.medicineName || item.name}</strong>
                        <p className="text-[10px] text-slate-500">{item.dosage || item.frequency || 'Take as prescribed'}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                        Qty: {item.quantity || 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER ── */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0b1120]">
            <span className="text-[11px] text-slate-400 font-mono">
              Live WebSocket Sync • 2.5s Auto-Polling
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

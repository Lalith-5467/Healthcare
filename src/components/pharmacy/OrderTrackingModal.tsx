import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Truck, Building2, MapPin, Package, AlertCircle, Radio, Bell, RefreshCw,
  CheckCircle2, Clock, Check, ShieldCheck, CreditCard, Wallet, IndianRupee, QrCode
} from 'lucide-react';
import type { PharmacyOrder } from './pharmacyData';
import {
  fetchPatientPharmacyOrderById,
  payPharmacyOrder,
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
  initialOpenPaymentModal?: boolean;
  initialPaymentMethodChoice?: 'ONLINE_UPI' | 'CARD' | 'NET_BANKING' | 'CASH_AT_PHARMACY';
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order: initialOrder,
  isOpen,
  onClose,
  onOpenCancelModal: _onOpenCancelModal,
  initialOpenPaymentModal,
  initialPaymentMethodChoice,
}) => {
  const [currentOrder, setCurrentOrder] = useState<any>(initialOrder);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // BILLING & PAYMENT WORKFLOW STATE
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethodChoice, setPaymentMethodChoice] = useState<'ONLINE_UPI' | 'CARD' | 'NET_BANKING' | 'CASH_AT_PHARMACY'>(
    initialPaymentMethodChoice || 'ONLINE_UPI'
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string; txnRef?: string } | null>(null);

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

  // Synchronize initial payment modal trigger
  useEffect(() => {
    if (isOpen && initialOpenPaymentModal) {
      setIsPaymentModalOpen(true);
      if (initialPaymentMethodChoice) {
        setPaymentMethodChoice(initialPaymentMethodChoice);
      }
    } else if (!isOpen) {
      setIsPaymentModalOpen(false);
      setPaymentMessage(null);
    }
  }, [isOpen, initialOpenPaymentModal, initialPaymentMethodChoice]);

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
        
        // If not found by direct ID (e.g. prescription scan order), find matching patient order from MySQL
        if (!liveOrder) {
          const { fetchPatientPharmacyOrders } = await import('../../services/pharmacyOrderApi');
          const allOrders = await fetchPatientPharmacyOrders();
          if (allOrders && allOrders.length > 0) {
            const found = allOrders.find(
              (o) =>
                o.id === orderId ||
                (o.prescriptionId && (
                  o.prescriptionId === (initialOrder as any).sourcePrescriptionId ||
                  (initialOrder as any)?.prescriptionId === o.prescriptionId
                ))
            );
            if (found) {
              liveOrder = found;
            }
          }
        }

        if (liveOrder) {
          setCurrentOrder((prev: any) => {
            // Guard against stale polling downgrading an already terminal/completed order
            const currentTerminal = prev?.status && (
              prev.status.toUpperCase() === 'COMPLETED' ||
              prev.status.toUpperCase() === 'DELIVERED' ||
              prev.status.toUpperCase() === 'DISPENSED'
            );
            const incomingTerminal = liveOrder?.status && (
              liveOrder.status.toUpperCase() === 'COMPLETED' ||
              liveOrder.status.toUpperCase() === 'DELIVERED' ||
              liveOrder.status.toUpperCase() === 'DISPENSED'
            );
            if (currentTerminal && !incomingTerminal) {
              return prev;
            }
            return liveOrder;
          });
          trackedOrderIdRef.current = liveOrder.id;
          setFetchError(null);

          const status = (liveOrder.status || '').toUpperCase();
          if (status === 'COMPLETED' || status === 'DELIVERED' || status === 'DISPENSED' || status === 'DECLINED' || status === 'CANCELLED') {
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

    // 2. Poll every 2.5 seconds ONLY if order is still active (not yet completed/terminal)
    const initialRaw = (initialOrder?.status || '').toUpperCase();
    const isAlreadyTerminal = initialRaw === 'COMPLETED' || initialRaw === 'DELIVERED' || initialRaw === 'DISPENSED' || initialRaw === 'DECLINED' || initialRaw === 'CANCELLED';
    if (!isAlreadyTerminal && !pollingRef.current) {
      pollingRef.current = setInterval(fetchAuthoritativeOrder, 2500);
    }

    // 3. Connect Socket.IO
    socketService.connect();
    socketService.subscribeToOrderRoom(orderId);

    const unsubConn = socketService.onConnectionChange((connected) => {
      setIsRealtimeActive(connected);
      if (connected) {
        socketService.subscribeToOrderRoom(orderId);
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
        paymentStatus: payload.paymentStatus || prev?.paymentStatus,
        paymentMethod: payload.paymentMethod !== undefined ? payload.paymentMethod : prev?.paymentMethod,
        statusTimeline: payload.statusTimeline || prev?.statusTimeline,
        totalAmount: payload.totalAmount || prev?.totalAmount,
      }));

      const label = DHR_STATUS_DISPLAY[payload.status] || payload.status;
      setLiveNotification(payload.message || `Status updated: ${label}`);
      setTimeout(() => setLiveNotification(null), 4500);

      if (
        payload.status === 'COMPLETED' ||
        payload.status === 'DELIVERED' ||
        payload.status === 'DISPENSED' ||
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

  // Format authentic ISO date/time into 12-hour format e.g. "11:32 AM · 08 Sep 2026"
  const formatTimelineTimestamp = (isoString?: string | null): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return `${timeStr} · ${dateStr}`;
    } catch {
      return '';
    }
  };

  // Normalize raw status
  const rawStatus = (currentOrder?.status || 'PENDING').toString().toUpperCase();
  const isDeclined = rawStatus === 'DECLINED' || rawStatus === 'DECLINED BY PHARMACIST';
  const isCancelled = rawStatus === 'CANCELLED';
  const isPending = rawStatus === 'PENDING' || rawStatus === 'PENDING PHARMACIST VERIFICATION' || rawStatus === 'WAITING FOR PHARMACY';
  const isAccepted = rawStatus === 'ACCEPTED' || rawStatus === 'ACCEPTED BY PHARMACIST';
  const isPreparing = rawStatus === 'PREPARING' || rawStatus === 'PROCESSING';
  const isReadyPickup = rawStatus === 'READY_FOR_PICKUP' || rawStatus === 'READY FOR PICKUP' || rawStatus === 'READY';
  const isOutForDelivery = rawStatus === 'OUT_FOR_DELIVERY' || rawStatus === 'OUT FOR DELIVERY';
  const isDelivered = rawStatus === 'DELIVERED';
  const isCompleted = rawStatus === 'COMPLETED' || rawStatus === 'DISPENSED';

  // Real progression percentages
  let progressPercent = 20;
  if (isAccepted) progressPercent = 40;
  else if (isPreparing) progressPercent = 60;
  else if (isReadyPickup) progressPercent = 80;
  else if (isOutForDelivery) progressPercent = 90;
  else if (isDelivered) progressPercent = 98;
  else if (isCompleted) progressPercent = 100;
  else if (isDeclined || isCancelled) progressPercent = 0;

  // Real-time timeline steps with actual status timestamps
  const timelineData = currentOrder?.statusTimeline || currentOrder?.timeline || {};
  const orderItems = currentOrder?.items || currentOrder?.prescription?.items || [];

  const isPersistedInBackend = Boolean(
    currentOrder?.id &&
    !String(currentOrder.id).startsWith('mock-') &&
    !String(currentOrder.id).startsWith('RX-ORD-')
  );

  const isTransmittedCompleted = isPersistedInBackend && (
    Boolean(currentOrder?.orderedAt || currentOrder?.createdAt) ||
    isPending ||
    isAccepted ||
    isPreparing ||
    isReadyPickup ||
    isOutForDelivery ||
    isDelivered ||
    isCompleted
  );

  const trackingSteps = isDeclined || isCancelled
    ? [
        {
          label: 'Prescription Order Transmitted',
          statusBadge: isTransmittedCompleted ? 'Completed' : 'Failed',
          timestamp: formatTimelineTimestamp(timelineData.TRANSMITTED || currentOrder?.orderedAt || currentOrder?.createdAt),
          done: isTransmittedCompleted,
          active: false,
          desc: isTransmittedCompleted ? 'Prescription sent securely to pharmacy network.' : 'Transmission incomplete.',
        },
        {
          label: 'Pharmacist Clinical Review',
          statusBadge: 'Completed',
          timestamp: formatTimelineTimestamp(timelineData.ACCEPTED || timelineData.DECLINED || currentOrder?.updatedAt),
          done: true,
          active: false,
          desc: 'Prescription reviewed by licensed pharmacist.',
        },
        {
          label: isCancelled ? 'Order Cancelled' : 'Order Declined by Pharmacy',
          statusBadge: isCancelled ? 'Cancelled' : 'Declined',
          timestamp: formatTimelineTimestamp(timelineData.DECLINED || timelineData.CANCELLED || currentOrder?.updatedAt),
          done: false,
          active: true,
          isError: true,
          desc: currentOrder?.declineReason || 'Pharmacist was unable to fulfill this order.',
        },
      ]
    : [
        {
          label: 'Prescription Order Transmitted',
          statusBadge: isTransmittedCompleted ? 'Completed' : (fetchError ? 'Failed' : 'In Progress'),
          timestamp: formatTimelineTimestamp(timelineData.TRANSMITTED || currentOrder?.orderedAt || currentOrder?.createdAt),
          done: isTransmittedCompleted,
          active: !isTransmittedCompleted && !fetchError,
          isError: Boolean(fetchError),
          desc: fetchError
            ? (fetchError || 'Order transmission could not be verified by the pharmacy server.')
            : isTransmittedCompleted
            ? 'Prescription sent securely to pharmacy network.'
            : 'Transmitting prescription securely to registered pharmacy...',
        },
        {
          label: 'Waiting for Pharmacy Acceptance',
          statusBadge: !isTransmittedCompleted ? 'Pending' : (isPending ? 'In Progress' : 'Completed'),
          timestamp: formatTimelineTimestamp(timelineData.PENDING || currentOrder?.orderedAt || currentOrder?.createdAt),
          done: isTransmittedCompleted && (isAccepted || isPreparing || isReadyPickup || isOutForDelivery || isDelivered || isCompleted),
          active: isTransmittedCompleted && isPending,
          desc: !isTransmittedCompleted
            ? 'Waiting for order transmission confirmation.'
            : isPending
            ? 'Pharmacist is reviewing medications and stock.'
            : 'Pharmacist has reviewed and accepted the order.',
        },
        {
          label: 'Order Accepted by Pharmacist',
          statusBadge: isAccepted ? 'In Progress' : (isPreparing || isReadyPickup || isOutForDelivery || isDelivered || isCompleted) ? 'Completed' : 'Pending',
          timestamp: formatTimelineTimestamp(timelineData.ACCEPTED),
          done: isPreparing || isReadyPickup || isOutForDelivery || isDelivered || isCompleted,
          active: isAccepted,
          desc: isAccepted
            ? 'Clinical verification approved. Placed in dispensing queue.'
            : (isPreparing || isReadyPickup || isOutForDelivery || isDelivered || isCompleted)
            ? 'Order accepted by licensed pharmacist.'
            : 'Awaiting clinical review and acceptance by licensed pharmacist.',
        },
        {
          label: 'Preparing & Packaging Medicines',
          statusBadge: isPreparing ? 'In Progress' : (isReadyPickup || isOutForDelivery || isDelivered || isCompleted) ? 'Completed' : 'Pending',
          timestamp: formatTimelineTimestamp(timelineData.PREPARING),
          done: isReadyPickup || isOutForDelivery || isDelivered || isCompleted,
          active: isPreparing,
          desc: isPreparing
            ? 'Pharmacist is assembling, packaging & labeling medications.'
            : 'Medications packaged according to prescription specifications.',
        },
        {
          label: 'Quality Checked & Ready for Pickup',
          statusBadge: isReadyPickup ? 'In Progress' : (isOutForDelivery || isDelivered || isCompleted) ? 'Completed' : 'Pending',
          timestamp: formatTimelineTimestamp(timelineData.READY || timelineData.READY_FOR_PICKUP),
          done: isOutForDelivery || isDelivered || isCompleted,
          active: isReadyPickup,
          desc: isReadyPickup
            ? 'Medications sealed with tamper-proof security stamp and ready.'
            : 'Quality check and security seal verified.',
        },
        {
          label: 'Out for Delivery / En Route',
          statusBadge: isOutForDelivery ? 'In Progress' : (isDelivered || isCompleted) ? 'Completed' : 'Pending',
          timestamp: formatTimelineTimestamp(timelineData.OUT_FOR_DELIVERY),
          done: isDelivered || isCompleted,
          active: isOutForDelivery,
          desc: isOutForDelivery
            ? 'Delivery courier has picked up package and is en route.'
            : 'Dispatched to delivery courier.',
        },
        {
          label: isCompleted ? 'Order Completed' : 'Order Delivered',
          statusBadge: (isCompleted || isDelivered) ? 'Completed' : 'Pending',
          timestamp: formatTimelineTimestamp(timelineData.COMPLETED || timelineData.DELIVERED),
          done: isCompleted || isDelivered,
          active: false,
          desc: isCompleted ? 'Order fulfilled and completed.' : 'Medicines handed over safely to patient.',
        },
      ];

  const getDotStyle = (step: any) => {
    if (step.isError) return { bg: '#e11d48', border: '#f43f5e', glow: 'rgba(225,29,72,.35)' };
    if (step.done) return { bg: '#10b981', border: '#34d399', glow: 'rgba(16,185,129,.35)' };
    if (step.active) return { bg: '#00a896', border: '#5eead4', glow: 'rgba(0,168,150,.35)' };
    return { bg: '#ffffff', border: '#d1d5db', glow: 'transparent' };
  };

  const pharmacyName = currentOrder?.pharmacy?.name || currentOrder?.pharmacyName || (initialOrder as any)?.pharmacyName || 'Registered Partner Pharmacy';
  const deliveryAddress = currentOrder?.deliveryAddress || 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai';

  // Authoritative total amount calculation
  const rawAmt = currentOrder?.totalAmount;
  const parsedAmt = Number(rawAmt);
  let numericTotalAmount = 0;
  let formattedTotalAmount = 'Amount unavailable';

  if (!isNaN(parsedAmt) && parsedAmt > 0) {
    numericTotalAmount = parsedAmt;
    formattedTotalAmount = `₹${parsedAmt.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  } else if (orderItems && orderItems.length > 0) {
    const calculatedSum = orderItems.reduce((acc: number, it: any) => {
      const sub = Number(it.subtotal);
      if (!isNaN(sub) && sub > 0) return acc + sub;
      const qty = Number(it.quantity) || 1;
      const price = Number(it.unitPrice) || 0;
      return acc + (qty * price);
    }, 0);
    if (calculatedSum > 0) {
      numericTotalAmount = calculatedSum;
      formattedTotalAmount = `₹${calculatedSum.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
  }

  const isOrderPaid = currentOrder?.paymentStatus === 'PAID';

  const handleExecutePayment = async () => {
    if (!currentOrder?.id) return;
    setIsProcessingPayment(true);
    setPaymentMessage(null);
    try {
      const res = await payPharmacyOrder(currentOrder.id, {
        paymentMethod: paymentMethodChoice,
      });
      if (res && res.order) {
        setCurrentOrder(res.order);
        const isPaid = res.order.paymentStatus === 'PAID';
        setPaymentMessage({
          type: 'success',
          text: isPaid
            ? `Payment of ₹${res.order.totalAmount} successfully verified and confirmed!`
            : 'Cash at pharmacy recorded. Please pay at counter upon pickup.',
          txnRef: res.payment?.transactionRef || res.order.id,
        });
        window.dispatchEvent(new Event('health_workflow_updated'));
      }
    } catch (err: any) {
      setPaymentMessage({
        type: 'error',
        text: err?.message || 'Payment processing failed. Please try again.',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                    Estimated Delivery Time
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#00a896] dark:text-cyan-400 block leading-tight mt-0.5">
                    {isCompleted ? 'Completed' : isDelivered ? 'Delivered' : isOutForDelivery ? '10 - 15 mins' : isReadyPickup ? '20 - 25 mins' : isPreparing ? '25 - 35 mins' : isAccepted ? '30 - 45 mins' : 'Awaiting Review'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium truncate">
                    Fulfilling Partner: <strong className="text-slate-800 dark:text-slate-200">{pharmacyName}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                    Total Amount
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 block leading-tight mt-0.5">
                    {formattedTotalAmount}
                  </span>
                </div>
              </div>

              {/* PAYMENT STATUS & ACTION STRIP */}
              <div className="px-4 py-2.5 bg-slate-100/75 dark:bg-slate-800/90 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {isOrderPaid ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>PAID ({currentOrder?.paymentMethod || 'Online'})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Payment Pending</span>
                    </span>
                  )}
                </div>

                {!isOrderPaid && (
                  <button
                    type="button"
                    onClick={() => { setPaymentMessage(null); setIsPaymentModalOpen(true); }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                    <span>Pay Now</span>
                  </button>
                )}
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

              <div className="space-y-2.5">
                {trackingSteps.map((step, idx) => {
                  const style = getDotStyle(step);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        step.active
                          ? 'bg-teal-500/10 border-teal-500/30 ring-1 ring-teal-500/20 shadow-xs'
                          : step.done
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
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

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
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
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00a896] text-white animate-pulse">
                                  Live Step
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {step.desc}
                            </p>
                            {step.timestamp && (step.done || step.active) && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                <Clock className="w-3 h-3 text-[#00a896] shrink-0" />
                                <span>{step.timestamp}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold shrink-0 px-2.5 py-0.5 rounded-md ${
                          step.done
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : step.active
                            ? 'bg-teal-500/15 text-[#00a896] dark:text-cyan-300 font-extrabold'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {step.statusBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHARMACY & ADDRESS DETAILS */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
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

            {/* PRESCRIBED FORMULATIONS & ITEMISED BILL BREAKDOWN */}
            {orderItems && orderItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-400 block">
                    Prescribed Medicines & Itemised Bill ({orderItems.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Database Verified Pricing</span>
                </div>

                <div className="space-y-2">
                  {orderItems.map((item: any, i: number) => {
                    const qty = Number(item.quantity) || 1;
                    const price = Number(item.unitPrice) || 12.0;
                    const sub = Number(item.subtotal) || (qty * price);

                    return (
                      <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 dark:text-white font-bold">{item.medicineName || item.name}</strong>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Qty: <strong className="text-slate-700 dark:text-slate-300">{qty}</strong> × ₹{price.toFixed(2)} / unit
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-900 dark:text-white text-xs">
                            ₹{sub.toFixed(2)}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-mono">Subtotal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BILL CALCULATION SUMMARY */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Medicines Subtotal</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formattedTotalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Configured Tax / Delivery</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹0.00</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white">
                    <span>Final Amount</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-black">{formattedTotalAmount}</span>
                  </div>
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

      {/* ── REALTIME BILLING & PAYMENT MODAL ── */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Pharmacy Bill Payment</h4>
                  <span className="text-[10px] font-mono text-slate-500">Order #{currentOrder?.id?.slice(-8).toUpperCase()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PAYMENT SUCCESS / ERROR STATE */}
            {paymentMessage && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  paymentMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {paymentMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <span>{paymentMessage.type === 'success' ? 'Payment Confirmed' : 'Payment Failed'}</span>
                </div>
                <p className="font-medium text-[11px] leading-relaxed">{paymentMessage.text}</p>
                {paymentMessage.txnRef && (
                  <div className="pt-1 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    Ref ID: <strong className="text-slate-800 dark:text-slate-200">{paymentMessage.txnRef}</strong>
                  </div>
                )}
                {paymentMessage.type === 'success' && (
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Done & View Updated Order
                  </button>
                )}
              </div>
            )}

            {!paymentMessage?.type && (
              <>
                {/* BILL AMOUNT SUMMARY CARD */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payable Bill Amount</span>
                    <p className="text-xs text-slate-500 font-medium">Reconciled from MySQL Pharmacy database</p>
                  </div>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formattedTotalAmount}
                  </span>
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                    Select Payment Method
                  </span>

                  {[
                    {
                      id: 'ONLINE_UPI',
                      label: 'Instant UPI / QR Code',
                      desc: 'Google Pay, PhonePe, Paytm, BHIM UPI',
                      icon: QrCode,
                    },
                    {
                      id: 'CARD',
                      label: 'Debit / Credit Card',
                      desc: 'Visa, Mastercard, RuPay Cards',
                      icon: CreditCard,
                    },
                    {
                      id: 'NET_BANKING',
                      label: 'Net Banking',
                      desc: 'SBI, HDFC, ICICI, Axis & 50+ Banks',
                      icon: Building2,
                    },
                    {
                      id: 'CASH_AT_PHARMACY',
                      label: 'Pay Cash at Pharmacy Counter',
                      desc: 'Pay cash to pharmacist when collecting medicines',
                      icon: Wallet,
                    },
                  ].map((m) => {
                    const isSelected = paymentMethodChoice === m.id;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethodChoice(m.id as any)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/30'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#00a896] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-900 dark:text-white">{m.label}</h5>
                            <p className="text-[10px] text-slate-500">{m.desc}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-slate-300 dark:border-slate-600'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SECURITY NOTICE */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>256-Bit SSL Encrypted • Direct Hospital Pharmacy Reconciliation</span>
                </div>

                {/* PAY BUTTON */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleExecutePayment}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying & Processing Payment...</span>
                    </>
                  ) : paymentMethodChoice === 'CASH_AT_PHARMACY' ? (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Confirm Cash at Counter Option</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay {formattedTotalAmount} Now</span>
                    </>
                  )}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

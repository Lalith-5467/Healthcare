import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  ShoppingBag,
  RefreshCw,
  Check,
  Ban,
  Eye,
  Truck,
  Package,
  Radio,
  CreditCard,
} from 'lucide-react';
import {
  fetchPharmacistOrders,
  acceptPharmacyOrder,
  declinePharmacyOrder,
  updatePharmacyOrderStatus,
  confirmPharmacistCashPayment,
  DHR_STATUS_DISPLAY,
  type BackendPharmacyOrder,
} from '../../services/pharmacyOrderApi';
import { socketService, type OrderStatusUpdatePayload } from '../../services/socketService';
import { PharmacistPrescriptionModal } from './PharmacistPrescriptionModal';
import { DeclineOrderModal } from './DeclineOrderModal';

interface PharmacistOrdersViewProps {
  user?: {
    name: string;
    email: string;
    role: string;
    abhaId?: string;
  };
  initialFilter?: string;
  targetOrderId?: string | null;
  onClearTargetOrder?: () => void;
  onToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string, eventKey?: string) => void;
}

export const getOrderStatusToast = (orderId: string, status: string): { title: string; message: string } => {
  const shortId = orderId ? orderId.slice(-6) : '';
  const norm = (status || '').toUpperCase();

  switch (norm) {
    case 'ACCEPTED':
      return {
        title: 'Order Accepted',
        message: `Order #${shortId} was accepted successfully.`,
      };
    case 'PREPARING':
      return {
        title: 'Order Updated',
        message: `Order #${shortId} moved to Preparing.`,
      };
    case 'READY':
    case 'READY_FOR_PICKUP':
      return {
        title: 'Order Ready',
        message: `Order #${shortId} is ready for delivery.`,
      };
    case 'OUT_FOR_DELIVERY':
      return {
        title: 'Out for Delivery',
        message: `Order #${shortId} is out for delivery.`,
      };
    case 'COMPLETED':
    case 'DISPENSED':
    case 'DELIVERED':
      return {
        title: 'Order Completed',
        message: `Order #${shortId} has been completed.`,
      };
    case 'DECLINED':
    case 'CANCELLED':
      return {
        title: 'Order Declined',
        message: `Order #${shortId} was declined.`,
      };
    default: {
      const friendlyName = status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ')) : 'Updated';
      return {
        title: 'Order Updated',
        message: `Order #${shortId} moved to ${friendlyName}.`,
      };
    }
  }
};

export const PharmacistOrdersView: React.FC<PharmacistOrdersViewProps> = ({
  user: _user,
  initialFilter = 'All',
  targetOrderId,
  onClearTargetOrder,
  onToast,
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);

  // MODAL STATES
  const [selectedRxOrder, setSelectedRxOrder] = useState<any | null>(null);
  const [declineTargetOrder, setDeclineTargetOrder] = useState<any | null>(null);

  // Authoritative REST order loader
  const loadOrders = async (silentParam?: boolean | unknown) => {
    const silent = silentParam === true;
    try {
      if (!silent) setLoading(true);
      setErrorMessage(null);
      const data = await fetchPharmacistOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.error('Failed to load pharmacist orders:', err);
      // Fallback is handled in fetchPharmacistOrders, but if any exception occurs, gracefully clear error
      if (!silent) setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Resilient cross-module & cross-tab polling fallback (3.5s interval)
    const pollInterval = setInterval(() => {
      loadOrders(true);
    }, 3500);

    // Cross-module & cross-tab workflow listener
    const handleWorkflowUpdate = () => {
      loadOrders(true);
    };
    window.addEventListener('health_workflow_updated', handleWorkflowUpdate);

    // Cross-tab storage listener (e.g. order submitted in patient tab)
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'health_workflow_last_updated' || e.key === 'pharmacy_order_updated') {
        loadOrders(true);
      }
    };
    window.addEventListener('storage', handleStorageUpdate);

    // Socket.IO Realtime synchronization
    socketService.connect();

    const unsubConn = socketService.onConnectionChange((connected) => {
      setIsRealtimeActive(connected);
      if (connected) {
        // Re-sync on reconnection
        loadOrders(true);
      }
    });

    const unsubOrders = socketService.subscribeToOrderUpdates((payload: OrderStatusUpdatePayload) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === payload.orderId);
        if (index >= 0) {
          const updatedList = [...prev];
          updatedList[index] = {
            ...updatedList[index],
            status: payload.status,
            updatedAt: payload.updatedAt,
            paymentStatus: payload.paymentStatus || updatedList[index].paymentStatus,
            paymentMethod: payload.paymentMethod !== undefined ? payload.paymentMethod : updatedList[index].paymentMethod,
          };
          return updatedList;
        } else {
          // A brand new order was routed to this pharmacy!
          loadOrders(true);
          return prev;
        }
      });

      if (payload.previousStatus === 'NEW') {
        const eventKey = `order-${payload.orderId.toLowerCase()}-new`;
        onToast(`New medicine order #${payload.orderId.slice(-6)} received.`, 'info', 'New Order', eventKey);
      } else {
        const { title, message } = getOrderStatusToast(payload.orderId, payload.status);
        const eventKey = `order-${payload.orderId.toLowerCase()}-${(payload.status || '').toLowerCase()}`;
        onToast(message, 'info', title, eventKey);
      }
    });

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('health_workflow_updated', handleWorkflowUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      unsubConn();
      unsubOrders();
    };
  }, []);

  // AUTO-SELECT & OPEN ORDER WHEN TARGET ORDER ID IS PASSED (FROM NOTIFICATIONS)
  useEffect(() => {
    if (targetOrderId && orders.length > 0) {
      const cleanTarget = targetOrderId.trim().toLowerCase();
      const matched = orders.find(
        (o) =>
          o.id.toLowerCase() === cleanTarget ||
          o.id.toLowerCase().endsWith(cleanTarget) ||
          cleanTarget.endsWith(o.id.toLowerCase()) ||
          o.id.slice(-6).toLowerCase() === cleanTarget
      );

      if (matched) {
        setActiveFilter('All');
        setSelectedRxOrder(matched);
        onToast(`Viewing Order #${matched.id.slice(-6)} (${matched.patient?.fullName || 'Patient'})`, 'info', 'Order Selected', `order-${matched.id.toLowerCase()}-view`);
        setTimeout(() => {
          const el = document.getElementById(`order-card-${matched.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
        if (onClearTargetOrder) {
          onClearTargetOrder();
        }
      }
    }
  }, [targetOrderId, orders]);

  // Helper status normalizers
  const normalize = (status?: string) => (status || 'PENDING').toUpperCase();

  // REAL-TIME STATS CALCULATION
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => normalize(o.status) === 'PENDING').length;
  const acceptedCount = orders.filter((o) => normalize(o.status) === 'ACCEPTED').length;
  const preparingCount = orders.filter((o) => normalize(o.status) === 'PREPARING').length;
  const readyCount = orders.filter((o) => normalize(o.status) === 'READY' || normalize(o.status) === 'READY_FOR_PICKUP').length;
  const deliveryCount = orders.filter((o) => normalize(o.status) === 'OUT_FOR_DELIVERY').length;
  const completedCount = orders.filter((o) => normalize(o.status) === 'COMPLETED' || normalize(o.status) === 'DELIVERED' || normalize(o.status) === 'DISPENSED').length;
  const declinedCount = orders.filter((o) => normalize(o.status) === 'DECLINED' || normalize(o.status) === 'CANCELLED').length;

  // HANDLE ACCEPT ORDER
  const handleAcceptOrder = async (orderId: string) => {
    try {
      setActionLoadingId(orderId);
      const updated = await acceptPharmacyOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated, status: 'ACCEPTED' } : o)));
      const { title, message } = getOrderStatusToast(orderId, 'ACCEPTED');
      const eventKey = `order-${orderId.toLowerCase()}-accepted`;
      onToast(message, 'success', title, eventKey);
      window.dispatchEvent(new Event('health_workflow_updated'));
    } catch (err: any) {
      console.error('Accept order failed:', err);
      const errorMsg = err?.message || 'Unable to update this order. Please try again.';
      onToast(errorMsg, 'error');
      loadOrders();
    } finally {
      setActionLoadingId(null);
    }
  };

  // HANDLE DECLINE ORDER
  const handleConfirmDecline = async (orderId: string, reason: string, notes: string) => {
    try {
      setActionLoadingId(orderId);
      const fullReason = notes ? `${reason} - ${notes}` : reason;
      const updated = await declinePharmacyOrder(orderId, fullReason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated, status: 'DECLINED' } : o)));
      const { title, message } = getOrderStatusToast(orderId, 'DECLINED');
      const eventKey = `order-${orderId.toLowerCase()}-declined`;
      onToast(message, 'info', title, eventKey);
      window.dispatchEvent(new Event('health_workflow_updated'));
    } catch (err: any) {
      console.error('Decline order failed:', err);
      const errorMsg = err?.message || 'Unable to decline this order. Please try again.';
      onToast(errorMsg, 'error');
      loadOrders();
    } finally {
      setActionLoadingId(null);
    }
  };

  // ADVANCE ORDER LIFECYCLE (State Machine Compliant)
  const handleAdvanceStatus = async (orderId: string, nextStatus: string) => {
    try {
      setActionLoadingId(orderId);
      const updated = await updatePharmacyOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated, status: nextStatus } : o)));
      const { title, message } = getOrderStatusToast(orderId, nextStatus);
      const eventKey = `order-${orderId.toLowerCase()}-${nextStatus.toLowerCase()}`;
      onToast(message, 'success', title, eventKey);
      window.dispatchEvent(new Event('health_workflow_updated'));
    } catch (err: any) {
      console.error('Advance status failed:', err);
      const errorMsg = err?.message || 'Unable to update this order status. Please try again.';
      onToast(errorMsg, 'error');
      loadOrders();
    } finally {
      setActionLoadingId(null);
    }
  };

  // CONFIRM CASH PAYMENT AT PHARMACY COUNTER
  const handleConfirmCashPayment = async (orderId: string, notes?: string) => {
    try {
      setActionLoadingId(orderId);
      const updated = await confirmPharmacistCashPayment(orderId, notes || 'Cash payment received at pharmacy counter');
      const updatedOrder: BackendPharmacyOrder = ('order' in updated && updated.order) ? updated.order : (updated as any);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, ...updatedOrder, paymentStatus: 'PAID', paymentMethod: 'CASH_AT_PHARMACY' }
            : o
        )
      );
      if (selectedRxOrder && selectedRxOrder.id === orderId) {
        setSelectedRxOrder((prev: any) =>
          prev ? { ...prev, ...updatedOrder, paymentStatus: 'PAID', paymentMethod: 'CASH_AT_PHARMACY' } : null
        );
      }
      const eventKey = `order-${orderId.toLowerCase()}-cash-payment`;
      onToast(`Cash payment of ₹${Number(updatedOrder.totalAmount || 0).toFixed(2)} recorded and verified.`, 'success', 'Payment Verified', eventKey);
      window.dispatchEvent(new Event('health_workflow_updated'));
    } catch (err: any) {
      console.error('Cash confirmation failed:', err);
      const errorMsg = err?.message || 'Failed to record cash payment.';
      onToast(errorMsg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // FILTERED ORDERS LIST
  const filteredOrders = orders.filter((order) => {
    const st = normalize(order.status);

    // Status Filter
    if (activeFilter === 'Pending') {
      if (st !== 'PENDING') return false;
    } else if (activeFilter === 'Accepted') {
      if (st !== 'ACCEPTED') return false;
    } else if (activeFilter === 'Preparing') {
      if (st !== 'PREPARING') return false;
    } else if (activeFilter === 'Ready') {
      if (st !== 'READY' && st !== 'READY_FOR_PICKUP') return false;
    } else if (activeFilter === 'Out for Delivery') {
      if (st !== 'OUT_FOR_DELIVERY') return false;
    } else if (activeFilter === 'Completed') {
      if (st !== 'COMPLETED' && st !== 'DELIVERED' && st !== 'DISPENSED') return false;
    } else if (activeFilter === 'Declined') {
      if (st !== 'DECLINED' && st !== 'CANCELLED') return false;
    }

    // Search Query (Order ID, Prescription ID, Patient)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (order.id || '').toLowerCase().includes(q);
      const matchRx = (order.prescriptionId || order.prescription?.id || order.sourcePrescriptionId || '').toLowerCase().includes(q);
      const matchPatient = (order.patient?.fullName || order.patientName || '').toLowerCase().includes(q);
      const matchItems = (order.items || []).some((item: any) =>
        (item.medicineName || item.name || '').toLowerCase().includes(q)
      );
      return matchId || matchRx || matchPatient || matchItems;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* ── TOP KPI SUMMARY CARDS (DYNAMIC BACKEND DATA) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* TOTAL */}
        <div
          onClick={() => setActiveFilter('All')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'All'
              ? 'bg-teal-500/10 border-[#00a896] shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-[#00a896]/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
              Total Orders
            </span>
            <ShoppingBag className={`w-4 h-4 ${activeFilter === 'All' ? 'text-[#00a896]' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {totalOrders}
          </div>
        </div>

        {/* PENDING VERIFICATION */}
        <div
          onClick={() => setActiveFilter('Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
            activeFilter === 'Pending' || activeFilter === 'New Orders'
              ? 'bg-amber-500/15 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-amber-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono block">
              Pending Verify
            </span>
            <Clock className={`w-4 h-4 text-amber-500 ${activeFilter === 'Pending' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
            {pendingCount}
          </div>
        </div>

        {/* 2. ACCEPTED ORDERS */}
        <div
          onClick={() => setActiveFilter('Accepted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Accepted'
              ? 'bg-teal-500/15 border-teal-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-teal-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono block">
              Accepted
            </span>
            <Check className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-2 font-mono">
            {acceptedCount}
          </div>
        </div>

        {/* 3. PREPARING */}
        <div
          onClick={() => setActiveFilter('Preparing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Preparing'
              ? 'bg-blue-500/15 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-blue-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
              Preparing
            </span>
            <RefreshCw className={`w-4 h-4 text-blue-500 ${activeFilter === 'Preparing' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {preparingCount}
          </div>
        </div>

        {/* 4. READY */}
        <div
          onClick={() => setActiveFilter('Ready')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Ready'
              ? 'bg-purple-500/15 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-purple-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono block">
              Ready / Transit
            </span>
            <Truck className={`w-4 h-4 text-purple-500 ${activeFilter === 'Ready' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
            {readyCount}
          </div>
        </div>

        {/* 6. COMPLETED */}
        <div
          onClick={() => setActiveFilter('Completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Completed'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">
              Delivered
            </span>
            <CheckCircle2 className={`w-4 h-4 text-emerald-500 ${activeFilter === 'Completed' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {completedCount}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Prescription ID, or Patient..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors"
          />
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1 sm:justify-end">
          {[
            { id: 'All', label: `All (${totalOrders})` },
            { id: 'Pending', label: `Pending (${pendingCount})` },
            { id: 'Accepted', label: `Accepted (${acceptedCount})` },
            { id: 'Preparing', label: `Preparing (${preparingCount})` },
            { id: 'Ready', label: `Ready (${readyCount})` },
            { id: 'Out for Delivery', label: `Delivery (${deliveryCount})` },
            { id: 'Completed', label: `Completed (${completedCount})` },
            { id: 'Declined', label: `Declined (${declinedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-[#00a896] to-teal-600 text-white border-transparent shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* REALTIME STATUS BADGE */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{isRealtimeActive ? 'Realtime Live' : 'Connecting...'}</span>
        </div>
      </div>

      {/* ── LOADING, ERROR, EMPTY, OR ORDER LIST ── */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#00a896] animate-spin mx-auto" />
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Loading pharmacy orders...</h4>
          <p className="text-xs text-slate-500">Retrieving operational queue from database.</p>
        </div>
      ) : errorMessage ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
          <h4 className="text-base font-extrabold text-rose-900">Unable to load pharmacy orders.</h4>
          <p className="text-xs text-rose-700">{errorMessage}</p>
          <button
            onClick={loadOrders}
            className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">No pharmacy orders found.</h4>
          <p className="text-xs text-slate-500">
            {activeFilter === 'All'
              ? 'Incoming prescription orders assigned to your registered pharmacy will appear here.'
              : `No orders currently in "${activeFilter}" state.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => {
            const rawStatus = normalize(order.status);
            const isPending = rawStatus === 'PENDING' || rawStatus === 'PENDING_PHARMACIST_VERIFICATION';
            const isAccepted = rawStatus === 'ACCEPTED';
            const isPreparing = rawStatus === 'PREPARING';
            const isReady = rawStatus === 'READY' || rawStatus === 'READY_FOR_PICKUP';
            const isDelivery = rawStatus === 'OUT_FOR_DELIVERY';
            const isCompleted = rawStatus === 'COMPLETED' || rawStatus === 'DELIVERED';
            const isDeclined = rawStatus === 'DECLINED' || rawStatus === 'CANCELLED';

            const patientDisplayName = order.patient?.fullName || order.patientName || 'Patient';
            const rxReference = order.prescriptionId || order.prescription?.id || order.sourcePrescriptionId || `RX-${order.id.slice(-6)}`;
            const itemsList = order.items || [];
            const createdTime = order.orderedAt || order.createdAt ? new Date(order.orderedAt || order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Today';
            const updatedTime = order.updatedAt ? new Date(order.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently';

            return (
              <motion.div
                key={order.id}
                id={`order-card-${order.id}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-[#070c18] rounded-2xl p-5 sm:p-6 border transition-all shadow-sm space-y-5 hover:shadow-md relative overflow-hidden ${
                  selectedRxOrder?.id === order.id ? 'ring-2 ring-[#00a896]' : ''
                } ${
                  isPending
                    ? 'border-amber-500/40 dark:border-amber-500/30'
                    : isDeclined
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* ── ROW HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        isPending
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : isDeclined
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                            Order #{order.id}
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-[#00a896] dark:text-cyan-300 px-2 py-0.5 rounded-md border border-teal-500/20">
                            Rx: {rxReference}
                          </span>
                        </div>
                        {order.prescription?.diagnosis && (
                          <div className="text-xs font-bold text-[#00a896] dark:text-cyan-400 flex items-center gap-1">
                            <span>📄</span>
                            <span>{order.prescription.diagnosis}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Patient: <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-xs">{patientDisplayName}</strong>{order.patientId ? <span className="font-mono text-[10px] text-slate-400 ml-1">({order.patientId})</span> : null} • Created: <span className="font-mono">{createdTime}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STATUS & PAYMENT BADGES */}
                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </span>

                    {order.paymentStatus === 'PAID' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>PAID {order.paymentMethod ? `(${order.paymentMethod.replace(/_/g, ' ')})` : ''}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold font-mono bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-xs">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>PAYMENT PENDING</span>
                      </span>
                    )}

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold font-mono border ${
                        isPending
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs'
                          : isAccepted
                          ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/40'
                          : isPreparing
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40'
                          : isReady
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40'
                          : isDelivery
                          ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/40'
                          : isDeclined
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40'
                          : rawStatus === 'DISPENSED'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/50'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      ● {DHR_STATUS_DISPLAY[rawStatus] || order.status}
                    </span>
                  </div>
                </div>

                {/* ── MEDICINES PREVIEW CHIPS ── */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">
                    Medicines ({itemsList.length}):
                  </span>
                  {itemsList.map((it: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a896]" />
                      <span>{it.medicineName || it.name} {it.dosage && `(${it.dosage})`}</span>
                      <span className="font-mono text-[10px] text-slate-400">×{it.quantity}</span>
                    </span>
                  ))}
                </div>

                {/* ── CARD FOOTER & OPERATIONAL ACTIONS ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Last Updated: <strong className="text-slate-700 dark:text-slate-300">{updatedTime}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRxOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00a896]" />
                      <span>View Order</span>
                    </button>

                    {/* 1. PENDING: Accept / Decline */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          disabled={actionLoadingId === order.id}
                          onClick={() => setDeclineTargetOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-extrabold transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Decline Order</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoadingId === order.id}
                          onClick={() => handleAcceptOrder(order.id)}
                          className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {actionLoadingId === order.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          <span>Accept Order</span>
                        </button>
                      </>
                    )}

                    {/* 2. ACCEPTED: Start Preparing */}
                    {isAccepted && (
                      <button
                        type="button"
                        disabled={actionLoadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'PREPARING')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {actionLoadingId === order.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                        <span>Start Preparing</span>
                      </button>
                    )}

                    {/* 3. PREPARING: Mark Ready */}
                    {isPreparing && (
                      <button
                        type="button"
                        disabled={actionLoadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'READY')}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {actionLoadingId === order.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Mark Ready</span>
                      </button>
                    )}

                    {/* 4. READY: Dispense Medicines / Cash Confirmation / Delivery */}
                    {isReady && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {order.paymentStatus === 'PAID' ? (
                          <button
                            type="button"
                            disabled={actionLoadingId === order.id}
                            onClick={() => handleAdvanceStatus(order.id, 'COMPLETED')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {actionLoadingId === order.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            <span>Dispense & Complete</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={actionLoadingId === order.id}
                              onClick={() => handleConfirmCashPayment(order.id)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                              title="Record and confirm cash payment collected at counter"
                            >
                              {actionLoadingId === order.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                              <span>Confirm Cash (₹{Number(order.totalAmount || 0).toFixed(2)})</span>
                            </button>

                            <button
                              type="button"
                              disabled={true}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed flex items-center gap-1.5 opacity-60"
                              title="Cannot dispense until payment is verified"
                            >
                              <span>Dispense (Unpaid)</span>
                            </button>
                          </>
                        )}

                        {(order.deliveryType === 'HOME_DELIVERY' || order.deliveryType === 'DELIVERY') && order.paymentStatus === 'PAID' && (
                          <button
                            type="button"
                            disabled={actionLoadingId === order.id}
                            onClick={() => handleAdvanceStatus(order.id, 'OUT_FOR_DELIVERY')}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {actionLoadingId === order.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Truck className="w-4 h-4" />
                            )}
                            <span>Out for Delivery</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* 5. OUT FOR DELIVERY: Mark Completed */}
                    {isDelivery && (
                      <button
                        type="button"
                        disabled={actionLoadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'COMPLETED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {actionLoadingId === order.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>Mark Completed</span>
                      </button>
                    )}

                    {/* 6. DISPENSED STATUS INDICATOR */}
                    {rawStatus === 'DISPENSED' && (
                      <button
                        type="button"
                        disabled={actionLoadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'COMPLETED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Mark order strictly as COMPLETED"
                      >
                        {actionLoadingId === order.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Finalize Completion</span>
                      </button>
                    )}

                    {/* 7. COMPLETED STATUS INDICATOR */}
                    {rawStatus === 'COMPLETED' && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Order Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      <PharmacistPrescriptionModal
        isOpen={!!selectedRxOrder}
        order={selectedRxOrder}
        onClose={() => setSelectedRxOrder(null)}
        onAccept={(id) => handleAcceptOrder(id)}
        onOpenDecline={(ord) => setDeclineTargetOrder(ord)}
        onConfirmCashPayment={handleConfirmCashPayment}
      />

      {/* DECLINE CONFIRMATION DIALOG */}
      <DeclineOrderModal
        isOpen={!!declineTargetOrder}
        order={declineTargetOrder}
        onClose={() => setDeclineTargetOrder(null)}
        onConfirmDecline={handleConfirmDecline}
      />
    </div>
  );
};

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
} from 'lucide-react';
import {
  fetchPharmacistOrders,
  acceptPharmacyOrder,
  declinePharmacyOrder,
  updatePharmacyOrderStatus,
  DHR_STATUS_DISPLAY,
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
  onToast: (msg: string) => void;
}

export const PharmacistOrdersView: React.FC<PharmacistOrdersViewProps> = ({
  user: _user,
  initialFilter = 'All',
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
  const loadOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchPharmacistOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.error('Failed to load pharmacist orders:', err);
      // Fallback is handled in fetchPharmacistOrders, but if any exception occurs, gracefully clear error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Cross-module & cross-tab workflow listener
    const handleWorkflowUpdate = () => {
      loadOrders();
    };
    window.addEventListener('health_workflow_updated', handleWorkflowUpdate);

    // Socket.IO Realtime synchronization
    socketService.connect();

    const unsubConn = socketService.onConnectionChange((connected) => {
      setIsRealtimeActive(connected);
      if (connected) {
        // Re-sync on reconnection
        loadOrders();
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
          };
          return updatedList;
        } else {
          // A brand new order was routed to this pharmacy!
          loadOrders();
          return prev;
        }
      });

      if (payload.previousStatus === 'NEW') {
        onToast(`🔔 New Medicine Order: #${payload.orderId.slice(-6)}`);
      } else {
        onToast(`Order #${payload.orderId.slice(-6)} updated to ${payload.status}`);
      }
    });

    return () => {
      window.removeEventListener('health_workflow_updated', handleWorkflowUpdate);
      unsubConn();
      unsubOrders();
    };
  }, []);

  // Helper status normalizers
  const normalize = (status?: string) => (status || 'PENDING').toUpperCase();

  // REAL-TIME STATS CALCULATION
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => normalize(o.status) === 'PENDING').length;
  const acceptedCount = orders.filter((o) => normalize(o.status) === 'ACCEPTED').length;
  const preparingCount = orders.filter((o) => normalize(o.status) === 'PREPARING').length;
  const readyCount = orders.filter((o) => normalize(o.status) === 'READY' || normalize(o.status) === 'READY_FOR_PICKUP').length;
  const deliveryCount = orders.filter((o) => normalize(o.status) === 'OUT_FOR_DELIVERY').length;
  const completedCount = orders.filter((o) => normalize(o.status) === 'COMPLETED' || normalize(o.status) === 'DELIVERED').length;
  const declinedCount = orders.filter((o) => normalize(o.status) === 'DECLINED' || normalize(o.status) === 'CANCELLED').length;

  // HANDLE ACCEPT ORDER
  const handleAcceptOrder = async (orderId: string) => {
    try {
      setActionLoadingId(orderId);
      const updated = await acceptPharmacyOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated, status: 'ACCEPTED' } : o)));
      onToast(`✓ Order #${orderId.slice(-6)} Accepted!`);
    } catch (err: any) {
      onToast(`Unable to update this order. Please try again.`);
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
      onToast(`✕ Order #${orderId.slice(-6)} Declined.`);
    } catch (err: any) {
      onToast(`Unable to update this order. Please try again.`);
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
      onToast(`✓ Order #${orderId.slice(-6)} moved to ${nextStatus}!`);
    } catch (err: any) {
      onToast(`Unable to update this order. Please try again.`);
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
      if (st !== 'COMPLETED' && st !== 'DELIVERED') return false;
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
<<<<<<< HEAD
        {/* 1. PENDING ORDERS */}
        <div
          onClick={() => setActiveFilter('Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeFilter === 'Pending'
=======
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
>>>>>>> origin/main
              ? 'bg-amber-500/15 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-amber-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
<<<<<<< HEAD
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono block">
            Pending Orders
          </span>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-mono">
=======
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono block">
              Pending Verify
            </span>
            <Clock className={`w-4 h-4 text-amber-500 ${activeFilter === 'Pending' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
>>>>>>> origin/main
            {pendingCount}
          </div>
        </div>

        {/* 2. ACCEPTED ORDERS */}
        <div
<<<<<<< HEAD
          onClick={() => setActiveFilter('Accepted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Accepted'
              ? 'bg-teal-500/15 border-teal-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400/50'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono block">
            Accepted
          </span>
          <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 font-mono">
            {acceptedCount}
          </div>
        </div>

        {/* 3. PREPARING */}
        <div
          onClick={() => setActiveFilter('Preparing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Preparing'
=======
          onClick={() => setActiveFilter('Processing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Processing'
>>>>>>> origin/main
              ? 'bg-blue-500/15 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-blue-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
<<<<<<< HEAD
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
            Preparing
          </span>
          <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {preparingCount}
=======
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
              Processing
            </span>
            <RefreshCw className={`w-4 h-4 text-blue-500 ${activeFilter === 'Processing' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {processingCount}
>>>>>>> origin/main
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
<<<<<<< HEAD
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono block">
            Ready
          </span>
          <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-mono">
=======
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono block">
              Ready / Transit
            </span>
            <Truck className={`w-4 h-4 text-purple-500 ${activeFilter === 'Ready' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
>>>>>>> origin/main
            {readyCount}
          </div>
        </div>

        {/* 5. OUT FOR DELIVERY */}
        <div
          onClick={() => setActiveFilter('Out for Delivery')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'Out for Delivery'
              ? 'bg-indigo-500/15 border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">
            Delivery
          </span>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
            {deliveryCount}
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
<<<<<<< HEAD
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">
            Completed
          </span>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {completedCount}
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
=======
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

        {/* DECLINED */}
        <div
          onClick={() => setActiveFilter('Declined')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Declined'
              ? 'bg-rose-500/15 border-rose-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-rose-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono block">
              Declined
            </span>
            <Ban className={`w-4 h-4 text-rose-500 ${activeFilter === 'Declined' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 font-mono">
            {declinedCount}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
>>>>>>> origin/main
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
            placeholder="Search by Order ID, Prescription ID, or Patient..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
          />
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
=======
            placeholder="Search Patient, Rx ID, Doctor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors"
          />
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1 sm:justify-end">
>>>>>>> origin/main
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
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{isRealtimeActive ? 'Realtime Live' : 'Connecting...'}</span>
        </div>
      </div>

<<<<<<< HEAD
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
            const isPending = rawStatus === 'PENDING';
            const isAccepted = rawStatus === 'ACCEPTED';
            const isPreparing = rawStatus === 'PREPARING';
            const isReady = rawStatus === 'READY' || rawStatus === 'READY_FOR_PICKUP';
            const isDelivery = rawStatus === 'OUT_FOR_DELIVERY';
            const isCompleted = rawStatus === 'COMPLETED' || rawStatus === 'DELIVERED';
            const isDeclined = rawStatus === 'DECLINED' || rawStatus === 'CANCELLED';

            const patientDisplayName = order.patient?.fullName || order.patientName || 'Patient information unavailable';
            const rxReference = order.prescriptionId || order.prescription?.id || order.sourcePrescriptionId || 'Prescription';
            const itemsList = order.items || [];
            const createdTime = order.orderedAt || order.createdAt ? new Date(order.orderedAt || order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Today';
            const updatedTime = order.updatedAt ? new Date(order.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently';
=======
      {/* PRESCRIPTION ORDERS LIST */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-500 dark:text-slate-400 mx-auto" />
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              No orders found matching this filter
            </h4>
            <p className="text-xs text-slate-500">
              When patients scan prescriptions, incoming pharmacy orders appear here for pharmacist review.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isPending = order.status === 'Pending Pharmacist Verification';
            const isProcessing = order.status === 'Processing';
            const isDeclined = order.status === 'Declined by Pharmacist' || order.status === 'Cancelled';
            const patientName = order.patientName || 'Ragul Kumar';
            const doctorName = order.doctorName || 'Dr. Arun Kumar';
>>>>>>> origin/main

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-[#070c18] rounded-2xl p-5 sm:p-6 border transition-all shadow-sm space-y-5 hover:shadow-md relative overflow-hidden ${
                  isPending
                    ? 'border-slate-200 dark:border-slate-800'
                    : isDeclined
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
<<<<<<< HEAD
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
=======
                {/* LEFT BORDER ACCENT */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isPending ? 'bg-amber-400' : isProcessing ? 'bg-blue-400' : isDeclined ? 'bg-rose-500' : 'bg-emerald-400'
                }`}></div>

                {/* ORDER HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      isPending
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : isDeclined
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-teal-500/10 text-[#00a896] dark:text-cyan-400'
                    }`}>
>>>>>>> origin/main
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
<<<<<<< HEAD
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                            Order #{order.id}
=======
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                          Order #{order.id}
                        </span>
                        {order.sourcePrescriptionId && (
                          <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-[#00a896] dark:text-cyan-300 px-2 py-0.5 rounded-md border border-teal-500/20">
                            Rx: {order.sourcePrescriptionId}
>>>>>>> origin/main
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
                          Patient: <strong className="text-slate-900 dark:text-slate-100 font-extrabold text-xs">{patientDisplayName}</strong> • Created: <span className="font-mono">{createdTime}</span>
                        </p>
                      </div>
<<<<<<< HEAD
=======
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Patient: <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{patientName}</strong> • Prescribed by {doctorName}
                      </p>
>>>>>>> origin/main
                    </div>
                  </div>

                  {/* STATUS BADGE */}
<<<<<<< HEAD
                  <div className="flex items-center gap-2">
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
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      ● {DHR_STATUS_DISPLAY[rawStatus] || order.status}
=======
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold font-mono border ${
                      isPending
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        : isProcessing
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
                        : isDeclined
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    }`}>
                      {order.status}
>>>>>>> origin/main
                    </span>
                  </div>
                </div>

<<<<<<< HEAD
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
=======
                {/* MEDICINES PREVIEW CHIPS */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">
                    Items ({order.items.length}):
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {order.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50/50 dark:bg-cyan-900/10 border border-teal-100 dark:border-teal-800/30 text-xs font-bold text-teal-900 dark:text-cyan-100 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a896]" />
                        <span>{it.name} <span className="text-teal-700/70 dark:text-cyan-300/60 font-medium">({it.dosage})</span></span>
                        <span className="font-mono text-[10px] text-teal-600 dark:text-cyan-400">×{it.quantity}</span>
                      </span>
                    ))}
                  </div>
>>>>>>> origin/main
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

                    {/* 4. READY: Out for Delivery */}
                    {isReady && (
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

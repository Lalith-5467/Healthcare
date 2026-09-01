import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  ShoppingBag,
  Building2,
  User,
  ArrowRight,
  RefreshCw,
  Check,
  Ban,
  Eye,
  Truck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  getPharmacyOrders,
  updatePharmacyOrderStatus
} from '../../utils/healthWorkflowStorage';
import type { ExtendedPharmacyOrder } from '../../utils/healthWorkflowStorage';
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
  user,
  initialFilter = 'All',
  onToast
}) => {
  const [orders, setOrders] = useState<ExtendedPharmacyOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  // MODAL STATES
  const [selectedRxOrder, setSelectedRxOrder] = useState<ExtendedPharmacyOrder | null>(null);
  const [declineTargetOrder, setDeclineTargetOrder] = useState<ExtendedPharmacyOrder | null>(null);

  const pharmacistName = user?.name ? `${user.name} (Reg. Pharmacist)` : 'Registered Pharmacist';

  const loadOrders = () => {
    const list = getPharmacyOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('health_workflow_updated', handleUpdate);
    return () => window.removeEventListener('health_workflow_updated', handleUpdate);
  }, []);

  // REAL-TIME STATS CALCULATION
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'Pending Pharmacist Verification').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const readyCount = orders.filter((o) => o.status === 'Ready for Pickup' || o.status === 'Out for Delivery').length;
  const completedCount = orders.filter((o) => o.status === 'Delivered').length;
  const declinedCount = orders.filter((o) => o.status === 'Declined by Pharmacist' || o.status === 'Cancelled').length;

  // HANDLE ACCEPT ORDER
  const handleAcceptOrder = (orderId: string) => {
    const res = updatePharmacyOrderStatus(
      orderId,
      'Processing',
      'Prescription reviewed and verified. Medicines dispensed and undergoing packaging.',
      undefined,
      pharmacistName
    );

    if (res.success) {
      loadOrders();
      onToast(`✓ Order #${orderId} Accepted and set to Processing!`);
    } else {
      onToast(`Error updating order status.`);
    }
  };

  // HANDLE DECLINE ORDER
  const handleConfirmDecline = (orderId: string, reason: string, notes: string) => {
    const res = updatePharmacyOrderStatus(
      orderId,
      'Declined by Pharmacist',
      notes,
      reason,
      pharmacistName
    );

    if (res.success) {
      loadOrders();
      onToast(`✕ Order #${orderId} Declined (${reason})`);
    } else {
      onToast(`Error declining order.`);
    }
  };

  // ADVANCE ORDER LIFECYCLE (e.g. Processing -> Ready -> Delivered)
  const handleAdvanceStatus = (orderId: string, nextStatus: string) => {
    const res = updatePharmacyOrderStatus(orderId, nextStatus, `Updated to ${nextStatus}`, undefined);
    if (res.success) {
      loadOrders();
      onToast(`✓ Order #${orderId} marked as ${nextStatus}!`);
    }
  };

  // FILTERED ORDERS LIST
  const filteredOrders = orders.filter((order) => {
    // Status Filter
    if (activeFilter === 'Pending' || activeFilter === 'New Orders' || activeFilter === 'Pending Verification') {
      if (order.status !== 'Pending Pharmacist Verification') return false;
    } else if (activeFilter === 'Processing') {
      if (order.status !== 'Processing') return false;
    } else if (activeFilter === 'Ready') {
      if (order.status !== 'Ready for Pickup' && order.status !== 'Out for Delivery') return false;
    } else if (activeFilter === 'Completed') {
      if (order.status !== 'Delivered') return false;
    } else if (activeFilter === 'Declined') {
      if (order.status !== 'Declined by Pharmacist' && order.status !== 'Cancelled') return false;
    }

    // Search Query (Patient, Rx ID, Doctor, Medicine)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPatient = (order.patientName || 'Ragul Kumar').toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q);
      const matchRx = (order.sourcePrescriptionId || '').toLowerCase().includes(q);
      const matchDoctor = (order.doctorName || '').toLowerCase().includes(q);
      const matchMedicine = order.items.some((i) => i.name.toLowerCase().includes(q));
      return matchPatient || matchId || matchRx || matchDoctor || matchMedicine;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* TOP KPI STATS METRIC CARDS (CALCULATED FROM ACTUAL DATA) */}
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

        {/* PROCESSING */}
        <div
          onClick={() => setActiveFilter('Processing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeFilter === 'Processing'
              ? 'bg-blue-500/15 border-blue-500 shadow-sm'
              : 'bg-white dark:bg-[#070c18] border-slate-200 dark:border-slate-800 hover:border-blue-400/50 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
              Processing
            </span>
            <RefreshCw className={`w-4 h-4 text-blue-500 ${activeFilter === 'Processing' ? 'opacity-100' : 'opacity-70'}`} />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {processingCount}
          </div>
        </div>

        {/* READY */}
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

        {/* COMPLETED */}
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
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Patient, Rx ID, Doctor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] transition-colors"
          />
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1 sm:justify-end">
          {[
            { id: 'All', label: 'All' },
            { id: 'Pending', label: `Pending (${pendingCount})` },
            { id: 'Processing', label: `Processing (${processingCount})` },
            { id: 'Ready', label: `Ready (${readyCount})` },
            { id: 'Completed', label: `Delivered (${completedCount})` },
            { id: 'Declined', label: `Declined (${declinedCount})` }
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
      </div>

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

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-[#070c18] rounded-2xl p-5 sm:p-6 border transition-all shadow-sm space-y-5 hover:shadow-md relative overflow-hidden ${
                  isPending
                    ? 'border-slate-200 dark:border-slate-800'
                    : isDeclined
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
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
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                          Order #{order.id}
                        </span>
                        {order.sourcePrescriptionId && (
                          <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-[#00a896] dark:text-cyan-300 px-2 py-0.5 rounded-md border border-teal-500/20">
                            Rx: {order.sourcePrescriptionId}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Patient: <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{patientName}</strong> • Prescribed by {doctorName}
                      </p>
                    </div>
                  </div>

                  {/* STATUS BADGE */}
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
                    </span>
                  </div>
                </div>

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
                </div>

                {/* IF DECLINED: SHOW REASON */}
                {isDeclined && order.declineReason && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5" />
                      <span>Decline Reason: {order.declineReason}</span>
                    </div>
                    {order.pharmacistNotes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Pharmacist Notes: {order.pharmacistNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* CARD FOOTER & ACTIONS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Total Amount: <strong className="text-slate-900 dark:text-white font-extrabold">₹{order.totalAmount}</strong> • {order.deliveryMethod}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRxOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00a896]" />
                      <span>View Prescription</span>
                    </button>

                    {/* ACTIONS FOR PENDING VERIFICATION */}
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => setDeclineTargetOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-extrabold transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1.5"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Decline Order</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAcceptOrder(order.id)}
                          className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Order</span>
                        </button>
                      </>
                    )}

                    {/* ACTIONS FOR PROCESSING */}
                    {isProcessing && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(order.id, 'Ready for Pickup')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {/* ACTIONS FOR READY */}
                    {(order.status === 'Ready for Pickup' || order.status === 'Out for Delivery') && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(order.id, 'Delivered')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Complete & Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* VIEW PRESCRIPTION MODAL */}
      <PharmacistPrescriptionModal
        isOpen={!!selectedRxOrder}
        order={selectedRxOrder}
        onClose={() => setSelectedRxOrder(null)}
        onAccept={handleAcceptOrder}
        onOpenDecline={(ord) => setDeclineTargetOrder(ord)}
      />

      {/* DECLINE ORDER MODAL */}
      <DeclineOrderModal
        isOpen={!!declineTargetOrder}
        order={declineTargetOrder}
        onClose={() => setDeclineTargetOrder(null)}
        onConfirmDecline={handleConfirmDecline}
      />
    </div>
  );
};

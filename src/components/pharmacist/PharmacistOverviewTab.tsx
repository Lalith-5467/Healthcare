import React, { useState, useEffect } from 'react';
import {
  Pill,
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  Ban,
  Eye,
  Sparkles
} from 'lucide-react';
import {
  getPharmacyOrders,
  updatePharmacyOrderStatus
} from '../../utils/healthWorkflowStorage';
import type { ExtendedPharmacyOrder } from '../../utils/healthWorkflowStorage';
import { INITIAL_MEDICINE_STOCK } from '../pharmacy/pharmacyData';
import { PharmacistPrescriptionModal } from './PharmacistPrescriptionModal';
import { DeclineOrderModal } from './DeclineOrderModal';

interface PharmacistOverviewTabProps {
  user?: {
    name: string;
    email: string;
    role: string;
    abhaId?: string;
    hospitalAffiliation?: string;
  };
  onNavigateOrders: (filterTab?: string) => void;
  onNavigateMedicines?: () => void;
  onToast: (msg: string) => void;
}

export const PharmacistOverviewTab: React.FC<PharmacistOverviewTabProps> = ({
  user,
  onNavigateOrders,
  onNavigateMedicines,
  onToast
}) => {
  const [orders, setOrders] = useState<ExtendedPharmacyOrder[]>([]);
  const [selectedRxOrder, setSelectedRxOrder] = useState<ExtendedPharmacyOrder | null>(null);
  const [declineTargetOrder, setDeclineTargetOrder] = useState<ExtendedPharmacyOrder | null>(null);

  const loadData = () => {
    setOrders(getPharmacyOrders());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('health_workflow_updated', handleUpdate);
    return () => window.removeEventListener('health_workflow_updated', handleUpdate);
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'Pending Pharmacist Verification');
  const processingOrders = orders.filter((o) => o.status === 'Processing');
  const completedOrders = orders.filter((o) => o.status === 'Delivered');

  const pharmacistName = user?.name || 'Registered Pharmacist';
  const pharmacyStore = user?.hospitalAffiliation || 'Apollo Central Pharmacy';

  const handleAcceptOrder = (orderId: string) => {
    const res = updatePharmacyOrderStatus(
      orderId,
      'Processing',
      'Prescription reviewed and verified. Medicines dispensed and undergoing packaging.',
      undefined,
      `${pharmacistName} (Reg. Pharmacist)`
    );

    if (res.success) {
      loadData();
      onToast(`✓ Order #${orderId} Accepted!`);
    }
  };

  const handleConfirmDecline = (orderId: string, reason: string, notes: string) => {
    const res = updatePharmacyOrderStatus(
      orderId,
      'Declined by Pharmacist',
      notes,
      reason,
      `${pharmacistName} (Reg. Pharmacist)`
    );

    if (res.success) {
      loadData();
      onToast(`✕ Order #${orderId} Declined`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* PHARMACIST HERO BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-[#00a896] via-teal-700 to-cyan-800 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-mono uppercase font-black border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{pharmacyStore} • Dispensary Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {pharmacistName}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
            Registered Pharmacist ID: <span className="font-mono font-bold">DL-TN-2024-PH-8941</span>. You have{' '}
            <strong className="text-amber-300 font-black">{pendingOrders.length} pending prescriptions</strong> awaiting clinical review and dispensing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateOrders('Pending')}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-teal-900 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>Review Pending Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 SUMMARY STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PENDING VERIFICATION */}
        <div
          onClick={() => onNavigateOrders('Pending')}
          className="bg-white dark:bg-slate-900 border border-amber-400/60 rounded-3xl p-5 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Pending Verify
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {pendingOrders.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Requires Pharmacist Sign-off
          </span>
        </div>

        {/* PROCESSING */}
        <div
          onClick={() => onNavigateOrders('Processing')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              In Dispensing
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">
            {processingOrders.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Packaging & Labelling
          </span>
        </div>

        {/* COMPLETED */}
        <div
          onClick={() => onNavigateOrders('Completed')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Dispensed Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Successfully Delivered
          </span>
        </div>

        {/* STOCK HEALTH */}
        <div
          onClick={() => {
            if (onNavigateMedicines) onNavigateMedicines();
            else onNavigateOrders('All');
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all hover:border-[#00a896]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Medicines & Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {INITIAL_MEDICINE_STOCK.length} Formulations
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Click to View Dispensary Inventory
          </span>
        </div>
      </div>

      {/* URGENT PENDING ORDERS QUEUE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Urgent Pending Prescriptions ({pendingOrders.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Incoming scanned prescriptions requiring clinical verification before dispensing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateOrders('Pending')}
            className="text-xs font-extrabold text-[#00a896] dark:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Pending Prescriptions
            </p>
            <p className="text-xs">
              All scanned prescription orders have been verified and processed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Patient: <strong className="text-slate-900 dark:text-white">{order.patientName || 'Ragul Kumar'}</strong> • Prescribed by {order.doctorName || 'Dr. Arun Kumar'}
                  </p>
                  <p className="text-[11px] text-[#00a896] dark:text-cyan-300 font-mono">
                    Rx: {order.items.map((i) => `${i.name} (${i.dosage})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRxOrder(order)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00a896]" />
                    <span>View Rx</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeclineTargetOrder(order)}
                    className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-extrabold transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAcceptOrder(order.id)}
                    className="px-4 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DISPENSARY MEDICINES & STOCK PREVIEW WIDGET */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Dispensary Medicines & Stock Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live pharmaceutical formulation inventory and supply availability.
              </p>
            </div>
          </div>

          {onNavigateMedicines && (
            <button
              type="button"
              onClick={onNavigateMedicines}
              className="text-xs font-extrabold text-[#00a896] dark:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage All Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* COMPACT STOCK GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_MEDICINE_STOCK.slice(0, 6).map((med) => (
            <div
              key={med.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 hover:border-[#00a896] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {med.medicineName}
                  </h4>
                  <span className="text-[11px] font-mono text-teal-600 dark:text-cyan-400 font-bold">
                    {med.dosage}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                    med.stockLevel === 'Low Stock' || med.stockLevel === 'Out of Stock'
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                      : med.stockLevel === 'Medium Stock'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {med.stockLevel}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <span className="text-slate-500 text-[11px]">Available:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">
                  {med.currentQuantity} / {med.totalQuantity} {med.unit}
                </strong>
              </div>
            </div>
          ))}
        </div>
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

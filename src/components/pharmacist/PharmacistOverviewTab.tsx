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
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedRxOrder, setSelectedRxOrder] = useState<any | null>(null);
  const [declineTargetOrder, setDeclineTargetOrder] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const { fetchPharmacistOrders } = await import('../../services/pharmacyOrderApi');
      const backendOrders = await fetchPharmacistOrders();
      if (backendOrders && backendOrders.length > 0) {
        setOrders(backendOrders.map((bo: any) => ({
          ...bo,
          patientName: bo.patient?.fullName || bo.patientName || 'Patient information unavailable',
          sourcePrescriptionId: bo.prescriptionId,
          status: bo.status === 'PENDING' ? 'Pending Pharmacist Verification' : bo.status === 'ACCEPTED' || bo.status === 'PREPARING' ? 'Processing' : bo.status === 'COMPLETED' ? 'Delivered' : bo.status === 'DECLINED' ? 'Declined by Pharmacist' : bo.status,
          date: bo.orderedAt ? new Date(bo.orderedAt).toLocaleDateString() : 'Today',
          deliveryMethod: bo.deliveryType || 'Home Delivery',
          items: (bo.items || []).map((it: any) => ({
            name: it.medicineName || it.name,
            dosage: it.dosage,
            quantity: it.quantity,
            unitPrice: it.unitPrice || 0,
            subtotal: it.subtotal || 0,
          })),
        })));
        return;
      }
    } catch {
      // Fall back to local workflow storage if backend unavailable
    }
    setOrders(getPharmacyOrders());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('health_workflow_updated', handleUpdate);

    let unsub: any;
    import('../../services/socketService').then(({ socketService }) => {
      socketService.connect();
      unsub = socketService.subscribeToOrderUpdates(() => {
        loadData();
      });
    });

    return () => {
      window.removeEventListener('health_workflow_updated', handleUpdate);
      if (unsub) unsub();
    };
  }, []);

  const pendingOrders = orders.filter((o) => (o.status as string) === 'Pending Pharmacist Verification' || (o.status as string) === 'PENDING');
  const processingOrders = orders.filter((o) => (o.status as string) === 'Processing' || (o.status as string) === 'ACCEPTED' || (o.status as string) === 'PREPARING' || (o.status as string) === 'READY' || (o.status as string) === 'OUT_FOR_DELIVERY');
  const completedOrders = orders.filter((o) => (o.status as string) === 'Delivered' || (o.status as string) === 'COMPLETED');

  const pharmacistName = React.useMemo(() => {
    if (user?.name && user.name !== 'Suresh Nair' && user.name !== 'Registered Pharmacist') {
      return user.name;
    }
    try {
      const stored = localStorage.getItem('pharmacist_user_name');
      if (stored) return stored;
      const appUser = localStorage.getItem('app_user');
      if (appUser) {
        const parsed = JSON.parse(appUser);
        if (parsed?.name) return parsed.name;
      }
    } catch {}
    return user?.name || 'Registered Pharmacist';
  }, [user?.name]);
  const pharmacyStore = user?.hospitalAffiliation || 'Apollo Central Pharmacy';

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { acceptPharmacyOrder } = await import('../../services/pharmacyOrderApi');
      await acceptPharmacyOrder(orderId);
      loadData();
      onToast(`✓ Order #${orderId.slice(-6)} Accepted!`);
    } catch {
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
    }
  };

  const handleConfirmDecline = async (orderId: string, reason: string, notes: string) => {
    try {
      const { declinePharmacyOrder } = await import('../../services/pharmacyOrderApi');
      await declinePharmacyOrder(orderId, notes ? `${reason} - ${notes}` : reason);
      loadData();
      onToast(`✕ Order #${orderId.slice(-6)} Declined`);
    } catch {
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Urgent Pending Prescriptions
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono border border-amber-500/20">
                  {pendingOrders.length} Awaiting Sign-Off
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Incoming scanned prescriptions requiring clinical pharmacist verification before dispensing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateOrders('Pending')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-black text-[#00a896] dark:text-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto border border-slate-200 dark:border-slate-700"
          >
            <span>View All Queue ({pendingOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="py-12 text-center space-y-2.5 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              All Prescriptions Cleared
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All scanned patient prescription orders have been clinically verified and processed.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {pendingOrders.slice(0, 3).map((order) => {
              const patientName = (order as any).patient?.fullName || order.patientName || 'Patient';
              const doctorName = (order as any).prescription?.doctor?.fullName || order.doctorName || 'Attending Physician';
              const patientInitials = patientName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 hover:shadow-lg transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-amber-500 relative group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* TOP META ROW */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-[11px] flex items-center justify-center font-mono shrink-0">
                        {patientInitials}
                      </div>

                      <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                        #{order.id}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono border border-amber-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Verification Required
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Just now
                      </span>
                    </div>

                    {/* PATIENT & DOCTOR INFO */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-100">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Patient: <strong className="font-bold">{patientName}</strong></span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Prescribed by <span className="font-semibold text-slate-700 dark:text-slate-300">{doctorName}</span>
                      </span>
                    </div>

                    {/* PRESCRIBED MEDICINES CHIPS */}
                    <div className="pt-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                          Rx:
                        </span>
                        {(order.items || []).slice(0, 3).map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-800 dark:text-teal-200 border border-teal-500/20 text-[11px] font-bold"
                          >
                            {item.name || item.medicineName} {item.dosage ? `(${item.dosage})` : ''}
                          </span>
                        ))}
                        {(order.items || []).length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                            +{(order.items || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedRxOrder(order)}
                      className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                      <span>View Rx</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeclineTargetOrder(order)}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer border border-rose-500/20 flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAcceptOrder(order.id)}
                      className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-teal-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-teal-400/30"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Accept Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
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

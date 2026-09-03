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
      <div className="rounded-2xl bg-gradient-to-r from-[#00a896]/90 to-blue-800/90 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#00a896]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {pharmacistName} 👋
          </h2>
          <div className="text-xs sm:text-sm text-teal-50 space-y-1">
            <p>Registered Pharmacist | ID: <span className="font-mono font-bold">DL-TN-2024-PH-8941</span></p>
            <p>You have <strong className="text-white font-black px-1.5 py-0.5 rounded-md bg-white/20 mx-1">{pendingOrders.length} pending prescription{pendingOrders.length !== 1 ? 's' : ''}</strong></p>
            <p className="text-teal-200">Awaiting clinical review and dispensing.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateOrders('Pending')}
          className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#00a896] font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:shadow-md hover:-translate-y-0.5"
        >
          <span>Review Pending Queue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 SUMMARY STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-auto">
        {/* PENDING VERIFICATION */}
        <div
          onClick={() => onNavigateOrders('Pending')}
          className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:shadow-md hover:border-amber-500/50 hover:-translate-y-0.5 transition-all flex flex-col h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Pending Verify
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono flex-1">
            {pendingOrders.length}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[11px] text-slate-500 font-medium">
              Requires Pharmacist Sign-off
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* PROCESSING */}
        <div
          onClick={() => onNavigateOrders('Processing')}
          className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:shadow-md hover:border-blue-500/50 hover:-translate-y-0.5 transition-all flex flex-col h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              In Dispensing
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono flex-1">
            {processingOrders.length}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[11px] text-slate-500 font-medium">
              Packaging & Labelling
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* COMPLETED */}
        <div
          onClick={() => onNavigateOrders('Completed')}
          className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all flex flex-col h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Dispensed Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono flex-1">
            {completedOrders.length}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[11px] text-slate-500 font-medium">
              Successfully Delivered
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* STOCK HEALTH */}
        <div
          onClick={() => {
            if (onNavigateMedicines) onNavigateMedicines();
            else onNavigateOrders('All');
          }}
          className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:shadow-md hover:border-purple-500/50 hover:-translate-y-0.5 transition-all flex flex-col h-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
              Medicines & Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono flex-1 flex gap-1 items-baseline">
            {INITIAL_MEDICINE_STOCK.length} <span className="text-xs font-medium text-slate-500 tracking-normal font-sans">Formulations</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[11px] text-slate-500 font-medium">
              Click to View Inventory
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* URGENT PENDING ORDERS QUEUE */}
<<<<<<< HEAD
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
=======
      <div className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              Urgent Pending Prescriptions ({pendingOrders.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Incoming urgent prescriptions requiring clinical verification before dispensing.
            </p>
>>>>>>> origin/main
          </div>

          <button
            type="button"
            onClick={() => onNavigateOrders('Pending')}
<<<<<<< HEAD
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-black text-[#00a896] dark:text-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto border border-slate-200 dark:border-slate-700"
=======
            className="text-xs font-extrabold text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
>>>>>>> origin/main
          >
            <span>View All Queue ({pendingOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingOrders.length === 0 ? (
<<<<<<< HEAD
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
=======
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No pending prescriptions
            </p>
            <p className="text-xs text-slate-500 mt-1">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      #{order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono border border-amber-500/20">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    Patient: <strong className="text-slate-900 dark:text-white">{order.patientName || 'Ragul Kumar'}</strong> • Prescribed by {order.doctorName || 'Dr. Arun Kumar'}
                  </p>
                  <p className="text-[11px] text-[#00a896] dark:text-cyan-400 font-mono truncate bg-teal-50 dark:bg-cyan-900/10 px-2 py-1 rounded w-fit" title={`Rx: ${order.items.map((i) => `${i.name} (${i.dosage})`).join(', ')}`}>
                    Rx: {order.items.map((i) => `${i.name} (${i.dosage})`).join(', ')}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedRxOrder(order)}
                    className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Rx</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeclineTargetOrder(order)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-transparent hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer border border-rose-200 dark:border-rose-500/30 flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAcceptOrder(order.id)}
                    className="px-4 py-2 rounded-lg bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Order</span>
                  </button>
                </div>
              </div>
            ))}
>>>>>>> origin/main
          </div>
        )}
      </div>

      {/* DISPENSARY MEDICINES & STOCK PREVIEW WIDGET */}
      <div className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Dispensary Medicines & Stock Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live pharmaceutical formulation inventory and supply availability.
            </p>
          </div>

          {onNavigateMedicines && (
            <button
              type="button"
              onClick={onNavigateMedicines}
              className="text-xs font-extrabold text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage All Stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* COMPACT STOCK GRID */}
        {INITIAL_MEDICINE_STOCK.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
            <div className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-400">
              <Pill className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No medicines available
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Inventory data will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_MEDICINE_STOCK.slice(0, 6).map((med) => {
              const isLow = med.stockLevel === 'Low Stock' || med.stockLevel === 'Out of Stock';
              const isMedium = med.stockLevel === 'Medium Stock';
              
              return (
                <div
                  key={med.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700/60 space-y-3 hover:border-slate-300 dark:hover:border-slate-500 transition-colors shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {med.medicineName}
                      </h4>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
                        {med.dosage}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        isLow
                          ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                          : isMedium
                          ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                      }`}
                    >
                      {med.stockLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${isLow ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      <span className="text-slate-500 text-[11px] font-medium">Available</span>
                    </div>
                    <strong className="font-mono text-slate-900 dark:text-white">
                      {med.currentQuantity} / {med.totalQuantity} <span className="text-slate-500 font-normal">{med.unit}</span>
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
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

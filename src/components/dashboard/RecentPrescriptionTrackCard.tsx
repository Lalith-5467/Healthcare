import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag, ArrowRight, CheckCircle2, Clock, Check, Eye } from 'lucide-react';
import { getPrescriptions, getPharmacyOrders } from '../../utils/healthWorkflowStorage';
import type { StructuredPrescription } from '../../utils/prescriptionExtractor';
import type { ExtendedPharmacyOrder } from '../../utils/healthWorkflowStorage';

interface RecentPrescriptionTrackCardProps {
  onNavigate: (page: string) => void;
  onToast?: (msg: string) => void;
}

export const RecentPrescriptionTrackCard: React.FC<RecentPrescriptionTrackCardProps> = ({
  onNavigate,
  onToast: _onToast
}) => {
  const [latestPrescription, setLatestPrescription] = useState<StructuredPrescription | null>(null);
  const [linkedOrder, setLinkedOrder] = useState<ExtendedPharmacyOrder | null>(null);

  const loadData = () => {
    const prescriptions = getPrescriptions();
    const orders = getPharmacyOrders();

    if (prescriptions.length > 0) {
      const latest = prescriptions[prescriptions.length - 1];
      setLatestPrescription(latest);

      // Find matching pharmacy order
      const match = orders.find(
        (o) => o.sourcePrescriptionId === latest.id || o.id.includes(latest.id.replace('RX-DOC-', ''))
      );
      setLinkedOrder(match || null);
    } else {
      setLatestPrescription(null);
      setLinkedOrder(null);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('health_workflow_updated', handleUpdate);
    return () => window.removeEventListener('health_workflow_updated', handleUpdate);
  }, []);

  if (!latestPrescription) {
    return null; // Do not show if no verified prescription exists yet
  }

  // Format Pharmacy Status Display
  const getPharmacyStatusBadge = () => {
    const rawStatus = (linkedOrder?.status || 'PENDING').toString().toUpperCase();

    if (rawStatus === 'ACCEPTED' || rawStatus === 'PREPARING' || rawStatus === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Pharmacy Status: {rawStatus === 'ACCEPTED' ? 'Order Accepted' : 'Preparing Your Medicines'}</span>
        </span>
      );
    }

    if (rawStatus === 'READY' || rawStatus === 'READY_FOR_PICKUP' || rawStatus === 'OUT_FOR_DELIVERY') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          <Check className="w-3.5 h-3.5" />
          <span>Pharmacy Status: {rawStatus === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup'}</span>
        </span>
      );
    }

    if (rawStatus === 'COMPLETED' || rawStatus === 'DELIVERED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          <Check className="w-3.5 h-3.5" />
          <span>Pharmacy Status: Completed</span>
        </span>
      );
    }

    if (rawStatus === 'DECLINED' || rawStatus === 'CANCELLED' || rawStatus.includes('DECLINE')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
          <span>Pharmacy Status: Order Declined</span>
        </span>
      );
    }

    // Default: Waiting for Pharmacy / Submitted
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" />
        <span>Pharmacy Status: Waiting for Pharmacy</span>
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-white to-teal-50/40 dark:from-slate-900 dark:to-slate-900/90 border border-teal-500/30 dark:border-teal-500/20 shadow-xl space-y-4 font-sans relative overflow-hidden"
    >
      {/* BACKGROUND ACCENT GLOW */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#00a896] text-white shadow-md shadow-teal-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recent Verified Prescription
              </h3>
              <span className="text-xs font-mono font-bold text-[#00a896] dark:text-cyan-400">
                #{latestPrescription.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {latestPrescription.doctorName} • {latestPrescription.clinicName} • {latestPrescription.prescriptionDate}
            </p>
          </div>
        </div>

        {/* STATUS PILLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Prescription Status: Verified</span>
          </span>
          {getPharmacyStatusBadge()}
        </div>
      </div>

      {/* CONTENT SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-1.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>Prescription Details:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {latestPrescription.medicines.length} prescribed formulation{latestPrescription.medicines.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono line-clamp-1">
            Rx: {latestPrescription.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ')}
          </div>
          {linkedOrder && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Connected Pharmacy Order: <strong className="text-[#00a896] dark:text-cyan-300">#{linkedOrder.id}</strong> • Fulfillment Method: <strong>{linkedOrder.deliveryMethod}</strong>
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={() => onNavigate('records')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Prescription</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('pharmacy')}
            className="px-4 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Track Pharmacy →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

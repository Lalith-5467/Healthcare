import React from 'react';
import {
  X,
  FileText,
  User,
  Building2,
  Calendar,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Check,
  Ban
} from 'lucide-react';
import type { ExtendedPharmacyOrder } from '../../utils/healthWorkflowStorage';
import { getPrescriptions } from '../../utils/healthWorkflowStorage';

interface PharmacistPrescriptionModalProps {
  isOpen: boolean;
  order: ExtendedPharmacyOrder | null;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onOpenDecline: (order: ExtendedPharmacyOrder) => void;
}

export const PharmacistPrescriptionModal: React.FC<PharmacistPrescriptionModalProps> = ({
  isOpen,
  order,
  onClose,
  onAccept,
  onOpenDecline
}) => {
  if (!isOpen || !order) return null;

  // Retrieve matching prescription if available for rich notes and clinical metadata
  const prescriptions = getPrescriptions();
  const matchedPrescription = prescriptions.find(
    (p) => p.id === order.sourcePrescriptionId || p.id === order.id.replace('RX-ORD-', 'RX-DOC-')
  );

  const patientName =
    (order as any).patient?.fullName ||
    order.patientName ||
    'Patient information unavailable';
  const doctorName = order.doctorName || matchedPrescription?.doctorName || 'Attending Physician';
  const clinicName = order.clinicName || matchedPrescription?.clinicName || 'Medical Centre';
  const rxDate = order.date || (matchedPrescription ? matchedPrescription.prescriptionDate : 'Today');

  const isPending = order.status === 'Pending Pharmacist Verification';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl relative text-slate-900 dark:text-white overflow-hidden">
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Prescription Verification
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                  order.status === 'Pending Pharmacist Verification'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : order.status === 'Processing'
                    ? 'bg-blue-500/15 text-blue-700 dark:text-cyan-300 border-blue-500/30'
                    : order.status === 'Declined by Pharmacist'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Order #{order.id} {order.sourcePrescriptionId && `• Rx ID: ${order.sourcePrescriptionId}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* CLINICAL SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* PATIENT CARD */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00a896]" />
                <span>Patient Information</span>
              </span>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{patientName}</div>
              {((order as any).patient?.gender || (order as any).patient?.bloodGroup) && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {[(order as any).patient?.gender, (order as any).patient?.bloodGroup ? `Blood Group: ${(order as any).patient.bloodGroup}` : null].filter(Boolean).join(' • ')}
                </div>
              )}
            </div>

            {/* DOCTOR CARD */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Prescribing Physician</span>
              </span>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{doctorName}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {clinicName} • Date: <span className="font-mono font-semibold">{rxDate}</span>
              </div>
            </div>
          </div>

          {/* ITEMISED PRESCRIBED MEDICINES TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#00a896]" />
                <span>Prescribed Medications ({order.items.length})</span>
              </h4>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                Total Units: {order.items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 font-mono text-[11px]">#</th>
                    <th className="p-3">Medicine & Strength</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Frequency / Instructions</th>
                    <th className="p-3 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {order.items.map((item, idx) => {
                    const matchedMed = matchedPrescription?.medicines.find(
                      (m) => m.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(m.name.toLowerCase())
                    );

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-500 dark:text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[11px] font-mono text-teal-600 dark:text-cyan-400 font-bold">
                            {item.dosage}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-extrabold text-slate-900 dark:text-white">
                          {item.quantity} units
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px]">
                          <div>{matchedMed?.frequency || 'Twice daily'} ({matchedMed?.duration || '5 days'})</div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {matchedMed?.foodInstruction || 'After Food'} • {matchedMed?.instructions || 'Take as directed'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                          ₹{item.unitPrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DOCTOR NOTES & FOLLOW-UP ADVISORY */}
          {matchedPrescription && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1.5 text-xs">
              <div className="font-extrabold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00a896]" />
                <span>Physician Consultation Notes</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">
                "{matchedPrescription.notes || 'Advised standard course with clinical hydration.'}"
              </p>
              {matchedPrescription.followUp.hasFollowUp && (
                <div className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 pt-1">
                  📅 Doctor Follow-up Scheduled: {matchedPrescription.followUp.date} (Independent Consultation Directive)
                </div>
              )}
            </div>
          )}

          {/* IF DECLINED, DISPLAY STORED DECLINE REASON & NOTES */}
          {order.status === 'Declined by Pharmacist' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 text-xs">
              <div className="font-extrabold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-500" />
                <span>Order Declined by Pharmacist</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200">
                <strong>Reason:</strong> {order.declineReason || 'Medicine unavailable'}
              </p>
              {order.pharmacistNotes && (
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Notes:</strong> {order.pharmacistNotes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Close
          </button>

          {isPending && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDecline(order);
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Decline Order</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAccept(order.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Accept & Verify Order</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

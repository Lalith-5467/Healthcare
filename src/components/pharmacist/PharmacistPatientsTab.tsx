import React from 'react';
import { User, Phone, MapPin, FileText, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { getPharmacyOrders } from '../../utils/healthWorkflowStorage';

export const PharmacistPatientsTab: React.FC = () => {
  const orders = getPharmacyOrders();

  // Aggregate unique patients from actual orders
  const patientMap = new Map<string, {
    name: string;
    orderCount: number;
    lastOrderDate: string;
    lastRxId?: string;
    recentStatus: string;
  }>();

  // Always include demo patient Ragul Kumar
  patientMap.set('Ragul Kumar', {
    name: 'Ragul Kumar',
    orderCount: 0,
    lastOrderDate: 'Today',
    lastRxId: 'RX-DOC-931087',
    recentStatus: 'Active'
  });

  orders.forEach((o) => {
    const pName = o.patientName || 'Ragul Kumar';
    const curr = patientMap.get(pName) || {
      name: pName,
      orderCount: 0,
      lastOrderDate: o.date,
      lastRxId: o.sourcePrescriptionId || o.id,
      recentStatus: o.status
    };

    curr.orderCount += 1;
    curr.lastOrderDate = o.date;
    curr.recentStatus = o.status;
    patientMap.set(pName, curr);
  });

  const patients = Array.from(patientMap.values());

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pharmacy Patient Registry & Prescription Archives
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Patients connected with Apollo Central Dispensary through ABDM health pass.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((pat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-teal-500/15 text-[#00a896] font-black text-sm flex items-center justify-center font-mono">
                  {pat.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {pat.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    ABHA: 91-8472-9104-5821@abdm
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono border border-emerald-500/30">
                Verified
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Pharmacy Orders:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{pat.orderCount} Orders</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Last Prescription ID:</span>
                <strong className="text-[#00a896] font-mono">{pat.lastRxId || 'RX-DOC-931087'}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Recent Status:</span>
                <strong className="text-slate-800 dark:text-slate-200">{pat.recentStatus}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

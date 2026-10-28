import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, FileText, Clock, Loader2 } from 'lucide-react';
import { fetchPharmacistOrders } from '../../services/pharmacyOrderApi';

interface PharmacistPatientsTabProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    hospitalAffiliation?: string;
    pharmacyId?: string;
  };
}

export const PharmacistPatientsTab: React.FC<PharmacistPatientsTabProps> = ({ user }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pharmacyName = user?.hospitalAffiliation || localStorage.getItem('pharmacist_pharmacy_name') || 'Dispensary Hub';

  const loadPatients = async () => {
    try {
      setLoading(true);
      const orders = await fetchPharmacistOrders();

      const patientMap = new Map<string, {
        id: string;
        name: string;
        orderCount: number;
        lastOrderDate: string;
        lastRxId?: string;
        recentStatus: string;
      }>();

      if (Array.isArray(orders)) {
        orders.forEach((o: any, idx: number) => {
          const pName = o.patient?.fullName || o.patientName;
          if (!pName) return;

          const curr = patientMap.get(pName) || {
            id: o.patient?.id ? `PAT-${o.patient.id.slice(-5).toUpperCase()}` : `PC-${String(idx + 1).padStart(4, '0')}`,
            name: pName,
            orderCount: 0,
            lastOrderDate: o.orderedAt ? new Date(o.orderedAt).toLocaleDateString() : 'Today',
            lastRxId: o.prescriptionId || o.id,
            recentStatus: o.status,
          };

          curr.orderCount += 1;
          if (o.orderedAt) {
            curr.lastOrderDate = new Date(o.orderedAt).toLocaleDateString();
          }
          curr.recentStatus = o.status;
          patientMap.set(pName, curr);
        });
      }

      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      console.error('Failed to load pharmacy patients:', err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    window.addEventListener('health_workflow_updated', loadPatients);
    return () => window.removeEventListener('health_workflow_updated', loadPatients);
  }, []);

  return (
    <div className="space-y-6 font-sans relative">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-md border border-slate-200 dark:border-teal-500/20 rounded-3xl p-5 shadow-sm flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Pharmacy Patient Registry
            </h3>
            <p className="text-[11px] font-bold text-slate-500 dark:text-teal-400/80 uppercase tracking-widest">
              Patients connected with {pharmacyName}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20 font-mono">
            {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-[#00a896]" />
          <p className="text-xs font-bold">Loading patient directory...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <User className="w-7 h-7" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            No Patients Linked Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No patient prescription orders have been routed to {pharmacyName} yet. When patients send prescriptions to your pharmacy, they will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {patients.map((pat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/50 transition-all duration-300 group relative overflow-hidden flex flex-col gap-5"
            >
              {/* Subtle inner hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Header: Avatar, Name, Verified */}
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-slate-800/80 border-2 border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-shadow flex items-center justify-center text-teal-400 font-black text-xl font-mono">
                      {pat.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-0.5">Patient #{String(idx + 1).padStart(3, '0')}</span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide leading-none">
                      {pat.name}
                    </h4>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  Verified
                </div>
              </div>

              {/* Data Rows */}
              <div className="space-y-2.5 relative z-10">
                {/* Patient ID Row */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 flex justify-between items-center group-hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Patient ID</span>
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white font-mono tracking-wider">{pat.id}</strong>
                </div>

                {/* Orders Row */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 flex justify-between items-center group-hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pharmacy Orders</span>
                  </div>
                  <strong className="text-xs text-teal-600 dark:text-teal-400 font-bold">{pat.orderCount} <span className="font-medium text-slate-500">Orders</span></strong>
                </div>

                {/* Prescription Row */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 flex justify-between items-center group-hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Prescription ID</span>
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white font-mono tracking-wider">{pat.lastRxId || 'None'}</strong>
                </div>

                {/* Last Updated Row */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 flex justify-between items-center group-hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Last Updated</span>
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-slate-300 font-mono">{pat.lastOrderDate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

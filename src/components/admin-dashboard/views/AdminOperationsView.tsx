import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ShieldCheck, Search, Filter, IndianRupee, Clock, CheckCircle2, 
  Calendar, FileText, ArrowUpRight, Loader2
} from 'lucide-react';
import { pharmacyApi, insuranceApi } from '../../../services/dhrApis';
import { INITIAL_PHARMACY_ORDERS, INITIAL_INSURANCE_POLICIES } from '../../../utils/adminMockStorage';

interface AdminOperationsViewProps {
  type: 'pharmacy' | 'insurance';
}

export const AdminOperationsView: React.FC<AdminOperationsViewProps> = ({ type }) => {
  const isPharmacy = type === 'pharmacy';
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (isPharmacy) {
      pharmacyApi.getPharmacyOrders()
        .then((res) => {
          if (!isMounted) return;
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setOrders(res.data);
          } else {
            setOrders(INITIAL_PHARMACY_ORDERS);
          }
        })
        .catch((err) => {
          console.error('Failed to load pharmacy orders:', err);
          if (isMounted) setOrders(INITIAL_PHARMACY_ORDERS);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      insuranceApi.getPolicies()
        .then((res) => {
          if (!isMounted) return;
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setPolicies(res.data);
          } else {
            setPolicies(INITIAL_INSURANCE_POLICIES);
          }
        })
        .catch((err) => {
          console.error('Failed to load insurance policies:', err);
          if (isMounted) setPolicies(INITIAL_INSURANCE_POLICIES);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isPharmacy]);

  const filteredOrders = orders.filter(o => {
    const term = searchTerm.toLowerCase();
    const orderNo = (o.orderNumber || o.orderId || o.id || '').toLowerCase();
    const patientName = (o.patient?.fullName || o.patientName || '').toLowerCase();
    const pharmaName = (o.pharmacy?.name || o.pharmacyName || '').toLowerCase();
    return orderNo.includes(term) || patientName.includes(term) || pharmaName.includes(term);
  });

  const filteredPolicies = policies.filter(p => {
    const term = searchTerm.toLowerCase();
    const polNo = (p.policyNumber || p.policyId || p.id || '').toLowerCase();
    const patientName = (p.patient?.fullName || p.patientName || '').toLowerCase();
    const provider = (p.providerName || p.provider || '').toLowerCase();
    return polNo.includes(term) || patientName.includes(term) || provider.includes(term);
  });

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl text-white border border-[#009688]/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#00a896]">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {isPharmacy ? 'Pharmacy Orders & Fulfillment Control' : 'Insurance Policy & Cashless Verification'}
          </h2>
          <p className="text-sm text-teal-50/95 font-medium leading-relaxed">
            {isPharmacy
              ? 'Real-time order statuses across dispensaries, e-prescriptions dispatch, and counter deliveries.'
              : 'Audit active patient policy covers, cashless hospital pre-authorization approvals, and claim settlements.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-xl bg-black/20 text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md shadow-xs">
            {isPharmacy ? `${orders.length} Logged Orders` : `${policies.length} Policies Registered`}
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isPharmacy ? "Search order ID, patient, or pharmacy hub..." : "Search policy ID, provider, or patient name..."}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00a896]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className={`w-5 h-5 animate-spin ${isPharmacy ? 'text-teal-500' : 'text-blue-500'}`} />
            <span className="font-medium">Loading {isPharmacy ? 'pharmacy orders' : 'insurance policies'} from database...</span>
          </div>
        ) : (isPharmacy ? filteredOrders.length === 0 : filteredPolicies.length === 0) ? (
          <div className="p-12 text-center text-sm text-slate-500 font-medium">
            No {isPharmacy ? 'pharmacy order records' : 'insurance policy records'} found in the database.
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-200">
                  <th className="py-3.5 px-4 text-left">{isPharmacy ? 'Order ID & Patient' : 'Policy ID & Patient'}</th>
                  <th className="py-3.5 px-3 text-left whitespace-nowrap">{isPharmacy ? 'Prescription / Items' : 'Insurance Provider'}</th>
                  <th className="py-3.5 px-3 text-left">{isPharmacy ? 'Dispensary Hub' : 'Policy Type'}</th>
                  <th className="py-3.5 px-3 text-left whitespace-nowrap">{isPharmacy ? 'Order Value' : 'Coverage Limit'}</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isPharmacy ? (
                  filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs sm:text-sm text-teal-800 dark:text-cyan-200 bg-teal-500/15 dark:bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-500/30 shrink-0 whitespace-nowrap">
                            {o.orderNumber || (o.id ? String(o.id).slice(-8).toUpperCase() : 'ORD-000')}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                              {o.patient?.fullName || 'OPD Patient'}
                            </p>
                            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                              {o.deliveryType || 'Home Delivery'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle font-mono text-sm sm:text-[14px] whitespace-nowrap">
                        {o.prescriptionId ? (
                          <span className="font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800/60 inline-block">
                            Rx: {String(o.prescriptionId).slice(-6).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 font-sans font-medium">Direct Order</span>
                        )}
                      </td>

                      <td className="py-4 px-4 align-middle text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                        {o.pharmacy?.name || 'Central Pharmacy Hub'}
                      </td>

                      <td className="py-4 px-4 align-middle font-mono text-sm sm:text-base text-slate-900 dark:text-white font-bold tracking-tight whitespace-nowrap">
                        ₹{(Number(o.totalAmount) || 0).toFixed(2)}
                      </td>

                      <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wide border shadow-2xs ${
                          o.status === 'DELIVERED' || o.status === 'COMPLETED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : o.status === 'CANCELLED' || o.status === 'DECLINED'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 align-middle text-right font-mono text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredPolicies.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs sm:text-sm text-blue-800 dark:text-cyan-200 bg-blue-500/15 dark:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30 shrink-0 whitespace-nowrap">
                            {p.policyNumber || p.policyId || (p.id ? String(p.id).slice(-8).toUpperCase() : 'POL-000')}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                              {p.patient?.fullName || p.patientName || 'Insured Member'}
                            </p>
                            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                              Valid: {p.validTill ? new Date(p.validTill).toLocaleDateString() : (p.expiryDate || 'Active')}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-middle text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                        {p.providerName || p.provider || 'Universal Health TPA'}
                      </td>

                      <td className="py-4 px-4 align-middle text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {p.policyType || 'Comprehensive Medical'}
                      </td>

                      <td className="py-4 px-4 align-middle font-mono text-sm sm:text-base text-slate-900 dark:text-white font-bold tracking-tight whitespace-nowrap">
                        ₹{(Number(p.coverageLimit || p.coverageAmount) || 500000).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wide border shadow-2xs ${
                          p.status === 'ACTIVE' || p.verificationStatus === 'Active' || p.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}>
                          {p.status || p.verificationStatus || 'Active'}
                        </span>
                      </td>

                      <td className="py-4 px-5 align-middle text-right font-mono text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (p.expiryDate || 'Active')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

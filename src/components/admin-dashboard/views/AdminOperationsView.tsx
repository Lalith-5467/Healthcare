import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ShieldCheck, Search, Filter, IndianRupee, Clock, CheckCircle2, 
  Calendar, FileText, ArrowUpRight
} from 'lucide-react';
import { INITIAL_PHARMACY_ORDERS, INITIAL_INSURANCE_POLICIES, type PharmacyOrderAdminRecord, type InsuranceAdminRecord } from '../../../utils/adminMockStorage';

interface AdminOperationsViewProps {
  type: 'pharmacy' | 'insurance';
}

export const AdminOperationsView: React.FC<AdminOperationsViewProps> = ({ type }) => {
  const isPharmacy = type === 'pharmacy';
  const [searchTerm, setSearchTerm] = useState('');

  const orders = INITIAL_PHARMACY_ORDERS.filter(o => 
    o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const policies = INITIAL_INSURANCE_POLICIES.filter(p => 
    p.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white border shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        isPharmacy 
          ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-slate-700/60' 
          : 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700/60'
      }`}>
        <div className="space-y-2 relative z-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border font-mono ${
            isPharmacy ? 'bg-teal-500/20 text-cyan-300 border-teal-400/30' : 'bg-blue-500/20 text-cyan-300 border-blue-400/30'
          }`}>
            {isPharmacy ? <ShoppingBag className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {isPharmacy ? 'Retail & Inpatient Pharmacy Fulfillment Matrix' : 'IRDAI Health Insurance & TPA Clearinghouse Matrix'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isPharmacy ? 'Pharmacy Orders & Fulfillment Control' : 'Insurance Policy & Cashless Verification'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            {isPharmacy
              ? 'Real-time order statuses across dispensaries, e-prescriptions dispatch, and counter deliveries.'
              : 'Audit active patient policy covers, cashless hospital pre-authorization approvals, and claim settlements.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-white/10 text-white text-xs font-mono font-bold border border-white/15 backdrop-blur-md">
            {isPharmacy ? '426 Licensed Hubs Online' : '320 TPA Desks Active'}
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isPharmacy ? "Search order ID, patient, or pharmacy hub..." : "Search policy ID, provider, or patient name..."}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-4 px-5">{isPharmacy ? 'Order ID & Patient' : 'Policy ID & Patient'}</th>
                <th className="py-4 px-4">{isPharmacy ? 'Rx / Prescription' : 'Insurance Provider'}</th>
                <th className="py-4 px-4">{isPharmacy ? 'Dispensary Hub' : 'Policy Type'}</th>
                <th className="py-4 px-4">{isPharmacy ? 'Total Value' : 'Coverage Limit'}</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
              {isPharmacy ? (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-xs text-teal-600 dark:text-cyan-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {o.orderId}
                        </span>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{o.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{o.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">{o.prescriptionId}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{o.pharmacyName}</td>
                    <td className="py-4 px-4 font-mono font-black text-slate-900 dark:text-white">₹{o.totalAmount}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        o.status === 'Preparing' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse' :
                        'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-[11px] text-slate-400">
                      {o.lastUpdated}
                    </td>
                  </tr>
                ))
              ) : (
                policies.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-xs text-blue-600 dark:text-cyan-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {p.policyId}
                        </span>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{p.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{p.provider}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{p.policyType}</td>
                    <td className="py-4 px-4 font-mono font-black text-slate-900 dark:text-white">₹{(p.coverageAmount / 100000).toFixed(1)} Lakhs</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        p.verificationStatus === 'Verified' || p.verificationStatus === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-[11px] text-slate-400">
                      Expires: {p.expiryDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

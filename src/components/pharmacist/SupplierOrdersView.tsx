import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  FileText, 
  IndianRupee, 
  AlertCircle,
  Building2,
  ChevronRight
} from 'lucide-react';

export const SupplierOrdersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const SUPPLIER_ORDERS = [
    {
      poNumber: 'PO-2026-8941',
      supplier: 'MedLife Wholesale Pharma Distributors',
      itemCount: 42,
      orderDate: '01 Sep 2026',
      expectedDate: '02 Sep 2026',
      totalAmount: 184500,
      status: 'In Transit',
      statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      category: 'Antibiotics & Injectables'
    },
    {
      poNumber: 'PO-2026-8938',
      supplier: 'Sun Pharma Logistics Hub',
      itemCount: 18,
      orderDate: '30 Aug 2026',
      expectedDate: '31 Aug 2026',
      totalAmount: 92400,
      status: 'Received & Verified',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      category: 'Cardiac & Anti-hypertensives'
    },
    {
      poNumber: 'PO-2026-8924',
      supplier: 'Cipla Central Warehouse Hub',
      itemCount: 65,
      orderDate: '28 Aug 2026',
      expectedDate: '29 Aug 2026',
      totalAmount: 245000,
      status: 'Batch Inward Completed',
      statusColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      category: 'Respiratory & Inhalers'
    }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
            <Truck className="w-3.5 h-3.5" /> Wholesaler Supply Chain & Batch Inward
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Purchase Orders & Inventory Restock
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            Track authorized pharmaceutical distributors, generate purchase indents, and verify batch expiry logs.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102">
            <Plus className="w-4 h-4" />
            <span>Generate New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          { label: 'Active POs', value: '3 Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Suppliers On-Record', value: '14 Licensed', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Monthly Inward Total', value: '₹5,21,900', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Discrepancy Flags', value: '0 Disputed', icon: AlertCircle, color: 'text-teal-500', bg: 'bg-teal-500/10' }
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">{s.label}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* PO LIST TABLE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-850/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            Wholesale Inward Orders Stream
          </h3>
          <span className="text-xs text-slate-400 font-mono">3 Records Active</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {SUPPLIER_ORDERS.map((po) => (
            <div key={po.poNumber} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-xs text-teal-600 dark:text-cyan-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20">
                    {po.poNumber}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{po.supplier}</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {po.itemCount} SKUs • {po.category} • Placed on {po.orderDate} (ETA: {po.expectedDate})
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{po.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Invoice Total</p>
                </div>

                <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${po.statusColor}`}>
                  {po.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  IndianRupee, 
  Printer, 
  Search, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  RefreshCw, 
  X, 
  ChevronRight,
  Pill,
  ShoppingBag
} from 'lucide-react';
import { fetchPharmacistOrders, type BackendPharmacyOrder } from '../../services/pharmacyOrderApi';

export const PharmacyBillingView: React.FC = () => {
  const [orders, setOrders] = useState<BackendPharmacyOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<BackendPharmacyOrder | null>(null);

  const loadBillingOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchPharmacistOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load pharmacy billing orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingOrders();
    const handleWorkflowUpdate = () => loadBillingOrders();
    window.addEventListener('health_workflow_updated', handleWorkflowUpdate);
    return () => {
      window.removeEventListener('health_workflow_updated', handleWorkflowUpdate);
    };
  }, []);

  // Compute live financial metrics from database records
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
  const pendingOrders = orders.filter((o) => o.paymentStatus !== 'PAID');
  
  const totalPaidAmount = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalPendingAmount = pendingOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchId = (o.id || '').toLowerCase().includes(q);
    const matchPatient = (o.patient?.fullName || o.patientName || '').toLowerCase().includes(q);
    const matchMethod = (o.paymentMethod || '').toLowerCase().includes(q);
    const matchItems = (o.items || []).some((item: any) =>
      (item.medicineName || item.name || '').toLowerCase().includes(q)
    );
    return matchId || matchPatient || matchMethod || matchItems;
  });

  const handlePrint = (order: BackendPharmacyOrder) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 pb-16 font-sans select-none max-w-7xl mx-auto">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/50 to-white dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-500/20 dark:border-emerald-400/30 font-mono">
            <Receipt className="w-3.5 h-3.5" /> Real Pharmacy Billing & Payment Records
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Pharmacy Billing & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-medium max-w-2xl">
            Live database-backed dispensary invoicing with real itemized medicine prices, verifiable transaction references, and thermal receipts.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={loadBillingOrders}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00a896] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Bills</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW TILES (REAL BACKEND DATA) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          {
            label: 'Total Paid & Settled',
            value: `₹${totalPaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: `${paidOrders.length} Paid Orders`,
            icon: IndianRupee,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Pending Billing',
            value: `₹${totalPendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: `${pendingOrders.length} Orders Awaiting Pay`,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Total Orders Issued',
            value: `${orders.length} Bills`,
            sub: 'All Pharmacy Orders',
            icon: Receipt,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10',
          },
          {
            label: 'Dispensed Invoices',
            value: `${orders.filter((o) => o.status === 'DISPENSED' || o.status === 'COMPLETED').length} Dispensed`,
            sub: 'Handed Over & Verified',
            icon: CheckCircle2,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
          },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 font-mono">{s.label}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">{s.sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by Order ID, Patient Name, Payment Method, or Medicine..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00a896] transition-colors"
        />
      </div>

      {/* INVOICE STREAM TABLE (REAL ORDERS) */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-800/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-500" />
            Customer Dispensing Invoices ({filteredOrders.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-Time Database Records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#00a896]" />
            Loading real pharmacy billing transactions...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            No pharmacy orders match the search criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredOrders.map((ord) => {
              const invoiceNo = `INV-${ord.id.slice(-6).toUpperCase()}`;
              const isPaid = ord.paymentStatus === 'PAID';
              const customerName = ord.patient?.fullName || ord.patientName || 'Patient';
              const itemsCount = ord.items?.length || 0;
              const rawDate = ord.orderedAt || ord.createdAt;
              const dateStr = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today';

              return (
                <div
                  key={ord.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(ord)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                        {invoiceNo}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{customerName}</h4>
                      {isPaid ? (
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          ✓ PAID
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          ● PENDING PAYMENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {itemsCount} {itemsCount === 1 ? 'Medicine' : 'Medicines'} • Method: <strong className="text-slate-900 dark:text-white font-mono">{ord.paymentMethod ? ord.paymentMethod.replace(/_/g, ' ') : 'Pending'}</strong> • {dateStr}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 dark:text-white font-mono">
                        ₹{Number(ord.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">Status: {ord.status}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(ord);
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Print Thermal Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] transition-colors cursor-pointer"
                        title="View Detailed Bill"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED RECEIPT / INVOICE MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* MODAL HEADER */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#00a896]" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Dispensary Receipt #{selectedOrder.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Order ID: {selectedOrder.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* PATIENT & STATUS SUMMARY */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Patient Name:</span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">
                      {selectedOrder.patient?.fullName || selectedOrder.patientName || 'Patient'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Order Status:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Payment Status:</span>
                    <span
                      className={`font-mono font-extrabold px-2 py-0.5 rounded-md text-[10px] ${
                        selectedOrder.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {selectedOrder.paymentStatus} {selectedOrder.paymentMethod ? `(${selectedOrder.paymentMethod.replace(/_/g, ' ')})` : ''}
                    </span>
                  </div>
                  {selectedOrder.paidAt && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Paid At:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">
                        {new Date(selectedOrder.paidAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* ITEMIZED MEDICINES */}
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider font-mono">
                    Prescribed Medicines & Pricing
                  </p>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {(selectedOrder.items || []).map((it: any, idx: number) => {
                      const qty = Number(it.quantity || 1);
                      const unitP = Number(it.unitPrice || 0);
                      const lineSub = Number(it.subtotal || qty * unitP);
                      return (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">
                              {it.medicineName || it.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Qty: {qty} × ₹{unitP.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-mono font-black text-slate-900 dark:text-white">
                            ₹{lineSub.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TOTAL BILL SUMMARY */}
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Medicines Subtotal:</span>
                    <span className="font-mono font-bold">
                      ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Configured Tax / Dispensary Fee:</span>
                    <span className="font-mono font-bold">₹0.00</span>
                  </div>
                  <div className="pt-2 border-t border-teal-500/20 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      Final Payable Total:
                    </span>
                    <span className="text-lg font-black font-mono text-[#00a896] dark:text-cyan-400">
                      ₹{Number(selectedOrder.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => handlePrint(selectedOrder)}
                  className="px-5 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

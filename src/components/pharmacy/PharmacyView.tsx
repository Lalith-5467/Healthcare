import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Truck,
  Pill,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  FileText,
  RotateCcw,
  Compass
} from 'lucide-react';
import type { Pharmacy, StockItem, PharmacyOrder, LinkedPrescription } from './pharmacyData';
import {
  INITIAL_PHARMACIES,
  INITIAL_MEDICINE_STOCK,
  INITIAL_ORDERS,
  INITIAL_PRESCRIPTIONS
} from './pharmacyData';
import { RefillModal } from './RefillModal';
import { PharmacyDetailsDrawer } from './PharmacyDetailsDrawer';
import { OrderTrackingModal } from './OrderTrackingModal';
import { CancelOrderModal } from './CancelOrderModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface PharmacyViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [_loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STATE & LOCALSTORAGE PERSISTENCE
  const [pharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);
  const [stockItems] = useState<StockItem[]>(INITIAL_MEDICINE_STOCK);
  const [orders, setOrders] = useState<PharmacyOrder[]>(INITIAL_ORDERS);
  const [prescriptions] = useState<LinkedPrescription[]>(INITIAL_PRESCRIPTIONS);

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low Stock' | 'Good Stock'>('All');

  // PREFERENCES
  const [preferredPharmacy, setPreferredPharmacy] = useState<string>('HealthPlus Pharmacy');
  const [preferredDelivery, setPreferredDelivery] = useState<'Home Delivery' | 'Pickup'>('Home Delivery');

  // MODALS & DRAWERS
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [preSelectedMedId, setPreSelectedMedId] = useState<string | null>(null);
  const [detailPharmacy, setDetailPharmacy] = useState<Pharmacy | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<PharmacyOrder | null>(null);
  const [cancelOrderTarget, setCancelOrderTarget] = useState<PharmacyOrder | null>(null);

  // Load from localStorage on mount & simulate short skeleton
  useEffect(() => {
    const savedOrders = localStorage.getItem('user_pharmacy_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveOrdersState = (newOrders: PharmacyOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem('user_pharmacy_orders', JSON.stringify(newOrders));
  };

  // ORDER ACTIONS
  const handleCreateOrder = (newOrder: PharmacyOrder) => {
    const updated = [newOrder, ...orders];
    saveOrdersState(updated);
    showToast(`✓ Refill request ${newOrder.id} created!`);
  };

  const handleCancelOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: 'Cancelled' as const };
      }
      return o;
    });
    saveOrdersState(updated);
    showToast('✓ Refill request cancelled');
  };

  // REORDER PREVIOUS ORDER
  const handleReorder = (order: PharmacyOrder) => {
    setPreSelectedMedId(stockItems[0]?.id || null);
    setRefillModalOpen(true);
    showToast(`Reordering items from ${order.id}`);
  };

  // METRICS
  const activeStockCount = stockItems.length;
  const lowStockCount = stockItems.filter((s) => s.stockLevel === 'Low Stock' || s.currentQuantity < 10).length;
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  const lowStockItem = stockItems.find((s) => s.stockLevel === 'Low Stock') || stockItems[0];
  const activePendingOrder = orders.find((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');

  // FILTERED STOCK ITEMS
  const filteredStock = stockItems.filter((s) => {
    if (stockFilter === 'Low Stock' && s.stockLevel !== 'Low Stock') return false;
    if (stockFilter === 'Good Stock' && s.stockLevel !== 'Good Stock') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.medicineName.toLowerCase().includes(q) && !s.dosage.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Pharmacy Orders & Refill Hub"
        subtitle="Manage your medicine refills and keep track of your pharmacy orders."
        badgeText="Digital Refill Hub"
        badgeIcon={<Truck className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => {
                const el = document.getElementById('history-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Clock className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Order History</span>
            </button>

            <button
              onClick={() => {
                setPreSelectedMedId(null);
                setRefillModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Request Refill</span>
            </button>
          </div>
        }
      />

      {/* 2. OVERVIEW SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active Medicines</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{activeStockCount}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Tracked</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-amber-500/30 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Low Stock Alert</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">{lowStockCount}</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">&lt; 10 doses left</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Pending Orders</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{pendingOrdersCount}</span>
            <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold">In transit</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Completed Orders</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{completedOrdersCount}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Delivered</span>
          </div>
        </div>
      </div>

      {/* 3. LOW STOCK ALERT CARD & LIVE ORDER TRACKING BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LOW STOCK ALERT CARD (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Medicine Running Low</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono">
                Low Stock
              </span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{lowStockItem.medicineName} ({lowStockItem.dosage})</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                <strong className="text-amber-700 dark:text-amber-400 font-mono font-extrabold">{lowStockItem.currentQuantity} tablets remaining</strong> • Estimated supply: <strong className="text-slate-900 dark:text-white font-extrabold">{lowStockItem.supplyDays} days</strong>
              </p>
            </div>

            {/* SUPPLY PROGRESS BAR */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-600 dark:text-slate-400">Medicine Supply</span>
                <span className="text-amber-700 dark:text-amber-400 font-mono font-extrabold">20%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '20%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPreSelectedMedId(lowStockItem.id);
              setRefillModalOpen(true);
            }}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Request Refill for {lowStockItem.medicineName}</span>
          </button>
        </div>

        {/* ACTIVE ORDER LIVE TRACKING CARD (RIGHT 6 COLS) */}
        {activePendingOrder ? (
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-cyan-200 dark:border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00a896] dark:text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Active Refill Order</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30">
                  {activePendingOrder.id}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{activePendingOrder.pharmacyName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                  Est. Delivery: <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{activePendingOrder.estimatedDelivery}</strong>
                </p>
              </div>

              {/* MINI ROUTE SIMULATOR */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Pharmacy</span>
                  <span className="text-[#00a896] dark:text-cyan-400 font-extrabold">{activePendingOrder.status}</span>
                  <span>Home</span>
                </div>
                <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${activePendingOrder.progressPercent}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-[#00a896] to-cyan-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setTrackingOrder(activePendingOrder)}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Track Live Delivery Progress</span>
            </button>
          </div>
        ) : (
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Pending Orders</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm font-medium">
                All medicine refills have been delivered. You can request a new refill anytime.
              </p>
            </div>
            <button
              onClick={() => {
                setPreSelectedMedId(null);
                setRefillModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
            >
              Start New Refill Request
            </button>
          </div>
        )}
      </div>

      {/* 4. MEDICINE STOCK GRID & HORIZONTAL PROGRESS BARS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Medicine Stock Levels</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
              {(['All', 'Low Stock', 'Good Stock'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStockFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer font-sans ${
                    stockFilter === st ? 'bg-[#00a896] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STOCK CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStock.map((item) => {
            const percent = Math.round((item.currentQuantity / item.totalQuantity) * 100);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-[#00a896]/40 p-5 rounded-3xl space-y-4 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                      {item.medicineName}
                    </h4>
                    <span className="text-xs font-bold text-[#00a896] dark:text-teal-400">{item.dosage}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.stockLevel === 'Low Stock'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : item.stockLevel === 'Good Stock'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30'
                  }`}>
                    {item.stockLevel}
                  </span>
                </div>

                {/* HORIZONTAL SUPPLY INDICATOR */}
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Stock Level</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{item.currentQuantity} / {item.totalQuantity} {item.unit}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        item.stockLevel === 'Low Stock'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-[#00a896] to-cyan-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Last Refilled:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">{item.lastRefilled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Expected Refill:</span>
                    <span className="font-mono font-bold text-[#00a896] dark:text-cyan-300">{item.nextExpectedRefill}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPreSelectedMedId(item.id);
                    setRefillModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Request Refill</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ORDER HISTORY TABLE WITH REORDER & CANCEL */}
      <div id="history-section" className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Order History</h3>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 font-bold">
            {orders.length} Orders
          </span>
        </div>

        {/* ORDER LOGS LIST */}
        <div className="space-y-3 font-mono">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      : 'bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  {order.date} • <strong className="text-slate-900 dark:text-slate-200 font-extrabold">{order.pharmacyName}</strong> ({order.deliveryMethod})
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Items: {order.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-200 dark:border-slate-700/60 pt-2 sm:pt-0">
                <span className="font-mono font-extrabold text-amber-700 dark:text-amber-400 text-sm">₹{order.totalAmount}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-extrabold transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3 py-1.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. LINKED PRESCRIPTIONS & PHARMACY PREFERENCES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LINKED PRESCRIPTIONS (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00a896] dark:text-teal-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Linked Prescriptions</h3>
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">Medical Records Connection</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {prescriptions.map((p) => (
              <div key={p.id} className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white font-mono">{p.id}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{p.doctorName} • {p.date}</p>
                </div>
                <button
                  onClick={() => onNavigate('records')}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 font-extrabold hover:bg-teal-500/20 transition-colors cursor-pointer"
                >
                  View Prescription
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PREFERRED PHARMACY & PREFERENCES (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pharmacy Preferences</h3>
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">Settings</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-extrabold mb-1.5">Preferred Partner Pharmacy</label>
              <select
                value={preferredPharmacy}
                onChange={(e) => {
                  setPreferredPharmacy(e.target.value);
                  showToast(`Preferred pharmacy updated to ${e.target.value}`);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-[#00a896]"
              >
                {pharmacies.map((pharm) => (
                  <option key={pharm.id} value={pharm.name}>{pharm.name} ({pharm.distanceKm} km)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-extrabold mb-1.5">Default Delivery Method</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Home Delivery', 'Pickup'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setPreferredDelivery(m);
                      showToast(`Delivery preference set to ${m}`);
                    }}
                    className={`py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                      preferredDelivery === m
                        ? 'bg-[#00a896] text-white border-teal-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <RefillModal
        isOpen={refillModalOpen}
        onClose={() => setRefillModalOpen(false)}
        stockItems={stockItems}
        pharmacies={pharmacies}
        initialSelectedMedId={preSelectedMedId}
        onOrderCreated={handleCreateOrder}
      />

      <PharmacyDetailsDrawer
        pharmacy={detailPharmacy}
        isOpen={!!detailPharmacy}
        onClose={() => setDetailPharmacy(null)}
        onSelectPharmacy={(_p) => {
          setRefillModalOpen(true);
        }}
      />

      <OrderTrackingModal
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onOpenCancelModal={(order) => setCancelOrderTarget(order)}
      />

      <CancelOrderModal
        isOpen={!!cancelOrderTarget}
        order={cancelOrderTarget}
        onClose={() => setCancelOrderTarget(null)}
        onConfirmCancel={handleCancelOrder}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Search,
  Filter,
  ArrowDownUp,
  XCircle,
  ShoppingBag
} from 'lucide-react';

export const NurseInventoryView: React.FC = () => {
  const [items, setItems] = useState([
    { id: 'inv-1', name: 'Sterile Gauze Pads (4x4)', category: 'Dressing & Wound Care', stock: 18, minRequired: 10, unit: 'Packs', status: 'In Stock' },
    { id: 'inv-2', name: 'Povidone Iodine Antiseptic (100ml)', category: 'Antiseptics', stock: 4, minRequired: 3, unit: 'Bottles', status: 'In Stock' },
    { id: 'inv-3', name: 'Normal Saline (0.9% NS - 100ml)', category: 'IV Fluids', stock: 2, minRequired: 5, unit: 'IV Bags', status: 'Low Stock' },
    { id: 'inv-4', name: 'IV Cannula (20G Pink & 22G Blue)', category: 'IV Catheters', stock: 12, minRequired: 6, unit: 'Units', status: 'In Stock' },
    { id: 'inv-5', name: 'Disposable Syringes (5ml & 10ml)', category: 'Injection Kits', stock: 15, minRequired: 10, unit: 'Packs', status: 'In Stock' },
    { id: 'inv-6', name: 'Blood Glucose Test Strips', category: 'Diagnostics', stock: 3, minRequired: 10, unit: 'Vials', status: 'Low Stock' },
    { id: 'inv-7', name: 'Sterile Nitrile Gloves (Medium)', category: 'PPE & Barrier', stock: 24, minRequired: 15, unit: 'Pairs', status: 'In Stock' },
    { id: 'inv-8', name: 'Foley Catheter Kit (14Fr / 16Fr)', category: 'Catheterization', stock: 3, minRequired: 2, unit: 'Kits', status: 'In Stock' },
    { id: 'inv-9', name: 'N95 Respirator Masks', category: 'PPE & Barrier', stock: 0, minRequired: 5, unit: 'Boxes', status: 'Out of Stock' }
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const handleRestock = (itemName: string) => {
    setToast(`Restock requisition sent to Apollo Hospital Central Pharmacy for ${itemName}!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRestockAllLow = () => {
    setToast('Bulk restock requisition generated for all low/out-of-stock medical supplies!');
    setTimeout(() => setToast(null), 3000);
  };

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock_asc') return a.stock - b.stock;
      if (sortBy === 'stock_desc') return b.stock - a.stock;
      if (sortBy === 'status') {
        const order: Record<string, number> = { 'Out of Stock': 1, 'Low Stock': 2, 'In Stock': 3 };
        return order[a.status] - order[b.status];
      }
      return 0;
    });
  }, [items, searchQuery, statusFilter, categoryFilter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      inStock: items.filter(i => i.status === 'In Stock').length,
      lowStock: items.filter(i => i.status === 'Low Stock').length,
      outOfStock: items.filter(i => i.status === 'Out of Stock').length
    };
  }, [items]);

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#00a896] text-white font-black text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" /> Clinical Bag Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Medical Kit & Consumables Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Monitor and restock sterile dressings, IV catheters, and diagnostic consumables carried on shift.
          </p>
        </div>

        <button
          onClick={handleRestockAllLow}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-all hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          <span>1-Click Restock All Low Items</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracked', value: stats.total, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'In Stock', value: stats.inStock, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search medical supplies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div className="relative">
            <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="stock_desc">Highest Stock</option>
              <option value="stock_asc">Lowest Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Nurse Sarah’s Mobile Medical Kit (Bag #RN-7701)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">{filteredItems.length} Items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold">
            No inventory items found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredItems.map((item) => {
              const isLow = item.status === 'Low Stock';
              const isOut = item.status === 'Out of Stock';
              
              const progressColor = isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500';
              const progressBgColor = isOut ? 'bg-red-100 dark:bg-red-950/40' : isLow ? 'bg-amber-100 dark:bg-amber-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40';
              const capacity = Math.max(item.minRequired * 2, 10);
              const progressWidth = Math.min(100, Math.max(2, (item.stock / capacity) * 100));

              return (
                <div 
                  key={item.id} 
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-white dark:bg-slate-900
                    ${isOut ? 'border-l-4 border-l-red-500 ring-1 ring-inset ring-red-500/10 hover:bg-red-50/50 dark:hover:bg-red-900/10' : 
                      isLow ? 'border-l-4 border-l-amber-500 ring-1 ring-inset ring-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:bg-amber-50/50 dark:hover:bg-amber-900/10' : 
                      'border-l-4 border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'}
                  `}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${
                      isOut ? 'bg-red-500/15 text-red-600' : isLow ? 'bg-amber-500/15 text-amber-600' : 'bg-teal-500/15 text-[#00a896]'
                    }`}>
                      {isOut ? <XCircle className="w-6 h-6" /> : isLow ? <AlertTriangle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          isOut ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
                          isLow ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">Category: {item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0">
                    <div className="w-32 hidden md:block">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                        <span>Stock Level</span>
                        <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}>{item.stock} / {item.minRequired} Min</span>
                      </div>
                      <div className={`h-1.5 w-full rounded-full overflow-hidden ${progressBgColor}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${progressColor}`} 
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right font-mono min-w-[80px]">
                      <p className={`text-base font-black leading-none ${isOut ? 'text-red-600 dark:text-red-400' : isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.stock} <span className="text-[10px] uppercase font-sans text-slate-500">{item.unit}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleRestock(item.name)}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition-colors cursor-pointer shrink-0 border ${
                        isOut ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-300 dark:border-red-800/50 shadow-sm shadow-red-500/10' :
                        isLow ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/50 shadow-sm shadow-amber-500/10' :
                        'bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-teal-950/40 dark:text-slate-200 dark:hover:text-cyan-300 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      {isOut || isLow ? 'Urgent Restock' : 'Restock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

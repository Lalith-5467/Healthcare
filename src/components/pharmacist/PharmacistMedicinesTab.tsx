import React, { useState } from 'react';
import { Pill, Search, Plus, Filter, CheckCircle2, AlertCircle, TrendingDown } from 'lucide-react';
import { INITIAL_MEDICINE_STOCK } from '../pharmacy/pharmacyData';
import type { StockItem } from '../pharmacy/pharmacyData';

export const PharmacistMedicinesTab: React.FC = () => {
  const [stockList] = useState<StockItem[]>(INITIAL_MEDICINE_STOCK);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Low Stock' | 'Good Stock'>('All');

  const filtered = stockList.filter((item) => {
    if (filter === 'Low Stock' && item.stockLevel !== 'Low Stock' && item.stockLevel !== 'Out of Stock') return false;
    if (filter === 'Good Stock' && item.stockLevel !== 'Good Stock' && item.stockLevel !== 'Medium Stock') return false;
    if (search.trim()) {
      return item.medicineName.toLowerCase().includes(search.toLowerCase()) || item.dosage.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pharmacy Medicine Inventory & Dispensary Stock
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live available quantities across Apollo Central Dispensary.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['All', 'Good Stock', 'Low Stock'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#00a896] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold">
              <th className="p-4 font-mono text-[11px]">#</th>
              <th className="p-4">Medicine & Formulation</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Supply Days</th>
              <th className="p-4">Next Expected Refill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono font-bold text-slate-500 dark:text-slate-400">{idx + 1}</td>
                <td className="p-4">
                  <div className="font-extrabold text-slate-900 dark:text-white">{item.medicineName}</div>
                  <div className="text-[11px] font-mono text-teal-600 dark:text-cyan-400 font-bold">{item.dosage}</div>
                </td>
                <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">
                  {item.currentQuantity} / {item.totalQuantity} {item.unit}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                    item.stockLevel === 'Low Stock' || item.stockLevel === 'Out of Stock'
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                      : item.stockLevel === 'Medium Stock'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  }`}>
                    {item.stockLevel}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                  {item.supplyDays} Days
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">
                  {item.nextExpectedRefill}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

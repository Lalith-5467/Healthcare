import React, { useState, useEffect } from 'react';
import { Pill, Search } from 'lucide-react';
import { getPharmacyStock, type StockItem } from '../pharmacy/pharmacyData';

interface PharmacistMedicinesTabProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    hospitalAffiliation?: string;
    pharmacyId?: string;
  };
}

export const PharmacistMedicinesTab: React.FC<PharmacistMedicinesTabProps> = ({ user }) => {
  const pharmacyId = user?.pharmacyId || localStorage.getItem('pharmacist_pharmacy_id') || undefined;
  const pharmacyName = user?.hospitalAffiliation || localStorage.getItem('pharmacist_pharmacy_name') || 'Dispensary Stock';

  const [stockList, setStockList] = useState<StockItem[]>(() => getPharmacyStock(pharmacyId));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Low Stock' | 'Good Stock'>('All');

  useEffect(() => {
    const handleUpdate = () => {
      setStockList(getPharmacyStock(pharmacyId));
    };
    handleUpdate();
    window.addEventListener('health_workflow_updated', handleUpdate);
    return () => window.removeEventListener('health_workflow_updated', handleUpdate);
  }, [pharmacyId]);

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
              Live available quantities across {pharmacyName}.
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

      {/* STOCK TABLE OR EMPTY STATE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 flex items-center justify-center mx-auto border border-teal-500/20">
              <Pill className="w-7 h-7" />
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {search.trim() ? 'No Matching Formulations Found' : 'No Medicines in Inventory'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {search.trim()
                ? `No stock formulations matched "${search}". Try searching for another name or dosage.`
                : 'Your dispensary stock is currently empty. Formulations and medicines added to your pharmacy stock will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
        )}
      </div>
    </div>
  );
};

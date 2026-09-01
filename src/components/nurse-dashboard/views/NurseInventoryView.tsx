import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Droplets, 
  Sparkles,
  ShieldCheck,
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
    { id: 'inv-8', name: 'Foley Catheter Kit (14Fr / 16Fr)', category: 'Catheterization', stock: 3, minRequired: 2, unit: 'Kits', status: 'In Stock' }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleRestock = (itemName: string) => {
    setToast(`Restock requisition sent to Apollo Hospital Central Pharmacy for ${itemName}!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRestockAllLow = () => {
    setToast('Bulk restock requisition generated for all low-stock medical supplies!');
    setTimeout(() => setToast(null), 3000);
  };

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

      {/* INVENTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Nurse Sarah’s Mobile Medical Kit (Bag #RN-7701)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">8 Items Tracked</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {items.map((item) => {
            const isLow = item.status === 'Low Stock';

            return (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                    isLow ? 'bg-amber-500/15 text-amber-600' : 'bg-teal-500/15 text-[#00a896]'
                  }`}>
                    {isLow ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isLow ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Category: {item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end text-xs">
                  <div className="text-right font-mono">
                    <p className="text-base font-black text-slate-900 dark:text-white leading-none">
                      {item.stock} {item.unit}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">Min: {item.minRequired} {item.unit}</span>
                  </div>

                  <button
                    onClick={() => handleRestock(item.name)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/40 text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-cyan-300 font-black text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Request Restock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

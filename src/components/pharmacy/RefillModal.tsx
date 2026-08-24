import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Truck, MapPin, Star, Plus, Minus, Check, ArrowRight, ArrowLeft, Sparkles, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Pharmacy, StockItem, PharmacyOrder, OrderItem } from './pharmacyData';
import { INITIAL_PHARMACIES } from './pharmacyData';
import { PharmacyFilterDrawer } from './PharmacyFilterDrawer';
import type { PharmacyFilterState } from './PharmacyFilterDrawer';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  pharmacies?: Pharmacy[];
  initialSelectedMedId?: string | null;
  onOrderCreated: (order: PharmacyOrder) => void;
}

export const RefillModal: React.FC<RefillModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  pharmacies = INITIAL_PHARMACIES,
  initialSelectedMedId,
  onOrderCreated,
}) => {
  // STEPS 1-5
  const [step, setStep] = useState<number>(1);

  // STEP 1: SELECTED MEDICINES
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  
  // STEP 2: QUANTITIES { medId: qty }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // STEP 3: SELECTED PHARMACY
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(pharmacies[0]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<PharmacyFilterState>({
    distance: 'Any',
    rating: 'Any',
    delivery: 'All',
    openNow: false
  });

  // STEP 4: DELIVERY METHOD
  const [deliveryMethod, setDeliveryMethod] = useState<'Home Delivery' | 'Pickup'>('Home Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai, TN');

  // CONFIRMATION RECEIPT MODAL
  const [placingOrder, setPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<PharmacyOrder | null>(null);

  // Sync initialSelectedMedId
  React.useEffect(() => {
    if (initialSelectedMedId) {
      setSelectedMedIds([initialSelectedMedId]);
      setQuantities({ [initialSelectedMedId]: 30 });
    } else if (stockItems.length > 0 && selectedMedIds.length === 0) {
      setSelectedMedIds([stockItems[0].id]);
      setQuantities({ [stockItems[0].id]: 30 });
    }
  }, [initialSelectedMedId, stockItems, isOpen]);

  if (!isOpen) return null;

  const toggleSelectMedicine = (id: string) => {
    if (selectedMedIds.includes(id)) {
      setSelectedMedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedMedIds((prev) => [...prev, id]);
      if (!quantities[id]) {
        setQuantities((prev) => ({ ...prev, [id]: 30 }));
      }
    }
  };

  const handleQtyChange = (id: string, delta: number) => {
    const current = quantities[id] || 30;
    const next = Math.max(1, current + delta);
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  // Filtered pharmacies
  const filteredPharmacies = pharmacies.filter((p) => {
    if (filters.distance !== 'Any' && p.distanceKm > parseFloat(filters.distance)) return false;
    if (filters.rating !== 'Any' && p.rating < parseFloat(filters.rating)) return false;
    if (filters.delivery === 'Delivery' && !p.deliveryAvailable) return false;
    if (filters.delivery === 'Pickup' && !p.pickupAvailable) return false;
    return true;
  });

  // Calculate prices
  const orderItems: OrderItem[] = selectedMedIds.map((id) => {
    const med = stockItems.find((s) => s.id === id);
    const qty = quantities[id] || 30;
    const unitPrice = 8;
    return {
      name: med ? med.medicineName : 'Medicine',
      dosage: med ? med.dosage : '500 mg',
      quantity: qty,
      unitPrice
    };
  });

  const totalAmount = orderItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    const newOrder: PharmacyOrder = {
      id: `RX-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pharmacyName: selectedPharmacy.name,
      pharmacyId: selectedPharmacy.id,
      items: orderItems,
      deliveryMethod,
      deliveryAddress,
      totalAmount,
      status: 'Order Received',
      estimatedDelivery: 'Today, 10:45 AM – 11:15 AM',
      progressPercent: 15
    };

    setTimeout(() => {
      onOrderCreated(newOrder);
      setCreatedOrder(newOrder);
      setPlacingOrder(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* CONFIRMATION RECEIPT SCREEN */}
      {createdOrder ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl my-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold font-mono text-emerald-400 uppercase tracking-wider">
              {createdOrder.id}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">Refill Request Created!</h3>
            <p className="text-xs text-slate-300 mt-1">
              Your mock refill request has been transmitted to <strong className="text-white">{createdOrder.pharmacyName}</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Order Status:</span>
              <span className="font-bold text-[#00a896]">{createdOrder.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery Option:</span>
              <span className="font-semibold text-white">{createdOrder.deliveryMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Mock Cost:</span>
              <span className="font-mono font-bold text-amber-400">₹{createdOrder.totalAmount}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md cursor-pointer"
            >
              Track Order Status
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Step {step} of 5</span>
                <h3 className="text-lg font-extrabold text-white">
                  {step === 1 && 'Select Medicines for Refill'}
                  {step === 2 && 'Adjust Refill Quantities'}
                  {step === 3 && 'Choose Partner Pharmacy'}
                  {step === 4 && 'Select Delivery Method'}
                  {step === 5 && 'Order Summary & Review'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: SELECT MEDICINES */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">Choose one or more active medicines to include in this refill request:</p>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {stockItems.map((med) => {
                  const isChecked = selectedMedIds.includes(med.id);
                  return (
                    <div
                      key={med.id}
                      onClick={() => toggleSelectMedicine(med.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-teal-500/10 border-teal-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-[#00a896] border-teal-400 text-white' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{med.medicineName}</h4>
                          <span className="text-[11px] text-slate-400">{med.dosage} • {med.currentQuantity} {med.unit} left</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        med.stockLevel === 'Low Stock' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {med.stockLevel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  disabled={selectedMedIds.length === 0}
                  onClick={() => setStep(2)}
                  className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Select Quantities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITIES */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">Set refill pack quantities for selected medicines:</p>
              <div className="space-y-3">
                {selectedMedIds.map((id) => {
                  const med = stockItems.find((s) => s.id === id);
                  const qty = quantities[id] || 30;
                  return (
                    <div key={id} className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{med?.medicineName}</h4>
                        <span className="text-[11px] text-teal-400 font-semibold">{med?.dosage}</span>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(id, -10)}
                          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs text-white min-w-[50px] text-center">
                          {qty} {med?.unit || 'tablets'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(id, 10)}
                          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Select Pharmacy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT PHARMACY */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">Choose a partner pharmacy to process your refill:</p>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(true)}
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Filter Pharmacies
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredPharmacies.map((p) => {
                  const isSelected = selectedPharmacy.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPharmacy(p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-teal-500/10 border-teal-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 text-teal-400 flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white">{p.name}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="text-amber-400 font-bold">★ {p.rating}</span>
                            <span>•</span>
                            <span>{p.distanceKm} km</span>
                            <span>•</span>
                            <span className="text-cyan-300">{p.deliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        isSelected ? 'bg-[#00a896] text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Delivery Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DELIVERY METHOD */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">Choose how you want to receive your medicine refill:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Home Delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    deliveryMethod === 'Home Delivery'
                      ? 'bg-teal-500/10 border-teal-400 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Home Delivery</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Delivered directly to your saved address</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                    deliveryMethod === 'Pickup'
                      ? 'bg-teal-500/10 border-teal-400 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Self Pickup</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Collect from {selectedPharmacy.name}</p>
                  </div>
                </button>
              </div>

              {deliveryMethod === 'Home Delivery' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Saved Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00a896]"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl space-y-3 text-xs">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-slate-700 pb-2">
                  Refill Order Summary
                </h4>
                <div className="space-y-1.5">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300">
                      <span>{item.name} ({item.dosage}) × {item.quantity}</span>
                      <span className="font-mono text-white">₹{item.quantity * item.unitPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-slate-400">
                  <span>Partner Pharmacy:</span>
                  <span className="font-bold text-white">{selectedPharmacy.name}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-slate-400">
                  <span>Delivery Method:</span>
                  <span className="font-semibold text-cyan-300">{deliveryMethod}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-slate-400">
                  <span>Estimated Time:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedPharmacy.deliveryTime}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-white font-extrabold text-sm">
                  <span>Total Mock Cost:</span>
                  <span className="font-mono text-amber-400 text-base">₹{totalAmount}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={handlePlaceOrder}
                  className="py-3 px-6 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {placingOrder ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Creating Refill Request...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Place Mock Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <PharmacyFilterDrawer
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            filters={filters}
            onApplyFilters={(f) => setFilters(f)}
            onResetFilters={() => setFilters({ distance: 'Any', rating: 'Any', delivery: 'All', openNow: false })}
          />
        </div>
      )}
    </div>
  );
};

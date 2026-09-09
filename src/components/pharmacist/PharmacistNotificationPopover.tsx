import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  Pill,
  FileText,
  AlertTriangle,
  Truck,
  ShieldCheck,
  ExternalLink,
  X,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { getPharmacyOrders } from '../../utils/healthWorkflowStorage';

export interface PharmacistNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'prescription' | 'order' | 'stock' | 'safety' | 'delivery';
  time: string;
  isRead: boolean;
  isUrgent?: boolean;
  actionNav?: string;
  actionLabel?: string;
}

const INITIAL_PHARMACIST_NOTIFICATIONS: PharmacistNotificationItem[] = [
  {
    id: 'pnotif-1',
    title: 'New E-Prescription Uploaded',
    message: 'Dr. Akshara issued a new Rx with 4 medicines awaiting clinical verification.',
    category: 'prescription',
    time: '2 mins ago',
    isRead: false,
    isUrgent: true,
    actionNav: 'orders',
    actionLabel: 'Verify & Dispense'
  },
  {
    id: 'pnotif-2',
    title: 'Order Dispatched for Delivery',
    message: 'Order #RX-2026-00482 (Ragul Kumar) is out for home delivery to Guindy.',
    category: 'delivery',
    time: '18 mins ago',
    isRead: false,
    actionNav: 'orders',
    actionLabel: 'Track Delivery'
  },
  {
    id: 'pnotif-3',
    title: 'Low Inventory Alert: Amoxicillin 500mg',
    message: 'Current stock below minimum threshold (4 strips remaining in Central Dispensary).',
    category: 'stock',
    time: '45 mins ago',
    isRead: false,
    isUrgent: true,
    actionNav: 'medicines',
    actionLabel: 'Restock PO'
  },
  {
    id: 'pnotif-4',
    title: 'AI Drug Interaction Verified',
    message: 'Interaction check completed for Patient #9104: No lethal contraindications detected.',
    category: 'safety',
    time: '2 hours ago',
    isRead: true,
    actionNav: 'drug-interaction',
    actionLabel: 'View Radar'
  },
  {
    id: 'pnotif-5',
    title: 'Monthly Schedule H Drug Log Synced',
    message: 'Prescription register compliance audit logged with ABDM portal.',
    category: 'safety',
    time: 'Yesterday',
    isRead: true,
    actionNav: 'schedule-audit',
    actionLabel: 'View Register'
  }
];

interface PharmacistNotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (navId: string) => void;
}

export const PharmacistNotificationPopover: React.FC<PharmacistNotificationPopoverProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<PharmacistNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pharmacist_notifications_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PHARMACIST_NOTIFICATIONS;
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  // Sync with real incoming orders
  useEffect(() => {
    const orders = getPharmacyOrders();
    const pendingOrders = orders.filter((o) => (o.status as string) === 'Pending Pharmacist Verification' || (o.status as string) === 'PENDING');
    if (pendingOrders.length > 0) {
      setNotifications((prev) => {
        const hasLatestPending = prev.some((n) => n.id === `order-${pendingOrders[0].id}`);
        if (!hasLatestPending) {
          const newNotif: PharmacistNotificationItem = {
            id: `order-${pendingOrders[0].id}`,
            title: `New Prescription Order #${pendingOrders[0].id.slice(-6)}`,
            message: `${pendingOrders[0].patientName || 'Patient'} submitted an order with ${pendingOrders[0].items?.length || 3} prescribed items.`,
            category: 'order',
            time: 'Just now',
            isRead: false,
            isUrgent: true,
            actionNav: 'orders',
            actionLabel: 'Review Order'
          };
          const updated = [newNotif, ...prev];
          localStorage.setItem('pharmacist_notifications_list', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [isOpen]);

  const saveNotifications = (newNotifs: PharmacistNotificationItem[]) => {
    setNotifications(newNotifs);
    try {
      localStorage.setItem('pharmacist_notifications_list', JSON.stringify(newNotifs));
    } catch {}
  };

  const handleMarkRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    saveNotifications([]);
  };

  const handleRemoveSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const handleActionClick = (notif: PharmacistNotificationItem) => {
    handleMarkRead(notif.id);
    onClose();
    if (notif.actionNav) {
      onNavigate(notif.actionNav);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'urgent') return n.isUrgent;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryBadge = (category: PharmacistNotificationItem['category']) => {
    switch (category) {
      case 'prescription':
        return { icon: FileText, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      case 'order':
        return { icon: ShoppingBag, color: 'text-[#00a896] bg-teal-500/10 border-teal-500/20' };
      case 'stock':
        return { icon: Pill, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      case 'delivery':
        return { icon: Truck, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' };
      case 'safety':
        return { icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
      default:
        return { icon: Bell, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 cursor-default" 
        onClick={onClose} 
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-14 w-84 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden font-sans text-xs"
        >
        {/* HEADER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 to-transparent dark:from-teal-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a896] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Dispensary Alerts</h3>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-[#00a896] dark:text-cyan-300">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} actionable alert${unreadCount > 1 ? 's' : ''}` : 'Dispensary queue up to date'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60 font-mono">
          <div className="flex items-center gap-1">
            {(['all', 'unread', 'urgent'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#00a896] text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f} {f === 'all' ? `(${notifications.length})` : f === 'unread' ? `(${unreadCount})` : ''}
              </button>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="text-[10px] text-teal-600 dark:text-cyan-400 hover:underline cursor-pointer flex items-center gap-1 font-bold"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Read All</span>
              </button>
              <button
                onClick={handleClearAll}
                title="Clear all alerts"
                className="text-[10px] text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5 font-bold"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <ShieldCheck className="w-8 h-8 mx-auto text-[#00a896] opacity-60" />
              <p className="font-bold text-xs">No alerts found</p>
              <p className="text-[10px]">All prescriptions and pharmacy orders are cleared.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const badge = getCategoryBadge(item.category);
              const Icon = badge.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleActionClick(item)}
                  className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !item.isRead ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.isUrgent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-500 text-white font-mono">
                            Urgent
                          </span>
                        )}
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#00a896] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    {item.actionLabel && (
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(item);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-black text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer"
                        >
                          <span>{item.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveSingle(item.id, e)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
          <button
            onClick={() => {
              onClose();
              onNavigate('orders');
            }}
            className="text-xs font-black text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
          >
            <span>View Full Dispensary Workstation Orders</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

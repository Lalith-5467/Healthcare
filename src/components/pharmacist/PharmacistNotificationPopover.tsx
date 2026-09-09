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
import { notificationApi } from '../../services/dhrApis';

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
  orderId?: string;
}



const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'Just now';
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface PharmacistNotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (navId: string, orderId?: string) => void;
}

export const PharmacistNotificationPopover: React.FC<PharmacistNotificationPopoverProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<PharmacistNotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res && res.data) {
        const mapped: PharmacistNotificationItem[] = res.data.map((n: any) => {
          let orderId: string | undefined = undefined;
          if (n.relatedModule && n.relatedModule.startsWith('orders:')) {
            orderId = n.relatedModule.replace('orders:', '');
          } else {
            const match = n.message?.match(/Order #([a-zA-Z0-9_-]+)/i);
            if (match && match[1]) {
              orderId = match[1];
            }
          }

          const isOrders = n.relatedModule?.startsWith('orders') || n.title?.toLowerCase().includes('order') || n.category?.toLowerCase() === 'pharmacy';

          return {
            id: n.id,
            title: n.title,
            message: n.message,
            category: (n.category?.toLowerCase() || 'order') as any,
            time: formatTimeAgo(n.createdAt),
            isRead: n.isRead,
            isUrgent: n.type === 'ALERT' || n.title.toLowerCase().includes('urgent'),
            actionNav: isOrders ? 'orders' : n.relatedModule || 'orders',
            actionLabel: 'View Details',
            orderId,
          };
        });
        setNotifications(mapped);
        return;
      }
    } catch {}
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener('notifications_updated', handleUpdate);
    return () => window.removeEventListener('notifications_updated', handleUpdate);
  }, [isOpen]);

  const handleMarkRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationApi.markAsRead(id).catch(() => {});
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleMarkAllRead = () => {
    notificationApi.markAllAsRead().catch(() => {});
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleClearAll = () => {
    notificationApi.markAllAsRead().catch(() => {});
    setNotifications([]);
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleRemoveSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
    } catch {
      notificationApi.markAsRead(id).catch(() => {});
    }
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleActionClick = (notif: PharmacistNotificationItem) => {
    handleMarkRead(notif.id);
    onClose();
    if (onNavigate) {
      onNavigate(notif.actionNav || 'orders', notif.orderId);
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
      <AnimatePresence>
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-xs max-h-[85vh] flex flex-col"
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
    </div>
  </AnimatePresence>
  </>
);
};

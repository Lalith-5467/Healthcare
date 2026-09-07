import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconBell, 
  IconLogout, 
  IconMenu2,
  IconHeartbeat
} from '@tabler/icons-react';
import { NURSING_MOCK_DATA } from './mockData';

interface NurseTopbarProps {
  onLogout: () => void;
  onMobileMenuToggle: () => void;
}

export const NurseTopbar: React.FC<NurseTopbarProps> = ({ onLogout, onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = NURSING_MOCK_DATA.notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-[#1b1e27] border-b border-[#eceef1] dark:border-slate-800 transition-colors duration-300 z-40 sticky top-0">
      
      {/* Left section: Mobile menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <IconMenu2 className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4">
          {/* Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-[#e04848] border border-rose-100 dark:border-rose-900/50">
            <IconHeartbeat className="w-3.5 h-3.5" stroke={2.5} />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Nurse Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Notifications, Profile, Logout */}
      <div className="flex items-center gap-3 sm:gap-6 relative">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-[#e04848] rounded-full transition-colors relative"
          >
            <IconBell className="w-5 h-5" stroke={2} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#e04848] rounded-full border-2 border-white dark:border-[#1b1e27]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1b1e27] rounded-2xl shadow-xl border border-[#eceef1] dark:border-slate-800 z-50 overflow-hidden origin-top-right"
                >
                  <div className="p-4 border-b border-[#eceef1] dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                    <span className="text-[10px] font-black uppercase text-[#e04848] bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {NURSING_MOCK_DATA.notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-[#eceef1] dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#12141a] transition-colors cursor-pointer ${notif.unread ? 'bg-slate-50/50 dark:bg-[#12141a]/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                            notif.type === 'urgent' ? 'bg-[#e04848]' :
                            notif.type === 'warning' ? 'bg-[#f59e0b]' :
                            'bg-[#10b981]'
                          }`} />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{notif.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 leading-relaxed">{notif.desc}</p>
                            <span className="text-[10px] font-semibold text-slate-400">{notif.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full p-3 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#e04848] transition-colors bg-slate-50 dark:bg-[#12141a]"
                  >
                    View All Notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Chip */}
        <div className="hidden sm:flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#e04848] flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            Nurse shivu
          </span>
        </div>

        <div className="w-px h-6 bg-[#eceef1] dark:bg-slate-800 hidden sm:block"></div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#e04848] transition-colors"
        >
          <IconLogout className="w-4 h-4" stroke={2} /> Logout
        </button>

      </div>
    </header>
  );
};

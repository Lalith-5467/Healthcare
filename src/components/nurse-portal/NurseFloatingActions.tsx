import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconPlus, 
  IconPhoneCall, 
  IconMapPin, 
  IconMicrophone 
} from '@tabler/icons-react';

export const NurseFloatingActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ACTIONS = [
    { id: 'call', label: 'Call Patient', icon: IconPhoneCall, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'nav', label: 'Navigate to Visit', icon: IconMapPin, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'voice', label: 'Voice Care Note', icon: IconMicrophone, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="flex flex-col gap-2 items-end mb-2"
          >
            {ACTIONS.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white dark:bg-[#1b1e27] pr-2 pl-4 py-2 rounded-full shadow-lg border border-[#eceef1] dark:border-slate-800"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {action.label}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.bg} dark:bg-slate-800`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-full flex items-center justify-center shadow-lg shadow-teal-900/40 relative"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <IconPlus className="w-6 h-6" stroke={2.5} />
        </motion.div>
      </motion.button>
    </div>
  );
};

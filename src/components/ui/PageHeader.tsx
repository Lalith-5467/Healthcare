import React from 'react';
import { motion } from 'framer-motion';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  rightElement,
  className = ''
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80 ${className}`}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words"
          >
            {title}
          </motion.h1>

          {badgeText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="px-3 py-1 text-xs font-bold uppercase bg-gradient-to-r from-[#00a896]/20 to-cyan-500/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 flex items-center gap-1.5 shadow-sm font-mono shrink-0"
            >
              {badgeIcon}
              <span>{badgeText}</span>
            </motion.span>
          )}
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {rightElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="flex items-center gap-3 shrink-0 self-start md:self-auto"
        >
          {rightElement}
        </motion.div>
      )}
    </motion.header>
  );
};

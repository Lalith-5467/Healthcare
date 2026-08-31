import React from 'react';
import { motion } from 'framer-motion';

export const InsurancePartners: React.FC = () => {
  const partners = [
    { name: 'aetna', color: 'text-purple-600' },
    { name: 'Cigna', color: 'text-teal-600' },
    { name: 'United Healthcare', color: 'text-blue-700' },
    { name: 'BlueCross BlueShield', color: 'text-sky-600' },
    { name: 'HUMANA', color: 'text-emerald-600' },
    { name: 'care health', color: 'text-amber-600' },
  ];

  return (
    <section id="insurance" className="py-12 bg-slate-50 dark:bg-[#0f172a] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Trusted Cashless Facilities
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            Our Insurance Partners
          </h3>
        </div>

        {/* LOGOS BANNER */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-opacity">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tight text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              <span className={`w-3 h-3 rounded-full bg-current ${partner.color}`} />
              <span>{partner.name}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

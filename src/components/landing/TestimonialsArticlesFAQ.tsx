import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ArrowRight, Plus, Minus, Calendar } from 'lucide-react';

export const TestimonialsArticlesFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const articles = [
    {
      id: 'art-1',
      title: '10 Tips for a Healthy Heart',
      date: 'May 10, 2024',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'art-2',
      title: 'How to Boost Your Immunity Naturally',
      date: 'May 18, 2024',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'art-3',
      title: 'Understanding Dental Care for Kids',
      date: 'May 15, 2024',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How can I book an appointment?',
      a: 'You can book an appointment directly through our online form above, call our 24/7 hotline at +1 234 567 8900, or visit our reception desk in person.',
    },
    {
      q: 'What are your hospital timings?',
      a: 'Our Outpatient Department (OPD) operates Monday to Friday from 8:00 AM to 8:00 PM, and Saturday to Sunday from 9:00 AM to 1:00 PM. Emergency care is open 24/7.',
    },
    {
      q: 'Do you accept health insurance?',
      a: 'Yes, MediCare accepts major insurance providers including Aetna, Cigna, United Healthcare, Blue Cross Blue Shield, Humana, and Care Health.',
    },
    {
      q: 'How can I contact emergency services?',
      a: 'In case of an emergency, call our dedicated 24/7 emergency hotline at +1 234 567 8900 immediately for instant ambulance dispatch and trauma response.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-[#0b1120] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: PATIENT TESTIMONIALS */}
          <motion.div 
            className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between min-h-[380px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400">
                Patient & Family Experience
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 mb-6">
                What Patients Say
              </h3>

              <Quote className="w-7 h-7 text-[#0f3980] dark:text-cyan-400 opacity-60 mb-2" />
              
              <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                "Sharing blood reports with my cardiologist via time-bound QR PIN saved so much time during my consultation. The medicine reminders keep my daily doses on track effortlessly."
              </p>
            </div>

            <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="w-11 h-11 rounded-full bg-[#0f3980] text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                JW
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">John Willson</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Patient & Caregiver User</p>
                <div className="flex text-amber-400 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2: LATEST HEALTH ARTICLES */}
          <motion.div 
            className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 min-h-[380px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Latest Health Articles
              </h3>
              <a href="#" className="text-xs font-bold text-[#00a896] dark:text-cyan-400 hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              {articles.map((art) => (
                <div 
                  key={art.id} 
                  className="group flex items-center gap-3.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-all cursor-pointer"
                >
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0f3980] dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="w-3 h-3" /> {art.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* COLUMN 3: FREQUENTLY ASKED QUESTIONS */}
          <motion.div 
            className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 min-h-[380px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index} 
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-3.5 text-left text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2"
                    >
                      <span>{faq.q}</span>
                      <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#00a896] shrink-0">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
